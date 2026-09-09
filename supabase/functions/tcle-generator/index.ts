// Endpoint de consulta autenticada. Não gera nem certifica um TCLE.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return reply(405, { error: "Método não permitido" });
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return reply(401, { error: "Autenticação necessária" });
  try {
    // A chave anônima + JWT mantém RLS. Nunca confiar em clinicId enviado no corpo.
    const client = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_ANON_KEY") || "", { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return reply(401, { error: "Sessão inválida" });
    const { documentId } = await req.json();
    if (typeof documentId !== "string" || documentId.length > 100) return reply(400, { error: "Identificador inválido" });
    const { data, error } = await client.from("tcle_documents").select("id").eq("id", documentId).maybeSingle();
    if (error) return reply(503, { error: "Não foi possível consultar o documento" });
    if (!data) return reply(404, { error: "Documento não encontrado ou sem permissão" });
    return reply(200, { documentId: data.id, status: "accessible", generated: false, signatureValidated: false });
  } catch { return reply(400, { error: "Solicitação inválida" }); }
});
