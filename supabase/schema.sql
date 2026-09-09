-- ==============================================================================
-- DentalSafe TCLE AI — Schema de Banco de Dados Relacional (PostgreSQL / Supabase)
-- Padrão: CFO · LGPD (Lei 13.709/18) · Lei 14.063/2020 · Segurança RLS
-- ==============================================================================

-- Habilita extensões essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABELA DE CLÍNICAS (MULTI-TENANT)
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    cnpj VARCHAR(20),
    cro_clinic VARCHAR(50),
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    logo_url TEXT,
    primary_color VARCHAR(10) DEFAULT '#0ea5e9',
    settings JSONB DEFAULT '{}'::jsonb
);

-- 2. TABELA DE PERFIS DE USUÁRIOS (CIRURGIÕES-DENTISTAS E EQUIPE)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    cro VARCHAR(50) NOT NULL,
    cro_uf VARCHAR(2) NOT NULL,
    specialty VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(50) NOT NULL DEFAULT 'dentist' CHECK (role IN ('admin', 'dentist', 'assistant')),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 3. TABELA DE PACIENTES
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(30),
    birth_date DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    legal_status VARCHAR(50) NOT NULL DEFAULT 'capable' 
        CHECK (legal_status IN ('capable', 'minor-under16', 'minor-16-18', 'pcd-curatela', 'illiterate', 'emergency')),
    guardian_name VARCHAR(255),
    guardian_cpf VARCHAR(14),
    guardian_relationship VARCHAR(100),
    medical_history JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT unq_clinic_patient_cpf UNIQUE (clinic_id, cpf)
);

-- 4. TABELA DE MODELOS DE PROCEDIMENTOS (TEMPLATES BASEADOS NO CFO/ABOL)
CREATE TABLE IF NOT EXISTS public.procedure_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    natural_obligation VARCHAR(100) NOT NULL,
    technical_description TEXT NOT NULL,
    alternatives TEXT NOT NULL,
    refusal_prognosis TEXT NOT NULL,
    risks_common JSONB NOT NULL DEFAULT '[]'::jsonb,
    risks_uncommon JSONB NOT NULL DEFAULT '[]'::jsonb,
    risks_rare JSONB NOT NULL DEFAULT '[]'::jsonb,
    scientific_references TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. TABELA DE DOCUMENTOS TCLE GERADOS
CREATE TABLE IF NOT EXISTS public.tcle_documents (
    id VARCHAR(50) PRIMARY KEY, -- Ex: DS-2026-XXXX
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    dentist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    procedure_id VARCHAR(100) REFERENCES public.procedure_templates(id),
    procedure_name VARCHAR(255) NOT NULL,
    procedure_region TEXT NOT NULL, -- Dentes FDI ou região anatômica
    diagnosis TEXT NOT NULL,
    anesthesia_protocol VARCHAR(100) NOT NULL,
    budget_value VARCHAR(50),
    estimated_sessions VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'revoked', 'archived')),
    risk_score_level VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (risk_score_level IN ('low', 'medium', 'high', 'critical')),
    risk_tags JSONB DEFAULT '[]'::jsonb,
    active_intercurrences JSONB DEFAULT '[]'::jsonb,
    full_legal_html TEXT NOT NULL,
    accessible_summary_html TEXT NOT NULL,
    annex_a_lgpd_html TEXT,
    pdf_storage_url TEXT
);

-- 6. TABELA DE ASSINATURAS ELETRÔNICAS FORENSES (LEI 14.063/2020)
CREATE TABLE IF NOT EXISTS public.electronic_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    document_id VARCHAR(50) NOT NULL REFERENCES public.tcle_documents(id) ON DELETE CASCADE,
    signer_type VARCHAR(30) NOT NULL CHECK (signer_type IN ('patient', 'guardian', 'dentist', 'witness_1', 'witness_2')),
    signer_name VARCHAR(255) NOT NULL,
    signer_cpf VARCHAR(14) NOT NULL,
    signature_image_data_url TEXT NOT NULL,
    sha256_hash VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    biometric_payload JSONB DEFAULT '{}'::jsonb
);

-- 7. TABELA DE ASSINATURAS E WEBHOOKS KIWIFY (SAAS MONETIZAÇÃO)
CREATE TABLE IF NOT EXISTS public.kiwify_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    order_id VARCHAR(100) UNIQUE NOT NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    order_status VARCHAR(50) NOT NULL, -- paid, refunded, canceled
    product_id VARCHAR(100),
    subscription_status VARCHAR(50) DEFAULT 'active',
    raw_payload JSONB NOT NULL
);

-- 8. TABELA DE LOGS DE AUDITORIA E SEGURANÇA (LGPD ART. 11)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - SEGURANÇA MULTI-TENANT POR CLÍNICA
-- ==============================================================================

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tcle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electronic_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Dentistas e admins visualizam sua própria clínica"
    ON public.clinics FOR ALL
    USING (id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Usuários acessam pacientes da sua própria clínica"
    ON public.patients FOR ALL
    USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Usuários acessam TCLEs da sua própria clínica"
    ON public.tcle_documents FOR ALL
    USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Acesso a assinaturas de documentos da clínica"
    ON public.electronic_signatures FOR ALL
    USING (document_id IN (
        SELECT id FROM public.tcle_documents 
        WHERE clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
    ));

-- Triggers para atualização de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clinics_updated_at BEFORE UPDATE ON public.clinics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_tcle_documents_updated_at BEFORE UPDATE ON public.tcle_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. TABELA DE MODELOS INSTITUCIONAIS DE TCLE (UNIVERSIDADES, CFO, CRO, ARTIGOS ABOL)
CREATE TABLE IF NOT EXISTS public.tcle_institutional_repository (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'Universidade', 'CFO/CRO', 'Artigo Científico / ABOL'
    institution_name VARCHAR(150) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    normative_grounding TEXT NOT NULL,
    clinical_evidence TEXT,
    full_tcle_text TEXT NOT NULL,
    essential_clauses JSONB DEFAULT '[]'::jsonb,
    risks_and_statistics JSONB DEFAULT '[]'::jsonb,
    bibliographic_citation TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tcle_institutional_repository ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Repositório institucional de TCLE acessível publicamente para consulta"
    ON public.tcle_institutional_repository FOR SELECT
    USING (is_public = true);
