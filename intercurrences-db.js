/* ==========================================================================
   DENTALSAFE TCLE AI — BASE CLÍNICA DE INTERCORRÊNCIAS & CONDUTAS ("O QUE FAZER")
   Protocolos Transoperatórios, Comunicação, Prescrições e Resguardo Jurídico
   ========================================================================== */

window.DENTAL_INTERCURRENCES_DB = [
  {
    id: "fratura-lima-endo",
    specialty: "Endodontia",
    title: "Fratura Involuntária de Instrumento (Lima de NiTi ou Aço)",
    urgency: "Manejo Transoperatório",
    urgencyClass: "warning",
    triggerAnatomy: "Canais curvos (> 25º), atrésicos, canais calcificados, fadiga metálica cíclica.",
    steps: [
      "1. Mantenha a calma e NÃO force instrumentos: Nunca tente empurrar com outra lima mecânica, sob risco de impactar o fragmento ou perfurar a raiz.",
      "2. Radiografia periapical imediata em 2 angulações (ortorradial e distorradial) para localizar o nível milimétrico do fragmento (cervical, médio ou apical).",
      "3. Avalie a viabilidade técnica pericial:",
      "   • No terço cervical ou médio: Tente remoção sob magnificação (microscópio ou lupa cirúrgica) com pontas ultrassônicas finas e irrigação constante.",
      "   • No terço apical: NÃO desgaste em excesso as paredes dentinárias (evite risco de fratura radicular). A conduta preconizada é a tentativa de BYPASS (ultrapassagem lateral) com limas manuais pré-curvadas C-Pilot ou K-Flexofile #08 e #10 com gel de EDTA 17%.",
      "   • Se o bypass não for viável e o canal estiver limpo: Realize o SEPULTAMENTO biocompatível do fragmento metálico dentro do selamento com cimento biocerâmico / guta-percha.",
      "4. Medicação intracanal com Hidróxido de Cálcio P.A. se a obturação for postergada para a sessão seguinte."
    ],
    communication: "Comunique o paciente com transparência e serenidade ANTES de finalizar a sessão: 'Durante o tratamento de canais curvos e estreitos como o seu, os instrumentos micrométricos altamente flexíveis podem sofrer fadiga do metal. Um pequeno fragmento do instrumento permaneceu selado na ponta da raiz. Isso não impede a continuidade do tratamento nem significa erro, pois o próprio instrumento é biocompatível e desinfetado. Faremos o acompanhamento radiográfico periódico para monitorar a cicatrização óssea.'",
    prescriptionAndExams: [
      "Exames: Radiografia periapical final com cone paralelo e, se houver dúvida, Tomografia Cone-Beam (campo FOV reduzido 4x4 ou 5x5).",
      "Prescrição sintomática: Ibuprofeno 600mg (8 em 8 horas por 3 dias) associado a Dipirona 1g se houver dor moderada."
    ],
    prontuaryRecord: "Durante preparo biomecânico do canal [ex: mésio-vestibular], constatou-se separação involuntária de instrumento flexível no terço apical. Realizada radiografia de controle. Executada manobra de bypass / selamento biocompatível sob abundante irrigação com NaOCl e EDTA 17%. Paciente plenamente esclarecido(a) conforme Art. 9º, VI do CFO. Retorno radiográfico programado para 90 dias.",
    protectiveClause: "CLÁUSULA DE INTERCORRÊNCIA INSTRUMENTAL: O(A) paciente fica formalmente ciente de que, em virtude da curvatura e atresia anatômica dos canais radiculares do dente tratado, ocorreu a retenção de fragmento de instrumento flexível no interior do canal. O instrumento é estéril e biocompatível, permanecendo integrado ao selamento definitivo. Fica acordado o cronograma de acompanhamento radiográfico com consultas em 3, 6 e 12 meses."
  },
  {
    id: "acidente-hipoclorito-endo",
    specialty: "Endodontia",
    title: "Acidente por Extravasamento de Hipoclorito de Sódio (NaOCl)",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Reabsorção apical externa, forame amplo, agulha de irrigação travada na constrição apical com pressão positiva excessiva.",
    steps: [
      "1. INTERROMPA A IRRIGAÇÃO IMEDIATAMENTE ao primeiro relato de dor aguda em queimação.",
      "2. Anestesia local infiltrativa ou bloqueio regional sem vasoconstritor para alívio imediato da dor álgica severa.",
      "3. Lavagem e aspiração profusa do canal com SORO FISIOLÓGICO ESTÉRIL a 0,9% para diluir o agente químico nos tecidos periapicais.",
      "4. Corticoterapia sistêmica imediata: Administrar Dexametasona 4mg a 8mg via oral ou intramuscular imediata para conter o edema e reação inflamatória tecidual.",
      "5. Antibioticoterapia profilática obrigatória: Amoxicilina + Clavulanato 875mg (12/12h por 7 dias) pelo risco de necrose química infectada.",
      "6. Cuidados térmicos orientados ao paciente: Compressas FRIAS nas primeiras 24 horas (para conter edema) e compressas MORNAS após 48 horas (para reabsorção tecidual).",
      "7. Contato diário a cada 12–24h para acompanhar a evolução do edema e tranquilizar o paciente."
    ],
    communication: "Acalme o paciente explicando que a solução de limpeza entrou em contato com os tecidos além da ponta da raiz, causando irritação química temporária. Esclareça que a dor será controlada com medicamentos anti-inflamatórios potentes e que o consultório prestará assistência diária e ininterrupta até a resolução completa do edema.",
    prescriptionAndExams: [
      "Dexametasona 4mg — 2 comprimidos imediatamente; depois 1 comprimido pela manhã por mais 2 dias.",
      "Amoxicilina + Clavulanato 875mg/125mg — 1 comprimido de 12 em 12 horas por 7 dias.",
      "Dipirona Sódica 1g de 6 em 6 horas se dor.",
      "Exame: Radiografia periapical para certificar a integridade do ápice radicular."
    ],
    prontuaryRecord: "Durante irrigação do elemento dentário, paciente relatou dor súbita em queimação com evidência de extravasamento periapical de NaOCl. Interrompida a irrigação imediatamente. Realizada anestesia e irrigação abundante com 40ml de soro fisiológico a 0,9%. Administrada Dexametasona sistêmica no ato. Prescrito antimicrobiano, analgésico e corticoide. Orientado uso de compressas frias e retornos diários.",
    protectiveClause: "TERMO DE NOTIFICAÇÃO E CONDUTA EM ACIDENTE QUÍMICO: O(A) paciente declara ciência de que, devido a características anatômicas do forame apical, ocorreu extravasamento transitório de solução irrigadora desinfetante, tendo recebido assistência médica e odontológica imediata no consultório, com prescrição farmacológica e acompanhamento diário até remissão do edema."
  },
  {
    id: "perfuracao-radicular-endo",
    specialty: "Endodontia",
    title: "Perfuração Radicular ou de Furca Transoperatória",
    urgency: "Urgência Transoperatória",
    urgencyClass: "warning",
    triggerAnatomy: "Câmara pulpar atrésica, presença de nódulos pulpares calcificados, dentes com coroas inclinadas que desorientam o eixo de brocagem.",
    steps: [
      "1. Confirmação diagnóstica: Sangramento repentino no assoalho ou parede do canal com alteração precoce no localizador apical.",
      "2. Irrigação suave com soro fisiológico 0,9%: Evitar NaOCl concentrado diretamente na perfuração para não agredir o ligamento periodontal.",
      "3. Hemostasia: Secagem com cones de papel estéreis e aposição de esponja hemostática de colágeno (Hemospon) no fundo da perfuração se houver sangramento ósseo.",
      "4. Selamento imediato com cimento biocerâmico (MTA ou Biodentine), condensado sob visão direta ou magnificada.",
      "5. Radiografia periapical de controle imediato para checar o selamento e a ausência de extravasamento volumoso.",
      "6. Proteção do selamento com cimento ionomérico de vidro antes de prosseguir com os demais canais."
    ],
    communication: "Explique de forma positiva: 'Durante a localização dos canais microscópicos calcificados, identificamos uma pequena comunicação na parede da raiz com o osso de suporte. Já realizamos o selamento com um cimento biológico de alta tecnologia (MTA) que induz a cicatrização e regeneração natural do osso ao redor da raiz.'",
    prescriptionAndExams: [
      "Exames: Radiografia periapical imediata e Tomografia Cone-Beam se houver dúvida tridimensional.",
      "Prescrição: Nimesulida 100mg (12/12h por 3 dias) ou Dipirona 1g de 6/6h se dor."
    ],
    prontuaryRecord: "Durante acesso do dente, verificou-se comunicação milimétrica na parede radicular. Efetuada hemostasia biológica com soro e selamento hermético imediato com MTA biocerâmico. Concluído curativo de demora. Paciente informado com transparência sobre a conduta executada.",
    protectiveClause: "CLÁUSULA DE SELAMENTO BIOCERÂMICO EM VARIAÇÃO ANATÔMICA: O(A) paciente fica ciente de que, em virtude da calcificação severa da câmara pulpar, foi realizada intervenção com cimento biocerâmico selador (MTA) para vedação de comunicação anatômica radicular, mantendo o prognóstico biológico e exigindo proservação periódica."
  },
  {
    id: "parestesia-cirurgia-siso",
    specialty: "Cirurgia & Sisos",
    title: "Parestesia do Nervo Alveolar Inferior ou Lingual Pós-Exodontia",
    urgency: "Manejo Pós-Operatório",
    urgencyClass: "info",
    triggerAnatomy: "Terceiros molares inferiores inclusos com raízes em íntimo contato, abraçamento ou sobreposição ao canal mandibular.",
    steps: [
      "1. Mapeamento sensitivo no retorno (7º a 10º dia): Teste com ponta romba, gaze fria e escova macia delimitando a área anestesiada no mento, lábio ou língua.",
      "2. Farmacoterapia Regenerativa Precoce:",
      "   • Complexo B neurotrófico (Citoneurin 5000 / Etna) por 30 a 60 dias para regeneração da bainha de mielina.",
      "   • Corticoterapia inicial curta: Prednisona 20mg (tomar 2 comprimidos pela manhã por 3 dias, reduzindo progressivamente) se houver suspeita de compressão inflamatória recente.",
      "3. Laserterapia de Baixa Potência (Infravermelho 808nm):",
      "   • 2 a 3 Joules por ponto, aplicando em 4 a 6 pontos ao longo do trajeto do nervo alveolar ou mentoniano.",
      "   • Sessões 2 a 3 vezes por semana nas primeiras 4 a 8 semanas. A resposta terapêutica é exponencialmente melhor quando iniciada precocemente.",
      "4. Registro fotográfico do mapeamento sensorial e reavaliações mensais."
    ],
    communication: "Transmita calma e competência: 'Como conversamos antes da cirurgia e constava no nosso planejamento, as raízes do dente ficavam encostadas no canal do nervo da sensibilidade. O nervo não foi rompido; ele sofreu uma compressão mecânica pelo inchaço, gerando essa dormência passageira. Iniciaremos hoje o protocolo com laser e suplementos para acelerar o retorno progressivo da sensibilidade normal.'",
    prescriptionAndExams: [
      "Citoneurin 5000 (Vitamina B1, B6, B12) — 1 drágea ao dia por 30 a 60 dias.",
      "Exame: Tomografia Cone-Beam para descartar espícula óssea comprimindo o canal mandibular."
    ],
    prontuaryRecord: "No retorno cirúrgico, paciente relatou hipoestesia no lábio inferior / mento. Realizado teste neurosensorial tátil e térmico. Constatada neuropraxia por proximidade anatômica prévia comprovada em TC. Iniciada laserterapia infravermelha (808nm) e prescrito complexo B neurotrófico. Paciente acolhido com retornos semanais agendados.",
    protectiveClause: "ADITIVO DE ACOMPANHAMENTO NEUROSENSORIAL (PARESTESIA): O(A) paciente declara ciência da persistência de dormência temporária na região do lábio inferior/mento decorrente do íntimo contato das raízes com o canal mandibular. Foi iniciado o plano terapêutico com laserterapia e suplementação, mantendo as consultas periódicas de retorno sem custo adicional de procedimento."
  },
  {
    id: "comunicacao-buco-sinusal",
    specialty: "Cirurgia & Sisos",
    title: "Comunicação Buco-Sinusal (CBS) Acidental Transoperatória",
    urgency: "Urgência Transoperatória",
    urgencyClass: "danger",
    triggerAnatomy: "Molares superiores com raízes projetadas para o interior do seio maxilar ou acentuada pneumatização sinusal.",
    steps: [
      "1. Confirmação imediata: Teste de Valsalva suave (paciente tenta expirar suavemente pelo nariz com narinas ocluídas; observar saída de bolhas no alvéolo). NUNCA curetar o fundo do seio!",
      "2. Conduta cirúrgica conforme a dimensão:",
      "   • Perfuração pequena (< 2mm): Preencher o alvéolo com esponja hemostática de colágeno (Hemospon) e suturar firmemente em '8' ou 'X' hermético com fio Seda 3-0 ou Nylon 4-0.",
      "   • Perfuração média a grande (> 3mm): Confeccionar Retalho Vestibular Avançado (Técnica de Rehrmann) com incisões relaxantes e liberação do periósteo basal para cobrir 100% do alvéolo sem tensão tecidual, ou utilizar retalho pediculado da Bola Adiposa de Bichat.",
      "3. Recomendações Pós-Operatórias Mandatórias ao Paciente:",
      "   • PROIBIDO terminantemente assoar o nariz por 14 dias;",
      "   • Espirrar sempre de boca aberta para não gerar pressão positiva no seio maxilar;",
      "   • Não usar canudos para ingerir líquidos (evitar pressão negativa);",
      "   • Repouso estrito sem exercícios físicos."
    ],
    communication: "Comunique com clareza: 'Em razão da proximidade natural das raízes do seu dente com o seio maxilar, abriu-se uma pequena comunicação anatômica. Já fizemos o fechamento cirúrgico com retalho e pontos herméticos. Para que o tecido cicatrize perfeitamente, você precisará seguir à risca a orientação de não assoar o nariz nos próximos 14 dias e tomar os medicamentos prescritos.'",
    prescriptionAndExams: [
      "Amoxicilina + Clavulanato 875mg/125mg — 1 comprimido de 12 em 12 horas por 7 a 10 dias (antibioticoterapia obrigatória para prevenir sinusite bacteriana aguda).",
      "Descongestionante Nasal Tópico (Cloridrato de Oximetazolina 0,05%) — 2 gotas em cada narina de 12/12h por no máximo 5 dias."
    ],
    prontuaryRecord: "Durante exodontia do dente, verificou-se comunicação buco-sinusal pela íntima relação radicular com o assoalho antral. Teste de Valsalva positivo. Confeccionado retalho vestibular com relaxantes periosteais para fechamento primário sem tensão, com sutura em fio Nylon 4-0. Prescrita medicação profilática de sinusite e entregues orientações por escrito com proibição de assoar o nariz.",
    protectiveClause: "CLÁUSULA DE FECHAMENTO CIRÚRGICO DE COMUNICAÇÃO SINUSAL: O(A) paciente atesta que foi informado(a) do surgimento de comunicação buco-sinusal decorrente da pneumatização e proximidade anatômica do dente com o seio maxilar. O fechamento primário foi executado pelo cirurgião e o(a) paciente compromete-se a cumprir rigorosamente as normas pós-operatórias de não assoar o nariz e comparecer para remoção dos pontos após 14 dias."
  },
  {
    id: "fratura-deslocamento-raiz-seio",
    specialty: "Cirurgia & Sisos",
    title: "Fratura de Ápice com Deslocamento para o Seio Maxilar",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Raízes finas e dilaceradas em ápices contíguos à mucosa sinusal; força excessiva em sentido apical com alavancas retas.",
    steps: [
      "1. PARE A MANOBRA IMEDIATAMENTE: NUNCA curete às cegas o interior do seio maxilar nem force instrumentos para dentro da cavidade.",
      "2. Aspiração suave: Tente aspirar suavemente com cânula fina cirúrgica; fragmentos diminutos podem ser resgatados se estiverem na abertura.",
      "3. Radiografia periapical e Tomografia Computadorizada Cone-Beam para localização espacial exata do fragmento.",
      "4. Conduta clínica fundamentada:",
      "   • Se fragmento < 2mm, assintomático e sem infecção prévia: Pode ser mantido sob controle sem procedimentos invasivos desnecessários.",
      "   • Se fragmento > 3mm ou com contaminação prévia: Fechamento do alvéolo e agendamento de remoção cirúrgica por acesso Caldwell-Luc ou endoscopia sinusal por bucomaxilofacial.",
      "5. Sutura hermética do alvéolo para proteger o seio de contaminação bucal."
    ],
    communication: "Comunique com honestidade profissional: 'Durante a extração, um pequeno fragmento da ponta da raiz se desprendeu e deslocou-se para a cavidade do seio maxilar em razão da fina espessura óssea local. Fechamos a área com pontos e realizaremos uma tomografia para vermos a posição exata e definirmos a conduta mais conservadora e segura para sua saúde.'",
    prescriptionAndExams: [
      "Tomografia Computadorizada Cone-Beam de face com cortes coronais e sagitais do seio maxilar.",
      "Amoxicilina + Clavulanato 875mg (12/12h por 7 dias) + Corticoide sistêmico."
    ],
    prontuaryRecord: "Durante luxação do dente, ápice radicular sofreu fratura e deslocamento para a cavidade do seio maxilar. Interrompida manipulação mecânica para preservação das estruturas antrópicas. Alvéolo suturado com fio hermético. Solicitada TC Cone-Beam e emitido encaminhamento cirúrgico especializado.",
    protectiveClause: "TERMO DE CIÊNCIA DE DESLOCAMENTO DE FRAGMENTO ANATÔMICO: O(A) paciente declara ciência de que um fragmento radicular deslocou-se acidentalmente para o seio maxilar em decorrência da fragilidade óssea local, estando ciente da necessidade do exame tomográfico e do plano de suporte cirúrgico programado."
  },
  {
    id: "alveolite-seca-pos-extracao",
    specialty: "Cirurgia & Sisos",
    title: "Alveolite Seca (Fibrinolítica) Pós-Exodontia",
    urgency: "Manejo Pós-Operatório",
    urgencyClass: "warning",
    triggerAnatomy: "Perda prematura do coágulo sanguíneo entre o 2º e 4º dia pós-operatório. Agravada por fumo, bochechos vigorosos e mandíbula densa.",
    steps: [
      "1. Diagnóstico clínico característico: Dor pulsátil intensa irradiada para a face e ouvido, halitose fétida e alvéolo vazio com osso exposto.",
      "2. Anestesia local infiltrativa ou troncular para alívio imediato antes da intervenção.",
      "3. Irrigação abundante e suave do alvéolo com Soro Fisiológico 0,9% levemente aquecido ou Gluconato de Clorexidina a 0,12% para desbridamento de restos alimentares.",
      "4. REGRA DE OURO PERICIAL: NUNCA CURETE O ALVÉOLO AGRESSIVAMENTE! O osso exposto já está sensível; curetagem forçada gera dor insuportável e amplia a osteíte.",
      "5. Aplicação de curativo alveolar sedativo: Pasta sedativa com Eugenol e Iodoforme (Alveogyl) ou gaze iodoformada frouxa, trocada a cada 48 horas.",
      "6. Analgesia potente sistêmica e acompanhamento a cada 48 horas até reepitelização."
    ],
    communication: "Explique ao paciente: 'O coágulo de sangue que protegia o osso foi perdido precocemente — condição chamada de alveolite. O osso ficou exposto, gerando essa dor forte. Acabamos de lavar e aplicar um curativo calmante especial que aliviará a dor rapidamente. Você precisará vir a cada dois dias para trocar o curativo até o tecido cicatrizar por completo.'",
    prescriptionAndExams: [
      "Cetoprofeno 100mg (1 comprimido de 12/12h por 3 dias) associado a Dipirona 1g de 6/6h.",
      "Bochechos suaves com Gluconato de Clorexidina 0,12% após 48h da aplicação do curativo."
    ],
    prontuaryRecord: "Paciente compareceu com queixa álgica intensa no 3º DPO. Verificado alvéolo desprovido de coágulo e com exposição óssea (alveolite seca). Efetuada anestesia e irrigação profusa com soro 0,9%, seguida de inserção suave de pasta de Alveogyl sem curetagem agressiva. Alívio sintomático obtido. Retorno em 48h agendado.",
    protectiveClause: "REGISTRO DE MANEJO DE ALVEOLITE PÓS-OPERATÓRIA: O(A) paciente atesta o atendimento de urgência para tratamento de osteíte alveolar pós-exodontia decorrente de desprendimento do coágulo biológico, tendo recebido curativo calmante específico e orientações sobre cuidados de higiene."
  },
  {
    id: "hemorragia-pos-operatoria",
    specialty: "Cirurgia & Sisos",
    title: "Hemorragia Persistente Intraoperatória ou Pós-Operatória",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Lesão de vasos ósseos nutricionais, laceração de vasos palatinos/linguais, hipertensão aguda, uso de anticoagulantes (AAS, Xarelto, Marevan).",
    steps: [
      "1. Identificação da fonte: Diferenciar sangramento capilar em lençol (gengival), arterial pulsátil ou ósseo difuso.",
      "2. Compressão mecânica contínua: Rolete de gaze estéril com mordida firme e ininterrupta por 30 a 45 minutos.",
      "3. Se o sangramento persistir:",
      "   • Anestesia local com vasoconstritor (Lidocaína 2% com Epinefrina 1:100.000) infiltrada localmente para hemostasia química;",
      "   • Aspiração cirúrgica de coágulos frouxos no alvéolo;",
      "   • Inserção de hemostático de colágeno (Hemospon) embebido em Ácido Tranexâmico (Transamin);",
      "   • Sutura firme em 'X' ou ponto de Wolff aproximando bem as bordas gengivais;",
      "   • Se for sangramento de canal ósseo: Esmagar a trabécula óssea com brunidor estéril para colabar o microvaso.",
      "4. Aferição da pressão arterial: Se a PA estiver elevada (> 160/100 mmHg), controle clínico da PA é essencial para cessar o fluxo."
    ],
    communication: "Mantenha o paciente calmo: 'A saliva dilui o sangue e dá a impressão de que há muito mais sangramento do que na realidade. Estamos aplicando materiais hemostáticos que ativam a coagulação imediatamente e o quadro logo estará sob controle.'",
    prescriptionAndExams: [
      "Ácido Tranexâmico 250mg — Uso tópico (gaze umedecida na ampola) ou via oral (1 a 2 comprimidos a cada 8 horas por 2 dias).",
      "Compressa de gelo externa nas primeiras horas."
    ],
    prontuaryRecord: "Paciente apresentou sangramento persistente no alvéolo pós-cirúrgico. Aferida PA (140x90 mmHg). Realizada hemostasia mecânica, aplicação de esponja hemostática associada a ácido tranexâmico tópico e complementação de sutura em X com fio de seda. Hemostasia completa obtida após 20 minutos de observação clínica.",
    protectiveClause: "CLÁUSULA DE INTERVENÇÃO HEMOSTÁTICA DE URGÊNCIA: Fica registrado que o paciente recebeu manobras mecânicas e farmacológicas de hemostasia de emergência para contenção de sangramento atípico pós-cirúrgico, tendo recebido alta sob estabilidade hemodinâmica comprovada."
  },
  {
    id: "isquemia-oclusao-vascular-hof",
    specialty: "Harmonização HOF",
    title: "Oclusão Vascular Aguda e Isquemia por Ácido Hialurônico",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Injeção intravascular ou compressão extrínseca da Artéria Facial, Labiais, Angular ou Nasal Dorsal.",
    steps: [
      "1. RECONHECIMENTO IMEDIATO DOS SINAIS DE ISQUEMIA:",
      "   • Branqueamento cutâneo imediato (palidez incomum no território vascular);",
      "   • Dor desproporcional e intensa em queimação durante ou após a injeção;",
      "   • Tempo de enchimento capilar lentificado (> 2 segundos após compressão digital);",
      "   • Livedo reticular (aspecto arroxeado marmóreo da pele nas primeiras horas).",
      "2. PROTOCOLO DE ALTA DOSAGEM DE HIALURONIDASE IMEDIATO (MANDATÓRIO):",
      "   • NÃO ESPERE! A cada hora perdida aumenta o risco de necrose tecidual irreversível.",
      "   • Inundar toda a área isquêmica e trajeto da artéria com Hialuronidase: Injetar 500 a 1.500 UI de Hialuronidase em múltiplos pontos e profundidades.",
      "   • Repetir a aplicação a cada 60 minutos até retorno da perfusão e tempo de enchimento capilar < 2 segundos.",
      "3. Manobras complementares:",
      "   • Massagem vigorosa contínua na região para dispersão do produto;",
      "   • Compressas mornas locais para promover vasodilatação periférica;",
      "   • Sildenafil 50mg ou Tadalafila 20mg (vasodilatador oral) + Dexametasona 4mg (anti-inflamatório)."
    ],
    communication: "Comunique com serenidade técnica: 'Identificamos que o produto preenchedor comprimiu uma pequena artéria sob a pele, reduzindo a circulação momentânea. Aplicaremos agora uma enzima neutralizadora (hialuronidase) que dissolve o produto imediatamente e restabelece a circulação sanguínea normal. Ficaremos juntos acompanhando a recuperação passo a passo.'",
    prescriptionAndExams: [
      "Hialuronidase — Ampolas de 2.000 UI para aplicação imediata no consultório.",
      "Ciprofloxacino 500mg (12/12h por 5 dias) para profilaxia de infecção em tecido hipóxico."
    ],
    prontuaryRecord: "Durante aplicação de ácido hialurônico em região labial/nasal, paciente apresentou branqueamento tecidual e dor, compatível com oclusão vascular. Interrompida a aplicação imediatamente. Iniciado protocolo de alta dose com 1.500 UI de Hialuronidase em múltiplos pontos, massagem térmica e vasodilatador. Observada melhora progressiva da perfusão. Paciente sob monitoramento contínuo.",
    protectiveClause: "ADITIVO DE EMERGÊNCIA VASCULAR REVERTIDA EM HARMONIZAÇÃO: O(A) paciente atesta que, diante de sinal imprevisto de estase circulatória transitória após preenchimento dérmico, o profissional executou imediatamente a dissolução enzimática com Hialuronidase em conformidade com os consensos de segurança estética, recebendo orientações e acompanhamento irrestrito."
  },
  {
    id: "amaurose-cegueira-hof",
    specialty: "Harmonização HOF",
    title: "Risco de Amaurose (Perda Visual) por Embolia Retrógrada em HOF",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Injeções em glabela, dorso ou ponta nasal com pressão retrógrada para a artéria oftálmica.",
    steps: [
      "1. INTERRUPÇÃO IMEDIATA diante de qualquer queixa súbita de perda visual, visão turva, ptose palpebral ou dor ocular insuportável.",
      "2. URGÊNCIA HOSPITALAR ABSOLUTA: A janela de viabilidade retiniana é de 60 a 90 minutos para evitar cegueira definitiva!",
      "3. Acionamento do SAMU (192) ou transporte de emergência com aviso prévio ao pronto-socorro oftalmológico mais próximo.",
      "4. Medidas imediatas no consultório enquanto o transporte chega:",
      "   • Oxigenoterapia a 100% sob máscara de alto fluxo para maximizar oxigenação;",
      "   • Colírio hipotensor ocular (Timolol 0,5% — 1 gota no olho afetado) para reduzir pressão intraocular e favorecer deslocamento do êmbolo;",
      "   • Injeção de Hialuronidase (1.500 UI) no ponto de entrada e trajeto vascular facial;",
      "   • Massagem ocular suave com o paciente deitado."
    ],
    communication: "Aja com rapidez e autoridade clínica sem histeria: 'Identificamos uma alteração súbita na irrigação do nervo óptico. Vamos encaminhá-lo imediatamente ao centro cirúrgico oftalmológico com nossa equipe de retaguarda para reversão imediata com especialistas.'",
    prescriptionAndExams: [
      "Encaminhamento formal de emergência com ficha de atendimento e quantidade de hialuronidase administrada.",
      "Oxigênio medicinal a 100% contínuo."
    ],
    prontuaryRecord: "Durante procedimento na região nasal/glabelar, paciente manifestou alteração súbita na acuidade visual. Suspenso ato clínico imediatamente. Iniciada oxigenoterapia 100%, instilado colírio de timolol e injetada hialuronidase no sítio de punção. Acionado resgate médico e encaminhamento prioritário para serviço de oftalmologia hospitalar.",
    protectiveClause: "NOTIFICAÇÃO DE EMERGÊNCIA OFTALMOLÓGICA EM HOF: Registra-se que diante de relato agudo de queixa visual, o profissional interrompeu imediatamente o ato, prestou os primeiros socorros de suporte à vida e providenciou remoção de urgência ao serviço especializado de emergência oftalmológica."
  },
  {
    id: "ptose-palpebral-botox",
    specialty: "Harmonização HOF",
    title: "Ptose Palpebral por Difusão de Toxina Botulínica",
    urgency: "Intercorrência Pós-Procedimento",
    urgencyClass: "warning",
    triggerAnatomy: "Injeção em corrugadores ou fronte muito próxima ao rebordo orbitário superior com difusão da neurotoxina para o músculo levantador da pálpebra superior.",
    steps: [
      "1. AVALIAÇÃO E ORIENTAÇÃO AO PACIENTE: A ptose palpebral é temporária e autolimitada, com regressão gradual conforme a neurotoxina perde potência (média de 4 a 8 semanas).",
      "2. PRESCRIÇÃO IMEDIATA DE COLÍRIO AGONISTA ALFA-ADRENÉRGICO: Instilar 1 a 2 gotas de Tartarato de Brimonidina 0,2% ou Apraclonidina 0,5% no olho afetado, 3 vezes ao dia.",
      "   • Mecanismo de ação: Estimula o Músculo de Müller (musculatura lisa involuntária da pálpebra), elevando a margem palpebral superior em 1 a 2 mm.",
      "3. Laserterapia / Fotobiomodulação (660nm) no músculo levantador da pálpebra para acelerar a restauração da placa motora neural.",
      "4. Radiofrequência ou calor local controlado na fronte para acelerar a metabolização local da neurotoxina."
    ],
    communication: "Esclareça com serenidade: 'Houve uma acomodação temporária de uma pequena fração da toxina sobre o músculo que sustenta a pálpebra. Essa alteração é 100% reversível e passageira. Iniciaremos hoje um colírio específico que eleva a pálpebra enquanto o efeito do produto se dissipa naturalmente.'",
    prescriptionAndExams: [
      "Colírio de Tartarato de Brimonidina 0,2% — Frasco com 5mL (Instilar 1 gota no olho afetado de 8 em 8 horas).",
      "Sessões de Laserterapia de Baixa Intensidade 2x por semana."
    ],
    prontuaryRecord: "Paciente retornou apresentando queda leve da margem palpebral superior esquerda (ptose de 1,5 mm), cerca de 10 dias após injeção de toxina botulínica em glabela. Prescrito colírio de brimonidina 0,2% 3x/dia e iniciada laserterapia 660nm. Paciente orientado sobre o caráter estritamente transitório e reversível do quadro.",
    protectiveClause: "TERMO DE CONDUTA E REVERSÃO DE PTOSE PALPEBRAL: O(A) paciente registra ciência de que a ptose palpebral é resposta muscular transitória e plenamente reversível, recebendo a prescrição oftálmica de suporte e acompanhamento clínico semanal até a completa estabilização da fenda palpebral."
  },
  {
    id: "efeito-tyndall-ah",
    specialty: "Harmonização HOF",
    title: "Efeito Tyndall e Hipercorreção Superficial por Ácido Hialurônico",
    urgency: "Complicação Estética",
    urgencyClass: "info",
    triggerAnatomy: "Injeção de ácido hialurônico em plano dérmico excessivamente superficial ou hipercorreção em área de pele fina (olheiras/sulco nasojugal e rugas periorais).",
    steps: [
      "1. DIAGNÓSTICO DIFERENCIAL: Visualização de coloração azulada/acinzentada translúcida e nódulos sob a pele pela dispersão da luz através do gel de AH.",
      "2. CONDUTA MECÂNICA PRECOCE (Se identificado nas primeiras 48h): Punção asséptica com agulha 18G ou lâmina 11 e expressão mecânica suave do excesso de gel.",
      "3. DISSOLUÇÃO ENZIMÁTICA EM MICRODOSES DE HIALURONIDASE: Se consolidado após 7 dias, aplicar microdoses de 10 a 30 UI de Hialuronidase diluída exatamente no centro da pápula azulada.",
      "4. Avaliação após 48 a 72 horas para verificar se houve resolução completa sem afundamento tecidual indesejado."
    ],
    communication: "Oriente: 'Identificamos que uma pequena quantidade do gel preenchedor acomodou-se mais superficialmente na pele fina das olheiras, refletindo a luz de forma azulada. Aplicaremos uma microdose da enzima dissolvente que corrigirá esse excesso em 24 a 48 horas.'",
    prescriptionAndExams: [
      "Hialuronidase — Aplicação de 15 a 30 UI no consultório com agulha 30G.",
      "Compressas frias nas primeiras 12h."
    ],
    prontuaryRecord: "Paciente apresentou nódulo superficial de coloração azulada compatível com Efeito Tyndall em sulco nasojugal direito após preenchimento de olheiras. Realizada punção local e infiltração de 20 UI de Hialuronidase sob assepsia. Quadro com remissão do excesso de gel e restauração do relevo cutâneo.",
    protectiveClause: "REGISTRO DE AJUSTE ENZIMÁTICO EM PREENCHIMENTO: O(A) paciente atesta que, diante de sobreposição superficial de produto preenchedor, o cirurgião-dentista realizou a microdissolução enzimática planejada, restabelecendo a uniformidade do tecido cutâneo."
  },
  {
    id: "nodulos-tardios-bioestimulador",
    specialty: "Harmonização HOF",
    title: "Nódulos Não-Inflamatórios Tardios por Bioestimulador de Colágeno (PLLA / CaHA)",
    urgency: "Complicação Subaguda / Tardia",
    urgencyClass: "warning",
    triggerAnatomy: "Hiperconcentração de partículas de Ácido Poli-L-Lático ou Hidroxiapatita de Cálcio por falha de homogeneização ou ausência de massagens vigorosas pós-operatórias pelo paciente.",
    steps: [
      "1. AVALIAÇÃO: Palpação de nódulos firmes, indolores e não-eritematosos semanas a meses após a sessão.",
      "2. PROTOCOLO DE HIDRODISSECÇÃO: Infiltração intralesional de 0,5 a 1,0 mL de Soro Fisiológico 0,9% estéril associado a anestésico local sem vasoconstritor, seguido de massagem mecânica vigorosa com rolete ou pinçamento digital.",
      "3. CORTICOTERAPIA INTRALESIONAL (Para nódulos fibróticos resistentes): Triancinolona (Triancil) 10 a 20 mg/mL diluída (1:2 em lidocaína), aplicando microgotas (0,05 mL) estritamente dentro do nódulo para evitar atrofia dérmica periférica.",
      "4. Reavaliação a cada 3 a 4 semanas até remissão do nódulo."
    ],
    communication: "Esclareça: 'O bioestimulador gerou uma concentração pontual de colágeno nessa região. Faremos uma hidratação e dispersão mecânica das partículas associada a massagem vigorosa para dissolver esse acúmulo.'",
    prescriptionAndExams: [
      "Soro Fisiológico 0,9% para hidrodissecção.",
      "Triancinolona acetonida 20mg/mL (para nódulos refratários após 60 dias)."
    ],
    prontuaryRecord: "Paciente compareceu com presença de nódulo subcutâneo palpável em terço médio da face 45 dias após aplicação de bioestimulador de colágeno. Constatada baixa adesão à rotina de massagens pós-operatórias recomendada. Realizada hidrodissecção com 1 mL de soro e anestésico com massagem vigorosa e orientação reforçada.",
    protectiveClause: "TERMO DE TRATAMENTO DE ACÚMULO NODULAR EM BIOESTIMULADOR: Registra-se que, diante de acúmulo localizado de bioestimulador, foi instituído protocolo de dispersão e massagem, cientificando o paciente sobre a indispensabilidade de manter a rotina de massagens prescrita conforme o Art. 14, § 3º, II do CDC."
  },
  {
    id: "extrusao-infeccao-fios-pdo",
    specialty: "Harmonização HOF",
    title: "Extrusão de Ponta ou Infecção em Fios de Sustentação PDO",
    urgency: "Urgência Pós-Procedimento",
    urgencyClass: "warning",
    triggerAnatomy: "Ponta de fio espiculado posicionada muito superficialmente na derme ou orifício de entrada/saída tracionado por mímica facial exagerada precoce.",
    steps: [
      "1. AVALIAÇÃO: Inspeção visual de espícula ou ponta do fio exteriorizada através da pele ou mucosa oral, com ou sem eritema circundante.",
      "2. TRIMMING (CORTE ASSÉPTICO): Sob anestesia infiltrativa local e antissepsia rigorosa com clorexidina 2%, tracionar levemente a extremidade exposta com pinça hemostática estéril e cortar rente abaixo da derme com tesoura de íris delicada.",
      "3. LIBERAÇÃO DA PELE: Massagear suavemente a pele para que a ponta do fio recolha-se ao plano subcutâneo profundo.",
      "4. EM CASO DE INFECÇÃO OU BIOFILME: Se houver secreção purulenta ou hiperemia extensa ao longo do trajeto, o fio deve ser removido por tração suave e prescrita antibioticoterapia direcionada (Ciprofloxacino 500mg ou Amoxicilina com Clavulanato 875mg por 7 a 10 dias)."
    ],
    communication: "Oriente: 'Uma pontinha milimétrica do fio de sustentação ficou ligeiramente aparente devido à movimentação do músculo facial. Faremos um corte asséptico imediato sob anestesia local, o que resolverá o incômodo sem comprometer a tração do procedimento.'",
    prescriptionAndExams: [
      "Ciprofloxacino 500mg (12/12h por 7 dias) se houver sinal infeccioso local.",
      "Pomada de Neomicina + Bacitracina para orifício de corte por 5 dias."
    ],
    prontuaryRecord: "Paciente retornou no 12º dia pós-operatório de fios de sustentação PDO espiculados com queixa de ponta de fio palpável e visível no sulco pré-auricular. Realizado trimming cirúrgico da ponta sob anestesia com lidocaína 2% e antissepsia. Orifício limpo sem secreção purulenta. Paciente orientado sobre cuidados de higiene e repouso facial.",
    protectiveClause: "ADITIVO DE AJUSTE ASSÉPTICO DE FIOS FACIAIS: O(A) paciente atesta que compareceu para ajuste de extremidade de fio facial de sustentação, procedimento executado com rigor asséptico e êxito técnico, mantendo as orientações pós-operatórias de restrição mastigatória e mímica ampla."
  },
  {
    id: "perfuracao-schneider-sinus",
    specialty: "Implantodontia",
    title: "Perfuração da Membrana de Schneider no Levantamento de Seio (Sinus Lift)",
    urgency: "Urgência Transoperatória",
    urgencyClass: "warning",
    triggerAnatomy: "Mucosa sinusal fina (< 1mm), septos ósseos intrassinusais de Underwood, sinusite crônica subclínica.",
    steps: [
      "1. Identificação: Observar fenda na mucosa sinusal com ar borbulhando ou sangue na cavidade.",
      "2. Avaliação da extensão da perfuração:",
      "   • Microrruptura (< 5mm): Mantenha o procedimento! Dobre a mucosa sobre si mesma ou posicione uma Membrana de Colágeno Reabsorvível (Bio-Gide, Lumina-Coat) selando 100% da fenda antes de depositar o enxerto particulado.",
      "   • Ruptura extensa (> 5mm): ABORTE O ENXERTO ÓSSEO! Se depositar biomaterial sob ruptura extensa, os grânulos migrarão para o interior do seio gerando sinusite crônica e perda de todo o enxerto.",
      "3. Conduta para ruptura extensa: Remova todo resquício de biomaterial, feche a janela óssea com membrana de colágeno, suture o retalho mucoso sem tensão e aguarde 8 a 12 semanas para cicatrização da mucosa antes de reintervir.",
      "4. Prescrição de antibioticoterapia profilática para evitar sinusite bacteriana secundária."
    ],
    communication: "Explique a conduta preventiva ao paciente: 'A fina membrana que reveste o seio maxilar apresentou uma pequena abertura durante o afastamento. Para garantir a segurança total e impedir infecções, aplicamos uma membrana de colágeno biológico protetora que veda o local perfeitamente antes do enxerto.'",
    prescriptionAndExams: [
      "Amoxicilina + Clavulanato 875mg (12/12h por 7 dias) — profilaxia sinusal.",
      "Descongestionante nasal e orientação rigorosa de NÃO assoar o nariz por 14 dias."
    ],
    prontuaryRecord: "Durante osteotomia de janela lateral e descolamento da mucosa sinusal, verificou-se descontinuidade milimétrica da membrana de Schneider decorrente de septo ósseo anatômico. Realizado selamento anatômico com membrana de colágeno reabsorvível e aposição do biomaterial ósseo sob estabilidade. Sutura hermética executada.",
    protectiveClause: "CLÁUSULA DE INTERCORRÊNCIA EM LEVANTAMENTO DE SEIO: O(A) paciente atesta que foi esclarecido(a) sobre a ocorrência de microrruptura na membrana de revestimento do seio maxilar decorrente de variação anatômica óssea, tendo o cirurgião executado o protocolo de selamento biológico com membrana protetora em consonância com as normas da Implantodontia."
  },
  {
    id: "perda-estabilidade-implante",
    specialty: "Implantodontia",
    title: "Ausência de Estabilidade Primária do Implante (< 15 N.cm no Travamento)",
    urgency: "Urgência Transoperatória",
    urgencyClass: "info",
    triggerAnatomy: "Osso tipo IV (medular mole / de baixa densidade em maxila posterior), subfresagem inadequada.",
    steps: [
      "1. Confirmação do torque: Ao instalar o implante, o torquímetro cirúrgico indica torque inferior a 15 N.cm ou o implante gira em falso no sítio cirúrgico.",
      "2. NUNCA faça carga imediata em implante sem estabilidade primária (risco severo de falha biológica por micromovimentação).",
      "3. Condutas clínicas possíveis:",
      "   • Opção A: Substitua imediatamente por um implante de DIÂMETRO MAIOR (ex: trocar implante de 3.75mm por 4.3mm ou 5.0mm) para obter travamento bicortical.",
      "   • Opção B: Aprofunde o sítio em 1 a 2mm (se houver margem de segurança anatômica com o NAI ou seio maxilar) para ancorar o ápice em osso nativo apical mais denso.",
      "   • Opção C: Se não houver osso para ancoragem: Remova o implante, realize enxerto com biomaterial particulado, cubra com membrana e feche por primeira intenção, reprogramando a instalação do implante para 4 a 6 meses.",
      "4. Se o implante for mantido com torque entre 15 e 25 N.cm: Instale parafuso de cobertura (cicatrização submersa) e NÃO instale cicatrizador transmucoso."
    ],
    communication: "Comunique a decisão técnica: 'A densidade do seu osso nesta região é naturalmente mais porosa (como uma esponja macia). Para garantir que o implante fique totalmente firme e tenha durabilidade biológica, optamos por utilizar um diâmetro adaptado / deixar o implante submerso cicatrizando com segurança por alguns meses.'",
    prescriptionAndExams: [
      "Exame: Radiografia periapical de conferência do assentamento e paralelismo do implante.",
      "Prescrição analgésica habitual de cirurgia."
    ],
    prontuaryRecord: "Durante a inserção do implante no sítio cirúrgico do elemento, constatou-se baixa densidade óssea trabecular (osso Tipo IV) com torque de inserção reduzido. Adotada conduta técnica de substituição por plataforma cônica com ancoragem apical / cicatrização submersa protegida sem carga oclusal precoce.",
    protectiveClause: "CLÁUSULA DE ADAPTAÇÃO TÉCNICA EM DENSIDADE ÓSSEA BAIXA: O(A) paciente fica ciente de que, em razão da densidade óssea trabecular individual verificada no momento da cirurgia, o protocolo de osseointegração foi adaptado para cicatrização biológica protegida e sem carga mastigatória, visando assegurar a formação da interface óssea."
  },
  {
    id: "enfisema-subcutaneo-ar",
    specialty: "Cirurgia & Sisos",
    title: "Enfisema Subcutâneo Facial por Ar Comprimido de Alta Rotação",
    urgency: "Urgência Transoperatória",
    urgencyClass: "danger",
    triggerAnatomy: "Uso indevido de caneta de alta rotação com escape de ar direcionado para o alvéolo durante odontossecção profunda em terceiros molares.",
    steps: [
      "1. Diagnóstico imediato: Edema facial súbito durante o corte ósseo, com crepitação tátil característica (sensação de bolhas estalando ao palpar a pele).",
      "2. INTERROMPA O PROCEDIMENTO IMEDIATAMENTE e desligue a turbina.",
      "3. Avalie vias aéreas e extensão cervical: Palpe a região cervical para descartar extensão para espaços fasciais do pescoço ou mediastino. Se houver dispneia: URGÊNCIA HOSPITALAR IMEDIATA!",
      "4. Antibioticoterapia profilática imediata obrigatória: O ar comprimido da caneta não é estéril e carrega bactérias bucais para o tecido subcutâneo profundo. Prescrever Amoxicilina + Clavulanato 875mg (12/12h por 7 dias).",
      "5. Não comprimir o edema para não forçar o ar para planos mais profundos.",
      "6. Tranquilizar o paciente: O ar será reabsorvido espontaneamente pelo organismo em 7 a 10 dias."
    ],
    communication: "Acalme o paciente com clareza: 'O ar da caneta cirúrgica penetrou sob a camada de pele da bochecha, causando esse inchaço imediato. Não se preocupe: isso é ar sob a pele e o seu próprio corpo o reabsorverá naturalmente em alguns dias. Vamos prescrever um antibiótico para garantir que nenhuma bactéria se instale e acompanharemos a regressão dia a dia.'",
    prescriptionAndExams: [
      "Amoxicilina + Clavulanato 875mg — de 12 em 12 horas por 7 a 10 dias (obrigatório).",
      "Analgésicos para alívio de dor e desconforto tensional."
    ],
    prontuaryRecord: "Durante odontossecção cirúrgica de terceiro molar, constatou-se penetração de ar no tecido subcutâneo geniano (enfisema subcutâneo), confirmado por crepitação à palpação. Ausência de comprometimento de vias aéreas ou queixas respiratórias. Concluída a sutura, prescrita cobertura antimicrobiana e iniciado protocolo de proservação ambulatorial.",
    protectiveClause: "REGISTRO DE CONDUTA EM ENFISEMA SUBCUTÂNEO: O(A) paciente atesta que recebeu diagnóstico e tratamento clínico imediato para enfisema transitório decorrente da despressurização de ar comprimido cirúrgico, estando ciente do uso contínuo de antibióticos e das consultas diárias de acompanhamento."
  },
  {
    id: "aspiracao-degluticao-chave-protese",
    specialty: "Prótese & Dentística",
    title: "Aspiração ou Deglutição Acidental de Chave Protética ou Fragmento",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Aperto de parafusos protéticos em dentes posteriores sem fio dental de segurança na chave, ausência de isolamento absoluto em dentística.",
    steps: [
      "1. INTERROMPA QUALQUER MANOBRA IMEDIATAMENTE ao perceber a queda do objeto na orofaringe. NÃO coloque o dedo às cegas na garganta do paciente.",
      "2. Diferenciação vital imediata:",
      "   • Se ASPIRAÇÃO PULMONAR (vias aéreas): Paciente apresenta tosse espasmódica, asfixia, estridor inspiratório ou dispneia. Conduta: Manobra de Heimlich imediata se asfixia; acionar SAMU 192 para broncoscopia hospitalar urgente.",
      "   • Se DEGLUTIÇÃO DIGESTIVA (estômago): Paciente consegue respirar normalmente, fala sem rouquidão e relata ter engolido o objeto.",
      "3. Em caso de deglutição confirmada:",
      "   • Encaminhe imediatamente o paciente para Raio-X de Tórax e Abdômen Agudo para localizar o objeto no trato gastrointestinal;",
      "   • Na quase totalidade dos casos, o objeto percorre o trato digestivo e é expelido espontaneamente em 48 a 72 horas;",
      "   • Orientar dieta rica em fibras (aveia, pão integral, folhas) para proteger a mucosa gástrica e intestinal."
    ],
    communication: "Mantenha a calma e explique com profissionalismo: 'Uma pequena chave de aperto escorregou e foi engolida. Como você está respirando livremente, o objeto foi para o estômago e não para o pulmão. Vamos realizar agora uma radiografia médica para mapear a posição exata e acompanhar a eliminação natural do objeto com total segurança médica.'",
    prescriptionAndExams: [
      "Encaminhamento médico urgente para Raio-X de Abdômen e Tórax.",
      "Dieta rica em fibras e proibição de laxantes fortes."
    ],
    prontuaryRecord: "Durante torque de componente protético, ocorreu deslocamento e deglutição acidental de microchave de inserção. Paciente permaneceu em ventilação espontânea normal sem sinais de obstrução respiratória. Emitida solicitação médica de radiografia contrastada de tórax/abdômen para rastreio radiopaco. Paciente acompanhado até serviço hospitalar.",
    protectiveClause: "TERMO DE CIÊNCIA E CONDUTA EM DEGLUTIÇÃO ACIDENTAL: Registra-se que, diante do desprendimento e deglutição inadvertida de componente instrumental metálico, o profissional prestou atendimento de emergência, descartou obstrução das vias aéreas e encaminhou o paciente para confirmação radiológica e acompanhamento médico."
  },
  {
    id: "sincope-vasovagal-consultorio",
    specialty: "Emergências Sistêmicas",
    title: "Síncope Vasovagal / Hipotensão Postural no Consultório Odontológico",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Ansiedade odontológica aguda, fobia de agulha, jejum prolongado do paciente ou mudança postural súbita.",
    steps: [
      "1. RECONHECIMENTO PRECOCE: Paciente relata calor súbito, visão embaçada ('visão de túnel'), tontura, sudorese fria na testa e palidez.",
      "2. AÇÃO FÍSICA IMEDIATA: POSIÇÃO DE TRENDELENBURG!",
      "   • Rebaixe imediatamente o encosto da cadeira e eleve as pernas do paciente acima do nível da cabeça (30 a 45 graus) para favorecer o retorno venoso e perfusão cerebral;",
      "   • Afrouxe roupas apertadas (golas, gravatas, cintos);",
      "   • Assegure vias aéreas pérvias e vire a cabeça suavemente de lado.",
      "3. Suporte de Oxigênio: Administrar Oxigênio a 100% via máscara facial (fluxo de 5 a 6 L/min).",
      "4. Monitoramento dos sinais vitais: Aferir Pressão Arterial e Frequência Cardíaca a cada 3 minutos até recuperação completa da consciência.",
      "5. Retorno gradual à posição sentada somente após 15 a 20 minutos de repouso estável."
    ],
    communication: "Acalme o paciente com serenidade: 'Você teve uma queda temporária de pressão decorrente da ansiedade e do estresse do atendimento. Seu cérebro precisava de mais circulação e por isso rebaixamos a cadeira. Você já está se recuperando muito bem, seus sinais vitais estão se normalizando e ficaremos descansando aqui o tempo que for necessário.'",
    prescriptionAndExams: [
      "Oxigênio 100% a 5 L/min durante o episódio.",
      "Água e sachê de glicose se houver comprovação de hipoglicemia."
    ],
    prontuaryRecord: "Durante atendimento clínico, paciente manifestou lipotimia/síncope vasovagal com palidez e sudorese. Posicionado em Trendelenburg com oxigenoterapia a 100%. Aferidos SSVV (PA inicial 80x50 mmHg; FC 52 bpm). Restabelecimento hemodinâmico completo em 10 minutos (PA 115x75 mmHg; FC 68 bpm). Procedimento suspenso e reagendado com ansiolítico prévio.",
    protectiveClause: "REGISTRO DE CONDUTA EM INTERCORRÊNCIA VASOVAGAL: Registra-se que o paciente apresentou episódio transitório de hipotensão/síncope por ansiedade reflexa, recebendo manobra imediata de Trendelenburg e oxigenação até plena estabilização dos parâmetros cardiovasculares."
  },
  {
    id: "anafilaxia-alergia-grave",
    specialty: "Emergências Sistêmicas",
    title: "Choque Anafilático / Reação Alérgica Grave Imediata",
    urgency: "Emergência Imediata",
    urgencyClass: "danger",
    triggerAnatomy: "Hipersensibilidade grave tipo I imediata a medicamentos (penicilinas, AINEs), anestésicos com sulfitos ou látex.",
    steps: [
      "1. RECONHECIMENTO INSTANTÂNEO DE ANAFILAXIA: Urticária difusa, edema de lábios/úvula/glote, broncoespasmo com sibilos, aperto torácico, hipotensão severa e colapso respiratório.",
      "2. CONDUTA DE SOBREVIVÊNCIA MANDATÓRIA (NÃO HESITE):",
      "   • ADRENALINA / EPINEFRINA 1:1.000 (1mg/mL) POR VIA INTRAMUSCULAR PROFUNDA!",
      "   • Local de injeção: Face anterolateral da coxa (músculo vasto lateral).",
      "   • Dose: 0,3 a 0,5 mg (0,3 a 0,5 mL) em adultos (ou 0,01 mg/kg em crianças);",
      "   • A adrenalina é a ÚNICA droga que reverte o colapso vascular e abre as vias aéreas na anafilaxia aguda. Não perca tempo dando anti-histamínico antes da adrenalina!",
      "   • Se não houver melhora clínica em 5 a 10 minutos, REPETIR a dose de adrenalina.",
      "3. LIGUE IMEDIATAMENTE PARA O SAMU (192) informando: 'Choque anafilático em consultório odontológico'.",
      "4. Oxigênio medicinal a 100% contínuo sob máscara com reservatório (10 a 15 L/min).",
      "5. Drogas adjuvantes (administradas após a adrenalina): Hidrocortisona 500mg IV ou IM + Anti-histamínico (Prometazina 25mg IM)."
    ],
    communication: "Equipe deve agir com total foco no suporte de vida. Informe o acompanhante: 'O paciente apresentou uma reação alérgica aguda e severa. Administramos a medicação de suporte à vida (adrenalina) que já está agindo e o serviço de resgate móvel hospitalar já está a caminho para continuidade do atendimento com segurança total.'",
    prescriptionAndExams: [
      "Adrenalina (Epinefrina) 1:1.000 — 0,5 mL IM profunda imediata.",
      "Hidrocortisona 500mg IM/EV.",
      "Oxigênio medicinal 100% contínuo."
    ],
    prontuaryRecord: "Após administração de fármaco, paciente evoluiu subitamente com broncoespasmo, estridor e edema de orofaringe, compatível com choque anafilático. Administrada Adrenalina 0,5mg IM em vasto lateral da coxa imediatamente, associada a oxigênio 100%. Acionado serviço do SAMU 192 com remoção assistida para pronto-socorro.",
    protectiveClause: "REGISTRO DE ATENDIMENTO DE EMERGÊNCIA ALÉRGICA AGUDA: Consta que diante de reação imprevista de hipersensibilidade aguda grave, o profissional executou as manobras emergenciais de suporte vital com administração de adrenalina e encaminhamento imediato ao serviço médico de urgência."
  },
  {
    id: "hemorragia-arteria-palatina-maior",
    specialty: "Periodontia",
    title: "Hemorragia Arterial da Artéria Palatina Maior em Enxerto Gengival",
    urgency: "Emergência Transoperatória",
    urgencyClass: "danger",
    triggerAnatomy: "Incisão profunda inadvertida ou dissecação posterior além do primeiro molar superior no palato duro, lesionando o feixe palatino maior.",
    steps: [
      "1. COMPRESSÃO DIGITAL IMEDIATA: Comprima o local sangrante no palato com gaze dobrada umedecida em soro com força contínua por no mínimo 5 a 10 minutos sem aliviar a pressão.",
      "2. ANESTESIA COM VASOCONSTRITOR LOCAL: Infiltrar 0,5 a 1,0 mL de anestésico com adrenalina 1:50.000 ou 1:100.000 diretamente na borda óssea adjacente ao forame palatino maior (bloqueio regional).",
      "3. SUTURA HEMOSTÁTICA EM 'X' OU COLCHOEIRO HORIZONTAL PROFUNDO: Passar fio de sutura resistente (seda 3-0 ou 4-0) ancorado no periósteo para estrangular o vaso contra a abóbada óssea palatina.",
      "4. AGENTES HEMOSTÁTICOS: Aplicar esponja de colágeno hemostática absorvível (Hemospon/Surgicel) embebida em ácido tranexâmico injetável sob a sutura.",
      "5. USO DA PLACA PALATINA: Instalar e travar a placa protetora palatina de acrílico para manter compressão mecânica estável contínua.",
      "6. Só liberar o paciente após 30 minutos de hemostasia absoluta comprovada."
    ],
    communication: "Comunique com segurança técnica: 'Tivemos um pequeno vaso no céu da boca que sangrou mais do que o habitual devido à vascularização rica da região. Já realizamos a contenção mecânica e uma sutura hemostática com esponja de colágeno. Manteremos a placa protetora no céu da boca e o sangramento está totalmente controlado.'",
    prescriptionAndExams: [
      "Ácido Tranexâmico 250mg (1 comprimido a cada 8h por 3 dias).",
      "Gelo local extraoral e repouso de cabeça elevada a 45 graus."
    ],
    prontuaryRecord: "Durante colheita de enxerto de conjuntivo no palato, ocorreu sangramento arterial pulsátil no forame palatino. Realizada compressão hemostática digital, infiltração com vasoconstritor, sutura hemostática em 'X' com esponja de colágeno e instalação de placa palatina. Hemostasia restabelecida plenamente.",
    protectiveClause: "TERMO DE CONDUTA HEMOSTÁTICA EM CIRURGIA PERIODONTAL: O paciente atesta que, diante de intercorrência hemorrágica transoperatória em área vascular palatina, o cirurgião executou com presteza as manobras hemostáticas consagradas pela literatura cirúrgica, alcançando a completa cessação do sangramento."
  },
  {
    id: "invasao-espaco-biologico-recidiva",
    specialty: "Periodontia",
    title: "Violação do Espaço Biológico e Recidiva em Gengivoplastia",
    urgency: "Complicação Pós-Operatória",
    urgencyClass: "warning",
    triggerAnatomy: "Corte gengival realizado sem a osteotomia necessária para respeitar os 3mm de distância da crista óssea alveolar à futura margem (Gargiulo).",
    steps: [
      "1. AVALIAÇÃO CLÍNICA: Identificação de sangramento gengival espontâneo crônico, rubor marginal persistente e crescimento (recidiva) da gengiva cobrindo novamente a coroa do dente.",
      "2. SONDAGEM TRANSCIRÚRGICA: Sob anestesia infiltrativa, introduzir a sonda periodontal até bater na crista óssea. Se a distância margem-osso for inferior a 2,5mm, a invasão biológica está confirmada.",
      "3. REINTERVENÇÃO COM OSTEOTOMIA: Rebatimento de retalho de espessura total e osteotomia / osteoplastia com cinzéis delicados ou brocas sob refrigeração abundante para esculpir 3mm de osso da margem projetada.",
      "4. Sutura e aguardo de 60 a 90 dias de maturação tecidual completa antes de qualquer procedimento restaurador definitivo."
    ],
    communication: "Esclareça ao paciente: 'A sua gengiva possui uma memória óssea biológica que tentou recriar sua proteção natural. Faremos um pequeno ajuste milimétrico no contorno do osso sob anestesia para que a margem gengival permaneça estável e o sorriso continue alto e harmônico.'",
    prescriptionAndExams: [
      "Digluconato de Clorexidina 0,12% para bochechos 2x ao dia por 14 dias.",
      "Anti-inflamatório (Nimesulida 100mg 12/12h por 3 dias)."
    ],
    prontuaryRecord: "Paciente apresentou eritema e rebote de hiperplasia gengival após gengivectomia prévia. Constatada violação de espaço biológico por crista óssea alta. Realizada osteotomia periodontal de resguardo de 3mm com retalho e sutura monofilamentar. Tecido em remissão inflamatória e reestabilização estética.",
    protectiveClause: "ADITIVO DE REAJUSTE BIOLÓGICO EM PERIODONTIA: O(A) paciente registra ciência de que a remodelação dos tecidos periodontais é resposta tecidual dinâmica e individual, recebendo o reajuste cirúrgico da crista óssea em conformidade com os princípios da periodontia moderna."
  },
  {
    id: "lesao-ducto-wharton-ranula",
    specialty: "Cirurgia & Sisos",
    title: "Trauma no Ducto de Wharton e Sialocele/Rânula em Frenectomia Lingual",
    urgency: "Urgência Pós-Operatória",
    urgencyClass: "warning",
    triggerAnatomy: "Incisão no soalho bucal muito próxima às carúnculas sublinguais ou divulsão profunda nas imediações da glândula submandibular.",
    steps: [
      "1. AVALIAÇÃO CLÍNICA: Visualização de aumento de volume cístico translúcido azulado no assoalho bucal sob a língua (rânula por extravasamento de saliva).",
      "2. DIFERENCIAÇÃO: Verificar se há drenagem de saliva límpida pelas carúnculas sublinguais à compressão bimanual da glândula submandibular.",
      "3. CONDUTA CONSERVADORA (Sialocele inicial): Massagem salivar, sialogogos (gotas de limão) e aspiração asséptica com agulha fina.",
      "4. CONDUTA CIRÚRGICA (Rânula estabelecida): Se houver persistência, proceder à marsupialização cirúrgica sob anestesia local (abertura do teto da lesão e sutura das bordas da mucosa cística com a mucosa do assoalho bucal) ou micromarsupialização com pontos de seda.",
      "5. Acompanhamento clínico quinzenal até fechamento e fluxo salivar desobstruído."
    ],
    communication: "Explique com calma: 'Houve uma pequena retenção temporária de saliva sob a língua devido à manipulação cirúrgica próxima à glândula. Faremos uma descompressão suave e acompanharemos o fluxo salivar normalizar sem qualquer prejuízo à fala ou deglutição.'",
    prescriptionAndExams: [
      "Bochechos com Clorexidina 0,12% sem álcool 2x ao dia.",
      "Uso de gotas de limão para estimular o esvaziamento salivar."
    ],
    prontuaryRecord: "Paciente compareceu com pequeno edema cístico em soalho de boca sugestivo de sialocele após frenectomia lingual. Realizada marsupialização sob anestesia local com esvaziamento de conteúdo salivar mucoso e sutura circunferencial. Fluxo do ducto submandibular pérvio.",
    protectiveClause: "TERMO DE CONDUTA EM ADAPTAÇÃO SALIVAR PÓS-FRENECTOMIA: O paciente registra ciência de que a proximidade anatômica entre o freio lingual e os ductos salivares sublinguais pode gerar retenção temporária de saliva, tendo recebido a conduta corretiva indicada com preservação funcional da glândula."
  },
  {
    id: "comunicacao-bucosinusal-exodontia",
    specialty: "Cirurgia & Sisos",
    title: "Comunicação Bucosinusal Aguda em Extração de Molares Superiores",
    urgency: "Urgência Transoperatória",
    urgencyClass: "danger",
    triggerAnatomy: "Proximidade extrema das raízes de molares ou pré-molares superiores com o assoalho do seio maxilar e pneumatização sinusal excessiva.",
    steps: [
      "1. DIAGNÓSTICO IMEDIATO: Teste de Valsalva suave (o paciente sopra o nariz com as narinas ocluídas pelo dentista). Se houver saída de bolhas de ar ou sangue borbulhante pelo alvéolo, a comunicação está confirmada.",
      "2. CONDUTA PARA COMUNICAÇÃO PEQUENA (< 2 mm): Preservar o coágulo sanguíneo intacto dentro do alvéolo, aplicar esponja de colágeno hemostática absorvível e realizar sutura oclusiva em 'X' cruzada bem apertada.",
      "3. CONDUTA PARA COMUNICAÇÃO MÉDIA/GRANDE (> 3 a 5 mm): Confecção de Retalho Vestibular Deslizante de Rehrmann (descolamento mucoperiosteal amplo com incisão relaxante no periósteo para deslizamento passivo sem tensão) e sutura hermética borda a borda cobrindo todo o alvéolo.",
      "4. PRESCRIÇÃO FARMACOLÓGICA OBRIGATÓRIA (Profilaxia de Sinusite Maxilar):",
      "   • Amoxicilina com Clavulanato 875mg + 125mg (1 comprimido a cada 12h por 7 a 10 dias);",
      "   • Descongestionante nasal tópico (Oximetazolina 0,5% — 2 gotas em cada narina 2x ao dia por 5 dias);",
      "   • Anti-histamínico sistêmico;",
      "5. ORIENTAÇÕES CRÍTICAS AO PACIENTE: NÃO ASSOAR O NARIZ POR 15 DIAS, espirrar de boca aberta, não fumar e não sugar canudos."
    ],
    communication: "Oriente com firmeza e tranquilidade: 'A raiz do seu dente estava em contato direto com a cavidade do seio da face. Ao remover o dente, abriu-se uma pequena passagem natural de ar. Já realizamos o fechamento cirúrgico hermético com o retalho da gengiva. É fundamental que você NÃO assoe o nariz nos próximos 15 dias e tome o antibiótico prescrito para que a cicatrização feche essa passagem perfeitamente.'",
    prescriptionAndExams: [
      "Amoxicilina + Clavulanato de Potássio 875/125mg (12/12h por 10 dias).",
      "Cloridrato de Oximetazolina 0,5mg/mL — Solução Nasal (2 gotas 2x/dia por 5 dias).",
      "Analgésico e Anti-inflamatório habitual."
    ],
    prontuaryRecord: "Durante exodontia do dente 16/26 com pneumatização sinusal, constatada comunicação bucosinusal de 3mm confirmada por Manobra de Valsalva. Confeccionado retalho vestibular deslizante com descolamento periosteal, aposição de colágeno e sutura hermética oclusiva com fio 4-0. Prescrito antibiótico e descongestionante com alerta de proibição de assoar o nariz.",
    protectiveClause: "TERMO DE CONDUTA E FECHAMENTO DE COMUNICAÇÃO BUCOSINUSAL: O paciente declara ciência de que a proximidade das raízes dentárias com a cavidade sinusal resultou em comunicação anatômica imediata, tendo sido realizado o fechamento cirúrgico hermético e recebido orientações de não assoar o nariz sob pena de culpa exclusiva em caso de reabertura de fístula."
  },
  {
    id: "falha-torque-carga-imediata-protocolo",
    specialty: "Implantodontia",
    title: "Perda de Estabilidade Primária (< 35 N.cm) em Carga Imediata de Prótese Protocolo",
    urgency: "Intercorrência Transoperatória",
    urgencyClass: "warning",
    triggerAnatomy: "Osso alveolar tipo IV (baixa densidade trabecular na maxila posterior) ou osteotomia ampla de crista óssea.",
    steps: [
      "1. AFERIÇÃO DO TORQUE CIRÚRGICO: Se um ou mais implantes apresentarem torque de inserção final inferior a 35 N.cm, a indicação de CARGA IMEDIATA FICA CANCELADA no mesmo instante.",
      "2. CONDUTA BIOLÓGICA DE PROTEÇÃO: Submeter a prótese imediata a forças mastigatórias com torque insuficiente causará micromovimentação e perda irreversível de todos os implantes (fibrointegração).",
      "3. REVERSÃO PARA PROTOCOLO BIFÁSICO TARDIO: Instalar parafusos de cobertura nos implantes, suturar a gengiva fechando o leito cirúrgico e aguardar o período biológico de osseointegração submersa de 3 a 6 meses.",
      "4. PRÓTESE PROVISÓRIA ALIVIADA: Reembasar a prótese total móvel existente com silicone macio para garantir que ela fique 100% aliviada sobre os implantes sem transmitir qualquer carga mastigatória."
    ],
    communication: "Comunique com integridade ética e autoridade pericial: 'A densidade do seu osso em uma das regiões operadas mostrou-se mais macia do que o previsto na tomografia. Para garantir 100% de segurança e não arriscar a perda dos implantes, optamos responsavelmente por aguardar a cicatrização óssea biológica completa antes de parafusar a prótese fixa. Você usará uma prótese provisória aliviada e preservaremos seus implantes com perfeição.'",
    prescriptionAndExams: [
      "Reembasamento macio da prótese móvel com Sofreliner / Coe-Soft.",
      "Manutenção da farmacoterapia antimicrobiana e anti-inflamatória habitual."
    ],
    prontuaryRecord: "Durante a instalação dos 4 implantes na maxila, os elementos posteriores apresentaram torque de 25 N.cm por osso tipo IV. Em estrita observância aos protocolos científicos, suspensa a carga imediata planejada. Implantes sepultados sob sutura para osseointegração tardia de 4 meses com prótese móvel aliviada.",
    protectiveClause: "NOTIFICAÇÃO DE CONDUTA PREVENTIVA EM CARGA IMEDIATA: Registra-se que, visando a salvaguarda da osseointegração perante densidade óssea atípica detectada no transoperatório, o profissional converteu a conduta para carga tardia em consonância com a boa prática odontológica e CDC Art. 14."
  },
  {
    id: "dor-atm-deslocamento-dam",
    specialty: "Odontologia do Sono",
    title: "Disfunção Temporomandibular (DTM) e Deslocamento Oclusal por Dispositivo de Avanço Mandibular (DAM)",
    urgency: "Complicação Subaguda",
    urgencyClass: "warning",
    triggerAnatomy: "Sobrecarga nos côndilos mandibulares e ligamentos retrodiscais da ATM decorrente de avanço mandibular protrusivo excessivo (> 75% da protrusão máxima) ou não uso do guia matinal.",
    steps: [
      "1. AVALIAÇÃO: Palpação dolorosa das articulações têmporo-mandibulares (ATMs) e músculos masseter/pterigóideos com queixa de mordida fora de lugar ao acordar.",
      "2. RECUO MILIMÉTRICO DO DAM: Recuar o mecanismo de avanço do aparelho em 1,0 a 2,0 mm imediatamente para diminuir a tensão sobre a cápsula articular.",
      "3. USO INTENSIFICADO DO GUIA MATINAL: Realizar exercícios mastigatórios isométricos no guia matinal rígido por 20 minutos todas as manhãs para reposicionar os côndilos na cavidade articular.",
      "4. TERAPIA FÍSICA E LASERTERAPIA: Aplicar Laser de Baixa Intensidade (808nm infravermelho) nas ATMs e compressas mornas por 15 minutos.",
      "5. Se a dor persistir, suspender o aparelho por 7 a 10 dias até remissão dos sintomas e reavaliar com médico do sono."
    ],
    communication: "Oriente: 'O avanço que colocamos para desobstruir sua respiração gerou um estiramento muscular ligeiramente além do limite confortável da articulação. Faremos um recuo milimétrico no parafuso do aparelho e intensificaremos o uso do guia da manhã. Isso aliviará o incômodo sem perder o benefício do sono.'",
    prescriptionAndExams: [
      "Relaxante muscular (Ciclobenzaprina 5mg ao deitar por 5 dias).",
      "Laserterapia infravermelha nas articulações temporomandibulares."
    ],
    prontuaryRecord: "Paciente em tratamento de ronco/apneia relatou dor pré-auricular matinal após titulação protrusiva. Constatada sobrecarga ligamentar na ATM. Realizado recuo de 1,5mm no parafuso do DAM e prescrito guia matinal intensificado com laserterapia. Sintomas articulares em remissão.",
    protectiveClause: "TERMO DE AJUSTE EM ODONTOLOGIA DO SONO: O(A) paciente atesta que compareceu para ajuste de avanço e oclusão do dispositivo intraoral, recebendo as orientações posturais e reiterando a obrigatoriedade de uso do guia matinal diário para resguardo da articulação e mordida."
  },
  {
    id: "emese-broncoaspiracao-oxido-nitroso",
    specialty: "Emergências Sistêmicas",
    title: "Náusea, Vômito e Risco de Broncoaspiração sob Sedação com Óxido Nitroso (N2O/O2)",
    urgency: "Emergência Transoperatória",
    urgencyClass: "danger",
    triggerAnatomy: "Violação de jejum pré-operatório alimentar pelo paciente ou titulação rápida em concentração de N2O superior a 60%.",
    steps: [
      "1. CORTE IMEDIATO DO ÓXIDO NITROSO: Desligue instantaneamente o fluxo de N2O e abra o fluxo de OXIGÊNIO A 100% com vazão máxima (10 a 15 L/min).",
      "2. PROTEÇÃO IMEDIATA DAS VIAS AÉREAS: Vire imediatamente a cabeça do paciente para o lado (decúbito lateral da cabeça) e abaixe o encosto para evitar aspiração pulmonar do conteúdo gástrico para os brônquios.",
      "3. ASPIRAÇÃO POTENTE DA CAVIDADE BUCAL: Acione o sugador cirúrgico de alta potência com cânula rígida (Yankauer) e aspire imediatamente restos alimentares, saliva e vômito da orofaringe e boca.",
      "4. LAVAGEM ALVEOLAR COM OXIGÊNIO A 100%: Mantenha o paciente recebendo Oxigênio medicinal a 100% sob máscara por no mínimo 10 minutos contínuos para reoxigenação e prevenção de hipóxia.",
      "5. AUSCULTA PULMONAR E MONITORAMENTO: Avalie a saturação de O2 pelo oxímetro (SpO2 > 95%). Se houver queda de oxigenação, tosse persistente ou roncos respiratórios pulmonares (suspeita de broncoaspiração), acione o SAMU 192 e encaminhe ao pronto-socorro imediatamente para radiografia de tórax e suporte hospitalar."
    ],
    communication: "Aja com presteza e autoridade: 'Colocamos você de lado para proteger sua respiração e limpamos sua boca com o aspirador. Estamos fornecendo oxigênio medicinal puro a 100% para você respirar fundo. Fique calmo, seus sinais vitais estão sob controle contínuo da equipe.'",
    prescriptionAndExams: [
      "Ondansetrona 8mg comprimido orodispersível (Vonau Flash) sublingual.",
      "Oxigênio medicinal 100% contínuo sob máscara facial."
    ],
    prontuaryRecord: "Durante sedação inalatória N2O/O2, paciente apresentou reflexo de êmese. Constatada posterior admissão de ingestão de refeição sólida 1 hora antes do procedimento (violação do jejum obrigatório orientado). Interrompido N2O imediatamente, administrado O2 a 100%, aspirada a orofaringe sem broncoaspiração e estabilizado SpO2 em 99%.",
    protectiveClause: "NOTIFICAÇÃO DE INTERCORRÊNCIA POR VIOLAÇÃO DE JEJUM EM SEDAÇÃO: Registra-se que diante de episódio emético agudo decorrente de omissão culposa de jejum pelo paciente, a equipe executou a manobra de drenagem e oxigenação pura imediata, prevenindo complicações broncopulmonares com êxito."
  }
];
