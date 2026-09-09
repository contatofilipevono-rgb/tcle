/**
 * Test Suite: DentalSafe TCLE AI — Módulo de Prescrição Odontológica
 * Validação do Banco de Medicamentos (AINEs, Analgésicos, Antibióticos, Tópicos, Corticoides),
 * Adição e Remoção Dinâmica de Medicamentos, Filtro por Categorias e Sincronização.
 * Executado diretamente no Node.js nativo (sem dependências externas).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== INICIANDO TESTES DO MOTOR DE PRESCRIÇÃO ODONTOLÓGICA ===\n');

// 1. Carregar prescriptions-db.js
const rxDbPath = path.join(__dirname, 'prescriptions-db.js');
const DentalSafeRx = require(rxDbPath);

// Teste 1: Validação do Banco de Fármacos Odontológicos
console.log('TESTE 1: Banco de Medicamentos Odontológicos');
const db = DentalSafeRx.DENTAL_DRUGS_DB;
assert(db, 'DENTAL_DRUGS_DB deve existir');

const categories = ['aines', 'analgesicos', 'antibioticos', 'topicos', 'corticoides'];
categories.forEach(cat => {
  assert(Array.isArray(db[cat]), `Categoria ${cat} deve ser um array`);
  assert(db[cat].length > 0, `Categoria ${cat} deve conter medicamentos cadastrados`);
  console.log(`  ✓ Categoria [${cat.toUpperCase()}]: ${db[cat].length} medicamentos cadastrados.`);
});

// Validar que cada medicamento possui os campos obrigatórios
let totalDrugs = 0;
const allDrugIds = new Set();
categories.forEach(cat => {
  db[cat].forEach(drug => {
    totalDrugs++;
    assert(drug.id, `Fármaco deve ter ID: ${JSON.stringify(drug)}`);
    assert(!allDrugIds.has(drug.id), `ID duplicado detectado: ${drug.id}`);
    allDrugIds.add(drug.id);
    assert(drug.name, `Fármaco ${drug.id} deve ter nome`);
    assert(drug.category, `Fármaco ${drug.id} deve ter categoria`);
    assert(drug.presentation, `Fármaco ${drug.id} deve ter apresentação`);
    assert(drug.instructions, `Fármaco ${drug.id} deve ter posologia`);
  });
});
console.log(`  ✓ Total de ${totalDrugs} medicamentos validados sem duplicidade de ID.\n`);

// Teste 2: Validação Específica dos Mais Comuns da Odontologia e Tópicos
console.log('TESTE 2: Fármacos Mais Comuns da Odontologia e Tópicos');
const expectedKeyDrugs = [
  // AINEs
  'nimesulida-100', 'cetoprofeno-100', 'cetoprofeno-150-lp', 'ibuprofeno-600', 'ibuprofeno-400', 
  'cetorolaco-sublingual-10', 'celecoxibe-200', 'meloxicam-15', 'diclofenaco-sodico-50', 'naproxeno-500',
  // Analgésicos
  'dipirona-1g', 'dipirona-500-comp', 'dipirona-500mg-gotas', 'paracetamol-750', 'paracetamol-500',
  'paracetamol-gotas-200', 'clonixinato-lisina-125', 'paracetamol-codeina-30', 'tramadol-paracetamol',
  // Antibióticos
  'amoxicilina-500', 'amoxicilina-875', 'amox-clav-500-125', 'amox-clav-875-125', 'azitromicina-500',
  'clindamicina-300', 'metronidazol-400', 'cefalexina-500', 'amoxicilina-2g-profilaxia', 'azitromicina-500-profilaxia',
  // Tópicos
  'clorexidina-012', 'clorexidina-gel-02', 'triancinolona-orabase', 'lidocaina-pomada-5',
  'miconazol-gel-oral', 'nistatina-suspensao-100k', 'acido-hialuronico-gel', 'bicarbonato-05',
  // Corticoides
  'dexametasona-4', 'prednisona-20', 'betametasona-2', 'dexametasona-dose-unica'
];

expectedKeyDrugs.forEach(drugId => {
  assert(allDrugIds.has(drugId), `Fármaco essencial odontológico ausente no banco: ${drugId}`);
});
console.log(`  ✓ Todos os ${expectedKeyDrugs.length} fármacos odontológicos essenciais confirmados no banco.\n`);

// Teste 3: Validação de Presets Odontológicos
console.log('TESTE 3: Presets Odontológicos Pré-Configurados');
const presets = DentalSafeRx.PRESCRIPTION_PRESETS;
assert(presets, 'PRESCRIPTION_PRESETS deve existir');

const requiredPresets = [
  'cirurgico-padrao', 'implante-enxerto', 'infeccao-aguda', 'pericoronarite-anaerobio',
  'alergico-penicilina', 'analgesia-leve', 'profilaxia-aha', 'profilaxia-aha-alergico',
  'cirurgia-preemptiva', 'aftas-estomatite', 'candidiase-oral'
];

requiredPresets.forEach(presetKey => {
  const p = presets[presetKey];
  assert(p, `Preset ${presetKey} deve existir`);
  assert(p.title, `Preset ${presetKey} deve ter título`);
  assert(Array.isArray(p.drugs) && p.drugs.length > 0, `Preset ${presetKey} deve ter lista de drogas`);
  p.drugs.forEach(dId => {
    assert(allDrugIds.has(dId), `Droga '${dId}' no preset '${presetKey}' não existe no banco DENTAL_DRUGS_DB`);
  });
  console.log(`  ✓ Preset [${presetKey}]: "${p.title}" (${p.drugs.length} medicamentos válidos)`);
});
console.log();

// Teste 4: Geração de HTML Timbrado
console.log('TESTE 4: Geração de HTML do Receituário Timbrado');
const sampleDrugs = [
  db.topicos.find(d => d.id === 'clorexidina-012'),
  db.aines.find(d => d.id === 'cetoprofeno-100'),
  db.analgesicos.find(d => d.id === 'dipirona-1g')
];
const patientData = { name: 'Carlos Eduardo Santos', cpf: '123.456.789-00', date: '07/09/2026' };
const clinicData = { name: 'Instituto Odontológico DentalSafe', dentist: 'Dra. Valéria', cro: 'CRO-SP 123456', phone: '(11) 99999-9999' };

const rxHTML = DentalSafeRx.buildPrescriptionHTML(patientData, clinicData, sampleDrugs, 'Manter repouso 48h.');
assert(rxHTML.includes('Carlos Eduardo Santos'), 'HTML deve conter o nome do paciente');
assert(rxHTML.includes('Dra. Valéria'), 'HTML deve conter o nome do dentista');
assert(rxHTML.includes('Digluconato de Clorexidina'), 'HTML deve conter o antisséptico tópico');
assert(rxHTML.includes('Cetoprofeno 100 mg'), 'HTML deve conter o AINE');
assert(rxHTML.includes('Dipirona Monoidratada 1 g'), 'HTML deve conter o analgésico');
assert(rxHTML.includes('rx-item-del-btn'), 'HTML deve conter botões inline de exclusão');
assert(rxHTML.includes('contenteditable="true"'), 'HTML deve ser editável inline');
console.log('  ✓ Receituário timbrado gerado com formatação de excelência e suporte à edição inline.\n');

// Teste 5: Simulação de Ambiente de Execução em VM
console.log('TESTE 5: Interatividade, Adição, Remoção e Sincronização em VM');

// Criar elementos mockados para simular a UI do navegador
const mockElements = {};
function createMockElement(id, tag = 'div') {
  const el = {
    id,
    tagName: tag.toUpperCase(),
    value: '',
    textContent: '',
    innerHTML: '',
    innerText: '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    checked: false,
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k] || null; },
    querySelector(selector) {
      if (selector.includes('.rx-card-actions')) return createMockElement('actions');
      if (selector.includes('.btn-rx-action')) return createMockElement('btn');
      if (selector.includes('.rx-status-badge')) return this.classList.contains('checked') ? createMockElement('badge') : null;
      return null;
    },
    querySelectorAll(selector) { return []; },
    focus() {}
  };
  mockElements[id] = el;
  return el;
}

// Criar elementos principais da página
[
  'rx-drugs-list-container', 'rx-prescribed-chips-wrap', 'rx-chips-count',
  'rx-prescription-preview-box', 'rx-full-text-editor', 'rx-custom-notes',
  'rx-drug-search-input', 'rx-patient-name', 'rx-patient-cpf', 'rx-patient-rg', 'rx-date',
  'rx-count-all', 'rx-count-aines', 'rx-count-analgesicos', 'rx-count-antibioticos', 'rx-count-topicos', 'rx-count-corticoides',
  'rx-custom-drug-form', 'rx-new-name', 'rx-new-category', 'rx-new-presentation', 'rx-new-instructions', 'rx-new-obs'
].forEach(id => createMockElement(id));

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: id => mockElements[id] || createMockElement(id),
    querySelector: sel => {
      const match = sel.match(/#([a-zA-Z0-9_-]+)/);
      if (match) return mockElements[match[1]] || createMockElement(match[1]);
      return createMockElement('mock');
    },
    querySelectorAll: sel => Object.values(mockElements)
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  DentalSafeSafety: {
    escapeHTML: str => String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    sanitizeHTML: str => String(str || '')
  },
  DentalSafeRx: DentalSafeRx,
  selectedRxDrugSet: new Set(),
  customRxFullText: null,
  showToast: (msg) => { console.log(`    [Toast UI]: ${msg}`); },
  navigator: { clipboard: { writeText: async () => {} } },
  console: console,
  Date: Date,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};
sandbox.window = sandbox;
sandbox.global = sandbox;

// Carregar app.js na sandbox
const appJsPath = path.join(__dirname, 'app.js');
const appJsCode = fs.readFileSync(appJsPath, 'utf8');
vm.createContext(sandbox);
vm.runInContext(appJsCode, sandbox);

// Executar inicialização do módulo
sandbox.initPrescriptionsModule();

console.log('  -> Verificando contadores de categoria atualizados...');
assert(parseInt(mockElements['rx-count-all'].textContent, 10) > 0, 'Total de fármacos deve ser > 0');
assert(parseInt(mockElements['rx-count-topicos'].textContent, 10) >= 8, 'Tópicos deve ter >= 8 medicamentos');
console.log(`    ✓ Total: ${mockElements['rx-count-all'].textContent} | Tópicos: ${mockElements['rx-count-topicos'].textContent} | AINEs: ${mockElements['rx-count-aines'].textContent}`);

// Testar Adicionar Medicamento
console.log('  -> Testando toggleRxDrug para adicionar Clorexidina Gel 0,2%...');
sandbox.toggleRxDrug('clorexidina-gel-02');
const isAdded1 = vm.runInContext('selectedRxDrugSet.has("clorexidina-gel-02")', sandbox);
assert(isAdded1, 'Clorexidina Gel deve estar no selectedRxDrugSet');
assert(mockElements['rx-prescription-preview-box'].innerHTML.includes('Clorexidina Gel 0,2%'), 'Folha timbrada deve conter Clorexidina Gel');
console.log('    ✓ Medicamento adicionado com sucesso e sincronizado na folha timbrada.');

// Testar Adicionar Segundo Medicamento (Cetorolaco Sublingual)
console.log('  -> Testando adicionar Cetorolaco Sublingual (Toragesic)...');
sandbox.toggleRxDrug('cetorolaco-sublingual-10');
const isAdded2 = vm.runInContext('selectedRxDrugSet.has("cetorolaco-sublingual-10")', sandbox);
assert(isAdded2, 'Cetorolaco deve estar no selectedRxDrugSet');
assert(mockElements['rx-prescription-preview-box'].innerHTML.includes('Toragesic'), 'Folha timbrada deve conter Toragesic');
console.log('    ✓ Cetorolaco Sublingual adicionado.');

// Testar Remoção de Medicamento
console.log('  -> Testando removeRxDrug para remover Clorexidina Gel...');
sandbox.removeRxDrug('clorexidina-gel-02');
const isStillThere = vm.runInContext('selectedRxDrugSet.has("clorexidina-gel-02")', sandbox);
assert(!isStillThere, 'Clorexidina Gel não deve mais estar no set');
assert(!mockElements['rx-prescription-preview-box'].innerHTML.includes('Clorexidina Gel 0,2%'), 'Folha timbrada não deve mais conter Clorexidina Gel');
assert(mockElements['rx-prescription-preview-box'].innerHTML.includes('Toragesic'), 'Cetorolaco deve continuar na folha timbrada');
console.log('    ✓ Medicamento removido individualmente com sucesso.');

// Testar Criação de Medicamento Personalizado Avulso
console.log('  -> Testando criação e inserção de Medicamento Personalizado Avulso...');
mockElements['rx-new-name'].value = 'Ciprofloxacino 500 mg';
mockElements['rx-new-category'].value = 'antibioticos';
mockElements['rx-new-presentation'].value = '1 caixa com 14 comprimidos revestidos';
mockElements['rx-new-instructions'].value = 'Tomar 1 comprimido por via oral a cada 12 horas durante 7 dias.';
mockElements['rx-new-obs'].value = 'Evitar ingestão conjunta com antiácidos ou laticínios.';

sandbox.saveAndAddCustomDrug();
assert(mockElements['rx-prescription-preview-box'].innerHTML.includes('Ciprofloxacino 500 mg'), 'Receita deve conter o fármaco avulso');
console.log('    ✓ Medicamento avulso cadastrado e integrado na receita.');

// Testar Preset Odontológico
console.log('  -> Testando preset "aftas-estomatite"...');
sandbox.applyRxPreset('aftas-estomatite');
assert(vm.runInContext('selectedRxDrugSet.has("triancinolona-orabase")', sandbox), 'Deve conter Triancinolona Orabase');
assert(vm.runInContext('selectedRxDrugSet.has("clorexidina-gel-02")', sandbox), 'Deve conter Clorexidina Gel');
assert(vm.runInContext('selectedRxDrugSet.has("dipirona-1g")', sandbox), 'Deve conter Dipirona 1g');
assert(mockElements['rx-prescription-preview-box'].innerHTML.includes('Triancinolona Acetonida'), 'Folha timbrada deve conter Triancinolona');
console.log('    ✓ Protocolo de aftas e estomatite aplicado com sucesso.');

// Testar Limpar Todos
console.log('  -> Testando clearRxDrugs...');
sandbox.clearRxDrugs();
assert.strictEqual(vm.runInContext('selectedRxDrugSet.size', sandbox), 0, 'Set deve estar vazio');
assert(!mockElements['rx-prescription-preview-box'].innerHTML.includes('Triancinolona Acetonida'), 'Folha não deve conter medicamentos');
console.log('    ✓ Limpar todos executado com sucesso.');

console.log('\n=== TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! ===');
