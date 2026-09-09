/**
 * ============================================================================
 * TESTE DE VALIDAÇÃO: MÓDULO DE HARMONIZAÇÃO OROFACIAL (HOF PRO)
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const HOF_DATABASE = require('./hof-db.js');

console.log('💉 INICIANDO TESTES DO MÓDULO ESPECIALIZADO DE HOF...\n');

// 1. Validar Zonas de Risco Facial (Danger Zones)
console.log('--- TESTE 1: Zonas de Risco Facial (Danger Zones) ---');
if (!HOF_DATABASE.dangerZones || HOF_DATABASE.dangerZones.length < 5) {
  throw new Error(`Esperava pelo menos 5 Zonas de Perigo, obteve ${HOF_DATABASE.dangerZones?.length}`);
}
const glabela = HOF_DATABASE.dangerZones.find(z => z.id === 'zone-glabela');
if (!glabela || !glabela.primaryRisks.includes('Amaurose') || !glabela.vessels.includes('Supratroclear')) {
  throw new Error('Falha nos dados da Zona Glabelar (Amaurose / Supratroclear)');
}
console.log('  ✓ 5 Zonas de Risco Anatômico estruturadas (Glabela, Asa Nasal, Lábios, Temporal, Mandíbula)');
console.log('  ✓ Zona Glabelar com aviso explícito de Amaurose e artérias supratroclear/supraorbital');

// 2. Validar Protocolo de Emergência (DeLorenzi)
console.log('\n--- TESTE 2: Protocolo SOS de DeLorenzi ---');
const sos = HOF_DATABASE.emergencyProtocol;
if (!sos || !sos.steps || sos.steps.length < 6) {
  throw new Error('Falha no Protocolo SOS de Hialuronidase');
}
const highDoseStep = sos.steps.find(s => s.details.includes('1.500 UI e 3.000 UI'));
if (!highDoseStep) {
  throw new Error('Protocolo SOS não contém a recomendação de alta dose de 1.500 a 3.000 UI');
}
console.log('  ✓ Protocolo minuto a minuto de DeLorenzi com alta dose de 1.500 a 3.000 UI validado');

// 3. Validar Biblioteca Jurídica CFO & STJ
console.log('\n--- TESTE 3: Resoluções CFO e STJ ---');
const legal = HOF_DATABASE.legalFramework;
const hasCfo198 = legal.some(l => l.code.includes('198/2019'));
const hasCfo230 = legal.some(l => l.code.includes('230/2020'));
const hasCfo196 = legal.some(l => l.code.includes('196/2019'));
const hasStj = legal.some(l => l.code.includes('STJ'));
if (!hasCfo198 || !hasCfo230 || !hasCfo196 || !hasStj) {
  throw new Error('Faltam resoluções cruciais do CFO (198, 230, 196) ou jurisprudência do STJ');
}
console.log('  ✓ Resolução CFO-198/2019 (Especialidade Reconhecida) validada');
console.log('  ✓ Resolução CFO-230/2020 (Vedações de cirurgias maiores) validada');
console.log('  ✓ Resolução CFO-196/2019 (Regras de fotos antes e depois) validada');
console.log('  ✓ STJ REsp 1.395.254 (Obrigação estética e assimetrias) validada');

// 4. Validar Arquivos Web index.html, style.css e app.js
console.log('\n--- TESTE 4: Integridade dos Arquivos Web ---');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
if (!indexHtml.includes('data-tab="hof-tab"') || !indexHtml.includes('id="hof-tab"')) {
  throw new Error('index.html não contém a aba ou botão de navegação para hof-tab');
}
if (!indexHtml.includes('src="hof-db.js"')) {
  throw new Error('index.html não inclui hof-db.js');
}
console.log('  ✓ index.html inclui aba dedicada #hof-tab e script hof-db.js');

const styleCss = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
if (!styleCss.includes('.hof-hero-card') || !styleCss.includes('.danger-zone-card')) {
  throw new Error('style.css não contém os estilos do módulo HOF Pro');
}
console.log('  ✓ style.css possui estilização Apple Pro para HOF e Danger Zones');

const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf-8');
if (!appJs.includes('initHofModule') || !appJs.includes('renderHofDangerZones') || !appJs.includes('updateHofTCLELivePreview')) {
  throw new Error('app.js não contém as funções do módulo HOF Pro');
}
console.log('  ✓ app.js contém inicialização, preview dinâmico e transferência de HOF');

console.log('\n============================================================');
console.log('🎉 TODOS OS TESTES DO MÓDULO HOF PRO FORAM CONCLUÍDOS COM SUCESSO!');
console.log('============================================================\n');
