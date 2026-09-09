# CODEX.md — Contexto e Guia Mestre do Projeto DentalSafe AI

> **Arquivo de Instrução para OpenAI Codex, Cursor, Copilot e Agentes Autônomos.**  
> Carregue este arquivo para obter a visão arquitetural completa, mapa de arquivos, regras forenses e padrões de desenvolvimento.

---

## 📋 1. Visão Geral do Projeto
O **DentalSafe AI** é uma plataforma clínica e pericial de alta performance para Cirurgiões-Dentistas no Brasil. O sistema automatiza a geração de:
1. **Termo de Consentimento Livre e Esclarecido (TCLE)** personalizado e blindado perante o Código de Defesa do Consumidor (CDC Art. 14), Código de Ética Odontológica (Res. CFO 118/2012) e jurisprudência do STJ (REsp 1.871.939/SP e REsp 1.058.927/MT).
2. **Receituário Clínico Inteligente (DentalSafeRx)** com cálculo posológico, presets cirúrgicos preemptivos, profilaxia para endocardite (Diretriz AHA 2021) e alertas farmacológicos.
3. **Orientações Pós-Operatórias Independentes (DentalSafePostOpEngine)** com timeline de recuperação, checklists de retorno e disparos formatados para WhatsApp.
4. **Customizador de Seções**: Adição, remoção e reordenação intuitiva de cláusulas com persistência local (`localStorage`).

---

## 🛠️ 2. Stack Tecnológica
- **Linguagem**: JavaScript Vanilla (ES6+, modular, clean, sem frameworks pesados para garantir carregamento instantâneo no consultório).
- **Interface**: HTML5 Semântico, CSS3 com variáveis CSS (Design System Apple Human Interface Guidelines, suporte a temas Claro e Escuro, `@media print` otimizado para impressão/PDF).
- **Ícones**: RemixIcon via CDN.
- **Backend & Servidor Local**: Node.js (`server.js` na porta 3000) e integração opcional Supabase PostgreSQL (`supabase.js`).
- **Validação Automatizada**: Suítes de testes Node.js nativas (`test_clinical_ai_integration.js`, `test_endo_tooth11_fix.js`).

---

## 📁 3. Mapa Detalhado da Estrutura de Arquivos

```text
dentalsafe-tcle-ai/
├── index.html                  # Interface principal, formulários clínicos, odontograma e modais
├── style.css                   # Design System Apple HIG, Glassmorphism, Modo Consultório LGPD e @media print
├── app.js                      # Orquestrador central: estado da UI, gerador buildFullDocument, auto-harmonização
├── safety.js                   # Segurança, anti-XSS, validação de CPF, mascaramento e anonimização (LGPD Art. 12)
├── procedure-db.js             # PROCEDURE_DB: 21 especialidades com fisiopatologia, etapas, riscos e alternativas
├── clinical-ai-engine.js       # DentalSafeClinicalAI: parser de odontograma FDI, extração semântica e síntese forense
├── prescriptions-db.js         # DentalSafeRx: 41 fármacos em 5 categorias, 11 presets odontológicos e atestados
├── hof-db.js                   # HOF PRO: 5 Zonas de Risco Facial, Protocolo SOS DeLorenzi, CFO-198/2019 e STJ
├── postop-guidelines-db.js     # DentalSafePostOpEngine: protocolos pós-operatórios e gerador de mensagem WhatsApp
├── institutional-db.js         # Repositório de diretrizes institucionais (FOUSP, UNICAMP) e modelos CFO
├── intercurrences-db.js        # DENTAL_INTERCURRENCES_DB: 27 módulos de intercorrências com condutas legais
├── server.js                   # Servidor Node.js nativo com CSP, Permissions-Policy e nosniff (porta 3000)
├── publicar-online.bat         # Launcher executável do servidor local + túnel público Cloudflare HTTP/2
├── vercel.json / netlify.toml  # Configurações de deploy estático 24/7 para Vercel e Netlify
├── package.json                # Scripts npm: start, dev, share, test (suíte completa)
├── test_endo_tooth11_fix.js    # Teste de regressão para Endodontia, dente 11 e isolamento de PPR/Edentulismo
├── test_clinical_ai_integration.js # Suíte de 16 testes de integridade clínica
├── test_prescriptions_rx_module.js # Testes do módulo farmacológico e de receitas
├── test_hof_integration.js     # Testes das zonas de perigo facial e resoluções CFO de HOF
├── test_safety.js              # Testes de segurança, CPF, sanitização, LGPD e cabeçalhos HTTP
└── CODEX.md / AGENTS.md        # Diretrizes mestras para o Codex e agentes de inteligência artificial
```

---

## ⚡ 4. Links Públicos de Acesso (Ao Vivo & Permanente)

A plataforma conta com dois ambientes de acesso público:
1. **Link Permanente 24/7 (Surge CDN Global — Gratuito para Sempre)**:
   - URL: **`https://dentalsafe-tcle-ai.surge.sh`**
   - Não depende do computador do dentista estar ligado.
   - Para atualizar a versão permanente após alterações no código:
     ```cmd
     npm run deploy
     ```
     (ou execute o arquivo `publicar-permanente.bat`).

2. **Link de Desenvolvimento ao Vivo (Cloudflare Tunnel HTTP/2)**:
   - Servidor local (`server.js`) lendo do disco em tempo real (`fs.readFile`).
   - Espelha instantaneamente qualquer arquivo salvo localmente assim que der F5 no navegador.
   - Para ativar/reativar o túnel local: execute `publicar-online.bat`.

---

## ⚖️ 5. Regras Forenses, Clínicas e LGPD (Invioláveis)

1. **Auto-Harmonização Prioritária (Anti-Contaminação de Especialidades)**:
   - O diagnóstico digitado pelo cirurgião-dentista e os dentes marcados no odontograma **SEMPRE** prevalecem sobre valores padrões de `<select id="procedure-type">`.
   - Se o dentista digita "endo", "canal" ou seleciona o dente 11 para endodontia, o termo gerado deve ser **estritamente Endodontia** (`PROCEDURE_DB['canal']`).
   - **NUNCA** permitir vazamento de cláusulas de edentulismo, PPR (Prótese Parcial Removível) ou implantes em termos de tratamento de canal, a menos que o caso seja um procedimento composto explicitamente indicado.

2. **Dever de Cooperação do Paciente (CDC Art. 14, § 3º, II)**:
   - Todo termo de endodontia **DEVE** conter a obrigação inadiável de confecção da blindagem/coroa definitiva em até 30 dias para evitar fratura radicular vertical por sobrecarga mastigatória.
   - Cirurgias devem conter a obrigação de repouso, proibição de esforço físico, bochechos e fumo nas primeiras 48-72h.

3. **Natureza da Obrigação Médica (STJ)**:
   - Procedimentos restauradores/reabilitadores estéticos (facetas, lentes) seguem obrigação de resultado mitigado/condicionado à biologia tecidual.
   - Cirurgias, implantes e endodontia seguem jurisprudência consolidada de obrigação de **MEIO** (REsp 1.058.927/MT).

4. **Diretrizes Farmacológicas Atualizadas (AHA 2021)**:
   - Profilaxia para endocardite infecciosa padrão: **Amoxicilina 2g** (ou 50mg/kg em crianças) via oral 30-60 min antes.
   - Em caso de alergia a penicilinas, a primeira escolha recomendada pela AHA 2021 é **Azitromicina 500mg** ou Cefalexina 2g (se reação não for anafilática imediata).

5. **Privacidade e Proteção de Dados (LGPD — Lei 13.709/18)**:
   - Os dados de saúde são classificados como sensíveis (Art. 5º, II). A base jurídica aplicável é Tutela da Saúde (Art. 11, II, f) e Guarda de Prontuário por 20 Anos (Art. 7º, II).
   - O modo consultório (`.privacy-shield-active`) deve ofuscar dados pessoais na tela em atendimento.
   - Qualquer exportação para pesquisa deve utilizar `DentalSafeSafety.anonymizeRecord(record)` (Art. 12).

---

## 🤖 6. Como Desenvolver e Modificar o Código com o Codex

Ao realizar tarefas ou sugerir código:
1. **Mantenha Vanilla JS**: Não introduza dependências de bundlers (Webpack, Vite) a menos que solicitado. O projeto roda direto via navegador e `node server.js`.
2. **Preserve a Integridade de Impressão**: Qualquer alteração na DOM do documento ou CSS deve respeitar `@media print`, garantindo que tabelas, quebras de página (`page-break-inside: avoid`) e blocos de assinatura permaneçam legíveis e sem cortes em PDF.
3. **Execute a Suíte de Testes Automatizada Completa**:
   Execute sempre no terminal antes de concluir qualquer alteração:
   ```cmd
   npm test
   ```
   (Todos os 46 testes das 6 suítes devem passar com 100% de sucesso).
