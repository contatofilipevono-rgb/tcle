/**
 * ============================================================================
 * DENTALSAFE TCLE AI — BASE DE DIRETRIZES PÓS-OPERATÓRIAS INSTITUCIONAIS
 * (postop-guidelines-db.js)
 *
 * Compêndio baseado nos protocolos clínicos da FOUSP, UNICAMP, ITI, AAE, EFP,
 * AAOMS, CFO (Res. 118/2012) e Código de Defesa do Consumidor (Art. 14, § 3º, II).
 * ============================================================================
 */

(function (global) {
  'use strict';
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const INSTITUTIONAL_POSTOP_GUIDELINES = {
    'sisos': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — EXODONTIA DE TERCEIROS MOLARES (SISOS)',
      institutionRef: 'Protocolo de Cirurgia Bucomaxilofacial FOUSP & FOP-UNICAMP / AAOMS',
      specialty: 'Cirurgia Oral Menor / Terceiros Molares',
      timeline: {
        immediate24h: [
          '<strong>Hemostasia e Coágulo:</strong> Mantenha a gaze estéril mordida firmemente sobre a ferida por 30 a 45 minutos. NÃO cuspa nem faça sucção, pois isso desloca o coágulo sanguíneo.',
          '<strong>Proibição de Canudos e Bochechos:</strong> É terminantemente proibido usar canudos de refrigerante/bebidas ou bochechar nas primeiras 24 horas (causa primária de hemorragia e alveolite seca).',
          '<strong>Crioterapia Facial (Gelo):</strong> Aplique bolsa térmica de gelo envolta em pano fino sobre a bochecha do lado operado por 20 minutos, descansando 20 minutos, durante as primeiras 24 a 48 horas.',
          '<strong>Repouso Absoluto:</strong> Permaneça em repouso relativo, com a cabeça elevada por 2 travesseiros ao deitar. Não abaixe a cabeça e evite esforços físicos por 7 dias.',
          '<strong>Dieta Estritamente Líquida/Pastosa Fria ou Gelada:</strong> Sorvetes de massa (sem pedaços duros), açaí batido, iogurtes, purês frios e vitaminas. Nada quente, nada duro e nada com grãos (arroz, gergelim, pipoca).'
        ],
        days48to72h: [
          '<strong>Pico do Inchaço (Edema):</strong> O inchaço atinge o pico entre 48h e 72h. Isso é uma reação biológica inflamatória normal dos tecidos faciais.',
          '<strong>Trismo Muscular (Dificuldade de abrir a boca):</strong> Caso sinta rigidez na mandíbula, após 48h pode-se alternar para compressas mornas úmidas para relaxamento muscular.',
          '<strong>Farmacoterapia Rigorosa:</strong> Tome os anti-inflamatórios, analgésicos e antibióticos nos horários exatos prescritos, sem interrupção antecipada.'
        ],
        days7to14: [
          '<strong>Higienização Bucal Cuidadosa:</strong> Escove normalmente os dentes distantes da cirurgia. Próximo aos pontos, use escova cirúrgica extramacia sem esfregar a ferida.',
          '<strong>Bochecho Suave com Clorexidina:</strong> Se prescrito, apenas banhe a boca suavemente com Clorexidina 0,12% após o 2º dia, deixando o líquido escorrer passivamente sem cuspir com força.',
          '<strong>Remoção de Pontos:</strong> Compareça pontualmente no retorno agendado (7 a 10 dias) para retirada das suturas e avaliação clínica da cicatrização.'
        ]
      },
      prohibitions: [
        'PROIBIDO FUMAR por no mínimo 7 a 10 dias (o tabaco destrói o coágulo e causa dor extrema de alveolite);',
        'PROIBIDO ingerir bebidas alcoólicas durante o uso de medicações;',
        'PROIBIDO praticar esportes, musculação, corridas ou tomar sol por 7 dias;',
        'PROIBIDO cutucar a ferida cirúrgica com o dedo, língua ou palitos de dente.'
      ],
      redAlertSignals: [
        'Sangramento vivo e contínuo que não estanca após 30 minutos de pressão com gaze estéril nova;',
        'Febre corporal persistente acima de 38°C;',
        'Dor lancinante, pulsátil e profunda irradiada para o ouvido que piora a partir do 3º dia (sinal de alveolite);',
        'Dificuldade progressiva para engolir ou respirar (emergência cirúrgica);',
        'Dormência (parestesia) mantida no lábio, queixo ou língua após cessar o efeito do anestésico.'
      ]
    },

    'cirurgia_oral': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — CIRURGIA ORAL E EXODONTIA',
      institutionRef: 'Protocolo da Disciplina de Cirurgia Oral FOP-UNICAMP & FOUSP',
      specialty: 'Cirurgia Oral Menor',
      timeline: {
        immediate24h: [
          '<strong>Manutenção do Coágulo:</strong> Pressione a gaze estéril sobre o alvéolo por 30 minutos. Não cuspa e não fique bochechando.',
          '<strong>Alimentação Segura:</strong> Consuma alimentos macios, frios ou mornos. Evite alimentos duros que possam entrar na ferida.',
          '<strong>Gelo Local:</strong> Compressas frias por 15 a 20 minutos nas primeiras 24 horas reduzem o edema pós-operatório.',
          '<strong>Não Usar Canudo:</strong> A pressão de sucção desloca o coágulo sanguíneo.'
        ],
        days48to72h: [
          '<strong>Evolução da Ferida:</strong> O desconforto e o leve inchaço regridem progressivamente com o uso correto dos analgésicos.',
          '<strong>Repouso:</strong> Não realize esforços físicos pesados ou carregue peso nas primeiras 48 a 72 horas.'
        ],
        days7to14: [
          '<strong>Higiene Oral:</strong> Mantenha a boca limpa. Restos alimentares no alvéolo causam odor desagradável e risco infeccioso.',
          '<strong>Retorno:</strong> Retirada de pontos em 7 dias.'
        ]
      },
      prohibitions: [
        'Não fumar durante o período de cicatrização;',
        'Não ingerir álcool;',
        'Não realizar bochechos vigorosos nas primeiras 48 horas.'
      ],
      redAlertSignals: [
        'Hemorragia ativa que não cede com compressão;',
        'Dor intensa não aliviada pelos analgésicos prescritos;',
        'Febre acima de 38°C ou secreção purulenta com gosto ruim.'
      ]
    },

    'implante': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — IMPLANTODONTIA & REGENERAÇÃO ÓSSEA',
      institutionRef: 'Diretrizes Clínicas Internacionais ITI (International Team for Implantology) & EAO',
      specialty: 'Implantodontia',
      timeline: {
        immediate24h: [
          '<strong>Carga Mastigatória ZERO:</strong> É terminantemente proibido mastigar qualquer tipo de alimento sobre a região do implante ou enxerto.',
          '<strong>Gelo e Repouso:</strong> Compressas de gelo por 20 minutos a cada hora nas primeiras 48h. Repouso com a cabeça elevada.',
          '<strong>Alimentação Pastosa e Fria:</strong> Alimentos que não exijam mastigação no lado operado.',
          '<strong>Não Tocar no Local:</strong> Não passe a língua, dedos ou escova de dente sobre o implante/cicatrizador.'
        ],
        days48to72h: [
          '<strong>Proteção da Estabilidade Primária:</strong> As micromovimentações mastigatórias destroem a formação óssea inicial (causa número 1 de perda do implante).',
          '<strong>Medicação Contínua:</strong> Antibióticos prescritos devem ser tomados até o último comprimido no horário fixo.'
        ],
        days7to14: [
          '<strong>Banhos Suaves de Clorexidina 0,12%:</strong> Deixe o antisséptico agir suavemente sobre a gengiva sem bochecho mecânico forte.',
          '<strong>Remoção de Pontos:</strong> Retorno em 10 a 14 dias para avaliação dos tecidos peri-implantares.'
        ]
      },
      prohibitions: [
        'PROIBIÇÃO ABSOLUTA DE FUMAR: O cigarro contrai os microvasos sanguíneos do osso e multiplica por 5 o risco de não-osseointegração;',
        'NÃO usar próteses provisórias removíveis antigas que apertem a área do implante sem autorização expressa;',
        'NÃO praticar exercícios pesados por 7 a 10 dias.'
      ],
      redAlertSignals: [
        'Mobilidade perceptível do cicatrizador ou do parafuso do implante;',
        'Exposição de grânulos brancos de enxerto ósseo com dor ou secreção;',
        'Sensação contínua de formigamento ou dormência no lábio e queixo.'
      ]
    },

    'protocolo_implante': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — PRÓTESE PROTOCOLO FIXO ALL-ON-4',
      institutionRef: 'Protocolo de Osseointegração de Branemark & Consenso Internacional Maló',
      specialty: 'Implantodontia Reabilitadora Complexa',
      timeline: {
        immediate24h: [
          '<strong>Dieta ESTRITAMENTE Líquida e Pastosa Mole por 120 Dias:</strong> A carga mastigatória deve ser mínima durante os 4 meses de osseointegração biológica.',
          '<strong>Gelo nas Primeiras 48 Horas:</strong> Aplicação intermitente na face para modular o edema maxilar/mandibular.',
          '<strong>Higienização com Seringa sem Agulha / Jato Suave:</strong> Lavagem suave da interface entre a prótese e a gengiva com soro fisiológico ou clorexidina.'
        ],
        days48to72h: [
          '<strong>Adaptação Funcional:</strong> Falar pausadamente e não testar a força da mordida.',
          '<strong>Controle Farmacológico:</strong> Seguir rigorosamente o protocolo anti-inflamatório e analgésico.'
        ],
        days7to14: [
          '<strong>Reaperto de Parafusos Protetores:</strong> Consulta clínica entre 10 e 15 dias para conferência do torque dos pilares e remoção de pontos.'
        ]
      },
      prohibitions: [
        'PROIBIDO MASTIGAR ALIMENTOS SÓLIDOS OU DUROS (carnes, castanhas, pães crocantes) durante os primeiros 120 dias;',
        'PROIBIDO tentar apertar ou desaparafusar a prótese por conta própria;',
        'PROIBIDO fumar durante todo o processo de reabilitação.'
      ],
      redAlertSignals: [
        'Sensação de folga ou estalo ao morder em qualquer um dos lados da prótese;',
        'Sangramento contínuo sob a prótese;',
        'Dor progressiva que não cede com os remédios.'
      ]
    },

    'canal': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — TRATAMENTO DE CANAL (ENDODONTIA)',
      institutionRef: 'Diretrizes Clínicas da AAE (American Association of Endodontists) & SBE',
      specialty: 'Endodontia',
      timeline: {
        immediate24h: [
          '<strong>Sensibilidade Mastigatória Esperada:</strong> É absolutamente normal o dente ficar sensível à mordida por 48 a 72 horas após o canal, devido à manipulação dos instrumentos no ápice da raiz.',
          '<strong>NÃO Mastigar sobre o Dente Tratado:</strong> O dente está com restauração provisória. Mastigar sobre ele pode trincar a raiz ou quebrar a coroa.',
          '<strong>Analgésicos de Suporte:</strong> Utilize o analgésico prescrito se houver desconforto mecânico ao mastigar.'
        ],
        days48to72h: [
          '<strong>Remissão dos Sintomas:</strong> A sensação de dor diminui gradualmente com o repouso mastigatório do dente.',
          '<strong>Manutenção do Curativo:</strong> Caso sinta que o curativo provisório afundou ou soltou, entre em contato para reposição imediata.'
        ],
        days7to14: [
          '<strong>OBRIGAÇÃO DE RESTAURAÇÃO DEFINITIVA EM ATÉ 30 DIAS:</strong> Agende a restauração definitiva / coroa, quando indicada, em até 30 dias ou conforme prazo individual registrado pelo dentista. Retorne antes se houver perda do provisório ou sintomas.'
        ]
      },
      prohibitions: [
        'NÃO mastigar balas duras, amendoins ou alimentos rígidos sobre o dente até a confecção da coroa/restauração final;',
        'NÃO adiar a restauração definitiva por mais de 30 dias;'
      ],
      redAlertSignals: [
        'Inchaço súbito na gengiva ao lado do dente ou inchaço no rosto (abscesso periapical);',
        'Febre persistente;',
        'Quebra total da estrutura dental remanescente.'
      ]
    },

    'apicectomia': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — CIRURGIA PARENDODÔNTICA (APICECTOMIA)',
      institutionRef: 'Protocolo de Cirurgia Apical AAE & FOUSP',
      specialty: 'Cirurgia Parendodôntica',
      timeline: {
        immediate24h: [
          '<strong>Proteção da Sutura Gengival:</strong> NÃO levante o lábio ou bochecha para ficar olhando a sutura no espelho (a tração rompe os pontos).',
          '<strong>Gelo Intermitente:</strong> Compressas frias por 20 minutos nas primeiras 48h na projeção do ápice do dente operado.',
          '<strong>Dieta Fria e Macia:</strong> Evitar qualquer pressão mecânica na área anterior ou apical.'
        ],
        days48to72h: [
          '<strong>Repouso Físico:</strong> Sem esportes ou corridas por 5 dias.',
          '<strong>Higienização com Cotonete / Gaze:</strong> Limpeza dos dentes com cuidado sem atingir a linha da incisão cirúrgica.'
        ],
        days7to14: [
          '<strong>Remoção de Pontos:</strong> Retirada de sutura delicada entre o 7º e o 10º dia.'
        ]
      },
      prohibitions: [
        'Não tracionar o lábio;',
        'Não fumar nem bochechar forte;',
        'Não morder com o dente operado.'
      ],
      redAlertSignals: [
        'Sangramento que empurra o retalho gengival;',
        'Edema facial rápido;',
        'Exposição de secreção na gengiva.'
      ]
    },

    'enxerto_gengival': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — ENXERTO GENGIVAL E CIRURGIA PLÁSTICA PERIODONTAL',
      institutionRef: 'Diretrizes EFP (European Federation of Periodontology) & SOBRAPE (Zucchelli / Langer)',
      specialty: 'Periodontia e Cirurgia Plástica Periodontal',
      timeline: {
        immediate24h: [
          '<strong>NÃO PUXAR O LÁBIO:</strong> A vascularização do enxerto é extremamente frágil. Puxar o lábio para olhar a gengiva rompe a união capilar e provoca necrose do enxerto.',
          '<strong>Placa Palatina Protetora:</strong> Mantenha a placa de acrílico no céu da boca nas primeiras 48h para proteger a área doadora do enxerto.',
          '<strong>Dieta Exclusivamente Gelada e Pastosa:</strong> Sorvetes, gelatinas e vitaminas frias.'
        ],
        days48to72h: [
          '<strong>Sem Escovação na Gengiva Operada:</strong> Não passe a escova de dente sobre o enxerto por 14 dias.',
          '<strong>Banhos de Clorexidina:</strong> Limpeza química exclusivamente com banhos passivos de Clorexidina 0,12% 2x ao dia.'
        ],
        days7to14: [
          '<strong>Cicatrização do Palato:</strong> A área do céu da boca cicatriza por segunda intenção.',
          '<strong>Remoção Cuidadosa dos Pontos:</strong> Retorno em 14 dias para remoção das microsuturas.'
        ]
      },
      prohibitions: [
        'PROIBIDO tracionar lábios e bochechas;',
        'PROIBIDO escovar o dente enxertado nos primeiros 14 dias;',
        'PROIBIDO fumar (o tabaco inviabiliza a revascularização do enxerto);',
        'PROIBIDO comer alimentos quentes ou crocantes.'
      ],
      redAlertSignals: [
        'Sangramento pulsátil no céu da boca (artéria palatina maior);',
        'Coloração branca acinzentada opaca com desprendimento de tecido e odor fétido;',
        'Dor intensa que não cede com analgésicos.'
      ]
    },

    'gengivoplastia': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — GENGIVOPLASTIA E AUMENTO DE COROA',
      institutionRef: 'Protocolos Periodontais EFP & SOBRAPE',
      specialty: 'Periodontia Estética',
      timeline: {
        immediate24h: [
          '<strong>Dieta Suave:</strong> Alimentos macios e frios;',
          '<strong>Sem Bochechos Vigorosos:</strong> Evitar rompimento de coágulo superficial da gengiva modelada.'
        ],
        days48to72h: [
          '<strong>Higiene Química:</strong> Uso suave de Clorexidina 0,12% sem esfregar as margens gengivais;',
          '<strong>Sensibilidade Leve:</strong> Pode haver sensibilidade transitória ao frio.'
        ],
        days7to14: [
          '<strong>Maturação Gengival:</strong> A gengiva atinge contorno estável entre 30 e 90 dias.'
        ]
      },
      prohibitions: [
        'Não ingerir alimentos ácidos (limão, vinagre, pimentas) nas primeiras 72h;',
        'Não escovar com força a linha da gengiva operada.'
      ],
      redAlertSignals: [
        'Sangramento contínuo;',
        'Infecção com edema volumoso.'
      ]
    },

    'facetas': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — FACETAS CERÂMICAS & LENTES DE CONTATO',
      institutionRef: 'Sociedade Brasileira de Odontologia Estética (SBOE) & Academy of General Dentistry',
      specialty: 'Dentística Restauradora e Prótese',
      timeline: {
        immediate24h: [
          '<strong>Sensibilidade Térmica Normal:</strong> É comum leve sensibilidade ao frio nos primeiros dias.',
          '<strong>Acomodação Oclusal:</strong> Se sentir que a mordida está "alta" em algum ponto, retorne para ajuste milimétrico imediato.'
        ],
        days48to72h: [
          '<strong>Uso do Fio Dental:</strong> Passe o fio dental suavemente abraçando cada dente sem dar trancos bruscos.'
        ],
        days7to14: [
          '<strong>USO OBRIGATÓRIO DA PLACA NOTURNA:</strong> Para pacientes com bruxismo ou apertamento dental, o uso diário da placa miorrelaxante é indispensável para resguardar a garantia biológica das peças cerâmicas.'
        ]
      },
      prohibitions: [
        'NÃO morder objetos duros (canetas, grampos, gelo);',
        'NÃO roer unhas (onicofagia);',
        'NÃO tentar rasgar fitas, sachês ou embalagens plásticas com os dentes.'
      ],
      redAlertSignals: [
        'Descolamento de alguma faceta (guarde a peça e compareça ao consultório);',
        'Dor contínua e espontânea que impede o sono (necessidade de avaliação pulpar).'
      ]
    },

    'harmonizacao': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — HARMONIZAÇÃO OROFACIAL (HOF)',
      institutionRef: 'Consenso Internacional DeLorenzi & Resolução CFO-198/2019',
      specialty: 'Harmonização Orofacial',
      timeline: {
        immediate24h: [
          '<strong>NÃO DEITAR OU ABAIXAR A CABEÇA NAS PRIMEIRAS 4 HORAS:</strong> Em aplicações de Toxina Botulínica, deitar pode fazer a toxina migrar para a pálpebra (causando queda dos olhos / ptose).',
          '<strong>NÃO MASSAGEAR A FACE:</strong> Não aperte, não esfregue e não passe cremes ou maquiagem nas primeiras 24 horas para evitar contaminações.',
          '<strong>Sem Exercícios Físicos:</strong> Evite esforço físico, corrida, academia e saunas por 48 horas.',
          '<strong>Dormir de Barriga para Cima:</strong> Mantenha a cabeça elevada com travesseiros adicionais na primeira noite.'
        ],
        days48to72h: [
          '<strong>Edema e Hematomas:</strong> Pequenos hematomas roxos (equimoses) nas áreas de injeção regridem em 5 a 10 dias. Pode-se usar pomada indicada pelo profissional após 24h.',
          '<strong>Regra dos 5-5-5 (Para Bioestimuladores PLLA):</strong> Se realizou Sculptra, faça massagem firme por 5 minutos, 5 vezes ao dia, por 5 dias.'
        ],
        days7to14: [
          '<strong>Retorno Obrigatório em 14 a 21 Dias:</strong> O efeito da toxina atinge seu pico em 15 dias, quando será avaliada a simetria e necessidade de retoques.'
        ]
      },
      prohibitions: [
        'NÃO deitar nas primeiras 4 horas;',
        'NÃO se expor ao sol direto ou calor intenso de fornos e saunas;',
        'NÃO massagear áreas com preenchedores de ácido hialurônico sem instrução direta;'
      ],
      redAlertSignals: [
        'EMERGÊNCIA VASCULAR MÁXIMA: Dor intensa em queimação, pele pálida/esbranquiçada ou mancha arroxeada reticulada (exige Hialuronidase de resgate imediato nas primeiras 24h);',
        'Dificuldade para abrir os olhos ou visão turva;',
        'Nódulos quentes, avermelhados e dolorosos.'
      ]
    },

    'frenectomia': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS — FRENECTOMIA LABIAL / LINGUAL',
      institutionRef: 'Protocolo de Cirurgia Pediátrica e Periodontal CFO / FOUSP',
      specialty: 'Cirurgia Oral / Periodontia',
      timeline: {
        immediate24h: [
          '<strong>Gelo e Repouso:</strong> Picolés e alimentos frios;',
          '<strong>Evitar Falar Demais:</strong> Repouso da língua e dos lábios nas primeiras 24 horas.'
        ],
        days48to72h: [
          '<strong>Exercícios Fonoaudiológicos:</strong> Se prescritos pela fonoaudióloga, iniciar os movimentos linguais no 3º dia para evitar reancoragem tecidual cicatricial.'
        ],
        days7to14: [
          '<strong>Retirada de Pontos:</strong> Retorno em 7 dias.'
        ]
      },
      prohibitions: [
        'Não bochechar com força;',
        'Não comer alimentos duros ou crocantes.'
      ],
      redAlertSignals: [
        'Sangramento abundante no freio;',
        'Dificuldade respiratória ou deglutição dolorosa.'
      ]
    },

    'sedacao_oxido': {
      title: 'GUIA DE CUIDADOS PÓS-SEDAÇÃO CONSCIENTE INALATÓRIA (N2O/O2)',
      institutionRef: 'Resolução CFO-51/2004 & Diretrizes de Sedação Odontológica',
      specialty: 'Sedação Consciente Inalatória',
      timeline: {
        immediate24h: [
          '<strong>Eliminação Rápida do Gás:</strong> O óxido nitroso é eliminado pelos pulmões nos primeiros 5 a 10 minutos após a oxigenação a 100%.',
          '<strong>Acompanhante:</strong> Pacientes adultos podem estar aptos a dirigir após avaliação clínica de recuperação psicomotora;',
          '<strong>Dieta Leve:</strong> Retomar a alimentação gradualmente com alimentos leves.'
        ],
        days48to72h: ['Seguir as orientações específicas do procedimento odontológico executado sob sedação.'],
        days7to14: ['Retorno de rotina do procedimento clínico.']
      },
      prohibitions: ['Não ingerir bebidas alcoólicas nas primeiras 24 horas pós-sedação.'],
      redAlertSignals: ['Tontura prolongada persistente;', 'Náuseas incoercíveis.']
    },

    'outro': {
      title: 'GUIA OFICIAL DE CUIDADOS PÓS-OPERATÓRIOS & ORIENTAÇÕES AO PACIENTE',
      institutionRef: 'Código de Ética Odontológica (Res. CFO-118/2012) & CDC Art. 14',
      specialty: 'Clínica Odontológica Geral',
      timeline: {
        immediate24h: [
          '<strong>Repouso Relativo:</strong> Evite esforço físico excessivo no dia do procedimento.',
          '<strong>Dieta Apropriada:</strong> Alimentos mornos ou frios, evitando mastigação pesada nas áreas tratadas.',
          '<strong>Medicação Prescrita:</strong> Siga escrupulosamente os horários e dosagens indicadas pelo cirurgião-dentista.'
        ],
        days48to72h: [
          '<strong>Higiene Oral Cuidadosa:</strong> Escovação regular com cerdas macias e uso diário de fio dental.',
          '<strong>Comunicação de Dúvidas:</strong> Entre em contato com a clínica se notar qualquer desconforto inesperado.'
        ],
        days7to14: [
          '<strong>Consultas de Revisão:</strong> Compareça pontualmente às consultas de controle preventivo agendadas.'
        ]
      },
      prohibitions: [
        'Não interrompa o tratamento sem aviso formal ao profissional;',
        'Não se automedique com fármacos não prescritos.'
      ],
      redAlertSignals: [
        'Dor aguda persistente;',
        'Febre inexplicada;',
        'Edema facial progressivo.'
      ]
    }
  };

  /**
   * Determina a lista de procedimentos distintos que devem ter folhas de recomendação separadas.
   */
  function resolveProceduresForPostOp(docData, clinicalContext) {
    const list = [];
    const mainProcKey = (clinicalContext && clinicalContext.procKey) || (docData && docData.procedureKey) || 'outro';
    const text = `${(clinicalContext && clinicalContext.procDiag) || ''} ${(clinicalContext && clinicalContext.dictation) || ''} ${(clinicalContext && clinicalContext.procRegion) || ''}`.toLowerCase();

    // 1. Procedimento principal sempre incluído
    list.push(mainProcKey);

    // 2. Detecção de procedimentos secundários concomitantes:
    // A) Se é Cirurgia + Canal (Composto ou caixas marcadas)
    if ((clinicalContext && (clinicalContext.procNeedsCanal || text.includes('canal') || text.includes('endod'))) && mainProcKey !== 'canal') {
      list.push('canal');
    }

    // B) Se é Implante + Exodontia / Cirurgia
    if ((clinicalContext && (clinicalContext.procNeedsExtraction || text.includes('exodont') || text.includes('extra'))) && mainProcKey === 'implante') {
      if (!list.includes('sisos') && !list.includes('cirurgia_oral')) {
        list.push('cirurgia_oral');
      }
    }

    // C) Se é Cirurgia + Implante
    if ((text.includes('implante') || text.includes('osseointegra')) && (mainProcKey === 'sisos' || mainProcKey === 'cirurgia_oral')) {
      if (!list.includes('implante')) {
        list.push('implante');
      }
    }

    // D) Se é Gengivoplastia + Facetas
    if ((text.includes('faceta') || text.includes('lente')) && mainProcKey === 'gengivoplastia') {
      if (!list.includes('facetas')) list.push('facetas');
    }
    if ((text.includes('gengivoplast') || text.includes('aumento de coroa')) && mainProcKey === 'facetas') {
      if (!list.includes('gengivoplastia')) list.push('gengivoplastia');
    }

    // E) Se é Sedação concomitante
    if ((clinicalContext && clinicalContext.hasSedacao) || text.includes('óxido nitroso') || text.includes('oxido nitroso')) {
      if (mainProcKey !== 'sedacao_oxido') {
        list.push('sedacao_oxido');
      }
    }

    // F) Se é Enxerto Gengival em conjunto com Implante
    if ((clinicalContext && (clinicalContext.procNeedsGraft || text.includes('enxerto conjuntivo') || text.includes('enxerto gengival'))) && mainProcKey === 'implante') {
      if (!list.includes('enxerto_gengival')) list.push('enxerto_gengival');
    }

    // Remover duplicidades
    return Array.from(new Set(list));
  }

  /**
   * Renderiza os documentos pós-operatórios independentes (em páginas separadas).
   */
  function buildPostOpDocumentsHTML(docData, clinicalContext) {
    const procedureKeys = resolveProceduresForPostOp(docData, clinicalContext);
    const sheets = [];

    procedureKeys.forEach((key, index) => {
      const guide = INSTITUTIONAL_POSTOP_GUIDELINES[key] || INSTITUTIONAL_POSTOP_GUIDELINES['outro'];
      const sheetNum = index + 1;
      const totalSheets = procedureKeys.length;

      const pName = (docData && docData.patientName) || 'Paciente';
      const pCpf = (docData && docData.patientCpf) || '---';
      const date = (docData && docData.date) || new Date().toLocaleDateString('pt-BR');
      const docId = (docData && docData.id) || 'DS-XXXX';
      const clinicName = ((clinicalContext && clinicalContext.cfgClinic) || 'CLÍNICA ODONTOLÓGICA').toUpperCase();
      const dentistName = (clinicalContext && clinicalContext.cfgDentist) || 'Dr. Cirurgião-Dentista';
      const dentistCro = (clinicalContext && clinicalContext.cfgCro) || 'CRO';
      const phone = (clinicalContext && clinicalContext.cfgPhone) || 'Telefone não informado';
      const address = (clinicalContext && clinicalContext.cfgAddress) || 'Endereço da Clínica';
      const region = (clinicalContext && clinicalContext.procRegion) || 'Região Operada';

      const sheetHTML = `
      <div class="postop-document-sheet" style="page-break-before: always; margin-top: 30px; padding: 32px 36px; background: #ffffff; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 18px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.55;">
        
        <!-- CABEÇALHO TIMBRADO DA CLÍNICA -->
        <div style="border-bottom: 2px solid #0ea5e9; padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
          <div>
            <h2 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em;">${escapeHTML(clinicName)}</h2>
            <p style="margin: 0; font-size: 11.5px; color: #64748b;">${escapeHTML(dentistName)} — ${escapeHTML(dentistCro)} · ${escapeHTML(address)} · Tel/Plantão: <strong>${escapeHTML(phone)}</strong></p>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div>Emissão: <strong>${escapeHTML(date)}</strong></div>
            <div>Ref.: <strong>${escapeHTML(docId)}-POS-${sheetNum}</strong></div>
            <div style="margin-top: 3px; font-size: 10px; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; font-weight: 700; color: #0284c7;">DOCUMENTO INDEPENDENTE ${sheetNum} de ${totalSheets}</div>
          </div>
        </div>

        <!-- TÍTULO OFICIAL DO GUIA PÓS-OPERATÓRIO -->
        <div style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 3px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em;">${guide.title}</h3>
          <div style="font-size: 11px; opacity: 0.95; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <span><i class="ri-hospital-line"></i> Base Normativa: <strong>${guide.institutionRef}</strong></span>
            <span>Especialidade: <strong>${guide.specialty}</strong></span>
          </div>
        </div>

        <!-- IDENTIFICAÇÃO DO PACIENTE E PROCEDIMENTO -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; font-size: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
          <div><strong>Paciente:</strong> ${escapeHTML(pName)}</div>
          <div><strong>CPF:</strong> ${escapeHTML(pCpf)}</div>
          <div><strong>Região Anatômica:</strong> ${escapeHTML(region)}</div>
          <div><strong>Cirurgião(ã) Responsável:</strong> ${escapeHTML(dentistName)}</div>
        </div>

        <!-- TIMELINE PASSO A PASSO DE RECUPERAÇÃO -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #0f172a; font-size: 13px; font-weight: 800; text-transform: uppercase; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <i class="ri-time-line" style="color: #0284c7;"></i> 1. Cronograma de Cuidados & Condutas Recomendadas
          </h4>

          <!-- 24 Horas -->
          <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; font-size: 12px;">
            <strong style="color: #0369a1; text-transform: uppercase; font-size: 11.5px; display: block; margin-bottom: 5px;">
              ⏱️ Primeiras 24 Horas:
            </strong>
            <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
              ${guide.timeline.immediate24h.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
          </div>

          <!-- 48 a 72 Horas -->
          <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; font-size: 12px;">
            <strong style="color: #334155; text-transform: uppercase; font-size: 11.5px; display: block; margin-bottom: 5px;">
              ⏱️ 48 a 72 Horas:
            </strong>
            <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
              ${guide.timeline.days48to72h.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
          </div>

          <!-- 7 a 14 Dias -->
          <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; font-size: 12px;">
            <strong style="color: #047857; text-transform: uppercase; font-size: 11.5px; display: block; margin-bottom: 5px;">
              ⏱️ Acompanhamento e Retorno:
            </strong>
            <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
              ${guide.timeline.days7to14.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- PROIBIÇÕES EXPRESSAS E CULPA EXCLUSIVA (CDC ART. 14, § 3º, II) -->
        <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; font-size: 12px;">
          <strong style="color: #b45309; text-transform: uppercase; font-size: 11.5px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <i class="ri-alert-fill" style="color: #f59e0b;"></i> 2. O Que Você NÃO DEVE Fazer:
          </strong>
          <ul style="margin: 0; padding-left: 18px; line-height: 1.6; color: #78350f;">
            ${guide.prohibitions.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
          </ul>
        </div>

        <!-- SINAIS DE ALERTA VERMELHO (QUANDO ENTRAR EM CONTATO IMEDIATAMENTE) -->
        <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; font-size: 12px;">
          <strong style="color: #b91c1c; text-transform: uppercase; font-size: 11.5px; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <i class="ri-alarm-warning-fill" style="color: #ef4444;"></i> 3. SINAIS DE ALERTA — Ligue Imediatamente para o Consultório (${escapeHTML(phone)}):
          </strong>
          <ul style="margin: 0; padding-left: 18px; line-height: 1.6; color: #991b1b;">
            ${guide.redAlertSignals.map(s => `<li style="margin-bottom: 4px;">${s}</li>`).join('')}
          </ul>
          <div style="margin-top: 6px; font-size: 11px; color: #7f1d1d; font-style: italic;">
            Em caso de impossibilidade imediata de contato telefônico e urgência respiratória/hemorrágica grave, dirija-se ao Pronto-Socorro hospitalar mais próximo.
          </div>
        </div>

        <!-- TABELA DE HORÁRIOS DE MEDICAMENTOS PRESCRITOS -->
        <div style="margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #f1f5f9; padding: 8px 12px; font-weight: 700; font-size: 11.5px; color: #334155; text-transform: uppercase;">
            <i class="ri-capsule-line" style="color: #0284c7;"></i> 4. Cronograma Farmacológico Prescrito (Preenchimento pelo Profissional):
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 6px 10px; width: 35%;">Medicamento Prescrito</th>
                <th style="padding: 6px 10px; width: 25%;">Posologia / Intervalo</th>
                <th style="padding: 6px 10px; width: 20%;">Duração (Dias)</th>
                <th style="padding: 6px 10px; width: 20%;">Horários Marcados</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 10px; color: #475569;">1. Analgésico / Anti-inflamatório</td>
                <td style="padding: 6px 10px; color: #64748b;">Conforme receita médica anexa</td>
                <td style="padding: 6px 10px; color: #64748b;">Conforme prescrição individual</td>
                <td style="padding: 6px 10px; color: #64748b;">___ / ___ / ___ h</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 10px; color: #475569;">2. Antibiótico (se indicado)</td>
                <td style="padding: 6px 10px; color: #64748b;">Tomar rigorosamente até o fim</td>
                <td style="padding: 6px 10px; color: #64748b;">Conforme prescrição individual</td>
                <td style="padding: 6px 10px; color: #64748b;">___ / ___ / ___ h</td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; color: #475569;">3. Antisséptico Bucal (Clorexidina 0,12%)</td>
                <td style="padding: 6px 10px; color: #64748b;">Somente se prescrito</td>
                <td style="padding: 6px 10px; color: #64748b;">Conforme prescrição individual</td>
                <td style="padding: 6px 10px; color: #64748b;">Conforme receita</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TERMO DE RECEBIMENTO E COMPROMISSO ASSINADO PELO PACIENTE -->
        <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 16px; margin-top: 20px; font-size: 11.5px; line-height: 1.5; color: #475569;">
          <p style="margin: 0 0 14px 0;"><strong>DECLARAÇÃO FORMAL DE RECEBIMENTO E COMPREENSÃO (CDC Art. 6º, III e Art. 14):</strong><br>
          Declaro que recebi em mão própria este <strong>Guia Oficial de Recomendações Pós-Operatórias</strong> para o procedimento de <em>${guide.specialty}</em>, que tive todas as instruções verbalmente explicadas pelo(a) Cirurgião(ã)-Dentista e equipe, compreendi a importância vital do cumprimento dos cuidados, da alimentação prescrita e das proibições para o sucesso do meu tratamento, assumindo o compromisso de observá-las escrupulosamente.</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 28px; text-align: center;">
            <div>
              <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 700; color: #1e293b;">${escapeHTML(pName)}</div>
              <div style="font-size: 10.5px; color: #64748b;">Assinatura do(a) Paciente / Responsável Legal</div>
            </div>
            <div>
              <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 700; color: #1e293b;">${escapeHTML(dentistName)}</div>
              <div style="font-size: 10.5px; color: #64748b;">${escapeHTML(dentistCro)} — Cirurgião(ã)-Dentista Emissor(a)</div>
            </div>
          </div>
        </div>

      </div>`;

      sheets.push(sheetHTML);
    });

    return sheets.join('\n');
  }

  /**
   * Gera texto formatado para envio direto via WhatsApp com as recomendações de todos os procedimentos detectados.
   */
  function generatePostOpWhatsAppText(docData, clinicalContext) {
    const procedureKeys = resolveProceduresForPostOp(docData, clinicalContext);
    const pName = (docData && docData.patientName) || 'Paciente';
    const date = (docData && docData.date) || new Date().toLocaleDateString('pt-BR');
    const docId = (docData && docData.id) || 'DS-XXXX';
    const clinicName = ((clinicalContext && clinicalContext.cfgClinic) || 'Clínica Odontológica').toUpperCase();
    const phone = (clinicalContext && clinicalContext.cfgPhone) || 'Telefone não informado';

    let msg = `*🏥 ${clinicName}*\n`;
    msg += `*GUIA OFICIAL DE RECOMENDAÇÕES PÓS-OPERATÓRIAS*\n`;
    msg += `*Paciente:* ${pName}\n`;
    msg += `*Emissão:* ${date} · *Nº:* ${docId}\n\n`;
    msg += `Olá, ${pName}! Para sua total recuperação, proteção do coágulo/suturas e prevenção de complicações (CDC Art. 14, §3º), siga rigorosamente as orientações abaixo:\n\n`;

    procedureKeys.forEach((key, index) => {
      const guide = INSTITUTIONAL_POSTOP_GUIDELINES[key] || INSTITUTIONAL_POSTOP_GUIDELINES['outro'];
      const prefix = procedureKeys.length > 1 ? `*📌 PROCEDIMENTO ${index + 1}: ${guide.specialty.toUpperCase()}*\n` : `*📌 PROCEDIMENTO: ${guide.specialty.toUpperCase()}*\n`;
      msg += `${prefix}`;
      msg += `_Base Normativa: ${guide.institutionRef}_\n\n`;

      msg += `*⏱️ PRIMEIRAS 24 HORAS (CRÍTICAS):*\n`;
      guide.timeline.immediate24h.forEach(item => {
        const clean = item.replace(/<[^>]*>/g, '');
        msg += `• ${clean}\n`;
      });
      msg += `\n`;

      msg += `*⏱️ 48 A 72 HORAS:*\n`;
      guide.timeline.days48to72h.forEach(item => {
        const clean = item.replace(/<[^>]*>/g, '');
        msg += `• ${clean}\n`;
      });
      msg += `\n`;

      msg += `*🚫 PROIBIÇÕES EXPRESSAS (NÃO FAZER):*\n`;
      guide.prohibitions.forEach(p => {
        const clean = p.replace(/<[^>]*>/g, '');
        msg += `• ${clean}\n`;
      });
      msg += `\n`;

      msg += `*🚨 SINAIS DE ALERTA (AVISE O CONSULTÓRIO):*\n`;
      guide.redAlertSignals.forEach(s => {
        const clean = s.replace(/<[^>]*>/g, '');
        msg += `• ${clean}\n`;
      });
      msg += `\n---------------------------------\n\n`;
    });

    msg += `*📞 Contato / WhatsApp do Consultório:* ${phone}\n`;
    msg += `Em caso de emergência aguda ou ausência de contato, dirija-se ao pronto-atendimento hospitalar.\n\n`;
    msg += `_DentalSafe AI — Documento emitido em conformidade com as diretrizes da FOUSP, UNICAMP, ITI, CFO e CDC._`;

    return msg;
  }

  // Exportação
  const PostOpEngine = {
    INSTITUTIONAL_POSTOP_GUIDELINES,
    resolveProceduresForPostOp,
    buildPostOpDocumentsHTML,
    generatePostOpWhatsAppText
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostOpEngine;
  } else {
    global.DentalSafePostOpEngine = PostOpEngine;
  }
})(typeof window !== 'undefined' ? window : global);
