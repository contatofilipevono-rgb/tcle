# 🦷 DentalSafe TCLE AI — Sistema de Termos de Consentimento Odontológico

> **A plataforma de consentimento informado individualizado mais completa do Brasil, fundamentada nas diretrizes do Conselho Federal de Odontologia (CFO), jurisprudência consolidada do Superior Tribunal de Justiça (STJ) e literatura científica indexada.**

[![CI Pipeline](https://github.com/dentalsafe/dentalsafe-tcle-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/dentalsafe/dentalsafe-tcle-ai/actions/workflows/ci.yml)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
[![Padrão](https://img.shields.io/badge/padr%C3%A3o-CFO%20%7C%20ABOL%20%7C%20STJ-emerald.svg)](TCLE_ODONTOLOGIA_COMPENDIO_COMPLETO.md)

---

## 📖 Visão Geral

O **DentalSafe TCLE AI** é um ecossistema projetado especificamente para cirurgiões-dentistas, clínicas odontológicas e peritos judiciais. Ele automatiza a elaboração de Termos de Consentimento Livre e Esclarecido (TCLE) com blindagem jurídica contra alegações de "vício de consentimento", "TCLE genérico nulo" (STJ REsp 1.871.939/SP) e violação autônoma do dever de informar (STJ REsp 1.540.580/DF).

---

## ⚡ Principais Recursos

- 🎯 **Isolamento Clínico Cirúrgico:** Procedimentos não incluídos no plano de tratamento **jamais aparecem** no documento final (ex: sem menção acidental a fratura de limas ou hipoclorito se canal não foi selecionado).
- 🦷 **Odontograma Interativo Dual (52 Elementos FDI):** Suporte total a dentição permanente (11–48) e decídua para odontopediatria (51–85), com comutação automática de arcadas.
- 🛡️ **Motor de Segurança Farmacológica & Anestésica (CFO/SBC):** Alerta em tempo real com correção em 1 clique para cardiopatas/hipertensos ao detectar vasoconstritores adrenérgicos.
- 📈 **Score de Risco Jurídico em Tempo Real:** Badge dinâmico no topo do sistema que avalia a responsabilidade civil conforme a natureza do procedimento (Meio vs Resultado).
- 📲 **Compartilhamento via WhatsApp & Tempo Hábil (CDC Art. 6º, III):** Envio prévio do resumo leigo para reflexão familiar antes da cirurgia.
- ✍️ **Assinatura Eletrônica Forense:** Captura biométrica em tela com hash criptográfico SHA-256 e certificação conforme a Lei Federal nº 14.063/2020 e MP nº 2.200-2/2001.
- 💾 **Persistência Local & Nuvem:** Funciona 100% offline via `localStorage` com sincronização e autenticação multi-tenant no Supabase.
- 💳 **Monetização SaaS com Webhooks Kiwify:** Integração pronta com liberação instantânea de licenças e controle de assinaturas.

---

## 📚 Compêndio Odontológico Completo

Consulte o arquivo de referência técnica:  
👉 **[`TCLE_ODONTOLOGIA_COMPENDIO_COMPLETO.md`](TCLE_ODONTOLOGIA_COMPENDIO_COMPLETO.md)**

Contém a doutrina jurídica unificada, matriz de riscos anestésicos, modelos periciais completos e cláusulas para todas as 14 especialidades odontológicas.

---

## 🗄️ Estrutura do Projeto

```
dentalsafe-tcle-ai/
├── .github/                       # Workflows de CI/CD e templates do GitHub
│   ├── workflows/
│   │   ├── ci.yml                 # Pipeline automatizado de testes e validação
│   │   └── deploy.yml             # Pipeline de publicação (GitHub Pages)
│   ├── ISSUE_TEMPLATE/            # Templates para reporte de bugs e melhorias
│   └── PULL_REQUEST_TEMPLATE.md   # Checklist de revisão
├── supabase/                      # Infraestrutura de Banco de Dados e Nuvem
│   ├── config.toml                # Configuração do Supabase CLI local
│   ├── schema.sql                 # Arquitetura relacional completa (PostgreSQL + RLS)
│   ├── seed.sql                   # Carga inicial de procedimentos e templates
│   ├── migrations/                # Migrações versionadas
│   ├── functions/tcle-generator/  # Edge Function (Deno) para geração de documentos
│   └── README.md                  # Manual de configuração do Supabase
├── index.html                     # Interface web responsiva (Single Page Application)
├── app.js                         # Motor de regras clínicas, odontograma e IA jurídica
├── style.css                      # Design system profissional com suporte a impressão A4
├── server.js                      # Servidor HTTP local (Node.js)
├── TCLE_ODONTOLOGIA_COMPENDIO_COMPLETO.md # Compêndio Master de TCLEs
├── .gitignore                     # Configuração de arquivos ignorados pelo Git
└── README.md                      # Documentação oficial
```

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/dentalsafe/dentalsafe-tcle-ai.git
   cd dentalsafe-tcle-ai
   ```

2. **Inicie o servidor local:**
   ```bash
   npm start
   # ou
   node server.js
   ```

3. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000).

---

## ⚖️ Conformidade Legal & Normas Vigentes

- **Conselho Federal de Odontologia (CFO):** Resoluções 118/2012 (Código de Ética), 196/2019 (Imagens), 198/2019 (HOF), 278/2025 (Prontuário Digital).
- **Código de Defesa do Consumidor (Lei 8.078/90):** Art. 6º, III (Direito à Informação Clara), Art. 14, § 4º (Responsabilidade Subjetiva), Art. 14, § 3º, II (Culpa Exclusiva do Consumidor).
- **Código Civil Brasileiro:** Arts. 15, 186, 187, 422, 927 e 951.
- **Lei Geral de Proteção de Dados (LGPD):** Lei nº 13.709/18 (Bases legais de Tutela da Saúde e Obrigação Legal).
- **Assinatura Eletrônica:** Lei Federal nº 14.063/2020 e Medida Provisória nº 2.200-2/2001.
