'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {once}=require('node:events');
const http=require('node:http');
const {createServer}=require('./server');
const safety=require('./safety');
const db=require('./procedure-db');
const clinical=require('./clinical-ai-engine');
test('CPF: rejeita zeros, dígitos repetidos e verificadores incorretos',()=>{
  assert.equal(safety.validCPF('000.000.000-00'),false);
  assert.equal(safety.validCPF('111.111.111-11'),false);
  assert.equal(safety.validCPF('529.982.247-24'),false);
  assert.equal(safety.validCPF('529.982.247-25'),true);
});
test('Importação: rejeita estrutura, procedimento, dente e booleanos inválidos',()=>{
  const base={patient:{name:'Teste'},procedure:{type:'canal',selectedTeeth:['11']},anamnesis:{diabetes:false}};
  assert.equal(safety.validateRecord(base,db),base);
  assert.throws(()=>safety.validateRecord({},db));
  assert.throws(()=>safety.validateRecord({...base,procedure:{type:'constructor'}},db));
  assert.throws(()=>safety.validateRecord({...base,procedure:{type:'canal',selectedTeeth:['99']}},db));
  assert.throws(()=>safety.validateRecord({...base,anamnesis:{diabetes:'false'}},db));
});
test('Texto externo não se transforma em marcação executável',()=>{
  assert.equal(safety.escapeHTML('<img src=x onerror="x">'), '&lt;img src=x onerror=&quot;x&quot;&gt;');
});
test('Protocolo de biossegurança não implica All-on-4',()=>{
  const parsed=clinical.parseClinicalInput({procKey:'canal',procDiag:'Endo do 11. Protocolo de biossegurança.'});
  assert.equal(parsed.protocols.some(p=>p.id==='protocolo_allon4'),false);
  assert.equal(clinical.mentionsImplantProtocol('Prótese protocolo All-on-4'),true);
});
test('TCLE não recomenda clindamicina para profilaxia de endocardite',()=>{
  const ctx={procKey:'canal',procDiag:'Alergia a penicilina'};
  const result=clinical.synthesize(clinical.parseClinicalInput(ctx),ctx);
  assert.match(result.systemicPharmacologyBlock,/não recomenda clindamicina/);
  assert.doesNotMatch(result.systemicPharmacologyBlock,/Clindamicina 600mg/);
});
test('HTTP protege arquivos internos e nega webhook simulado',async t=>{
  const server=createServer();server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const base='http://127.0.0.1:'+server.address().port;
  const good=await fetch(base+'/');assert.equal(good.status,200);assert.match(await good.text(),/safety.js/);
  assert.equal(good.headers.get('cache-control'),'no-store');assert.equal(good.headers.get('access-control-allow-origin'),null);
  for(const file of ['/server.js','/AGENTS.md','/supabase/schema.sql','/dentalsafe-tcle-ai.zip','/.review-backup-20260907/app.js','/%2e%2e%5cserver.js']) assert.equal((await fetch(base+file)).status,404,file);
  assert.equal((await fetch(base+'/%ZZ')).status,400);
  assert.equal((await fetch(base+'/api/webhooks/kiwify',{method:'POST',body:'{}'})).status,501);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
  assert.equal((await fetch(base+'/',{method:'HEAD'})).status,200);
  const denied=await new Promise(resolve=>{ http.get(base,{headers:{Host:'evil.example'}},r=>{r.resume();resolve(r.statusCode);}); });
  assert.equal(denied,403);
});

test('Negações não viram diagnóstico; uso de medicamento não implica alergia',()=>{
 const p=clinical.parseClinicalInput({procKey:'canal',procDiag:'Endo do 11 sem fístula e sem lesão periapical. Nega diabetes e tabagismo. Uso de amoxicilina, sem alergias.'});
 assert.equal(p.pathologies.some(x=>['fistula','lesao_periapical'].includes(x.id)),false);
 assert.equal(p.systemic.some(x=>['diabetes','smoking','allergy'].includes(x.id)),false);
 const positive=clinical.parseClinicalInput({procDiag:'Sem fístula, mas diabetes. Alergia a amoxicilina.'});
 assert.equal(positive.systemic.some(x=>x.id==='diabetes'),true);
 assert.equal(positive.systemic.some(x=>x.id==='allergy'),true);
});
test('Receitas: duplicidade inclui subcategorias de AINE e paracetamol combinado',()=>{
 const rx=require('./prescriptions-db');const drugs=Object.values(rx.DENTAL_DRUGS_DB).flat();
 assert.equal(rx.reviewPrescription(drugs.filter(d=>['celecoxibe-200','ibuprofeno-600'].includes(d.id))).some(x=>x.blocking),true);
 assert.equal(rx.reviewPrescription([{name:'Paracetamol',quantity:'1',instructions:'x'},{name:'Codeína + Paracetamol',quantity:'1',instructions:'x'}]).some(x=>x.blocking),true);
});
test('Atestados escapam texto livre e preservam edição vazia',()=>{
 const rx=require('./prescriptions-db');
 for(const fn of [rx.buildMedicalLeaveHTML,rx.buildAttendanceCertificateHTML]) {
   const html=fn({name:'Teste',cpf:'52998224725',rg:'<img src=x>'},{},{},'<script>alert(1)</script>');
   assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));
   assert.ok(!fn({name:'Teste'},{},{},'').includes('Atesto, para'));
 }
});

test('LGPD: mascaramento preserva formato sem expor dígitos confidenciais',()=>{
  assert.equal(safety.maskSensitive('529.982.247-25', 'cpf'), '529.***.***-25');
  assert.equal(safety.maskSensitive('11987654321', 'phone'), '(11) *****-4321');
  assert.equal(safety.maskSensitive('doutor@clinica.com.br', 'email'), 'do***@clinica.com.br');
});

test('LGPD: anonimização remove dados pessoais e mantém dados clínicos (Art. 12)',()=>{
  const original = {
    patient: { name: 'João da Silva', cpf: '529.982.247-25', rg: '12.345.678-9', phone: '(11) 98765-4321', email: 'joao@silva.com' },
    procedure: { type: 'canal', selectedTeeth: ['11'] },
    anamnesis: { diabetes: false }
  };
  const anon = safety.anonymizeRecord(original);
  assert.notEqual(anon.patient.name, 'João da Silva');
  assert.match(anon.patient.name, /^Paciente P-[A-Z0-9]+$/);
  assert.equal(anon.patient.cpf, '000.000.000-00');
  assert.equal(anon.patient.rg, 'ANONIMIZADO');
  assert.equal(anon.procedure.type, 'canal');
  assert.deepEqual(anon.procedure.selectedTeeth, ['11']);
  assert.equal(anon.isAnonymizedForResearch, true);
});

test('Segurança: servidor HTTP ativo com Permissions-Policy e Content-Security-Policy',async t=>{
  const server=createServer();server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const base='http://127.0.0.1:'+server.address().port;
  const res=await fetch(base+'/');
  assert.ok(res.headers.get('permissions-policy')?.includes('camera=()'));
  assert.ok(res.headers.get('content-security-policy')?.includes("frame-ancestors 'none'"));
});
