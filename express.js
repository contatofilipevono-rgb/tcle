/**
 * DentalSafe Express — Motor Rápido em 3 Passos (Apple Style)
 * Arquitetura Limpa, Odontograma Lúdico, Atestado Expresso e Receita 1-Clique.
 */

'use strict';

// Estado global do atendimento express
const expressState = {
  currentStep: 1,
  dentist: {
    name: '',
    cro: '',
    clinic: '',
    phone: ''
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
    days: 2,
    reason: 'repouso e recuperação pós-operatória odontológica',
    includeCid: false,
    cidCode: 'K08.1'
  },
  prescription: {
    presetId: 'cirurgico',
    customItems: []
  }
};

// SVG Icons dos Dentes Lúdicos
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

// Dicionário de Procedimentos Express
const PROCEDURES_MAP = {
  implante: {
    title: 'Implante Dentário & Enxerto Ósseo',
    icon: '🦷',
    desc: 'Cirurgia de implante osteointegrado, reabilitação e enxerto ósseo.',
    defaultCid: 'K08.1'
  },
  extracao: {
    title: 'Exodontia / Cirurgia de Sisos',
    icon: '🔨',
    desc: 'Extração cirúrgica de terceiros molares inclusos, impactados ou raízes.',
    defaultCid: 'K01.1'
  },
  canal: {
    title: 'Endodontia (Tratamento de Canal)',
    icon: '⚡',
    desc: 'Biopulpectomia, instrumentação rotatória e obturação biocerâmica tridimensional.',
    defaultCid: 'K04.0'
  },
  hof: {
    title: 'Harmonização Orofacial (HOF)',
    icon: '✨',
    desc: 'Aplicação de Toxina Botulínica, Preenchedores e Bioestimuladores de colágeno.',
    defaultCid: 'M79.1'
  },
  protese: {
    title: 'Prótese Dentária, Coroas & Facetas',
    icon: '🛡️',
    desc: 'Próteses fixas sobre dente/implante, facetas em cerâmica e reabilitação oral.',
    defaultCid: 'K08.4'
  },
  periodontia: {
    title: 'Periodontia & Raspagem Subgengival',
    icon: '🩺',
    desc: 'Raspagem, alisamento radicular e controle de perda óssea periodontal.',
    defaultCid: 'K05.3'
  },
  clareamento: {
    title: 'Clareamento Dental',
    icon: '⚪',
    desc: 'Clareamento em consultório e/ou supervisionado caseiro com moldeiras.',
    defaultCid: 'K03.7'
  },
  restauracao: {
    title: 'Restauração Estética / Dentística',
    icon: '💎',
    desc: 'Remoção de tecido cariado e restauração direta com resina composta nanoparticulada.',
    defaultCid: 'K02.1'
  }
};

// Presets de Receita 1-Clique
const RX_PRESETS = {
  cirurgico: {
    name: '🦷 Padrão Cirúrgico / Sisos / Implantes',
    desc: 'Antibiótico + Anti-inflamatório + Analgésico Potente',
    items: [
      { name: 'Amoxicilina 500mg', instructions: 'Tomar 1 cápsula por via oral a cada 8 horas durante 7 dias contínuos.' },
      { name: 'Ibuprofeno 600mg', instructions: 'Tomar 1 comprimido por via oral a cada 8 horas durante 3 dias para controle de edema.' },
      { name: 'Dipirona Sódica 1g', instructions: 'Tomar 1 comprimido por via oral a cada 6 horas somente em caso de dor.' }
    ]
  },
  alergico: {
    name: '🛡️ Paciente Alérgico a Penicilina',
    desc: 'Macrolídeo seguro + Analgesia eficaz',
    items: [
      { name: 'Azitromicina 500mg', instructions: 'Tomar 1 comprimido por via oral uma vez ao dia durante 3 dias (1h antes ou 2h após refeições).' },
      { name: 'Paracetamol 750mg', instructions: 'Tomar 1 comprimido por via oral a cada 6 horas se houver dor ou desconforto.' }
    ]
  },
  canal: {
    name: '⚡ Endodontia / Dor Aguda / Pulpites',
    desc: 'Anti-inflamatório sublingual potente + Analgesia',
    items: [
      { name: 'Toragesic (Cetorolaco Trometamol) 10mg SL', instructions: 'Dissolver 1 comprimido sob a língua a cada 8 horas (máximo 48 horas de uso).' },
      { name: 'Dipirona Sódica 1g', instructions: 'Tomar 1 comprimido a cada 6 horas se dor persistente.' }
    ]
  },
  leve: {
    name: '🌿 Procedimento Leve / Dor Moderada',
    desc: 'Analgesia simples para procedimentos rotineiros',
    items: [
      { name: 'Dipirona Sódica 500mg', instructions: 'Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor moderada.' }
    ]
  },
  hof: {
    name: '✨ HOF / Pós-Procedimento Estético',
    desc: 'Analgésico seguro que não potencializa sangramento + Tópico',
    items: [
      { name: 'Paracetamol 750mg', instructions: 'Tomar 1 comprimido a cada 6 horas em caso de desconforto local (evitar AAS/AINEs que aumentam equimoses).' },
      { name: 'Gel de Arnica Montana / Hirudoid', instructions: 'Aplicar suavemente sobre as regiões com edema ou hematomas, 3 vezes ao dia.' }
    ]
  }
};

// ==========================================================================
// Inicialização e Ciclo de Vida
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedClinicSettings();
  setupInputMasks();
  renderLudicOdontogram();
  setupSignaturePad();
  updateStepUI(1);
});

// ==========================================================================
// Navegação do Stepper (Passos 1, 2 e 3)
// ==========================================================================
function goToStep(step) {
  if (step === 2) {
    if (!validateStep1()) return;
    saveClinicSettings();
    syncPatientToStorage();
  } else if (step === 3) {
    if (!validateStep2()) return;
    generateOfficialTcle();
    initPostTcleModules();
  }

  expressState.currentStep = step;
  updateStepUI(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepUI(step) {
  // Atualiza botões do Stepper
  const navItems = document.querySelectorAll('.step-item');
  navItems.forEach(item => {
    const itemStep = parseInt(item.dataset ? item.dataset.step : (item.getAttribute?.('data-step') || 0), 10);
    item.classList.remove('active', 'completed');
    if (itemStep === step) {
      item.classList.add('active');
    } else if (itemStep < step) {
      item.classList.add('completed');
    }
  });

  // Atualiza painéis do Wizard
  const stepPanels = document.querySelectorAll('.wizard-step');
  stepPanels.forEach(panel => {
    const panelStep = parseInt(panel.dataset ? panel.dataset.step : (panel.getAttribute?.('data-step') || 0), 10);
    if (panelStep === step) {
      panel.classList.add('active-step');
    } else {
      panel.classList.remove('active-step');
    }
  });
}

// ==========================================================================
// Validação do Passo 1
// ==========================================================================
function validateStep1() {
  const dentistName = document.getElementById('exp-dentist-name')?.value.trim();
  const dentistCro = document.getElementById('exp-dentist-cro')?.value.trim();
  const patientName = document.getElementById('exp-patient-name')?.value.trim();
  const patientCpf = document.getElementById('exp-patient-cpf')?.value.trim();

  if (!dentistName) {
    alert('Por favor, informe o Nome do Cirurgião-Dentista.');
    document.getElementById('exp-dentist-name')?.focus();
    return false;
  }
  if (!dentistCro) {
    alert('Por favor, informe o número do CRO e UF do profissional.');
    document.getElementById('exp-dentist-cro')?.focus();
    return false;
  }
  if (!patientName) {
    alert('Por favor, informe o Nome Completo do Paciente.');
    document.getElementById('exp-patient-name')?.focus();
    return false;
  }
  if (!patientCpf) {
    alert('Por favor, informe o CPF do Paciente para validade pericial do documento.');
    document.getElementById('exp-patient-cpf')?.focus();
    return false;
  }

  // Atualiza estado
  expressState.dentist.name = dentistName;
  expressState.dentist.cro = dentistCro;
  expressState.dentist.clinic = document.getElementById('exp-clinic-name')?.value.trim() || '';
  expressState.dentist.phone = document.getElementById('exp-clinic-phone')?.value.trim() || '';

  expressState.patient.name = patientName;
  expressState.patient.cpf = patientCpf;
  expressState.patient.birthDate = document.getElementById('exp-patient-birth')?.value || '';
  expressState.patient.phone = document.getElementById('exp-patient-phone')?.value.trim() || '';

  return true;
}

// ==========================================================================
// Validação do Passo 2
// ==========================================================================
function validateStep2() {
  if (expressState.procedure.id === 'outro') {
    const custom = document.getElementById('exp-custom-proc-title')?.value.trim();
    if (!custom) {
      alert('Por favor, digite o nome do procedimento personalizado.');
      document.getElementById('exp-custom-proc-title')?.focus();
      return false;
    }
    expressState.procedure.customTitle = custom;
  }
  return true;
}

// ==========================================================================
// Seleção de Procedimento
// ==========================================================================
function selectProcedure(procId) {
  expressState.procedure.id = procId;

  // Atualiza cards visuais
  document.querySelectorAll('.proc-chip-card').forEach(card => {
    const p = card.dataset ? card.dataset.proc : (card.getAttribute?.('data-proc') || '');
    if (p === procId) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  const customInputWrap = document.getElementById('exp-custom-proc-wrap');
  if (customInputWrap) {
    customInputWrap.style.display = procId === 'outro' ? 'block' : 'none';
  }

  // Sugestões inteligentes de dentes
  if (procId === 'extracao' && expressState.procedure.selectedTeeth.length === 0) {
    expressPresetSisos();
  } else if (procId === 'canal' && expressState.procedure.selectedTeeth.length === 0) {
    expressSelectTooth('11');
  }
}

// ==========================================================================
// ODONTOGRAMA LÚDICO (Permanente e Decíduo)
// ==========================================================================
function setOdontoDentition(mode) {
  expressState.procedure.dentitionMode = mode;
  document.getElementById('btn-mode-perm')?.classList.toggle('active', mode === 'permanente');
  document.getElementById('btn-mode-dec')?.classList.toggle('active', mode === 'deciduo');
  renderLudicOdontogram();
}

function renderLudicOdontogram() {
  const container = document.getElementById('odonto-board-content');
  if (!container) return;

  const isDeciduo = expressState.procedure.dentitionMode === 'deciduo';

  // Configuração das arcadas
  const upperTeeth = isDeciduo 
    ? [['55','54','53','52','51'], ['61','62','63','64','65']] 
    : [['18','17','16','15','14','13','12','11'], ['21','22','23','24','25','26','27','28']];

  const lowerTeeth = isDeciduo 
    ? [['85','84','83','82','81'], ['71','72','73','74','75']] 
    : [['48','47','46','45','44','43','42','41'], ['31','32','33','34','35','36','37','38']];

  container.innerHTML = `
    <!-- Arcada Superior -->
    <div class="arch-container">
      <div class="arch-tag"><span>Arcada Superior (Maxila)</span></div>
      <div class="teeth-linear-row">
        ${renderTeethQuadrant(upperTeeth[0])}
        <div class="quadrant-divider"></div>
        ${renderTeethQuadrant(upperTeeth[1])}
      </div>
    </div>

    <!-- Arcada Inferior -->
    <div class="arch-container">
      <div class="teeth-linear-row">
        ${renderTeethQuadrant(lowerTeeth[0])}
        <div class="quadrant-divider"></div>
        ${renderTeethQuadrant(lowerTeeth[1])}
      </div>
      <div class="arch-tag"><span>Arcada Inferior (Mandíbula)</span></div>
    </div>
  `;

  updateSelectedTeethDisplay();
}

function renderTeethQuadrant(teethArray) {
  return teethArray.map(fdi => {
    const isSelected = expressState.procedure.selectedTeeth.includes(fdi);
    const toothInfo = getToothTypeInfo(fdi);
    return `
      <div class="ludic-tooth ${isSelected ? 'selected' : ''}" 
           data-fdi="${fdi}" 
           onclick="toggleLudicTooth('${fdi}')"
           title="Dente ${fdi} (${toothInfo.name})">
        <span class="fdi-label">${fdi}</span>
        <div class="tooth-svg-wrap">
          ${TOOTH_SVGS[toothInfo.type] || TOOTH_SVGS.incisor}
        </div>
        <span class="tooth-type-sub">${toothInfo.short}</span>
      </div>
    `;
  }).join('');
}

function getToothTypeInfo(fdi) {
  const digit = parseInt(fdi.slice(-1), 10);
  if (digit === 8) return { type: 'molar', name: '3º Molar (Siso)', short: 'Siso' };
  if (digit >= 6) return { type: 'molar', name: 'Molar', short: 'Molar' };
  if (digit >= 4) return { type: 'premolar', name: 'Pré-Molar', short: 'Pré' };
  if (digit === 3) return { type: 'canine', name: 'Canino', short: 'Canino' };
  if (digit === 2) return { type: 'incisor', name: 'Incisivo Lateral', short: 'Inc.L' };
  return { type: 'incisor', name: 'Incisivo Central', short: 'Inc.C' };
}

function toggleLudicTooth(fdi) {
  const idx = expressState.procedure.selectedTeeth.indexOf(fdi);
  if (idx >= 0) {
    expressState.procedure.selectedTeeth.splice(idx, 1);
  } else {
    expressState.procedure.selectedTeeth.push(fdi);
  }

  // Efeito tátil em dispositivos compatíveis
  if (navigator.vibrate) navigator.vibrate(12);

  // Atualiza classes do elemento
  const toothEl = document.querySelector(`.ludic-tooth[data-fdi="${fdi}"]`);
  if (toothEl) {
    toothEl.classList.toggle('selected', expressState.procedure.selectedTeeth.includes(fdi));
  }

  updateSelectedTeethDisplay();
}

function expressSelectTooth(fdi) {
  if (!expressState.procedure.selectedTeeth.includes(fdi)) {
    expressState.procedure.selectedTeeth.push(fdi);
    renderLudicOdontogram();
  }
}

function expressPresetSisos() {
  const sisos = ['18', '28', '38', '48'];
  sisos.forEach(s => {
    if (!expressState.procedure.selectedTeeth.includes(s)) {
      expressState.procedure.selectedTeeth.push(s);
    }
  });
  renderLudicOdontogram();
}

function expressPresetArch(arch) {
  const isDeciduo = expressState.procedure.dentitionMode === 'deciduo';
  const teeth = arch === 'sup' 
    ? (isDeciduo ? ['55','54','53','52','51','61','62','63','64','65'] : ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'])
    : (isDeciduo ? ['85','84','83','82','81','71','72','73','74','75'] : ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38']);

  teeth.forEach(t => {
    if (!expressState.procedure.selectedTeeth.includes(t)) {
      expressState.procedure.selectedTeeth.push(t);
    }
  });
  renderLudicOdontogram();
}

function expressClearTeeth() {
  expressState.procedure.selectedTeeth = [];
  renderLudicOdontogram();
}

function updateSelectedTeethDisplay() {
  const container = document.getElementById('selected-teeth-chips-wrap');
  const countSpan = document.getElementById('selected-teeth-count');
  if (!container) return;

  const count = expressState.procedure.selectedTeeth.length;
  if (countSpan) countSpan.textContent = count;

  if (count === 0) {
    container.innerHTML = '<span style="color:var(--text-muted); font-size:12px;">Nenhum elemento dental selecionado (procedimento geral).</span>';
  } else {
    // Ordena numéricamente
    const sorted = [...expressState.procedure.selectedTeeth].sort((a,b) => parseInt(a,10) - parseInt(b,10));
    container.innerHTML = sorted.map(t => `<span class="tooth-badge">Dente ${t}</span>`).join('');
  }
}

// ==========================================================================
// Condições de Saúde (Chips de 1 clique)
// ==========================================================================
function toggleHealthChip(chipEl, conditionKey) {
  if (conditionKey === 'nenhuma') {
    expressState.healthConditions.clear();
    document.querySelectorAll('.health-toggle-chip').forEach(c => c.classList.remove('active'));
    chipEl.classList.add('active');
    return;
  }

  // Remove o chip de 'nenhuma' se selecionar algo específico
  const noneChip = document.getElementById('chip-cond-none');
  if (noneChip) noneChip.classList.remove('active');

  if (expressState.healthConditions.has(conditionKey)) {
    expressState.healthConditions.delete(conditionKey);
    chipEl.classList.remove('active');
  } else {
    expressState.healthConditions.add(conditionKey);
    chipEl.classList.add('active');
  }
}

// ==========================================================================
// Geração do TCLE Oficial (Passo 3)
// ==========================================================================
function generateOfficialTcle() {
  const procKey = expressState.procedure.id;
  const procData = PROCEDURES_MAP[procKey] || { title: expressState.procedure.customTitle || 'Procedimento Odontológico Especializado' };
  const procTitle = procKey === 'outro' ? expressState.procedure.customTitle : procData.title;

  const d = expressState.dentist;
  const p = expressState.patient;
  const teethList = expressState.procedure.selectedTeeth.length > 0 
    ? expressState.procedure.selectedTeeth.join(', ') 
    : 'Área odontológica clínica pertinente';

  // Alertas e especificidades baseados em comorbidades
  let healthWarningText = 'O paciente nega comorbidades sistêmicas graves, alergias medicamentosas ativas ou contraindicações específicas para o ato odontológico.';
  if (expressState.healthConditions.size > 0) {
    const list = [];
    if (expressState.healthConditions.has('penicilina')) list.push('alergia declarada a Penicilinas/Betalactâmicos (contraindicando amoxicilina)');
    if (expressState.healthConditions.has('hipertensao')) list.push('hipertensão arterial sistêmica em acompanhamento');
    if (expressState.healthConditions.has('diabetes')) list.push('diabetes mellitus (necessitando cuidados adicionais de cicatrização e glicemia)');
    if (expressState.healthConditions.has('cardiopatia')) list.push('cardiopatia/uso de anticoagulantes (exigindo hemostasia local meticulosa)');
    if (expressState.healthConditions.has('fumante')) list.push('tabagismo ativo (fator que compromete a microcirculação e tecidos ósseos)');
    if (expressState.healthConditions.has('gestante')) list.push('gestação/lactação (com adequação rigorosa de anestésicos e fármacos)');
    if (list.length > 0) {
      healthWarningText = `Histórico e comorbidades registradas: <strong>${list.join('; ')}</strong>. Todas as precauções e contraindicações farmacológicas foram rigorosamente consideradas no planejamento do caso.`;
    }
  }

  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const sheetContainer = document.getElementById('tcle-document-render');
  if (!sheetContainer) return;

  sheetContainer.innerHTML = `
    <div class="tcle-sheet-header">
      <h2>Termo de Consentimento Livre e Esclarecido (TCLE)</h2>
      <p>Embasamento Legal: Código de Ética Odontológica (CFO) | Código Civil Brasileiro (Arts. 186, 927 e 951) | CDC Art. 14 | LGPD (Lei 13.709/2018)</p>
    </div>

    <div class="tcle-metadata-box">
      <div><strong>Cirurgião-Dentista:</strong> ${escapeHtml(d.name)}</div>
      <div><strong>Inscrição CRO:</strong> ${escapeHtml(d.cro)}</div>
      <div><strong>Clínica:</strong> ${escapeHtml(d.clinic || 'Consultório Odontológico')}</div>
      <div><strong>Telefone:</strong> ${escapeHtml(d.phone || '—')}</div>
      <div><strong>Paciente:</strong> ${escapeHtml(p.name)}</div>
      <div><strong>CPF:</strong> ${escapeHtml(p.cpf)}</div>
      <div><strong>Data de Nasc.:</strong> ${escapeHtml(p.birthDate || 'Não informada')}</div>
      <div><strong>Data do Termo:</strong> ${currentDate}</div>
    </div>

    <div class="tcle-body-content">
      <h3>1. Procedimento Proposto & Elementos Dentais</h3>
      <p>
        Pelo presente instrumento, o(a) paciente acima qualificado(a) declara ter sido plenamente esclarecido(a) e concorda voluntariamente com a realização do procedimento de <strong>${escapeHtml(procTitle)}</strong>, a ser executado sobre o(s) elemento(s) dental(is): <strong>${teethList}</strong>.
      </p>

      <h3>2. Esclarecimento Clínico, Riscos e Previsibilidade</h3>
      <p>
        Declaro que recebi explicação minuciosa e em linguagem acessível sobre o diagnóstico, prognóstico, objetivos e limitações do tratamento proposto. Fui esclarecido(a) de que intervenções odontológicas, mesmo sob rigorosa técnica e biossegurança, envolvem reações biológicas individuais, podendo ocorrer edema transitório, desconforto, sensibilidade térmica ou mastigatória, hematomas ou necessidade de reavaliações clínicas complementares.
      </p>

      <h3>3. Condições Sistêmicas e Anamnese Declarada</h3>
      <p>
        ${healthWarningText}
      </p>

      <h3>4. Compromissos e Cuidados Pós-Operatórios</h3>
      <p>
        Comprometo-me a seguir fielmente todas as instruções fornecidas, fazer uso correto dos medicamentos prescritos nos horários estipulados, repousar conforme orientação e comparecer pontualmente às consultas de retorno para avaliação da cicatrização e remoção de suturas, quando aplicável.
      </p>

      <h3>5. Consentimento e Proteção de Dados (LGPD)</h3>
      <p>
        Confirmo que tive a oportunidade de formular todas as perguntas que julguei necessárias, as quais foram satisfatoriamente respondidas. Autorizo o tratamento e armazenamento seguro dos meus dados de prontuário e radiografias estritamente para fins de assistência à saúde e cumprimento de obrigação legal e pericial, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
      </p>
    </div>

    <div class="tcle-signatures-row">
      <div>
        <div class="sig-box-line">
          <strong>${escapeHtml(p.name)}</strong><br>
          <span style="font-size:11px; color:#64748b;">Paciente ou Responsável Legal (CPF: ${escapeHtml(p.cpf)})</span>
        </div>
      </div>
      <div>
        <div class="sig-box-line">
          <strong>${escapeHtml(d.name)}</strong><br>
          <span style="font-size:11px; color:#64748b;">Cirurgião-Dentista (${escapeHtml(d.cro)})</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Módulo de Atestado Odontológico Expresso
// ==========================================================================
function initPostTcleModules() {
  // Preenche dados iniciais do atestado
  setAtestadoDays(expressState.certificate.days);
  selectRxPreset('cirurgico');
}

function setAtestadoDays(days) {
  expressState.certificate.days = days;
  document.querySelectorAll('.day-chip').forEach(chip => {
    const val = parseInt(chip.dataset ? chip.dataset.days : (chip.getAttribute?.('data-days') || 0), 10);
    chip.classList.toggle('active', val === days);
  });
  renderAtestadoPreview();
}

function toggleAtestadoCid(checkboxEl) {
  expressState.certificate.includeCid = checkboxEl.checked;
  renderAtestadoPreview();
}

function renderAtestadoPreview() {
  const container = document.getElementById('atestado-preview-render');
  if (!container) return;

  const d = expressState.dentist;
  const p = expressState.patient;
  const days = expressState.certificate.days;
  const daysText = days === 1 ? '1 (um) dia' : `${days} (${extensoDias(days)}) dias`;
  const cidText = expressState.certificate.includeCid ? ` — CID-10: <strong>${expressState.certificate.cidCode}</strong> (Autorizado expressamente pelo paciente nos termos da Resolução CFO 105/2010)` : '';
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px 28px; text-align:center; color:#1d1d1f; font-size:13.5px; line-height:1.7;">
      <h3 style="font-size:16px; font-weight:800; color:#0071e3; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:12px;">Atestado Odontológico</h3>
      <p style="text-align:justify; margin-bottom:18px;">
        Atesto para os devidos fins de comprovação e dispensa laboral que o(a) paciente <strong>${escapeHtml(p.name)}</strong>, inscrito(a) no CPF sob o nº <strong>${escapeHtml(p.cpf)}</strong>, foi submetido(a) a procedimento odontológico nesta data sob meus cuidados profissionais, necessitando de <strong>${daysText}</strong> de repouso e afastamento de suas atividades habituais a partir desta data para adequada convalescença.${cidText}
      </p>
      <div style="margin-top:20px; font-size:12.5px; color:#64748b;">${dateStr}</div>
      <div style="margin:30px auto 0; width:260px; border-top:1px solid #334155; padding-top:6px; font-weight:700; font-size:12px;">
        ${escapeHtml(d.name)}<br>
        <span style="font-weight:500; font-size:11px;">Cirurgião-Dentista — ${escapeHtml(d.cro)}</span>
      </div>
    </div>
  `;
}

function extensoDias(n) {
  const map = { 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis', 7: 'sete', 10: 'dez', 14: 'quatorze', 15: 'quinze' };
  return map[n] || String(n);
}

function printAtestado() {
  const atestadoContent = document.getElementById('atestado-preview-render')?.innerHTML;
  if (!atestadoContent) return;

  const printWindow = window.open('', '_blank', 'width=800,height=700');
  printWindow.document.write(`
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Atestado Odontológico — ${escapeHtml(expressState.patient.name)}</title>
      <style>
        body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; margin: 0; color: #000; }
        @media print { body { padding: 20mm; } }
      </style>
    </head>
    <body>
      ${atestadoContent}
      <script>window.onload = function() { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ==========================================================================
// Módulo de Receita Odontológica 1-Clique
// ==========================================================================
function selectRxPreset(presetId) {
  expressState.prescription.presetId = presetId;
  document.querySelectorAll('.rx-preset-chip').forEach(chip => {
    const rx = chip.dataset ? chip.dataset.rx : (chip.getAttribute?.('data-rx') || '');
    chip.classList.toggle('active', rx === presetId);
  });
  renderRxPreview();
}

function renderRxPreview() {
  const container = document.getElementById('rx-preview-render');
  if (!container) return;

  const preset = RX_PRESETS[expressState.prescription.presetId] || RX_PRESETS.cirurgico;
  const d = expressState.dentist;
  const p = expressState.patient;
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const itemsHtml = preset.items.map((it, idx) => `
    <div style="margin-bottom:14px;">
      <div style="font-weight:700; font-size:13.5px; color:#1e293b;">${idx + 1}. ${escapeHtml(it.name)}</div>
      <div style="font-size:12.5px; color:#475569; margin-left:14px;">Uso: ${escapeHtml(it.instructions)}</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px 28px; color:#1d1d1f; font-size:13.5px; line-height:1.6;">
      <div style="text-align:center; border-bottom:1.5px solid #0071e3; padding-bottom:10px; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:800; color:#0071e3; text-transform:uppercase; margin:0;">Receituário Odontológico</h3>
        <span style="font-size:11px; color:#64748b;">${escapeHtml(d.clinic || 'Clínica Odontológica')} — Telefone: ${escapeHtml(d.phone || '—')}</span>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px 12px; margin-bottom:16px; font-size:12px;">
        <strong>Paciente:</strong> ${escapeHtml(p.name)} | <strong>CPF:</strong> ${escapeHtml(p.cpf)} | <strong>Data:</strong> ${dateStr}
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:#0071e3; margin-bottom:10px; border-bottom:1px dashed #cbd5e1; padding-bottom:4px;">Uso Interno / Oral</h4>
        ${itemsHtml}
      </div>

      <div style="margin:30px auto 0; width:260px; border-top:1px solid #334155; padding-top:6px; font-weight:700; font-size:12px; text-align:center;">
        ${escapeHtml(d.name)}<br>
        <span style="font-weight:500; font-size:11px;">Cirurgião-Dentista — ${escapeHtml(d.cro)}</span>
      </div>
    </div>
  `;
}

function printRx() {
  const rxContent = document.getElementById('rx-preview-render')?.innerHTML;
  if (!rxContent) return;

  const printWindow = window.open('', '_blank', 'width=800,height=750');
  printWindow.document.write(`
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Receituário Odontológico — ${escapeHtml(expressState.patient.name)}</title>
      <style>
        body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; margin: 0; color: #000; }
        @media print { body { padding: 20mm; } }
      </style>
    </head>
    <body>
      ${rxContent}
      <script>window.onload = function() { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ==========================================================================
// Ações do TCLE: Imprimir, WhatsApp, Assinatura e Copiar
// ==========================================================================
function printTcle() {
  window.print();
}

function sendTcleWhatsApp() {
  const phone = expressState.patient.phone.replace(/\D/g, '');
  if (!phone) {
    alert('O telefone do paciente não foi informado no Passo 1.');
    return;
  }
  const procKey = expressState.procedure.id;
  const procTitle = procKey === 'outro' ? expressState.procedure.customTitle : (PROCEDURES_MAP[procKey]?.title || 'Procedimento');
  const text = encodeURIComponent(
    `Olá, ${expressState.patient.name}! Aqui é da equipe do(a) ${expressState.dentist.name}.\n\n` +
    `Seu Termo de Consentimento Livre e Esclarecido (TCLE) para o procedimento de *${procTitle}* foi formalizado com sucesso em nosso prontuário clínico digital.\n\n` +
    `Estamos à disposição para qualquer dúvida antes ou após o seu atendimento!`
  );
  window.open(`https://api.whatsapp.com/send?phone=55${phone}&text=${text}`, '_blank');
}

function copyTcleText() {
  const sheet = document.getElementById('tcle-document-render');
  if (!sheet) return;
  navigator.clipboard.writeText(sheet.innerText).then(() => {
    alert('Texto do TCLE copiado com sucesso para a área de transferência!');
  }).catch(() => {
    alert('Selecione e copie o texto manualmente.');
  });
}

// Canvas de Assinatura
let sigCanvas, sigCtx, isDrawing = false;

function setupSignaturePad() {
  sigCanvas = document.getElementById('sig-canvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');

  function resizeCanvas() {
    const rect = sigCanvas.getBoundingClientRect();
    sigCanvas.width = rect.width * window.devicePixelRatio || 400;
    sigCanvas.height = rect.height * window.devicePixelRatio || 140;
    sigCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    sigCtx.strokeStyle = '#0071e3';
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  sigCanvas.addEventListener('mousedown', e => {
    isDrawing = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
  });

  sigCanvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  });

  ['mouseup', 'mouseleave'].forEach(evt => {
    sigCanvas.addEventListener(evt, () => { isDrawing = false; });
  });

  sigCanvas.addEventListener('touchstart', e => {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
  }, { passive: false });

  sigCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  }, { passive: false });

  sigCanvas.addEventListener('touchend', () => { isDrawing = false; });
}

function clearSignature() {
  if (!sigCanvas || !sigCtx) return;
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

// ==========================================================================
// Persistência com LocalStorage (Sincronização com o Studio Pro)
// ==========================================================================
function loadSavedClinicSettings() {
  try {
    const raw = localStorage.getItem('dentalsafe_clinic_settings');
    if (raw) {
      const s = JSON.parse(raw);
      if (s.dentistName) document.getElementById('exp-dentist-name').value = s.dentistName;
      if (s.cro) document.getElementById('exp-dentist-cro').value = s.cro;
      if (s.clinicName) document.getElementById('exp-clinic-name').value = s.clinicName;
      if (s.phone) document.getElementById('exp-clinic-phone').value = s.phone;
    }
  } catch (e) {
    console.warn('Erro ao carregar dentalsafe_clinic_settings:', e);
  }
}

function saveClinicSettings() {
  try {
    const settings = {
      dentistName: expressState.dentist.name,
      cro: expressState.dentist.cro,
      clinicName: expressState.dentist.clinic,
      phone: expressState.dentist.phone
    };
    localStorage.setItem('dentalsafe_clinic_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Erro ao salvar dentalsafe_clinic_settings:', e);
  }
}

function syncPatientToStorage() {
  try {
    const p = expressState.patient;
    const raw = localStorage.getItem('dentalsafe_patients');
    const list = raw ? JSON.parse(raw) : [];
    
    // Procura se o paciente já existe por CPF
    const cleanCpf = p.cpf.replace(/\D/g, '');
    const idx = list.findIndex(item => (item.cpf || '').replace(/\D/g, '') === cleanCpf);
    
    const record = {
      id: idx >= 0 ? list[idx].id : 'pat_' + Date.now(),
      name: p.name,
      cpf: p.cpf,
      birthDate: p.birthDate,
      phone: p.phone,
      lastProcedure: expressState.procedure.id,
      lastDate: new Date().toISOString().split('T')[0]
    };

    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record };
    } else {
      list.unshift(record);
    }

    localStorage.setItem('dentalsafe_patients', JSON.stringify(list));
  } catch (e) {
    console.warn('Erro ao sincronizar paciente com dentalsafe_patients:', e);
  }
}

// ==========================================================================
// Máscaras de Entrada (CPF e Telefone)
// ==========================================================================
function setupInputMasks() {
  const cpfInput = document.getElementById('exp-patient-cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
      e.target.value = v;
    });
  }

  const phoneInput = document.getElementById('exp-patient-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      e.target.value = v;
    });
  }
}

// Tema Claro / Escuro
function initTheme() {
  const saved = localStorage.getItem('dentalsafe_theme') || 'light';
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dentalsafe_theme', isDark ? 'dark' : 'light');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resetExpressFlow() {
  if (confirm('Deseja iniciar um novo atendimento express? Os dados do paciente atual serão limpos.')) {
    document.getElementById('exp-patient-name').value = '';
    document.getElementById('exp-patient-cpf').value = '';
    document.getElementById('exp-patient-birth').value = '';
    document.getElementById('exp-patient-phone').value = '';
    expressState.procedure.selectedTeeth = ['11'];
    expressState.healthConditions.clear();
    goToStep(1);
  }
}
