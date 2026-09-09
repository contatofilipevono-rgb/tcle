/**
 * DentalSafe Express — Motor Guiado em Telas Independentes
 * Versão Simplificada, Limpa, Tátil e Lúdica (Apple HIG)
 * Termo de Consentimento Livre e Esclarecido (TCLE) com Complexidade Forense Integral
 * Catálogo CFO / VRPO / TUSS & Condições Sistêmicas Ampliadas
 */

'use strict';

// Estado global da sessão
const state = {
  activeScreen: 'screen-dentist', // 'screen-dentist' | 'screen-patient' | 'screen-procedure' | 'screen-review' | 'screen-tcle'
  dentist: {
    name: '',
    cro: '',
    clinic: '',
    phone: '',
    city: '',
    saveForFuture: true
  },
  patient: {
    name: '',
    cpf: '',
    rg: '',
    birthDate: '',
    phone: '',
    address: ''
  },
  procedure: {
    id: 'implante',
    title: 'Implante Dentário & Enxerto Ósseo',
    specialty: 'Implantodontia',
    customTitle: '',
    cfoData: null,
    selectedTeeth: ['11'],
    dentitionMode: 'permanente' // 'permanente' | 'deciduo'
  },
  healthConditions: new Set(),
  certificate: {
    enabled: false,
    type: 'afastamento', // 'afastamento' | 'comparecimento'
    days: 2,
    startTime: '09:00',
    endTime: '10:30',
    cidCode: 'K08.1',
    includeCid: false
  },
  prescription: {
    enabled: false,
    presetId: 'cirurgico',
    items: []
  }
};

// SVGs Anatômicos Lúdicos dos Dentes (Apple Premium Vector Art)
const TOOTH_SVGS = {
  molar: `<svg viewBox="0 0 36 40" fill="currentColor" width="24" height="28">
    <!-- Raízes Anatômicas com Bifurcação Suave -->
    <path d="M8 20 C7 25 6 32 9 37 C10.5 38.5 12 37 12.5 32 C13 27 13.5 24 14.5 22 C15.5 24 16 27 16.5 32 C17 37 18.5 38.5 20 37 C23 32 22 25 21 20 Z" opacity="0.9"/>
    <path d="M21 20 C22 25 24 31 26.5 35 C27.5 36.5 29 35.5 29 33 C28.5 27 27.5 22 26 19 Z" opacity="0.8"/>
    <!-- Corpo Coronário com Cúspides Anatômicas -->
    <path d="M5 8 C5 4 8 2 12 2 C14.5 2 16.5 3.5 18 3.5 C19.5 3.5 21.5 2 24 2 C28 2 31 4 31 8 C31.8 11.5 31.5 15.5 29 18 C26.5 20.5 22 21 18 21 C14 21 9.5 20.5 7 18 C4.5 15.5 4.2 11.5 5 8 Z"/>
    <!-- Fissura Oclusal e Brilho de Esmalte -->
    <path d="M10 7 C13 9 15 9 18 8 C21 9 23 9 26 7" stroke="rgba(255,255,255,0.8)" stroke-width="1.3" stroke-linecap="round" fill="none"/>
    <path d="M18 8 L18 15" stroke="rgba(255,255,255,0.6)" stroke-width="1.1" stroke-linecap="round" fill="none"/>
    <!-- Destaque Especular Apple -->
    <ellipse cx="12" cy="5" rx="3.5" ry="1.2" fill="#ffffff" opacity="0.85"/>
    <ellipse cx="24" cy="5" rx="3.5" ry="1.2" fill="#ffffff" opacity="0.85"/>
  </svg>`,
  premolar: `<svg viewBox="0 0 32 40" fill="currentColor" width="22" height="28">
    <!-- Raiz Dupla Afilada -->
    <path d="M9 20 C8 25 7 32 10.5 37 C12 38.5 13.5 37 14 31 C14.5 25 15 22 16 20 C17 22 17.5 25 18 31 C18.5 37 20 38.5 21.5 37 C25 32 24 25 23 20 Z" opacity="0.9"/>
    <!-- Coroa Bicuspidada -->
    <path d="M6 8 C6 4 9 2 13 2 C15 2 15.5 3 16 3 C16.5 3 17 2 19 2 C23 2 26 4 26 8 C26.8 11.5 26.5 15 24 18 C22 20 19 20.5 16 20.5 C13 20.5 10 20 8 18 C5.5 15 5.2 11.5 6 8 Z"/>
    <!-- Sulco de Esmalte e Brilho -->
    <path d="M11 7 C13.5 8.5 18.5 8.5 21 7" stroke="rgba(255,255,255,0.8)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <ellipse cx="16" cy="5" rx="4" ry="1.2" fill="#ffffff" opacity="0.85"/>
  </svg>`,
  canine: `<svg viewBox="0 0 30 40" fill="currentColor" width="20" height="28">
    <!-- Raiz Única Robusta e Convexa -->
    <path d="M9.5 19 C10 24 11 31 13 36.5 C13.8 38.5 16.2 38.5 17 36.5 C19 31 20 24 20.5 19 Z" opacity="0.9"/>
    <!-- Cúspide Pontiaguda Característica -->
    <path d="M5.5 11 C5.5 6.5 9 3 13 1.5 C14.2 1 15.8 1 17 1.5 C21 3 24.5 6.5 24.5 11 C24.8 14 24 17 21 19 C18.5 20.2 11.5 20.2 9 19 C6 17 5.2 14 5.5 11 Z"/>
    <!-- Crista Vestibular Longitudinal -->
    <path d="M15 3.5 L15 15" stroke="rgba(255,255,255,0.75)" stroke-width="1.3" stroke-linecap="round" fill="none"/>
    <ellipse cx="15" cy="4" rx="2" ry="1.5" fill="#ffffff" opacity="0.9"/>
  </svg>`,
  incisor: `<svg viewBox="0 0 28 40" fill="currentColor" width="19" height="28">
    <!-- Raiz Cônica Graciosa -->
    <path d="M9 19 C9.5 24 10.5 30 12.5 36 C13.2 38 14.8 38 15.5 36 C17.5 30 18.5 24 19 19 Z" opacity="0.9"/>
    <!-- Borda Incisal Espatulada e Reta -->
    <path d="M4.5 5 C4.5 3 6.5 2 9 2 L19 2 C21.5 2 23.5 3 23.5 5 L23.5 13 C23.5 16.5 21.5 19 18.5 19.5 L9.5 19.5 C6.5 19 4.5 16.5 4.5 13 Z"/>
    <!-- Brilho Linear de Esmalte -->
    <rect x="7" y="3.5" width="14" height="1.8" rx="0.9" fill="#ffffff" opacity="0.85"/>
    <path d="M8 10 C11 11 17 11 20 10" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/>
  </svg>`
};

// Dicionário de Procedimentos Rápidos (Cards Principais)
const PROCEDURES_DATA = {
  implante: {
    title: 'Implante Dentário & Enxerto Ósseo',
    specialty: 'Implantodontia',
    icon: '🦷',
    desc: 'Instalação de implante osseointegrável e regeneração óssea.',
    cid: 'K08.1',
    baseKey: 'implante'
  },
  extracao: {
    title: 'Cirurgia Bucomaxilofacial — Exodontia de Sisos',
    specialty: 'Cirurgia Bucomaxilofacial',
    icon: '🔨',
    desc: 'Cirurgia de terceiros molares inclusos, semi-inclusos ou impactados.',
    cid: 'K01.1',
    baseKey: 'sisos'
  },
  sisos: {
    title: 'Cirurgia Bucomaxilofacial — Exodontia de Sisos',
    specialty: 'Cirurgia Bucomaxilofacial',
    icon: '🔨',
    desc: 'Cirurgia de terceiros molares inclusos, semi-inclusos ou impactados.',
    cid: 'K01.1',
    baseKey: 'sisos'
  },
  canal: {
    title: 'Endodontia — Tratamento de Canal Radicular',
    specialty: 'Endodontia',
    icon: '⚡',
    desc: 'Descontaminação, preparo mecânico e obturação tridimensional hermética.',
    cid: 'K04.0',
    baseKey: 'canal'
  },
  hof: {
    title: 'Harmonização Orofacial (HOF) — Toxina & Preenchedores',
    specialty: 'Harmonização Orofacial',
    icon: '✨',
    desc: 'Toxina botulínica, ácido hialurônico e bioestimulador dérmico.',
    cid: 'M79.1',
    baseKey: 'harmonizacao'
  },
  harmonizacao: {
    title: 'Harmonização Orofacial (HOF) — Toxina & Preenchedores',
    specialty: 'Harmonização Orofacial',
    icon: '✨',
    desc: 'Toxina botulínica, ácido hialurônico e bioestimulador dérmico.',
    cid: 'M79.1',
    baseKey: 'harmonizacao'
  },
  protese: {
    title: 'Prótese Dentária, Coroas & Reabilitação Oral',
    specialty: 'Prótese Dentária',
    icon: '🛡️',
    desc: 'Próteses fixas sobre dentes/implantes, zircônia e cerâmica pura.',
    cid: 'K08.4',
    baseKey: 'protese'
  },
  facetas: {
    title: 'Dentística Restauradora — Facetas Cerâmicas & Lentes',
    specialty: 'Dentística Restauradora',
    icon: '💎',
    desc: 'Laminados cerâmicos de alta estética e facetas em resina composta.',
    cid: 'K08.4',
    baseKey: 'facetas'
  },
  periodontia: {
    title: 'Periodontia — Raspagem e Tratamento Subgengival',
    specialty: 'Periodontia',
    icon: '🩺',
    desc: 'Tratamento de bolsas periodontais, raspagem e controle de perda óssea.',
    cid: 'K05.3',
    baseKey: 'periodontia'
  },
  restauracao: {
    title: 'Dentística — Restauração Estética Direta em Resina',
    specialty: 'Dentística',
    icon: '🩹',
    desc: 'Remoção de cárie e restauração adesiva em resina composta nanoparticulada.',
    cid: 'K02.1',
    baseKey: 'restauracao'
  },
  clareamento: {
    title: 'Clareamento Dental Supervisionado (Consultório / Caseiro)',
    specialty: 'Dentística',
    icon: '⚪',
    desc: 'Clareamento dental em consultório com fotoativação ou moldeiras supervisionadas.',
    cid: 'K03.7',
    baseKey: 'clareamento'
  },
  ortodontia: {
    title: 'Ortodontia & Ortopedia Facial — Aparelhos & Alinhadores',
    specialty: 'Ortodontia',
    icon: '📐',
    desc: 'Aparelhos fixos estéticos, autoligados e alinhadores transparentes.',
    cid: 'K07.2',
    baseKey: 'ortodontia'
  },
  odontopediatria: {
    title: 'Odontopediatria — Assistência Odontológica Infantil',
    specialty: 'Odontopediatria',
    icon: '👶',
    desc: 'Prevenção, restaurações em dentes decíduos e adequação bucal infantil.',
    cid: 'K00.6',
    baseKey: 'odontopediatria'
  },
  dtm: {
    title: 'Disfunção Temporomandibular (DTM) & Placa Oclusal',
    specialty: 'DTM e Dor Orofacial',
    icon: '💆',
    desc: 'Placa miorrelaxante estabilizadora e controle de dor miofascial/ATM.',
    cid: 'K07.6',
    baseKey: 'dtm'
  },
  cirurgia_oral: {
    title: 'Cirurgia Oral Menor Ambulatorial',
    specialty: 'Cirurgia Oral',
    icon: '🔬',
    desc: 'Frenectomia, apicectomia, biópsia oral e remoção de cistos.',
    cid: 'K08.8',
    baseKey: 'cirurgia_oral'
  }
};

// ==========================================================================
// CATÁLOGO COMPLETO DE PROCEDIMENTOS CFO / VRPO / TUSS (60+ Procedimentos)
// ==========================================================================
const CFO_PROCEDURES_CATALOG = [
  // 1. Cirurgia Bucomaxilofacial e Cirurgia Oral Menor
  { id: 'cfo-siso-incluso', title: 'Exodontia de Terceiro Molar Incluso ou Impactado (Siso)', specialty: 'Cirurgia Bucomaxilofacial', cid: 'K01.1', desc: 'Osteotomia criteriosa, odontossecção e preservação do nervo alveolar inferior.', baseKey: 'sisos' },
  { id: 'cfo-exo-simples', title: 'Exodontia Simples de Dente Permanente', specialty: 'Cirurgia Oral', cid: 'K08.8', desc: 'Remoção cirúrgica com sindesmotomia atraumática e hemostasia local.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-exo-retalho', title: 'Exodontia a Retalho com Osteotomia / Alveolotomia', specialty: 'Cirurgia Oral', cid: 'K08.8', desc: 'Exodontia de raiz residual ou dente anquilosado com descolamento mucoperiosteal.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-frenectomia', title: 'Frenectomia Labial ou Lingual (Anquiloglossia / Diastema)', specialty: 'Cirurgia Oral Menor', cid: 'K13.0', desc: 'Exérese cirúrgica de brida ou freio fibroso para alívio funcional e fonético.', baseKey: 'frenectomia' },
  { id: 'cfo-apicectomia', title: 'Cirurgia Parendodôntica (Apicectomia c/ Retrobturação)', specialty: 'Cirurgia Parendodôntica', cid: 'K04.6', desc: 'Ressecção apical com preparo ultrassônico retrógrado e selamento biocerâmico MTA.', baseKey: 'apicectomia' },
  { id: 'cfo-biopsia-boca', title: 'Biópsia de Cavidade Oral / Glândula Salivar / Osso', specialty: 'Estomatologia', cid: 'K13.7', desc: 'Incisão diagnóstica ou excisão para análise histopatológica de lesão estomatognática.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-cisto-enucleacao', title: 'Enucleação / Descompressão de Cisto Odontogênico', specialty: 'Cirurgia Bucomaxilofacial', cid: 'K09.0', desc: 'Curetagem e excisão completa de lesão intraóssea cística com preservação anatômica.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-fistula-bucosinusal', title: 'Fechamento Cirúrgico de Comunicação / Fístula Bucossinusal', specialty: 'Cirurgia Bucomaxilofacial', cid: 'J32.0', desc: 'Plastia de retalho deslizante ou corpo adiposo de Bichat para vedamento do seio maxilar.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-ulectomia', title: 'Ulectomia / Ulotomia (Descapuzamento Dental Cirúrgico)', specialty: 'Cirurgia Oral Menor', cid: 'K00.6', desc: 'Exérese de tecido gengival hiperplásico para permitir a erupção do dente retido.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-tracionamento-canino', title: 'Tracionamento Cirúrgico-Ortodôntico de Dente Incluso', specialty: 'Cirurgia / Ortodontia', cid: 'K01.0', desc: 'Abertura cirúrgica de janela óssea com colagem de acessório para tração.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-torus-mandibular', title: 'Remoção Cirúrgica de Tórus Mandibular / Palatino', specialty: 'Cirurgia Oral Menor', cid: 'M89.9', desc: 'Osteotomia e aplainamento cirúrgico de exostose óssea para instalação de prótese.', baseKey: 'cirurgia_oral' },
  { id: 'cfo-alveoloplastia', title: 'Alveoloplastia e Regularização de Rebordo Alveolar', specialty: 'Cirurgia Oral', cid: 'K08.8', desc: 'Remoção de espículas ósseas agudas e conformação de rebordo edêntulo.', baseKey: 'cirurgia_oral' },

  // 2. Implantodontia e Enxertos Ósseos
  { id: 'cfo-implante-osseo', title: 'Instalação Cirúrgica de Implante Osseointegrado Unitário / Múltiplo', specialty: 'Implantodontia', cid: 'K08.1', desc: 'Fresagem guiada e inserção de implante de titânio cone morse com torque primário.', baseKey: 'implante' },
  { id: 'cfo-protocolo-branemark', title: 'Prótese Protocolo Branemark Sobre Implantes (All-on-4 / All-on-6)', specialty: 'Implantodontia / Prótese', cid: 'K08.1', desc: 'Reabilitação total com múltiplos implantes e barra rígida em carga imediata/tardia.', baseKey: 'protocolo_implante' },
  { id: 'cfo-sinus-lift', title: 'Levantamento de Seio Maxilar (Sinus Lift) com Enxerto Ósseo', specialty: 'Implantodontia', cid: 'K08.2', desc: 'Abertura de janela lateral, elevação da membrana de Schneider e inserção de biomaterial.', baseKey: 'implante' },
  { id: 'cfo-rog-enxerto', title: 'Regeneração Óssea Guiada (ROG) com Membrana e Biomaterial', specialty: 'Implantodontia', cid: 'K08.2', desc: 'Aumento horizontal ou vertical de rebordo alveolar atrófico com membrana reabsorvível.', baseKey: 'enxerto_gengival' },
  { id: 'cfo-reabertura-implante', title: 'Reabertura Cirúrgica e Instalação de Cicatrizador sobre Implante', specialty: 'Implantodontia', cid: 'K08.1', desc: 'Incisão mínima de acesso tecidual e colocação de cicatrizador transmucoso.', baseKey: 'implante' },
  { id: 'cfo-overdenture', title: 'Overdenture Sobre Implantes (Barra-Clipe / O-Ring / Locator)', specialty: 'Implantodontia / Prótese', cid: 'K08.1', desc: 'Prótese total mucossuportada e implantorretida para retenção e estabilidade mastigatória.', baseKey: 'protocolo_implante' },
  { id: 'cfo-periimplantite', title: 'Descontaminação e Terapia Cirúrgica de Peri-implantite', specialty: 'Implantodontia / Periodontia', cid: 'K08.1', desc: 'Debridamento mecânico e químico de espiras expostas com regeneração tecidual.', baseKey: 'periodontia' },

  // 3. Endodontia
  { id: 'cfo-endo-unirradicular', title: 'Tratamento Endodôntico de Dente Unirradicular (Incisivos/Caninos)', specialty: 'Endodontia', cid: 'K04.0', desc: 'Preparo biomecânico rotatório e obturação termoplastificada em canal único.', baseKey: 'canal' },
  { id: 'cfo-endo-birradicular', title: 'Tratamento Endodôntico de Dente Birradicular (Pré-molares)', specialty: 'Endodontia', cid: 'K04.0', desc: 'Odontometria eletrônica, modelagem e selamento hermético de dois condutos.', baseKey: 'canal' },
  { id: 'cfo-endo-multirradicular', title: 'Tratamento Endodôntico Multirradicular (Molares)', specialty: 'Endodontia', cid: 'K04.0', desc: 'Desinfecção profunda com NaOCl ativado e obturação de 3 a 4 canais radiculares.', baseKey: 'canal' },
  { id: 'cfo-retratamento-endo', title: 'Retratamento Endodôntico com Desobturação e Remodelagem', specialty: 'Endodontia', cid: 'K04.1', desc: 'Remoção de material obturador prévio, descontaminação e reobturação biocerâmica.', baseKey: 'canal' },
  { id: 'cfo-instrumento-fraturado', title: 'Remoção ou Bypass de Instrumento Fraturado no Canal', specialty: 'Endodontia', cid: 'K04.9', desc: 'Intervenção sob microscopia operatória e ultrassom para resgate de lima fraturada.', baseKey: 'canal' },
  { id: 'cfo-selamento-perfuracao', title: 'Selamento Biocerâmico de Perfuração Radicular / Assoalho (MTA)', specialty: 'Endodontia', cid: 'K04.9', desc: 'Vedamento biológico de falsa via com agregado de trióxido mineral bioativo.', baseKey: 'canal' },
  { id: 'cfo-clareamento-interno', title: 'Clareamento Dental Interno de Dente Desvitalizado', specialty: 'Endodontia / Dentística', cid: 'K03.7', desc: 'Aplicação de agente oxidante intra-câmara com trocas programadas (walking bleach).', baseKey: 'clareamento' },

  // 4. Periodontia e Cirurgia Plástica Periodontal
  { id: 'cfo-raspagem-subgengival', title: 'Raspagem e Alisamento Radicular Subgengival (RAR)', specialty: 'Periodontia', cid: 'K05.3', desc: 'Remoção mecânica de cálculo e biofilme subgengival com curetas periodontais Gracey.', baseKey: 'periodontia' },
  { id: 'cfo-cirurgia-retalho-perio', title: 'Cirurgia Periodontal a Retalho para Acesso e Debridamento', specialty: 'Periodontia', cid: 'K05.3', desc: 'Descolamento cirúrgico de espessura total para raspagem aberta de defeitos intraósseos.', baseKey: 'periodontia' },
  { id: 'cfo-gengivoplastia', title: 'Gengivoplastia e Gengivectomia Estética (Sorriso Gengival)', specialty: 'Cirurgia Periodontal', cid: 'K06.8', desc: 'Remodelagem dos contornos gengivais e zênites estéticos com bisturi / laser.', baseKey: 'gengivoplastia' },
  { id: 'cfo-aumento-coroa', title: 'Aumento de Coroa Clínica com Osteotomia (Espaço Biológico)', specialty: 'Periodontia Cirúrgica', cid: 'K06.8', desc: 'Desgaste da crista óssea alveolar para restabelecimento da distância biológica.', baseKey: 'gengivoplastia' },
  { id: 'cfo-enxerto-conjuntivo', title: 'Enxerto de Tecido Conjuntivo Subepitelial (Recobrimento Radicular)', specialty: 'Cirurgia Periodontal Plástica', cid: 'K06.0', desc: 'Transplante de tecido do palato para recobrimento de recessão gengival e hipersensibilidade.', baseKey: 'enxerto_gengival' },
  { id: 'cfo-enxerto-livre', title: 'Enxerto Gengival Livre para Ganho de Faixa de Mucosa Ceratinizada', specialty: 'Periodontia', cid: 'K06.0', desc: 'Enxerto de mucosa mastigatória para estabilização tecidual peri-implantar e periodontal.', baseKey: 'enxerto_gengival' },

  // 5. Prótese Dentária e Reabilitação
  { id: 'cfo-coroa-zirconia', title: 'Coroa Total em Cerâmica Pura (Zircônia Translúcida / E-Max)', specialty: 'Prótese Dentária', cid: 'K08.4', desc: 'Preparo dental com acabamento em chanfro e cimentação adesiva resinosa definitiva.', baseKey: 'protese' },
  { id: 'cfo-coroa-metaloceramica', title: 'Coroa Protética Metalocerâmica Convencional', specialty: 'Prótese Dentária', cid: 'K08.4', desc: 'Infraestrutura metálica com cobertura cerâmica estética de alta resistência mastigatória.', baseKey: 'protese' },
  { id: 'cfo-inlay-onlay', title: 'Restauração Protética Indireta (Inlay / Onlay / Overlay Cerâmico)', specialty: 'Prótese / Dentística', cid: 'K02.1', desc: 'Peça protética usinada em CAD/CAM com preservação de cúspides dentárias hígidas.', baseKey: 'protese' },
  { id: 'cfo-ppr-grampo', title: 'Prótese Parcial Removível (PPR) com Grampos Metálicos Co-Cr', specialty: 'Prótese Dentária', cid: 'K08.4', desc: 'Armação fundida em cromo-cobalto com dentes acrílicos sobre selas edêntulas.', baseKey: 'protese' },
  { id: 'cfo-protese-total', title: 'Prótese Total Convencional (Dentadura Bimaxilar)', specialty: 'Prótese Dentária', cid: 'K08.1', desc: 'Moldagem funcional anatômica e confecção em resina acrílica termopolimerizável.', baseKey: 'protese' },
  { id: 'cfo-pino-fibra', title: 'Instalação de Retentor Intrarradicular (Pino de Fibra de Vidro)', specialty: 'Prótese / Dentística', cid: 'K08.8', desc: 'Desobturação parcial, condicionamento radicular e cimentação resinosa adesiva de pino.', baseKey: 'protese' },
  { id: 'cfo-ajuste-oclusal', title: 'Ajuste Oclusal Terapêutico por Desgaste Seletivo', specialty: 'Reabilitação Oral', cid: 'K07.6', desc: 'Refinamento de contatos oclusais prematuros e guias de desoclusão em canino/anterior.', baseKey: 'dtm' },

  // 6. Dentística Restauradora e Estética
  { id: 'cfo-restauracao-1face', title: 'Restauração Direta em Resina Composta (1 a 2 Faces)', specialty: 'Dentística', cid: 'K02.1', desc: 'Remoção de lesão cariosa, ataque ácido seletivo e estratificação biomimética.', baseKey: 'restauracao' },
  { id: 'cfo-restauracao-complexa', title: 'Restauração Direta Complexa em Resina Composta (3 a 4 Faces)', specialty: 'Dentística', cid: 'K02.1', desc: 'Reconstrução de cúspides e pontos de contato proximal com matrizes seccionadas.', baseKey: 'restauracao' },
  { id: 'cfo-facetas-resina', title: 'Facetas Diretas em Resina Composta (Estratificação Estética)', specialty: 'Dentística Estética', cid: 'K02.1', desc: 'Mapeamento cromático e estratificação com resinas de esmalte, dentina e efeito translúcido.', baseKey: 'facetas' },
  { id: 'cfo-fechamento-diastema', title: 'Fechamento de Diastemas com Resina Composta Nanohíbrida', specialty: 'Dentística Estética', cid: 'K07.5', desc: 'Condicionamento ácido e incremento estético proximal sem desgaste de estrutura hígida.', baseKey: 'restauracao' },
  { id: 'cfo-clareamento-laser', title: 'Clareamento Dental de Consultório (Peróxido de Hidrogênio 35%)', specialty: 'Dentística', cid: 'K03.7', desc: 'Aplicação de gel clareador com barreira gengival fotopolimerizável e monitoramento de sensibilidade.', baseKey: 'clareamento' },

  // 7. Ortodontia e Ortopedia Facial
  { id: 'cfo-orto-fixo', title: 'Instalação de Aparelho Ortodôntico Fixo Metálico / Cerâmico', specialty: 'Ortodontia', cid: 'K07.2', desc: 'Colagem de bráquetes, tubos molares e inserção de arcos de NiTi termativados.', baseKey: 'ortodontia' },
  { id: 'cfo-alinhador-invisivel', title: 'Tratamento Ortodôntico com Alinhadores Transparentes', specialty: 'Ortodontia Digital', cid: 'K07.2', desc: 'Escaneamento digital, planejamento virtual tridimensional e entrega seriada de alinhadores.', baseKey: 'ortodontia' },
  { id: 'cfo-disjuntor-palatino', title: 'Disjunção Palatina Rápida (Aparelho Expansor Hyrax / Haas)', specialty: 'Ortopedia Facial', cid: 'K07.1', desc: 'Instalação e ativação milimétrica diária para abertura da sutura intermaxilar.', baseKey: 'ortodontia' },
  { id: 'cfo-mini-implante-orto', title: 'Instalação de Mini-implante Ortodôntico de Ancoragem Esquelética', specialty: 'Ortodontia', cid: 'K07.2', desc: 'Inserção transmucosa de dispositivo inter-radicular para movimentação de corpo.', baseKey: 'ortodontia' },
  { id: 'cfo-contencao-orto', title: 'Instalação de Contenção Ortodôntica Fixa e Placa de Hawley/Essix', specialty: 'Ortodontia', cid: 'K07.9', desc: 'Manutenção do alinhamento dental para prevenção de recidiva e reorganização periodontal.', baseKey: 'ortodontia' },

  // 8. Odontopediatria
  { id: 'cfo-exo-deciduo', title: 'Exodontia de Dente Decíduo (Dente de Leite)', specialty: 'Odontopediatria', cid: 'K00.6', desc: 'Remoção de elemento temporário com rizólise avançada ou indicação ortodôntica.', baseKey: 'odontopediatria' },
  { id: 'cfo-pulpotomia-deciduo', title: 'Pulpotomia / Pulpectomia em Dente Decíduo', specialty: 'Odontopediatria', cid: 'K04.0', desc: 'Remoção da polpa coronária inflamada e aplicação de medicação biológica biocompatível.', baseKey: 'odontopediatria' },
  { id: 'cfo-restauracao-ionomero', title: 'Tratamento Restaurador Atraumático (ART) com Cimento de Ionômero', specialty: 'Odontopediatria', cid: 'K02.1', desc: 'Limpeza seletiva com instrumentos manuais e liberação contínua de flúor do CIV.', baseKey: 'odontopediatria' },
  { id: 'cfo-mantenedor-espaco', title: 'Instalação de Mantenedor de Espaço Fixo (Banda-Alça / Arco Lingual)', specialty: 'Odontopediatria', cid: 'K07.3', desc: 'Preservação do comprimento de arco dentário após perda precoce de dente de leite.', baseKey: 'odontopediatria' },

  // 9. DTM, Dor Orofacial e Ronco/Apneia
  { id: 'cfo-placa-oclusal', title: 'Placa Oclusal Estabilizadora Miorrelaxante em Resina Acrílica', specialty: 'DTM e Dor Orofacial', cid: 'K07.6', desc: 'Moldagem, montagem em articulador e desoclusão balanceada para alívio muscular.', baseKey: 'dtm' },
  { id: 'cfo-viscossuplementacao-atm', title: 'Artrocentese e Viscossuplementação da ATM com Ácido Hialurônico', specialty: 'DTM e Dor Orofacial', cid: 'K07.6', desc: 'Lavagem da cavidade articular e infiltração de hialuronato de sódio para lubrificação.', baseKey: 'dtm' },
  { id: 'cfo-ronco-apneia-aio', title: 'Aparelho Intraoral para Tratamento de Ronco e Apneia Obstrutiva (AIO)', specialty: 'Odontologia do Sono', cid: 'G47.3', desc: 'Dispositivo de avanço mandibular com titulação gradual para desobstrução das vias aéreas.', baseKey: 'ronco_apneia' },

  // 10. Harmonização Orofacial (HOF)
  { id: 'cfo-botox-terapeutico', title: 'Toxina Botulínica Terapêutica para Bruxismo e Cefaleia Tensional', specialty: 'Harmonização Orofacial', cid: 'M79.1', desc: 'Bloqueio seletivo da liberação de acetilcolina nos músculos masseter e temporal.', baseKey: 'harmonizacao' },
  { id: 'cfo-botox-estetico', title: 'Toxina Botulínica para Linhas de Expressão Facial e Sorriso Gengival', specialty: 'Harmonização Orofacial', cid: 'L98.9', desc: 'Atenuação temporária da contratilidade dos músculos mímicos frontais e periorais.', baseKey: 'harmonizacao' },
  { id: 'cfo-preenchimento-acido', title: 'Preenchimento Facial e Labial com Ácido Hialurônico Reticulado', specialty: 'Harmonização Orofacial', cid: 'L98.9', desc: 'Volumização e contorno labial/malar com cânula romba para minimizar risco vascular.', baseKey: 'harmonizacao' },
  { id: 'cfo-bioestimulador-colageno', title: 'Bioestimulador de Colágeno Facial (Hidroxiapatita de Cálcio / PLLA)', specialty: 'Harmonização Orofacial', cid: 'L98.9', desc: 'Injeção subdérmica para estímulo fibroblástico neocolagênese e espessamento dérmico.', baseKey: 'harmonizacao' },
  { id: 'cfo-bichectomia', title: 'Bichectomia — Exérese do Corpo Adiposo Bucal de Bichat', specialty: 'Cirurgia / HOF', cid: 'K13.7', desc: 'Remoção parcial de tecido adiposo profundo para redução de trauma mastigatório da bochecha.', baseKey: 'harmonizacao' },
  { id: 'cfo-fios-pdo', title: 'Fios de Polidioxanona (PDO) Espiculados e Lisos para Sustentação', specialty: 'Harmonização Orofacial', cid: 'L98.9', desc: 'Inserção de fios tensores bioabsorvíveis para tração tecidual e estímulo dérmico.', baseKey: 'harmonizacao' },

  // 11. Sedação e Odontologia Hospitalar
  { id: 'cfo-sedacao-oxido', title: 'Sedação Consciente Inalatória com Óxido Nitroso e Oxigênio (N₂O/O₂)', specialty: 'Sedação Consciente', cid: 'Z40.8', desc: 'Titulação gradual de mistura gasosa com monitoramento contínuo de oximetria de pulso.', baseKey: 'sedacao_oxido' },
  { id: 'cfo-laserterapia', title: 'Laserterapia de Baixa Potência para Cicatrização / Aftas / Parestesia', specialty: 'Laserterapia', cid: 'K12.0', desc: 'Fotobiomodulação celular atérmica com comprimento de onda vermelho e infravermelho.', baseKey: 'cirurgia_oral' }
];

// ==========================================================================
// CLÁUSULAS FORENSES DAS 17 CONDIÇÕES SISTÊMICAS ORIGINAIS (STJ / CFO / CDC)
// ==========================================================================
const ORIGINAL_SYSTEMIC_CLAUSES = {
  diabetes: `<div class="legal-clause-block warning-clause"><h5>CLÁUSULA — DIABETES MELLITUS E CONTROLE GLICÊMICO OBRIGATÓRIO</h5><p>O(A) paciente declara ser portador(a) de Diabetes Mellitus. Fica expressamente registrado que a hiperglicemia compromete a função dos neutrófilos e a quimiotaxia imunológica local, reduz a síntese de colágeno, eleva exponencialmente o risco de infecção bacteriana severa pós-operatória e retarda significativamente a cicatrização tecidual e óssea. O tratamento invasivo fica condicionado à comprovação de controle glicêmico adequado (glicemia de jejum e hemoglobina glicada — HbA1c). Em procedimento realizado sem controle metabólico comprovado, o(a) paciente assume integralmente os riscos biológicos adicionais decorrentes desta condição.</p></div>`,

  hipertensao: `<div class="legal-clause-block info-clause"><h5>CLÁUSULA — HIPERTENSÃO ARTERIAL SISTÊMICA (HAS)</h5><p>O(A) paciente declara ser hipertenso(a). Ficam pactuados os seguintes protocolos obrigatórios de segurança: anestésicos locais com vasoconstritor adrenérgico (epinefrina) serão utilizados com cautela e dosagem estritamente calculada; a pressão arterial será aferida antes de cada intervenção; em caso de PA acima dos parâmetros de segurança clínica (>180/110 mmHg), o procedimento eletivo será reagendado. Níveis pressóricos elevados aumentam o risco de sangramento intra e pós-operatório e reações cardiovasculares reflexas.</p></div>`,

  cardiopatia: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA CRÍTICA — CARDIOPATIA / RISCO DE ENDOCARDITE BACTERIANA INFECCIOSA (EBI)</h5><p>O(A) paciente declara ser portador(a) de cardiopatia. Procedimentos invasivos odontológicos (extrações, cirurgias, sondagem periodontal, implantes) induzem bacteremia transitória com risco grave de Endocardite Bacteriana Infecciosa (EBI) em pacientes com valvulopatias, próteses valvares ou cardiopatias congênitas específicas. A profilaxia antibiótica obrigatória (Amoxicilina 2g VO, 1h antes da intervenção — protocolo conjunto AHA/SBC) foi expressamente prescrita e deve ser rigorosamente cumprida pelo paciente.</p></div>`,

  bisfosfonatos: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA CRÍTICA — BISFOSFONATOS / ANTI-REABSORTIVOS ÓSSEOS — RISCO DE OSTEONECROSE DOS MAXILARES (MRONJ / OMAM)</h5><p>O(A) paciente declara fazer ou ter feito uso de Bisfosfonatos (Alendronato/Fosamax®, Zoledronato/Zometa®, Ibandronato, Pamidronato) ou outros anti-reabsortivos/antiangiogênicos ósseos (Denosumabe/Prolia® ou Xgeva®). Fica EXPRESSAMENTE ADVERTIDO(A) que cirurgias invasivas nos maxilares (exodontias, implantes, cirurgias periodontais e ósseas) em usuários destas medicações representam ALTO RISCO de Osteonecrose dos Maxilares Associada a Medicamentos (MRONJ/OMAM), complicação grave e de difícil tratamento caracterizada por necrose óssea avascular exposta que não cicatriza, dor crônica e perda de suporte ósseo progressiva. A avaliação prévia do médico oncologista/reumatologista prescribente É OBRIGATÓRIA. O(A) paciente assume plena ciência pericial deste risco grave.</p></div>`,

  anticoagulantes: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA CRÍTICA — ANTICOAGULANTES E ANTIAGREGANTES PLAQUETÁRIOS — RISCO DE HEMORRAGIA</h5><p>O(A) paciente declara fazer uso de anticoagulantes (Varfarina/Marevan®, Rivaroxabana/Xarelto®, Apixabana/Eliquis®, Dabigatrana/Pradaxa®) e/ou antiagregantes plaquetários (AAS, Clopidogrel/Plavix®, Ticagrelor). Fica EXPRESSAMENTE ALERTADO(A): JAMAIS deve suspender, reduzir ou alterar a medicação por conta própria sem consentimento formal do seu médico cardiologista ou hematologista assistente, pois a interrupção não autorizada pode provocar trombose, infarto do miocárdio ou AVC. Para a intervenção odontológica, adotar-se-á hemostasia cirúrgica reforçada (sutura oclusiva, esponjas hemostáticas de colágeno, ácido tranexâmico tópico) e monitoramento rigoroso de sangramento.</p></div>`,

  corticoides: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA CRÍTICA — CORTICOIDES EM USO CONTÍNUO (>2 SEMANAS) — RISCO DE CRISE ADDISONIANA</h5><p>O(A) paciente declara fazer uso contínuo de corticosteroides sistêmicos (Prednisona, Dexametasona, Betametasona) por período superior a duas semanas. O uso crônico suprime o eixo hipotálamo-hipófise-suprarrenal (HHA), inibindo a produção fisiológica de cortisol endógeno sob estresse cirúrgico. Isso impõe risco de Crise Addisoniana aguda intraoperatória (hipotensão severa, colapso cardiovascular e choque). O protocolo de cobertura esteroide ("Steroid Coverage") será avaliado em conjunto com o médico prescribente, ciente ainda dos riscos adicionais de cicatrização atrófica e infecções oportunistas.</p></div>`,

  imunossupressores: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA CRÍTICA — IMUNOSSUPRESSORES / QUIMIOTERAPIA SISTÊMICA</h5><p>O(A) paciente declara fazer uso de imunossupressores (Metotrexato, Ciclosporina, Azatioprina, Imunobiológicos) ou estar sob quimioterapia antineoplásica. Ficam documentados os riscos periciais de: mucosite oral, infecções bacterianas e fúngicas oportunistas extensas, cicatrização gravemente retardada e mielossupressão. Hemograma completo recente e anuência por escrito do oncologista ou médico assistente são indispensáveis antes de qualquer procedimento invasivo.</p></div>`,

  hiv: `<div class="legal-clause-block warning-clause"><h5>CLÁUSULA — HIV / IMUNODEFICIÊNCIA SISTÊMICA</h5><p>O(A) paciente declara ser portador(a) de HIV ou condição de imunodeficiência adquirida. O atendimento é realizado sob rigoroso cumprimento dos protocolos de biossegurança universal (normas ANVISA/CFO). Ficam registrados os riscos de cicatrização lenta, suscetibilidade aumentada a infecções oportunistas pós-operatórias e necessidade de acompanhamento dos parâmetros laboratoriais de contagem de linfócitos T-CD4 e carga viral antes de atos cirúrgicos maiores.</p></div>`,

  gestante: `<div class="legal-clause-block warning-clause"><h5>CLÁUSULA — GESTAÇÃO / LACTAÇÃO</h5><p>A paciente declara estar grávida ou em período de aleitamento materno. Protocolos de biossegurança obstétrica aplicados: exames radiográficos serão evitados no primeiro trimestre e limitados estritamente ao indispensável com avental de chumbo e protetor de tireoide; seleção de anestésico local padrão-ouro de comprovada segurança gestacional (Lidocaína 2% com epinefrina 1:100.000 — categoria B na FDA); prescrição farmacológica restrita a analgésicos seguros conforme liberação obstétrica.</p></div>`,

  autoimune: `<div class="legal-clause-block warning-clause"><h5>CLÁUSULA — DOENÇA AUTOIMUNE (LÚPUS / ARTRITE REUMATOIDE / SJÖGREN)</h5><p>O(A) paciente declara diagnóstico de doença autoimune sistêmica. Fica registrado que distúrbios da imunorregulação e o uso de agentes biológicos podem modular negativamente a cicatrização tecidual, a estabilidade de enxertos e a resposta anti-infecciosa. Autorização do médico reumatologista assistente e planejamento operatório atraumático foram estabelecidos para a intervenção.</p></div>`,

  ansiedade: `<div class="legal-clause-block info-clause"><h5>CLÁUSULA — ANSIEDADE ODONTOLÓGICA / ODONTOFOBIA / SÍNCOPE VASOVAGAL</h5><p>O(A) paciente declara apresentar elevado grau de ansiedade odontológica, histórico de odontofobia ou de síncope vasovagal/pânico em consultório. Fica estabelecido que o profissional fará pausas regulares durante a sessão, monitorará os sinais de relaxamento e interromperá prontamente o ato mediante qualquer solicitação do paciente. O paciente fica ciente da disponibilidade de protocolos de sedação consciente inalatória ou pré-medicação ansiolítica oral quando indicadas.</p></div>`,

  fumante: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA — TABAGISMO ATIVO (COMPROMETIMENTO MICROVASCULAR)</h5><p>O(A) paciente declara ser fumante ativo(a). O consumo contínuo de nicotina e monóxido de carbono induz vasoconstrição microvascular periférica persistente e hipóxia tecidual. A literatura científica mundial documenta que o tabagismo eleva em 3 a 5 vezes o risco de: falha de osseointegração de implantes, necrose de enxertos ósseos e conjuntivos, deiscência de sutura, alveolite seca e progressão de peri-implantite. O(A) paciente é orientado(a) a abster-se do fumo no peroperatório e assume os riscos biológicos inerentes à manutenção do hábito.</p></div>`,

  bruxismo: `<div class="legal-clause-block warning-clause"><h5>CLÁUSULA — BRUXISMO / PARAFUNÇÃO OCLUSAL</h5><p>O(A) paciente apresenta histórico ou diagnóstico clínico de bruxismo (apertamento ou ranger involuntário de dentes). As cargas mecânicas oclusais parafuncionais excedem largamente os limites fisiológicos dos dentes e implantes. Ficam documentados os riscos aumentados de fratura ou lascamento (chipping) de cerâmicas e resinas, descimentação de coroas, soltura de parafusos protéticos e sobrecarga óssea peri-implantar. O(A) paciente COMPROMETE-SE a confeccionar e usar rigorosamente a placa oclusal estabilizadora noturna prescrita.</p></div>`,

  perda_ossea: `<div class="legal-clause-block info-clause"><h5>CLÁUSULA — LIMITAÇÃO ANATÔMICA E REABSORÇÃO ÓSSEA ALVEOLAR PRÉVIA</h5><p>Exames radiográficos e tomográficos prévios evidenciam atrofia ou reabsorção óssea moderada a severa na área de intervenção. Fica esclarecido que a altura e espessura óssea diminuídas impõem proximidade crítica com estruturas anatômicas nobres (nervo alveolar inferior, seio maxilar, forame mentual), podendo exigir cirurgias prévias ou simultâneas de enxertia óssea ou ancoragem especial.</p></div>`,

  alergia_geral: `<div class="legal-clause-block danger-clause"><h5>CLÁUSULA — ALERGIAS MEDICAMENTOSAS / LÁTEX / METAIS / ANESTÉSICOS</h5><p>O(A) paciente declara histórico de hipersensibilidade ou reações alérgicas a fármacos (penicilinas, amoxicilina, sulfas, analgésicos), soluções anestésicas com bissulfito, látex ou metais odontológicos. Todo o planejamento clínico e a prescrição pós-operatória foram estritamente ajustados para formulações alternativas seguras. Em caso de manifestações alérgicas agudas, medidas imediatas de suporte serão adotadas.</p></div>`,

  periodontite: `<div class="legal-clause-block warning-clause"><h5>CLÁUSULA — PERIODONTITE / DOENÇA PERIODONTAL ATIVA</h5><p>O(A) paciente apresenta quadro de periodontite ativa (sangramento gengival, bolsas periodontais patológicas e perda de inserção conjuntiva). A presença de bactérias periodontopatogênicas ativas constitui fator de risco documentado de insucesso e colonização bacteriana peri-implantar precoce. O tratamento periodontal de raspagem e adequação do meio bucal é condição prévia indispensável para a manutenção do resultado cirúrgico.</p></div>`,

  expectativa_irreal: `<div class="legal-clause-block info-clause"><h5>CLÁUSULA — LIMITES BIOLÓGICOS E EXPECTATIVAS ESTÉTICAS</h5><p>O cirurgião-dentista esclareceu exaustivamente que a resposta tecidual estética depende estritamente das condições anatômicas prévias, formato facial, espessura do biótipo gengival, linha do sorriso e capacidade biológica individual de regeneração. O tratamento busca a melhor harmonia funcional e estética possível dentro dos limites biológicos da odontologia baseada em evidências, não constituindo obrigação de perfeição inalcançável.</p></div>`
};

// Aliases para compatibilidade perfeita
ORIGINAL_SYSTEMIC_CLAUSES.penicilina = ORIGINAL_SYSTEMIC_CLAUSES.alergia_geral;
ORIGINAL_SYSTEMIC_CLAUSES.bisfosfonato = ORIGINAL_SYSTEMIC_CLAUSES.bisfosfonatos;
ORIGINAL_SYSTEMIC_CLAUSES.anticoagulante = ORIGINAL_SYSTEMIC_CLAUSES.anticoagulantes;
ORIGINAL_SYSTEMIC_CLAUSES.corticoid = ORIGINAL_SYSTEMIC_CLAUSES.corticoides;
ORIGINAL_SYSTEMIC_CLAUSES.imunossupressor = ORIGINAL_SYSTEMIC_CLAUSES.imunossupressores;

// ==========================================================================
// CATÁLOGO EXPANDIDO DE CONDIÇÕES SISTÊMICAS & FÁRMACOS COM BUSCA (40+ Itens)
// ==========================================================================
const EXTENDED_CONDITIONS_CATALOG = [
  { id: 'alergia_dipirona', label: '⚠️ Alergia a Dipirona Sódica', category: 'Alergias', risk: 'danger', clauseTitle: 'ALERGIA A DIPIRONA SÓDICA', clauseText: 'O(A) paciente declara alergia/hipersensibilidade conhecida à Dipirona Sódica. Fica expressamente vedada a prescrição de dipirona ou de compostos analgésicos que a contenham. A analgesia será conduzida com alternativas seguras (Paracetamol ou AINEs tolerados).' },
  { id: 'alergia_aines', label: '⚠️ Alergia a AINEs (Ibuprofeno/Aspirina)', category: 'Alergias', risk: 'danger', clauseTitle: 'ALERGIA A ANTI-INFLAMATÓRIOS (AINEs)', clauseText: 'O(A) paciente relata histórico de reação alérgica ou broncoespasmo a anti-inflamatórios não esteroidais (Ibuprofeno, AAS, Cetoprofeno, Diclofenaco). Fica contraindicado o uso desta classe; a inflamação e dor serão controladas com analgésicos puros ou corticoterapia prévia orientada.' },
  { id: 'alergia_latex', label: '⚠️ Alergia ao Látex (Latex-Free)', category: 'Alergias', risk: 'danger', clauseTitle: 'ALERGIA AO LÁTEX (PROTOCOLO LATEX-FREE)', clauseText: 'Atendimento com protocolo rigoroso livre de látex: utilização de luvas sintéticas de nitrila/vinil, diques de borracha sintética e ausência de contato com êmbolos ou materiais contendo látex natural para prevenir choque anafilático.' },
  { id: 'alergia_metais', label: '⚠️ Alergia a Metais (Níquel / Cobalto / Cromo)', category: 'Alergias', risk: 'warning', clauseTitle: 'ALERGIA A METAIS ODONTOLÓGICOS', clauseText: 'Histórico de dermatite de contato a ligas metálicas básicas. Todas as próteses ou componentes serão confeccionados em titânio comercialmente puro, zircônia ou cerâmicas sem metal (metal-free).' },
  { id: 'alergia_anestesico_sulfito', label: '⚠️ Alergia a Bissulfito (Conservante Anestésico)', category: 'Alergias', risk: 'danger', clauseTitle: 'ALERGIA A BISSULFITO DE SÓDIO EM ANESTÉSICOS', clauseText: 'O(A) paciente relata hipersensibilidade ao antioxidante metabissulfito de sódio. Fica determinado o uso exclusivo de anestésicos locais sem vasoconstritores adrenérgicos (ex: Mepivacaína 3% sem vasoconstritor ou Prilocaina com Felipressina).' },
  { id: 'alergia_sulfa', label: '⚠️ Alergia a Sulfas / Sulfonamidas', category: 'Alergias', risk: 'warning', clauseTitle: 'ALERGIA A SULFONAMIDAS', clauseText: 'Contraindicação formal ao uso de antibióticos sulfonamídicos e hemostáticos locais sulfurados. Terapia antimicrobiana direcionada exclusivamente a classes betalactâmicas ou macrolídeos.' },
  { id: 'alergia_iodo', label: '⚠️ Alergia a Iodo / Antissépticos Iodados', category: 'Alergias', risk: 'warning', clauseTitle: 'ALERGIA A IODO E COMPOSTOS IODADOS', clauseText: 'Fica vedada a antissepsia perioral com iodopovidona (PVPI). A degermação e assepsia cirúrgica serão conduzidas obrigatoriamente com Digliconato de Clorexidina a 0,12% ou 2%.' },
  { id: 'asma', label: '🫁 Asma Brônquica / Hiper-reatividade', category: 'Respiratório', risk: 'warning', clauseTitle: 'ASMA BRÔNQUICA E HIPER-REATIVIDADE DAS VIAS AÉREAS', clauseText: 'O paciente possui diagnóstico de asma brônquica. Deverá portar seu inalador broncodilatador (Salbutamol) em todas as consultas. Procedimentos indutores de ansiedade serão conduzidos com pausas; AINEs que desencadeiem broncoespasmo serão rigorosamente evitados.' },
  { id: 'dpoc', label: '🫁 DPOC / Enfisema Pulmonar', category: 'Respiratório', risk: 'warning', clauseTitle: 'DOENÇA PULMONAR OBSTRUTIVA CRÔNICA (DPOC)', clauseText: 'Acometimento de função ventilatória pulmonar. O posicionamento na cadeira odontológica evitará a posição supina completa para não agravar a ortopneia. Monitoramento constante e cautela com sedativos que deprimam o centro respiratório.' },
  { id: 'insuficiencia_renal', label: '🩺 Insuficiência Renal Crônica (IRC) / Diálise', category: 'Nefrologia', risk: 'danger', clauseTitle: 'INSUFICIÊNCIA RENAL CRÔNICA / HEMODIÁLISE', clauseText: 'Paciente em terapia dialítica ou com depuração de creatinina reduzida. Procedimentos cirúrgicos eletivos serão marcados para o dia seguinte à sessão de hemodiálise (para depuração da heparina). Posologias medicamentosas ajustadas à taxa de filtração glomerular; não aferir PA no braço com fístula arteriovenosa.' },
  { id: 'hepatite_cirrose', label: '🩸 Hepatite Viral / Insuficiência Hepática', category: 'Hepatologia', risk: 'danger', clauseTitle: 'INSUFICIÊNCIA HEPÁTICA / HEPATOPATIA CRÔNICA', clauseText: 'O comprometimento dos hepatócitos prejudica a síntese dos fatores de coagulação dependentes de vitamina K e o metabolismo de fármacos amida. Exames laboratoriais de coagulograma prévios são mandatórios e as doses anestésicas serão reduzidas.' },
  { id: 'epilepsia', label: '🧠 Epilepsia / Histórico de Convulsões', category: 'Neurologia', risk: 'warning', clauseTitle: 'EPILEPSIA / DISTÚRBIOS CONVULSIVOS', clauseText: 'Paciente sob uso de medicamentos anticonvulsivantes (ex: carbamazepina, fenitoína). O cirurgião-dentista manterá controle ambiental de estresse e fotossensibilidade para afastar estímulos gatilhos; avaliação de eventual hiperplasia gengival induzida por fenitoína.' },
  { id: 'avc_previo', label: '🧠 AVC / Isquemia Cerebral Prévia', category: 'Neurologia', risk: 'danger', clauseTitle: 'HISTÓRICO DE ACIDENTE VASCULAR CEREBRAL (AVC)', clauseText: 'Paciente com evento isquêmico ou hemorrágico cerebral prévio. Exige-se monitoramento minucioso de pressão arterial, sessões clínicas curtas matinais e avaliação atenta de medicamentos antiagregantes e anticoagulantes concomitantes.' },
  { id: 'iam_stent', label: '❤️ Infarto do Miocárdio Prévio / Stent Coronário', category: 'Cardiologia', risk: 'danger', clauseTitle: 'INFARTO AGUDO DO MIOCÁRDIO PRÉVIO / STENT CORONÁRIO', clauseText: 'Presença de coronariopatia isquêmica ou prótese de stent intravascular. Procedimentos cirúrgicos eletivos respeitarão janela de segurança pós-infarto (mínimo 6 meses) e manutenção das diretrizes de dupla antiagregação plaquetária sob orientação cardiológica.' },
  { id: 'marcapasso', label: '⚡ Portador de Marcapasso Cardíaco / CDI', category: 'Cardiologia', risk: 'warning', clauseTitle: 'PORTADOR DE MARCAPASSO CARDÍACO / DESFIBRILADOR (CDI)', clauseText: 'Presença de dispositivo eletrônico cardíaco implantado. Fica proibido o uso de bisturi elétrico monopolar convencional e aparelhos ultrassônicos cavitários não blindados adjacentes ao tórax, prevenindo interferência eletromagnética arritmogênica.' },
  { id: 'protese_valvar', label: '❤️ Prótese Valvar Cardíaca Mecânica / Biológica', category: 'Cardiologia', risk: 'danger', clauseTitle: 'PRÓTESE VALVAR CARDÍACA — ALTO RISCO DE ENDOCARDITE', category: 'Cardiologia', risk: 'danger', clauseText: 'Alto risco de endocardite bacteriana infecciosa. Cumprimento estrito de profilaxia antimicrobiana prévia de alta dose (Amoxicilina 2g ou Azitromicina 500mg) 1 hora antes de qualquer ato odontológico que envolva manipulação gengival ou perfuração de mucosa.' },
  { id: 'febre_reumatica', label: '❤️ Febre Reumática com Sequela Valvar', category: 'Cardiologia', risk: 'danger', clauseTitle: 'FEBRE REUMÁTICA COM COMPROMETIMENTO VALVAR', clauseText: 'Sequela valvar pós-estreptocócica. Indicação expressa de profilaxia antibiótica para procedimentos invasivos segundo normas vigentes da SBC e AHA.' },
  { id: 'radioterapia_cabeca_pescoco', label: '☢️ Radioterapia Prévia em Cabeça e Pescoço', category: 'Oncologia', risk: 'danger', clauseTitle: 'ALERTA MÁXIMO — RADIOTERAPIA EM CABEÇA E PESCOÇO (OSTEORRADIONECROSE)', clauseText: 'A irradiação óssea na região maxilomandibular acarreta hipovascularização, hipocelularidade e hipóxia permanente (Tríade de Marx). Procedimentos cirúrgicos (exodontias/implantes) acarretam ALTÍSSIMO RISCO de OSTEORRADIONECROSE (ORN), complicação grave e mutilante. Autorização médica por escrito e protocolos de suporte são obrigatórios.' },
  { id: 'quimioterapia', label: '💊 Quimioterapia Sistêmica Recente (últimos 6 meses)', category: 'Oncologia', risk: 'danger', clauseTitle: 'QUIMIOTERAPIA SISTÊMICA RECENTE', clauseText: 'Tratamento oncológico citotóxico recente. Riscos severos de neutropenia febril, sangramento por plaquetopenia e mucosite oral destrutiva. Procedimentos invasivos apenas após liberação do hemograma com neutrófilos e plaquetas em níveis seguros.' },
  { id: 'tireoide_descompensada', label: '🦋 Distúrbio da Tireoide (Hipo/Hipertireoidismo)', category: 'Endocrinologia', risk: 'warning', clauseTitle: 'DISTÚRBIOS DA TIREOIDE DESCOMPENSADOS', clauseText: 'Hipertireoidismo descompensado contraindica uso de aminas simpaticomiméticas (risco de tempestade tireotóxica e fibrilação atrial). Hipotireoidismo acentuado pode prolongar a sedação e diminuir o metabolismo hepático de anestésicos.' },
  { id: 'anemia_severa', label: '🩸 Anemia Severa / Anemia Falciforme', category: 'Hematologia', risk: 'danger', clauseTitle: 'ANEMIA SEVERA / DOENÇA FALCIFORME', clauseText: 'Oxigenação tecidual comprometida. Em pacientes falciformes, o estresse, frio, desidratação e hipóxia podem deflagrar crise álgica de falcização óssea. Protocolo cirúrgico rápido com oxigenação tecidual otimizada e analgesia eficaz.' },
  { id: 'plaquetopenia', label: '🩸 Trombocitopenia / Plaquetopenia (< 50.000)', category: 'Hematologia', risk: 'danger', clauseTitle: 'TROMBOCITOPENIA / DISTÚRBIOS PLAQUETÁRIOS', clauseText: 'Contagem de plaquetas reduzida com alto risco de hemostasia primária ineficaz e sangramento incoercível. Intervenções cirúrgicas condicionadas à avaliação prévia da contagem plaquetária e suporte com agentes hemostáticos locais e hemostasia por compressão prolongada.' },
  { id: 'coagulopatia_hemofilia', label: '🩸 Hemofilia A / B ou Doença de Von Willebrand', category: 'Hematologia', risk: 'danger', clauseTitle: 'COAGULOPATIA HEREDITÁRIA (HEMOFILIA / VON WILLEBRAND)', clauseText: 'Deficiência congênita de fatores de coagulação (Fator VIII ou IX). O procedimento odontológico requer reposição de fator concentrado em ambiente com suporte hematológico e contraindicação absoluta a bloqueios anestésicos profundos do nervo alveolar sem preparo prévio.' },
  { id: 'glaucoma', label: '👁️ Glaucoma de Ângulo Estreito', category: 'Oftalmologia', risk: 'warning', clauseTitle: 'GLAUCOMA DE ÂNGULO ESTREITO', clauseText: 'Contraindicação formal a anticolinérgicos e cautela com doses adrenérgicas elevadas que possam provocar midríase reflexa e bloqueio pupilar com elevação súbita da pressão intraocular.' },
  { id: 'refluxo_drge', label: '🔥 Refluxo Gastroesofágico Severo (DRGE)', category: 'Gastroenterologia', risk: 'info', clauseTitle: 'REFLUXO GASTROESOFÁGICO SEVERO (DRGE)', clauseText: 'Acometimento de mucosa gástrica e esofágica. Recomenda-se posicionamento com cabeceira elevada a 45 graus para prevenir regurgitação ácida intraoperatória e broncoaspiração.' },
  { id: 'crohn_retocolite', label: '🩺 Doença de Crohn / Retocolite Ulcerativa', category: 'Gastroenterologia', risk: 'warning', clauseTitle: 'DOENÇA INFLAMATÓRIA INTESTINAL (CROHN / RCU)', clauseText: 'Uso frequente de corticosteroides ou imunobiológicos para controle intestinal. Risco aumentado de manifestações orais aftosas e comprometimento de absorção de medicamentos orais.' },
  { id: 'antidepressivo_triciclico', label: '🧠 Uso de Antidepressivo Tricíclico (Amitriptilina)', category: 'Farmacologia', risk: 'warning', clauseTitle: 'INTERAÇÃO FARMACOLÓGICA — ANTIDEPRESSIVOS TRICÍCLICOS', clauseText: 'O uso de amitriptilina ou nortriptilina potencializa a resposta vasopressora adrenérgica da epinefrina/noradrenalina em até 2 a 3 vezes, elevando o risco de arritmias e crise hipertensiva aguda. Doses de vasoconstritor serão rigorosamente limitadas ao mínimo técnico.' },
  { id: 'uso_imao', label: '🧠 Uso de Inibidores da MAO (IMAO)', category: 'Farmacologia', risk: 'danger', clauseTitle: 'INTERAÇÃO CRÍTICA — INIBIDORES DA MONOAMINOXIDASE (IMAO)', clauseText: 'Pacientes em uso de IMAO possuem risco severo de tempestade adrenérgica, hipertensão maligna e hipertermia quando expostos a vasopressores ou certos opioides (ex: meperidina). Requer uso de anestésicos selecionados sem vasoconstritores adrenérgicos.' },
  { id: 'uso_litio', label: '🧠 Uso Contínuo de Lítio (Carbonato de Lítio)', category: 'Farmacologia', risk: 'warning', clauseTitle: 'INTERAÇÃO — LÍTIO E ANTI-INFLAMATÓRIOS (AINEs)', clauseText: 'Anti-inflamatórios não esteroidais (Ibuprofeno, Cetoprofeno, Diclofenaco) diminuem a depuração renal do lítio, elevando seus níveis plasmáticos com risco de toxicidade neurotóxica grave. AINEs estão proscritos; a dor será tratada com Paracetamol.' },
  { id: 'anticonvulsivante', label: '💊 Uso de Fenitoína / Anticonvulsivantes', category: 'Farmacologia', risk: 'info', clauseTitle: 'USO CRÔNICO DE ANTICONVULSIVANTES', clauseText: 'O uso prolongado de fenitoína induz predisposição à hiperplasia gengival medicamentosa fibrosa. Requer profilaxia periodontal e cuidados estritos de higiene oral assistida.' },
  { id: 'fitoterapicos', label: '🌿 Fitoterápicos Anticoagulantes (Ginkgo Biloba / Ginseng)', category: 'Farmacologia', risk: 'warning', clauseTitle: 'USO DE FITOTERÁPICOS COM AÇÃO ANTICOAGULANTE', clauseText: 'Compostos como Ginkgo Biloba, Ginseng, Alho concentrado e Castanha da Índia inibem a agregação plaquetária e elevam o tempo de sangramento cirúrgico. Medidas de hemostasia local reforçada serão empregadas.' },
  { id: 'rinite_respirador_bucal', label: '👃 Respiração Bucal Crônica / Rinite Severa', category: 'Respiratório', risk: 'info', clauseTitle: 'RESPIRAÇÃO BUCAL CRÔNICA', clauseText: 'Paciente com obstrução das vias aéreas superiores e dependência do fluxo de ar bucal. A utilização de dique de borracha para isolamento absoluto será adaptada e monitorada para evitar sensação de asfixia.' },
  { id: 'pne', label: '♿ Portador de Necessidades Especiais (PNE)', category: 'Especial', risk: 'warning', clauseTitle: 'ATENDIMENTO A PACIENTE COM NECESSIDADES ESPECIAIS (PNE)', clauseText: 'Atendimento sob metodologia de comunicação inclusiva, sessões moduladas e apoio de acompanhante ou cuidador responsável para garantir o máximo conforto e bem-estar durante todo o ato odontológico.' },
  { id: 'tea', label: '🧩 Transtorno do Espectro Autista (TEA)', category: 'Especial', risk: 'info', clauseTitle: 'TRANSTORNO DO ESPECTRO AUTISTA (TEA)', clauseText: 'Protocolo de ambientação sensorial prévia: redução de estímulos visuais e sonoros abruptos (luz de refletor atenuada, redução de ruído de sugador), técnica de dizer-mostrar-fazer e atendimento acolhedor adaptado.' },
  { id: 'sjogren', label: '💧 Síndrome de Sjögren / Boca Seca Severa', category: 'Imunologia', risk: 'info', clauseTitle: 'SÍNDROME DE SJÖGREN / XEROSTOMIA SEVERA', clauseText: 'A ausência do fluxo salivar protetor natural acarreta mucosa friável, suscetibilidade a lesões por atrito de instrumentos e risco multiplicado de cárie de raiz. Uso de hidratantes orais e lubrificação frequente durante a consulta.' },
  { id: 'penfigo', label: '🧬 Pênfigo Vulgar / Penfigoide Mucoso', category: 'Imunologia', risk: 'danger', clauseTitle: 'PÊNFIGO VULGAR / PENFIGOIDE DE MEMBRANAS MUCOSAS', clauseText: 'Fragilidade extrema do epitélio mucoso oral com formação de bolhas acantolíticas sob pressão mecânica mínima (Sinal de Nikolsky positivo). A instrumentação deve ser minimamente traumática para evitar descamação tecidual extensa.' },
  { id: 'liquen_plano', label: '🧬 Líquen Plano Oral (Erosivo / Reticular)', category: 'Imunologia', risk: 'warning', clauseTitle: 'LÍQUEN PLANO ORAL', clauseText: 'Doença inflamatória crônica imuno-mediada. Lesões erosivas ou atróficas podem cursar com ardor acentuado. Evitam-se produtos de higiene irritantes, bochechos alcoólicos e manobras traumáticas sobre as estrias de Wickham.' }
];

// Presets de Receituário
const RX_PRESETS = {
  cirurgico: {
    name: '🦷 Cirúrgico / Sisos / Implantes',
    desc: 'Amoxicilina + Ibuprofeno + Dipirona',
    items: [
      { name: 'Amoxicilina 500mg', dose: '500mg', freq: '8 em 8 horas', duration: '7 dias', qty: '1 caixa (21 cápsulas)', instructions: 'Tomar 1 cápsula via oral de 8 em 8 horas durante 7 dias contínuos.' },
      { name: 'Ibuprofeno 600mg', dose: '600mg', freq: '8 em 8 horas', duration: '3 dias', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral de 8 em 8 horas durante 3 dias para controle de edema.' },
      { name: 'Dipirona Sódica 1g', dose: '1g', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral de 6 em 6 horas somente em caso de dor.' }
    ]
  },
  alergico: {
    name: '🛡️ Alérgico a Penicilina',
    desc: 'Azitromicina + Paracetamol',
    items: [
      { name: 'Azitromicina 500mg', dose: '500mg', freq: '1x ao dia', duration: '3 dias', qty: '1 caixa (3 comprimidos)', instructions: 'Tomar 1 comprimido via oral 1 vez ao dia durante 3 dias (1h antes ou 2h após refeição).' },
      { name: 'Paracetamol 750mg', dose: '750mg', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral de 6 em 6 horas se houver dor ou febre.' }
    ]
  },
  canal: {
    name: '⚡ Canal / Dor Aguda',
    desc: 'Toragesic SL + Dipirona',
    items: [
      { name: 'Toragesic (Cetorolaco SL) 10mg', dose: '10mg', freq: '8 em 8 horas', duration: '2 dias', qty: '1 caixa (10 comprimidos)', instructions: 'Dissolver 1 comprimido sob a língua de 8 em 8 horas (uso máximo de 48 horas).' },
      { name: 'Dipirona Sódica 1g', dose: '1g', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral se houver dor persistente.' }
    ]
  },
  leve: {
    name: '🌿 Analgesia Simples / Leve',
    desc: 'Dipirona 500mg',
    items: [
      { name: 'Dipirona Sódica 500mg', dose: '500mg', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 a 2 comprimidos via oral de 6 em 6 horas se dor.' }
    ]
  },
  hof: {
    name: '✨ HOF / Pós-Estético',
    desc: 'Paracetamol + Pomada de Arnica',
    items: [
      { name: 'Paracetamol 750mg', dose: '750mg', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido a cada 6 horas se desconforto (evitar anti-inflamatórios que aumentam manchas).' },
      { name: 'Gel / Pomada de Arnica Montana', dose: 'Tópico', freq: '3x ao dia', duration: '5 dias', qty: '1 bisnaga', instructions: 'Aplicar suavemente sobre as regiões tratadas com hematomas ou inchaço.' }
    ]
  }
};

// ==========================================================================
// Inicialização do Aplicativo
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedDentistInfo();
  loadSavedPatientsList();
  setupMasks();
  renderLudicOdontogram();
  setupTouchSignature();
  renderExtendedConditionsList();
  renderCfoSpecialties();
  renderCfoProceduresList();
  showScreen('screen-dentist');
});

// ==========================================================================
// Gerenciador de Telas Guiadas
// ==========================================================================
function showScreen(screenId) {
  state.activeScreen = screenId;

  document.querySelectorAll('.wizard-screen').forEach(el => {
    el.classList.toggle('active-screen', el.id === screenId);
  });

  updateStepperIndicators(screenId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepperIndicators(screenId) {
  const steps = {
    'screen-dentist': 1,
    'screen-patient': 1,
    'screen-procedure': 2,
    'screen-review': 3,
    'screen-tcle': 3
  };
  const currentStep = steps[screenId] || 1;

  document.querySelectorAll('.step-indicator').forEach(ind => {
    const s = parseInt(ind.getAttribute('data-step'), 10);
    ind.classList.toggle('active', s === currentStep);
    ind.classList.toggle('completed', s < currentStep);
  });
}

// Alternador de Tema Claro / Escuro
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  try {
    localStorage.setItem('dentalsafe_express_theme', isDark ? 'dark' : 'light');
  } catch (e) {}
}

function initTheme() {
  try {
    const saved = localStorage.getItem('dentalsafe_express_theme');
    if (saved === 'dark') document.body.classList.add('dark-mode');
  } catch (e) {}
}

// ==========================================================================
// Tela 1A: Dados do Cirurgião-Dentista
// ==========================================================================
function loadSavedDentistInfo() {
  try {
    const saved = localStorage.getItem('dentalsafe_express_dentist');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name) {
        state.dentist = { ...state.dentist, ...data };
        const nameEl = document.getElementById('field-dentist-name');
        const croEl = document.getElementById('field-dentist-cro');
        const clinicEl = document.getElementById('field-clinic-name');
        const phoneEl = document.getElementById('field-clinic-phone');
        if (nameEl) nameEl.value = data.name || '';
        if (croEl) croEl.value = data.cro || '';
        if (clinicEl) clinicEl.value = data.clinic || '';
        if (phoneEl) phoneEl.value = data.phone || '';
      }
    }
  } catch (e) {}
}

function submitDentistScreen() {
  const name = document.getElementById('field-dentist-name')?.value.trim();
  const cro = document.getElementById('field-dentist-cro')?.value.trim();
  const clinic = document.getElementById('field-clinic-name')?.value.trim();
  const phone = document.getElementById('field-clinic-phone')?.value.trim();
  const save = document.getElementById('chk-save-dentist')?.checked;

  if (!name) {
    alert('Por favor, informe o Nome Completo do Cirurgião-Dentista.');
    document.getElementById('field-dentist-name')?.focus();
    return;
  }
  if (!cro) {
    alert('Por favor, informe o número de inscrição no Conselho (CRO).');
    document.getElementById('field-dentist-cro')?.focus();
    return;
  }

  state.dentist = { name, cro, clinic, phone, city: 'São Paulo - SP', saveForFuture: Boolean(save) };

  if (save) {
    try {
      localStorage.setItem('dentalsafe_express_dentist', JSON.stringify(state.dentist));
    } catch (e) {}
  }

  showScreen('screen-patient');
}

// ==========================================================================
// Gerenciamento de Pacientes Salvos (1 Clique para Carregar)
// ==========================================================================
function getSavedPatients() {
  try {
    const raw = localStorage.getItem('dentalsafe_express_patients');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function savePatientToStorage(patient) {
  if (!patient || !patient.name || !patient.cpf) return;
  try {
    let list = getSavedPatients();
    list = list.filter(p => p.cpf !== patient.cpf && p.name.toLowerCase() !== patient.name.toLowerCase());
    list.unshift({
      name: patient.name,
      cpf: patient.cpf,
      birthDate: patient.birthDate || '',
      phone: patient.phone || '',
      address: patient.address || ''
    });
    if (list.length > 15) list = list.slice(0, 15);
    localStorage.setItem('dentalsafe_express_patients', JSON.stringify(list));
    loadSavedPatientsList();
  } catch (e) {
    console.warn('Erro ao salvar paciente:', e);
  }
}

function deleteSavedPatient(index, event) {
  if (event) event.stopPropagation();
  try {
    let list = getSavedPatients();
    if (index >= 0 && index < list.length) {
      list.splice(index, 1);
      localStorage.setItem('dentalsafe_express_patients', JSON.stringify(list));
      loadSavedPatientsList();
    }
  } catch (e) {}
}

function selectSavedPatient(index) {
  const list = getSavedPatients();
  const p = list[index];
  if (!p) return;

  const nameEl = document.getElementById('field-patient-name');
  const cpfEl = document.getElementById('field-patient-cpf');
  const birthEl = document.getElementById('field-patient-birth');
  const phoneEl = document.getElementById('field-patient-phone');

  if (nameEl) nameEl.value = p.name || '';
  if (cpfEl) cpfEl.value = p.cpf || '';
  if (phoneEl) phoneEl.value = p.phone || '';

  if (birthEl && p.birthDate) {
    if (p.birthDate.includes('/')) {
      const parts = p.birthDate.split('/');
      if (parts.length === 3) {
        birthEl.value = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    } else {
      birthEl.value = p.birthDate;
    }
  }

  document.querySelectorAll('.saved-patient-chip').forEach((chip, i) => {
    chip.classList.toggle('active', i === index);
  });
}

function loadSavedPatientsList() {
  const container = document.getElementById('saved-patients-quick-bar');
  const listEl = document.getElementById('saved-patients-chips-list');
  const countEl = document.getElementById('saved-patients-count');
  if (!container || !listEl) return;

  const list = getSavedPatients();
  if (!list || list.length === 0) {
    container.style.display = 'none';
    listEl.innerHTML = '';
    return;
  }

  container.style.display = 'block';
  if (countEl) {
    countEl.textContent = `(${list.length} salvo${list.length > 1 ? 's' : ''})`;
  }

  listEl.innerHTML = list.map((p, idx) => `
    <div class="saved-patient-chip" onclick="selectSavedPatient(${idx})" title="Clique para preencher: ${escapeHtml(p.name)} (${escapeHtml(p.cpf)})">
      <span class="chip-avatar">👤</span>
      <span class="chip-name">${escapeHtml(p.name)}</span>
      <span class="chip-cpf">${escapeHtml(p.cpf)}</span>
      <button type="button" class="delete-patient-btn" onclick="deleteSavedPatient(${idx}, event)" title="Excluir paciente">✕</button>
    </div>
  `).join('');
}

// ==========================================================================
// Tela 1B: Dados do Paciente
// ==========================================================================
function submitPatientScreen() {
  const name = document.getElementById('field-patient-name')?.value.trim();
  const cpf = document.getElementById('field-patient-cpf')?.value.trim();
  const birth = document.getElementById('field-patient-birth')?.value;
  const phone = document.getElementById('field-patient-phone')?.value.trim();

  if (!name) {
    alert('Por favor, informe o Nome Completo do Paciente.');
    document.getElementById('field-patient-name')?.focus();
    return;
  }
  if (!cpf) {
    alert('Por favor, informe o CPF do Paciente para validade pericial.');
    document.getElementById('field-patient-cpf')?.focus();
    return;
  }

  let formattedBirth = '';
  if (birth) {
    const parts = birth.split('-');
    if (parts.length === 3) formattedBirth = `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  state.patient = {
    name,
    cpf,
    rg: '---',
    birthDate: formattedBirth || birth,
    phone: phone || '',
    address: 'Consultório Odontológico'
  };

  const shouldSave = document.getElementById('chk-save-patient')?.checked;
  if (shouldSave) {
    savePatientToStorage(state.patient);
  }

  showScreen('screen-procedure');
}

// ==========================================================================
// Tela 2: Procedimento, Odontograma Lúdico e Condições
// ==========================================================================
function selectProcedureCard(procId) {
  if (procId === 'cfo_catalog') {
    openCfoModal();
    return;
  }

  state.procedure.id = procId;
  state.procedure.cfoData = null;

  const notice = document.getElementById('cfo-selected-notice');
  if (notice) notice.style.display = 'none';

  document.querySelectorAll('.proc-card').forEach(card => {
    card.classList.toggle('selected', card.getAttribute('data-proc') === procId);
  });

  const customWrap = document.getElementById('custom-proc-input-wrap');
  if (customWrap) customWrap.style.display = procId === 'outro' ? 'block' : 'none';

  if (PROCEDURES_DATA[procId]) {
    state.procedure.title = PROCEDURES_DATA[procId].title;
    state.procedure.specialty = PROCEDURES_DATA[procId].specialty;
    state.certificate.cidCode = PROCEDURES_DATA[procId].cid;
  }
}

// Odontograma Lúdico Interativo
function setDentitionMode(mode) {
  state.procedure.dentitionMode = mode;
  document.getElementById('btn-dent-perm')?.classList.toggle('active', mode === 'permanente');
  document.getElementById('btn-dent-dec')?.classList.toggle('active', mode === 'deciduo');
  renderLudicOdontogram();
}

function renderLudicOdontogram() {
  const container = document.getElementById('ludic-teeth-board');
  if (!container) return;

  const isDec = state.procedure.dentitionMode === 'deciduo';

  const teethArchSupLeft = isDec ? ['55','54','53','52','51'] : ['18','17','16','15','14','13','12','11'];
  const teethArchSupRight = isDec ? ['61','62','63','64','65'] : ['21','22','23','24','25','26','27','28'];
  const teethArchInfLeft = isDec ? ['85','84','83','82','81'] : ['48','47','46','45','44','43','42','41'];
  const teethArchInfRight = isDec ? ['71','72','73','74','75'] : ['31','32','33','34','35','36','37','38'];

  function renderRow(teeth) {
    return teeth.map(fdi => {
      const isSelected = state.procedure.selectedTeeth.includes(fdi);
      const toothKind = getToothKind(fdi);
      const svg = TOOTH_SVGS[toothKind] || TOOTH_SVGS.molar;
      return `
        <button type="button" 
          class="friendly-tooth-btn ${isSelected ? 'selected' : ''}" 
          data-fdi="${fdi}" 
          onclick="toggleToothSelection('${fdi}')"
          title="Dente ${fdi} (${toothKind})">
          <span class="tooth-fdi">${fdi}</span>
          <div class="tooth-art-wrap">${svg}</div>
          <span class="tooth-kind">${toothKind.slice(0,3)}</span>
        </button>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="arch-strip">
      <div class="arch-heading">Arcada Superior (Maxila)</div>
      <div class="teeth-flex-row">
        ${renderRow(teethArchSupLeft)}
        <div class="midline-bar"></div>
        ${renderRow(teethArchSupRight)}
      </div>
    </div>
    <div class="arch-strip">
      <div class="arch-heading">Arcada Inferior (Mandíbula)</div>
      <div class="teeth-flex-row">
        ${renderRow(teethArchInfLeft)}
        <div class="midline-bar"></div>
        ${renderRow(teethArchInfRight)}
      </div>
    </div>
  `;

  updateSelectedTeethSummary();
}

function getToothKind(fdi) {
  const d = parseInt(fdi, 10);
  const last = d % 10;
  if (last === 1 || last === 2) return 'incisor';
  if (last === 3) return 'canine';
  if (last === 4 || last === 5) return d > 50 ? 'molar' : 'premolar';
  return 'molar';
}

function toggleToothSelection(fdi) {
  const idx = state.procedure.selectedTeeth.indexOf(fdi);
  if (idx > -1) {
    state.procedure.selectedTeeth.splice(idx, 1);
  } else {
    state.procedure.selectedTeeth.push(fdi);
  }
  renderLudicOdontogram();
}

function selectSingleTooth(fdi) {
  state.procedure.selectedTeeth = [fdi];
  if (state.procedure.dentitionMode === 'deciduo' && parseInt(fdi, 10) < 50) {
    setDentitionMode('permanente');
  } else {
    renderLudicOdontogram();
  }
}

function presetSisos() {
  ['18', '28', '38', '48'].forEach(s => {
    if (!state.procedure.selectedTeeth.includes(s)) state.procedure.selectedTeeth.push(s);
  });
  renderLudicOdontogram();
}

function presetArch(arch) {
  const isDec = state.procedure.dentitionMode === 'deciduo';
  const teeth = arch === 'sup'
    ? (isDec ? ['55','54','53','52','51','61','62','63','64','65'] : ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'])
    : (isDec ? ['85','84','83','82','81','71','72','73','74','75'] : ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38']);

  teeth.forEach(t => {
    if (!state.procedure.selectedTeeth.includes(t)) state.procedure.selectedTeeth.push(t);
  });
  renderLudicOdontogram();
}

function clearTeethSelection() {
  state.procedure.selectedTeeth = [];
  renderLudicOdontogram();
}

function updateSelectedTeethSummary() {
  const container = document.getElementById('selected-teeth-tags');
  const countEl = document.getElementById('teeth-count-badge');
  if (!container) return;

  const count = state.procedure.selectedTeeth.length;
  if (countEl) countEl.textContent = count;

  if (count === 0) {
    container.innerHTML = '<span style="color:var(--text-muted); font-size:12px;">Nenhum elemento selecionado (procedimento geral/arcada total).</span>';
  } else {
    const sorted = [...state.procedure.selectedTeeth].sort((a,b) => parseInt(a,10) - parseInt(b,10));
    container.innerHTML = sorted.map(t => `<span class="tooth-capsule">Dente ${t}</span>`).join('');
  }
}

// Condições de Saúde (Chips 1-clique)
function toggleCondition(el, key) {
  if (key === 'nenhuma') {
    state.healthConditions.clear();
    document.querySelectorAll('.condition-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    updateActiveExtendedTags();
    return;
  }

  document.getElementById('cond-none')?.classList.remove('active');

  if (state.healthConditions.has(key)) {
    state.healthConditions.delete(key);
    el.classList.remove('active');
  } else {
    state.healthConditions.add(key);
    el.classList.add('active');
  }

  updateActiveExtendedTags();
}

// ==========================================================================
// Módulo de Condições Estendidas com Busca
// ==========================================================================
function renderExtendedConditionsList(filterQuery = '') {
  const container = document.getElementById('extended-conditions-list');
  if (!container) return;

  const q = filterQuery.toLowerCase().trim();
  const filtered = EXTENDED_CONDITIONS_CATALOG.filter(item => {
    if (!q) return true;
    return item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.clauseTitle.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; padding: 12px; font-size: 12px; color: var(--text-muted); text-align: center;">Nenhuma comorbidade encontrada para a busca informada.</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isChecked = state.healthConditions.has(item.id);
    return `
      <button type="button" class="extended-cond-btn ${isChecked ? 'selected' : ''}" onclick="toggleExtendedCondition('${item.id}')">
        <span>${item.label}</span>
        <span style="font-size: 10px; opacity: 0.7;">${item.category}</span>
      </button>
    `;
  }).join('');
}

function filterExtendedConditions(query) {
  renderExtendedConditionsList(query);
}

function toggleExtendedCondition(id) {
  document.getElementById('cond-none')?.classList.remove('active');
  if (state.healthConditions.has(id)) {
    state.healthConditions.delete(id);
  } else {
    state.healthConditions.add(id);
  }
  renderExtendedConditionsList(document.getElementById('search-extended-conditions')?.value || '');
  updateActiveExtendedTags();
}

function removeActiveExtendedCondition(id) {
  state.healthConditions.delete(id);
  document.querySelectorAll('.condition-pill').forEach(pill => {
    if (pill.getAttribute('onclick')?.includes(`'${id}'`)) {
      pill.classList.remove('active');
    }
  });
  renderExtendedConditionsList(document.getElementById('search-extended-conditions')?.value || '');
  updateActiveExtendedTags();
}

function updateActiveExtendedTags() {
  const container = document.getElementById('active-extended-tags');
  if (!container) return;

  if (state.healthConditions.size === 0) {
    container.innerHTML = '<span style="font-size: 11.5px; color: var(--text-muted);">Nenhuma condição ou alergia selecionada.</span>';
    return;
  }

  const tags = [];
  state.healthConditions.forEach(id => {
    let label = id;
    const ext = EXTENDED_CONDITIONS_CATALOG.find(c => c.id === id);
    if (ext) {
      label = ext.label;
    } else {
      const chipLabels = {
        hipertensao: '🩸 Hipertensão Arterial',
        diabetes: '🍬 Diabetes Mellitus',
        cardiopatia: '❤️ Cardiopatia / Endocardite',
        bisfosfonatos: '🚨 Bisfosfonatos (MRONJ)',
        bisfosfonato: '🚨 Bisfosfonatos (MRONJ)',
        anticoagulantes: '🚨 Anticoagulantes (Hemorragia)',
        anticoagulante: '🚨 Anticoagulantes (Hemorragia)',
        corticoides: '🚨 Corticoides Contínuos (Addison)',
        corticoid: '🚨 Corticoides Contínuos (Addison)',
        imunossupressores: '🚨 Imunossupressores / Quimio',
        imunossupressor: '🚨 Imunossupressores / Quimio',
        hiv: '🛡️ HIV / Imunodeficiência',
        autoimune: '🧬 Doença Autoimune / Lúpus',
        gestante: '🤰 Gestante ou Lactante',
        ansiedade: '😰 Ansiedade / Odontofobia',
        fumante: '🚬 Tabagismo Ativo',
        bruxismo: '🦷 Bruxismo / Apertamento',
        perda_ossea: '🦴 Perda Óssea Alveolar',
        alergia_geral: '⚠️ Alergia Medicamentosa / Látex',
        penicilina: '⚠️ Alergia a Penicilinas',
        periodontite: '🩺 Periodontite Ativa',
        expectativa_irreal: '🎯 Limites Estéticos / Expectativa'
      };
      label = chipLabels[id] || id;
    }
    tags.push(`<span class="active-cond-tag" onclick="removeActiveExtendedCondition('${id}')">${label} ✕</span>`);
  });

  container.innerHTML = tags.join('');
}

// ==========================================================================
// Modal do Catálogo Completo CFO / VRPO / TUSS
// ==========================================================================
let activeCfoSpecialty = 'Todas';

function openCfoModal() {
  const modal = document.getElementById('cfo-procedure-modal');
  if (!modal) return;
  modal.classList.add('open');
  renderCfoSpecialties();
  renderCfoProceduresList();
  document.getElementById('search-cfo-input')?.focus();
}

function closeCfoModal() {
  const modal = document.getElementById('cfo-procedure-modal');
  if (modal) modal.classList.remove('open');
}

function renderCfoSpecialties() {
  const container = document.getElementById('cfo-specialty-filters');
  if (!container) return;

  const specs = ['Todas', 'Cirurgia', 'Implantodontia', 'Endodontia', 'Periodontia', 'Prótese', 'Dentística', 'Ortodontia', 'Odontopediatria', 'DTM', 'Harmonização', 'Sedação'];
  container.innerHTML = specs.map(s => `
    <button type="button" class="spec-chip-btn ${s === activeCfoSpecialty ? 'active' : ''}" onclick="filterCfoBySpecialty('${s}')">
      ${s}
    </button>
  `).join('');
}

function filterCfoBySpecialty(spec) {
  activeCfoSpecialty = spec;
  renderCfoSpecialties();
  renderCfoProceduresList(document.getElementById('search-cfo-input')?.value || '');
}

function filterCfoProcedures(query) {
  renderCfoProceduresList(query);
}

function renderCfoProceduresList(query = '') {
  const container = document.getElementById('cfo-procedures-list');
  if (!container) return;

  const q = query.toLowerCase().trim();
  const list = CFO_PROCEDURES_CATALOG.filter(item => {
    const matchesSpec = activeCfoSpecialty === 'Todas' || item.specialty.toLowerCase().includes(activeCfoSpecialty.toLowerCase());
    if (!matchesSpec) return false;
    if (!q) return true;
    return item.title.toLowerCase().includes(q) || item.specialty.toLowerCase().includes(q) || item.cid.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
  });

  if (list.length === 0) {
    container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">Nenhum procedimento odontológico encontrado no catálogo para os filtros selecionados.</div>';
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="cfo-proc-row" onclick="selectCfoProcedure('${item.id}')">
      <div class="cfo-proc-info">
        <div class="cfo-proc-title">${item.title}</div>
        <div class="cfo-proc-meta">
          <span>🏷️ ${item.specialty}</span>
          <span class="cfo-cid-badge">CID-10: ${item.cid}</span>
          <span style="color:var(--text-muted);">• ${item.desc}</span>
        </div>
      </div>
      <button type="button" class="btn-pill-subtle" style="font-size: 11.5px; padding: 4px 10px;">
        Selecionar
      </button>
    </div>
  `).join('');
}

function selectCfoProcedure(cfoId) {
  const item = CFO_PROCEDURES_CATALOG.find(c => c.id === cfoId);
  if (!item) return;

  state.procedure.id = item.id;
  state.procedure.title = item.title;
  state.procedure.specialty = item.specialty;
  state.procedure.cfoData = item;
  state.certificate.cidCode = item.cid;

  // Desmarca os cards rápidos
  document.querySelectorAll('.proc-card').forEach(c => c.classList.remove('selected'));
  const cfoCard = document.querySelector('.proc-card[data-proc="cfo_catalog"]');
  if (cfoCard) cfoCard.classList.add('selected');

  // Mostra a notificação visual na tela 2
  const notice = document.getElementById('cfo-selected-notice');
  const titleEl = document.getElementById('cfo-selected-title');
  const detailEl = document.getElementById('cfo-selected-details');
  if (notice && titleEl && detailEl) {
    titleEl.textContent = item.title;
    detailEl.textContent = `Especialidade: ${item.specialty} • Código CID-10: ${item.cid} • Base Pericial: ${item.baseKey}`;
    notice.style.display = 'block';
  }

  closeCfoModal();
}

function submitProcedureScreen() {
  if (state.procedure.id === 'outro') {
    const custom = document.getElementById('field-custom-proc')?.value.trim();
    if (!custom) {
      alert('Por favor, informe o nome do procedimento personalizado.');
      document.getElementById('field-custom-proc')?.focus();
      return;
    }
    state.procedure.customTitle = custom;
  }

  renderReviewSummary();
  showScreen('screen-review');
}

// ==========================================================================
// Tela 3: Revisão Clara para Conferência Prévia
// ==========================================================================
function renderReviewSummary() {
  const container = document.getElementById('review-content-box');
  if (!container) return;

  const procKey = state.procedure.id;
  const procTitle = state.procedure.cfoData 
    ? state.procedure.cfoData.title 
    : (procKey === 'outro' ? state.procedure.customTitle : (PROCEDURES_DATA[procKey]?.title || 'Procedimento Clínico'));
  const procSpec = state.procedure.cfoData?.specialty || PROCEDURES_DATA[procKey]?.specialty || 'Odontologia';
  const procCid = state.certificate.cidCode || 'K08.8';

  const teethStr = state.procedure.selectedTeeth.length > 0 ? state.procedure.selectedTeeth.join(', ') : 'Geral / Arcada total';

  let condStr = 'Nenhuma comorbidade relevante declarada';
  if (state.healthConditions.size > 0) {
    const chipLabels = {
      hipertensao: '🩸 Hipertensão Arterial',
      diabetes: '🍬 Diabetes Mellitus',
      cardiopatia: '❤️ Cardiopatia / Endocardite',
      bisfosfonatos: '🚨 Bisfosfonatos (MRONJ)',
      bisfosfonato: '🚨 Bisfosfonatos (MRONJ)',
      anticoagulantes: '🚨 Anticoagulantes (Hemorragia)',
      anticoagulante: '🚨 Anticoagulantes (Hemorragia)',
      corticoides: '🚨 Corticoides Contínuos (Addison)',
      corticoid: '🚨 Corticoides Contínuos (Addison)',
      imunossupressores: '🚨 Imunossupressores / Quimio',
      imunossupressor: '🚨 Imunossupressores / Quimio',
      hiv: '🛡️ HIV / Imunodeficiência',
      autoimune: '🧬 Doença Autoimune / Lúpus',
      gestante: '🤰 Gestante ou Lactante',
      ansiedade: '😰 Ansiedade / Odontofobia',
      fumante: '🚬 Tabagismo Ativo',
      bruxismo: '🦷 Bruxismo / Apertamento',
      perda_ossea: '🦴 Perda Óssea Alveolar',
      alergia_geral: '⚠️ Alergia Medicamentosa / Látex',
      penicilina: '⚠️ Alergia a Penicilinas',
      periodontite: '🩺 Periodontite Ativa',
      expectativa_irreal: '🎯 Limites Estéticos / Expectativa'
    };
    const items = [];
    state.healthConditions.forEach(id => {
      const ext = EXTENDED_CONDITIONS_CATALOG.find(c => c.id === id);
      if (ext) items.push(ext.label);
      else if (chipLabels[id]) items.push(chipLabels[id]);
      else items.push(id);
    });
    condStr = items.join('; ');
  }

  container.innerHTML = `
    <div class="review-item">
      <span class="item-icon">👨‍⚕️</span>
      <div class="item-content">
        <strong>Cirurgião-Dentista Responsável</strong>
        <p>${escapeHtml(state.dentist.name)} — ${escapeHtml(state.dentist.cro)} (${escapeHtml(state.dentist.clinic || 'Consultório Odontológico')})</p>
      </div>
    </div>

    <div class="review-item">
      <span class="item-icon">👤</span>
      <div class="item-content">
        <strong>Paciente / Titular</strong>
        <p>${escapeHtml(state.patient.name)} — CPF: ${escapeHtml(state.patient.cpf)} ${state.patient.phone ? `(Tel: ${escapeHtml(state.patient.phone)})` : ''}</p>
      </div>
    </div>

    <div class="review-item">
      <span class="item-icon">🦷</span>
      <div class="item-content">
        <strong>Procedimento & Notação Dental (FDI)</strong>
        <p><strong>${escapeHtml(procTitle)}</strong></p>
        <p style="font-size:12px; color:var(--text-muted);">Especialidade: ${procSpec} • CID-10: ${procCid} • Elementos Odontológicos: <strong>${teethStr}</strong></p>
      </div>
    </div>

    <div class="review-item">
      <span class="item-icon">🩺</span>
      <div class="item-content">
        <strong>Condições Sistêmicas & Alertas Periciais Mapeados</strong>
        <p>${escapeHtml(condStr)}</p>
      </div>
    </div>
  `;
}

function submitGenerateTcle() {
  generateOfficialDocument();
  try {
    const compat = getCompatiblePrescriptionPreset();
    const hubLabel = document.getElementById('hub-rx-suggest-label');
    if (hubLabel) {
      hubLabel.textContent = `Sugerido: ${compat.reason}`;
    }
  } catch (e) {}
  showScreen('screen-tcle');
}

// ==========================================================================
// Fallback Enriquecido Caso PROCEDURE_DB Não Esteja Carregado
// ==========================================================================
function getEnrichedProcedureFallback(baseKey, procTitle) {
  return {
    name: procTitle || "Procedimento Odontológico Clínico-Cirúrgico",
    specialty: "Odontologia",
    naturalObligation: "MEIO (Jurisprudência Pacífica do STJ — REsp 1.058.927/MT)",
    scientificReferences: "Conselho Federal de Odontologia (CFO); Código de Defesa do Consumidor (Art. 14, § 4º); STJ REsp 1.058.927/MT.",
    pathologyDesc: "Quadro clínico diagnosticado na consulta de avaliação com necessidade biológica de intervenção curativa, reabilitadora ou preventiva para controle de microbiota patogênica, alívio da dor e preservação da arquitetura estomatognática.",
    technicalDesc: "O procedimento odontológico consiste na execução sequencial e asséptica de técnicas cirúrgicas ou restauradoras consagradas na literatura odontológica, sob anestesia local estéril, controle rigoroso de biossegurança e hemostasia tecidual criteriosa.",
    stepByStepWorkflow: [
      "Etapa 1 — Avaliação clínica diagnóstica, assepsia perioral rigorosa e colocação de campos estéreis de isolamento.",
      "Etapa 2 — Protocolo anestésico local infiltrativo ou regional seguro e confirmação do bloqueio da dor.",
      "Etapa 3 — Acesso cirúrgico / operatório delicado com instrumentos devidamente esterilizados em autoclave.",
      "Etapa 4 — Execução do preparo, instrumentação, desinfecção ou instalação de biomateriais/próteses pertinentes.",
      "Etapa 5 — Hemostasia minuciosa, toalete da ferida, sutura estéril ou acabamento/polimento oclusal.",
      "Etapa 6 — Orientações pós-operatórias verbais e escritas e agendamento de retorno para reavaliação clínica."
    ],
    patientSensations: "Durante todo o ato sob anestesia local eficaz, o(a) paciente NÃO sentirá dor aguda. Notará sensações normais e previsíveis tais como pressão mecânica suave, forças de alavanca, vibrações de instrumentos rotatórios, ruídos de aspiração e refrigeração líquida abundante.",
    alternatives: "As alternativas terapêuticas discutidas incluíram: acompanhamento clínico e radiográfico conservador, opções reabilitadoras convencionais ou abstenção com manutenção do quadro atual.",
    refusalPrognosis: "A não realização do tratamento indicado acarreta evolução crônica com risco de piora da dor, disseminação bacteriana, formação de abscessos, perda óssea alveolar contínua e eventual perda irreversível dos elementos envolvidos.",
    risksCommon: [
      "Edema e inchaço tecidual pós-operatório transitório (pico em 48 a 72 horas), amenizado com crioterapia (gelo) e fármacos prescritos.",
      "Dor e sensibilidade mastigatória pós-operatória de 2 a 5 dias, plenamente controlada com a analgesia prescrita.",
      "Sangramento salivar leve autolimitado nas primeiras 24 horas subsequentes ao procedimento.",
      "Trismo muscular leve temporário (limitação de abertura de boca) em procedimentos posteriores."
    ],
    risksUncommon: [
      "Hematoma ou equimose cutânea (manchas amareladas ou arroxeadas na face e pescoço) de regressão espontânea em 7 a 14 dias.",
      "Alveolite seca pós-exodontia decorrente da desintegração precoce do coágulo sanguíneo por bochechos ou esforço físico precoce.",
      "Parestesia temporária por edema contíguo ao trajeto de ramos nervosos sensitivos periféricos com regeneração gradual."
    ],
    risksRare: [
      "Parestesia persistente decorrente de estreita contiguidade anatômica radicular previamente evidenciada em exames tomográficos.",
      "Infecção secundária profunda que demande complementação com antibioticoterapia sistêmica de amplo espectro.",
      "Fratura involuntária de instrumento flexível em canais calcificados atrésicos ou raízes com dilacerações acentuadas."
    ],
    postOpCareComplete: "GUIA EXAUSTIVO DE CUIDADOS PÓS-OPERATÓRIOS:\n1. Manter gelo sobre a face nas primeiras 48 horas (20 minutos aplica, 20 minutos repousa);\n2. Repouso físico relativo de 48 a 72 horas, mantendo a cabeça discretamente elevada;\n3. Dieta estritamente pastosa e fria nos primeiros 3 dias;\n4. NÃO bochechar, NÃO cuspir e NÃO utilizar canudos de sucção (risco de deslocamento do coágulo sanguíneo);\n5. Abstenção rigorosa de tabagismo e bebidas alcoólicas no peroperatório;\n6. Fazer uso escrupuloso de toda a medicação prescrita nos horários determinados;\n7. Comparecer pontualmente à consulta agendada para remoção de suturas e alta clínica.",
    patientCommitments: "DEVERES DE COOPERAÇÃO MANDATÓRIOS DO PACIENTE (CDC ART. 14, § 3º, II):\n1. Seguir integralmente o plano medicamentoso e o repouso recomendado;\n2. Proteger a área operada de forças mastigatórias precoces;\n3. Comunicar qualquer sintoma atípico e retornar pontualmente às revisões programadas.",
    glossary: [
      { term: "Anestesia Local", def: "Técnica farmacológica que bloqueia temporariamente a condução nervosa da dor na região tratada sem perda da consciência." },
      { term: "Hemostasia", def: "Procedimentos mecânicos e farmacológicos para estancar o sangramento e permitir a formação de coágulo estável." },
      { term: "Parestesia", def: "Alteração sensitiva temporária (formigamento ou dormência) em lábios ou queixo após manipulação contígua a trajetos nervosos." },
      { term: "Osseointegração", def: "Fixação biológica firme e direta entre a estrutura óssea do paciente e a superfície do titânio do implante." }
    ]
  };
}

// ==========================================================================
// Tela 4: TCLE Oficial Emitido (GERADOR FORENSE COM TODAS AS 22 SEÇÕES)
// ==========================================================================
function generateOfficialDocument() {
  const d = state.dentist;
  const p = state.patient;
  const teethStr = state.procedure.selectedTeeth.length > 0 
    ? state.procedure.selectedTeeth.join(', ') 
    : 'Arcada / Região dentária indicada';
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const today = new Date().toLocaleDateString('pt-BR');

  // Determinar perfil do procedimento
  let procKey = state.procedure.id;
  let procTitle = state.procedure.title;
  let procCid = state.certificate.cidCode || 'K08.8';

  let baseKey = 'cirurgia_oral';
  if (state.procedure.cfoData) {
    baseKey = state.procedure.cfoData.baseKey;
    procTitle = state.procedure.cfoData.title;
    procCid = state.procedure.cfoData.cid;
  } else if (PROCEDURES_DATA[procKey]) {
    baseKey = PROCEDURES_DATA[procKey].baseKey || procKey;
    procTitle = PROCEDURES_DATA[procKey].title;
    procCid = PROCEDURES_DATA[procKey].cid;
  } else if (procKey === 'outro' && state.procedure.customTitle) {
    procTitle = state.procedure.customTitle;
  }

  // Obter perfil do PROCEDURE_DB ou fallback enriquecido
  let proc = (typeof PROCEDURE_DB !== 'undefined' && PROCEDURE_DB[baseKey])
    ? JSON.parse(JSON.stringify(PROCEDURE_DB[baseKey]))
    : getEnrichedProcedureFallback(baseKey, procTitle);

  // Sobrescrever nome e título com o nome oficial selecionado
  if (procTitle) proc.name = procTitle;

  // Montagem das Cláusulas Sistêmicas Forenses
  let systemicHTML = '';
  if (state.healthConditions.size === 0 || state.healthConditions.has('nenhuma')) {
    systemicHTML = '<p><em>O(A) paciente declara anamnese sem comorbidades descompensadas, coagulopatias ou alergias ativas a antibióticos e anestésicos locais de uso odontológico.</em></p>';
  } else {
    state.healthConditions.forEach(condId => {
      // Cláusula original
      if (ORIGINAL_SYSTEMIC_CLAUSES[condId]) {
        systemicHTML += ORIGINAL_SYSTEMIC_CLAUSES[condId];
      } else {
        // Cláusula estendida
        const ext = EXTENDED_CONDITIONS_CATALOG.find(c => c.id === condId);
        if (ext) {
          const riskClass = ext.risk === 'danger' ? 'danger-clause' : (ext.risk === 'warning' ? 'warning-clause' : 'info-clause');
          systemicHTML += `
            <div class="legal-clause-block ${riskClass}">
              <h5>CLÁUSULA ESPECÍFICA — ${ext.clauseTitle}</h5>
              <p>${ext.clauseText}</p>
            </div>
          `;
        }
      }
    });
  }

  const sheet = document.getElementById('official-tcle-paper');
  if (!sheet) return;

  sheet.innerHTML = `
    <div class="tcle-paper-header">
      <h2>Termo de Consentimento Livre e Esclarecido (TCLE)</h2>
      <p style="font-size:12.5px; font-weight:700; color:#1d1d1f; margin-top:2px;">Instrumento Jurídico e Forense de Informação e Esclarecimento ao Paciente</p>
      <p>Fundamentado na Lei 8.078/90 (CDC, Arts. 6º, III e 14), Código Civil Brasileiro (Arts. 186 e 951), Código de Ética Odontológica (Resolução CFO-118/2012, Art. 9º, VI e Art. 11, IV), Jurisprudência Pacífica do STJ (REsp 1.058.927/MT) e LGPD (Lei 13.709/2018)</p>
    </div>

    <div class="tcle-paper-meta">
      <div><strong>PACIENTE / TITULAR:</strong> ${escapeHtml(p.name)}</div>
      <div><strong>CPF DO PACIENTE:</strong> ${escapeHtml(p.cpf)}</div>
      <div><strong>DATA DE NASCIMENTO:</strong> ${escapeHtml(p.birthDate || 'Não informado')}</div>
      <div><strong>TELEFONE DO PACIENTE:</strong> ${escapeHtml(p.phone || 'Não informado')}</div>
      <div><strong>CIRURGIÃO-DENTISTA:</strong> ${escapeHtml(d.name)}</div>
      <div><strong>INSCRIÇÃO CRO:</strong> ${escapeHtml(d.cro)}</div>
      <div><strong>CLÍNICA / CONSULTÓRIO:</strong> ${escapeHtml(d.clinic || 'Consultório Odontológico')}</div>
      <div><strong>DATA DA PROPOSTA / EMISSÃO:</strong> ${currentDate}</div>
      <div style="grid-column: 1 / -1; background:#ffffff; padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1;">
        <strong>PROCEDIMENTO PROPOSTO:</strong> ${escapeHtml(proc.name)} | 
        <strong>ELEMENTOS DENTÁRIOS (FDI):</strong> ${teethStr} | 
        <strong>CID-10:</strong> ${procCid}
      </div>
    </div>

    <div class="tcle-paper-body" contenteditable="true" spellcheck="false" title="Clique em qualquer trecho para editar ou complementar o texto se necessário">
      
      <h3>1. Natureza Jurídica da Obrigação e Finalidade do Consentimento</h3>
      <p>
        O presente Termo de Consentimento Livre e Esclarecido (TCLE) tem por finalidade precípua cumprir o dever autônomo e indelegável de informação preconizado no Código de Defesa do Consumidor (Lei nº 8.078/90, Arts. 6º, III e 14) e no Código de Ética Odontológica. O ato odontológico a ser executado constitui intervenção biológica complexa regida estritamente por <strong>OBRIGAÇÃO DE MEIO</strong>, consoante jurisprudência uniforme e pacífica do Superior Tribunal de Justiça (<strong>STJ — REsp 1.058.927/MT</strong> e <strong>REsp 1.540.580/DF</strong>). O cirurgião-dentista obriga-se a aplicar a melhor técnica operatória reconhecida pela ciência odontológica com materiais de padrão-ouro, não sendo juridicamente exigível garantia matemática ou infalível de resultado, cuja resposta final está subordinada às características fisiológicas e à resposta cicatricial do organismo do(a) paciente.
      </p>

      <h3>2. Diagnóstico Clínico e Fisiopatologia Biológica</h3>
      <p>
        <strong>Diagnóstico Clínico Formulado:</strong> Afecção dentomaxilofacial diagnosticada nos elementos / região: <strong>${teethStr}</strong>, com indicação clínica do procedimento de <strong>${escapeHtml(proc.name)}</strong>.
      </p>
      <div class="pathology-box">
        <strong><i class="ri-microscope-line"></i> Fisiopatologia e Justificativa Biológica da Intervenção:</strong>
        <p style="margin:4px 0 0 0;">${proc.pathologyDesc}</p>
      </div>

      <h3>3. Descrição Técnica e Metodologia Operatória</h3>
      <p>
        ${proc.technicalDesc}
      </p>
      <p style="font-size:11.5px; color:#475569;">
        <strong>Embasamento Científico e Diretrizes Aplicáveis:</strong> ${proc.scientificReferences || 'Diretrizes Clínicas do Conselho Federal de Odontologia (CFO) e Consensos Internacionais de Especialidade.'}
      </p>

      <h3>4. Etapas Técnicas do Procedimento Passo a Passo</h3>
      <p>
        Para assegurar total transparência operatória, o tratamento será executado sequencialmente através das seguintes etapas técnicas padronizadas:
      </p>
      <div class="proc-workflow-box">
        ${(Array.isArray(proc.stepByStepWorkflow) ? proc.stepByStepWorkflow : [
          'Etapa 1 — Antissepsia perioral, anestesia local eficaz e campos estéreis.',
          'Etapa 2 — Acesso operatório atraumático com controle de tecidos nobres.',
          'Etapa 3 — Execução da técnica específica com controle de temperatura e irrigação.',
          'Etapa 4 — Hemostasia, toalete da cavidade e síntese por sutura ou polimento.',
          'Etapa 5 — Fornecimento das instruções pós-operatórias estritas e agendamento de retorno.'
        ]).map((step, idx) => `
          <div class="proc-step-card">
            <div class="proc-step-num">Fase ${idx + 1}</div>
            <div class="proc-step-text">${step}</div>
          </div>
        `).join('')}
      </div>

      <h3>5. Sensações Fisiológicas Previstas sob Anestesia Local</h3>
      <div class="sensations-box">
        <strong><i class="ri-user-smile-line"></i> O Que Você Sentirá Durante o Atendimento:</strong>
        <p style="margin:4px 0 0 0;">${proc.patientSensations || 'Durante o ato sob anestesia local eficaz, o paciente NÃO sentirá dor aguda. Notará sensações normais como pressão mecânica suave, vibrações de instrumentos e água de refrigeração.'}</p>
      </div>
      <p>
        O(A) paciente fica orientado(a) a sinalizar imediatamente caso perceba qualquer desconforto doloroso agudo para que o profissional possa pausar o atendimento e suplementar o bloqueio anestésico com total segurança.
      </p>

      <h3>6. Alternativas Terapêuticas Esclarecidas</h3>
      <p>
        ${proc.alternatives || 'Foram discutidas opções terapêuticas alternativas viáveis, inclusive condutas conservadoras, procedimentos reabilitadores diversos e a recusa da intervenção, optando o paciente pelo plano ora pactuado.'}
      </p>

      <h3>7. Prognóstico em Caso de Recusa ou Abstenção do Tratamento</h3>
      <p>
        ${proc.refusalPrognosis || 'A não realização do tratamento indicado mantém o processo patológico em evolução, com risco de dores agudas severas, abscessos purulentos, disseminação infecciosa e perda irreversível da estrutura dentária.'}
      </p>

      <h3>8. Protocolo Anestésico Local e Riscos Farmacológicos</h3>
      <p>
        O procedimento será conduzido sob anestesia local odontológica com sal anestésico padrão-ouro (Lidocaína a 2% ou Articaína a 4% associado a epinefrina/vasoconstritor em concentração segura de 1:100.000 ou 1:200.000, ou Mepivacaína 3% sem vasoconstritor em pacientes cardiopatas ou hipertensos severos). O paciente declara ciência de que a difusão sistêmica fisiológica do vasoconstritor pode ocasionar taquicardia ou palpitação autolimitada passageira (1 a 3 minutos) e que a dormência labial/lingual persistirá por 2 a 4 horas pós-operatórias, período no qual é expressamente proibido mastigar para evitar mordeduras e lesões traumáticas nas mucosas anestesiadas.
      </p>

      <h3>9. Riscos Inerentes e Previsíveis da Intervenção</h3>
      <p><strong>9.1 — RISCOS GERAIS E COMUNS:</strong></p>
      <ul>
        ${(Array.isArray(proc.risksCommon) ? proc.risksCommon : ['Edema pós-operatório (pico em 48-72h)', 'Sensibilidade mastigatória controlável com analgésicos']).map(r => `<li>${r}</li>`).join('')}
      </ul>

      <p><strong>9.2 — RISCOS POUCO FREQUENTES (Ocorrência Eventual):</strong></p>
      <ul>
        ${(Array.isArray(proc.risksUncommon) ? proc.risksUncommon : ['Hematoma facial reabsorvível', 'Parestesia transitória']).map(r => `<li>${r}</li>`).join('')}
      </ul>

      <p><strong>9.3 — RISCOS RAROS MAS GRAVES (Documentados na Literatura Científica — Obrigatório Informar):</strong></p>
      <div class="risk-rare-box">
        ${(Array.isArray(proc.risksRare) ? proc.risksRare : ['Parestesia sensitiva persistente por contiguidade anatômica prévia documentada']).map(r => `<p>⚠️ ${r}</p>`).join('')}
      </div>

      <h3>10. Declaração de Saúde, Comorbidades e Alertas Específicos</h3>
      ${systemicHTML}

      <h3>11. Se Houver Uma Intercorrência Clínica</h3>
      <p>
        O(A) paciente autoriza expressamente o cirurgião-dentista e sua equipe a adotarem todas as manobras clínicas e terapêuticas de urgência que se fizerem necessárias durante o ato operatório visando salvaguardar sua integridade física e restabelecer o equilíbrio fisiológico, tudo em conformidade com o Código de Ética Odontológica (Art. 11, IV).
      </p>

      <h3>12. Guia Exaustivo de Cuidados Pós-Operatórios</h3>
      <p>
        O sucesso biológico e cicatricial do tratamento odontológico depende de forma estrita da cooperação e do cumprimento fiel das seguintes recomendações domiciliares pelo paciente:
      </p>
      <div class="postop-guide-box">${proc.postOpCareComplete || '1. Gelo nas primeiras 48h; 2. Dieta fria/pastosa; 3. Repouso físico; 4. Não fumar nem ingerir álcool; 5. Tomar pontualmente a medicação.'}</div>

      <h3>13. Deveres Mandatórios de Cooperação do Paciente (CDC Art. 14, § 3º, II)</h3>
      <p>
        Nos exatos termos do Art. 14, § 3º, inciso II do Código de Defesa do Consumidor, o paciente é partícipe e co-responsável indispensável pelo êxito clínico. O descumprimento das orientações pós-operatórias, a mastigação precoce de alimentos consistentes sobre áreas operadas, a abstenção de uso da medicação prescrita, a continuidade do tabagismo ou a falta às consultas de revisão configuram culpa exclusiva do consumidor, rompendo o nexo de causalidade por eventuais insucessos biológicos decorrentes.
      </p>
      ${proc.patientCommitments ? `<div class="patient-commitments-box">${proc.patientCommitments}</div>` : ''}

      <h3>14. Quando Procurar Atendimento Imediato de Urgência</h3>
      <p>
        O(A) paciente deverá contatar prontamente o consultório através do telefone <strong>${escapeHtml(d.phone || '(11) 99999-9999')}</strong> ou dirigir-se ao serviço de pronto atendimento mais próximo caso observe: sangramento profuso ativo que não cede com compressão de gaze estéril por 30 minutos; febre acima de 38°C; edema volumoso expansivo de progressão rápida que cause dificuldade para deglutir ou respirar; ou sinais de reação alérgica com prurido cutâneo difuso ou dispneia.
      </p>

      <h3>15. Custos, Orçamento e Estimativa de Sessões</h3>
      <p>
        O plano financeiro, valores dos honorários e estimativa de sessões clínicas foram previamente apresentados e aceitos de forma autônoma pelo(a) paciente. Eventuais atos adicionais imprevistos por complicações anatômicas serão discutidos e acordados previamente.
      </p>

      <h3>16. Privacidade, Prontuário Clínico e LGPD (Lei 13.709/2018)</h3>
      <p>
        Em estrito cumprimento à Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018, Art. 11, II, "f"), o(a) paciente autoriza expressamente a guarda física e digital de seu prontuário clínico odontológico, anamnese, radiografias, fotografias intra e extraorais e modelos de gesso. O prazo mínimo obrigatório de guarda do prontuário é de 20 (vinte) anos a contar do último atendimento clínico (Lei nº 13.787/2018, Art. 6º). Registros de imagem destinam-se exclusivamente ao acompanhamento clínico-pericial, sendo vedada qualquer divulgação pública que viole a Resolução CFO-196/2019 sem autorização específica prévia.
      </p>

      <h3>17. Revogação do Consentimento</h3>
      <p>
        É assegurado ao(à) paciente o direito de revogar o presente consentimento a qualquer momento anterior ao início dos procedimentos invasivos, ou solicitar a interrupção segura de etapas subsequentes, mediante comunicação expressa, ficando ciente de que etapas biológicas já consolidadas podem ser irreversíveis e demandar intervenções estabilizadoras de suporte.
      </p>

      ${(Array.isArray(proc.glossary) && proc.glossary.length > 0) ? `
      <h3>18. Palavras que Ajudam a Entender (Glossário Técnico para o Paciente)</h3>
      <p>Para garantir pleno entendimento dos termos técnicos odontológicos constantes deste documento, apresentamos suas definições em linguagem clara:</p>
      <div class="glossary-grid">
        ${proc.glossary.map(g => `
          <div class="glossary-card">
            <div class="glossary-term">📖 ${g.term}</div>
            <div class="glossary-def">${g.def}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <h3>19. Declaração de Plena Compreensão e Assinaturas Formais</h3>
      <p>
        Declaro, sob as penas da lei, que li (ou me foi lido integralmente) o presente Termo de Consentimento Livre e Esclarecido, compreendi plenamente todas as explicações técnicas fornecidas pelo cirurgião-dentista em linguagem acessível e tive oportunidade irrestrita de formular perguntas e sanar todas as minhas dúvidas. Estando plenamente satisfeito(a) e ciente dos benefícios, limitações e riscos inerentes ao procedimento, firmo o presente instrumento juntamente com o profissional responsável e duas testemunhas instrumentárias idôneas.
      </p>

      <p style="margin-top: 14px;">
        <strong>Local:</strong> ${escapeHtml(d.city || 'São Paulo - SP')} | <strong>Data:</strong> ${today}.
      </p>
    </div>

    <div class="tcle-paper-signatures">
      <div>
        <div class="signature-line-box">
          <strong>${escapeHtml(p.name)}</strong><br>
          <span style="font-size:11px; color:#64748b;">Paciente / Titular do Direito (CPF: ${escapeHtml(p.cpf)})</span>
        </div>
      </div>
      <div>
        <div class="signature-line-box">
          <strong>${escapeHtml(d.name)}</strong><br>
          <span style="font-size:11px; color:#64748b;">Cirurgião-Dentista Responsável (${escapeHtml(d.cro)})</span>
        </div>
      </div>
    </div>

    <div class="witnesses-signatures-row">
      <div>
        <div class="signature-line-box">
          <strong>Testemunha 1: ____________________________</strong><br>
          <span style="font-size:11px; color:#64748b;">Nome Legível / CPF nº: ______________________</span>
        </div>
      </div>
      <div>
        <div class="signature-line-box">
          <strong>Testemunha 2: ____________________________</strong><br>
          <span style="font-size:11px; color:#64748b;">Nome Legível / CPF nº: ______________________</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Módulo Sequencial 1: Atestado (Afastamento ou Comparecimento)
// ==========================================================================
function openAtestadoModule(type = 'afastamento') {
  const modal = document.getElementById('post-modal-atestado');
  if (!modal) return;
  modal.style.display = 'block';
  switchAtestadoType(type);
  modal.scrollIntoView({ behavior: 'smooth' });
}

function closeAtestadoModal() {
  const modal = document.getElementById('post-modal-atestado');
  if (modal) modal.style.display = 'none';
}

function skipAtestadoModule() {
  closeAtestadoModal();
  openPrescriptionAuto();
}

function switchAtestadoType(type) {
  state.certificate.type = type;

  const btnAfast = document.getElementById('btn-atestado-afastamento');
  const btnComp = document.getElementById('btn-atestado-comparecimento');
  const ctrlAfast = document.getElementById('atestado-afastamento-controls');
  const ctrlComp = document.getElementById('atestado-comparecimento-controls');
  const iconEl = document.getElementById('atestado-icon-badge');
  const titleEl = document.getElementById('atestado-modal-title');
  const subEl = document.getElementById('atestado-modal-subtitle');

  if (btnAfast) btnAfast.classList.toggle('active', type === 'afastamento');
  if (btnComp) btnComp.classList.toggle('active', type === 'comparecimento');
  if (ctrlAfast) ctrlAfast.style.display = type === 'afastamento' ? 'block' : 'none';
  if (ctrlComp) ctrlComp.style.display = type === 'comparecimento' ? 'block' : 'none';

  if (type === 'afastamento') {
    if (iconEl) iconEl.textContent = '🩺';
    if (titleEl) titleEl.textContent = 'Atestado de Afastamento / Repouso';
    if (subEl) subEl.textContent = 'Justificativa pericial de repouso clínico e convalescença (em dias).';
    setDaysAtestado(state.certificate.days || 2);
  } else {
    if (iconEl) iconEl.textContent = '🕒';
    if (titleEl) titleEl.textContent = 'Atestado de Comparecimento';
    if (subEl) subEl.textContent = 'Declaração formal com registro do horário de início e término da consulta.';
    const startInput = document.getElementById('field-comp-start');
    const endInput = document.getElementById('field-comp-end');
    if (startInput && state.certificate.startTime) startInput.value = state.certificate.startTime;
    if (endInput && state.certificate.endTime) endInput.value = state.certificate.endTime;
  }

  renderAtestadoSheet();
}

function updateComparecimentoTimes() {
  const start = document.getElementById('field-comp-start')?.value || '09:00';
  const end = document.getElementById('field-comp-end')?.value || '10:30';
  state.certificate.startTime = start;
  state.certificate.endTime = end;
  renderAtestadoSheet();
}

function setDaysAtestado(days) {
  state.certificate.days = days;
  document.querySelectorAll('.day-btn').forEach(btn => {
    const d = parseInt(btn.getAttribute('data-days'), 10);
    btn.classList.toggle('active', d === days);
  });
  renderAtestadoSheet();
}

function toggleCidAtestado(cb) {
  state.certificate.includeCid = cb.checked;
  renderAtestadoSheet();
}

function renderAtestadoSheet() {
  const container = document.getElementById('atestado-sheet-render');
  if (!container) return;

  const d = state.dentist;
  const p = state.patient;
  const isAfastamento = state.certificate.type !== 'comparecimento';
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const procTitle = state.procedure.cfoData?.title || state.procedure.title || 'Procedimento Odontológico';

  const cidText = state.certificate.includeCid 
    ? ` — CID-10: <strong>${state.certificate.cidCode || 'K08.1'}</strong> (Autorizado expressamente pelo paciente - Resolução CFO 105/2010)` 
    : '';

  let titleDoc = '';
  let bodyText = '';

  if (isAfastamento) {
    const days = state.certificate.days || 2;
    const daysStr = days === 1 ? '1 (um) dia' : `${days} (${extensoDias(days)}) dias`;
    titleDoc = 'Atestado Odontológico de Afastamento';
    bodyText = `Atesto para os devidos fins de comprovação e justificativa legal que o(a) Sr(a). <strong>${escapeHtml(p.name)}</strong>, portador(a) do CPF nº <strong>${escapeHtml(p.cpf)}</strong>, foi submetido(a) nesta data ao procedimento de <strong>${escapeHtml(procTitle)}</strong> em meu consultório profissional, necessitando de <strong>${daysStr}</strong> de afastamento de suas atividades profissionais e habituais para repouso clínico e convalescença a partir desta data${cidText}.`;
  } else {
    titleDoc = 'Declaração Odontológica de Comparecimento';
    const sTime = state.certificate.startTime || '09:00';
    const eTime = state.certificate.endTime || '10:30';
    bodyText = `Atesto para os devidos fins de comprovação que o(a) Sr(a). <strong>${escapeHtml(p.name)}</strong>, portador(a) do CPF nº <strong>${escapeHtml(p.cpf)}</strong>, compareceu a este consultório odontológico nesta data, tendo permanecido em consulta e atendimento odontológico especializado das <strong>${escapeHtml(sTime)}</strong> às <strong>${escapeHtml(eTime)}</strong> para a realização do procedimento de <strong>${escapeHtml(procTitle)}</strong>${cidText}.`;
  }

  container.innerHTML = `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:24px; color:#1d1d1f; font-size:13.5px; line-height:1.65; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align:center; border-bottom:1.5px solid #0071e3; padding-bottom:12px; margin-bottom:18px;">
        <h3 style="font-size:16px; font-weight:800; color:#0071e3; text-transform:uppercase; margin:0;">${titleDoc}</h3>
        <p style="font-size:11.5px; color:#64748b; margin:2px 0 0 0;">Lei Federal nº 5.081/66, Art. 6º, III e Resolução CFO nº 105/2010</p>
      </div>

      <p style="text-align:justify; margin-bottom:18px;">
        ${bodyText}
      </p>

      <p style="font-size:12px; color:#64748b; margin-top:24px;">
        Local: <strong>${escapeHtml(d.city || 'São Paulo - SP')}</strong>, em ${currentDate}.
      </p>

      <div style="margin-top:40px; text-align:center; display:flex; justify-content:center;">
        <div style="border-top:1px solid #334155; padding-top:6px; width:280px; font-size:12px;">
          <strong>${escapeHtml(d.name)}</strong><br>
          <span style="color:#64748b;">Cirurgião-Dentista Responsável (${escapeHtml(d.cro)})</span>
        </div>
      </div>
    </div>
  `;
}

function printAtestadoOnly() {
  const content = document.getElementById('atestado-sheet-render')?.innerHTML;
  if (!content) return;

  const w = window.open('', '_blank');
  w.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Atestado Odontológico — ${escapeHtml(state.patient.name)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1d1d1f; }
          @media print { @page { size: A4; margin: 20mm; } }
        </style>
      </head>
      <body>
        ${content}
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `);
  w.document.close();
}

function extensoDias(n) {
  const map = { 1: 'um', 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis', 7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez', 14: 'quatorze', 15: 'quinze' };
  return map[n] || String(n);
}

// ==========================================================================
// Módulo Sequencial 2: Receituário Inteligente Compatível
// ==========================================================================
function getCompatiblePrescriptionPreset() {
  // 1. Alergia a Penicilina
  if (state.healthConditions.has('alergia_penicilina') || state.healthConditions.has('alergias')) {
    return {
      presetKey: 'alergico',
      reason: 'Paciente alérgico a Penicilina (Azitromicina selecionada com segurança)'
    };
  }

  const procId = state.procedure.id || '';
  const procTitle = (state.procedure.cfoData && state.procedure.cfoData.id === procId
    ? state.procedure.cfoData.title
    : (state.procedure.title || '')).toLowerCase();
  const spec = (state.procedure.specialty || '').toLowerCase();

  // 2. Procedimento Cirúrgico / Sisos / Implantes
  if (
    procId === 'implante' ||
    procId === 'cirurgia_siso' ||
    procTitle.includes('siso') ||
    procTitle.includes('implante') ||
    procTitle.includes('enxerto') ||
    procTitle.includes('exodontia') ||
    procTitle.includes('cirurg') ||
    procTitle.includes('frenectomia') ||
    procTitle.includes('apicectomia') ||
    spec.includes('cirurgia') ||
    spec.includes('implantodontia')
  ) {
    return {
      presetKey: 'cirurgico',
      reason: 'Procedimento Cirúrgico / Reabilitador (Antibioticoterapia + Anti-inflamatório)'
    };
  }

  // 3. Canal / Endodontia / Dor Aguda
  if (
    procId === 'canal' ||
    procTitle.includes('canal') ||
    procTitle.includes('endodont') ||
    procTitle.includes('pulpectomia') ||
    procTitle.includes('abcesso') ||
    procTitle.includes('dor aguda') ||
    spec.includes('endodontia')
  ) {
    return {
      presetKey: 'canal',
      reason: 'Tratamento Endodôntico / Dor Aguda (Anti-inflamatório sublingual + Analgésico)'
    };
  }

  // 4. HOF / Harmonização
  if (
    procId === 'harmonizacao' ||
    procTitle.includes('harmoniza') ||
    procTitle.includes('botox') ||
    procTitle.includes('toxina') ||
    procTitle.includes('preenchimento') ||
    procTitle.includes('hialur') ||
    procTitle.includes('fios') ||
    spec.includes('harmonização')
  ) {
    return {
      presetKey: 'hof',
      reason: 'Harmonização Orofacial (HOF) — Analgesia que previne sangramentos + Arnica'
    };
  }

  // 5. Procedimentos de Rotina / Conservadores
  return {
    presetKey: 'leve',
    reason: 'Procedimento Conservador / Rotina (Analgesia simples para conforto)'
  };
}

function openPrescriptionAuto() {
  const modal = document.getElementById('post-modal-prescription');
  if (!modal) return;

  const compat = getCompatiblePrescriptionPreset();
  selectRxPresetOption(compat.presetKey);

  const reasonEl = document.getElementById('rx-compat-reason');
  if (reasonEl) reasonEl.textContent = compat.reason;

  modal.style.display = 'block';
  modal.scrollIntoView({ behavior: 'smooth' });
}

function openPrescriptionModule() {
  openPrescriptionAuto();
}

function closePrescriptionModal() {
  const modal = document.getElementById('post-modal-prescription');
  if (modal) modal.style.display = 'none';
}

function selectRxPresetOption(presetKey) {
  state.prescription.presetId = presetKey;
  document.querySelectorAll('.rx-card-option').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-rx') === presetKey);
  });
  renderPrescriptionSheet();
}

function renderPrescriptionSheet() {
  const container = document.getElementById('prescription-sheet-render');
  if (!container) return;

  const d = state.dentist;
  const p = state.patient;
  const presetKey = state.prescription.presetId || 'cirurgico';
  const preset = RX_PRESETS[presetKey] || RX_PRESETS.cirurgico;
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:24px; color:#1d1d1f; font-size:13px; line-height:1.6; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1.5px solid #0071e3; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h3 style="font-size:16px; font-weight:800; color:#0071e3; text-transform:uppercase; margin:0;">Receituário Odontológico</h3>
          <p style="font-size:11.5px; color:#64748b; margin:2px 0 0 0;">${escapeHtml(d.clinic || 'Consultório Odontológico')} — Dr(a). ${escapeHtml(d.name)} (${escapeHtml(d.cro)})</p>
        </div>
        <div style="font-size:11.5px; color:#64748b; text-align:right;">
          Data: ${currentDate}
        </div>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; margin-bottom:16px; font-size:12.5px;">
        <strong>Paciente:</strong> ${escapeHtml(p.name)} | <strong>CPF:</strong> ${escapeHtml(p.cpf)}
      </div>

      <div style="margin: 16px 0;">
        <h4 style="font-size:12px; font-weight:700; color:#0071e3; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">
          Uso Oral / Tópico:
        </h4>
        ${preset.items.map((item, idx) => `
          <div style="margin-bottom:14px; padding-bottom:12px; border-bottom:1px dashed #e2e8f0;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13.5px; color:#0f172a;">
              <span>${idx + 1}. ${item.name}</span>
              <span style="font-size:12px; color:#64748b;">${item.qty}</span>
            </div>
            <div style="font-size:12.5px; color:#334155; margin-top:3px; padding-left:14px;">
              Posologia: ${item.instructions}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:36px; text-align:center; display:flex; justify-content:center;">
        <div style="border-top:1px solid #334155; padding-top:6px; width:280px; font-size:12px;">
          <strong>${escapeHtml(d.name)}</strong><br>
          <span style="color:#64748b;">Cirurgião-Dentista Responsável (${escapeHtml(d.cro)})</span>
        </div>
      </div>
    </div>
  `;
}

function printPrescriptionOnly() {
  const content = document.getElementById('prescription-sheet-render')?.innerHTML;
  if (!content) return;

  const w = window.open('', '_blank');
  w.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receituário Odontológico — ${escapeHtml(state.patient.name)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1d1d1f; }
          @media print { @page { size: A4; margin: 20mm; } }
        </style>
      </head>
      <body>
        ${content}
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `);
  w.document.close();
}

function finishAndConcludeService() {
  closeAtestadoModal();
  closePrescriptionModal();

  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(29, 29, 31, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    color: #ffffff;
    padding: 16px 28px;
    border-radius: 9999px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.3);
    font-size: 14.5px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 999999;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.innerHTML = `
    <span style="font-size: 20px;">🎉</span>
    <span>Atendimento de <strong>${escapeHtml(state.patient.name || 'Paciente')}</strong> concluído e arquivado com sucesso!</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ==========================================================================
// Assinatura Digital Touch / Mouse
// ==========================================================================
let signaturePadInstance = null;

function setupTouchSignature() {
  const canvas = document.getElementById('touch-signature-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.strokeStyle = '#0071e3';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
  }

  function endDraw() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw);
}

function clearSignature() {
  const canvas = document.getElementById('touch-signature-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const clearTouchSignature = clearSignature;
if (typeof window !== 'undefined') window.clearTouchSignature = clearSignature;

// ==========================================================================
// Ações Finais: Imprimir, WhatsApp, Copiar, Novo Atendimento
// ==========================================================================
function printTcleDocument() {
  window.print();
}

function copyTcleTextToClipboard() {
  const textEl = document.getElementById('official-tcle-paper');
  if (!textEl) return;
  navigator.clipboard.writeText(textEl.innerText).then(() => {
    alert('Texto do TCLE copiado para a área de transferência com sucesso!');
  }).catch(() => {
    alert('Não foi possível copiar automaticamente. Selecione e copie o texto.');
  });
}

function sendWhatsAppNotice() {
  const phone = state.patient.phone.replace(/\D/g, '');
  const pName = state.patient.name;
  const procTitle = state.procedure.cfoData?.title || state.procedure.title;
  const clinic = state.dentist.clinic || 'Consultório Odontológico';

  const msg = encodeURIComponent(
    `Olá ${pName}! Aqui é da ${clinic}. O seu Termo de Consentimento Livre e Esclarecido (TCLE) para o procedimento de ${procTitle} foi emitido com sucesso e arquivado em seu prontuário digital seguro. Estamos à disposição para qualquer dúvida!`
  );

  const url = phone ? `https://wa.me/55${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
  window.open(url, '_blank');
}

function startNewService() {
  if (confirm('Deseja iniciar um novo atendimento? Os dados do paciente atual serão limpos.')) {
    state.patient = { name: '', cpf: '', rg: '', birthDate: '', phone: '', address: '' };
    state.healthConditions.clear();
    state.procedure.selectedTeeth = ['11'];
    state.procedure.cfoData = null;

    const pName = document.getElementById('field-patient-name');
    const pCpf = document.getElementById('field-patient-cpf');
    const pBirth = document.getElementById('field-patient-birth');
    const pPhone = document.getElementById('field-patient-phone');
    if (pName) pName.value = '';
    if (pCpf) pCpf.value = '';
    if (pBirth) pBirth.value = '';
    if (pPhone) pPhone.value = '';

    document.querySelectorAll('.condition-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('cond-none')?.classList.add('active');

    closeAtestadoModal();
    closePrescriptionModal();
    renderLudicOdontogram();
    updateActiveExtendedTags();
    showScreen('screen-patient');
  }
}

// Máscaras e Utilitários
function setupMasks() {
  const cpfEl = document.getElementById('field-patient-cpf');
  if (cpfEl) {
    cpfEl.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      e.target.value = v;
    });
  }

  const phoneEl = document.getElementById('field-patient-phone');
  if (phoneEl) {
    phoneEl.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,5})/, '($1) $2');
      e.target.value = v;
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
