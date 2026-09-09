-- =============================================================================
-- DentalSafe AI — Schema Supabase (Multi-Clínica com RLS)
-- Execute este script no SQL Editor do seu projeto Supabase:
-- Dashboard → SQL Editor → New Query → cole tudo → Run
-- =============================================================================

-- Extensão para gerar UUIDs
create extension if not exists "uuid-ossp";

-- =============================================================================
-- TABELAS
-- =============================================================================

-- Clínicas
create table if not exists public.clinics (
  id            uuid        default uuid_generate_v4() primary key,
  name          text        not null,
  dentist_name  text,
  cro           text,
  phone         text,
  email         text,
  address       text,
  created_at    timestamptz default now()
);

-- Vínculo usuário ↔ clínica (suporta múltiplos dentistas por clínica)
create table if not exists public.clinic_users (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  clinic_id  uuid references public.clinics(id) on delete cascade,
  role       text default 'dentist',  -- dentist | admin | receptionist
  created_at timestamptz default now(),
  unique (user_id, clinic_id)
);

-- Pacientes (reutilizáveis entre TCLEs)
create table if not exists public.patients (
  id         uuid default uuid_generate_v4() primary key,
  clinic_id  uuid references public.clinics(id) on delete cascade,
  name       text not null,
  cpf        text,
  rg         text,
  dob        date,
  phone      text,
  address    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists patients_clinic_id_idx on public.patients(clinic_id);
create index if not exists patients_cpf_idx       on public.patients(cpf);

-- TCLEs gerados
create table if not exists public.tcles (
  id             uuid default uuid_generate_v4() primary key,
  clinic_id      uuid references public.clinics(id) on delete cascade,
  patient_id     uuid references public.patients(id) on delete set null,
  doc_id         text unique,          -- DS-2026-XXXX
  patient_name   text,
  patient_cpf    text,
  procedure_name text,
  procedure_key  text,
  region         text,
  diagnosis      text,
  risk_tags      text[],
  legal_html     text,
  summary_html   text,
  annex_a_html   text,
  generated_at   date    default current_date,
  created_at     timestamptz default now()
);
create index if not exists tcles_clinic_id_idx on public.tcles(clinic_id);
create index if not exists tcles_patient_cpf_idx on public.tcles(patient_cpf);

-- =============================================================================
-- FUNÇÃO HELPER — retorna clinic_id do usuário logado
-- =============================================================================
create or replace function public.get_my_clinic_id()
returns uuid
language sql
security definer
stable
as $$
  select clinic_id
  from   public.clinic_users
  where  user_id = auth.uid()
  limit  1;
$$;

-- =============================================================================
-- FUNÇÃO — cria clínica e vincula o usuário atual como admin
-- (usada no setup inicial do primeiro dentista)
-- =============================================================================
create or replace function public.create_clinic_and_link_user(
  p_name         text,
  p_dentist_name text,
  p_cro          text,
  p_phone        text,
  p_email        text,
  p_address      text
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_id uuid;
begin
  insert into public.clinics (name, dentist_name, cro, phone, email, address)
  values (p_name, p_dentist_name, p_cro, p_phone, p_email, p_address)
  returning id into new_id;

  insert into public.clinic_users (user_id, clinic_id, role)
  values (auth.uid(), new_id, 'admin');

  return new_id;
end;
$$;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

alter table public.clinics       enable row level security;
alter table public.clinic_users  enable row level security;
alter table public.patients      enable row level security;
alter table public.tcles         enable row level security;

-- ---- clinics ----
create policy "ver_propria_clinica"
  on public.clinics for select
  using (id = get_my_clinic_id());

create policy "atualizar_propria_clinica"
  on public.clinics for update
  using (id = get_my_clinic_id());

-- ---- clinic_users ----
create policy "ver_clinic_users"
  on public.clinic_users for select
  using (clinic_id = get_my_clinic_id());

-- ---- patients ----
create policy "ver_pacientes"
  on public.patients for select
  using (clinic_id = get_my_clinic_id());

create policy "inserir_paciente"
  on public.patients for insert
  with check (clinic_id = get_my_clinic_id());

create policy "atualizar_paciente"
  on public.patients for update
  using (clinic_id = get_my_clinic_id());

create policy "deletar_paciente"
  on public.patients for delete
  using (clinic_id = get_my_clinic_id());

-- ---- tcles ----
create policy "ver_tcles"
  on public.tcles for select
  using (clinic_id = get_my_clinic_id());

create policy "inserir_tcle"
  on public.tcles for insert
  with check (clinic_id = get_my_clinic_id());

create policy "atualizar_tcle"
  on public.tcles for update
  using (clinic_id = get_my_clinic_id());

create policy "deletar_tcle"
  on public.tcles for delete
  using (clinic_id = get_my_clinic_id());

-- =============================================================================
-- STORAGE — bucket para arquivos de TCLE (privado)
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('tcle-docs', 'tcle-docs', false)
on conflict (id) do nothing;

create policy "upload_tcle_doc"
  on storage.objects for insert
  with check (bucket_id = 'tcle-docs' and auth.uid() is not null);

create policy "ler_tcle_doc"
  on storage.objects for select
  using (bucket_id = 'tcle-docs' and auth.uid() is not null);

create policy "deletar_tcle_doc"
  on storage.objects for delete
  using (bucket_id = 'tcle-docs' and auth.uid() is not null);

-- =============================================================================
-- KIWIFY SAAS — TABELA DE ASSINATURAS E CONTROLE DE ACESSO
-- =============================================================================

create table if not exists public.subscriptions (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references auth.users(id) on delete set null,
  customer_email  text not null,
  customer_name   text,
  customer_cpf    text,
  customer_phone  text,
  kiwify_order_id text unique,
  status          text default 'active', -- 'active' | 'canceled' | 'refunded' | 'expired'
  plan_id         text,                  -- 'anual_pro' | 'mensal' | 'vitalicio'
  plan_name       text,
  amount_cents    integer,
  payment_method  text,
  starts_at       timestamptz default now(),
  expires_at      timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists subscriptions_email_idx on public.subscriptions(customer_email);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

-- RLS para subscriptions
alter table public.subscriptions enable row level security;

-- Cada usuário só consulta sua própria assinatura
create policy "ver_propria_assinatura"
  on public.subscriptions for select
  using (user_id = auth.uid() or customer_email = auth.jwt()->>'email');

-- Função auxiliar para verificar se o usuário atual tem assinatura ativa
create or replace function public.has_active_subscription()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from   public.subscriptions
    where  (user_id = auth.uid() or customer_email = auth.jwt()->>'email')
      and  status = 'active'
      and  (expires_at is null or expires_at > now())
  );
$$;

-- =============================================================================
-- PRONTO!
-- Próximos passos:
-- 1. No Supabase: Execute este script completo no SQL Editor.
-- 2. Copie a Project URL e a anon key em Settings → API e cole no supabase.js
-- 3. No Kiwify: Cadastre a URL do seu webhook (ex: https://seu-app.vercel.app/api/webhooks/kiwify)
-- =============================================================================

