/**
 * ============================================================================
 * DENTALSAFE CLINICAL AI ENGINE (clinical-ai-engine.js)
 * Motor Avançado de Processamento de Linguagem Natural (NLP) Clínico-Odontológico,
 * Extração Semântica de Entidades e Síntese Forense para TCLE Personalizado.
 *
 * Em conformidade estrita com:
 * - Código de Defesa do Consumidor (Art. 6º, III e Art. 14, § 3º, II - Lei 8.078/90)
 * - Jurisprudência do Superior Tribunal de Justiça (STJ REsp 1.540.580/DF e REsp 1.871.939/SP)
 * - Código de Ética Odontológica (Resolução CFO-118/2012)
 * - Diretrizes Científicas da ABOL, AHA, EFP e SBPqO
 * ============================================================================
 */

(function (global) {
  'use strict';

  // Dicionário canônico de termos didáticos para o Glossário Dinâmico (CDC Art. 6º, III)
  const CLINICAL_GLOSSARY_DICTIONARY = {
    'waveone': {
      term: 'WaveOne Gold / Sistema Reciprocante de NiTi',
      def: 'Instrumento cirúrgico flexível de liga nobre de Níquel-Titânio com tratamento térmico especial. Realiza a modelagem tridimensional do canal radicular por movimento reciprocante de oscilação anti-horária/horária, minimizando o estresse mecânico e o risco de fadiga do metal em raízes curvas.'
    },
    'reciproc': {
      term: 'Reciproc Blue / Instrumentação Reciprocante',
      def: 'Sistema endodôntico contemporâneo confeccionado em liga NiTi tratada com tecnologia térmica azul (Blue), conferindo extrema flexibilidade e elevada resistência à fadiga cíclica na anatomia interna radicular.'
    },
    'protaper': {
      term: 'ProTaper Gold / Ultimate',
      def: 'Série progressiva de limas rotatórias de NiTi desenhadas para o preparo anatômico escalonado de canais estreitos ou atrésicos.'
    },
    'localizador': {
      term: 'Localizador Apical Eletrônico',
      def: 'Aparelho digital de alta precisão que mede a impedância elétrica celular para determinar o comprimento exato da raiz e o término do canal (forame apical), reduzindo a quantidade de tomadas radiográficas e evitando sobreinstrumentação.'
    },
    'pui': {
      term: 'Irrigação Ultrassônica Passiva (PUI)',
      def: 'Ativação acústica de fluidos desinfetantes no interior do canal radicular através de pontas oscilatórias de ultrassom. Promove microcorrentes que desprendem biofilmes bacterianos das reentrâncias anatômicas inacessíveis às limas.'
    },
    'hipoclorito': {
      term: 'Hipoclorito de Sódio (NaOCl)',
      def: 'Solução desinfetante padrão-ouro em endodontia com capacidade bactericida de amplo espectro e propriedade biológica de dissolução de tecido necrótico no interior dos canais radiculares.'
    },
    'edta': {
      term: 'EDTA a 17% (Ácido Etilenodiaminotetracético)',
      def: 'Agente quelante biocompatível utilizado na etapa final de desinfecção para desobstruir os túbulos dentinários (remoção de smear layer), viabilizando a adesão impermeável do cimento obturador às paredes do dente.'
    },
    'hidroxido': {
      term: 'Curativo de Demora com Hidróxido de Cálcio',
      def: 'Medicação antimicrobiana alcalina inserida no interior do dente entre as sessões clínicas para esterilizar a luz do canal, alcalinizar o pH periapical e induzir o fechamento de lesões ou fístulas infecciosas.'
    },
    'mta': {
      term: 'MTA (Agregado Trióxido Mineral)',
      def: 'Biomaterial de biocompatibilidade superior e capacidade osteoindutora/dentinogênica, capaz de selar hermeticamente perfurações radiculares, retrobturações cirúrgicas ou realizar o fechamento de ápices dentários abertos.'
    },
    'biodentine': {
      term: 'Biodentine / Cimento Biocerâmico Reparador',
      def: 'Substituto dentinário bioativo à base de silicato tricálcico sintético de alta pureza. Estimula a formação de nova dentina reparadora e veda comunicações pulpares com excelência celular.'
    },
    'bioceramico': {
      term: 'Cimento Endodôntico Biocerâmico',
      def: 'Cimento obturador inovador contendo partículas biocerâmicas que se expandem sutilmente ao contato com a umidade dentinária, produzindo hidroxiapatita biológica e garantindo vedação antibacteriana hermética perene.'
    },
    'biooss': {
      term: 'Bio-Oss / Biomaterial Ósseo Mineral Inorgânico',
      def: 'Enxerto ósseo de origem bovina liofilizada desproteinizada, com estrutura porosa idêntica à do osso esponjoso humano. Atua como arcabouço osteocondutor sustentável sobre o qual o organismo deposita novo osso vivo.'
    },
    'membrana': {
      term: 'Membrana de Colágeno Reabsorvível (Bio-Gide)',
      def: 'Barreira biológica de colágeno porcino puro que isola o enxerto ósseo contra a invasão rápida das células epiteliais da gengiva, permitindo a regeneração óssea guiada (ROG) de forma protegida.'
    },
    'fistula': {
      term: 'Fístula Ativa / Trato Fistuloso',
      def: 'Canal de drenagem espontânea formado pelo organismo através do osso e da gengiva para escoar secreção inflamatória e pus provenientes de uma infecção bacteriana profunda instalada no ápice da raiz dental.'
    },
    'necrose': {
      term: 'Necrose Pulpar',
      def: 'Morte celular irreversível do feixe vasculonervoso (polpa dental) no interior do dente, geralmente provocada por cárie profunda, trinca ou trauma dental, tornando o dente um reservatório bacteriano que exige descontaminação endodôntica.'
    },
    'pericoronite': {
      term: 'Pericoronite Aguda',
      def: 'Processo inflamatório e infeccioso doloroso da gengiva que recobre a coroa de um dente parcialmente erupcionado (comum em terceiros molares / sisos inferiores), decorrente do acúmulo de biofilme e bactérias sob o capuz gengival.'
    },
    'parestesia': {
      term: 'Parestesia Nervosa',
      def: 'Alteração temporária da sensibilidade tátil e térmica de lábio, queixo ou língua (sensação de formigamento ou anestesia mantida) provocada pela proximidade anatômica das raízes cirúrgicas com o Nervo Alveolar Inferior ou Lingual.'
    },
    'bisfosfonato': {
      term: 'Bisfosfonato / Risco de MRONJ',
      def: 'Classe medicamentosa (alendronato, zoledronato, etc.) que inibe a remodelação das células ósseas. Pode acarretar Osteonecrose dos Maxilares Associada a Medicamentos após procedimentos cirúrgicos invasivos na boca.'
    },
    'hialuronidase': {
      term: 'Hialuronidase Injetável',
      def: 'Enzima médica de resgate imediato utilizada para quebrar e dissolver o ácido hialurônico injetado em casos raros de compressão ou oclusão vascular em Harmonização Orofacial (HOF).'
    },
    'sinuslift': {
      term: 'Levantamento de Seio Maxilar (Sinus Lift)',
      def: 'Procedimento cirúrgico reconstrutivo na maxila posterior para elevação cuidadosa da membrana sinusal (membrana de Schneider) e preenchimento com biomaterial ósseo, restaurando a altura óssea vertical indispensável para a fixação estável de implantes dentários.'
    },
    'osseointegracao': {
      term: 'Osseointegração do Implante',
      def: 'Conexão estrutural e funcional direta e microscópica entre o osso vivo receptor do paciente e a superfície de titânio do implante dentário, dependente de resposta biológica celular imune individual e ausência de micromovimentação precoce.'
    },
    'periimplantite': {
      term: 'Peri-implantite / Mucosite',
      def: 'Processo inflamatório destrutivo dos tecidos moles e perda progressiva do osso de suporte ao redor do implante osteointegrado, provocado pelo acúmulo de biofilme bacteriano, higienização precária, tabagismo ou sobrecarga oclusal.'
    },
    'desgaste_esmalte': {
      term: 'Desgaste Dentário Irreversível (Facetas/Lentes)',
      def: 'Remoção micrométrica mecânica e definitiva da camada externa de esmalte natural dos dentes para permitir a adaptação passiva e cimentação de facetas ou lentes de contato cerâmicas. Torna o paciente dependente de peças artificiais em caráter perpétuo.'
    },
    'contencao_orto': {
      term: 'Contenção Ortodôntica Perene (Fixa ou Móvel)',
      def: 'Aparelho passivo de estabilização pós-tratamento ortodôntico (fio de contenção fixo lingual ou placas termoplásticas noturnas) indispensável para neutralizar as forças elásticas do ligamento periodontal e evitar o retorno dos dentes para posições tortas.'
    },
    'recidiva_orto': {
      term: 'Recidiva Ortodôntica',
      def: 'Tendência biológica natural e involuntária de movimentação adversa dos dentes em direção às suas posições originais de apinhamento prévias ao tratamento, decorrente da maturação contínua do arco facial e da perda ou não uso regular das contenções.'
    },
    'blackspaces': {
      term: 'Espaços Negros Interdentais (Black Spaces)',
      def: 'Pequenos triângulos escuros formados entre os dentes após o tratamento periodontal, decorrentes da desinflamação e encolhimento saudável da gengiva que estava anteriormente edemaciada pela infecção bacteriana.'
    },
    'clareamento_sensib': {
      term: 'Sensibilidade Dentinária por Clareamento',
      def: 'Sensação térmica aguda e transitória ao contato com frio ou ar, resultante da difusão microscópica transitória dos radicais livres de peróxido através dos canalículos da dentina até a polpa dental, autolimitada e controlável com dessensibilizantes.'
    },
    'espaco_biologico': {
      term: 'Espaço Biológico Periodontal / Distância Biológica',
      def: 'Dimensão anatômica inviolável de cerca de 3 milímetros entre a crista do osso alveolar e a margem livre da gengiva (composta por epitélio juncional e inserção conjuntiva). Sua reconstituição cirúrgica via osteotomia evita inflamação crônica, sangramento e retração gengival inestética.'
    },
    'osteotomia_estetica': {
      term: 'Osteotomia e Osteoplastia de Contorno',
      def: 'Remoção e remodelamento micrométrico controlado do osso alveolar para restabelecer a proporção áurea dos dentes, corrigir o sorriso gengival e recriar o espaço biológico periodontal sem causar mobilidade dental.'
    },
    'arteria_palatina_maior': {
      term: 'Artéria Palatina Maior e Feixe Vasculonervoso Palatino',
      def: 'Tronco vascular e nervoso de grande calibre localizado no palato duro (céu da boca). Exige mapeamento anatômico rigoroso na coleta de enxertos gengivais livres ou conjuntivos para prevenir hemorragia transoperatória grave.'
    },
    'enxerto_conjuntivo': {
      term: 'Enxerto de Tecido Conjuntivo Subepitelial Autólogo',
      def: 'Transplante autólogo de tecido conjuntivo removido do palato do próprio paciente para recobrir raízes expostas (recessões gengivais), eliminar hipersensibilidade radicular e aumentar a faixa de gengiva queratinizada protetora.'
    },
    'ducto_wharton': {
      term: 'Ducto de Wharton / Glândula Submandibular',
      def: 'Conduto excretor de saliva que desemboca no assoalho bucal junto ao freio da língua (carúncula sublingual). Deve ser criteriosamente protegido durante a frenectomia lingual para evitar secção acidental, estenose salivar ou formação de rânula traumática.'
    },
    'apicectomia': {
      term: 'Apicectomia com Retrobturação Biocerâmica',
      def: 'Microcirurgia paraendodôntica que resseca os 3 milímetros finais da raiz do dente (onde se concentram 90% das ramificações infectadas intratáveis), seguida de preparo ultrassônico retrógrado e selamento estanque com cimento bioativo (MTA ou Biodentine).'
    },
    'protocolo_branemark': {
      term: 'Prótese Protocolo Fixo Branemark / All-on-4',
      def: 'Reabilitação bucal total com dentadura fixa parafusada sobre 4 ou mais implantes dentários osseointegrados, devolvendo força mastigatória de até 85% do dente natural e eliminando próteses móveis removíveis instáveis.'
    },
    'carga_imediata': {
      term: 'Carga Imediata sobre Implantes Dentários',
      def: 'Instalação da prótese fixa provisória nas primeiras 24 a 72 horas após a cirurgia de instalação dos implantes. Exige torque cirúrgico de inserção superior a 35 a 45 N.cm e estabilidade óssea primária rígida para não inviabilizar a osseointegração.'
    },
    'dispositivo_avanco_mandibular': {
      term: 'Dispositivo de Avanço Mandibular (DAM) Titrável',
      def: 'Aparelho odontológico intraoral de avanço gradual da mandíbula usado durante o sono para desobstruir as vias aéreas superiores, eliminando os episódios de ronco sonoro e dessaturação de oxigênio na Apneia Obstrutiva do Sono (SAOS).'
    },
    'sedacao_oxido_nitroso': {
      term: 'Sedação Consciente Inalatória com Óxido Nitroso (N2O/O2)',
      def: 'Técnica de alívio da dor e ansiólise controlada através da inalação contínua de mistura de gás óxido nitroso e oxigênio (mínimo 30% de O2). O paciente mantém os reflexos laríngeos e a consciência responsiva preservados durante todo o procedimento.'
    },
    'comunicacao_bucosinusal': {
      term: 'Comunicação Bucosinusal e Manobra de Valsalva',
      def: 'Abertura anatômica acidental entre a cavidade bucal e o seio maxilar provocada pela proximidade das raízes dos molares/pré-molares superiores com o assoalho sinusal. Exige fechamento cirúrgico imediato por retalho e proibição estrita de assoar o nariz para prevenir fístula crônica e sinusite.'
    }
  };

  /**
   * Construtor da Classe de Inteligência Clínica
   */
  function DentalSafeClinicalAI() {}

  // "Protocolo" isolado descreve uma conduta em qualquer especialidade.
  DentalSafeClinicalAI.mentionsImplantProtocol = function (text) {
    return /\b(?:pr[oó]tese\s+protocolo|protocolo\s+(?:fixo|branemark|sobre\s+implantes)|all[ -]on[ -](?:4|6|four|six)|branemark)\b/i.test(text || '');
  };

  /**
   * Extrai elementos dentários no formato FDI (11-48, 51-85) a partir do texto e do odontograma
   */
  DentalSafeClinicalAI.extractTeeth = function (text, explicitTeethList) {
    const teethFound = new Set();

    if (Array.isArray(explicitTeethList)) {
      explicitTeethList.forEach(t => {
        const num = String(t).trim();
        if (/^(?:[1-4][1-8]|[5-8][1-5])$/.test(num)) teethFound.add(num);
      });
    }

    if (!text) return Array.from(teethFound);

    // Não interpretar idade, dose, prazo ou carga tabágica como dentes.
    const candidates = text.matchAll(/\b([1-8][1-8])\b/g);
    for (const match of candidates) {
      const number=match[1];
      if(!/^(?:[1-4][1-8]|[5-8][1-5])$/.test(number)) continue;
      const after=text.slice(match.index+match[0].length);
      if(/^\s*(?:(?:a|até|-)\s*\d+\s*)?(?:anos?|meses?|dias?|horas?|h\b|mg\b|ml\b|kg\b|cig|%|mm\b|minutos?)/i.test(after)) continue;
      teethFound.add(number);
    }

    return Array.from(teethFound).sort();
  };

  /**
   * Mapeamento semântico completo do caso clínico a partir de textos e marcações
   */
  // Conservative sentence-level negation; explicit checked conditions remain authoritative.
  DentalSafeClinicalAI.affirmedText = function(text) {
    return String(text || '').replace(/\b(?:sem|nega|negou|aus[eê]ncia\s+de|n[aã]o\s+(?:apresenta|possui|tem|refere))\b[^.;\n]*?(?=\bmas\b|\bpor[eé]m\b|[.;\n]|$)/gi,' ');
  };
  DentalSafeClinicalAI.parseClinicalInput = function (ctx) {
    const diagnosis = (ctx.procDiag || '').trim();
    const region = (ctx.procRegion || '').trim();
    const dictation = (ctx.dictation || '').trim();
    const combinedText = DentalSafeClinicalAI.affirmedText(`${diagnosis}. ${region}. ${dictation}`).toLowerCase();

    // 1. Dentes e Região Anatômica
    const selectedTeeth = DentalSafeClinicalAI.extractTeeth(`${region} ${combinedText}`, ctx.selectedTeeth || []);
    
    // Mapeamento anatômico nobre
    const anatomy = {
      teeth: selectedTeeth,
      hasMandibularCanalProximity: /canal\s+mandibular|nervo\s+alveolar|nai\b|nervo\s+lingual|forame\s+mentual|parestesia/i.test(combinedText) || Boolean(ctx.procNeedsParesthesia),
      hasMaxillarySinusProximity: /seio\s+maxilar|assoalho\s+do\s+seio|sinus\s+lift|membrana\s+sinusal|fundo\s+de\s+seio/i.test(combinedText),
      hasMentalForamenProximity: /forame\s+mentual|mento|mentoniano|pr[eé]-molar\s+inferior/i.test(combinedText),
      hasPalatalGraftRisk: /enxerto\s+(?:conjuntivo|livre|epitelial|palatino)|palato|c[eé]u\s+da\s+boca/i.test(combinedText) || ctx.procKey === 'enxerto_gengival',
      hasSublingualRisk: /freio\s+lingual|frenectomia\s+lingual|anquiloglossia|assoalho\s+(?:bucal|da\s+boca)|wharton/i.test(combinedText) || (ctx.procKey === 'frenectomia' && /lingual/i.test(combinedText)),
      isPosteriorMandible: selectedTeeth.some(t => ['36','37','38','46','47','48','84','85','74','75'].includes(t)) || /molar\s+inferior|mand[ií]bula\s+posterior/i.test(combinedText),
      isAnteriorMaxilla: selectedTeeth.some(t => ['13','12','11','21','22','23','51','52','53','61','62','63'].includes(t)) || /[aâ]ntero-superior|est[eé]tica\s+anterior/i.test(combinedText),
      roots: {
        mesial: /raiz\s+mesial|m[eé]sio-vestibular|mv2|m[eé]sio-lingual/i.test(combinedText),
        distal: /raiz\s+distal|disto-vestibular|disto-lingual/i.test(combinedText),
        palatal: /raiz\s+palatina|palatina/i.test(combinedText)
      }
    };

    // 2. Patologias e Achados Clínicos Detectados
    const pathologies = [];
    if (/f[ií]stula|trato\s+fistuloso|drenagem|abcesso\s+com\s+f[ií]stula|par[uú]lide/i.test(combinedText)) {
      pathologies.push({ id: 'fistula', label: 'Fístula Ativa / Drenagem Mucosa', category: 'endoperio' });
    }
    if (/necrose|mortifica[çc][ãa]o|polpa\s+morta|desvitalizado/i.test(combinedText)) {
      pathologies.push({ id: 'necrose', label: 'Necrose Pulpar / Desvitalização', category: 'endo' });
    }
    if (/pulpite\s+irrevers[ií]vel|dor\s+espont[âa]nea|puls[aá]til/i.test(combinedText)) {
      pathologies.push({ id: 'pulpite_irrev', label: 'Pulpite Irreversível Aguda', category: 'endo' });
    }
    if (/les[ãa]o\s+periapical|rarefa[çc][ãa]o|granuloma|cisto\s+periapical|periodontite\s+apical|radiolucidez/i.test(combinedText)) {
      pathologies.push({ id: 'lesao_periapical', label: 'Lesão Osteolítica Periapical', category: 'endo' });
    }
    if (/curvatura\s+(?:acentuada|severa|pronunciada|dilacera)|dilacera[çc][ãa]o|raiz\s+curva/i.test(combinedText)) {
      pathologies.push({ id: 'curvatura_severa', label: 'Curvatura Radicular Acentuada / Dilaceração', category: 'endo_anat' });
    }
    if (/calcifica|atr[eé]sico|canal\s+estreito|n[oó]dulo\s+pulpar|oblitera/i.test(combinedText)) {
      pathologies.push({ id: 'calcificacao', label: 'Canal Calcificado / Atrésico', category: 'endo_anat' });
    }
    if (/trinca|fratura\s+vertical|fratura\s+coronorradicular|raiz\s+trincada/i.test(combinedText)) {
      pathologies.push({ id: 'trinca', label: 'Trinca Radicular / Fragilidade Estrutural', category: 'biomecanica' });
    }
    if (/reabsor[çc][ãa]o\s+(?:externa|interna|cervical|radicular)/i.test(combinedText)) {
      pathologies.push({ id: 'reabsorcao', label: 'Reabsorção Radicular Ativa', category: 'biologia' });
    }
    if (/pericoronite|op[eé]rculo|capuz\s+gengival/i.test(combinedText)) {
      pathologies.push({ id: 'pericoronite', label: 'Pericoronite Aguda em Terceiro Molar', category: 'cirurgia' });
    }
    if (/trismo|abertura\s+bucal\s+limitada|dificuldade\s+para\s+abrir\s+a\s+boca/i.test(combinedText)) {
      pathologies.push({ id: 'trismo', label: 'Trismo Muscular Reflexo', category: 'funcional' });
    }
    if (/siso|incluso|semi-incluso|impactado|dente\s+do\s+ju[ií]zo/i.test(combinedText)) {
      pathologies.push({ id: 'inclusao', label: 'Dente Incluso / Semi-incluso', category: 'cirurgia' });
    }
    if (/perda\s+[oó]ssea|atrofia|reabsor[çc][ãa]o\s+[oó]ssea|rebordo\s+reabsorvido/i.test(combinedText) || Boolean(ctx.cBone)) {
      pathologies.push({ id: 'atrofia_ossea', label: 'Atrofia / Reabsorção Óssea Prévia', category: 'osseo' });
    }
    if (/periodontite|bolsa\s+periodontal|sangramento\s+gengival|t[aá]rtaro\s+subgengival/i.test(combinedText) || Boolean(ctx.cPerio)) {
      pathologies.push({ id: 'periodontite', label: 'Doença Periodontal Ativa', category: 'perio' });
    }
    if (/sorriso\s+gengival|excesso\s+gengival|erup[çc][ãa]o\s+passiva\s+alterada/i.test(combinedText) || ctx.procKey === 'gengivoplastia') {
      pathologies.push({ id: 'sorriso_gengival', label: 'Erupção Passiva Alterada / Sorriso Gengival', category: 'perio_estetica' });
    }
    if (/recess[ãa]o\s+gengival|retra[çc][ãa]o\s+gengival|raiz\s+exposta|defeito\s+mucogengival/i.test(combinedText) || ctx.procKey === 'enxerto_gengival') {
      pathologies.push({ id: 'recessao_gengival', label: 'Recessão Tecidual Marginal / Raiz Exposta', category: 'perio_plastica' });
    }
    if (/anquiloglossia|l[ií]ngua\s+presa|freio\s+(?:lingual|labial)\s+(?:curto|hipertr[oó]fico)|diastema\s+interincisivo/i.test(combinedText) || ctx.procKey === 'frenectomia') {
      pathologies.push({ id: 'anquiloglossia', label: 'Anquiloglossia / Freio Labial/Lingual Hipertrófico', category: 'cirurgia' });
    }
    if (/les[ãa]o\s+refrat[aá]ria|insucesso\s+endod[oô]ntico|retratamento\s+falho|fratura\s+de\s+lima\s+apical/i.test(combinedText) || ctx.procKey === 'apicectomia') {
      pathologies.push({ id: 'refratario_endo', label: 'Infecção Periapical Refratária / Indicação Cirúrgica Parendodôntica', category: 'endo_cirurgica' });
    }
    if (/edentalismo|desdentado\s+total|arcada\s+desdentada|pr[oó]tese\s+total\s+inst[aá]vel/i.test(combinedText) || ctx.procKey === 'protocolo_implante') {
      pathologies.push({ id: 'edentalismo_total', label: 'Edentulismo Total / Arcada Mandibular/Maxilar Colapsada', category: 'implantodontia' });
    }
    if (/apneia\s+obstrutiva|ronco|roncopatia|iah\b|sonol[eê]ncia\s+diurna|saos\b/i.test(combinedText) || ctx.procKey === 'ronco_apneia') {
      pathologies.push({ id: 'saos', label: 'Síndrome da Apneia Obstrutiva do Sono (SAOS) / Roncopatia', category: 'sono' });
    }

    // 3. Protocolos Técnicos, Instrumentos, Marcas e Biomateriais
    const protocols = [];
    if (/waveone(?:\s+gold)?/i.test(combinedText)) {
      protocols.push({ id: 'waveone', label: 'WaveOne Gold (NiTi Reciprocante)', type: 'instrument' });
    }
    if (/reciproc(?:\s+blue)?/i.test(combinedText)) {
      protocols.push({ id: 'reciproc', label: 'Reciproc Blue (NiTi Térmica)', type: 'instrument' });
    }
    if (/protaper(?:\s+(?:gold|ultimate))?/i.test(combinedText)) {
      protocols.push({ id: 'protaper', label: 'ProTaper Gold / Ultimate', type: 'instrument' });
    }
    if (/localizador\s+apical|comprimento\s+eletr[oô]nico/i.test(combinedText)) {
      protocols.push({ id: 'localizador', label: 'Localizador Apical Eletrônico', type: 'tech' });
    }
    if (/pui\b|irriga[çc][ãa]o\s+ultrass[oô]nica|ativa[çc][ãa]o\s+por\s+ultrassom/i.test(combinedText)) {
      protocols.push({ id: 'pui', label: 'Irrigação Ultrassônica Passiva (PUI)', type: 'tech' });
    }
    if (/hipoclorito|naocl/i.test(combinedText)) {
      protocols.push({ id: 'hipoclorito', label: 'Hipoclorito de Sódio (NaOCl)', type: 'chem' });
    }
    if (/edta/i.test(combinedText)) {
      protocols.push({ id: 'edta', label: 'EDTA 17% Quelante', type: 'chem' });
    }
    if (/hidr[oó]xido\s+de\s+c[aá]lcio|calen|curativo\s+de\s+demora/i.test(combinedText)) {
      protocols.push({ id: 'hidroxido', label: 'Curativo com Hidróxido de Cálcio', type: 'med' });
    }
    if (/\bmta\b|agregado\s+tri[oó]xido/i.test(combinedText)) {
      protocols.push({ id: 'mta', label: 'MTA Biocompatível', type: 'biomat' });
    }
    if (/biodentine/i.test(combinedText)) {
      protocols.push({ id: 'biodentine', label: 'Biodentine (Silicato Tricálcico)', type: 'biomat' });
    }
    if (/biocer[aâ]mico|bio-c\s+sealer|totalfill/i.test(combinedText)) {
      protocols.push({ id: 'bioceramico', label: 'Cimento Biocerâmico Endodôntico', type: 'biomat' });
    }
    if (/bio-oss|enxerto\s+(?:bovino|particulado|[oó]sseo)|osso\s+liofilizado/i.test(combinedText) || Boolean(ctx.procNeedsGraft)) {
      protocols.push({ id: 'biooss', label: 'Enxerto Ósseo Mineral / Bio-Oss', type: 'biomat' });
    }
    if (/membrana(?:\s+de\s+col[aá]geno)?|bio-gide|barreira\s+reabsorv[ií]vel/i.test(combinedText)) {
      protocols.push({ id: 'membrana', label: 'Membrana de Colágeno Reabsorvível', type: 'biomat' });
    }
    if (/hialuronidase/i.test(combinedText) || Boolean(ctx.procNeedsHofVascular)) {
      protocols.push({ id: 'hialuronidase', label: 'Kit de Emergência Vascular — Hialuronidase', type: 'hof_rescue' });
    }
    if (/coroa|blindagem|onlay|overlay|endocrown|n[uú]cleo/i.test(combinedText) || Boolean(ctx.procNeedsCoroa)) {
      protocols.push({ id: 'coroa_blindagem', label: 'Reabilitação / Blindagem Coronária em 30d', type: 'prosthetic' });
    }
    if (/sinus\s+lift|levantamento\s+de\s+seio|membrana\s+de\s+schneider/i.test(combinedText)) {
      protocols.push({ id: 'sinuslift', label: 'Levantamento de Seio Maxilar (Sinus Lift)', type: 'implant_surg' });
    }
    if (/faceta|lente\s+de\s+contato|desgaste\s+de\s+esmalte|preparo\s+dental|laminado/i.test(combinedText)) {
      protocols.push({ id: 'desgaste_esmalte', label: 'Desgaste Irreversível de Esmalte (Facetas/Lentes)', type: 'esthetic' });
    }
    if (/alinhador|invisalign|aparelho|ortodontia|braquete|conten[çc][ãa]o/i.test(combinedText)) {
      protocols.push({ id: 'contencao_orto', label: 'Contenção Ortodôntica Perene Obrigatória', type: 'ortho' });
    }
    if (/espa[çc]os\s+negros|black\s+spaces|retra[çc][ãa]o\s+gengival|raspagem/i.test(combinedText)) {
      protocols.push({ id: 'blackspaces', label: 'Raspagem Subgengival & Espaços Negros Fisiológicos', type: 'perio' });
    }
    if (/clareamento|branqueamento|per[oó]xido/i.test(combinedText)) {
      protocols.push({ id: 'clareamento_sensib', label: 'Clareamento Dental & Termossensibilidade', type: 'bleach' });
    }
    if (/gengivoplastia|aumento\s+de\s+coroa|espa[çc]o\s+biol[oó]gico|osteotomia\s+est[eé]tica/i.test(combinedText) || ctx.procKey === 'gengivoplastia') {
      protocols.push({ id: 'gengivoplastia_osteo', label: 'Gengivoplastia com Osteotomia & Preservação do Espaço Biológico', type: 'perio_surg' });
    }
    if (/enxerto\s+(?:conjuntivo|livre|epitelial|palatino)|revestimento\s+radicular/i.test(combinedText) || ctx.procKey === 'enxerto_gengival') {
      protocols.push({ id: 'enxerto_palatino', label: 'Enxerto de Tecido Conjuntivo Subepitelial (Área Doadora Palato)', type: 'perio_surg' });
    }
    if (/frenectomia|frenotomia|sec[çc][ãa]o\s+de\s+freio/i.test(combinedText) || ctx.procKey === 'frenectomia') {
      protocols.push({ id: 'frenectomia_tec', label: 'Frenectomia Cirúrgica com Desinserção Fibrosa e Sutura', type: 'cirurgia' });
    }
    if (/apicectomia|retrobtura|cirurgia\s+parendod[oô]ntica/i.test(combinedText) || ctx.procKey === 'apicectomia') {
      protocols.push({ id: 'apicectomia_retro', label: 'Apicectomia (Ressecção 3mm) & Retrobturação Biocerâmica MTA', type: 'endo_surg' });
    }
    if (DentalSafeClinicalAI.mentionsImplantProtocol(combinedText) || ctx.procKey === 'protocolo_implante') {
      protocols.push({ id: 'protocolo_allon4', label: 'Prótese Protocolo Fixo Branemark / All-on-4 Carga Imediata', type: 'implant_prosthetic' });
    }
    if (/dam\b|dispositivo\s+de\s+avan[çc]o|aparelho\s+(?:anti-ronco|do\s+sono)|titula[çc][ãa]o/i.test(combinedText) || ctx.procKey === 'ronco_apneia') {
      protocols.push({ id: 'dam_sono', label: 'Dispositivo de Avanço Mandibular (DAM) Titrável & Guia Matinal', type: 'sono' });
    }
    if (/[oó]xido\s+nitroso|n2o|oxig[eê]nio\s+a\s+100%|ansiolise\s+inalat[oó]ria/i.test(combinedText) || ctx.procKey === 'sedacao_oxido' || ctx.procAnesthesia === 'sedacao-oxido') {
      protocols.push({ id: 'sedacao_inalatoria', label: 'Sedação Consciente Inalatória com N2O/O2 Titulada', type: 'sedation' });
    }

    // 4. Fatores Farmacológicos, Alergias e Condições Sistêmicas
    const systemic = [];
    
    // Alergias específicas
    let specificAllergens = [];
    const allergyText=combinedText.split(/[.;\n]/).filter(part=>/alerg|hipersensib/i.test(part)).join(' ');
    if (/penicilina|amoxicilina|clavulin|augmentin|ampicilina/i.test(allergyText)) {
      specificAllergens.push('Penicilina e Beta-lactâmicos');
    }
    if (/dipirona|metamizol|novalgina/i.test(allergyText)) {
      specificAllergens.push('Dipirona / Pirazolonas');
    }
    if (/aine|anti-inflamat[oó]rio|ibuprofeno|cetoprofeno|aspirina/i.test(allergyText)) {
      specificAllergens.push('AINEs (Anti-inflamatórios não-esteroidais)');
    }
    if (/l[aá]tex|borracha/i.test(allergyText)) {
      specificAllergens.push('Látex Natural');
    }
    if (ctx.cAllergy || specificAllergens.length > 0) {
      systemic.push({
        id: 'allergy',
        label: specificAllergens.length > 0 ? `Alergia a: ${specificAllergens.join(', ')}` : 'Alergias Medicamentosas / Materiais',
        allergens: specificAllergens
      });
    }

    // Bisfosfonatos e MRONJ
    if (ctx.mBisph || /bisfosfonato|alendronato|fosamax|zoledronato|zometa|denosumabe|prolia/i.test(combinedText)) {
      systemic.push({ id: 'bisphosphonate', label: 'Bisfosfonatos / Risco Alto de MRONJ', critical: true });
    }

    // Anticoagulantes
    if (ctx.mAnti || /anticoagul|varfarina|marevan|xarelto|rivaroxaban|apixaban|aas\b|aspirina\s+prevent|clopidogrel|plavix/i.test(combinedText)) {
      systemic.push({ id: 'anticoagulant', label: 'Anticoagulante / Risco Hemorrágico', critical: true });
    }

    // Tabagismo com extração da carga tabágica
    const smokeMatch = combinedText.match(/(\d{1,3})\s*(?:cigarros?|cig|ma[çc]os?)\s*(?:\/|por|\s+ao\s+)?\s*dia/i);
    let smokeCigCount = smokeMatch ? smokeMatch[1] : null;
    let smokePack = combinedText.includes('maço') ? true : false;
    if (ctx.cSmoke || smokeCigCount || /fuma|fumante|tabagista|tabagismo/i.test(combinedText)) {
      let cigDesc = smokeCigCount ? `${smokeCigCount} ${smokePack ? 'maço(s)' : 'cigarros'}/dia` : 'Tabagismo Ativo Declarado';
      systemic.push({ id: 'smoking', label: cigDesc, count: smokeCigCount, isPack: smokePack });
    }

    // Bruxismo
    if (ctx.cBruxism || /bruxismo|apertamento|ranger\s+dentes|placa\s+miorrelaxante/i.test(combinedText)) {
      systemic.push({ id: 'bruxism', label: 'Bruxismo / Sobrecarga Biomecânica' });
    }

    // Diabetes
    if (ctx.cDiabetes || /diabetes|glicemia|hba1c|insulina/i.test(combinedText)) {
      systemic.push({ id: 'diabetes', label: 'Diabetes Mellitus' });
    }

    // Cardiopatia / Hipertensão
    if (ctx.cHyper || /hipertens[ãa]o|press[ãa]o\s+alta|has\b/i.test(combinedText)) {
      systemic.push({ id: 'hypertension', label: 'Hipertensão Arterial Sistêmica' });
    }
    if (ctx.cCardio || /cardiopat|sopro|v[aá]lvula|endocardite|stent|arritmia/i.test(combinedText)) {
      systemic.push({ id: 'cardiopathy', label: 'Cardiopatia / Profilaxia AHA' });
    }

    return {
      rawText: combinedText,
      teeth: selectedTeeth,
      anatomy,
      pathologies,
      protocols,
      systemic,
      counts: {
        teeth: selectedTeeth.length,
        pathologies: pathologies.length,
        protocols: protocols.length,
        systemic: systemic.length,
        totalEntities: selectedTeeth.length + pathologies.length + protocols.length + systemic.length
      }
    };
  };

  /**
   * Síntese Integrada Dinâmica de Cláusulas para Injeção nas 22 Seções Canônicas do TCLE
   */
  DentalSafeClinicalAI.synthesize = function (parsed, context) {
    const teethStr = parsed.teeth.length > 0 ? `no(s) elemento(s) dental(is) <strong>${parsed.teeth.join(', ')}</strong>` : (context.procRegion ? `na região de <strong>${String(context.procRegion).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</strong>` : 'na região indicada');
    
    // -------------------------------------------------------------
    // 1. SÍNTESE PATOLÓGICA PERSONALIZADA (Para SEÇÃO 3)
    // -------------------------------------------------------------
    let customPathologySynthesis = '';
    const pathologyPoints = [];

    if (parsed.pathologies.some(p => p.id === 'fistula')) {
      pathologyPoints.push(`constatou-se a presença de <strong>fístula ativa com drenagem periapical crônica</strong> na mucosa contígua a ${teethStr}, indicando a existência de trajeto ósseo fistulizado perfurado pela supuração bacteriana anaeróbia decorrente do foco infeccioso radicular`);
    }
    if (parsed.pathologies.some(p => p.id === 'necrose')) {
      pathologyPoints.push(`quadro biológico inequívoco de <strong>necrose pulpar total</strong> (perda definitiva da vitalidade vasculonervosa), convertendo os canais radiculares em nichos biológicos de proliferação bacteriana e toxinas microbianas que ameaçam as estruturas ósseas periapicais de sustentação`);
    }
    if (parsed.pathologies.some(p => p.id === 'pulpite_irrev')) {
      pathologyPoints.push(`quadro de <strong>pulpite irreversível sintomática</strong>, com colapso microvascular pulpar, hiperemia dolorosa refratária e inflamação celular terminal que impede a preservação biológica da polpa coronorradicular`);
    }
    if (parsed.pathologies.some(p => p.id === 'lesao_periapical')) {
      pathologyPoints.push(`evidência radiográfica/tomográfica de <strong>área osteolítica periapical (reabsorção óssea perirradicular)</strong> mediada pela resposta inflamatória imunológica contra os antígenos bacterianos intracanais`);
    }
    if (parsed.pathologies.some(p => p.id === 'curvatura_severa')) {
      pathologyPoints.push(`presença de <strong>curvatura radicular anatômica acentuada / dilaceração apical</strong> ${parsed.anatomy.roots.mesial ? '(especificamente na raiz mésio-vestibular)' : ''}, configurando desafio biomecânico de alta complexidade para a desinfecção e modelagem tridimensional`);
    }
    if (parsed.pathologies.some(p => p.id === 'calcificacao')) {
      pathologyPoints.push(`obliteração e <strong>calcificação atrésica dos condutos radiculares</strong> decorrente de aposição contínua de dentina reacional, exigindo desgaste micrométrico guiado sob microscopia para localização do trajeto original`);
    }
    if (parsed.pathologies.some(p => p.id === 'trinca')) {
      pathologyPoints.push(`presença de <strong>trinca ou fragilidade coronorradicular preexistente</strong> provocada por fadiga mastigatória ou trauma oclusal, o que reduz substancialmente o limiar de resistência biomecânica da estrutura dental remanescente`);
    }
    if (parsed.pathologies.some(p => p.id === 'pericoronite')) {
      pathologyPoints.push(`surto infeccioso agudo de <strong>pericoronite</strong> com contaminação sob o opérculo gengival retido, trismo e dor irradiada, justificando a intervenção operatória indicada`);
    }
    if (parsed.pathologies.some(p => p.id === 'sorriso_gengival')) {
      pathologyPoints.push(`diagnóstico de <strong>erupção passiva alterada / sorriso gengival</strong> com desproporção estética coroa-gengiva, em que a margem gengival recobre excessivamente o esmalte anatômico e oculta a altura clínica dental`);
    }
    if (parsed.pathologies.some(p => p.id === 'recessao_gengival')) {
      pathologyPoints.push(`presença de <strong>recessão tecidual marginal com exposição de raiz anatômica</strong> e hipersensibilidade dentinária, acarretando perda localizada de inserção periodontal e fragilidade mecânica na junção cemento-esmalte`);
    }
    if (parsed.pathologies.some(p => p.id === 'anquiloglossia')) {
      pathologyPoints.push(`constatação de <strong>inserção patológica de freio lingual/labial com restrição de mobilidade</strong> (anquiloglossia / freio teto-labial com diastema interincisivo), provocando prejuízos funcionais mastigatórios, fonoaudiológicos e oclusais`);
    }
    if (parsed.pathologies.some(p => p.id === 'refratario_endo')) {
      pathologyPoints.push(`quadro de <strong>lesão periapical refratária persistente</strong> em elemento previamente tratado, com biofilme microbiano extrarradicular inacessível via canal convencional, indicando intervenção cirúrgica direta na raiz`);
    }
    if (parsed.pathologies.some(p => p.id === 'edentalismo_total')) {
      pathologyPoints.push(`situação de <strong>edentulismo com severa atrofia e reabsorção das cristas alveolares</strong>, resultando em perda de suporte labial e instabilidade biomecânica de próteses convencionais`);
    }
    if (parsed.pathologies.some(p => p.id === 'saos')) {
      pathologyPoints.push(`diagnóstico clínico de <strong>roncopatia crônica e Apneia Obstrutiva do Sono (SAOS)</strong> associada a episódios recorrentes de colapso de vias aéreas superiores, hipoxemia noturna e sonolência diurna`);
    }

    if (pathologyPoints.length > 0) {
      customPathologySynthesis = `
        <div class="ai-clinical-synthesis-box" style="margin-top:12px;padding:12px 14px;background:rgba(14,165,233,0.07);border-left:4px solid var(--cyan);border-radius:6px;">
          <strong style="color:var(--cyan);font-size:12px;display:flex;align-items:center;gap:6px;text-transform:uppercase;margin-bottom:6px;">
            <i class="ri-brain-line"></i> Contextualização Fisiopatológica Individualizada por IA:
          </strong>
          <p style="font-size:12.5px;line-height:1.6;margin:0;color:var(--text-main);">
            No caso concreto do(a) paciente, o exame clínico minucioso e a propedêutica de imagem confirmam que ${pathologyPoints.join('; além disso, ')}. Essa conjuntura biológica fundamenta imperativamente a intervenção terapêutica proposta para deter o avanço destrutivo e restabelecer a homeostase tecidual.
          </p>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // 2. NUANCES TÉCNICAS E WORKFLOW INSTRUMENTAL (Para SEÇÃO 5)
    // -------------------------------------------------------------
    let customWorkflowNuances = '';
    const technicalAdditions = [];

    const hasWaveOne = parsed.protocols.some(p => p.id === 'waveone');
    const hasReciproc = parsed.protocols.some(p => p.id === 'reciproc');
    const hasPui = parsed.protocols.some(p => p.id === 'pui');
    const hasBioceramico = parsed.protocols.some(p => p.id === 'bioceramico');
    const hasHidroxido = parsed.protocols.some(p => p.id === 'hidroxido');
    const hasBioOss = parsed.protocols.some(p => p.id === 'biooss');
    const hasMembrana = parsed.protocols.some(p => p.id === 'membrana');

    if (hasWaveOne || hasReciproc) {
      const sysName = hasWaveOne ? 'WaveOne Gold (Dentsply Sirona)' : 'Reciproc Blue (VDW)';
      technicalAdditions.push(`Modelagem mecanizada tridimensional executada sob cinemática reciprocante com instrumentos de Níquel-Titânio com tratamento térmico avançado (<em>${sysName}</em>), respeitando a curvatura radicular e o diâmetro anatômico original`);
    }
    if (hasPui) {
      technicalAdditions.push(`Protocolo intensivo de Irrigação Ultrassônica Passiva (PUI) para ativação acústica do Hipoclorito de Sódio e EDTA a 17%, desagregando biofilmes bacterianos presentes em áreas de istmos, deltas apicais e ramificações laterais`);
    }
    if (hasHidroxido) {
      technicalAdditions.push(`Aplicação de medicação intracanal à base de pasta de Hidróxido de Cálcio por período programado de 15 a 30 dias para controle químico da infecção profunda e estimulação do reparo ósseo antes da obturação definitiva`);
    }
    if (hasBioceramico) {
      technicalAdditions.push(`Obturação hermética tridimensional com cimento biocerâmico reparador de silicato de cálcio, garantindo hidroxiapatita interfacial, vedação bacteriana intransponível e ausência de contração volumétrica`);
    }
    if (hasBioOss || hasMembrana) {
      technicalAdditions.push(`Reconstrução do leito com enxerto mineral inorgânico (Bio-Oss) e instalação de barreira biológica com membrana de colágeno puro reabsorvível (Bio-Gide) para regeneração óssea guiada (ROG)`);
    }
    if (parsed.protocols.some(p => p.id === 'gengivoplastia_osteo')) {
      technicalAdditions.push(`Gengivoplastia associada à osteotomia e osteoplastia de contorno com microcinzéis e pontas ultrassônicas, restabelecendo a distância inviolável de 3 mm do espaço biológico periodontal para impedir recidiva tecidual`);
    }
    if (parsed.protocols.some(p => p.id === 'enxerto_palatino')) {
      technicalAdditions.push(`Colheita de enxerto de tecido conjuntivo subepitelial do palato duro com técnica de incisão única/alçapão e sutura compressiva imediata da área doadora, seguido de tunelização/retalho reposicionado coronariamente na área receptora`);
    }
    if (parsed.protocols.some(p => p.id === 'frenectomia_tec')) {
      technicalAdditions.push(`Frenectomia com incisão em cunha, desinserção das fibras musculares profundas do periósteo e sutura com fio atraumático, preservando as carúnculas sublinguais e a emergência do ducto de Wharton`);
    }
    if (parsed.protocols.some(p => p.id === 'apicectomia_retro')) {
      technicalAdditions.push(`Apicectomia com osteotomia apical de 3 mm em ângulo reto (90º), retro-preparo ultrassônico sem bisel de 3 mm de profundidade e retrobturação hermética com cimento bioativo reparador (MTA / Biodentine)`);
    }
    if (parsed.protocols.some(p => p.id === 'protocolo_allon4')) {
      technicalAdditions.push(`Instalação de implantes osseointegrados com ancoragem bicortical e angulação distal calculada (técnica All-on-4 / Branemark), aferição estrita de torque de inserção (mínimo 35 N.cm) e moldagem para prótese fixa imediata`);
    }
    if (parsed.protocols.some(p => p.id === 'dam_sono')) {
      technicalAdditions.push(`Moldagem de precisão ou escaneamento digital das arcadas para confecção de Dispositivo de Avanço Mandibular (DAM) titrável em acrílico termo-polimerizado com ancoragem oclusal total e guia matinal de desprogramação`);
    }
    if (parsed.protocols.some(p => p.id === 'sedacao_inalatoria')) {
      technicalAdditions.push(`Titulação gradual de Óxido Nitroso e Oxigênio (N2O/O2) por máscara nasal com fluxo calibrado e barreira antipoluição, mantendo fração inspirada de O2 sempre superior a 30%, seguido de lavagem pulmonar com 100% de O2 por 5 minutos`);
    }

    if (technicalAdditions.length > 0) {
      customWorkflowNuances = `
        <div style="margin-top:14px;padding:12px;background:rgba(99,102,241,0.06);border-radius:6px;border:1px solid rgba(99,102,241,0.2);">
          <strong style="color:var(--primary);font-size:11.5px;text-transform:uppercase;display:block;margin-bottom:6px;">
            <i class="ri-tools-line"></i> Protocolos Técnicos e Instrumentais Específicos Empregados no Caso:
          </strong>
          <ul style="margin:0;padding-left:20px;font-size:12px;line-height:1.6;color:var(--text-main);">
            ${technicalAdditions.map(item => `<li>${item}.</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // 3. CLÁUSULAS DE RISCO FORENSE DINÂMICAS (Para SEÇÃO 11)
    // -------------------------------------------------------------
    let dynamicForensicRisksHTML = '';
    const riskClauses = [];

    // Risco de Curvatura / Fratura de Instrumento
    if (parsed.pathologies.some(p => p.id === 'curvatura_severa') || hasWaveOne || hasReciproc) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-alert-line"></i> RISCO ESPECÍFICO — CURVATURA RADICULAR ACENTUADA E ESTRESSE DE FADIGA CÍCLICA</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Diante da anatomia curvada ou dilacerada detectada no elemento dental, fica o(a) paciente formalmente esclarecido(a) de que os instrumentos de NiTi, mesmo novos e submetidos a controle rigoroso de fadiga, sofrem severas tensões mecânicas alternadas de tração e compressão no ápice. Persiste o risco documentado de <strong>fratura de instrumento intracanal</strong> ou formação de degrau anatômico. Caso tal intercorrência ocorra, a literatura pericial e o STJ respaldam a manutenção/sepultamento do fragmento estéril com selamento biológico e acompanhamento radiográfico, procedendo-se a complementação cirúrgica paraendodôntica apenas se houver lesão periapical refratária sintomática.
          </p>
        </div>
      `);
    }

    // Risco de Fístula Refratária / Extravasamento
    if (parsed.pathologies.some(p => p.id === 'fistula') || parsed.pathologies.some(p => p.id === 'lesao_periapical')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-alert-line"></i> RISCO ESPECÍFICO — FÍSTULA CRÔNICA, REABRIÇÃO DE TRAJETO E CICATRIZAÇÃO ÓSSEA TARDIA</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Em dentes portadores de fístula ou osteólise periapical prévia, o fechamento do trajeto fistuloso e a neoformação óssea dependem exclusivamente da resposta imunocelular do paciente após a descontaminação. Fica registrado o risco de <strong>reagudização infecciosa temporária pós-operatória</strong> (dor ou edema reflexo pela alteração de flora bacteriana anaeróbia), bem como a possibilidade de necessidade de sessões adicionais de troca medicamentosa de hidróxido de cálcio caso a supuração não cesse de imediato.
          </p>
        </div>
      `);
    }

    // Risco de Parestesia por Proximidade Nervosa
    if (parsed.anatomy.hasMandibularCanalProximity) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-error-warning-line"></i> RISCO FORENSE CRÍTICO — PROXIMIDADE COM O CANAL MANDIBULAR / NERVO ALVEOLAR INFERIOR</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Os exames indicam estreita relação de proximidade anatômica ou contato das raízes/osteotomia com o <strong>Nervo Alveolar Inferior e Nervo Lingual</strong>. Fica o(a) paciente expressamente cientificado(a) sobre o risco de <strong>parestesia</strong> (diminuição ou perda da sensibilidade, formigamento ou dormência no lábio inferior, queixo e metade da língua). Na vasta maioria dos casos (estatística pericial), a parestesia é decorrente de compressão ou estiramento mecânico inflamatório temporário, regredindo progressivamente de semanas a meses com suporte de laserterapia e neuroprotetores; existe, todavia, risco residual e raro de alteração sensorial permanente por lesão anatômica irreversível.
          </p>
        </div>
      `);
    }

    // Risco de Enxerto com Biomaterial
    if (hasBioOss || parsed.protocols.some(p => p.id === 'biooss')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-flask-line"></i> RISCO ESPECÍFICO — ENXERTO COM BIOMATERIAL (BIO-OSS / MEMBRANA)</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            O procedimento prevê aposição de enxerto ósseo mineral liofilizado e membrana de colágeno. Registram-se as limitações biológicas intrínsecas: <strong>(a)</strong> Reabsorção fisiológica parcial de 15% a 30% do volume original durante a fase de vascularização; <strong>(b)</strong> Risco de soltura ou deiscência de sutura com exteriorização de microgrânulos nos primeiros dias; <strong>(c)</strong> Risco de contaminação e perda do enxerto em caso de traumatismo mecânico ou tabagismo precoce pelo paciente.
          </p>
        </div>
      `);
    }

    // Risco HOF / Vascular
    if (parsed.protocols.some(p => p.id === 'hialuronidase')) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-first-aid-kit-line"></i> HARMONIZAÇÃO OROFACIAL — PROTOCOLO EMERGENCIAL DE OCLUSÃO VASCULAR E HIALURONIDASE</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Em procedimentos de preenchimento facial com ácido hialurônico, existe risco raro e grave de compressão ou embolização vascular acidental (interrupção do fluxo sanguíneo em ramos arteriais). O(A) paciente <strong>AUTORIZA EXPRESSA E PREVIAMENTE</strong> a intervenção médica imediata do profissional para aplicação de altas doses de <strong>Hialuronidase de Resgate</strong>, calor local, massagem vigorosa e vasodilatadores caso surjam sinais de palidez cutânea, dor desproporcional ou reticulado cianótico.
          </p>
        </div>
      `);
    }

    // Risco de Levantamento de Seio Maxilar (Sinus Lift)
    if (parsed.protocols.some(p => p.id === 'sinuslift')) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-hammer-line"></i> RISCO ESPECÍFICO — LEVANTAMENTO DE SEIO MAXILAR (SINUS LIFT) E MEMBRANA DE SCHNEIDER</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Durante a cirurgia de elevação sinusal, existe o risco inerente e documentado de <strong>perfuração transoperatória da MEMBRANA DE SCHNEIDER</strong> (fina membrana mucosa que recobre a cavidade do seio maxilar). Em caso de microperfuração, o cirurgião procederá à reparação imediata com membrana reabsorvível de colágeno ou suspenderá temporariamente o enxerto para cicatrização espontânea em 60 a 90 dias. Fica ainda cientificado(a) dos riscos de <strong>sinusite maxilar secundária</strong>, infecção de enxerto, sensação de pressão periorbital e epistaxe transitória, sendo terminantemente proibido assoar o nariz ou espirrar de boca fechada nos primeiros 15 dias.
          </p>
        </div>
      `);
    }

    // Risco de Espaços Negros e Retração em Periodontia
    if (parsed.protocols.some(p => p.id === 'blackspaces')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-microscope-line"></i> RISCO ESPECÍFICO — RETRAÇÃO GENGIVAL FISIOLÓGICA E ESPAÇOS NEGROS INTERDENTAIS (BLACK SPACES)</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            A descontaminação radicular profunda e a remoção de cálculo subgengival resultam na desinflamação natural dos tecidos periodontais. Durante a recuperação pode haver desinchaço gengival e exposição radicular, o que ocasionará o surgimento de <strong>espaços negros interdentais ("black spaces")</strong> e <strong>termossensibilidade radicular transitória</strong>, devendo o profissional avaliar a evolução e esclarecer as opções de cuidado.
          </p>
        </div>
      `);
    }

    // Risco de Clareamento Dental
    if (parsed.protocols.some(p => p.id === 'clareamento_sensib')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-sun-fill"></i> RISCO ESPECÍFICO — HIPERSENSIBILIDADE DENTINÁRIA POR PERÓXIDOS</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Os agentes clareadores (peróxido de hidrogênio e carbamida) atuam por difusão oxidativa através dos túbulos dentinários. É esperado e frequente o surgimento de <strong>sensibilidade transitória a variações térmicas (frio e calor)</strong> ou "pontadas" espontâneas durante o protocolo. O clareamento <strong>NÃO altera a coloração de restaurações resinosas pré-existentes, coroas ou facetas de porcelana</strong>, as quais necessitarão de troca e custos adicionais após a estabilização da cor dental final.
          </p>
        </div>
      `);
    }

    // Risco de Hemorragia Palatina e Artéria Palatina Maior
    if (parsed.anatomy.hasPalatalGraftRisk || parsed.protocols.some(p => p.id === 'enxerto_palatino')) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-drop-line"></i> RISCO CIRÚRGICO CRÍTICO — ÁREA DOADORA PALATINA E ARTÉRIA PALATINA MAIOR</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Na coleta do enxerto de tecido conjuntivo no palato duro (céu da boca), existe o risco anatômico documentado de <strong>hemorragia transoperatória e pós-operatória pela proximidade do feixe da Artéria Palatina Maior</strong>. O cirurgião aplicará medidas hemostáticas imediatas (tamponamento, sutura compressiva, hemostáticos de colágeno e placa de mordida palatina acrílica). O paciente fica advertido de que a área doadora apresentará desconforto doloroso e sensação de queimadura nos primeiros 7 a 14 dias, sendo terminantemente proibido consumir alimentos duros, crocantes ou quentes que possam lesar o coágulo palatino.
          </p>
        </div>
      `);
    }

    // Risco de Violação de Espaço Biológico e Recidiva em Gengivoplastia
    if (parsed.anatomy.isGengivoplasty || parsed.protocols.some(p => p.id === 'gengivoplastia_osteo')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-scissors-cut-line"></i> RISCO ESPECÍFICO — RECOLONIZAÇÃO GENGIVAL E NECESSIDADE DE OSTEOTOMIA DE RESGUARDO</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Na correção do sorriso gengival, o contorno ósseo deve respeitar a distância mínima biológica de 3 mm entre a crista óssea e a margem gengival. Fica o(a) paciente cientificado(a) de que, se realizada apenas a remoção gengival sem a osteotomia de recontorno ósseo alveolar indispensável, o organismo promoverá a <strong>recidiva biológica (crescimento da gengiva de volta)</strong> em 60 a 180 dias. Registra-se ainda a possibilidade de termossensibilidade temporária no colo dos dentes e pequenas assimetrias de cicatrização inerentes à espessura tecidual individual.
          </p>
        </div>
      `);
    }

    // Risco de Lesão do Ducto de Wharton e Rânula em Frenectomia Lingual
    if (parsed.anatomy.hasSublingualRisk || parsed.protocols.some(p => p.id === 'frenectomia_tec')) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-alert-line"></i> RISCO CIRÚRGICO — DUCTO DE WHARTON E ASSOALHO BUCAL SUBLINGUAL</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Na frenectomia lingual para tratamento de anquiloglossia (língua presa), a secção das fibras ocorre em contiguidade direta com as carúnculas sublinguais e os orifícios dos <strong>Ductos de Wharton</strong> (escoamento da saliva das glândulas submandibulares). Persiste risco cirúrgico de laceração acidental, obstrução salivar cicatricial, formação de rânula traumática ou parestesia transitória do nervo lingual. É mandatório o acompanhamento com fonoaudiologia pós-operatória para reeducação motora e prevenção de fibrose cicatricial restritiva.
          </p>
        </div>
      `);
    }

    // Risco de Apicectomia: Parestesia e Fratura Radicular Residual
    if (parsed.protocols.some(p => p.id === 'apicectomia_retro')) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-microscope-line"></i> RISCO FORENSE — CIRURGIA PARENDODÔNTICA (APICECTOMIA / RETROBTURAÇÃO)</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            A apicectomia é uma intervenção cirúrgica conservadora de última instância para salvar dentes com insucesso endodôntico convencional. Fica registrado o risco de: <strong>(1)</strong> Constatação transoperatória de trinca radicular longitudinal microscópica invisível na tomografia, o que inviabiliza a preservação do elemento e impõe sua exodontia imediata; <strong>(2)</strong> Parestesia sensorial por proximidade com o forame mentual ou canal mandibular; <strong>(3)</strong> Refratariedade da lesão por contaminação bacteriana extrarradicular não responsiva, com taxa de sucesso pericial na faixa de 80% a 90%.
          </p>
        </div>
      `);
    }

    // Risco de Falha de Torque Primário (<35 N.cm) e Conversão de Carga Imediata em Tardia (Protocolo All-on-4)
    if (parsed.protocols.some(p => p.id === 'protocolo_allon4')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-scales-3-line"></i> PROTOCOLO ALL-ON-4 — CRITÉRIO MANDATÓRIO DE TORQUE PRIMÁRIO E CONVERSÃO EM CARGA TARDIA</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            A instalação da prótese fixa provisória nas primeiras 72 horas (Carga Imediata) depende <strong>EXCLUSIVAMENTE</strong> de estabilidade mecânica inicial comprovada com <strong>torque cirúrgico mínimo de 35 a 45 N.cm</strong> em todos os implantes. Caso o osso do paciente apresente baixa densidade (osso medular tipo IV) e não atinja essa rigidez primária indispensável, o cirurgião-dentista, no estrito cumprimento da boa prática pericial, <strong>CONVERTERÁ O PLANO EM CARGA TARDIA (espera biológica de 4 a 6 meses sob prótese removível provisória)</strong> para não provocar micromovimentação e fibrointegração (perda total dos implantes). Esta conduta protetiva é previamente autorizada pelo paciente e não gera indenização.
          </p>
        </div>
      `);
    }

    // Risco de Deslocamento Oclusal e Dor em ATM pelo DAM (Odontologia do Sono)
    if (parsed.protocols.some(p => p.id === 'dam_sono')) {
      riskClauses.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-moon-line"></i> ODONTOLOGIA DO SONO — EFEITOS COLATERAIS OCLUSAIS E ARTICULARES DO DAM</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            O avanço milimétrico mecânico noturno da mandíbula para desobstrução aérea respiratória acarreta sobrecarga biomecânica nos músculos mastigatórios e nas Articulações Temporomandibulares (ATM). É esperada sensação de desconforto muscular matinal temporário, sialorreia (aumento de saliva) e sensação transitória de desencaixe dos dentes ao acordar. Fica o paciente cientificado de que o uso contínuo pode causar <strong>mordida aberta posterior ou inclinação vestibular dos incisivos inferiores</strong>, exigindo o uso religioso diário do Guia Oclusal Matinal de Desprogramação por 15 minutos e retornos periódicos de monitoramento.
          </p>
        </div>
      `);
    }

    // Risco de Êmese, Broncoaspiração e Suspensão da Sedação Consciente Inalatória (N2O/O2)
    if (parsed.protocols.some(p => p.id === 'sedacao_inalatoria')) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-lungs-line"></i> SEDAÇÃO CONSCIENTE INALATÓRIA (N2O/O2) — RISCO DE ÊMESE E EXIGÊNCIA DE JEJUM</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            A administração de Óxido Nitroso e Oxigênio produz relaxamento do sistema nervoso central e alterações sensoriais (formigamento periférico prazeroso, sensação de calor e flutuação). Em indivíduos suscetíveis ou que tenham violado as instruções de jejum prévio, existe o risco de náuseas e <strong>êmese (vômito ativo) com perigo crítico de broncoaspiração de conteúdo alimentar gástrico para as vias aéreas</strong>. O paciente atesta formalmente o cumprimento estrito do jejum prescrito e autoriza a suspensão imediata da sedação e administração de oxigênio a 100% caso apresente vertigem severa, ansiedade paradoxal ou refluxo gástrico.
          </p>
        </div>
      `);
    }

    // Risco de Comunicação Bucosinusal em Cirurgia Posterior Superior
    if (parsed.anatomy.hasMaxillarySinusProximity && (parsed.pathologies.some(p => p.id === 'inclusao') || parsed.protocols.some(p => p.id === 'sinuslift') || parsed.anatomy.teeth.some(t => ['14','15','16','17','18','24','25','26','27','28'].includes(t)))) {
      riskClauses.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-wind-line"></i> RISCO ESPECÍFICO — COMUNICAÇÃO BUCOSINUSAL E CONDUTA IMEDIATA</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Em razão da extrema proximidade ou pneumatização do Seio Maxilar sobre os ápices dos dentes superiores manipulados, existe o risco acidental inerente de <strong>Comunicação Bucosinusal (abertura entre a boca e a cavidade nasal/sinusal)</strong>. Havendo comunicação no ato operatório (confirmada pela Manobra de Valsalva), o cirurgião executará manobras hemostáticas e fechamento primário imediato por avanço de retalho mucoperiosteal vestibular ou bola de Bichat. O paciente compromete-se a cumprir a proibição absoluta de assoar o nariz por 15 dias, espirrar apenas de boca aberta e usar descongestionantes prescritos para evitar fístula bucosinusal crônica.
          </p>
        </div>
      `);
    }

    if (riskClauses.length > 0) {
      dynamicForensicRisksHTML = `
        <div style="margin-top:14px;">
          <strong style="font-size:12px;color:var(--text-main);display:flex;align-items:center;gap:6px;text-transform:uppercase;margin-bottom:8px;">
            <i class="ri-shield-check-line" style="color:var(--cyan);"></i> Cláusulas Específicas de Risco Geradas por IA a partir dos Achados Clínicos:
          </strong>
          ${riskClauses.join('')}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // 4. BLOCO FARMACOLÓGICO E COMORBIDADES SISTÊMICAS (Para SEÇÃO 13)
    // -------------------------------------------------------------
    let systemicPharmacologyBlock = '';
    const systemicNotes = [];

    // Alergia a Penicilina
    const hasPenicillinAllergy = parsed.systemic.some(s => s.allergens && s.allergens.some(a => a.toLowerCase().includes('penicilina')));
    if (hasPenicillinAllergy) {
      systemicNotes.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-forbid-line"></i> ALERGIA DECLARADA A PENICILINA — REVISAR PRESCRIÇÃO</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            O(A) paciente relata alergia a penicilina/amoxicilina. Antes de prescrever, confirmar o tipo e a gravidade da reação. A indicação de antibiótico, escolha, dose e duração dependem de avaliação individual; profilaxia para endocardite e tratamento de infecção são situações distintas. A AHA não recomenda clindamicina para profilaxia de endocardite. Cefalosporinas não devem ser usadas para essa profilaxia em pacientes com antecedente de anafilaxia, angioedema ou urticária por penicilina/ampicilina.
          </p>
        </div>
      `);
    }

    // Carga Tabágica Quantificada
    const smokingEntity = parsed.systemic.find(s => s.id === 'smoking');
    if (smokingEntity) {
      systemicNotes.push(`
        <div class="legal-clause-block warning-clause" style="margin-bottom:10px;">
          <h5 style="color:#b45309;"><i class="ri-no-smoking-line"></i> IMPACTO DA CARGA TABÁGICA DECLARADA (${smokingEntity.label.toUpperCase()})</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            O(A) paciente consignou o consumo ativo de tabaco <strong>(${smokingEntity.label})</strong>. A inalação de monóxido de carbono e nicotina provoca hipóxia tecidual celular e vasoconstrição periférica severa. A literatura científica (Strietzel et al., 2007) comprova redução drástica da angiogênese e aumento de 3 a 5 vezes na taxa de necrose tecidual, perda precoce de enxertos ósseos e falha cirúrgica. O tabagismo é um fator de risco a ser discutido e acompanhado, sem exclusão automática da responsabilidade profissional.
          </p>
        </div>
      `);
    }

    // Anticoagulante e Hemostasia
    if (parsed.systemic.some(s => s.id === 'anticoagulant')) {
      systemicNotes.push(`
        <div class="legal-clause-block danger-clause" style="margin-bottom:10px;">
          <h5 style="color:#b91c1c;"><i class="ri-drop-line"></i> MANEJO HEMOSTÁTICO INDIVIDUALIZADO — PACIENTE EM USO DE ANTICOAGULANTES / ANTIAGREGANTES</h5>
          <p style="font-size:12.5px;line-height:1.55;">
            Em razão do uso regular de medicação antitrombótica/anticoagulante, o paciente fica cientificado de que a suspensão inadvertida do remédio é expressamente contraindicada sem anuência cardiológica pelo risco fatal de trombose/embolia. O cirurgião-dentista executará protocolo hemostático local minucioso (anestesia infiltrativa com vasoconstritor conforme segurança cardíaca, emprego de esponja hemostática reabsorvível de fibrina/gelatina, sutura compresiva cuidadosa e aplicação de gaze embebida em ácido tranexâmico). O paciente deve abster-se de cuspir, bochechar ou ingerir substâncias quentes que dissolvam o coágulo.
          </p>
        </div>
      `);
    }

    if (systemicNotes.length > 0) {
      systemicPharmacologyBlock = `
        <div style="margin-top:14px;">
          ${systemicNotes.join('')}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // 5. CUIDADOS PÓS-OPERATÓRIOS INDIVIDUALIZADOS (Para SEÇÃO 14)
    // -------------------------------------------------------------
    let individualizedPostOpAdapters = '';
    const postOpItems = [];

    if (parsed.pathologies.some(p => p.id === 'fistula') || parsed.protocols.some(p => p.id === 'coroa_blindagem')) {
      postOpItems.push(`<strong>Cuidado Mastigatório no Dente em Tratamento:</strong> Proibição absoluta de mastigar alimentos duros ou consistentes sobre o elemento dental envolvido (${teethStr}) até a finalização do selamento coronário e restauração definitiva, evitando risco catastrófico de fratura vertical da raiz remanescente.`);
    }
    if (smokingEntity) {
      postOpItems.push(`<strong>Cessação Tabágica Estrita nas Primeiras 72 Horas:</strong> Não fumar de modo algum no período crítico inicial para preservar a microcirculação e impedir a formação de vácuo intrabucal (pressão negativa da tragada que desloca o coágulo sanguíneo protetor).`);
    }
    if (parsed.anatomy.hasMaxillarySinusProximity) {
      postOpItems.push(`<strong>Manobra Antissinusal Rigorosa:</strong> Não assoar o nariz vigorosamente, não segurar espirros (espirrar sempre de boca aberta) e evitar mergulhos ou viagens de avião nos primeiros 7 dias pela contiguidade com o Seio Maxilar.`);
    }
    if (parsed.protocols.some(p => p.id === 'enxerto_palatino')) {
      postOpItems.push(`<strong>Proteção da Área Doadora Palatina:</strong> Uso contínuo da placa acrílica palatina protetora nas primeiras 48 horas, consumindo exclusivamente dieta líquida/pastosa fria ou gelada, sem tocar no céu da boca com a língua ou canudos.`);
    }
    if (parsed.protocols.some(p => p.id === 'frenectomia_tec')) {
      postOpItems.push(`<strong>Repouso Miofuncional Inicial:</strong> Evitar falar excessivamente nas primeiras 24 horas e iniciar os exercícios de fonoaudiologia para mobilidade lingual após o 3º dia, conforme cronograma estipulado.`);
    }
    if (parsed.protocols.some(p => p.id === 'protocolo_allon4')) {
      postOpItems.push(`<strong>Dieta Rigorosamente Pastosa nos Primeiros 120 Dias:</strong> Não mastigar carnes fibrosas, cascas de pão, grãos duros ou alimentos crocantes. Toda alimentação deve ser triturada ou pastosa durante a osseointegração da prótese provisória imediata.`);
    }
    if (parsed.protocols.some(p => p.id === 'dam_sono')) {
      postOpItems.push(`<strong>Manobra Matinal de Reposicionamento Oclusal:</strong> Utilizar impreterivelmente a placa oclusal de desprogramação matinal (morning aligner) por 15 minutos logo após retirar o DAM da boca para restabelecer a mordida habitual.`);
    }
    if (parsed.protocols.some(p => p.id === 'sedacao_inalatoria')) {
      postOpItems.push(`<strong>Recuperação Pós-Sedação:</strong> Permanecer em repouso na sala de espera por 15 minutos até a eliminação pulmonar total do N2O. Proibição de conduzir veículos automotores ou operar máquinas pesadas nas 4 horas subsequentes.`);
    }

    if (postOpItems.length > 0) {
      individualizedPostOpAdapters = `
        <div style="margin-top:12px;padding:12px;background:rgba(245,158,11,0.08);border-left:4px solid #f59e0b;border-radius:6px;">
          <strong style="color:#b45309;font-size:12px;text-transform:uppercase;display:block;margin-bottom:6px;">
            <i class="ri-alert-line"></i> Recomendações Pós-Operatórias Adicionais Geradas pelo Quadro do Paciente:
          </strong>
          <ul style="margin:0;padding-left:20px;font-size:12px;line-height:1.6;color:var(--text-main);">
            ${postOpItems.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // 6. COMPROMISSOS EXPRESSOS DO PACIENTE (Para SEÇÃO 15)
    // -------------------------------------------------------------
    let explicitPatientCommitments = '';
    const commitmentList = [];

    if (parsed.protocols.some(p => p.id === 'coroa_blindagem') || parsed.pathologies.some(p => p.id === 'necrose') || parsed.pathologies.some(p => p.id === 'pulpite_irrev')) {
      commitmentList.push(`<strong>Restauração definitiva após o canal:</strong> Agendar restauração definitiva / coroa, quando indicada, em até 30 dias ou no prazo individual registrado pelo dentista. A proteção coronária oportuna reduz riscos de contaminação e fratura; o tipo de restauração depende do remanescente dental. Retornar antes se houver perda do provisório ou sintomas. O atraso não implica exclusão automática de responsabilidade.`);
    }
    if (parsed.protocols.some(p => p.id === 'contencao_orto')) {
      commitmentList.push(`<strong>USO VITALÍCIO DE CONTENÇÃO ORTODÔNTICA E PREVENÇÃO DE RECIDIVA (CDC Art. 14, § 3º, II):</strong> O(A) paciente assume o compromisso rigoroso de utilizar as placas e fios de contenção prescritos após a finalização da movimentação dentária. A falta de uso, perda ou quebra pode favorecer recidiva e deve ser comunicada para reavaliação. Responsabilidades e eventual necessidade de novo tratamento serão avaliadas no caso concreto.`);
    }
    if (parsed.protocols.some(p => p.id === 'desgaste_esmalte')) {
      commitmentList.push(`<strong>CIÊNCIA DA IRREVERSIBILIDADE DO DESGASTE DENTÁRIO EM FACETAS/LENTES (CDC Art. 14, § 3º, II):</strong> O(A) paciente declara ciência inescusável de que o desgaste coronário de esmalte efetuado é perpétuo e irreversível. Compromete-se a manter higiene rigorosa, uso de placa noturna se indicada e assume as custas de futuras substituições protéticas ao longo da vida decorrentes do envelhecimento natural das cerâmicas.`);
    }
    if (parsed.systemic.some(s => s.id === 'bruxism')) {
      commitmentList.push(`<strong>Uso Rigoroso da Placa Oclusal Noturna:</strong> O(A) paciente compromete-se ao uso contínuo da placa miorrelaxante estabilizadora para proteger as cúspides e biomateriais contra as forças mastigatórias descontroladas do bruxismo.`);
    }
    if (parsed.protocols.some(p => p.id === 'protocolo_allon4')) {
      commitmentList.push(`<strong>DIETA E PROTEÇÃO DA PRÓTESE DURANTE A CICATRIZAÇÃO:</strong> Evitar sobrecarga e alimentos duros sobre a reabilitação. Consistência da dieta e duração das restrições serão definidas pelo profissional conforme estabilidade dos implantes, desenho protético e evolução clínica. Comparecer aos retornos e comunicar mobilidade, dor ou fratura.`);
    }
    if (parsed.protocols.some(p => p.id === 'enxerto_palatino')) {
      commitmentList.push(`<strong>NÃO TRACIONAR LÁBIOS/BOCHECHAS E NÃO MANIPULAR O ENXERTO GENGIVAL (CDC Art. 14, § 3º, II):</strong> O(A) paciente declara ciência de que puxar os lábios para tirar fotos ou "olhar a cicatrização", bem como escovar bruscamente a região operada, pode comprometer a cicatrização e deve ser evitado conforme orientações da equipe.`);
    }
    if (parsed.protocols.some(p => p.id === 'dam_sono')) {
      commitmentList.push(`<strong>CUMPRIMENTO DAS CONSULTAS DE TITULAÇÃO E POLISSONOGRAFIA DE CONTROLE (CDC Art. 14, § 3º, II):</strong> O(A) paciente compromete-se a comparecer a todas as consultas quinzenais para avanço mandibular guiado e a realizar nova polissonografia após a estabilização do dispositivo. A interrupção deliberada do tratamento ou o não uso do guia matinal afasta o dever de garantia do dentista.`);
    }
    if (parsed.protocols.some(p => p.id === 'sedacao_inalatoria')) {
      commitmentList.push(`<strong>ORIENTAÇÕES ALIMENTARES ANTES DA SEDAÇÃO:</strong> Informar o horário da última ingestão de alimentos e líquidos e seguir a orientação individual da equipe. O uso isolado de óxido nitroso para sedação mínima não impõe o mesmo jejum de técnicas mais profundas ou associadas a outros sedativos. A equipe decidirá sobre realização, adiamento ou ajuste da técnica.`);
    }

    if (commitmentList.length > 0) {
      explicitPatientCommitments = `
        <div style="margin-top:12px;padding:12px;background:rgba(239,68,68,0.06);border-left:4px solid #ef4444;border-radius:6px;">
          <strong style="color:#b91c1c;font-size:12px;text-transform:uppercase;display:block;margin-bottom:6px;">
            <i class="ri-error-warning-line"></i> Compromissos Específicos Pactuados Sob o Regime de Culpa Exclusiva (CDC Art. 14):
          </strong>
          <ul style="margin:0;padding-left:20px;font-size:12px;line-height:1.6;color:var(--text-main);">
            ${commitmentList.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // 7. GLOSSÁRIO DIDÁTICO DINÂMICO (Para SEÇÃO 21)
    // -------------------------------------------------------------
    const dynamicGlossaryEntries = [];
    const checkAndAddGlossary = (key) => {
      const gItem = CLINICAL_GLOSSARY_DICTIONARY[key];
      if (gItem && !dynamicGlossaryEntries.some(e => e.term === gItem.term)) {
        dynamicGlossaryEntries.push(gItem);
      }
    };

    if (hasWaveOne) checkAndAddGlossary('waveone');
    if (hasReciproc) checkAndAddGlossary('reciproc');
    if (parsed.protocols.some(p => p.id === 'protaper')) checkAndAddGlossary('protaper');
    if (parsed.protocols.some(p => p.id === 'localizador')) checkAndAddGlossary('localizador');
    if (hasPui) checkAndAddGlossary('pui');
    if (parsed.protocols.some(p => p.id === 'hipoclorito')) checkAndAddGlossary('hipoclorito');
    if (parsed.protocols.some(p => p.id === 'edta')) checkAndAddGlossary('edta');
    if (hasHidroxido) checkAndAddGlossary('hidroxido');
    if (parsed.protocols.some(p => p.id === 'mta')) checkAndAddGlossary('mta');
    if (parsed.protocols.some(p => p.id === 'biodentine')) checkAndAddGlossary('biodentine');
    if (hasBioceramico) checkAndAddGlossary('bioceramico');
    if (hasBioOss) {
      checkAndAddGlossary('biooss');
      checkAndAddGlossary('osseointegracao');
    }
    if (hasMembrana) checkAndAddGlossary('membrana');
    if (parsed.pathologies.some(p => p.id === 'fistula')) checkAndAddGlossary('fistula');
    if (parsed.pathologies.some(p => p.id === 'necrose')) checkAndAddGlossary('necrose');
    if (parsed.pathologies.some(p => p.id === 'pericoronite')) checkAndAddGlossary('pericoronite');
    if (parsed.anatomy.hasMandibularCanalProximity) checkAndAddGlossary('parestesia');
    if (parsed.systemic.some(s => s.id === 'bisphosphonate')) checkAndAddGlossary('bisfosfonato');
    if (parsed.protocols.some(p => p.id === 'hialuronidase')) checkAndAddGlossary('hialuronidase');
    if (parsed.protocols.some(p => p.id === 'sinuslift')) checkAndAddGlossary('sinuslift');
    if (parsed.protocols.some(p => p.id === 'desgaste_esmalte')) checkAndAddGlossary('desgaste_esmalte');
    if (parsed.protocols.some(p => p.id === 'contencao_orto')) {
      checkAndAddGlossary('contencao_orto');
      checkAndAddGlossary('recidiva_orto');
    }
    if (parsed.protocols.some(p => p.id === 'blackspaces')) checkAndAddGlossary('blackspaces');
    if (parsed.protocols.some(p => p.id === 'clareamento_sensib')) checkAndAddGlossary('clareamento_sensib');
    if (parsed.protocols.some(p => p.id === 'gengivoplastia_osteo') || parsed.anatomy.isGengivoplasty) {
      checkAndAddGlossary('espaco_biologico');
      checkAndAddGlossary('osteotomia_estetica');
    }
    if (parsed.protocols.some(p => p.id === 'enxerto_palatino') || parsed.anatomy.hasPalatalGraftRisk) {
      checkAndAddGlossary('arteria_palatina_maior');
      checkAndAddGlossary('enxerto_conjuntivo');
    }
    if (parsed.protocols.some(p => p.id === 'frenectomia_tec') || parsed.anatomy.hasSublingualRisk) {
      checkAndAddGlossary('ducto_wharton');
    }
    if (parsed.protocols.some(p => p.id === 'apicectomia_retro')) {
      checkAndAddGlossary('apicectomia');
      checkAndAddGlossary('mta');
    }
    if (parsed.protocols.some(p => p.id === 'protocolo_allon4') || parsed.pathologies.some(p => p.id === 'edentalismo_total')) {
      checkAndAddGlossary('protocolo_branemark');
      checkAndAddGlossary('carga_imediata');
      checkAndAddGlossary('osseointegracao');
    }
    if (parsed.protocols.some(p => p.id === 'dam_sono') || parsed.pathologies.some(p => p.id === 'saos')) {
      checkAndAddGlossary('dispositivo_avanco_mandibular');
    }
    if (parsed.protocols.some(p => p.id === 'sedacao_inalatoria')) {
      checkAndAddGlossary('sedacao_oxido_nitroso');
    }
    if (parsed.anatomy.hasMaxillarySinusProximity) {
      checkAndAddGlossary('comunicacao_bucosinusal');
    }

    return {
      customPathologySynthesis,
      customWorkflowNuances,
      dynamicForensicRisksHTML,
      systemicPharmacologyBlock,
      individualizedPostOpAdapters,
      explicitPatientCommitments,
      dynamicGlossaryEntries
    };
  };

  // Exportação compatível com Navegador e Node.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DentalSafeClinicalAI;
  } else {
    global.DentalSafeClinicalAI = DentalSafeClinicalAI;
  }
})(typeof window !== 'undefined' ? window : global);
