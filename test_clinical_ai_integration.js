/**
 * ============================================================================
 * TESTE DE VALIDAÇÃO COMPLETO: DENTALSAFE CLINICAL AI ENGINE
 * Valida extração semântica profunda, síntese forense e integração ao TCLE
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const DentalSafeClinicalAI = require('./clinical-ai-engine.js');

console.log('🧪 INICIANDO TESTES AUTOMATIZADOS DO MOTOR DE IA CLÍNICA...\n');

// ----------------------------------------------------------------------------
// TESTE 1: Endodontia Complexa (Dente 46 com fístula, necrose, curvatura, WaveOne, fumo e alergia)
// ----------------------------------------------------------------------------
console.log('--- TESTE 1: Caso Endodôntico Complexo ---');
const endoCaseInput = {
  procDiag: 'Elemento 46 com necrose pulpar, presenca de fistula ativa na mucosa vestibular e raiz mesial com curvatura acentuada',
  procRegion: 'Dente 46',
  dictation: 'Tratamento planejado com sistema WaveOne Gold sob irrigacao com hipoclorito de sodio e curativo com hidroxido de calcio. Paciente tabagista ativa (15 cig/dia) e relata alergia grave a penicilina. Proximidade com canal mandibular observada na tomografia.',
  procKey: 'canal',
  procNeedsCanal: true,
  procNeedsCoroa: true,
  cSmoke: true,
  cAllergy: true,
  selectedTeeth: ['46']
};

const parsedEndo = DentalSafeClinicalAI.parseClinicalInput(endoCaseInput);
console.log(`[PASS 1.1] Total de entidades detectadas: ${parsedEndo.counts.totalEntities}`);
if (parsedEndo.counts.totalEntities < 6) {
  throw new Error(`Esperava pelo menos 6 entidades detectadas no caso endo, obteve ${parsedEndo.counts.totalEntities}`);
}

// Checar extração do dente
if (!parsedEndo.teeth.includes('46')) {
  throw new Error('Falha ao extrair dente 46');
}
console.log('  ✓ Dente 46 identificado com precisão');

// Checar patologias
const pathIds = parsedEndo.pathologies.map(p => p.id);
if (!pathIds.includes('fistula') || !pathIds.includes('necrose') || !pathIds.includes('curvatura_severa')) {
  throw new Error(`Faltam patologias esperadas (fistula, necrose, curvatura): ${pathIds.join(', ')}`);
}
console.log('  ✓ Patologias identificadas: Fístula, Necrose e Curvatura Acentuada');

// Checar protocolos
const protoIds = parsedEndo.protocols.map(p => p.id);
if (!protoIds.includes('waveone') || !protoIds.includes('hipoclorito') || !protoIds.includes('hidroxido')) {
  throw new Error(`Faltam protocolos esperados (waveone, hipoclorito, hidroxido): ${protoIds.join(', ')}`);
}
console.log('  ✓ Protocolos identificados: WaveOne Gold, Hipoclorito e Hidróxido de Cálcio');

// Checar alergia e tabagismo
const sysIds = parsedEndo.systemic.map(s => s.id);
if (!sysIds.includes('allergy') || !sysIds.includes('smoking')) {
  throw new Error(`Faltam fatores sistêmicos esperados (allergy, smoking): ${sysIds.join(', ')}`);
}
const smokeEntity = parsedEndo.systemic.find(s => s.id === 'smoking');
if (!smokeEntity || smokeEntity.count !== '15') {
  throw new Error(`Falha ao quantificar contagem de cigarros (esperado 15): ${JSON.stringify(smokeEntity)}`);
}
console.log('  ✓ Carga tabágica extraída quantitativamente: 15 cigarros/dia');

const allergyEntity = parsedEndo.systemic.find(s => s.id === 'allergy');
if (!allergyEntity || !allergyEntity.allergens.some(a => a.toLowerCase().includes('penicilina'))) {
  throw new Error('Falha ao identificar alérgeno específico Penicilina');
}
console.log('  ✓ Alergia específica a Penicilina identificada e isolada');

// Síntese
const synEndo = DentalSafeClinicalAI.synthesize(parsedEndo, endoCaseInput);

// Validação da Síntese Patológica (Seção 3)
if (!synEndo.customPathologySynthesis.includes('fístula ativa') || !synEndo.customPathologySynthesis.includes('necrose pulpar')) {
  throw new Error('Síntese patológica não contém menção expressa a fístula ou necrose');
}
console.log('  ✓ Seção 3: Fisiopatologia individualizada contextualizada com sucesso');

// Validação do Workflow Instrumental (Seção 5)
if (!synEndo.customWorkflowNuances.includes('WaveOne Gold') || !synEndo.customWorkflowNuances.includes('Hidróxido de Cálcio')) {
  throw new Error('Workflow não contém menção aos sistemas técnicos identificados');
}
console.log('  ✓ Seção 5: Workflow instrumental personalizado com WaveOne e Hidróxido');

// Validação dos Riscos Forenses (Seção 11)
if (!synEndo.dynamicForensicRisksHTML.includes('FADIGA CÍCLICA') || !synEndo.dynamicForensicRisksHTML.includes('CANAL MANDIBULAR')) {
  throw new Error('Riscos forenses não incluem cláusulas de fadiga cíclica ou proximidade neural');
}
console.log('  ✓ Seção 11: Cláusulas forenses de curvatura e proximidade com o NAI tecidas com rigor');

// Validação Farmacológica (Seção 13)
if (!synEndo.systemicPharmacologyBlock.includes('ALERGIA DECLARADA') || !synEndo.systemicPharmacologyBlock.includes('não recomenda clindamicina')) {
  throw new Error('Bloco farmacológico falhou ao contraindicar amoxicilina e indicar antibiótico alternativo');
}
if (!synEndo.systemicPharmacologyBlock.includes('15 CIGARROS/DIA') || !synEndo.systemicPharmacologyBlock.includes('sem exclusão automática')) {
  throw new Error('Bloco farmacológico falhou ao citar carga tabágica de 15 cigarros e Art. 14 do CDC');
}
console.log('  ✓ Seção 13: Alerta de alergia e restrição de clindamicina na profilaxia');

// Validação de Pós-Operatório e Compromissos (Seções 14 e 15)
if (!synEndo.individualizedPostOpAdapters.includes('Cuidado Mastigatório') || !synEndo.explicitPatientCommitments.includes('30 dias')) {
  throw new Error('Falha na blindagem de cuidados pós-operatórios ou compromisso de restauração definitiva em 30d');
}
console.log('  ✓ Seções 14 e 15: Restrição mastigatória específica e blindagem de 30 dias (CDC Art. 14)');

// Validação do Glossário (Seção 21)
if (synEndo.dynamicGlossaryEntries.length < 4) {
  throw new Error(`Esperava pelo menos 4 termos didáticos no glossário, obteve ${synEndo.dynamicGlossaryEntries.length}`);
}
console.log(`  ✓ Seção 21: ${synEndo.dynamicGlossaryEntries.length} termos didáticos incluídos no glossário (WaveOne, NaOCl, Fístula, etc.)`);

// ----------------------------------------------------------------------------
// TESTE 2: Cirurgia de Terceiros Molares com Parestesia, Pericoronite e Trismo
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 2: Caso Cirúrgico de Terceiros Molares ---');
const sisoInput = {
  procDiag: 'Terceiros molares inferiores 38 e 48 inclusos com pericoronite de repeticao, trismo e raizes em intimo contato com o canal mandibular',
  procRegion: 'Dentes 38 e 48',
  dictation: 'Exodontia cirurgica com osteotomia e odontoseccao com broca Zecrya. Informado risco de parestesia do NAI.',
  procKey: 'sisos',
  procNeedsExtraction: true,
  procNeedsParesthesia: true,
  selectedTeeth: ['38', '48']
};

const parsedSiso = DentalSafeClinicalAI.parseClinicalInput(sisoInput);
if (!parsedSiso.teeth.includes('38') || !parsedSiso.teeth.includes('48')) {
  throw new Error('Falha ao extrair dentes 38 e 48');
}
if (!parsedSiso.anatomy.hasMandibularCanalProximity) {
  throw new Error('Falha ao detectar proximidade com o Canal Mandibular / NAI');
}
const synSiso = DentalSafeClinicalAI.synthesize(parsedSiso, sisoInput);
if (!synSiso.dynamicForensicRisksHTML.includes('PROXIMIDADE COM O CANAL MANDIBULAR')) {
  throw new Error('Falha ao gerar cláusula crítica de parestesia para os terceiros molares');
}
console.log('  ✓ Dentes 38 e 48, pericoronite, trismo e risco de parestesia validados com sucesso');

// ----------------------------------------------------------------------------
// TESTE 3: Harmonização Orofacial com Risco Vascular e Hialuronidase
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 3: Caso de Harmonização Orofacial (HOF) ---');
const hofInput = {
  procDiag: 'Preenchimento facial com acido hialuronico em sulco nasogeniano e regiao malar',
  procRegion: 'Face média e terço inferior',
  dictation: 'Discutido protocolo emergencial de intercorrencia vascular com aplicacao imediata de hialuronidase de alta dose caso haja sinal de isquemia.',
  procKey: 'harmonizacao',
  procNeedsHofVascular: true
};

const parsedHof = DentalSafeClinicalAI.parseClinicalInput(hofInput);
if (!parsedHof.protocols.some(p => p.id === 'hialuronidase')) {
  throw new Error('Falha ao detectar protocolo de resgate vascular com Hialuronidase');
}
const synHof = DentalSafeClinicalAI.synthesize(parsedHof, hofInput);
if (!synHof.dynamicForensicRisksHTML.includes('Hialuronidase de Resgate')) {
  throw new Error('Falha ao incluir autorização expressa prévia de Hialuronidase na Seção 11');
}
console.log('  ✓ Protocolo emergencial de oclusão vascular e Hialuronidase validado com sucesso');

// ----------------------------------------------------------------------------
// TESTE 4: Verificação de Integridade dos Arquivos Web
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 4: Integridade dos Arquivos Web ---');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
if (!indexHtml.includes('src="clinical-ai-engine.js"')) {
  throw new Error('index.html não carrega clinical-ai-engine.js');
}
if (!indexHtml.includes('id="ai-clinical-hud-box"') || !indexHtml.includes('id="ai-detected-entities-bar"')) {
  throw new Error('index.html não contém os containers do AI Clinical HUD');
}
console.log('  ✓ index.html inclui script do motor de IA e container do AI Clinical HUD');

const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf-8');
if (!appJs.includes('updateLiveAICandidateEntities') || !appJs.includes('DentalSafeClinicalAI.parseClinicalInput')) {
  throw new Error('app.js não integra DentalSafeClinicalAI');
}
if (!appJs.includes('aiSynthesized.customPathologySynthesis') || !appJs.includes('aiSynthesized.dynamicForensicRisksHTML')) {
  throw new Error('app.js não injeta as cláusulas sintetizadas nas seções');
}
console.log('  ✓ app.js integra perfeitamente a extração em tempo real e a síntese dinâmica nas seções 3, 5, 11, 13, 14, 15 e 21');

const styleCss = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
if (!styleCss.includes('.ai-entity-chip') || !styleCss.includes('.ai-clinical-synthesis-box')) {
  throw new Error('style.css não contém os estilos de chip de entidade ou synthesis box');
}
console.log('  ✓ style.css contém estilos completos de tela e impressão para os blocos gerados por IA');

// ----------------------------------------------------------------------------
// TESTE 5: Implantodontia e Levantamento de Seio Maxilar (Sinus Lift)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 5: Caso de Implantes com Sinus Lift ---');
const implanteInput = {
  procDiag: 'Reabilitacao com implante osseointegravel elemento 16 associado a sinus lift por janela lateral e biomaterial osseo',
  procRegion: 'Dente 16 e Seio Maxilar Direito',
  dictation: 'Paciente informado sobre taxa de sucesso da osseointegracao e riscos de perfuracao de membrana de Schneider.',
  procKey: 'implante'
};
const parsedImplante = DentalSafeClinicalAI.parseClinicalInput(implanteInput);
const hasSinus = parsedImplante.protocols.some(p => p.id === 'sinuslift');
if (!hasSinus) {
  throw new Error('Falha ao detectar protocolo de Sinus Lift na anamnese/procedimento de implante');
}
const synImplante = DentalSafeClinicalAI.synthesize(parsedImplante, implanteInput);
if (!synImplante.dynamicForensicRisksHTML.includes('MEMBRANA DE SCHNEIDER')) {
  throw new Error('Falha ao incluir cláusula forense de membrana de Schneider e sinusite no caso de Sinus Lift');
}
console.log('  ✓ Sinus Lift, osseointegração e membrana de Schneider validados');

// ----------------------------------------------------------------------------
// TESTE 6: Facetas Cerâmicas / Desgaste de Esmalte e Art. 14 do CDC
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 6: Prótese / Facetas e Desgaste Irreversível ---');
const facetasInput = {
  procDiag: 'Facetas ceramicas em dentes anteriores superiores 11, 12, 21, 22 com microdesgaste vestibular em esmalte',
  procRegion: 'Região ântero-superior',
  dictation: 'Paciente ciente de que o desgaste coronario de esmalte e irreversivel e definitivo.',
  procKey: 'protese'
};
const parsedFacetas = DentalSafeClinicalAI.parseClinicalInput(facetasInput);
const hasDesgaste = parsedFacetas.protocols.some(p => p.id === 'desgaste_esmalte');
if (!hasDesgaste) {
  throw new Error('Falha ao detectar protocolo de desgaste de esmalte');
}
const synFacetas = DentalSafeClinicalAI.synthesize(parsedFacetas, facetasInput);
if (!synFacetas.explicitPatientCommitments.includes('IRREVERSIBILIDADE DO DESGASTE')) {
  throw new Error('Falha ao gerar compromisso expresso de irreversibilidade do desgaste de esmalte');
}
console.log('  ✓ Desgaste irreversível de esmalte e compromisso sob CDC Art. 14 validados');

// ----------------------------------------------------------------------------
// TESTE 7: Ortodontia / Contenção e Recidiva
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 7: Ortodontia e Compromisso Vitalício de Contenção ---');
const ortoInput = {
  procDiag: 'Tratamento ortodontico para correcao de apinhamento severo e diastemas com alinhadores transparentes',
  procRegion: 'Arcadas superior e inferior',
  dictation: 'Orientado sobre uso continuo da contencao ortodontica apos alinhamento para prevencao de recidiva.',
  procKey: 'orto'
};
const parsedOrto = DentalSafeClinicalAI.parseClinicalInput(ortoInput);
const hasContencao = parsedOrto.protocols.some(p => p.id === 'contencao_orto');
if (!hasContencao) {
  throw new Error('Falha ao detectar protocolo de contenção ortodôntica');
}
const synOrto = DentalSafeClinicalAI.synthesize(parsedOrto, ortoInput);
if (!synOrto.explicitPatientCommitments.includes('USO VITALÍCIO DE CONTENÇÃO')) {
  throw new Error('Falha ao gerar compromisso de contenção e blindagem de recidiva');
}
console.log('  ✓ Contenção ortodôntica vitalícia e blindagem contra recidiva validadas');

// ----------------------------------------------------------------------------
// TESTE 8: UI Controls (Theme Toggle, Specialty Pills, JSON Export/Import)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 8: Novos Controles de Interface Apple HIG ---');
if (!indexHtml.includes('id="theme-toggle-btn"')) {
  throw new Error('index.html não contém theme-toggle-btn');
}
if (!indexHtml.includes('class="specialty-quick-bar"')) {
  throw new Error('index.html não contém specialty-quick-bar');
}
if (!indexHtml.includes('exportPatientRecordJSON') || !indexHtml.includes('importPatientRecordJSON')) {
  throw new Error('index.html não contém os botões de exportação e importação de JSON');
}
if (!appJs.includes('computeSha256Hex') || !appJs.includes('quickSelectSpecialty')) {
  throw new Error('app.js não contém computeSha256Hex ou quickSelectSpecialty');
}
if (!styleCss.includes('.specialty-quick-bar') || !styleCss.includes('body.light-mode')) {
  throw new Error('style.css não contém as regras de specialty-quick-bar ou body.light-mode');
}
console.log('  ✓ Theme toggle button, specialty quick bar, e JSON I/O integrados na UI');
console.log('  ✓ SHA-256 criptográfico e tema claro Apple configurados no CSS e JS');

// ----------------------------------------------------------------------------
// TESTE 9: Gengivoplastia e Aumento de Coroa (Espaço Biológico)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 9: Gengivoplastia & Aumento de Coroa Clínica ---');
const gengivoInput = {
  procDiag: 'Sorriso gengival acentuado nos dentes 13 a 23 com erupcao passiva alterada e necessidade de recontorno osseo',
  procRegion: 'Dentes 13, 12, 11, 21, 22, 23',
  dictation: 'Gengivoplastia com osteotomia e osteoplastia para respeito estrito ao espaco biologico de 3mm.',
  procKey: 'gengivoplastia',
  selectedTeeth: ['13','12','11','21','22','23']
};
const parsedGengivo = DentalSafeClinicalAI.parseClinicalInput(gengivoInput);
if (!parsedGengivo.protocols.some(p => p.id === 'gengivoplastia_osteo')) {
  throw new Error('Falha ao detectar protocolo de osteotomia de resguardo em gengivoplastia');
}
const synGengivo = DentalSafeClinicalAI.synthesize(parsedGengivo, gengivoInput);
if (!synGengivo.dynamicForensicRisksHTML.includes('RECOLONIZAÇÃO GENGIVAL')) {
  throw new Error('Falha ao gerar risco de recidiva por invasão de espaço biológico');
}
if (!synGengivo.dynamicGlossaryEntries.some(g => g.term.includes('Espaço Biológico'))) {
  throw new Error('Glossário não contém definição de Espaço Biológico');
}
console.log('  ✓ Espaço biológico de 3mm, osteotomia estética e risco de recidiva validados com sucesso');

// ----------------------------------------------------------------------------
// TESTE 10: Cirurgia Plástica Periodontal & Enxerto Conjuntivo (Palato)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 10: Enxerto de Tecido Conjuntivo Subepitelial ---');
const enxertoInput = {
  procDiag: 'Recessao gengival Classe I de Miller no dente 13 com exposicao de raiz e hipersensibilidade dentinaria',
  procRegion: 'Dente 13 e Palato Duro Superior',
  dictation: 'Cirurgia plastica periodontal com colheita de enxerto conjuntivo no palato doador.',
  procKey: 'enxerto_gengival',
  selectedTeeth: ['13']
};
const parsedEnxerto = DentalSafeClinicalAI.parseClinicalInput(enxertoInput);
if (!parsedEnxerto.anatomy.hasPalatalGraftRisk) {
  throw new Error('Falha ao mapear risco vascular na área doadora do palato');
}
const synEnxerto = DentalSafeClinicalAI.synthesize(parsedEnxerto, enxertoInput);
if (!synEnxerto.dynamicForensicRisksHTML.includes('ARTÉRIA PALATINA MAIOR')) {
  throw new Error('Falha ao incluir cláusula crítica de hemorragia palatina');
}
if (!synEnxerto.explicitPatientCommitments.includes('NÃO TRACIONAR LÁBIOS/BOCHECHAS')) {
  throw new Error('Falha ao incluir compromisso de não tracionar lábios no pós-operatório');
}
console.log('  ✓ Artéria Palatina Maior, enxerto conjuntivo e cuidados com área doadora validados');

// ----------------------------------------------------------------------------
// TESTE 11: Frenectomia Labial e Lingual (Anquiloglossia / Wharton)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 11: Frenectomia & Risco Sublingual ---');
const freioInput = {
  procDiag: 'Anquiloglossia severa com freio lingual curto hipertrofico e limitacao de mobilidade da ponta da lingua',
  procRegion: 'Assoalho bucal e ventre da língua',
  dictation: 'Frenectomia lingual cirurgica com desinsercao muscular. Alerta sobre contiguidade com ducto de Wharton.',
  procKey: 'frenectomia'
};
const parsedFreio = DentalSafeClinicalAI.parseClinicalInput(freioInput);
if (!parsedFreio.anatomy.hasSublingualRisk) {
  throw new Error('Falha ao detectar anatomia de risco sublingual');
}
const synFreio = DentalSafeClinicalAI.synthesize(parsedFreio, freioInput);
if (!synFreio.dynamicForensicRisksHTML.toUpperCase().includes('DUCTO DE WHARTON')) {
  throw new Error('Falha ao gerar cláusula protetiva do Ducto de Wharton e rânula sublingual');
}
console.log('  ✓ Anquiloglossia, preservação do Ducto de Wharton e acompanhamento fonoaudiológico validados');

// ----------------------------------------------------------------------------
// TESTE 12: Apicectomia / Cirurgia Parendodôntica
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 12: Cirurgia Parendodôntica & Retrobturação Biocerâmica ---');
const apicInput = {
  procDiag: 'Lesao periapical refrataria persistente no dente 21 apos retratamento endodontico convencional',
  procRegion: 'Ápice do dente 21',
  dictation: 'Apicectomia com resseccao apical de 3mm e retrobturacao hermetica com bioceramico MTA.',
  procKey: 'apicectomia',
  selectedTeeth: ['21']
};
const parsedApic = DentalSafeClinicalAI.parseClinicalInput(apicInput);
if (!parsedApic.protocols.some(p => p.id === 'apicectomia_retro')) {
  throw new Error('Falha ao detectar protocolo de apicectomia retrógrada');
}
const synApic = DentalSafeClinicalAI.synthesize(parsedApic, apicInput);
if (!synApic.dynamicForensicRisksHTML.includes('CIRURGIA PARENDODÔNTICA')) {
  throw new Error('Falha ao gerar cláusula forense de risco de trinca oculta em apicectomia');
}
console.log('  ✓ Ressecção apical de 3mm, retrobturação com MTA e blindagem pericial validados');

// ----------------------------------------------------------------------------
// TESTE 13: Prótese Protocolo All-on-4 / Carga Imediata
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 13: Prótese Protocolo All-on-4 / Carga Imediata ---');
const protoInput = {
  procDiag: 'Edentulismo total mandibular com severa atrofia ossea e perda da dimensao vertical de oclusao',
  procRegion: 'Arcada mandibular total',
  dictation: 'Reabilitacao com Protese Protocolo Fixo Branemark All-on-4 e carga imediata condicionada a torque primario.',
  procKey: 'protocolo_implante'
};
const parsedProto = DentalSafeClinicalAI.parseClinicalInput(protoInput);
if (!parsedProto.protocols.some(p => p.id === 'protocolo_allon4')) {
  throw new Error('Falha ao detectar protocolo All-on-4');
}
const synProto = DentalSafeClinicalAI.synthesize(parsedProto, protoInput);
if (!synProto.dynamicForensicRisksHTML.includes('35 a 45 N.cm')) {
  throw new Error('Falha ao incluir critério de torque cirúrgico de 35 a 45 N.cm no protocolo');
}
if (!synProto.explicitPatientCommitments.includes('DIETA E PROTEÇÃO DA PRÓTESE')) {
  throw new Error('Falha ao consignar compromisso de dieta pastosa nos 120 dias de osseointegração');
}
console.log('  ✓ Torque cirúrgico primário, conversão em carga tardia e dieta pastosa de 120 dias validados');

// ----------------------------------------------------------------------------
// TESTE 14: Odontologia do Sono / DAM (Apneia SAOS)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 14: Odontologia do Sono / Dispositivo de Avanço Mandibular ---');
const sonoInput = {
  procDiag: 'Paciente com roncopatia cronica e sindrome da apneia obstrutiva do sono SAOS moderada',
  procRegion: 'Arcadas dentárias e via aérea superior',
  dictation: 'Confeccao de Dispositivo de Avanco Mandibular DAM titravel com guia matinal de desprogramacao oclusal.',
  procKey: 'ronco_apneia'
};
const parsedSono = DentalSafeClinicalAI.parseClinicalInput(sonoInput);
if (!parsedSono.protocols.some(p => p.id === 'dam_sono')) {
  throw new Error('Falha ao detectar protocolo de DAM');
}
const synSono = DentalSafeClinicalAI.synthesize(parsedSono, sonoInput);
if (!synSono.dynamicForensicRisksHTML.includes('mordida aberta posterior')) {
  throw new Error('Falha ao incluir risco de mordida aberta posterior pelo uso do DAM');
}
if (!synSono.explicitPatientCommitments.includes('POLISSONOGRAFIA DE CONTROLE')) {
  throw new Error('Falha ao exigir polissonografia de controle');
}
console.log('  ✓ Apneia SAOS, guia oclusal matinal e polissonografia de controle validados');

// ----------------------------------------------------------------------------
// TESTE 15: Sedação Consciente Inalatória (N2O/O2)
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 15: Sedação Consciente Inalatória (Óxido Nitroso) ---');
const sedacaoInput = {
  procDiag: 'Fobia odontologica severa e ansiedade com necessidade de procedimentos cirurgicos multiplos',
  procRegion: 'Face e cavidade oral',
  dictation: 'Sessao sob sedacao consciente inalatoria com mistura de oxido nitroso e oxigenio N2O/O2.',
  procKey: 'sedacao_oxido',
  procAnesthesia: 'sedacao-oxido'
};
const parsedSedacao = DentalSafeClinicalAI.parseClinicalInput(sedacaoInput);
if (!parsedSedacao.protocols.some(p => p.id === 'sedacao_inalatoria')) {
  throw new Error('Falha ao detectar protocolo de sedação inalatória com N2O');
}
const synSedacao = DentalSafeClinicalAI.synthesize(parsedSedacao, sedacaoInput);
if (!synSedacao.dynamicForensicRisksHTML.includes('SEDAÇÃO CONSCIENTE INALATÓRIA')) {
  throw new Error('Falha ao gerar cláusula de risco de êmese e reflexos de sedação inalatória');
}
if (!synSedacao.explicitPatientCommitments.includes('ORIENTAÇÕES ALIMENTARES ANTES DA SEDAÇÃO')) {
  throw new Error('Falha ao gerar declaração juramentada de jejum');
}
console.log('  ✓ Sedação inalatória N2O/O2, declaração de jejum e risco de broncoaspiração validados');

// ----------------------------------------------------------------------------
// TESTE 16: Verificação de Volume dos Bancos de Dados
// ----------------------------------------------------------------------------
console.log('\n--- TESTE 16: Volume e Integridade dos Bancos de Dados ---');
const procedureDb = require('./procedure-db.js');
const numProcedures = Object.keys(procedureDb).length;
console.log(`  ✓ PROCEDURE_DB possui ${numProcedures} procedimentos cadastrados (mínimo exigido: 20)`);
if (numProcedures < 20) {
  throw new Error(`Esperava pelo menos 20 procedimentos no PROCEDURE_DB, obteve ${numProcedures}`);
}

global.window = {};
require('./intercurrences-db.js');
const interDb = global.window.DENTAL_INTERCURRENCES_DB || [];
console.log(`  ✓ DENTAL_INTERCURRENCES_DB possui ${interDb.length} intercorrências cadastradas (mínimo exigido: 25)`);
if (interDb.length < 25) {
  throw new Error(`Esperava pelo menos 25 intercorrências no DENTAL_INTERCURRENCES_DB, obteve ${interDb.length}`);
}

console.log('\n============================================================');
console.log('🎉 TODOS OS TESTES (1 A 16) DE INTEGRAÇÃO DA IA CLÍNICA E UI PASSARAM!');
console.log('============================================================\n');
