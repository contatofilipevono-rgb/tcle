/**
 * DentalSafe AI — Endpoint Receptor de Webhook da Kiwify
 * 
 * Este arquivo pode ser usado diretamente como:
 * 1. Uma Rota de API do Next.js (app/api/webhooks/kiwify/route.ts)
 * 2. Uma Supabase Edge Function (supabase/functions/kiwify-webhook/index.ts)
 * 3. Uma rota Express/Node.js tradicional
 * 
 * FLUXO DE VENDA AUTOMÁTICA:
 * 1. Dentista compra na Kiwify (PIX/Cartão).
 * 2. Kiwify dispara este webhook com o evento "order_approved".
 * 3. O script cria o usuário no Supabase Auth via Service Role Key (Admin).
 * 4. O Supabase envia um e-mail com link seguro para o dentista definir a senha.
 * 5. O registro é salvo na tabela `subscriptions` com status 'active'.
 * 6. Em caso de reembolso ou cancelamento, o status é alterado para 'refunded' ou 'canceled'.
 */

import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente (defina no painel da Vercel ou .env)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://SEU-PROJETO.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'SUA_SERVICE_ROLE_KEY_AQUI';
const KIWIFY_WEBHOOK_SECRET = process.env.KIWIFY_WEBHOOK_SECRET || ''; // Opcional: token para validar autenticidade

// Inicializa cliente com privilégios de Administrador
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('[Kiwify Webhook] Evento recebido:', body.webhook_event_type || body.order_status);

    const eventType = body.webhook_event_type || (body.order_status === 'paid' ? 'order_approved' : body.order_status);
    const orderId = body.order_id || body.order_ref;
    const customer = body.Customer || body.customer || {};
    const email = (customer.email || '').trim().toLowerCase();
    const fullName = customer.full_name || customer.name || 'Cirurgião-Dentista';
    const cpf = customer.CPF || customer.cpf || '';
    const mobile = customer.mobile || customer.phone || '';
    const product = body.Product || body.product || {};
    const productName = product.product_name || 'DentalSafe AI Pro';

    if (!email) {
      return new Response(JSON.stringify({ error: 'E-mail do cliente não fornecido no payload' }), { status: 400 });
    }

    // =========================================================================
    // 1. COMPRA APROVADA (order_approved)
    // =========================================================================
    if (eventType === 'order_approved' || body.order_status === 'paid') {
      console.log(`[Kiwify Webhook] Processando compra aprovada para ${email}...`);

      let userId = null;
      const { data: userList, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
      
      const existingUser = (userList?.users || []).find(u => u.email?.toLowerCase() === email);

      if (existingUser) {
        userId = existingUser.id;
        console.log(`[Kiwify Webhook] Usuário já existente: ${userId}`);
      } else {
        const tempPassword = 'DS-' + Math.random().toString(36).substring(2, 10) + '!2026';
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            cpf: cpf,
            phone: mobile,
            kiwify_order_id: orderId,
            origin: 'kiwify'
          }
        });

        if (createErr) {
          console.error('[Kiwify Webhook] Erro ao criar usuário no Supabase Auth:', createErr);
          return new Response(JSON.stringify({ error: createErr.message }), { status: 500 });
        }

        userId = newUser.user.id;
        console.log(`[Kiwify Webhook] Novo usuário criado com sucesso: ${userId}`);

        await supabaseAdmin.auth.resetPasswordForEmail(email, {
          redirectTo: `${req.headers.get('origin') || 'https://dentalsafe-ai.vercel.app'}/#reset-password`
        });
      }

      const { error: subErr } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          kiwify_order_id: orderId,
          user_id: userId,
          customer_email: email,
          customer_name: fullName,
          customer_cpf: cpf,
          customer_phone: mobile,
          status: 'active',
          plan_name: productName,
          amount_cents: body.order_amount ? Math.round(body.order_amount * 100) : 0,
          payment_method: body.payment_method || 'kiwify',
          updated_at: new Date().toISOString()
        }, { onConflict: 'kiwify_order_id' });

      if (subErr) {
        console.error('[Kiwify Webhook] Erro ao salvar registro de subscription:', subErr);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Acesso provisionado com sucesso.',
        user_id: userId,
        email: email
      }), { status: 200 });
    }

    // =========================================================================
    // 2. CANCELAMENTO DE ASSINATURA (subscription_canceled)
    // =========================================================================
    if (eventType === 'subscription_canceled') {
      console.log(`[Kiwify Webhook] Cancelamento de assinatura recebido para: ${email}`);

      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('customer_email', email);

      return new Response(JSON.stringify({ success: true, message: 'Assinatura marcada como cancelada.' }), { status: 200 });
    }

    // =========================================================================
    // 3. REEMBOLSO / CHARGEBACK (refunded / chargeback)
    // =========================================================================
    if (eventType === 'refunded' || eventType === 'chargeback') {
      console.log(`[Kiwify Webhook] Reembolso/Chargeback recebido para: ${email}. Revogando acesso.`);

      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'refunded', updated_at: new Date().toISOString() })
        .eq('customer_email', email);

      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const targetUser = (userList?.users || []).find(u => u.email?.toLowerCase() === email);
      if (targetUser) {
        await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
          ban_duration: '876000h'
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Acesso revogado por reembolso.' }), { status: 200 });
    }

    return new Response(JSON.stringify({ received: true, note: 'Evento processado.' }), { status: 200 });

  } catch (err) {
    console.error('[Kiwify Webhook Error]:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
