/**
 * Testes Automatizados — Módulo DentalSafe Express
 * Valida integridade do HTML, CSS, compilação e execução lógica do Express em 3 passos.
 */

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

console.log('=== INICIANDO TESTES DO MÓDULO DENTALSAFE EXPRESS (APPLE HIG 3-PASSOS) ===\n');

// 1. Integridade dos Arquivos
console.log('TESTE 1: Integridade dos Arquivos Criados');
const htmlPath = path.join(__dirname, 'express.html');
const cssPath = path.join(__dirname, 'express.css');
const jsPath = path.join(__dirname, 'express.js');

assert.ok(fs.existsSync(htmlPath), 'express.html deve existir');
assert.ok(fs.existsSync(cssPath), 'express.css deve existir');
assert.ok(fs.existsSync(jsPath), 'express.js deve existir');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

assert.ok(htmlContent.length > 500, 'express.html possui conteúdo');
assert.ok(cssContent.length > 500, 'express.css possui conteúdo');
assert.ok(jsContent.length > 500, 'express.js possui conteúdo');
console.log('  ✓ Arquivos express.html, express.css e express.js verificados com sucesso.');

// 2. Elementos Essenciais do HTML
console.log('\nTESTE 2: Elementos Essenciais de Interface no express.html');
assert.ok(htmlContent.includes('id="wizard-step-1"'), 'Passo 1 presente');
assert.ok(htmlContent.includes('id="wizard-step-2"'), 'Passo 2 presente');
assert.ok(htmlContent.includes('id="wizard-step-3"'), 'Passo 3 presente');
assert.ok(htmlContent.includes('id="exp-dentist-name"'), 'Campo Nome Dentista presente');
assert.ok(htmlContent.includes('id="exp-dentist-cro"'), 'Campo CRO presente');
assert.ok(htmlContent.includes('id="exp-patient-name"'), 'Campo Nome Paciente presente');
assert.ok(htmlContent.includes('id="exp-patient-cpf"'), 'Campo CPF Paciente presente');
assert.ok(htmlContent.includes('id="odonto-board-content"'), 'Tabuleiro do Odontograma Lúdico presente');
assert.ok(htmlContent.includes('id="atestado-preview-render"'), 'Módulo de Atestado presente');
assert.ok(htmlContent.includes('id="rx-preview-render"'), 'Módulo de Receita 1-clique presente');
assert.ok(htmlContent.includes('id="sig-canvas"'), 'Canvas de Assinatura Touch/Mouse presente');
console.log('  ✓ Todos os 10 elementos estruturais do wizard em 3 passos confirmados.');

// 3. Estilização Apple HIG no express.css
console.log('\nTESTE 3: Regras de Estilo Apple HIG no express.css');
assert.ok(cssContent.includes('--apple-blue: #0071e3'), 'Cor primária Apple Blue definida');
assert.ok(cssContent.includes('.ludic-tooth'), 'Classe do dente lúdico definida');
assert.ok(cssContent.includes('.tcle-official-sheet'), 'Folha oficial do TCLE estilizada');
assert.ok(cssContent.includes('.signature-pad-wrap'), 'Área de assinatura digital presente');
assert.ok(cssContent.includes('@media print'), 'Regras de impressão A4 configuradas');
console.log('  ✓ Estilos Apple HIG, Odontograma Lúdico e Impressão A4 validados.');

// 4. Execução e Lógica do express.js em VM Simulada
console.log('\nTESTE 4: Simulação e Execução do express.js em VM');

// Criação do DOM mínimo para a VM
const mockLocalStorage = {};
const mockElements = {};

function createMockElement(id) {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    checked: false,
    dataset: {},
    getAttribute(attr) {
      if (attr.startsWith('data-')) {
        const key = attr.slice(5);
        return this.dataset[key] || null;
      }
      return null;
    },
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c, force) { 
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) this._classes.add(c);
        else this._classes.delete(c);
      },
      contains(c) { return this._classes.has(c); }
    },
    addEventListener() {},
    focus() {},
    getBoundingClientRect() { return { width: 400, height: 140, left: 0, top: 0 }; }
  };
}

const elementIds = [
  'exp-dentist-name', 'exp-dentist-cro', 'exp-clinic-name', 'exp-clinic-phone',
  'exp-patient-name', 'exp-patient-cpf', 'exp-patient-birth', 'exp-patient-phone',
  'exp-custom-proc-title', 'exp-custom-proc-wrap',
  'btn-mode-perm', 'btn-mode-dec',
  'odonto-board-content', 'selected-teeth-chips-wrap', 'selected-teeth-count',
  'chip-cond-none', 'tcle-document-render',
  'atestado-preview-render', 'rx-preview-render',
  'sig-canvas', 'chk-include-cid'
];

elementIds.forEach(id => {
  mockElements[id] = createMockElement(id);
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
    getItem(k) { return mockLocalStorage[k] || null; },
    setItem(k, v) { mockLocalStorage[k] = String(v); }
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
    getElementById(id) { return mockElements[id] || null; },
    querySelectorAll(selector) {
      if (selector === '.step-item') return [createMockElement('s1'), createMockElement('s2'), createMockElement('s3')];
      if (selector === '.wizard-step') return [createMockElement('w1'), createMockElement('w2'), createMockElement('w3')];
      if (selector === '.proc-chip-card') return [createMockElement('p1')];
      if (selector === '.day-chip') return [createMockElement('d1')];
      if (selector === '.rx-preset-chip') return [createMockElement('r1')];
      if (selector === '.health-toggle-chip') return [createMockElement('h1')];
      return [];
    },
    querySelector() { return null; },
    body: createMockElement('body')
  }
};

vm.createContext(sandbox);
vm.runInContext(jsContent, sandbox);

// Validações dentro da VM
vm.runInContext(`
  // 1. Validação de rejeição de campos vazios
  const validEmpty = validateStep1();
  if (validEmpty !== false) throw new Error('validateStep1 deveria falhar com campos vazios');

  // 2. Preenchimento de dados válidos
  document.getElementById('exp-dentist-name').value = 'Dr. Filipe Vono';
  document.getElementById('exp-dentist-cro').value = 'CRO-SP 998877';
  document.getElementById('exp-clinic-name').value = 'Clínica DentalSafe';
  document.getElementById('exp-patient-name').value = 'Carlos Eduardo Silveira';
  document.getElementById('exp-patient-cpf').value = '123.456.789-00';
  document.getElementById('exp-patient-phone').value = '(11) 98877-6655';

  const validFilled = validateStep1();
  if (validFilled !== true) throw new Error('validateStep1 deveria passar com dados preenchidos');

  // 3. Teste do Odontograma Lúdico
  expressClearTeeth();
  if (expressState.procedure.selectedTeeth.length !== 0) throw new Error('Limpar dentes falhou');

  expressPresetSisos();
  if (!expressState.procedure.selectedTeeth.includes('18') || !expressState.procedure.selectedTeeth.includes('28')) {
    throw new Error('Preset de sisos falhou');
  }

  // 4. Teste de Dentição Decídua
  setOdontoDentition('deciduo');
  if (expressState.procedure.dentitionMode !== 'deciduo') throw new Error('Alternar para decíduo falhou');
  setOdontoDentition('permanente');

  // 5. Teste de Geração do TCLE Oficial
  generateOfficialTcle();
  const tcleHtml = document.getElementById('tcle-document-render').innerHTML;
  if (!tcleHtml.includes('Dr. Filipe Vono') || !tcleHtml.includes('Carlos Eduardo Silveira') || !tcleHtml.includes('123.456.789-00')) {
    throw new Error('TCLE gerado não contém os dados do paciente ou cirurgião');
  }
  if (!tcleHtml.includes('18, 28, 38, 48')) {
    throw new Error('TCLE gerado não contém os elementos dentais selecionados');
  }

  // 6. Teste de Geração do Atestado
  setAtestadoDays(5);
  const atestadoHtml = document.getElementById('atestado-preview-render').innerHTML;
  if (!atestadoHtml.includes('5 (cinco) dias') || !atestadoHtml.includes('Carlos Eduardo Silveira')) {
    throw new Error('Atestado não gerou os 5 dias ou nome do paciente');
  }

  // 7. Teste de Prescrição Odontológica
  selectRxPreset('alergico');
  const rxHtml = document.getElementById('rx-preview-render').innerHTML;
  if (!rxHtml.includes('Azitromicina') || !rxHtml.includes('Paracetamol')) {
    throw new Error('Prescrição para alérgico não gerou Azitromicina');
  }
`, sandbox);

console.log('  ✓ Validações do formulário funcionam perfeitamente.');
console.log('  ✓ Odontograma Lúdico: seleção, atalho de sisos e alternância de dentição validados.');
console.log('  ✓ Geração do TCLE Oficial com dados periciais e elementos dentais validada.');
console.log('  ✓ Atestado Odontológico com cálculo de dias e renderização validado.');
console.log('  ✓ Receituário 1-clique com troca de presets clínicos validado.');

console.log('\n============================================================');
console.log('🎉 TODOS OS TESTES DO MÓDULO DENTALSAFE EXPRESS PASSARAM COM SUCESSO!');
console.log('============================================================\n');
