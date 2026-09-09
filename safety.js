(function(root) {
  'use strict';
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g,ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function sanitizeHTML(value) {
    if (!root.document?.createElement) return escapeHTML(value);
    const template = root.document.createElement('template');
    template.innerHTML = String(value ?? '');
    const allowed = new Set('P BR STRONG B EM I U S UL OL LI H2 H3 H4 H5 H6 DIV SPAN TABLE THEAD TBODY TR TH TD BLOCKQUOTE CODE'.split(' '));
    for (const node of Array.from(template.content.querySelectorAll('*'))) {
      if (!allowed.has(node.tagName)) { node.replaceWith(root.document.createTextNode(node.textContent)); continue; }
      for (const attr of Array.from(node.attributes)) {
        if (!(attr.name === 'class' && /^[\w\s-]*$/.test(attr.value))) node.removeAttribute(attr.name);
      }
    }
    return template.innerHTML;
  }
  function validCPF(value) {
    const cpf = String(value || '').replace(/\D/g,'');
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
    for (let size=9;size<=10;size++) {
      let sum=0;
      for (let i=0;i<size;i++) sum+=Number(cpf[i])*(size+1-i);
      if ((sum*10)%11%10 !== Number(cpf[size])) return false;
    }
    return true;
  }
  const flags = {diabetes:'cond-diabetes',hiv:'cond-hiv',hypertension:'cond-hypertension',cardiopathy:'cond-cardiopathy',pregnancy:'cond-pregnancy',autoimmune:'cond-autoimmune',anxiety:'cond-anxiety',bisphosphonate:'med-bisphosphonate',anticoagulant:'med-anticoagulant',immunosuppressant:'med-immunosuppressant',corticoid:'med-corticoid',smoking:'cond-smoking',bruxism:'cond-bruxism',perio:'cond-perio',boneLoss:'cond-bone-loss',allergy:'cond-allergy',unrealistic:'cond-unrealistic'};
  function validateRecord(record,procedures) {
    if (!record || typeof record !== 'object' || Array.isArray(record) || !record.patient || !record.procedure) throw new Error('Informe um prontuário com paciente e procedimento.');
    for (const group of ['patient','procedure','anamnesis']) {
      const obj=record[group];
      if (obj != null && (typeof obj !== 'object' || Array.isArray(obj))) throw new Error('Estrutura de prontuário inválida.');
      for (const [key,value] of Object.entries(obj || {})) {
        if (key === 'selectedTeeth') continue;
        if (!['string','boolean','number'].includes(typeof value) || String(value).length>30000) throw new Error('Campo inválido ou muito extenso.');
      }
    }
    if (!Object.prototype.hasOwnProperty.call(procedures,record.procedure.type)) throw new Error('Procedimento desconhecido.');
    const teeth=record.procedure.selectedTeeth || [];
    if (!Array.isArray(teeth) || teeth.some(t => !/^(?:[1-4][1-8]|[5-8][1-5])$/.test(String(t)))) throw new Error('Numeração dentária inválida.');
    for (const key of Object.keys(flags)) if (record.anamnesis?.[key] != null && typeof record.anamnesis[key] !== 'boolean') throw new Error('As condições clínicas devem ser true ou false.');
    return record;
  }
  function maskSensitive(val, type) {
    const s = String(val || '').trim();
    if (!s) return '';
    const mode = String(type || 'cpf').toLowerCase();
    if (mode === 'cpf') {
      const clean = s.replace(/\D/g, '');
      if (clean.length === 11) {
        return `${clean.slice(0, 3)}.***.***-${clean.slice(9)}`;
      }
      return s.length > 5 ? `${s.slice(0, 3)}***${s.slice(-2)}` : '***';
    }
    if (mode === 'phone') {
      const clean = s.replace(/\D/g, '');
      if (clean.length >= 10) {
        return `(${clean.slice(0, 2)}) *****-${clean.slice(-4)}`;
      }
      return s.length > 4 ? `${s.slice(0, 2)}****${s.slice(-2)}` : '****';
    }
    if (mode === 'email') {
      const parts = s.split('@');
      if (parts.length === 2) {
        const u = parts[0];
        return `${u.slice(0, 2)}***@${parts[1]}`;
      }
      return '***@***';
    }
    return s.length > 4 ? `${s.slice(0, 2)}***${s.slice(-2)}` : '***';
  }

  function anonymizeRecord(record) {
    if (!record || typeof record !== 'object') return record;
    const copy = JSON.parse(JSON.stringify(record));
    if (copy.patient && typeof copy.patient === 'object') {
      const hash = Math.abs(String(copy.patient.cpf || copy.patient.name || Date.now()).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36).slice(0, 6).toUpperCase();
      copy.patient.name = `Paciente P-${hash}`;
      copy.patient.cpf = '000.000.000-00';
      copy.patient.rg = 'ANONIMIZADO';
      copy.patient.phone = '(00) 00000-0000';
      copy.patient.address = 'Endereço suprimido (Art. 12 LGPD)';
      copy.patient.email = 'paciente.anonimizado@lgpd.local';
    }
    copy.isAnonymizedForResearch = true;
    copy.anonymizedAt = new Date().toISOString();
    return copy;
  }

  function getLgpdBases() {
    return {
      clinicalData: {
        basis: 'Art. 11, II, f (Tutela da Saúde)',
        description: 'Tratamento de dados pessoais sensíveis de saúde realizado por profissionais da saúde para fins de assistência e tutela da saúde.'
      },
      retention: {
        basis: 'Art. 7º, II (Cumprimento de Obrigação Legal/Regulatória)',
        description: 'Guarda obrigatória de prontuários e termos periciais por no mínimo 20 anos (Lei 9.439/97, CFO e Conselho Federal de Odontologia).'
      },
      marketingImages: {
        basis: 'Art. 7º, I (Consentimento Específico e Destacado)',
        description: 'Uso de fotografias e vídeos em mídias sociais requer autorização isolada em Anexo A específico (Resolução CFO-196/2019).'
      },
      anonymization: {
        basis: 'Art. 12 (Dados Anonimizados)',
        description: 'Dados anonimizados não são considerados dados pessoais para os fins da LGPD, permitindo uso em aulas, artigos científicos e congressos.'
      }
    };
  }

  const api={escapeHTML,sanitizeHTML,validCPF,flags,validateRecord,maskSensitive,anonymizeRecord,getLgpdBases};
  root.DentalSafeSafety=api;
  if (typeof module !== 'undefined') module.exports=api;
})(typeof window !== 'undefined' ? window : globalThis);
