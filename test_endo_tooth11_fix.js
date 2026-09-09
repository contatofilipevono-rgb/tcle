const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectDir = __dirname;

// Elements store
const elements = {};
function createMockElement(id, tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    value: '',
    checked: false,
    textContent: '',
    innerHTML: '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    getAttribute(attr) { return this[attr] || null; },
    setAttribute(attr, val) { this[attr] = val; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener(event, fn) { this._listeners = this._listeners || {}; this._listeners[event] = fn; },
    dispatchEvent(event) { if (this._listeners && this._listeners[event.type]) this._listeners[event.type](event); },
    focus() {}
  };
}

function getEl(id) {
  if (!elements[id]) {
    elements[id] = createMockElement(id);
  }
  return elements[id];
}

const mockDoc = {
  getElementById: (id) => getEl(id),
  querySelectorAll: (sel) => {
    if (sel === '.spec-pill') {
      return Object.values(elements).filter(e => e.classList && e.classList.contains('spec-pill'));
    }
    if (sel === '.tooth-btn') {
      return Object.values(elements).filter(e => e.classList && e.classList.contains('tooth-btn'));
    }
    return [];
  },
  querySelector: (sel) => null,
  addEventListener: (event, fn) => { /* no-op for mock */ }
};

// Create mock specialty pills
const specKeys = ['endo', 'cirurgia', 'implante', 'hof', 'protese', 'orto', 'perio', 'clareamento'];
specKeys.forEach(k => {
  const pill = createMockElement('pill-' + k, 'button');
  pill.classList.add('spec-pill');
  pill.setAttribute('data-spec', k);
  pill.setAttribute('onclick', `quickSelectSpecialty('${k}')`);
  elements['pill-' + k] = pill;
});

// Setup tooth buttons
for (let i = 11; i <= 48; i++) {
  const t = createMockElement('tooth-' + i, 'button');
  t.classList.add('tooth-btn');
  t.setAttribute('data-fdi', String(i));
  elements['tooth-' + i] = t;
}

const mockContext = {
  window: {},
  document: mockDoc,
  Event: function(type) { this.type = type; },
  setTimeout: (fn) => fn(),
  console: console,
  btoa: (str) => Buffer.from(str).toString('base64'),
  unescape: unescape,
  encodeURIComponent: encodeURIComponent,
  Date: Date,
  scrollTo() {},
  TextEncoder: TextEncoder,
  crypto: require("node:crypto").webcrypto
};
mockContext.window = mockContext;
mockContext.global = mockContext;

vm.createContext(mockContext);

// Load script files in order
const filesToLoad = [
  'safety.js',
  'procedure-db.js',
  'institutional-db.js',
  'intercurrences-db.js',
  'clinical-ai-engine.js',
  'prescriptions-db.js',
  'postop-guidelines-db.js',
  'app.js'
];

filesToLoad.forEach(f => {
  const code = fs.readFileSync(path.join(projectDir, f), 'utf8');
  vm.runInContext(code, mockContext);
});

console.log('🧪 Running Test Suite for Endodontia, Tooth 11 & Auto-Harmonization...\n');

// Initialize setupLiveIntercurrenceDetection
vm.runInContext('setupLiveIntercurrenceDetection();', mockContext);

// TEST 1: User types "endo", marks tooth 11, dropdown starts at default "implante"
console.log('--- TEST 1: User writes "endo" and marks tooth 11 with dropdown at default "implante" ---');
getEl('procedure-type').value = 'implante';
getEl('patient-name').value = 'Mariana Silva';
getEl('patient-cpf').value = '111.222.333-44';
getEl('procedure-diagnosis').value = 'endo';

// Simulate odontogram click on tooth 11
vm.runInContext('toggleTooth("11");', mockContext);

// Dispatch input event on diagnosis
getEl('procedure-diagnosis').dispatchEvent(new mockContext.Event('input'));

console.log('1. Dropdown value after typing "endo":', getEl('procedure-type').value);
console.log('2. Region input:', getEl('procedure-region').value);

// Build document
vm.runInContext('buildFullDocument();', mockContext);
const docData1 = mockContext.currentDocData;

console.log('3. Resulting procedure key:', docData1.procedureKey);
console.log('4. Resulting procedure name:', docData1.procedure);

const legal1 = docData1.legalHTML;
const pprCheck1 = /prótese parcial removível|\bppr\b/i.test(legal1);
const edentulismoCheck1 = /edentulismo/i.test(legal1);
const endoCheck1 = /endodontia|canal radicular|biocerâmico/i.test(legal1);
const tooth11Check1 = /11/i.test(legal1);

console.log('   - Mentions Endodontia:', endoCheck1);
console.log('   - Mentions Tooth 11:', tooth11Check1);
console.log('   - Leaks PPR (MUST BE FALSE):', pprCheck1);
console.log('   - Leaks Edentulismo (MUST BE FALSE):', edentulismoCheck1);

if (pprCheck1 || edentulismoCheck1 || docData1.procedureKey !== 'canal' || !endoCheck1 || !tooth11Check1) {
  console.error('❌ TEST 1 FAILED! Document leaked PPR/edentulismo or failed to set canal.');
  process.exit(1);
}
console.log('✅ TEST 1 PASSED: 100% pure Endodontia document on tooth 11 with zero PPR/edentulism!\n');

// TEST 2: User clicks specialty pill quickSelectSpecialty('endo')
console.log('--- TEST 2: User clicks specialty pill quickSelectSpecialty("endo") ---');
getEl('procedure-type').value = 'implante';
getEl('procedure-diagnosis').value = '';
vm.runInContext('clearTeethSelection();', mockContext);

vm.runInContext('quickSelectSpecialty("endo");', mockContext);

console.log('1. Dropdown after clicking "endo" pill:', getEl('procedure-type').value);
console.log('2. proc-needs-canal checked:', getEl('proc-needs-canal').checked);
console.log('3. proc-needs-coroa checked:', getEl('proc-needs-coroa').checked);
console.log('4. proc-needs-paresthesia checked (should be false):', getEl('proc-needs-paresthesia').checked);
console.log('5. proc-needs-graft checked (should be false):', getEl('proc-needs-graft').checked);
console.log('6. Atalho não deve inventar seleção de dente 11:', vm.runInContext('selectedTeeth.has("11");', mockContext));

vm.runInContext('buildFullDocument();', mockContext);
const docData2 = mockContext.currentDocData;

const pprCheck2 = /prótese parcial removível|\bppr\b/i.test(docData2.legalHTML);
const edentulismoCheck2 = /edentulismo/i.test(docData2.legalHTML);

console.log('   - Leaks PPR (MUST BE FALSE):', pprCheck2);
console.log('   - Leaks Edentulismo (MUST BE FALSE):', edentulismoCheck2);

if (pprCheck2 || edentulismoCheck2 || docData2.procedureKey !== 'canal') {
  console.error('❌ TEST 2 FAILED!');
  process.exit(1);
}
console.log('✅ TEST 2 PASSED: Specialty pill "endo" sets up pure Endodontia TCLE.\n');

// TEST 3: Check all specialty pills
console.log('--- TEST 3: All Specialty Pills Functional Check ---');
const pills = [
  { arg: 'endo', expected: 'canal' },
  { arg: 'cirurgia', expected: 'sisos' },
  { arg: 'implante', expected: 'implante' },
  { arg: 'hof', expected: 'harmonizacao' },
  { arg: 'protese', expected: 'protese' },
  { arg: 'orto', expected: 'ortodontia' },
  { arg: 'perio', expected: 'periodontia' },
  { arg: 'clareamento', expected: 'clareamento' }
];

pills.forEach(p => {
  vm.runInContext(`quickSelectSpecialty("${p.arg}");`, mockContext);
  const current = getEl('procedure-type').value;
  console.log(`   Pill '${p.arg}' -> procedure-type = '${current}' (expected '${p.expected}')`);
  if (current !== p.expected) {
    console.error(`❌ TEST 3 FAILED for pill ${p.arg}`);
    process.exit(1);
  }
});
console.log('✅ TEST 3 PASSED: All specialty shortcuts respond accurately.\n');

// TEST 4: Verification of auto-harmonization when user forgets dropdown on implante and types "tratamento de canal elemento 11"
console.log('--- TEST 4: Auto-harmonization during buildFullDocument if dropdown stays on "implante" ---');
getEl('procedure-type').value = 'implante';
getEl('procedure-diagnosis').value = 'Tratamento de canal do dente 11 com necrose';
getEl('procedure-region').value = 'Elemento 11';
vm.runInContext('selectedTeeth = new Set(["11"]);', mockContext);

vm.runInContext('buildFullDocument();', mockContext);
const docData4 = mockContext.currentDocData;

console.log('Resulting procedure key:', docData4.procedureKey);
const pprCheck4 = /prótese parcial removível|\bppr\b/i.test(docData4.legalHTML);
const edentulismoCheck4 = /edentulismo/i.test(docData4.legalHTML);

if (docData4.procedureKey !== 'canal' || pprCheck4 || edentulismoCheck4) {
  console.error('❌ TEST 4 FAILED!');
  process.exit(1);
}
console.log('✅ TEST 4 PASSED: Auto-harmonization cleanly overrode default implante to canal with zero PPR/edentulism!\n');

console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');

// Regression: generic protocols must never switch an endodontic document to implants.
const assert = require('node:assert/strict');
for (const note of ['Protocolo endodôntico com irrigação', 'Seguir protocolo de biossegurança', 'Protocolo de analgesia e retorno']) {
  getEl('procedure-diagnosis').value = 'endo dente 11';
  getEl('ai-dictation-text').value = note;
  getEl('procedure-type').value = 'implante';
  vm.runInContext('quickSelectSpecialty("endo"); buildFullDocument();', mockContext);
  assert.equal(mockContext.currentDocData.procedureKey, 'canal');
  assert.doesNotMatch(mockContext.currentDocData.legalHTML, /edentulismo|prótese parcial removível|all-on-4|Branemark/i);
}
getEl('ai-dictation-text').value = '';
getEl('procedure-diagnosis').value = '';
for (const p of pills) {
  vm.runInContext('quickSelectSpecialty(' + JSON.stringify(p.arg) + '); buildFullDocument();', mockContext);
  assert.equal(mockContext.currentDocData.procedureKey, p.expected, 'Document after specialty switch: ' + p.arg);
  if (p.arg !== 'hof') assert.equal(getEl('proc-needs-hof-vascular').checked, false);
}
getEl('procedure-diagnosis').value = 'Apicectomia após retratamento endodôntico do dente 21';
getEl('procedure-type').value = 'apicectomia';
vm.runInContext('buildFullDocument();', mockContext);
assert.equal(mockContext.currentDocData.procedureKey, 'apicectomia');
getEl('procedure-diagnosis').value = 'Endo do 11 seguindo protocolo de irrigação';
vm.runInContext('quickSelectSpecialty("endo");', mockContext);
assert.equal(getEl('procedure-diagnosis').value, 'Endo do 11 seguindo protocolo de irrigação');
console.log('✅ Protocolos genéricos, troca de especialidades e preservação do diagnóstico validados.');

// Positive controls: real implant protocols remain recognized.
for (const label of ['Prótese protocolo', 'Protocolo Branemark', 'All-on-4', 'All-on-6']) {
  getEl('procedure-diagnosis').value = label;
  getEl('procedure-type').value = 'protocolo_implante';
  vm.runInContext('buildFullDocument();', mockContext);
  assert.equal(mockContext.currentDocData.procedureKey, 'protocolo_implante', label);
}
getEl('procedure-diagnosis').value = 'Tratamento de canal do 11';
getEl('procedure-type').value = 'implante';
getEl('procedure-material').value = 'Implante de Titânio Puro Osseointegrado';
vm.runInContext('buildFullDocument();', mockContext);
assert.equal(mockContext.currentDocData.procedureKey, 'canal');
assert.equal(getEl('procedure-material').value, 'Cimento Biocerâmico Bioativo (MTA)');
assert.doesNotMatch(mockContext.currentDocData.legalHTML, /Implante de Titânio Puro Osseointegrado/);
console.log('✅ Próteses protocolo explícitas e material após harmonização validados.');

// Importar um novo paciente precisa remover false e campos ausentes do anterior.
getEl('cond-diabetes').checked=true;
getEl('cond-pregnancy').checked=true;
getEl('patient-phone').value='telefone anterior';
getEl('guardian-name').value='responsável anterior';
vm.runInContext('tcleEditedSections = {"sec-3":"Texto do paciente anterior"};',mockContext);
mockContext.recordForTest={patient:{name:'Outro paciente',cpf:'52998224725'},procedure:{type:'canal',diagnosis:'Endo 21',region:'Dente 21',selectedTeeth:['21']},anamnesis:{diabetes:false}};
vm.runInContext('applyPatientRecord(recordForTest);',mockContext);
assert.equal(getEl('cond-diabetes').checked,false);
assert.equal(getEl('cond-pregnancy').checked,false);
assert.equal(getEl('patient-phone').value,'');
assert.equal(getEl('guardian-name').value,'');
assert.equal(vm.runInContext('Object.keys(tcleEditedSections).length',mockContext),0);
assert.equal(getEl('patient-legal-status').value,'adult');
vm.runInContext('clearTeethSelection(); quickSelectSpecialty("endo");',mockContext);
assert.equal(vm.runInContext('selectedTeeth.size',mockContext),0);
getEl('patient-name').value='<img src=x onerror=alert(1)>';
vm.runInContext('buildFullDocument();',mockContext);
assert.doesNotMatch(mockContext.currentDocData.legalHTML,/<img src=x/);
assert.match(mockContext.currentDocData.legalHTML,/&lt;img/);
mockContext.computeSha256Hex('abc').then(hash => {
  assert.equal(hash,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  console.log('✅ Importação limpa, ausência de dados inventados, escape de HTML e SHA-256 validados.');
}).catch(err => { console.error(err); process.exitCode=1; });

// Revisão TCLE 08/09/2026: direitos, riscos completos e personalizações.
vm.runInContext('tcleHiddenSections.clear(); tcleEditedSections = {}; clearTeethSelection(); quickSelectSpecialty("endo");',mockContext);
getEl('procedure-diagnosis').value='Tratamento de canal do 11';
getEl('patient-name').value='Paciente fictício de teste';
getEl('proc-needs-coroa').checked=true;
vm.runInContext('buildFullDocument();',mockContext);
const reviewed=mockContext.currentDocData;
assert.ok(reviewed.legalHTML.includes('Lei 13.787/2018'));
assert.match(reviewed.legalHTML,/a partir do último registro/);
assert.match(reviewed.legalHTML,/Posso retirar meu consentimento/);
assert.match(reviewed.legalHTML,/não reduz a responsabilidade profissional/);
assert.doesNotMatch(reviewed.legalHTML+reviewed.summaryHTML,/exclusivamente sua|IRREVOGÁVEL|não é erro do dentista|Lei 9.439|Natureza Jurídica da Obrigação/);
for(const risk of mockContext.PROCEDURE_DB.canal.risksRare) assert.ok(reviewed.summaryHTML.includes(risk),'Resumo preserva risco raro integral');
for(const term of ['hipoclorito','Perfuração','Separação de instrumento','restauração definitiva']) assert.ok(reviewed.legalHTML.includes(term),term);
vm.runInContext('tcleEditedSections["sec-7"]="Alternativa individualizada preservada"; buildFullDocument();',mockContext);
assert.match(mockContext.currentDocData.legalHTML,/Alternativa individualizada preservada/);
vm.runInContext('tcleEditedSections = {};',mockContext);
getEl('hof-opt-resgate').checked=true;
getEl('hof-opt-imagem').checked=true;
getEl('hof-opt-retorno').checked=true;
vm.runInContext('updateHofTCLELivePreview();',mockContext);
const hofReviewed=getEl('hof-live-preview-box').innerHTML;
assert.match(hofReviewed,/perda de visão/);
assert.match(hofReviewed,/não autoriza divulgação/);
assert.doesNotMatch(hofReviewed,/sem necessidade de nova autorização|Culpa Exclusiva|desobriga|Criptografia SHA-256/);
console.log('✅ Revisão TCLE: riscos completos, direitos, personalizações e HOF verificados.');
