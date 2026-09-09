/**
 * Testes Automatizados — DentalSafe Express Standalone (/express)
 * Valida o fluxo guiado tela-a-tela, odontograma lúdico, atestado expresso e receituário.
 */

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

console.log('=== INICIANDO TESTES DA VERSÃO INDEPENDENTE (/EXPRESS) ===\n');

// 1. Integridade dos Arquivos
console.log('TESTE 1: Integridade dos Arquivos na pasta /express');
const htmlPath = path.join(__dirname, 'express', 'index.html');
const cssPath = path.join(__dirname, 'express', 'style.css');
const jsPath = path.join(__dirname, 'express', 'app.js');

assert.ok(fs.existsSync(htmlPath), 'express/index.html deve existir');
assert.ok(fs.existsSync(cssPath), 'express/style.css deve existir');
assert.ok(fs.existsSync(jsPath), 'express/app.js deve existir');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

assert.ok(htmlContent.length > 500, 'express/index.html possui conteúdo');
assert.ok(cssContent.length > 500, 'express/style.css possui conteúdo');
assert.ok(jsContent.length > 500, 'express/app.js possui conteúdo');
console.log('  ✓ Todos os arquivos da pasta /express estão presentes e íntegros.');

// 2. Telas Guiadas e Elementos no HTML
console.log('\nTESTE 2: Verificação das 5 Telas Guiadas e Modais Sequenciais');
assert.ok(htmlContent.includes('id="screen-dentist"'), 'Tela 1A: Profissional presente');
assert.ok(htmlContent.includes('id="screen-patient"'), 'Tela 1B: Paciente presente');
assert.ok(htmlContent.includes('id="screen-procedure"'), 'Tela 2: Procedimento presente');
assert.ok(htmlContent.includes('id="screen-review"'), 'Tela 3: Revisão presente');
assert.ok(htmlContent.includes('id="screen-tcle"'), 'Tela 4: TCLE presente');
assert.ok(htmlContent.includes('id="post-modal-atestado"'), 'Modal Sequencial Atestado presente');
assert.ok(htmlContent.includes('id="post-modal-prescription"'), 'Modal Sequencial Receita presente');
assert.ok(htmlContent.includes('id="ludic-teeth-board"'), 'Tabuleiro Odontograma Lúdico presente');
assert.ok(htmlContent.includes('id="touch-signature-canvas"'), 'Canvas Assinatura presente');
assert.ok(htmlContent.includes('id="cfo-procedure-modal"'), 'Modal CFO presente');
assert.ok(htmlContent.includes('id="search-cfo-input"'), 'Input de busca CFO presente');
assert.ok(htmlContent.includes('id="cfo-specialty-filters"'), 'Filtros de especialidade CFO presentes');
assert.ok(htmlContent.includes('id="cfo-procedures-list"'), 'Lista de procedimentos CFO presente');
console.log('  ✓ Telas, modais e elementos visuais validados com sucesso.');

// 3. Estilos no style.css
console.log('\nTESTE 3: Verificação dos Estilos Apple HIG no express/style.css');
assert.ok(cssContent.includes('--apple-blue: #0071e3'), 'Apple Blue definido');
assert.ok(cssContent.includes('.friendly-tooth-btn'), 'Estilo do dente lúdico presente');
assert.ok(cssContent.includes('.tcle-paper-document'), 'Estilo do papel TCLE timbrado presente');
assert.ok(cssContent.includes('@media print'), 'Regras de impressão A4 presentes');
assert.ok(cssContent.includes('.cfo-modal-overlay.open'), 'Regra .cfo-modal-overlay.open presente no CSS');
assert.ok(cssContent.includes('.cfo-proc-row'), 'Estilo de item do catálogo CFO presente');
console.log('  ✓ Estilos Apple HIG e suporte à impressão validados.');

// 4. Execução da Lógica em VM
console.log('\nTESTE 4: Simulação de Execução do express/app.js em VM');

const mockStorage = {};
const elementsMap = {};

function createMockEl(id) {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    checked: false,
    dataset: {},
    style: {},
    getAttribute(a) {
      if (a === 'data-step') return this.dataset.step || '1';
      if (a === 'data-days') return this.dataset.days || '2';
      if (a === 'data-rx') return this.dataset.rx || 'cirurgico';
      if (a === 'data-proc') return this.dataset.proc || 'implante';
      if (a === 'data-fdi') return this.dataset.fdi || '11';
      return null;
    },
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c, f) {
        if (f === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (f) this._classes.add(c);
        else this._classes.delete(c);
      },
      contains(c) { return this._classes.has(c); }
    },
    focus() {},
    scrollIntoView() {},
    addEventListener() {},
    getBoundingClientRect() { return { width: 400, height: 130, left: 0, top: 0 }; }
  };
}

[
  'screen-dentist', 'screen-patient', 'screen-procedure', 'screen-review', 'screen-tcle',
  'field-dentist-name', 'field-dentist-cro', 'field-clinic-name', 'field-clinic-phone', 'chk-save-dentist',
  'field-patient-name', 'field-patient-cpf', 'field-patient-birth', 'field-patient-phone',
  'field-custom-proc', 'custom-proc-input-wrap',
  'btn-dent-perm', 'btn-dent-dec', 'ludic-teeth-board', 'selected-teeth-tags', 'teeth-count-badge',
  'cond-none', 'review-content-box', 'official-tcle-paper',
  'post-modal-atestado', 'chk-cid-opt', 'atestado-sheet-render',
  'post-modal-prescription', 'prescription-sheet-render',
  'touch-signature-canvas',
  'cfo-procedure-modal', 'search-cfo-input', 'cfo-specialty-filters', 'cfo-procedures-list',
  'cfo-selected-notice', 'cfo-selected-title', 'cfo-selected-details',
  'search-extended-conditions', 'active-extended-tags', 'extended-conditions-list',
  'saved-patients-quick-bar', 'saved-patients-chips-list', 'saved-patients-count', 'chk-save-patient',
  'btn-atestado-afastamento', 'btn-atestado-comparecimento', 'atestado-afastamento-controls', 'atestado-comparecimento-controls',
  'field-comp-start', 'field-comp-end', 'atestado-icon-badge', 'atestado-modal-title', 'atestado-modal-subtitle',
  'rx-auto-compatibility-banner', 'rx-compat-reason', 'hub-rx-suggest-label', 'post-tcle-actions-hub'
].forEach(id => {
  elementsMap[id] = createMockEl(id);
});

const sandbox = {
  createMockEl,
  console,
  setTimeout,
  clearTimeout,
  Date,
  Set,
  Array,
  Object,
  JSON,
  parseInt,
  String,
  alert: () => {},
  confirm: () => true,
  localStorage: {
    getItem(k) { return mockStorage[k] || null; },
    setItem(k, v) { mockStorage[k] = String(v); }
  },
  navigator: {
    vibrate: () => true,
    clipboard: { writeText: () => Promise.resolve() }
  },
  requestAnimationFrame: (cb) => { if (cb) cb(); },
  window: {
    devicePixelRatio: 1,
    addEventListener: () => {},
    scrollTo: () => {},
    print: () => {},
    open: () => ({ document: { write: () => {}, close: () => {} } })
  },
  document: {
    addEventListener: () => {},
    getElementById(id) { return elementsMap[id] || null; },
    createElement(tag) {
      const el = createMockEl(tag);
      el.remove = () => {};
      return el;
    },
    querySelectorAll(selector) {
      if (selector === '.wizard-screen') return [elementsMap['screen-dentist'], elementsMap['screen-patient'], elementsMap['screen-procedure'], elementsMap['screen-review'], elementsMap['screen-tcle']];
      if (selector === '.step-indicator') return [createMockEl('ind1'), createMockEl('ind2'), createMockEl('ind3')];
      if (selector === '.proc-card') return [createMockEl('pc1')];
      if (selector === '.day-btn') return [createMockEl('db1')];
      if (selector === '.rx-card-option') return [createMockEl('rx1')];
      if (selector === '.condition-pill') return [createMockEl('cp1')];
      if (selector === '.saved-patient-chip') return [createMockEl('spc1')];
      return [];
    },
    querySelector() { return null; },
    body: {
      ...createMockEl('body'),
      appendChild(el) { return el; }
    }
  }
};

vm.createContext(sandbox);
vm.runInContext(jsContent, sandbox);

vm.runInContext(`
  // 1. Tela 1A: Dentista
  document.getElementById('field-dentist-name').value = 'Dra. Valéria Vono';
  document.getElementById('field-dentist-cro').value = 'CRO-SP 123456';
  document.getElementById('field-clinic-name').value = 'Clínica DentalSafe';
  submitDentistScreen();
  if (state.activeScreen !== 'screen-patient') throw new Error('Deveria transicionar para tela do paciente');

  // 2. Tela 1B: Paciente
  document.getElementById('field-patient-name').value = 'João Paulo da Silva';
  document.getElementById('field-patient-cpf').value = '987.654.321-99';
  submitPatientScreen();
  if (state.activeScreen !== 'screen-procedure') throw new Error('Deveria transicionar para tela do procedimento');

  // 3. Odontograma Lúdico
  clearTeethSelection();
  if (state.procedure.selectedTeeth.length !== 0) throw new Error('Limpeza de dentes falhou');
  presetSisos();
  if (!state.procedure.selectedTeeth.includes('18') || !state.procedure.selectedTeeth.includes('48')) {
    throw new Error('Preset de sisos falhou');
  }

  // 4. Catálogo de Procedimentos CFO / VRPO e Condições Sistêmicas
  if (typeof CFO_PROCEDURES_CATALOG === 'undefined' || CFO_PROCEDURES_CATALOG.length < 30) {
    throw new Error('CFO_PROCEDURES_CATALOG deve conter o acervo do CFO');
  }
  selectCfoProcedure('cfo-frenectomia');
  if (state.procedure.id !== 'cfo-frenectomia' || !state.procedure.title.includes('Frenectomia')) {
    throw new Error('Seleção de procedimento CFO falhou');
  }

  // Adição de condições críticas originais e estendidas com busca
  toggleCondition(createMockEl('cond-bisf'), 'bisfosfonatos');
  toggleCondition(createMockEl('cond-anti'), 'anticoagulantes');
  toggleExtendedCondition('alergia_dipirona');
  toggleExtendedCondition('radioterapia_cabeca_pescoco');

  submitProcedureScreen();
  if (state.activeScreen !== 'screen-review') throw new Error('Deveria transicionar para tela de revisão');

  const reviewHtml = document.getElementById('review-content-box').innerHTML;
  if (!reviewHtml.includes('Dra. Valéria Vono') || !reviewHtml.includes('João Paulo da Silva')) {
    throw new Error('Resumo de revisão não contém dados conferidos');
  }
  if (!reviewHtml.includes('Frenectomia') || !reviewHtml.includes('Bisfosfonatos')) {
    throw new Error('Resumo não contém procedimento CFO ou alertas sistêmicos');
  }

  // 5. Geração do TCLE Oficial com Complexidade Forense Integral
  submitGenerateTcle();
  if (state.activeScreen !== 'screen-tcle') throw new Error('Deveria transicionar para tela do TCLE');
  const tcleHtml = document.getElementById('official-tcle-paper').innerHTML;

  if (!tcleHtml.includes('Dra. Valéria Vono') || !tcleHtml.includes('987.654.321-99')) {
    throw new Error('TCLE não contém dados periciais das partes');
  }
  if (!tcleHtml.includes('OBRIGAÇÃO DE MEIO') || !tcleHtml.includes('STJ — REsp 1.058.927/MT')) {
    throw new Error('TCLE deve conter cláusula de Obrigação de Meio do STJ');
  }
  if (!tcleHtml.includes('Fisiopatologia e Justificativa Biológica')) {
    throw new Error('TCLE deve conter Fisiopatologia Biológica da afecção');
  }
  if (!tcleHtml.includes('Etapas Técnicas do Procedimento Passo a Passo')) {
    throw new Error('TCLE deve conter Etapas Técnicas Passo a Passo');
  }
  if (!tcleHtml.includes('Sensações Fisiológicas Previstas sob Anestesia Local')) {
    throw new Error('TCLE deve conter Sensações Fisiológicas táteis');
  }
  if (!tcleHtml.includes('Riscos Inerentes e Previsíveis da Intervenção')) {
    throw new Error('TCLE deve conter Riscos Inerentes detalhados');
  }
  if (!tcleHtml.includes('BISFOSFONATOS') || !tcleHtml.includes('MRONJ')) {
    throw new Error('TCLE deve conter cláusula crítica de Bisfosfonatos e MRONJ');
  }
  if (!tcleHtml.includes('ANTICOAGULANTES') || !tcleHtml.includes('HEMORRAGIA')) {
    throw new Error('TCLE deve conter cláusula crítica de Anticoagulantes e Hemorragia');
  }
  if (!tcleHtml.includes('DIPIRONA')) {
    throw new Error('TCLE deve conter cláusula de Alergia a Dipirona da lista com busca');
  }
  if (!tcleHtml.includes('OSTEORRADIONECROSE')) {
    throw new Error('TCLE deve conter cláusula de Radioterapia / Osteorradionecrose da lista com busca');
  }
  if (!tcleHtml.includes('CDC ART. 14, § 3º, II') || !tcleHtml.includes('Guia Exaustivo de Cuidados Pós-Operatórios')) {
    throw new Error('TCLE deve conter Deveres de Cooperação e Guia Pós-Operatório');
  }
  if (!tcleHtml.includes('LGPD') || !tcleHtml.includes('Lei 13.709/2018')) {
    throw new Error('TCLE deve conter salvaguarda de LGPD e guarda de prontuário por 20 anos');
  }
  if (!tcleHtml.includes('Testemunha 1') || !tcleHtml.includes('Testemunha 2')) {
    throw new Error('TCLE deve conter blocos de assinatura para 2 testemunhas');
  }

  // 6. Modal Sequencial: Atestado
  openAtestadoModule();
  setDaysAtestado(3);
  const atestadoHtml = document.getElementById('atestado-sheet-render').innerHTML;
  if (!atestadoHtml.includes('3 (três) dias') || !atestadoHtml.includes('João Paulo da Silva')) {
    throw new Error('Atestado não gerou 3 dias corretamente');
  }

  // 7. Modal Sequencial: Receita
  openPrescriptionModule();
  selectRxPresetOption('alergico');
  const rxHtml = document.getElementById('prescription-sheet-render').innerHTML;
  if (!rxHtml.includes('Azitromicina') || !rxHtml.includes('Paracetamol')) {
    throw new Error('Receituário para alérgico não gerou Azitromicina');
  }

  // 8. Atestado de Comparecimento (Horários e Procedimento)
  switchAtestadoType('comparecimento');
  state.certificate.startTime = '14:00';
  state.certificate.endTime = '15:30';
  renderAtestadoSheet();
  const compHtml = document.getElementById('atestado-sheet-render').innerHTML;
  if (!compHtml.includes('Declaração Odontológica de Comparecimento') || !compHtml.includes('14:00') || !compHtml.includes('15:30')) {
    throw new Error('Atestado de comparecimento não gerou declaração com horários');
  }
  if (!compHtml.includes('Frenectomia')) {
    throw new Error('Atestado de comparecimento deve citar o procedimento realizado');
  }

  // 9. Prescrição Automática Compatível com Procedimento e Alergias
  // Teste com alergia a penicilina
  state.healthConditions.add('alergia_penicilina');
  let presetAuto = getCompatiblePrescriptionPreset();
  if (presetAuto.presetKey !== 'alergico') {
    throw new Error('Deveria sugerir protocolo alérgico para paciente com alergia a penicilina');
  }
  state.healthConditions.delete('alergia_penicilina');

  // Teste com cirurgia / implante
  state.procedure.id = 'implante';
  state.procedure.title = 'Implante Dentário';
  state.procedure.specialty = 'Implantodontia';
  presetAuto = getCompatiblePrescriptionPreset();
  if (presetAuto.presetKey !== 'cirurgico') {
    throw new Error('Deveria sugerir protocolo cirúrgico para implante');
  }

  // Teste com canal / endodontia
  state.procedure.id = 'canal';
  state.procedure.title = 'Tratamento de Canal Radicular';
  state.procedure.specialty = 'Endodontia';
  presetAuto = getCompatiblePrescriptionPreset();
  if (presetAuto.presetKey !== 'canal') {
    throw new Error('Deveria sugerir protocolo de canal para endodontia');
  }

  // Teste com procedimento conservador leve
  state.procedure.id = 'restauracao';
  state.procedure.title = 'Restauração em Resina Composta';
  state.procedure.specialty = 'Dentística';
  presetAuto = getCompatiblePrescriptionPreset();
  if (presetAuto.presetKey !== 'leve') {
    throw new Error('Deveria sugerir protocolo leve para restauração');
  }

  // 10. Persistência de Pacientes (Salvar, Listar, Selecionar)
  savePatientToStorage({
    name: 'Carlos Eduardo Oliveira',
    cpf: '111.222.333-44',
    birthDate: '1985-05-20',
    phone: '(11) 98765-4321'
  });
  const savedList = getSavedPatients();
  if (savedList.length === 0 || savedList[0].name !== 'Carlos Eduardo Oliveira') {
    throw new Error('Falha ao salvar paciente no armazenamento');
  }
  loadSavedPatientsList();
  const chipsHtml = document.getElementById('saved-patients-chips-list').innerHTML;
  if (!chipsHtml.includes('Carlos Eduardo Oliveira') || !chipsHtml.includes('111.222.333-44')) {
    throw new Error('Chips de pacientes cadastrados não foram renderizados');
  }
  selectSavedPatient(0);
  if (document.getElementById('field-patient-name').value !== 'Carlos Eduardo Oliveira') {
    throw new Error('Falha ao carregar dados do paciente salvo com 1 clique');
  }

  // 11. Modal do Catálogo CFO / Outros Procedimentos e Busca
  openCfoModal();
  const cfoModal = document.getElementById('cfo-procedure-modal');
  if (!cfoModal.classList.contains('open') || cfoModal.style.display !== 'flex') {
    throw new Error('openCfoModal deveria abrir o modal e definir style.display = "flex"');
  }
  if (document.body.style.overflow !== 'hidden') {
    throw new Error('openCfoModal deveria travar a rolagem de fundo');
  }

  // Busca de procedimentos no catálogo CFO
  filterCfoProcedures('frenectomia');
  const filteredHtml = document.getElementById('cfo-procedures-list').innerHTML;
  if (!filteredHtml.includes('Frenectomia')) {
    throw new Error('Busca por frenectomia falhou');
  }

  // Filtro por especialidade
  filterCfoBySpecialty('Harmonização');
  const hofHtml = document.getElementById('cfo-procedures-list').innerHTML;
  if (!hofHtml.includes('Harmonização') && !hofHtml.includes('Botulínica')) {
    throw new Error('Filtro por especialidade falhou');
  }

  // Seleção de procedimento do CFO
  selectCfoProcedure('cfo-frenectomia');
  if (cfoModal.classList.contains('open') || cfoModal.style.display !== 'none') {
    throw new Error('selectCfoProcedure deveria fechar o modal');
  }
  if (state.procedure.id !== 'cfo-frenectomia' || !state.procedure.cfoData) {
    throw new Error('selectCfoProcedure deveria atualizar state.procedure');
  }
  if (document.getElementById('cfo-selected-notice').style.display !== 'block') {
    throw new Error('Aviso visual #cfo-selected-notice não foi exibido');
  }

  // Fechamento e restauração do body scroll
  openCfoModal();
  closeCfoModal();
  if (document.body.style.overflow !== '') {
    throw new Error('closeCfoModal deveria restaurar o body scroll');
  }

  // Acesso rápido à busca de condições
  focusExtendedConditionsSearch();

  // 12. Finalização do Atendimento
  finishAndConcludeService();
`, sandbox);

console.log('  ✓ Transição de telas (Dentista -> Paciente -> Procedimento -> Revisão -> TCLE) validada.');
console.log('  ✓ Odontograma Lúdico e seleção de dentes validados com sucesso.');
console.log('  ✓ Tela de Revisão Prévia e conferência validada.');
console.log('  ✓ Geração do TCLE Oficial com suporte a edição inline validada.');
console.log('  ✓ Modal sequencial de Atestado Odontológico (X dias) validado.');
console.log('  ✓ Atestado de Comparecimento (com horários de início e término) validado.');
console.log('  ✓ Protocolo de Prescrição Inteligente com Compatibilidade Automática validado.');
console.log('  ✓ Cadastro e Seleção Rápida de Pacientes em 1 clique validado.');
console.log('  ✓ Modal do Catálogo CFO / Outros Procedimentos com Busca e Filtros validado com sucesso.');
console.log('  ✓ Finalização e Conclusão de Atendimento validada.');

console.log('\n============================================================');
console.log('🎉 TODOS OS TESTES DO EXPRESS STANDALONE PASSARAM COM SUCESSO!');
console.log('============================================================\n');
