# Guia de Publicação, GitHub, Supabase e Vendas no Kiwify
## DentalSafe AI — Plataforma SaaS de TCLE Odontológico Personalizado

Este guia foi elaborado para orientar você, passo a passo, em como colocar o **DentalSafe AI** no ar, conectá-lo ao **GitHub**, ao **Supabase** e começar a **vender assinaturas de forma 100% automatizada no Kiwify**.

---

## 1. O que foi Implementado e suas Diferenciações Comerciais

1. **Odontograma Interativo Clicável (Notação FDI):**
   - O dentista clica diretamente nos dentes (18 ao 48) divididos em 4 quadrantes anatômicos.
   - Botões de atalho rápido: *Sisos (18, 28, 38, 48), Anteriores Superiores (13–23), Anteriores Inferiores (33–43), Arcada Superior, Arcada Inferior, Todos os Dentes e Limpar*.
   - Sincronização automática e humanizada da região no termo legal.
2. **Chips de Condições Sistêmicas e Medicamentos Críticos:**
   - **Bisfosfonatos / Alendronato (Fosamax), Zoledronato, Denosumabe:** Cláusula com alerta severo de **MRONJ (Osteonecrose dos Maxilares)**.
   - **Diabetes Mellitus:** Cláusulas sobre atraso de cicatrização e exigência de controle de HbA1c.
   - **Cardiopatias & Hipertensão:** Profilaxia de Endocardite Infecciosa (AHA) e controle de anestésicos locais.
   - **HIV / Imunossupressão:** Proteção de dados e suporte profilático com base em carga viral.
   - **Ansiedade Odontológica / Fobia / Pânico:** Cláusula de manejo de estresse, síncope vasovagal e pré-medicação ansiolítica.
   - **Anticoagulantes / AAS / Warfarina / Xarelto:** Alerta de hemorragia e INR.
3. **Assinatura Digital Touchscreen na Tela:**
   - O paciente ou o cirurgião-dentista pode assinar com o dedo ou caneta stylus diretamente no tablet ou smartphone.
   - O documento oficial recebe a imagem da assinatura com carimbo eletrônico de autenticidade (data, hora, IP e hash de integridade) conforme a **Lei nº 14.063/2020** e **MP 2.200-2/2001**.
4. **Motor de Vendas Kiwify:**
   - Dashboard dentro do aplicativo com simulador de compras em tempo real.
   - Script receptor de webhooks (`kiwify-webhook-handler.js`) para criação automática de contas no Supabase Auth e cancelamento imediato de acessos de reembolsados.

---

## 2. Passo a Passo: Hospedagem Gratuita com GitHub + Vercel

### 2.1. Criar o Repositório no GitHub
1. Abra o seu terminal na pasta do projeto:
   ```bash
   cd C:\Users\Valer\.gemini\antigravity\scratch\dentalsafe-tcle-ai
   ```
2. Inicialize o repositório git e faça o commit inicial:
   ```bash
   git init
   git add .
   git commit -m "Versão 1.0 - SaaS DentalSafe AI com Odontograma e Kiwify"
   ```
3. Crie um novo repositório privado ou público no seu [GitHub](https://github.com/new) com o nome `dentalsafe-ai`.
4. Conecte e envie o código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/dentalsafe-ai.git
   git branch -M main
   git push -u origin main
   ```

### 2.2. Publicar na Vercel (Custo: R$ 0,00)
1. Acesse [vercel.com](https://vercel.com) e faça login com a sua conta do GitHub.
2. Clique em **"Add New..." → "Project"**.
3. Selecione o repositório `dentalsafe-ai` e clique em **"Import"**.
4. Em *Framework Preset*, deixe como **Other** (HTML/JS estático).
5. Clique em **"Deploy"**. Em menos de 1 minuto, seu aplicativo estará no ar com HTTPS gratuito em:
   `https://dentalsafe-ai.vercel.app` (ou no seu domínio próprio, ex: `app.dentalsafe.com.br`).

---

## 3. Configuração do Banco de Dados no Supabase (Custo: R$ 0,00)

O plano gratuito do Supabase comporta até **50.000 usuários ativos por mês** e 500 MB de banco relacional PostgreSQL com segurança por Row Level Security (RLS).

1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Clique em **"New Project"** e dê um nome (ex: `dentalsafe-prod`).
3. Vá no menu lateral em **SQL Editor** → clique em **"New query"**.
4. Abra o arquivo `supabase_schema.sql` deste projeto, copie todo o conteúdo, cole no SQL Editor do Supabase e clique em **"Run"**.
   - Isso criará automaticamente todas as tabelas (`clinics`, `clinic_users`, `patients`, `tcles`, `subscriptions`), os índices e as políticas de RLS.
5. Vá em **Project Settings → API**:
   - Copie a **Project URL** (ex: `https://xyzcompany.supabase.co`).
   - Copie a chave **anon public** (ex: `eyJhbGciOiJIUzI1Ni...`).
6. Abra o arquivo `supabase.js` e substitua nas primeiras linhas:
   ```javascript
   const SUPABASE_URL  = 'https://xyzcompany.supabase.co';
   const SUPABASE_ANON = 'eyJhbGciOiJIUzI1Ni...';
   ```
7. Salve e faça um novo commit no GitHub (`git commit -am "Conecta Supabase" && git push`). A Vercel atualizará o site automaticamente em 30 segundos!

---

## 4. Como Configurar e Vender no Kiwify

### 4.1. Criar o Produto no Kiwify
1. Acesse [dashboard.kiwify.com.br](https://dashboard.kiwify.com.br) e vá em **Produtos → Criar Produto**.
2. **Tipo de produto:** Selecione *Área de Membros / Assinatura* ou *Serviço Online*.
3. **Nome do Produto:** `DentalSafe AI — Termos de Consentimento Odontológico Blindados`
4. **Precificação sugerida:**
   - **Plano Mensal:** R$ 37,00 / mês
   - **Plano Anual (Melhor Oferta):** R$ 297,00 / ano (ou 12x de R$ 29,70)
   - **Acesso Vitalício:** R$ 497,00 (excelente para campanhas de lançamento)
5. Na aba **Página de Vendas**, insira o link da sua landing page ou use o checkout direto da Kiwify.

### 4.2. Configurar o Webhook na Kiwify
1. No menu lateral da Kiwify, clique em **Apps → Webhooks**.
2. Clique em **"Criar Webhook"**.
3. Preencha os campos:
   - **Nome do Webhook:** `Ativação DentalSafe AI`
   - **URL do Webhook:** `https://seu-app.vercel.app/api/webhooks/kiwify`
   - **Selecionar Produto:** Escolha o produto que você acabou de criar.
   - **Eventos que disparam o webhook:**
     - `[X] Compra aprovada (order_approved)`
     - `[X] Reembolso (refunded)`
     - `[X] Chargeback`
     - `[X] Assinatura cancelada`
4. Salve o webhook.

### 4.3. Como o Cliente tem Acesso Imediato
- Quando a compra é paga, o script `kiwify-webhook-handler.js` cria o usuário no Supabase e dispara um e-mail para o comprador definir a sua senha.
- Ao clicar no link, o dentista define sua senha pessoal e já acessa o painel completo do DentalSafe AI com todas as ferramentas liberadas.
- Caso o cliente cancele a assinatura ou solicite reembolso, o webhook revoga o acesso automaticamente, sem que você precise fazer nada manual.

---

## 5. Testando Tudo Localmente

Para abrir e testar o aplicativo imediatamente no seu computador:
1. Basta abrir o arquivo `index.html` em qualquer navegador (Google Chrome, Edge, Safari).
2. O aplicativo já funciona em **Modo Demo completo**:
   - Você pode selecionar dentes no odontograma.
   - Clicar nas condições de saúde (Diabetes, Alendronato, Cardiopatia, Ansiedade).
   - Gerar o TCLE individualizado com todas as cláusulas jurídicas e notas de risco.
   - Testar a assinatura touch na tela e ver ela gravada no PDF.
   - Ir na aba **Vendas Kiwify** e disparar simulações de webhook em tempo real!
