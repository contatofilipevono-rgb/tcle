/**
 * Test Suite: DentalSafe TCLE AI — Módulo de Gestão de Pacientes & Prontuários (LGPD)
 * Validação da Aba de Pacientes, Armazenamento Local, Anonimização, Portabilidade e Sincronização.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== INICIANDO TESTES DO MÓDULO DE PACIENTES & LGPD ===\n');

// 1. Validar index.html
console.log('TESTE 1: Integridade da Estrutura no index.html');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(indexHtml.includes('data-tab="patients-tab"'), 'index.html deve conter botão da aba patients-tab na sidebar');
assert(indexHtml.includes('id="patients-count"'), 'index.html deve conter contador #patients-count na sidebar');
assert(indexHtml.includes('id="patients-tab"'), 'index.html deve conter section #patients-tab');
assert(indexHtml.includes('id="patients-search-input"'), 'index.html deve conter input de busca #patients-search-input');
assert(indexHtml.includes('id="patients-cards-container"'), 'index.html deve conter container de cards #patients-cards-container');
assert(indexHtml.includes('id="patients-empty-state"'), 'index.html deve conter empty state #patients-empty-state');
assert(indexHtml.includes('id="patient-modal"'), 'index.html deve conter modal #patient-modal');
assert(indexHtml.includes('id="modal-patient-name"'), 'Modal deve conter campo #modal-patient-name');
assert(indexHtml.includes('id="modal-patient-cpf"'), 'Modal deve conter campo #modal-patient-cpf');
console.log('  ✓ Todos os elementos HTML da aba Pacientes e do Modal LGPD verificados com sucesso.');

// 2. Validar style.css
console.log('TESTE 2: Integridade Visual no style.css');
const styleCss = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
assert(styleCss.includes('.patients-hero-card'), 'style.css deve conter .patients-hero-card');
assert(styleCss.includes('.patient-card'), 'style.css deve conter .patient-card');
assert(styleCss.includes('.patient-avatar'), 'style.css deve conter .patient-avatar');
assert(styleCss.includes('.patient-badge-alert'), 'style.css deve conter .patient-badge-alert');
assert(styleCss.includes('.patients-empty'), 'style.css deve conter .patients-empty');
console.log('  ✓ Estilos Apple HIG Pro para a aba Pacientes validados.');

// 3. Simulação de Ambiente VM para validar lógica do app.js
console.log('TESTE 3: Execução das Funções do Módulo de Pacientes em VM');
const storageMock = {};
const elementsMock = {
  'patients-count': { textContent: '' },
  'stat-total-patients': { textContent: '' },
  'stat-total-tcles': { textContent: '' },
  'stat-total-rxs': { textContent: '' },
  'patients-cards-container': { style: {}, innerHTML: '' },
  'patients-empty-state': { style: {} },
  'patient-modal': { style: {} },
  'patient-modal-title': { textContent: '' },
  'modal-patient-id': { value: '' },
  'modal-patient-name': { value: '' },
  'modal-patient-cpf': { value: '' },
  'modal-patient-phone': { value: '' },
  'modal-patient-rg': { value: '' },
  'modal-patient-birth': { value: '' },
  'modal-patient-email': { value: '' },
  'modal-patient-address': { value: '' },
  'modal-patient-allergies': { value: '' },
  'modal-patient-notes': { value: '' },
  'patient-name': { value: '' },
  'patient-cpf': { value: '' },
  'patient-rg': { value: '' },
  'patient-dob': { value: '' },
  'patient-phone': { value: '' },
  'patient-email': { value: '' },
  'patient-address': { value: '' },
  'rx-patient-name': { value: '' },
  'rx-patient-cpf': { value: '' },
  'rx-patient-rg': { value: '' },
  'ai-dictation-text': { value: '' },
  'toast': { textContent: '', className: '', classList: { add: () => {}, remove: () => {} } }
};

const context = {
  console: console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  confirm: () => true,
  alert: () => {},
  showToast: () => {},
  localStorage: {
    getItem: (k) => storageMock[k] || null,
    setItem: (k, v) => { storageMock[k] = String(v); },
    removeItem: (k) => { delete storageMock[k]; }
  },
  document: {
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 'complete',
    getElementById: (id) => elementsMock[id] || null,
    querySelector: (sel) => {
      return { click: () => {} };
    },
    querySelectorAll: () => [],
    createElement: (tag) => ({
      href: '',
      download: '',
      click: () => {},
      style: {},
      classList: { add: () => {}, remove: () => {} }
    }),
    body: {
      classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
      appendChild: () => {},
      removeChild: () => {}
    }
  },
  Blob: class { constructor(parts) { this.content = parts.join(''); } },
  URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
  DentalSafeSafety: {
    validCPF: (cpf) => !!cpf && cpf.length >= 11
  }
};

context.window = context;
context.scrollTo = () => {};
vm.createContext(context);

// Carregar trechos essenciais de safety.js e app.js
const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
vm.runInContext(appCode, context);

// Testar getStoredPatients (deve retornar os seed patients no primeiro acesso)
const patients = context.getStoredPatients();
assert(Array.isArray(patients), 'getStoredPatients deve retornar um array');
assert(patients.length >= 2, 'Deve conter pelo menos 2 pacientes no seed inicial');
assert(patients[0].name === 'Maria Clara Souza', 'Primeiro paciente seed deve ser Maria Clara Souza');
console.log(`  ✓ getStoredPatients retornou ${patients.length} pacientes iniciais com sucesso.`);

// Testar renderPatientsList
context.renderPatientsList();
assert(elementsMock['stat-total-patients'].textContent === String(patients.length), 'Stat total pacientes deve ser atualizado');
assert(elementsMock['patients-cards-container'].innerHTML.includes('Maria Clara Souza'), 'Cards container deve renderizar Maria Clara Souza');
assert(elementsMock['patients-cards-container'].innerHTML.includes('sensitive-data'), 'CPF deve possuir classe sensitive-data para LGPD blur');
console.log('  ✓ renderPatientsList atualizou contadores e renderizou cards.');

// Testar filterPatientsList
context.filterPatientsList('Carlos');
assert(elementsMock['patients-cards-container'].innerHTML.includes('Carlos Eduardo Lima'), 'Filtro deve encontrar Carlos Eduardo Lima');
assert(!elementsMock['patients-cards-container'].innerHTML.includes('Maria Clara Souza'), 'Filtro por Carlos não deve exibir Maria Clara');
console.log('  ✓ filterPatientsList filtrou pacientes por busca com precisão.');

// Testar modal e salvamento de novo paciente
context.openNewPatientModal();
assert(elementsMock['patient-modal'].style.display === 'flex', 'Modal deve abrir com display flex');
elementsMock['modal-patient-name'].value = 'Novo Paciente Teste';
elementsMock['modal-patient-cpf'].value = '999.888.777-66';
elementsMock['modal-patient-phone'].value = '(11) 97777-6666';
context.savePatientFromModal();

const updatedList = context.getStoredPatients();
assert(updatedList.some(p => p.name === 'Novo Paciente Teste'), 'Novo paciente deve estar salvo no storage');
console.log('  ✓ savePatientFromModal adicionou novo paciente com sucesso.');

// Testar Iniciar TCLE para Paciente
const testPat = updatedList.find(p => p.name === 'Novo Paciente Teste');
context.startTcleForPatient(testPat.id);
assert(elementsMock['patient-name'].value === 'Novo Paciente Teste', 'startTcleForPatient deve preencher #patient-name');
assert(elementsMock['patient-cpf'].value === '999.888.777-66', 'startTcleForPatient deve preencher #patient-cpf');
console.log('  ✓ startTcleForPatient transferiu os dados para o Gerador de TCLE.');

// Testar Nova Receita para Paciente
context.startPrescriptionForPatient(testPat.id);
assert(elementsMock['rx-patient-name'].value === 'Novo Paciente Teste', 'startPrescriptionForPatient deve preencher #rx-patient-name');
console.log('  ✓ startPrescriptionForPatient transferiu os dados para o Receituário.');

// Testar Anonimização LGPD (Art. 16/18)
context.anonymizePatientLGPD(testPat.id);
const afterAnon = context.getStoredPatients().find(p => p.id === testPat.id);
assert(afterAnon.name.includes('ANONIMIZADO'), 'Nome deve ser substituído por identificador anonimizado');
assert(afterAnon.cpf === '000.***.***-00', 'CPF deve ser mascarado irreversivelmente');
assert(afterAnon.phone === '***', 'Telefone deve ser removido');
console.log('  ✓ anonymizePatientLGPD anonimizou dados conforme Art. 16/18 da LGPD.');

// Testar Auto-upsert a partir do formulário de TCLE
context.autoUpsertPatientFromForm('Juliana Ribeiro Fonseca', '333.444.555-66', '33.444.555-6 SSP/SP', '1990-01-01', '(11) 96666-5555', 'Rua das Flores, 100');
const afterAuto = context.getStoredPatients();
assert(afterAuto.some(p => p.name === 'Juliana Ribeiro Fonseca'), 'autoUpsertPatientFromForm deve cadastrar novo paciente');
console.log('  ✓ autoUpsertPatientFromForm sincronizou dados do TCLE para a base de pacientes.');

// Testar Exclusão
const juliana = afterAuto.find(p => p.name === 'Juliana Ribeiro Fonseca');
context.deletePatientLGPD(juliana.id);
const afterDelete = context.getStoredPatients();
assert(!afterDelete.some(p => p.id === juliana.id), 'deletePatientLGPD deve remover o paciente');
console.log('  ✓ deletePatientLGPD removeu paciente da base cadastral.');

console.log('\n============================================================');
console.log('🎉 TODOS OS TESTES DO MÓDULO DE PACIENTES & LGPD PASSARAM!');
console.log('============================================================\n');
