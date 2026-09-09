/**
 * DENTALSAFE TCLE AI — MOTOR DE PRESCRIÇÃO CLÍNICA & ATESTADOS ODONTOLÓGICOS
 * Banco de Medicamentos Consagrados (CFO / FOUSP / Farmacologia Odontológica de Eduardo Dias de Andrade)
 * Atestado de Repouso/Afastamento (Lei 5.081/66) e Atestado de Comparecimento
 */

(function (global) {
  'use strict';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  // 1. BANCO DE MEDICAMENTOS MAIS COMUNS NA CLÍNICA E CIRURGIA ODONTOLÓGICA
  const DENTAL_DRUGS_DB = {
    aines: [
      {
        id: 'nimesulida-100',
        name: 'Nimesulida 100 mg',
        category: 'AINE',
        presentation: 'Comprimidos',
        quantity: '1 caixa (12 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 12 horas, após as refeições, durante 3 a 5 dias.',
        observations: 'Contraindicado em pacientes com insuficiência hepática severa ou histórico de hemorragia gastrointestinal.'
      },
      {
        id: 'cetoprofeno-100',
        name: 'Cetoprofeno 100 mg',
        category: 'AINE',
        presentation: 'Cápsulas ou Comprimidos',
        quantity: '1 caixa (10 a 20 cápsulas)',
        instructions: 'Tomar 1 cápsula por via oral a cada 12 horas, logo após as refeições, durante 3 a 5 dias.',
        observations: 'Potente anti-inflamatório e analgésico de escolha em cirurgias orais de médio e grande porte.'
      },
      {
        id: 'cetoprofeno-150-lp',
        name: 'Cetoprofeno 150 mg LP (Liberação Prolongada)',
        category: 'AINE',
        presentation: 'Comprimidos de liberação prolongada',
        quantity: '1 caixa (10 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral uma vez ao dia (a cada 24 horas), logo após o almoço ou jantar, por 3 a 5 dias.',
        observations: 'Excelente adesão do paciente pela comodidade posológica de tomada única diária.'
      },
      {
        id: 'ibuprofeno-600',
        name: 'Ibuprofeno 600 mg',
        category: 'AINE',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (10 a 20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 8 horas, preferencialmente após as refeições, por 3 a 5 dias.',
        observations: 'Excelente controle do edema e trismo pós-operatório inicial.'
      },
      {
        id: 'ibuprofeno-400',
        name: 'Ibuprofeno 400 mg',
        category: 'AINE',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 6 a 8 horas, após as refeições, por 3 dias.',
        observations: 'Dose equilibrada anti-inflamatória e analgésica para procedimentos clínicos e cirurgias menores.'
      },
      {
        id: 'cetorolaco-sublingual-10',
        name: 'Cetorolaco de Trometamol 10 mg Sublingual (Toragesic)',
        category: 'AINE / Ação Rápida Sublingual',
        presentation: 'Comprimidos sublinguais',
        quantity: '1 caixa (10 comprimidos sublinguais)',
        instructions: 'Dissolver 1 comprimido sob a língua a cada 8 horas se houver dor/inflamação (não engolir inteiro; uso máximo de 5 dias).',
        observations: 'Início de ação ultra-rápido por absorção direta na vascularização sublingual. Excelente no pós-operatório imediato.'
      },
      {
        id: 'celecoxibe-200',
        name: 'Celecoxibe 200 mg (Celebra)',
        category: 'AINE / Inibidor Seletivo COX-2',
        presentation: 'Cápsulas',
        quantity: '1 caixa (10 cápsulas)',
        instructions: 'Tomar 1 cápsula por via oral a cada 12 ou 24 horas, durante 3 a 5 dias.',
        observations: 'Pode causar sangramento e úlcera gastrointestinal, além de riscos cardiovasculares e renais. Avaliar histórico e interações antes de prescrever.'
      },
      {
        id: 'meloxicam-15',
        name: 'Meloxicam 15 mg',
        category: 'AINE',
        presentation: 'Comprimidos',
        quantity: '1 caixa (10 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral uma vez ao dia (a cada 24 horas), durante 3 a 5 dias.',
        observations: 'Inibidor preferencial da COX-2, com menor toxicidade gástrica e cômoda posologia em tomada única diária.'
      },
      {
        id: 'diclofenaco-sodico-50',
        name: 'Diclofenaco Sódico 50 mg',
        category: 'AINE',
        presentation: 'Comprimidos',
        quantity: '1 caixa (20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 8 horas, após as refeições, durante 3 a 5 dias.',
        observations: 'Usar com cautela em idosos, cardiopatas e hipertensos.'
      },
      {
        id: 'naproxeno-500',
        name: 'Naproxeno 500 mg (Flanax)',
        category: 'AINE',
        presentation: 'Comprimidos',
        quantity: '1 caixa (10 a 15 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 12 horas, após as refeições, por 3 a 5 dias.',
        observations: 'Meia-vida plasmática longa, excelente para dor e inflamação na articulação temporomandibular (DTM) e cirurgias orais.'
      }
    ],

    analgesicos: [
      {
        id: 'dipirona-1g',
        name: 'Dipirona Monoidratada 1 g',
        category: 'Analgésico / Antipirético',
        presentation: 'Comprimidos efervescentes ou simples',
        quantity: '1 caixa (10 a 20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 6 horas somente se houver dor (máximo de 4 comprimidos em 24h).',
        observations: 'Analgésico de 1ª linha na Odontologia brasileira. Contraindicado em portadores de favismo ou histórico de alergia à dipirona.'
      },
      {
        id: 'dipirona-500-comp',
        name: 'Dipirona Monoidratada 500 mg',
        category: 'Analgésico / Antipirético',
        presentation: 'Comprimidos',
        quantity: '1 caixa (20 comprimidos)',
        instructions: 'Tomar 1 a 2 comprimidos por via oral a cada 6 horas somente se houver dor.',
        observations: 'Posologia flexível para dor de intensidade leve a moderada.'
      },
      {
        id: 'dipirona-500mg-gotas',
        name: 'Dipirona Solução Oral 500 mg/mL (Gotas)',
        category: 'Analgésico / Antipirético',
        presentation: 'Frasco conta-gotas 20 mL',
        quantity: '1 frasco',
        instructions: 'Ingerir de 20 a 40 gotas diluídas em um pouco de água a cada 6 horas se houver dor.',
        observations: 'Ideal para pacientes com trismo ou dificuldade de deglutição de comprimidos grandes.'
      },
      {
        id: 'paracetamol-750',
        name: 'Paracetamol 750 mg',
        category: 'Analgésico / Antipirético',
        presentation: 'Comprimidos',
        quantity: '1 caixa (16 a 20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 6 a 8 horas se dor ou febre (não ultrapassar 3 g em 24h).',
        observations: 'Alternativa segura para alérgicos à dipirona. Evitar em portadores de insuficiência hepática ou etilistas.'
      },
      {
        id: 'paracetamol-500',
        name: 'Paracetamol 500 mg',
        category: 'Analgésico / Antipirético',
        presentation: 'Comprimidos',
        quantity: '1 caixa (20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 6 horas se dor ou febre.',
        observations: 'Seguro na gestação e lactação sob orientação profissional.'
      },
      {
        id: 'paracetamol-gotas-200',
        name: 'Paracetamol Solução Oral 200 mg/mL (Gotas)',
        category: 'Analgésico / Antipirético',
        presentation: 'Frasco conta-gotas 15 mL',
        quantity: '1 frasco',
        instructions: 'Ingerir de 35 a 55 gotas (adultos) diluídas em um pouco de água a cada 6 horas se houver dor.',
        observations: 'Facilidade de titulação de dose para deglutição dolorosa.'
      },
      {
        id: 'clonixinato-lisina-125',
        name: 'Clonixinato de Lisina 125 mg (Dolamin)',
        category: 'Analgésico Específico Odontológico',
        presentation: 'Comprimidos',
        quantity: '1 caixa (16 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 6 a 8 horas se houver dor.',
        observations: 'Potente efeito analgésico periférico e central com excelente tolerabilidade gástrica.'
      },
      {
        id: 'paracetamol-codeina-30',
        name: 'Paracetamol 500 mg + Fosfato de Codeína 30 mg (Tylex)',
        category: 'Analgésico Opióide / Dor Moderada a Severa (Controle Especial)',
        presentation: 'Comprimidos (Receituário C1)',
        quantity: '1 caixa (12 a 24 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 6 ou 8 horas apenas em caso de dor intensa refratária aos analgésicos comuns.',
        observations: 'Pode provocar sonolência, tontura e constipação. Vedar direção de veículos ou máquinas durante o uso.'
      },
      {
        id: 'tramadol-paracetamol',
        name: 'Cloridrato de Tramadol 37,5 mg + Paracetamol 325 mg (Ultracet)',
        category: 'Analgésico Opióide / Dor Severa (Controle Especial)',
        presentation: 'Comprimidos revestidos (Receituário C1)',
        quantity: '1 caixa (10 a 20 comprimidos)',
        instructions: 'Tomar 1 a 2 comprimidos por via oral a cada 8 horas se dor aguda intensa que não ceda.',
        observations: 'Reserva para osteotomias complexas e reconstruções mandibulares severas.'
      }
    ],

    antibioticos: [
      {
        id: 'amoxicilina-500',
        name: 'Amoxicilina 500 mg',
        category: 'Antibiótico (Betalactâmico)',
        presentation: 'Cápsulas',
        quantity: '1 caixa (21 cápsulas)',
        instructions: 'Tomar 1 cápsula por via oral a cada 8 horas, durante 7 dias rigorosos (mesmo com melhora dos sintomas).',
        observations: 'Primeira escolha para infecções odontogênicas comuns e cirurgias de implantes.'
      },
      {
        id: 'amoxicilina-875',
        name: 'Amoxicilina 875 mg',
        category: 'Antibiótico (Betalactâmico)',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (14 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 12 horas, durante 7 dias rigorosos.',
        observations: 'Posologia confortável a cada 12h, favorecendo a adesão do paciente ao tratamento.'
      },
      {
        id: 'amox-clav-500-125',
        name: 'Amoxicilina 500 mg + Clavulanato de Potássio 125 mg (Clavulin)',
        category: 'Antibiótico (Betalactâmico + Inibidor)',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (21 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 8 horas, junto às refeições, por 7 dias.',
        observations: 'Eficaz contra cepas produtoras de betalactamase em infecções refratárias e enxertos ósseos.'
      },
      {
        id: 'amox-clav-875-125',
        name: 'Amoxicilina 875 mg + Clavulanato de Potássio 125 mg',
        category: 'Antibiótico (Betalactâmico + Inibidor)',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (14 a 20 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 12 horas, junto às refeições, por 7 a 10 dias.',
        observations: 'Padrão-ouro para cirurgias reconstrutivas extensas e sinus lift.'
      },
      {
        id: 'azitromicina-500',
        name: 'Azitromicina 500 mg',
        category: 'Antibiótico / Macrolídeo (Alérgicos à Penicilina)',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (3 a 5 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral uma vez ao dia, em jejum ou 2h após a refeição, por 3 a 5 dias.',
        observations: 'Excelente opção para pacientes comprovadamente alérgicos a penicilinas. Alta penetração tecidual e óssea.'
      },
      {
        id: 'clindamicina-300',
        name: 'Cloridrato de Clindamicina 300 mg',
        category: 'Antibiótico / Lincosamida (Alérgicos à Penicilina)',
        presentation: 'Cápsulas',
        quantity: '1 caixa (16 a 24 cápsulas)',
        instructions: 'Tomar 1 cápsula por via oral a cada 6 ou 8 horas, acompanhada de um copo cheio de água, por 7 dias.',
        observations: 'Alta concentração óssea. Alertar o paciente para descontinuar em caso de diarreia persistente.'
      },
      {
        id: 'metronidazol-400',
        name: 'Metronidazol 400 mg (Flagyl)',
        category: 'Antibiótico / Anti-anaeróbio Estrito',
        presentation: 'Comprimidos revestidos',
        quantity: '1 caixa (20 a 24 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 8 horas, junto às refeições, por 7 dias.',
        observations: 'Específico para patógenos anaeróbios estritos (GUNA/PUN, pericoronarite e infecções periodontais graves). PROIBIDO consumo de bebidas alcoólicas durante o uso (efeito dissulfiram).'
      },
      {
        id: 'cefalexina-500',
        name: 'Cefalexina 500 mg (Keflex)',
        category: 'Antibiótico (Cefalosporina 1ª Geração)',
        presentation: 'Drágeas ou Cápsulas',
        quantity: '1 caixa (28 cápsulas)',
        instructions: 'Tomar 1 cápsula por via oral a cada 6 horas durante 7 dias.',
        observations: 'Alternativa segura para infecções cutâneo-mucosas e profilaxia em pacientes com próteses ortopédicas.'
      },
      {
        id: 'amoxicilina-2g-profilaxia',
        name: 'Amoxicilina 500 mg — Profilaxia Antibiótica AHA (2g)',
        category: 'Profilaxia Prévia (AHA/SBC)',
        presentation: 'Cápsulas',
        quantity: '4 cápsulas',
        instructions: 'Tomar as 4 cápsulas juntas (total de 2 gramas) em tomada única por via oral, exatamente 1 hora antes do procedimento cirúrgico.',
        observations: 'Protocolo padrão-ouro da American Heart Association (AHA) e SBC para prevenção de Endocardite Infecciosa em pacientes de alto risco.'
      },
      {
        id: 'azitromicina-500-profilaxia',
        name: 'Azitromicina 500 mg — Profilaxia AHA (Alérgicos à Penicilina)',
        category: 'Profilaxia Prévia (AHA 2021)',
        presentation: 'Comprimidos revestidos',
        quantity: '1 comprimido',
        instructions: 'Tomar 1 comprimido (500 mg) por via oral em dose única, exatamente 1 hora antes da intervenção odontológica.',
        observations: 'Diretriz atualizada da American Heart Association (AHA 2021/2024) para pacientes alérgicos a betalactâmicos (penicilinas), substituindo a clindamicina na profilaxia padrão.'
      }
    ],

    topicos: [
      {
        id: 'clorexidina-012',
        name: 'Digluconato de Clorexidina 0,12% (Sem Álcool) Solução Bucal',
        category: 'Antisséptico Bucal Tópico / Bochecho',
        presentation: 'Frasco com copo dosador (250 mL)',
        quantity: '1 frasco',
        instructions: 'Fazer banho suave com 15 mL da solução pura por 1 minuto a cada 12 horas, após a escovação suave dos dentes, por 7 a 14 dias (iniciar somente após 24h da cirurgia).',
        observations: 'Não bochechar vigorosamente. Apenas banhar a cavidade oral e deixar escorrer passivamente para preservar o coágulo. Não enxaguar com água em seguida.'
      },
      {
        id: 'clorexidina-gel-02',
        name: 'Digluconato de Clorexidina Gel 0,2% (PerioKin Gel / Cariax)',
        category: 'Antisséptico Tópico / Gel Bioadesivo',
        presentation: 'Bisnaga 30 g',
        quantity: '1 bisnaga',
        instructions: 'Aplicar uma pequena quantidade do gel diretamente sobre a ferida cirúrgica, pontos de sutura ou área inflamada com auxílio de uma haste flexível (cotonete) 2 a 3 vezes ao dia após higiene.',
        observations: 'Ação localizada de liberação prolongada sem necessidade de movimentar líquido na boca. Não ingerir alimentos por 30 minutos após a aplicação.'
      },
      {
        id: 'triancinolona-orabase',
        name: 'Triancinolona Acetonida 1 mg/g em Pasta Oral (Omcilon-A em Orabase)',
        category: 'Corticoide Tópico Bucal / Anti-inflamatório',
        presentation: 'Bisnaga 10 g',
        quantity: '1 bisnaga',
        instructions: 'Aplicar uma pequena quantidade (sem esfregar, apenas depositando uma fina camada aderente) sobre a lesão/afta ao deitar, ou 2 a 3 vezes ao dia após as refeições.',
        observations: 'Indicado para aftas recorrentes, úlceras traumáticas, estomatites e lesões inflamatórias orais. Não esfregar para permitir formação de película protetora.'
      },
      {
        id: 'lidocaina-pomada-5',
        name: 'Pomada de Lidocaína 5% (Xylocaína Pomada)',
        category: 'Anestésico Tópico Mucoso',
        presentation: 'Bisnaga 25 g',
        quantity: '1 bisnaga',
        instructions: 'Definir quantidade e frequência conforme avaliação individual e bula da apresentação. Não ingerir alimentos por 60 minutos após uso na boca ou garganta e enquanto persistir dormência.',
        observations: 'Alívio temporário da dor em lesões traumáticas orais graves, queilite ou pós-raspagem profunda. Cuidado para não morder mucosas anestesiadas.'
      },
      {
        id: 'miconazol-gel-oral',
        name: 'Nitrato de Miconazol Gel Oral 20 mg/g (Daktarin)',
        category: 'Antifúngico Tópico Bucal',
        presentation: 'Bisnaga 40 g com colher-medida',
        quantity: '1 bisnaga',
        instructions: 'Aplicar 1/2 colher-medida (cerca de 2,5 mL) do gel na cavidade bucal 4 vezes ao dia após as refeições, mantendo na boca o maior tempo possível antes de engolir, por 7 a 14 dias.',
        observations: 'Interage com varfarina, com risco de sangramento grave; conferir anticoagulantes e demais interações antes de prescrever. Em usuários de prótese, higienizar e aplicar o gel também na face interna da prótese.'
      },
      {
        id: 'nistatina-suspensao-100k',
        name: 'Nistatina Suspensão Oral 100.000 UI/mL',
        category: 'Antifúngico Oral / Bochecho e Deglutição',
        presentation: 'Frasco 50 mL com conta-gotas graduado',
        quantity: '1 a 2 frascos',
        instructions: 'Bochechar 4 a 6 mL da suspensão por vários minutos na cavidade bucal a cada 6 horas, deglutindo em seguida, durante 10 a 14 dias (mesmo após o desaparecimento dos sintomas).',
        observations: 'Tratamento de candidíase orofaríngea. Agitar bem antes de usar.'
      },
      {
        id: 'acido-hialuronico-gel',
        name: 'Gel de Ácido Hialurônico 0,2% Biotecnológico (Gengigel / PerioAid)',
        category: 'Regenerador e Cicatrizante Mucoso Tópico',
        presentation: 'Bisnaga 20 mL',
        quantity: '1 bisnaga',
        instructions: 'Aplicar massageando suavemente com a ponta dos dedos limpos ou haste de algodão sobre o tecido gengival operado ou ferida 3 a 4 vezes ao dia por 7 a 15 dias.',
        observations: 'Acelera a neoangiogênese e epitelização da mucosa, reduzindo desconforto pós-cirúrgico e pós-clareamento.'
      },
      {
        id: 'bicarbonato-05',
        name: 'Bicarbonato de Sódio 0,5% Solução Bucal',
        category: 'Alcalinizante / Protetor Mucoso',
        presentation: 'Frasco 200 a 500 mL',
        quantity: '1 frasco',
        instructions: 'Bochechar suavemente 15 mL da solução por 1 minuto, de 3 a 4 vezes ao dia, cuspindo em seguida.',
        observations: 'Eleva o pH bucal, diminuindo a acidez e aliviando a queimação em pacientes com xerostomia, refluxo gastroesofágico ou mucosite.'
      }
    ],

    corticoides: [
      {
        id: 'dexametasona-4',
        name: 'Dexametasona 4 mg',
        category: 'Corticoide Sistêmico',
        presentation: 'Comprimidos',
        quantity: '1 caixa (10 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral pela manhã, por 2 a 3 dias (ou 1 a 2 comp. 1h antes do procedimento como dose de ataque).',
        observations: 'Poderoso controle preventivo do edema, trismo e dor inflamatória aguda. Não estender o uso além de 3 dias para evitar supressão adrenal.'
      },
      {
        id: 'prednisona-20',
        name: 'Prednisona 20 mg',
        category: 'Corticoide Sistêmico',
        presentation: 'Comprimidos',
        quantity: '1 caixa (10 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral pela manhã durante 3 dias seguidos.',
        observations: 'Glicocorticoide sistêmico seguro para intervenções ósseas e mucogengivais extensas.'
      },
      {
        id: 'betametasona-2',
        name: 'Betametasona 2 mg',
        category: 'Corticoide Sistêmico',
        presentation: 'Comprimidos',
        quantity: '1 caixa (10 comprimidos)',
        instructions: 'Tomar 1 comprimido por via oral a cada 12 horas durante 2 a 3 dias.',
        observations: 'Ação anti-inflamatória prolongada com mínima retenção hidroeletrolítica.'
      },
      {
        id: 'dexametasona-dose-unica',
        name: 'Dexametasona 4 mg / 8 mg — Dose Única Pré-Operatória (Preemptiva)',
        category: 'Corticoide / Analgesia Preemptiva',
        presentation: 'Comprimidos',
        quantity: '1 caixa (4 comprimidos)',
        instructions: 'Tomar 2 comprimidos de 4 mg (total de 8 mg) ou 1 comprimido (4 mg) por via oral em tomada única, exatamente 1 hora antes do procedimento cirúrgico.',
        observations: 'Padrão-ouro científico (Peterson / Andrade): bloqueio da fosfolipase A2 antes do dano tecidual. Alta eficácia contra edema com ausência de supressão adrenal pós-operatória.'
      }
    ]
  };

  // 2. PRESETS ODONTOLÓGICOS PRÉ-CONFIGURADOS (1 CLIQUE)
  const PRESCRIPTION_PRESETS = {
    'cirurgico-padrao': {
      title: 'Cirurgia Oral / Sisos (Edema e Dor Moderada/Forte)',
      drugs: ['cetoprofeno-100', 'dexametasona-4', 'dipirona-1g', 'clorexidina-012']
    },
    'implante-enxerto': {
      title: 'Implantodontia & Enxerto Ósseo (Antibioticoterapia + Anti-inflamatório)',
      drugs: ['amoxicilina-875', 'cetoprofeno-100', 'dexametasona-4', 'dipirona-1g', 'clorexidina-012']
    },
    'infeccao-aguda': {
      title: 'Infecção Endodôntica / Abscesso Dentário Agudo',
      drugs: ['amox-clav-500-125', 'ibuprofeno-600', 'dipirona-1g']
    },
    'pericoronarite-anaerobio': {
      title: 'Pericoronarite / Infecção Anaeróbia Aguda',
      drugs: ['amoxicilina-500', 'metronidazol-400', 'dipirona-1g', 'clorexidina-gel-02']
    },
    'alergico-penicilina': {
      title: 'Paciente Alérgico a Penicilina (Cirurgia / Implante)',
      drugs: ['clindamicina-300', 'cetoprofeno-100', 'dipirona-1g', 'clorexidina-012']
    },
    'analgesia-leve': {
      title: 'Procedimento Clínico Leve / Raspagem / Dor Moderada',
      drugs: ['nimesulida-100', 'dipirona-1g']
    },
    'profilaxia-aha': {
      title: 'Profilaxia Antibiótica Endocardite Infecciosa (Amox 2g — AHA / SBC)',
      drugs: ['amoxicilina-2g-profilaxia']
    },
    'profilaxia-aha-alergico': {
      title: 'Profilaxia AHA para Alérgico a Penicilina (Azitromicina 500mg — AHA 2021)',
      drugs: ['azitromicina-500-profilaxia']
    },
    'cirurgia-preemptiva': {
      title: 'Cirurgia Avançada com Analgesia Preemptiva (Sisos / Implantes)',
      drugs: ['dexametasona-dose-unica', 'amoxicilina-875', 'cetoprofeno-100', 'dipirona-1g', 'clorexidina-012']
    },
    'aftas-estomatite': {
      title: 'Aftas, Estomatite e Úlceras Traumáticas Orais',
      drugs: ['triancinolona-orabase', 'clorexidina-gel-02', 'dipirona-1g']
    },
    'candidiase-oral': {
      title: 'Candidíase Oral (Sapinho) & Estomatite por Prótese',
      drugs: ['miconazol-gel-oral', 'nistatina-suspensao-100k', 'clorexidina-012']
    }
  };

  // 3. BANCO DE CIDs ODONTOLÓGICOS MAIS COMUNS (CID-10)
  const COMMON_DENTAL_CIDS = [
    { code: 'sem-cid', label: 'Não declarar CID (Garantia de Sigilo Profissional — Padrão CFO)' },
    { code: 'K01.1', label: 'K01.1 — Dentes inclusos / Terceiros molares (Sisos)' },
    { code: 'K01.0', label: 'K01.0 — Dentes impactados' },
    { code: 'K04.0', label: 'K04.0 — Pulpite aguda ou crônica (Tratamento de canal)' },
    { code: 'K04.7', label: 'K04.7 — Abscesso periapical sem fístula' },
    { code: 'K05.3', label: 'K05.3 — Periodontite crônica' },
    { code: 'K08.1', label: 'K08.1 — Perda de dentes devida a acidente / Reabilitação com implantes' },
    { code: 'K07.6', label: 'K07.6 — Transtornos da articulação temporomandibular (DTM / Bruxismo)' },
    { code: 'K08.8', label: 'K08.8 — Outras afecções especificadas dos dentes e estruturas de sustentação' },
    { code: 'Z01.2', label: 'Z01.2 — Exame odontológico de rotina e prevenção' }
  ];

  /**
   * Renderiza o Documento do Receituário em HTML Timbrado
   */
  function buildPrescriptionHTML(patientData, clinicData, selectedDrugList, specialInstructions, customPrescriptionText) {
    const pName = (patientData && patientData.name) || 'Paciente';
    const pCpf = (patientData && patientData.cpf) || '---';
    const date = (patientData && patientData.date) || new Date().toLocaleDateString('pt-BR');
    const clinicName = ((clinicData && clinicData.name) || 'CLÍNICA ODONTOLÓGICA').toUpperCase();
    const dentistName = (clinicData && clinicData.dentist) || 'Dr. Cirurgião-Dentista';
    const dentistCro = (clinicData && clinicData.cro) || 'CRO';
    const phone = (clinicData && clinicData.phone) || 'Telefone não informado';
    const address = (clinicData && clinicData.address) || 'Endereço não informado';

    let itemsHTML = '';
    if (customPrescriptionText !== null && customPrescriptionText !== undefined) {
      itemsHTML = `
        <div id="rx-sheet-content" contenteditable="true" oninput="onRxSheetInlineInput(this)" style="font-size: 13.5px; color: #1e293b; line-height: 1.75; white-space: pre-wrap; outline: none; padding: 6px; border-radius: 6px;" title="Clique para editar este receituário diretamente na folha">${escapeHTML(customPrescriptionText)}</div>
      `;
    } else if (selectedDrugList && selectedDrugList.length > 0) {
      const field=(drug,key)=>'<span contenteditable="true" data-rx-field="'+key+'" role="textbox" aria-label="'+escapeHTML(key+' — '+drug.name)+'" oninput="onRxDrugFieldInput(\''+drug.id+'\',\''+key+'\',this)">'+escapeHTML(drug[key] || '')+'</span>';
      itemsHTML='<div id="rx-sheet-content">'+selectedDrugList.filter(drug=>/^[a-z0-9-]+$/.test(drug.id)).map((drug,index)=>
        '<div class="rx-item" data-rx-id="'+drug.id+'"><div><strong>'+(index+1)+'. '+field(drug,'name')+'</strong><button type="button" class="rx-item-del-btn no-print" onclick="removeRxDrug(\''+drug.id+'\')" title="Remover medicamento">✕</button></div><p>Quantidade: '+field(drug,'quantity')+'</p><p>Modo de usar: '+field(drug,'instructions')+'</p><p>Observações: '+field(drug,'observations')+'</p></div>'
      ).join('')+'</div>';
    } else {
      itemsHTML = '<p style="font-size: 13px; color: #64748b; font-style: italic;">Nenhum medicamento prescrito no momento. Selecione nos botões/presets ao lado ou digite diretamente no editor de texto.</p>';
    }

    return `
    <div class="prescription-sheet" style="background: #ffffff; color: #0f172a; padding: 34px 38px; border: 1px solid #cbd5e1; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; box-shadow: 0 4px 18px rgba(0,0,0,0.06); max-width: 800px; margin: 0 auto;">
      
      <!-- CABEÇALHO DO RECEITUÁRIO -->
      <div style="border-bottom: 2px solid #0a84ff; padding-bottom: 16px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
        <div>
          <h2 style="margin: 0 0 4px 0; color: #0f172a; font-size: 17px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${escapeHTML(clinicName)}</h2>
          <p style="margin: 0; font-size: 12px; color: #64748b;">${escapeHTML(dentistName)} — ${escapeHTML(dentistCro)} · Tel: <strong>${escapeHTML(phone)}</strong></p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">${escapeHTML(address)}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; display: inline-block;">
            <i class="ri-medicine-bottle-line"></i> RECEITUÁRIO ODONTOLÓGICO
          </div>
          <div style="margin-top: 6px; font-size: 11.5px; color: #64748b;">Data: <strong>${escapeHTML(date)}</strong></div>
        </div>
      </div>

      <!-- DADOS DO PACIENTE -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; margin-bottom: 24px; font-size: 13px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div><strong>Paciente:</strong> <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${escapeHTML(pName)}</span></div>
        <div><strong>CPF:</strong> ${escapeHTML(pCpf)}</div>
      </div>

      <!-- CORPO DA PRESCRIÇÃO -->
      <div style="margin-bottom: 28px; min-height: 220px;">
        <div style="font-size: 12px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
          <span>VIA E MODO DE USAR CONFORME CADA MEDICAMENTO:</span>
          <span class="no-print" style="font-size: 10px; color: #94a3b8; font-weight: normal; text-transform: none;"><i class="ri-edit-2-line"></i> Editável por botões ou texto</span>
        </div>
        ${itemsHTML}

        ${specialInstructions ? `
        <div style="margin-top: 18px; padding: 12px 14px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; font-size: 12px; color: #92400e;">
          <strong>Orientações Específicas do Profissional:</strong><br>
          ${escapeHTML(specialInstructions)}
        </div>` : ''}
      </div>

      <!-- RODAPÉ E ASSINATURA -->
      <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 20px; margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap;">
        <div style="font-size: 11px; color: #64748b; max-width: 380px; line-height: 1.45;">
          <i class="ri-information-line"></i> Em caso de reações adversas, náuseas persistentes, erupções cutâneas ou alergia a qualquer dos fármacos, suspenda o uso imediatamente e contate o consultório: <strong>${escapeHTML(phone)}</strong>.
        </div>
        <div style="text-align: center; min-width: 260px;">
          <div style="border-top: 1px solid #0f172a; padding-top: 6px; font-weight: 700; font-size: 13px; color: #0f172a;">
            ${escapeHTML(dentistName)}
          </div>
          <div style="font-size: 11px; color: #64748b;">${escapeHTML(dentistCro)}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Cirurgião(ã)-Dentista Responsável</div>
        </div>
      </div>

    </div>`;
  }

  /**
   * Renderiza o Atestado de Repouso / Afastamento Odontológico
   */
  function buildMedicalLeaveHTML(patientData, clinicData, leaveOptions, customFullTextArg) {
    const pName = (patientData && patientData.name) || 'Paciente';
    const pCpf = (patientData && patientData.cpf) || '---';
    const pRg = (patientData && patientData.rg) || '---';
    const date = (patientData && patientData.date) || new Date().toLocaleDateString('pt-BR');
    const clinicName = ((clinicData && clinicData.name) || 'CLÍNICA ODONTOLÓGICA').toUpperCase();
    const dentistName = (clinicData && clinicData.dentist) || 'Dr. Cirurgião-Dentista';
    const dentistCro = (clinicData && clinicData.cro) || 'CRO';
    const phone = (clinicData && clinicData.phone) || 'Telefone não informado';
    const address = (clinicData && clinicData.address) || 'Endereço não informado';

    const days = (leaveOptions && leaveOptions.days) || 1;
    const cid = (leaveOptions && leaveOptions.cid && leaveOptions.cid !== 'sem-cid') ? leaveOptions.cid : null;
    const customReason = (leaveOptions && leaveOptions.customReason) || 'procedimento cirúrgico odontológico e repouso pós-operatório necessário para recuperação biológica tecidual';
    const customFullText = customFullTextArg ?? (leaveOptions && leaveOptions.customFullText);

    const daysText = days === 1 ? '1 (um) dia' : `${days} (${['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez'][days] || days}) dias`;

    const mainBody = customFullText != null ? escapeHTML(customFullText).replace(/\n/g, '<br>') : `Atesto, para os devidos fins legais, laborais e escolares, sob as penas da lei e em conformidade com o Artigo 6º, inciso III da Lei Federal nº 5.081/1966 e resoluções do Conselho Federal de Odontologia, que o(a) Sr.(a) <strong>${escapeHTML(pName)}</strong>, inscrito(a) no CPF sob o nº <strong>${escapeHTML(pCpf)}</strong>${pRg !== '---' ? ` e RG nº ${escapeHTML(pRg)}` : ''}, esteve sob meus cuidados profissionais no dia de hoje, tendo sido submetido(a) a <strong>${escapeHTML(customReason)}</strong>, necessitando em virtude disso de <strong>${daysText}</strong> de repouso e afastamento total de suas atividades rotineiras, laborativas e estudantis, a contar desta data (<strong>${escapeHTML(date)}</strong>).`;

    return `
    <div class="certificate-sheet" style="background: #ffffff; color: #0f172a; padding: 40px 44px; border: 1px solid #cbd5e1; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7; box-shadow: 0 4px 18px rgba(0,0,0,0.06); max-width: 800px; margin: 0 auto;">
      
      <!-- CABEÇALHO -->
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
        <div>
          <h2 style="margin: 0 0 4px 0; color: #0f172a; font-size: 17px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${escapeHTML(clinicName)}</h2>
          <p style="margin: 0; font-size: 12px; color: #64748b;">${escapeHTML(dentistName)} — ${escapeHTML(dentistCro)} · Tel: <strong>${escapeHTML(phone)}</strong></p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">${escapeHTML(address)}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
            <i class="ri-file-shield-2-line"></i> ATESTADO ODONTOLÓGICO
          </div>
          <div style="margin-top: 6px; font-size: 11.5px; color: #64748b;">Emissão: <strong>${escapeHTML(date)}</strong></div>
        </div>
      </div>

      <!-- TÍTULO -->
      <div style="text-align: center; margin: 30px 0 25px 0;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: 0.05em; text-transform: uppercase;">
          ATESTADO DE DISPENSA / REPOUSO MÉDICO-ODONTOLÓGICO
        </h3>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
          Para os devidos fins de justificativa legal e abono de faltas (Lei Federal nº 5.081/1966, Art. 6º, III e CLT)
        </p>
      </div>

      <!-- TEXTO PRINCIPAL EDITÁVEL -->
      <div id="leave-sheet-text" contenteditable="true" oninput="onLeaveSheetInlineInput(this)" style="font-size: 14.5px; color: #1e293b; text-align: justify; margin-bottom: 30px; line-height: 1.8; outline: none; padding: 4px 6px; border-radius: 6px;" title="Clique para editar este texto diretamente na folha timbrada">
        ${mainBody}
      </div>

      ${cid ? `
      <div style="background: #f1f5f9; border-left: 4px solid #10b981; padding: 10px 16px; margin-bottom: 30px; font-size: 12.5px; color: #334155; border-radius: 4px;">
        <strong>Diagnóstico / Código CID-10 (Autorizado expressamente pelo paciente):</strong> ${cid}
      </div>` : `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 14px; margin-bottom: 30px; font-size: 11.5px; color: #64748b; border-radius: 4px; font-style: italic;">
        Nota Ética: A ausência de declaração de código CID resguarda o direito fundamental de sigilo sobre a intimidade do paciente, assegurado pela Constituição Federal e Resolução CFO-118/2012.
      </div>`}

      <!-- DATA E ASSINATURA -->
      <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 20px;">
        <div style="font-size: 12px; color: #64748b;">
          Data: <strong>${escapeHTML(date)}</strong>.
        </div>
        <div style="text-align: center; min-width: 280px;">
          <div style="border-top: 1.5px solid #0f172a; padding-top: 6px; font-weight: 700; font-size: 13.5px; color: #0f172a;">
            ${escapeHTML(dentistName)}
          </div>
          <div style="font-size: 11.5px; color: #475569;">${escapeHTML(dentistCro)}</div>
          <div style="font-size: 10.5px; color: #94a3b8;">Cirurgião(ã)-Dentista Assistente</div>
        </div>
      </div>

    </div>`;
  }

  /**
   * Renderiza o Atestado de Comparecimento Odontológico (Abono de Horas/Turno)
   */
  function buildAttendanceCertificateHTML(patientData, clinicData, attendanceOptions, customFullTextArg) {
    const pName = (patientData && patientData.name) || 'Paciente';
    const pCpf = (patientData && patientData.cpf) || '---';
    const date = (patientData && patientData.date) || new Date().toLocaleDateString('pt-BR');
    const clinicName = ((clinicData && clinicData.name) || 'CLÍNICA ODONTOLÓGICA').toUpperCase();
    const dentistName = (clinicData && clinicData.dentist) || 'Dr. Cirurgião-Dentista';
    const dentistCro = (clinicData && clinicData.cro) || 'CRO';
    const phone = (clinicData && clinicData.phone) || 'Telefone não informado';
    const address = (clinicData && clinicData.address) || 'Endereço não informado';

    const timeStart = (attendanceOptions && (attendanceOptions.timeStart || attendanceOptions.startTime)) || '14:00';
    const timeEnd = (attendanceOptions && (attendanceOptions.timeEnd || attendanceOptions.endTime)) || '17:00';
    const shift = (attendanceOptions && attendanceOptions.shift) || '';
    const customFullText = customFullTextArg ?? (attendanceOptions && attendanceOptions.customFullText);
    const customReason = (attendanceOptions && attendanceOptions.reason) || 'consulta e atendimento clínico';

    let shiftText = '';
    if (shift === 'manha') shiftText = 'no período matutino (das 08:00 às 12:00 horas)';
    else if (shift === 'tarde') shiftText = 'no período vespertino (das 14:00 às 17:00 horas)';
    else if (shift === 'noite') shiftText = 'no período noturno (das 18:00 às 21:00 horas)';
    else if (shift === 'integral') shiftText = 'durante todo o período integral de atendimento (das 08:00 às 18:00 horas)';
    else shiftText = `no horário das <strong>${escapeHTML(timeStart)}</strong> às <strong>${escapeHTML(timeEnd)}</strong> horas`;

    const mainBody = customFullText != null ? escapeHTML(customFullText).replace(/\n/g, '<br>') : `Declaro, para os devidos fins de comprovação e abono de horas perante seu empregador ou estabelecimento de ensino, que o(a) Sr.(a) <strong>${escapeHTML(pName)}</strong>, inscrito(a) no CPF sob o nº <strong>${escapeHTML(pCpf)}</strong>, compareceu a este consultório odontológico no dia <strong>${escapeHTML(date)}</strong>, permanecendo em ${escapeHTML(customReason)} ${shiftText}.`;

    return `
    <div class="attendance-sheet" style="background: #ffffff; color: #0f172a; padding: 40px 44px; border: 1px solid #cbd5e1; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7; box-shadow: 0 4px 18px rgba(0,0,0,0.06); max-width: 800px; margin: 0 auto;">
      
      <!-- CABEÇALHO -->
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
        <div>
          <h2 style="margin: 0 0 4px 0; color: #0f172a; font-size: 17px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${escapeHTML(clinicName)}</h2>
          <p style="margin: 0; font-size: 12px; color: #64748b;">${escapeHTML(dentistName)} — ${escapeHTML(dentistCro)} · Tel: <strong>${escapeHTML(phone)}</strong></p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">${escapeHTML(address)}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
            <i class="ri-time-line"></i> ATESTADO DE COMPARECIMENTO
          </div>
          <div style="margin-top: 6px; font-size: 11.5px; color: #64748b;">Emissão: <strong>${escapeHTML(date)}</strong></div>
        </div>
      </div>

      <!-- TÍTULO -->
      <div style="text-align: center; margin: 30px 0 25px 0;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: 0.05em; text-transform: uppercase;">
          DECLARAÇÃO DE COMPARECIMENTO ODONTOLÓGICO
        </h3>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
          Comprovante de comparecimento para fins de abono de período ou horas de trabalho/estudo (CLT)
        </p>
      </div>

      <!-- TEXTO PRINCIPAL EDITÁVEL -->
      <div id="att-sheet-text" contenteditable="true" oninput="onAttSheetInlineInput(this)" style="font-size: 14.5px; color: #1e293b; text-align: justify; margin-bottom: 30px; line-height: 1.8; outline: none; padding: 4px 6px; border-radius: 6px;" title="Clique para editar este texto diretamente na folha timbrada">
        ${mainBody}
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 35px; font-size: 12px; color: #475569;">
        <strong>Finalidade:</strong> A presente declaração destina-se exclusivamente a justificar a ausência do(a) paciente ao seu posto de trabalho ou atividade acadêmica durante o intervalo de tempo necessário ao seu atendimento odontológico.
      </div>

      <!-- DATA E ASSINATURA -->
      <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 20px;">
        <div style="font-size: 12px; color: #64748b;">
          Data: <strong>${escapeHTML(date)}</strong>.
        </div>
        <div style="text-align: center; min-width: 280px;">
          <div style="border-top: 1.5px solid #0f172a; padding-top: 6px; font-weight: 700; font-size: 13.5px; color: #0f172a;">
            ${escapeHTML(dentistName)}
          </div>
          <div style="font-size: 11.5px; color: #475569;">${escapeHTML(dentistCro)}</div>
          <div style="font-size: 10.5px; color: #94a3b8;">Cirurgião(ã)-Dentista Responsável</div>
        </div>
      </div>

    </div>`;
  }

  /**
   * Formata texto da receita para envio instantâneo no WhatsApp
   */
  function formatPrescriptionWhatsAppText(patientData, clinicData, selectedDrugList) {
    const pName = (patientData && patientData.name) || 'Paciente';
    const date = (patientData && patientData.date) || new Date().toLocaleDateString('pt-BR');
    const clinicName = ((clinicData && clinicData.name) || 'Clínica Odontológica').toUpperCase();
    const phone = (clinicData && clinicData.phone) || 'Telefone não informado';

    let msg = `*💊 RECEITUÁRIO ODONTOLÓGICO — ${clinicName}*\n`;
    msg += `*Paciente:* ${pName}\n`;
    msg += `*Data:* ${date}\n\n`;
    msg += `Olá, ${pName}! Segue a sua receita odontológica para o seu pós-operatório/tratamento:\n\n`;

    selectedDrugList.forEach((drug, idx) => {
      msg += `*${idx + 1}. ${drug.name.toUpperCase()}*\n`;
      msg += `• Quantidade: ${drug.quantity || '1 caixa'}\n`;
      msg += `• *Como tomar:* ${drug.instructions}\n`;
      if (drug.observations) msg += `• _Nota: ${drug.observations}_\n`;
      msg += `\n`;
    });

    msg += `*📞 Dúvidas ou emergências:* ${phone}\n`;
    msg += `_DentalSafe AI — Siga rigorosamente as doses e horários prescritos pelo seu dentista._`;

    return msg;
  }

  /**
   * Formata texto do atestado para WhatsApp
   */
  function formatMedicalLeaveWhatsAppText(patientData, clinicData, leaveOptions) {
    const pName = (patientData && patientData.name) || 'Paciente';
    const date = (patientData && patientData.date) || new Date().toLocaleDateString('pt-BR');
    const clinicName = ((clinicData && clinicData.name) || 'Clínica Odontológica').toUpperCase();
    const dentistName = (clinicData && clinicData.dentist) || 'Dr. Cirurgião-Dentista';
    const dentistCro = (clinicData && clinicData.cro) || 'CRO';
    const days = (leaveOptions && leaveOptions.days) || 1;

    let msg = `*📋 ATESTADO MÉDICO-ODONTOLÓGICO — ${clinicName}*\n`;
    msg += `*Paciente:* ${pName}\n`;
    msg += `*Data de Emissão:* ${date}\n\n`;
    msg += `Atesto para os devidos fins que o(a) paciente *${pName}* esteve sob atendimento odontológico nesta data, necessitando de *${days} dia(s)* de afastamento de suas atividades para sua recuperação clínica.\n\n`;
    msg += `*Cirurgião-Dentista:* ${dentistName} (${dentistCro})\n`;
    msg += `_Documento original emitido e assinado fisicamente ou via assinatura eletrônica válida (Lei 5.081/66 e Lei 14.063/20)._`;

    return msg;
  }

  // Exportação
  function reviewPrescription(drugs) {
    const issues=[];
    if(drugs.some(d=>!d.name?.trim() || !d.instructions?.trim() || !d.quantity?.trim())) issues.push({blocking:true,message:'Preencha nome, quantidade e modo de usar de todos os medicamentos.'});
    const nsaids=drugs.filter(d=>/^AINES?\b/i.test(d.category || ''));
    if(nsaids.length>1) issues.push({blocking:true,message:'Mais de um AINE selecionado: revise a duplicidade antes de emitir.'});
    if(drugs.filter(d=>/paracetamol/i.test(d.name)).length>1) issues.push({blocking:true,message:'Paracetamol aparece em mais de um medicamento. Revise a dose total e a duplicidade.'});
    if(drugs.some(d=>/antibi[oó]tico/i.test(d.category))) issues.push({blocking:false,message:'Antibióticos: confirme indicação, alergias, dose e duração. Profilaxia para endocardite requer critérios específicos.'});
    if(nsaids.length && drugs.some(d=>/corticoide/i.test(d.category))) issues.push({blocking:false,message:'AINE associado a corticoide: revisar necessidade da combinação e risco gastrointestinal.'});
    if(drugs.some(d=>d.id==='miconazol-gel-oral')) issues.push({blocking:false,message:'Miconazol oral: verificar uso de varfarina pelo risco de sangramento grave.'});
    return issues;
  }

  const DentalSafeRx = {
    reviewPrescription,
    DENTAL_DRUGS_DB,
    PRESCRIPTION_PRESETS,
    COMMON_DENTAL_CIDS,
    buildPrescriptionHTML,
    buildMedicalLeaveHTML,
    buildAttendanceCertificateHTML,
    formatPrescriptionWhatsAppText,
    formatMedicalLeaveWhatsAppText
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DentalSafeRx;
  } else {
    global.DentalSafeRx = DentalSafeRx;
  }

})(typeof window !== 'undefined' ? window : global);
