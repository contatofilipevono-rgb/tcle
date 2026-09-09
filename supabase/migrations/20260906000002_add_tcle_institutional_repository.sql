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