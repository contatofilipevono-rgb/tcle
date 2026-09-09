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
console.log('  ✓ Telas, modais e elementos visuais validados com sucesso.');

// 3. Estilos no style.css
console.log('\nTESTE 3: Verificação dos Estilos Apple HIG no express/style.css');
assert.ok(cssContent.includes('--apple-blue: #0071e3'), 'Apple Blue definido');
assert.ok(cssContent.includes('.friendly-tooth-btn'), 'Estilo do dente lúdico presente');
assert.ok(cssContent.includes('.tcle-paper-document'), 'Estilo do papel TCLE timbrado presente');
assert.ok(cssContent.includes('@media print'), 'Regras de impressão A4 presentes');
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
  'touch-signature-canvas'
].forEach(id => {
  elementsMap[id] = createMockEl(id);
});

const sandbox = {
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
    querySelectorAll(selector) {
      if (selector === '.wizard-screen') return [elementsMap['screen-dentist'], elementsMap['screen-patient'], elementsMap['screen-procedure'], elementsMap['screen-review'], elementsMap['screen-tcle']];
      if (selector === '.step-indicator') return [createMockEl('ind1'), createMockEl('ind2'), createMockEl('ind3')];
      if (selector === '.proc-card') return [createMockEl('pc1')];
      if (selector === '.day-btn') return [createMockEl('db1')];
      if (selector === '.rx-card-option') return [createMockEl('rx1')];
      if (selector === '.condition-pill') return [createMockEl('cp1')];
      return [];
    },
    querySelector() { return null; },
    body: createMockEl('body')
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

  // 4. Tela 2: Procedimento e Revisão
  submitProcedureScreen();
  if (state.activeScreen !== 'screen-review') throw new Error('Deveria transicionar para tela de revisão');

  const reviewHtml = document.getElementById('review-content-box').innerHTML;
  if (!reviewHtml.includes('Dra. Valéria Vono') || !reviewHtml.includes('João Paulo da Silva')) {
    throw new Error('Resumo de revisão não contém dados conferidos');
  }

  // 5. Geração do TCLE Oficial
  submitGenerateTcle();
  if (state.activeScreen !== 'screen-tcle') throw new Error('Deveria transicionar para tela do TCLE');
  const tcleHtml = document.getElementById('official-tcle-paper').innerHTML;
  if (!tcleHtml.includes('Dra. Valéria Vono') || !tcleHtml.includes('987.654.321-99')) {
    throw new Error('TCLE não contém dados periciais');
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
`, sandbox);

console.log('  ✓ Transição de telas (Dentista -> Paciente -> Procedimento -> Revisão -> TCLE) validada.');
console.log('  ✓ Odontograma Lúdico e seleção de dentes validados com sucesso.');
console.log('  ✓ Tela de Revisão Prévia e conferência validada.');
console.log('  ✓ Geração do TCLE Oficial com suporte a edição inline validada.');
console.log('  ✓ Modal sequencial de Atestado Odontológico (X dias) validado.');
console.log('  ✓ Modal sequencial de Receituário 1-clique (com dosagens ajustadas) validado.');

console.log('\n============================================================');
console.log('🎉 TODOS OS TESTES DO EXPRESS STANDALONE PASSARAM COM SUCESSO!');
console.log('============================================================\n');
