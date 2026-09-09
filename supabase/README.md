# Guia de Configuração e Conexão com o Supabase
## DentalSafe TCLE AI — Arquitetura de Nuvem e Banco de Dados

Este diretório contém a infraestrutura completa de dados do DentalSafe TCLE AI para o Supabase (PostgreSQL, Row Level Security, Edge Functions e Storage).

### 📁 Estrutura de Arquivos
- `config.toml`: Configuração de portas e autenticação do Supabase CLI.
- `schema.sql`: Arquitetura relacional completa com 8 tabelas centrais e políticas de RLS.
- `migrations/20260906000001_initial_tcle_system.sql`: Migração inicial versionada.
- `seed.sql`: Carga inicial de templates de procedimentos e especialidades.
- `functions/tcle-generator/`: Supabase Edge Function (Deno) para geração e auditoria.

### 🚀 Como Aplicar no Seu Projeto Supabase

1. **Crie um projeto no Supabase:**
   Acesse [supabase.com](https://supabase.com), crie uma organização e um novo projeto.

2. **Copie as credenciais:**
   Em *Project Settings > API*, copie a **Project URL** e a chave pública **Anon Key**.
   Cole-as no arquivo `app.js` no topo (configurações do objeto `DS`).

3. **Aplique o Schema:**
   No painel do Supabase, abra o **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
   Todas as tabelas, RLS e índices serão criados automaticamente.

4. **Carregue os Dados Iniciais:**
   No SQL Editor, execute o conteúdo de `supabase/seed.sql`.
