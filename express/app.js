/**
 * DentalSafe Express — Motor Guiado em Telas Independentes
 * Versão Simplificada, Limpa, Tátil e Lúdica (Apple HIG)
 */

'use strict';

// Estado global da sessão
const state = {
  activeScreen: 'screen-dentist', // 'screen-dentist' | 'screen-patient' | 'screen-procedure' | 'screen-review' | 'screen-tcle'
  dentist: {
    name: '',
    cro: '',
    clinic: '',
    phone: '',
    saveForFuture: true
  },
  patient: {
    name: '',
    cpf: '',
    birthDate: '',
    phone: ''
  },
  procedure: {
    id: 'implante',
    title: 'Implante Dentário & Enxerto Ósseo',
    customTitle: '',
    selectedTeeth: ['11'],
    dentitionMode: 'permanente' // 'permanente' | 'deciduo'
  },
  healthConditions: new Set(),
  certificate: {
    enabled: false,
    days: 2,
    cidCode: 'K08.1',
    includeCid: false
  },
  prescription: {
    enabled: false,
    presetId: 'cirurgico',
    items: []
  }
};

// SVGs Anatômicos Lúdicos dos Dentes
const TOOTH_SVGS = {
  molar: `<svg viewBox="0 0 32 36" fill="currentColor" width="22" height="26">
    <path d="M7 6C7 3.8 8.8 2 11 2H21C23.2 2 25 3.8 25 6C26.5 7.5 27 10 27 13C27 17 25 20 23 23L22 33C22 34 21 34.5 20 34C19 33.5 18 31 17 28C16.5 26.5 15.5 26.5 15 28C14 31 13 33.5 12 34C11 34.5 10 34 10 33L9 23C7 20 5 17 5 13C5 10 5.5 7.5 7 6Z" opacity="0.85"/>
    <path d="M11 6C11 7.5 13 8.5 16 8.5C19 8.5 21 7.5 21 6" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.6"/>
  </svg>`,
  premolar: `<svg viewBox="0 0 28 36" fill="currentColor" width="20" height="26">
    <path d="M7 6C7 3.8 8.8 2 11 2H17C19.2 2 21 3.8 21 6C22.5 7.5 23 10 23 13C23 17 21.5 20 20 23L19 33C19 34 18 34.5 17 34C16.2 33.5 15.5 30 14 27C12.5 30 11.8 33.5 11 34C10 34.5 9 34 9 33L8 23C6.5 20 5 17 5 13C5 10 5.5 7.5 7 6Z" opacity="0.85"/>
    <circle cx="14" cy="8" r="2" fill="#fff" opacity="0.5"/>
  </svg>`,
  canine: `<svg viewBox="0 0 26 36" fill="currentColor" width="18" height="26">
    <path d="M13 1.5C14.5 3.5 20 6.5 20 11C20 16 18 20 17 24L15.5 33.5C15.2 34.5 14 34.8 13.5 34C13 33 12 28 12 24C11 20 6 16 6 11C6 6.5 11.5 3.5 13 1.5Z" opacity="0.85"/>
    <path d="M13 4L13 12" stroke="#fff" stroke-width="1.2" opacity="0.6"/>
  </svg>`,
  incisor: `<svg viewBox="0 0 24 36" fill="currentColor" width="18" height="26">
    <path d="M5 4C5 2.8 6 2 7.2 2H16.8C18 2 19 2.8 19 4V13C19 17.5 17 21 16 25L14.5 33.5C14.2 34.5 13.2 34.8 12.8 34C12 32.5 11 28 11 25C10 21 5 17.5 5 13V4Z" opacity="0.85"/>
    <rect x="7" y="4" width="10" height="2" rx="1" fill="#fff" opacity="0.6"/>
  </svg>`
};

// Dicionário de Procedimentos
const PROCEDURES_DATA = {
  implante: {
    title: 'Implante Dentário & Enxerto Ósseo',
    icon: '🦷',
    desc: 'Instalação de implante osseointegrável e regeneração óssea guiada.',
    cid: 'K08.1'
  },
  extracao: {
    title: 'Exodontia / Cirurgia de Sisos',
    icon: '🔨',
    desc: 'Extração cirúrgica de terceiros molares inclusos, raízes ou dentes impactados.',
    cid: 'K01.1'
  },
  canal: {
    title: 'Endodontia (Tratamento de Canal)',
    icon: '⚡',
    desc: 'Descontaminação, preparo químico-mecânico e obturação tridimensional radicular.',
    cid: 'K04.0'
  },
  hof: {
    title: 'Harmonização Orofacial (HOF)',
    icon: '✨',
    desc: 'Toxina botulínica, ácido hialurônico e bioestimulador para funções orofaciais.',
    cid: 'M79.1'
  },
  protese: {
    title: 'Prótese Dentária, Coroas & Facetas',
    icon: '🛡️',
    desc: 'Reabilitação com prótese fixa sobre dentes/implantes e laminados cerâmicos.',
    cid: 'K08.4'
  },
  periodontia: {
    title: 'Periodontia & Raspagem Subgengival',
    icon: '🩺',
    desc: 'Tratamento de bolsas periodontais, raspagem e controle de perda de suporte.',
    cid: 'K05.3'
  },
  clareamento: {
    title: 'Clareamento Dental',
    icon: '⚪',
    desc: 'Clareamento dental em consultório com fotoativação ou moldeiras supervisionadas.',
    cid: 'K03.7'
  },
  restauracao: {
    title: 'Restauração Estética / Dentística',
    icon: '💎',
    desc: 'Remoção de cárie e restauração adesiva direta em resina composta nanoparticulada.',
    cid: 'K02.1'
  }
};

// Presets de Receituário
const RX_PRESETS = {
  cirurgico: {
    name: '🦷 Cirúrgico / Sisos / Implantes',
    desc: 'Amoxicilina + Ibuprofeno + Dipirona',
    items: [
      { name: 'Amoxicilina 500mg', dose: '500mg', freq: '8 em 8 horas', duration: '7 dias', qty: '1 caixa (21 cápsulas)', instructions: 'Tomar 1 cápsula via oral de 8 em 8 horas durante 7 dias contínuos.' },
      { name: 'Ibuprofeno 600mg', dose: '600mg', freq: '8 em 8 horas', duration: '3 dias', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral de 8 em 8 horas durante 3 dias para controle de edema.' },
      { name: 'Dipirona Sódica 1g', dose: '1g', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral de 6 em 6 horas somente em caso de dor.' }
    ]
  },
  alergico: {
    name: '🛡️ Alérgico a Penicilina',
    desc: 'Azitromicina + Paracetamol',
    items: [
      { name: 'Azitromicina 500mg', dose: '500mg', freq: '1x ao dia', duration: '3 dias', qty: '1 caixa (3 comprimidos)', instructions: 'Tomar 1 comprimido via oral 1 vez ao dia durante 3 dias (1h antes ou 2h após refeição).' },
      { name: 'Paracetamol 750mg', dose: '750mg', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral de 6 em 6 horas se houver dor ou febre.' }
    ]
  },
  canal: {
    name: '⚡ Canal / Dor Aguda',
    desc: 'Toragesic SL + Dipirona',
    items: [
      { name: 'Toragesic (Cetorolaco SL) 10mg', dose: '10mg', freq: '8 em 8 horas', duration: '2 dias', qty: '1 caixa (10 comprimidos)', instructions: 'Dissolver 1 comprimido sob a língua de 8 em 8 horas (uso máximo de 48 horas).' },
      { name: 'Dipirona Sódica 1g', dose: '1g', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido via oral se houver dor persistente.' }
    ]
  },
  leve: {
    name: '🌿 Analgesia Simples / Leve',
    desc: 'Dipirona 500mg',
    items: [
      { name: 'Dipirona Sódica 500mg', dose: '500mg', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 a 2 comprimidos via oral de 6 em 6 horas se dor.' }
    ]
  },
  hof: {
    name: '✨ HOF / Pós-Estético',
    desc: 'Paracetamol + Pomada de Arnica',
    items: [
      { name: 'Paracetamol 750mg', dose: '750mg', freq: '6 em 6 horas', duration: 'Se dor', qty: '1 caixa', instructions: 'Tomar 1 comprimido a cada 6 horas se desconforto (evitar anti-inflamatórios que aumentam manchas).' },
      { name: 'Gel / Pomada de Arnica Montana', dose: 'Tópico', freq: '3x ao dia', duration: '5 dias', qty: '1 bisnaga', instructions: 'Aplicar suavemente sobre as regiões tratadas com hematomas ou inchaço.' }
    ]
  }
};

// ==========================================================================
// Inicialização do Aplicativo
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedDentistInfo();
  setupMasks();
  renderLudicOdontogram();
  setupTouchSignature();
  showScreen('screen-dentist');
});

// ==========================================================================
// Gerenciador de Telas Guiadas
// ==========================================================================
function showScreen(screenId) {
  state.activeScreen = screenId;

  // Alterna painéis
  document.querySelectorAll('.wizard-screen').forEach(el => {
    el.classList.toggle('active-screen', el.id === screenId);
  });

  // Atualiza indicadores de progresso
  updateStepperIndicators(screenId);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepperIndicators(screenId) {
  const steps = {
    'screen-dentist': 1,
    'screen-patient': 1,
    'screen-procedure': 2,
    'screen-review': 3,
    'screen-tcle': 3
  };
  const currentStep = steps[screenId] || 1;

  document.querySelectorAll('.step-indicator').forEach(ind => {
    const s = parseInt(ind.getAttribute('data-step'), 10);
    ind.classList.toggle('active', s === currentStep);
    ind.classList.toggle('completed', s < currentStep);
  });
}

// ==========================================================================
// Tela 1A: Dados do Cirurgião-Dentista
// ==========================================================================
function submitDentistScreen() {
  const name = document.getElementById('field-dentist-name')?.value.trim();
  const cro = document.getElementById('field-dentist-cro')?.value.trim();

  if (!name) {
    alert('Por favor, informe o Nome do Cirurgião-Dentista.');
    document.getElementById('field-dentist-name')?.focus();
    return;
  }
  if (!cro) {
    alert('Por favor, informe o CRO e UF do profissional.');
    document.getElementById('field-dentist-cro')?.focus();
    return;
  }

  state.dentist.name = name;
  state.dentist.cro = cro;
  state.dentist.clinic = document.getElementById('field-clinic-name')?.value.trim() || '';
  state.dentist.phone = document.getElementById('field-clinic-phone')?.value.trim() || '';
  state.dentist.saveForFuture = document.getElementById('chk-save-dentist')?.checked ?? true;

  if (state.dentist.saveForFuture) {
    saveDentistInfoToStorage();
  }

  showScreen('screen-patient');
}

// ==========================================================================
// Tela 1B: Dados do Paciente
// ==========================================================================
function submitPatientScreen() {
  const name = document.getElementById('field-patient-name')?.value.trim();
  const cpf = document.getElementById('field-patient-cpf')?.value.trim();

  if (!name) {
    alert('Por favor, informe o Nome Completo do Paciente.');
    document.getElementById('field-patient-name')?.focus();
    return;
  }
  if (!cpf) {
    alert('Por favor, informe o CPF do Paciente.');
    document.getElementById('field-patient-cpf')?.focus();
    return;
  }

  state.patient.name = name;
  state.patient.cpf = cpf;
  state.patient.birthDate = document.getElementById('field-patient-birth')?.value || '';
  state.patient.phone = document.getElementById('field-patient-phone')?.value.trim() || '';

  syncPatientRecord();
  showScreen('screen-procedure');
}

// ==========================================================================
// Tela 2: Procedimento, Odontograma Lúdico e Condições
// ==========================================================================
function selectProcedureCard(procId) {
  state.procedure.id = procId;

  document.querySelectorAll('.proc-card').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-proc') === procId);
  });

  const customWrap = document.getElementById('custom-proc-input-wrap');
  if (customWrap) {
    customWrap.style.display = procId === 'outro' ? 'block' : 'none';
  }

  // Sugestões inteligentes
  if (procId === 'extracao' && state.procedure.selectedTeeth.length === 0) {
    presetSisos();
  } else if (procId === 'canal' && state.procedure.selectedTeeth.length === 0) {
    selectSingleTooth('11');
  }
}

// Odontograma Lúdico
function setDentitionMode(mode) {
  state.procedure.dentitionMode = mode;
  document.getElementById('btn-dent-perm')?.classList.toggle('active', mode === 'permanente');
  document.getElementById('btn-dent-dec')?.classList.toggle('active', mode === 'deciduo');
  renderLudicOdontogram();
}

function renderLudicOdontogram() {
  const container = document.getElementById('ludic-teeth-board');
  if (!container) return;

  const isDec = state.procedure.dentitionMode === 'deciduo';

  const supQ1 = isDec ? ['55','54','53','52','51'] : ['18','17','16','15','14','13','12','11'];
  const supQ2 = isDec ? ['61','62','63','64','65'] : ['21','22','23','24','25','26','27','28'];
  const infQ4 = isDec ? ['85','84','83','82','81'] : ['48','47','46','45','44','43','42','41'];
  const infQ3 = isDec ? ['71','72','73','74','75'] : ['31','32','33','34','35','36','37','38'];

  container.innerHTML = `
    <div class="arch-strip">
      <div class="arch-heading">Arcada Superior</div>
      <div class="teeth-flex-row">
        ${renderQuadrantButtons(supQ1)}
        <div class="midline-bar"></div>
        ${renderQuadrantButtons(supQ2)}
      </div>
    </div>

    <div class="arch-strip">
      <div class="teeth-flex-row">
        ${renderQuadrantButtons(infQ4)}
        <div class="midline-bar"></div>
        ${renderQuadrantButtons(infQ3)}
      </div>
      <div class="arch-heading">Arcada Inferior</div>
    </div>
  `;

  updateSelectedTeethSummary();
}

function renderQuadrantButtons(teethArray) {
  return teethArray.map(fdi => {
    const isSelected = state.procedure.selectedTeeth.includes(fdi);
    const info = getToothInfo(fdi);
    return `
      <div class="friendly-tooth-btn ${isSelected ? 'selected' : ''}" 
           data-fdi="${fdi}" 
           onclick="toggleFriendlyTooth('${fdi}')"
           title="Dente ${fdi} (${info.name})">
        <span class="tooth-fdi">${fdi}</span>
        <div class="tooth-art-wrap">
          ${TOOTH_SVGS[info.type] || TOOTH_SVGS.incisor}
        </div>
        <span class="tooth-kind">${info.short}</span>
      </div>
    `;
  }).join('');
}

function getToothInfo(fdi) {
  const last = parseInt(fdi.slice(-1), 10);
  if (last === 8) return { type: 'molar', name: '3º Molar (Siso)', short: 'Siso' };
  if (last >= 6) return { type: 'molar', name: 'Molar', short: 'Molar' };
  if (last >= 4) return { type: 'premolar', name: 'Pré-Molar', short: 'Pré' };
  if (last === 3) return { type: 'canine', name: 'Canino', short: 'Canino' };
  if (last === 2) return { type: 'incisor', name: 'Incisivo Lateral', short: 'Inc.L' };
  return { type: 'incisor', name: 'Incisivo Central', short: 'Inc.C' };
}

function toggleFriendlyTooth(fdi) {
  const idx = state.procedure.selectedTeeth.indexOf(fdi);
  if (idx >= 0) {
    state.procedure.selectedTeeth.splice(idx, 1);
  } else {
    state.procedure.selectedTeeth.push(fdi);
  }

  if (navigator.vibrate) navigator.vibrate(12);

  const el = document.querySelector(`.friendly-tooth-btn[data-fdi="${fdi}"]`);
  if (el) {
    el.classList.toggle('selected', state.procedure.selectedTeeth.includes(fdi));
  }

  updateSelectedTeethSummary();
}

function selectSingleTooth(fdi) {
  if (!state.procedure.selectedTeeth.includes(fdi)) {
    state.procedure.selectedTeeth.push(fdi);
    renderLudicOdontogram();
  }
}

function presetSisos() {
  ['18', '28', '38', '48'].forEach(s => {
    if (!state.procedure.selectedTeeth.includes(s)) state.procedure.selectedTeeth.push(s);
  });
  renderLudicOdontogram();
}

function presetArch(arch) {
  const isDec = state.procedure.dentitionMode === 'deciduo';
  const teeth = arch === 'sup'
    ? (isDec ? ['55','54','53','52','51','61','62','63','64','65'] : ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'])
    : (isDec ? ['85','84','83','82','81','71','72','73','74','75'] : ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38']);

  teeth.forEach(t => {
    if (!state.procedure.selectedTeeth.includes(t)) state.procedure.selectedTeeth.push(t);
  });
  renderLudicOdontogram();
}

function clearTeethSelection() {
  state.procedure.selectedTeeth = [];
  renderLudicOdontogram();
}

function updateSelectedTeethSummary() {
  const container = document.getElementById('selected-teeth-tags');
  const countEl = document.getElementById('teeth-count-badge');
  if (!container) return;

  const count = state.procedure.selectedTeeth.length;
  if (countEl) countEl.textContent = count;

  if (count === 0) {
    container.innerHTML = '<span style="color:var(--text-muted); font-size:12px;">Nenhum elemento selecionado (procedimento geral/arcada total).</span>';
  } else {
    const sorted = [...state.procedure.selectedTeeth].sort((a,b) => parseInt(a,10) - parseInt(b,10));
    container.innerHTML = sorted.map(t => `<span class="tooth-capsule">Dente ${t}</span>`).join('');
  }
}

// Condições de Saúde
function toggleCondition(el, key) {
  if (key === 'nenhuma') {
    state.healthConditions.clear();
    document.querySelectorAll('.condition-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    return;
  }

  document.getElementById('cond-none')?.classList.remove('active');

  if (state.healthConditions.has(key)) {
    state.healthConditions.delete(key);
    el.classList.remove('active');
  } else {
    state.healthConditions.add(key);
    el.classList.add('active');
  }
}

function submitProcedureScreen() {
  if (state.procedure.id === 'outro') {
    const custom = document.getElementById('field-custom-proc')?.value.trim();
    if (!custom) {
      alert('Por favor, informe o nome do procedimento personalizado.');
      document.getElementById('field-custom-proc')?.focus();
      return;
    }
    state.procedure.customTitle = custom;
  }

  renderReviewSummary();
  showScreen('screen-review');
}

// ==========================================================================
// Tela 3: Revisão Clara para Conferência
// ==========================================================================
function renderReviewSummary() {
  const container = document.getElementById('review-content-box');
  if (!container) return;

  const procKey = state.procedure.id;
  const procTitle = procKey === 'outro' ? state.procedure.customTitle : (PROCEDURES_DATA[procKey]?.title || 'Procedimento');
  const teethStr = state.procedure.selectedTeeth.length > 0 ? state.procedure.selectedTeeth.join(', ') : 'Geral / Arcada total';

  let condStr = 'Nenhuma comorbidade relevante declarada';
  if (state.healthConditions.size > 0) {
    const condLabels = {
      penicilina: 'Alergia a Penicilina',
      hipertensao: 'Hipertensão Arterial',
      diabetes: 'Diabetes Mellitus',
      cardiopatia: 'Cardiopatia / Anticoagulante',
      fumante: 'Tabagismo',
      gestante: 'Gestante / Lactante'
    };
    condStr = Array.from(state.healthConditions).map(k => condLabels[k] || k).join('; ');
  }

  container.innerHTML = `
    <div class="review-item">
      <span class="item-icon">👨‍⚕️</span>
      <div class="item-content">
        <strong>Cirurgião-Dentista Responsável</strong>
        <p>${escapeHtml(state.dentist.name)} — ${escapeHtml(state.dentist.cro)} (${escapeHtml(state.dentist.clinic || 'Consultório')})</p>
      </div>
    </div>

    <div class="review-item">
      <span class="item-icon">👤</span>
      <div class="item-content">
        <strong>Paciente</strong>
        <p>${escapeHtml(state.patient.name)} — CPF: ${escapeHtml(state.patient.cpf)} ${state.patient.phone ? `(Tel: ${escapeHtml(state.patient.phone)})` : ''}</p>
      </div>
    </div>

    <div class="review-item">
      <span class="item-icon">🦷</span>
      <div class="item-content">
        <strong>Procedimento & Dentes</strong>
        <p><strong>${escapeHtml(procTitle)}</strong> • Elementos: ${teethStr}</p>
      </div>
    </div>

    <div class="review-item">
      <span class="item-icon">🩺</span>
      <div class="item-content">
        <strong>Condições Sistêmicas & Alergias</strong>
        <p>${escapeHtml(condStr)}</p>
      </div>
    </div>
  `;
}

function submitGenerateTcle() {
  generateOfficialDocument();
  showScreen('screen-tcle');
}

// ==========================================================================
// Tela 4: TCLE Oficial Emitido
// ==========================================================================
function generateOfficialDocument() {
  const procKey = state.procedure.id;
  const procTitle = procKey === 'outro' ? state.procedure.customTitle : (PROCEDURES_DATA[procKey]?.title || 'Procedimento Clínico');
  const d = state.dentist;
  const p = state.patient;
  const teethStr = state.procedure.selectedTeeth.length > 0 ? state.procedure.selectedTeeth.join(', ') : 'região odontológica indicada';
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  let healthText = 'O paciente declara não possuir alergias ativas a fármacos anestésicos ou antibióticos, nem comorbidades sistêmicas não controladas.';
  if (state.healthConditions.size > 0) {
    const list = [];
    if (state.healthConditions.has('penicilina')) list.push('alergia comprovada a Penicilinas/Amoxicilina');
    if (state.healthConditions.has('hipertensao')) list.push('hipertensão arterial sistêmica sob controle');
    if (state.healthConditions.has('diabetes')) list.push('diabetes mellitus');
    if (state.healthConditions.has('cardiopatia')) list.push('cardiopatia / uso crônico de anticoagulantes');
    if (state.healthConditions.has('fumante')) list.push('hábito tabágico ativo');
    if (state.healthConditions.has('gestante')) list.push('gestação/lactação');
    if (list.length > 0) {
      healthText = `Histórico clínico relevante informado: <strong>${list.join('; ')}</strong>. O profissional adequou a conduta operatória e farmacológica a este perfil biológico.`;
    }
  }

  const sheet = document.getElementById('official-tcle-paper');
  if (!sheet) return;

  sheet.innerHTML = `
    <div class="tcle-paper-header">
      <h2>Termo de Consentimento Livre e Esclarecido (TCLE)</h2>
      <p>Conforme Código de Ética Odontológica (CFO), Código Civil Brasileiro (Arts. 186 e 951), CDC Art. 14 e LGPD (Lei 13.709/2018)</p>
    </div>

    <div class="tcle-paper-meta">
      <div><strong>Cirurgião-Dentista:</strong> ${escapeHtml(d.name)}</div>
      <div><strong>Inscrição CRO:</strong> ${escapeHtml(d.cro)}</div>
      <div><strong>Clínica:</strong> ${escapeHtml(d.clinic || 'Consultório Odontológico')}</div>
      <div><strong>Telefone:</strong> ${escapeHtml(d.phone || '—')}</div>
      <div><strong>Paciente:</strong> ${escapeHtml(p.name)}</div>
      <div><strong>CPF:</strong> ${escapeHtml(p.cpf)}</div>
      <div><strong>Nascimento:</strong> ${escapeHtml(p.birthDate || 'Não informado')}</div>
      <div><strong>Data da Emissão:</strong> ${currentDate}</div>
    </div>

    <div class="tcle-paper-body" contenteditable="true" spellcheck="false" title="Clique para editar qualquer texto se necessário">
      <h3>1. Procedimento Odontológico e Objeto</h3>
      <p>
        O(A) paciente acima identificado(a) manifesta sua expressa concordância na realização do procedimento de <strong>${escapeHtml(procTitle)}</strong>, a ser executado sobre o(s) elemento(s) dental(is): <strong>${teethStr}</strong>.
      </p>

      <h3>2. Esclarecimentos Clínicos e Riscos Biológicos</h3>
      <p>
        Declaro ter recebido explicações pormenorizadas acerca da indicação clínica, das etapas do ato odontológico, dos benefícios esperados e das alternativas viáveis de tratamento. Fui plenamente orientado(a) de que intervenções biológicas podem cursar com reações individuais transitórias, tais como edema local, sensibilidade moderada, desconforto mastigatório ou necessidade de ajustes oclusais e radiografias complementares de acompanhamento.
      </p>

      <h3>3. Declaração de Saúde e Anamnese</h3>
      <p>
        ${healthText}
      </p>

      <h3>4. Cuidados Pós-Operatórios e Adesão do Paciente</h3>
      <p>
        Comprometo-me a seguir à risca as prescrições farmacológicas de medicamentos receitados, cumprir os períodos de repouso físico recomendados, manter higienização oral cuidadosa e comparecer pontualmente a todas as consultas de retorno estipuladas pelo profissional para revisão e alta clínica.
      </p>

      <h3>5. Privacidade e Proteção de Dados (LGPD)</h3>
      <p>
        Autorizo a guarda e o processamento ético dos meus dados cadastrais e registros de imagem estritamente para fins de assistência odontológica e salvaguarda pericial, nos exatos termos da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
      </p>
    </div>

    <div class="tcle-paper-signatures">
      <div>
        <div class="signature-line-box">
          <strong>${escapeHtml(p.name)}</strong><br>
          <span style="font-size:11px; color:#64748b;">Paciente / Responsável Legal (CPF: ${escapeHtml(p.cpf)})</span>
        </div>
      </div>
      <div>
        <div class="signature-line-box">
          <strong>${escapeHtml(d.name)}</strong><br>
          <span style="font-size:11px; color:#64748b;">Cirurgião-Dentista Responsável (${escapeHtml(d.cro)})</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Módulo Sequencial 1: "Deseja Gerar Atestado?"
// ==========================================================================
function openAtestadoModule() {
  document.getElementById('post-modal-atestado').style.display = 'block';
  setDaysAtestado(state.certificate.days);
  document.getElementById('post-modal-atestado').scrollIntoView({ behavior: 'smooth' });
}

function skipAtestadoModule() {
  document.getElementById('post-modal-atestado').style.display = 'none';
  openPrescriptionModule();
}

function setDaysAtestado(days) {
  state.certificate.days = days;
  document.querySelectorAll('.day-btn').forEach(btn => {
    const d = parseInt(btn.getAttribute('data-days'), 10);
    btn.classList.toggle('active', d === days);
  });
  renderAtestadoSheet();
}

function toggleCidAtestado(cb) {
  state.certificate.includeCid = cb.checked;
  renderAtestadoSheet();
}

function renderAtestadoSheet() {
  const container = document.getElementById('atestado-sheet-render');
  if (!container) return;

  const d = state.dentist;
  const p = state.patient;
  const days = state.certificate.days;
  const daysStr = days === 1 ? '1 (um) dia' : `${days} (${extensoDias(days)}) dias`;
  const cidText = state.certificate.includeCid 
    ? ` — CID-10: <strong>${state.certificate.cidCode}</strong> (Autorizado expressamente pelo paciente - Resolução CFO 105/2010)` 
    : '';
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:24px 30px; text-align:center; color:#1d1d1f; font-size:13.5px; line-height:1.7;">
      <h3 style="font-size:16px; font-weight:800; color:#0071e3; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:12px;">Atestado Odontológico</h3>
      <p style="text-align:justify; margin-bottom:18px;">
        Atesto para os devidos fins de dispensa laboral e comprovação médica que o(a) paciente <strong>${escapeHtml(p.name)}</strong>, inscrito(a) no CPF sob o nº <strong>${escapeHtml(p.cpf)}</strong>, esteve sob meus cuidados profissionais nesta data para realização de intervenção odontológica, necessitando de <strong>${daysStr}</strong> de afastamento de suas atividades laborativas e repouso a partir desta data para adequada convalescença.${cidText}
      </p>
      <div style="margin-top:16px; font-size:12.5px; color:#64748b;">${dateStr}</div>
      <div style="margin:28px auto 0; width:260px; border-top:1px solid #334155; padding-top:6px; font-weight:700; font-size:12px;">
        ${escapeHtml(d.name)}<br>
        <span style="font-weight:500; font-size:11px;">Cirurgião-Dentista — ${escapeHtml(d.cro)}</span>
      </div>
    </div>
  `;
}

function extensoDias(n) {
  const m = { 1: 'um', 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis', 7: 'sete', 10: 'dez', 14: 'quatorze', 15: 'quinze' };
  return m[n] || String(n);
}

function printAtestadoOnly() {
  const content = document.getElementById('atestado-sheet-render')?.innerHTML;
  if (!content) return;

  const win = window.open('', '_blank', 'width=800,height=700');
  win.document.write(`
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Atestado Odontológico — ${escapeHtml(state.patient.name)}</title>
      <style>body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; margin: 0; }</style>
    </head>
    <body>
      ${content}
      <script>window.onload = function() { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  win.document.close();
}

// ==========================================================================
// Módulo Sequencial 2: "Deseja Gerar Receita?"
// ==========================================================================
function openPrescriptionModule() {
  document.getElementById('post-modal-prescription').style.display = 'block';
  selectRxPresetOption(state.prescription.presetId || 'cirurgico');
  document.getElementById('post-modal-prescription').scrollIntoView({ behavior: 'smooth' });
}

function selectRxPresetOption(presetKey) {
  state.prescription.presetId = presetKey;
  document.querySelectorAll('.rx-card-option').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-rx') === presetKey);
  });
  renderPrescriptionSheet();
}

function renderPrescriptionSheet() {
  const container = document.getElementById('prescription-sheet-render');
  if (!container) return;

  const preset = RX_PRESETS[state.prescription.presetId] || RX_PRESETS.cirurgico;
  const d = state.dentist;
  const p = state.patient;
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const itemsHtml = preset.items.map((it, idx) => `
    <div style="margin-bottom:14px; border-bottom:1px dashed #e2e8f0; padding-bottom:8px;">
      <div style="font-weight:700; font-size:13.5px; color:#0f172a; display:flex; justify-content:space-between;">
        <span>${idx + 1}. ${escapeHtml(it.name)}</span>
        <span style="font-size:11.5px; color:#64748b;">${escapeHtml(it.qty)}</span>
      </div>
      <div style="font-size:12.5px; color:#475569; margin-top:2px;">
        Posologia: ${escapeHtml(it.instructions)}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:26px 30px; color:#1d1d1f; font-size:13.5px; line-height:1.6;">
      <div style="text-align:center; border-bottom:2px solid #0071e3; padding-bottom:12px; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:800; color:#0071e3; text-transform:uppercase; margin:0;">Receituário Odontológico</h3>
        <span style="font-size:11.5px; color:#64748b;">${escapeHtml(d.clinic || 'Clínica Odontológica')} ${d.phone ? `• Tel: ${escapeHtml(d.phone)}` : ''}</span>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px; margin-bottom:18px; font-size:12px;">
        <strong>Paciente:</strong> ${escapeHtml(p.name)} | <strong>CPF:</strong> ${escapeHtml(p.cpf)} | <strong>Data:</strong> ${dateStr}
      </div>

      <div style="margin-bottom:20px;">
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:#0071e3; margin-bottom:10px;">Uso Interno</div>
        ${itemsHtml}
      </div>

      <div style="margin:32px auto 0; width:260px; border-top:1px solid #334155; padding-top:6px; font-weight:700; font-size:12px; text-align:center;">
        ${escapeHtml(d.name)}<br>
        <span style="font-weight:500; font-size:11px;">Cirurgião-Dentista — ${escapeHtml(d.cro)}</span>
      </div>
    </div>
  `;
}

function printPrescriptionOnly() {
  const content = document.getElementById('prescription-sheet-render')?.innerHTML;
  if (!content) return;

  const win = window.open('', '_blank', 'width=800,height=750');
  win.document.write(`
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Receita Odontológica — ${escapeHtml(state.patient.name)}</title>
      <style>body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; margin: 0; }</style>
    </head>
    <body>
      ${content}
      <script>window.onload = function() { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  win.document.close();
}

// ==========================================================================
// Utilitários de Ação e Compartilhamento
// ==========================================================================
function printTcleDocument() {
  window.print();
}

function sendWhatsAppNotice() {
  const phone = state.patient.phone.replace(/\D/g, '');
  if (!phone) {
    alert('O telefone do paciente não foi informado.');
    return;
  }
  const procKey = state.procedure.id;
  const procTitle = procKey === 'outro' ? state.procedure.customTitle : (PROCEDURES_DATA[procKey]?.title || 'Procedimento');
  const msg = encodeURIComponent(
    `Olá, ${state.patient.name}! Aqui é do consultório de ${state.dentist.name}.\n\n` +
    `Seu Termo de Consentimento Livre e Esclarecido (TCLE) para o procedimento de *${procTitle}* foi formalizado com sucesso em nosso prontuário digital.\n\n` +
    `Seguimos à total disposição!`
  );
  window.open(`https://api.whatsapp.com/send?phone=55${phone}&text=${msg}`, '_blank');
}

function copyTcleTextToClipboard() {
  const sheet = document.getElementById('official-tcle-paper');
  if (!sheet) return;
  navigator.clipboard.writeText(sheet.innerText).then(() => {
    alert('Texto do TCLE copiado com sucesso!');
  }).catch(() => {
    alert('Selecione e copie o texto diretamente da folha.');
  });
}

function startNewService() {
  if (confirm('Deseja iniciar um novo atendimento? Os dados do paciente atual serão limpos.')) {
    document.getElementById('field-patient-name').value = '';
    document.getElementById('field-patient-cpf').value = '';
    document.getElementById('field-patient-birth').value = '';
    document.getElementById('field-patient-phone').value = '';
    state.procedure.selectedTeeth = ['11'];
    state.healthConditions.clear();
    showScreen('screen-dentist');
  }
}

// Canvas Touch Signature
let sigCanvas, sigCtx, isDrawing = false;

function setupTouchSignature() {
  sigCanvas = document.getElementById('touch-signature-canvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');

  function resize() {
    const r = sigCanvas.getBoundingClientRect();
    sigCanvas.width = r.width * window.devicePixelRatio || 400;
    sigCanvas.height = r.height * window.devicePixelRatio || 130;
    sigCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    sigCtx.strokeStyle = '#0071e3';
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
  }

  resize();
  window.addEventListener('resize', resize);

  function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  sigCanvas.addEventListener('mousedown', e => {
    isDrawing = true;
    const p = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(p.x, p.y);
  });

  sigCanvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    const p = getPos(e);
    sigCtx.lineTo(p.x, p.y);
    sigCtx.stroke();
  });

  ['mouseup', 'mouseleave'].forEach(evt => {
    sigCanvas.addEventListener(evt, () => { isDrawing = false; });
  });

  sigCanvas.addEventListener('touchstart', e => {
    e.preventDefault();
    isDrawing = true;
    const p = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(p.x, p.y);
  }, { passive: false });

  sigCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isDrawing) return;
    const p = getPos(e);
    sigCtx.lineTo(p.x, p.y);
    sigCtx.stroke();
  }, { passive: false });

  sigCanvas.addEventListener('touchend', () => { isDrawing = false; });
}

function clearTouchSignature() {
  if (!sigCanvas || !sigCtx) return;
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

// Persistência
function loadSavedDentistInfo() {
  try {
    const raw = localStorage.getItem('dentalsafe_clinic_settings');
    if (raw) {
      const s = JSON.parse(raw);
      if (s.dentistName) document.getElementById('field-dentist-name').value = s.dentistName;
      if (s.cro) document.getElementById('field-dentist-cro').value = s.cro;
      if (s.clinicName) document.getElementById('field-clinic-name').value = s.clinicName;
      if (s.phone) document.getElementById('field-clinic-phone').value = s.phone;
    }
  } catch (e) {
    console.warn('Erro ao ler dentalsafe_clinic_settings:', e);
  }
}

function saveDentistInfoToStorage() {
  try {
    const payload = {
      dentistName: state.dentist.name,
      cro: state.dentist.cro,
      clinicName: state.dentist.clinic,
      phone: state.dentist.phone
    };
    localStorage.setItem('dentalsafe_clinic_settings', JSON.stringify(payload));
  } catch (e) {
    console.warn('Erro ao salvar dentalsafe_clinic_settings:', e);
  }
}

function syncPatientRecord() {
  try {
    const p = state.patient;
    const raw = localStorage.getItem('dentalsafe_patients');
    const list = raw ? JSON.parse(raw) : [];
    const cleanCpf = p.cpf.replace(/\D/g, '');
    const idx = list.findIndex(i => (i.cpf || '').replace(/\D/g, '') === cleanCpf);

    const record = {
      id: idx >= 0 ? list[idx].id : 'pat_' + Date.now(),
      name: p.name,
      cpf: p.cpf,
      birthDate: p.birthDate,
      phone: p.phone,
      lastProcedure: state.procedure.id,
      lastDate: new Date().toISOString().split('T')[0]
    };

    if (idx >= 0) list[idx] = { ...list[idx], ...record };
    else list.unshift(record);

    localStorage.setItem('dentalsafe_patients', JSON.stringify(list));
  } catch (e) {
    console.warn('Erro ao salvar paciente em dentalsafe_patients:', e);
  }
}

// Máscaras de entrada
function setupMasks() {
  const cpfEl = document.getElementById('field-patient-cpf');
  if (cpfEl) {
    cpfEl.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
      e.target.value = v;
    });
  }

  const phoneEl = document.getElementById('field-patient-phone');
  if (phoneEl) {
    phoneEl.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      e.target.value = v;
    });
  }
}

function initTheme() {
  const saved = localStorage.getItem('dentalsafe_theme') || 'light';
  if (saved === 'dark') document.body.classList.add('dark-mode');
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dentalsafe_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
