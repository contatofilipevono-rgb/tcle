/**
 * ============================================================================
 * DentalSafe AI v3.5 — Banco de Dados & Regras Clínico-Jurídicas de HOF
 * Harmonização Orofacial Especializada (Res. CFO-198/2019, 230/2020 e 196/2019)
 * ============================================================================
 */

const HOF_DATABASE = {
  // 1. ZONAS DE ALTO RISCO ANATÔMICO (FACIAL DANGER ZONES)
  dangerZones: [
    {
      id: "zone-glabela",
      name: "Zona 1: Região Glabelar & Fronte Central",
      vessels: "Artérias Supratroclear e Supraorbital (ramos da Artéria Oftálmica)",
      riskLevel: "CRÍTICO (Risco Máximo)",
      riskClass: "danger",
      primaryRisks: "Amaurose (cegueira súbita irreversível por embolização retrógrada), necrose cutânea da fronte/glabela e cefaleia intensa.",
      anatomicalDetails: "As artérias supratroclear e supraorbital emergem das incisuras supraorbitais e comunicam-se com a artéria central da retina. Uma pressão retrógrada acidental de injeção empurra o êmbolo preenchedor para a circulação ocular.",
      preventionProtocol: [
        "Uso preferencial de microcânulas 22G ou 25G com ponta romba;",
        "Aspiração com refluxo mantida por no mínimo 5 a 10 segundos antes de injetar;",
        "Injeções de baixíssimo volume em microbolus (máximo 0,02 a 0,05 mL por ponto);",
        "Oclusão digital do rebordo orbitário medial com o polegar para bloquear o fluxo em direção à órbita durante a injeção;",
        "Suspender imediatamente o procedimento se houver dor ocular súbita ou perda de nitidez visual."
      ],
      legalClause: "CLÁUSULA FORENSE — ZONA GLABELAR / RISCO OFTALMOLÓGICO: Fica o(a) paciente cientificado(a) de que a região frontal/glabelar possui anastomoses vasculares com a circulação da retina. Embora raras, intercorrências graves como oclusão vascular ou comprometimento visual agudo (amaurose) encontram-se descritas na literatura médica. O paciente autoriza desde já o acionamento imediato do protocolo de resgate vascular."
    },
    {
      id: "zone-asa-nasal",
      name: "Zona 2: Asa Nasal & Sulco Nasogeniano Superior",
      vessels: "Artéria Angular (ramo terminal da Artéria Facial) e ramos nasais laterais",
      riskLevel: "CRÍTICO (Risco Alto)",
      riskClass: "danger",
      primaryRisks: "Necrose da asa nasal, perfuração cartilaginosa, isquemia do ápice nasal e cicatrizes inestéticas.",
      anatomicalDetails: "A artéria angular ascende junto à asa nasal no plano subcutâneo/muscular superficial. A asa do nariz possui circulação terminal rica mas pouca colateral redundante caso a artéria angular seja ocluída na base da narina.",
      preventionProtocol: [
        "Injeção estritamente profunda supraperióstea na fossa canina ou intradérmica muito superficial;",
        "NUNCA injetar no plano subdérmico/intramuscular intermediário na asa nasal;",
        "Uso de microcânulas e volumes conservadores (< 0,1 mL por retroinjeção);",
        "Teste de perfusão capilar imediato pós-injeção na ponta e asas do nariz (tempo normal < 2s)."
      ],
      legalClause: "CLÁUSULA FORENSE — ASA NASAL / SULCO SUPERIOR: O(A) paciente declara ciência de que o preenchimento da fossa canina e sulco nasogeniano superior margeia a artéria angular. Qualquer sinal de empalidecimento (blanching) na asa do nariz ou dor em queimação nas primeiras 24 horas obriga o comparecimento imediato para avaliação e descompressão enzimática."
    },
    {
      id: "zone-labios",
      name: "Zona 3: Lábios & Comissuras Orais",
      vessels: "Artérias Labiais Superior e Inferior",
      riskLevel: "ALTO (Risco Frequente)",
      riskClass: "warning",
      primaryRisks: "Necrose do vermelhão labial, isquemia transmural, perda tecidual com defeito de contorno e assimetria.",
      anatomicalDetails: "As artérias labiais transitam geralmente entre a camada muscular do orbicular e a submucosa oral posterior (profundidade de 2 a 5 mm). Podem apresentar variações anatômicas e tortuosidades.",
      preventionProtocol: [
        "Plano de injeção sempre superficial: na derme ou transição mucosa seca/úmida a menos de 2 mm de profundidade;",
        "Aspiração com refluxo por 5 segundos antes de qualquer bolus;",
        "Massagem imediata com gaze para acomodar o material;",
        "Evitar volumes maiores que 1,0 mL por sessão na totalidade labial."
      ],
      legalClause: "CLÁUSULA FORENSE — LÁBIOS E COMISSURAS: Declara o(a) paciente que foi esclarecido(a) sobre a presença das artérias labiais e que o edema inflamatório labial é comum nos primeiros 3 a 5 dias. O paciente compromete-se a não morder, sugar com canudo ou comprimir os lábios nas primeiras 48 horas."
    },
    {
      id: "zone-fossa-temporal",
      name: "Zona 4: Fossa Temporal & Região Pré-Auricular",
      vessels: "Ramo Frontal da Artéria Temporal Superficial e Veia Temporal Média",
      riskLevel: "MODERADO A ALTO",
      riskClass: "warning",
      primaryRisks: "Oclusão arterial com necrose de couro cabeludo, embolização retrógrada e hematoma volumoso.",
      anatomicalDetails: "A fáscia temporal profunda e o músculo temporal contêm vasos de calibre expressivo. Injeções em planos intermediários são de risco.",
      preventionProtocol: [
        "Técnica de injeção supraperióstea direta encostada no osso parietal/frontal na fossa temporal alta ou subdérmica com cânula longa;",
        "Aspirar vigorosamente por 10 segundos antes de cada aplicação;",
        "Injeção lenta sem pressão forçada."
      ],
      legalClause: "CLÁUSULA FORENSE — FOSSA TEMPORAL: Declara o paciente ciência de que a volumização temporal visa restaurar o contorno esquelético craniofacial da perda volumétrica fisiológica do envelhecimento, respeitando a anatomia vascular temporal e muscular mastigatória."
    },
    {
      id: "zone-mandibula",
      name: "Zona 5: Ângulo da Mandíbula & Forame Mentoniano",
      vessels: "Artéria Facial cruzando a base mandibular e Feixe Mentoniano (artéria e nervo)",
      riskLevel: "MODERADO",
      riskClass: "info",
      primaryRisks: "Hematoma pulsátil, oclusão da artéria facial na incisura antegonial, parestesia transitória do lábio inferior por compressão mecânica.",
      anatomicalDetails: "A artéria facial cruza a borda inferior da mandíbula anteriormente ao masseter. O forame mentoniano localiza-se abaixo dos pré-molares inferiores.",
      preventionProtocol: [
        "Palpação prévia do pulso da artéria facial na borda mandibular anterior ao masseter;",
        "Aplicação supraperióstea precisa no ângulo mandibular ou uso de microcânula;",
        "Não injetar no orifício do forame mentoniano."
      ],
      legalClause: "CLÁUSULA FORENSE — CONTORNO MANDIBULAR E MENTO: Declara ciência de que o preenchimento estrutural de mandíbula e mento é realizado com ácido hialurônico de alta viscoelasticidade (G-prime elevado), exigindo repouso mastigatório e evitar apoiar a mão sobre a região nos primeiros 7 dias."
    }
  ],

  // 2. SUB-PROCEDIMENTOS DE HOF REGULAMENTADOS PELO CFO
  procedures: {
    toxina: {
      name: "Toxina Botulínica Tipo A",
      brands: ["Botox (Allergan)", "Dysport (Galderma)", "Xeomin (Merz)", "Botulift", "Nabota"],
      indications: "Rugas dinâmicas frontais, glabela ('rugas de bravo'), peri-orbiculares ('pés de galinha'), sorriso gengival, hipertrofia do masseter (bruxismo/afilamento facial), rugas periorais ('código de barras'), ptose leve de comissura.",
      onset: "Início de ação entre 48h e 72h; efeito máximo em 15 dias; duração média de 3 a 5 meses dependendo do metabolismo do paciente.",
      risks: "Ptose palpebral (queda temporária da pálpebra por difusão para o músculo levantador da pálpebra superior), assimetria de sobrancelhas ('sobrancelha de Spock'), ptose labial, hematomas nos pontos de punção, cefaleia pós-aplicação.",
      reversalTreatment: "Colírio de Apraclonidina 0,5% ou Tartarato de Brimonidina 0,2% (1 gota 3x/dia) em caso de ptose palpebral para estimular o músculo de Müller.",
      specificCommitment: "O(A) paciente compromete-se a: (a) NÃO deitar a cabeça nas primeiras 4 horas após a aplicação; (b) NÃO massagear as áreas tratadas para evitar migração da toxina para músculos vizinhos; (c) NÃO realizar exercícios físicos intensos ou sauna nas primeiras 24 horas; (d) Comparecer pontualmente à reavaliação entre o 14º e o 21º dia para retoques eventuais."
    },
    preenchimento: {
      name: "Preenchedores Dérmicos de Ácido Hialurônico (AH)",
      brands: ["Juvéderm (Allergan)", "Restylane (Galderma)", "Rennova", "Belotero (Merz)", "Stylage", "Perfectha"],
      indications: "Volumização e contorno labial, sulco nasogeniano, olheiras, malar/zigomático, contorno mandibular, mento, fossa temporal, rinomodelação não-cirúrgica leve.",
      onset: "Resultado mecânico imediato, com estabilização e acomodação tecidual após redução do edema em 15 a 30 dias; duração média de 8 a 18 meses (reabsorvível por hidrólise enzimática natural).",
      risks: "Edema, equimose, efeito Tyndall (coloração azulada em plano muito superficial), nódulos tardios, granuloma e oclusão vascular isquêmica.",
      reversalTreatment: "Hialuronidase de resgate imediato (500 a 3.000 UI) diluída em solução salina aplicada em leque e massagem térmica contínua.",
      specificCommitment: "O(A) paciente declara ciência de que o ácido hialurônico é material biocompatível e temporário, cuja durabilidade varia conforme seu metabolismo individual, práticas esportivas e hidratação. Autoriza desde logo o uso de hialuronidase de resgate caso haja sinal de compressão circulatória."
    },
    bioestimuladores: {
      name: "Bioestimuladores de Colágeno Sintéticos e Autólogos",
      brands: ["Sculptra (Ácido Poli-L-Lático / PLLA)", "Radiesse (Hidroxiapatita de Cálcio / CaHA)", "Ellansé (Policaprolactona / PCL)", "i-PRF / PRF Autólogo"],
      indications: "Tratamento de flacidez dérmica facial e cervical, rejuvenescimento tridimensional da qualidade da pele, estímulo de neoformação de colágeno tipos I e III.",
      onset: "O efeito volumizador inicial (veículo carreador) regride nos primeiros dias; o resultado biológico real inicia-se em 30 a 60 dias e atinge ápice em 90 a 120 dias, com duração de 18 a 24 meses.",
      risks: "Formação de micro e macronódulos não-inflamatórios, granulomas tardios de corpo estranho, assimetrias caso as massagens pós-operatórias não sejam executadas rigorosamente.",
      reversalTreatment: "Massagens vigorosas com a regra dos '5-5-5' (5 minutos, 5 vezes ao dia, por 5 dias para PLLA); infiltração intralesional de soro fisiológico ou corticosteroide (triancinolona) em nódulos persistentes.",
      specificCommitment: "O(A) paciente assume o compromisso pessoal de realizar as massagens prescritas pelo cirurgião-dentista, ciente de que a omissão nessa conduta pode ocasionar o acúmulo nodular de produto sob a pele, exigindo reavaliação e orientação individual, sem atribuição automática de culpa."
    },
    fios_sustentacao: {
      name: "Fios de Sustentação & Bioestímulo (PDO / PLLA / PCL)",
      brands: ["i-Thread", "Silhouette Soft", "Mint Lift", "Aptos", "PDO Beauty"],
      indications: "Lifting mecânico e tração de tecidos ptosados de terço médio e inferior da face, definição mandibular, bioestimulação contínua do contorno facial.",
      onset: "Tração mecânica imediata nos fios espiculados; estímulo fibroblástico progressivo ao longo da reabsorção (6 a 12 meses); efeito clínico de 12 a 18 meses.",
      risks: "Extrusão de ponta de fio na pele ou mucosa, pregueamento cutâneo temporário, dor mastigatória leve nos primeiros dias, assimetria de tração, hematomas, quebra mecânica precoce do fio por abertura exagerada da boca.",
      reversalTreatment: "Trimming / corte asséptico da ponta exposta sob anestesia local e remoção parcial se houver infecção bacteriana.",
      specificCommitment: "O(A) paciente compromete-se a: (a) Evitar abertura bucal ampla, gargalhadas exageradas ou mastigação de alimentos duros por 15 dias; (b) Não dormir de lado ou de bruços por 2 semanas; (c) Não realizar limpezas de pele profundas por 30 dias."
    },
    lipoplastia_quimica: {
      name: "Lipoplastia Facial Química Submentoniana (Ácido Deoxicólico)",
      brands: ["Kybella", "Ácido Deoxicólico Manipulado Regulamentado"],
      indications: "Redução de gordura pré-platismal localizada na região da papada (submento).",
      onset: "Ação lítica sobre adipócitos com edema pronunciado nos primeiros 7 a 10 dias; redução visível da papada a partir de 30 a 45 dias pós-sessão.",
      risks: "Edema inflamatório volumoso transitório ('queixo de buldogue' por 5 a 7 dias), neuropraxia transitória do ramo marginal da mandíbula com sorriso torto temporário (1 a 2 meses), dormência cutânea, nódulos fibróticos.",
      reversalTreatment: "Compressas frias nas primeiras 48h, drenagem linfática facial suave após 7 dias, uso de faixa mentoniana compressiva pós-procedimento.",
      specificCommitment: "O(A) paciente declara ciência de que pode haver inchaço após o procedimento. Inchaço intenso, progressivo ou associado a outros sinais de alerta exige avaliação imediata."
    }
  },

  // 3. PROTOCOLO MINUTO A MINUTO DE RESGATE VASCULAR COM HIALURONIDASE (DeLorenzi)
  emergencyProtocol: {
    title: "Protocolo SOS de Oclusão Vascular em HOF (DeLorenzi / Carruthers Consensus)",
    steps: [
      {
        time: "Minuto 0 (Imediato)",
        action: "SUSPENDER A INJEÇÃO IMEDIATAMENTE",
        details: "Ao menor sinal de branqueamento cutâneo (blanching), reticulado livedoide arroxeado ou dor aguda em queimação, pare de injetar no mesmo segundo. Mantenha a calma e explique ao paciente com autoridade técnica e serenidade."
      },
      {
        time: "Minuto 1 a 5",
        action: "TESTE DE PERFUSÃO CAPILAR & DILATAÇÃO TÉRMICA",
        details: "Pressione a pele isquêmica por 5 segundos e solte. Se o enchimento capilar demorar mais de 2 segundos, a oclusão arterial está confirmada. Aplique compressas TÉRMICAS MORNAS continuamente para promover vasodilatação periférica. NUNCA aplique gelo!"
      },
      {
        time: "Minuto 5 a 15",
        action: "INUNDAÇÃO EM ALTA DOSE DE HIALURONIDASE",
        details: "Injetar imediatamente entre 1.500 UI e 3.000 UI de Hialuronidase diluída em 2 a 3 mL de Soro Fisiológico 0,9% estéril (sem vasoconstritor). Injetar em múltiplos pontos e em todas as profundidades (supraperiósteo, intramuscular e subcutâneo) em toda a área empalidecida e ao longo de todo o trajeto da artéria comprometida."
      },
      {
        time: "Minuto 15 a 30",
        action: "MASSAGEM VIGOROSA CONTÍNUA & LASERTERAPIA",
        details: "Massagear firmemente a região para que a hialuronidase permeie os vasos afetados. Aplicar Laser de Baixa Intensidade Vermelho (660nm) e Infravermelho (808nm) ou protocolo ILIB sistêmico para estimular microcirculação e liberação de óxido nítrico endotelial."
      },
      {
        time: "Minuto 60 a 90",
        action: "REAVALIAÇÃO E SEGUNDA RODADA DE HIALURONIDASE",
        details: "Se após 60 a 90 minutos a coloração da pele não tiver retornado ao padrão róseo natural com tempo de enchimento capilar < 2s, REPETIR a dose completa de 1.500 a 3.000 UI de Hialuronidase. Não hesite em usar até 6.000 UI no mesmo dia se necessário."
      },
      {
        time: "Terapia Oral",
        action: "FARMACOTERAPIA SISTÊMICA DE SUPORTE",
        details: "1. Ácido Acetilsalicílico (AAS): 100mg a 300mg VO dose única (antiagregação plaquetária contra trombos intra-arteriais);\n2. Ciprofloxacino 500mg 12/12h por 7 dias (prevenção de infecção secundária por necrose tecidual hipóxica);\n3. Prednisona 40mg VO pela manhã por 3 a 5 dias (modulação do edema peri-vascular);\n4. Sildenafil 20mg a 50mg VO (vasodilatador sob monitoramento pressórico)."
      },
      {
        time: "Alerta Máximo",
        action: "CONDUTA EM CASO DE SUSPEITA DE AMAUROSE / COMPROMETIMENTO VISUAL",
        details: "Caso o paciente relate perda visual súbita, escotomas ou dor ocular retrobulbar profunda durante injeção em glabela ou dorso nasal: PARE TUDO. Acione imediatamente o SAMU (192) ou transporte de emergência com destino a pronto-socorro hospitalar com serviço de Oftalmologia de plantão. Instile 1 gota de colírio de Timolol 0,5% e administre oxigênio a 100% sob máscara. O tempo de sobrevida da retina sem perfusão é de cerca de 60 a 90 minutos."
      }
    ]
  },

  // 4. LEGISLAÇÃO E JURISPRUDÊNCIA COMENTADA (CFO / STJ)
  legalFramework: [
    {
      code: "Resolução CFO-198/2019",
      title: "Reconhecimento da Harmonização Orofacial como Especialidade Odontológica",
      summary: "Define a HOF como especialidade oficial da Odontologia, autorizando os cirurgiões-dentistas a praticar procedimentos de equilíbrio funcional e estético da face, incluindo toxina botulínica, ácido hialurônico, bioestimuladores de colágeno, fios de sustentação e agregados plaquetários PRF, no limite anatômico do terço superior, médio e inferior até a região do osso hioide.",
      impact: "Confere respaldo legal e ético pleno perante o CFO. Em caso de litígio, comprova que o cirurgião-dentista atua estritamente dentro da habilitação legal prevista pela Lei Federal 5.081/1966 (Art. 6º, I e II)."
    },
    {
      code: "Resolução CFO-230/2020",
      title: "Limites Expressos e Vedações Cirúrgicas aos Cirurgiões-Dentistas",
      summary: "Fixa com clareza os procedimentos VEDADOS ao cirurgião-dentista, tais como: rinoplastia aberta/fechada invasiva com fratura óssea, blefaroplastia cirúrgica completa aberta, ritidoplastia / face lifting cirúrgico com descolamento SMAS, otoplastia e cirurgias maiores corporais.",
      impact: "O TCLE deve deixar explícito que o procedimento realizado é minimamente invasivo e enquadrado nas técnicas autorizadas pelo CFO, afastando qualquer alegação de exercício ilegal de ato médico privativo."
    },
    {
      code: "Resolução CFO-196/2019",
      title: "Autorização e Regras Rígidas para Divulgação de 'Antes e Depois'",
      summary: "Permite a divulgação de imagens de 'antes e depois' e autorretratos (selfies) de profissionais com pacientes, DESDE QUE com autorização prévia por escrito em TCLE específico de cessão de direitos de imagem, sem sensacionalismo ou promessa de resultados garantidos, devendo constar obrigatoriamente a frase: 'Esta imagem não representa garantia de resultado idêntico para outros indivíduos, pois cada organismo possui resposta biológica e anatômica própria'.",
      impact: "Blindagem contra processos éticos no CRO e processos civis indenizatórios por violação de direito de imagem ou publicidade enganosa."
    },
    {
      code: "STJ — Precedentes em Responsabilidade Civil Estética",
      title: "Obrigação de Meio Qualificada vs Obrigação de Resultado (STJ REsp 1.395.254 e 1.871.939)",
      summary: "Em procedimentos puramente estéticos, o STJ tende a classificar a obrigação como de resultado ou a exigir um dever de informação exacerbado (hiper-qualificado). Para afastar a presunção de culpa, o profissional deve provar que prestou esclarecimentos minudentes, documentou assimetrias pré-existentes e cumpriu a boa-fé objetiva (Art. 422 do Código Civil).",
      impact: "O TCLE detalhado com descrição de assimetrias anatômicas naturais e limitação biológica afasta a obrigação de 'simetria milimétrica' e demonstra a conduta pericial irrepreensível."
    }
  ]
};

// Exportação para navegador e Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HOF_DATABASE;
} else {
  window.HOF_DATABASE = HOF_DATABASE;
}
