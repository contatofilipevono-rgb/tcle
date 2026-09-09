/* ==========================================================================
   DentalSafe AI — Camada de Integração Supabase v1.0
   Multi-Clínica · Row Level Security · Auth Email/Senha

   CONFIGURAÇÃO:
   1. Acesse seu projeto em supabase.com
   2. Vá em Settings → API
   3. Copie a "Project URL" e a "anon public" key
   4. Cole nos campos abaixo (substitua os valores placeholder)
   ========================================================================== */

const SUPABASE_URL  = 'https://SEU-PROJETO.supabase.co';   // ← substitua
const SUPABASE_ANON = 'SUA_CHAVE_ANON_PUBLICA_AQUI';       // ← substitua

/* ──────────────────────────────────────────────────────────────────────────
   DETECTA MODO DE OPERAÇÃO
   - DEMO  → credenciais não configuradas → localStorage (dados no browser)
   - CLOUD → credenciais OK → Supabase (persistência real, multi-dispositivo)
   ────────────────────────────────────────────────────────────────────────── */
const _SB_CONFIGURED = (
  !SUPABASE_URL.includes('SEU-PROJETO') &&
  !SUPABASE_ANON.includes('SUA_CHAVE')
);

/* Estado global Supabase */
let _sb         = null;   // client
let _sbUser     = null;   // usuário logado
let _sbClinicId = null;   // UUID da clínica
let _sbClinic   = null;   // dados da clínica

/* ──────────────────────────────────────────────────────────────────────────
   NAMESPACE PÚBLICO DS (DentalSafe)
   ────────────────────────────────────────────────────────────────────────── */
const DS = {

  /* =========================================================================
     INICIALIZAÇÃO — chamada pelo DOMContentLoaded do app.js
     ========================================================================= */
  init: async function () {
    if (!_SB_CONFIGURED) {
      DS._enterDemoMode();
      return;
    }

    try {
      _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    } catch (e) {
      console.warn('DentalSafe: Supabase CDN não carregado — modo Demo.', e);
      DS._enterDemoMode();
      return;
    }

    /* Mostrar tela de login enquanto verifica sessão */
    DS._showLogin();

    /* Verificar sessão existente */
    const { data: { session } } = await _sb.auth.getSession();
    if (session) {
      _sbUser = session.user;
      await DS._afterLogin();
    }

    /* Listener de mudança de auth */
    _sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        _sbUser = session.user;
        await DS._afterLogin();
      } else if (event === 'SIGNED_OUT') {
        _sbUser = null; _sbClinicId = null; _sbClinic = null;
        DS._showLogin();
        DS._setUserBar(false);
      }
    });
  },

  /* =========================================================================
     LOGIN
     ========================================================================= */
  signIn: async function () {
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    const btn   = document.getElementById('login-btn');

    if (!email || !pass) {
      DS._loginError('Preencha e-mail e senha.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="login-spinner"></span> Autenticando…';

    const { error } = await _sb.auth.signInWithPassword({ email, password: pass });

    if (error) {
      DS._loginError(error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : error.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-login-box-line"></i> Entrar';
    }
    /* sucesso → onAuthStateChange dispara _afterLogin automaticamente */
  },

  /* =========================================================================
     LOGOUT
     ========================================================================= */
  signOut: async function () {
    if (_sb) await _sb.auth.signOut();
  },

  /* =========================================================================
     SALVAR TCLE (chamado por saveToHistory)
     ========================================================================= */
  saveTCLE: async function (doc) {
    if (!doc) return;
    if (!_SB_CONFIGURED || !_sb || !_sbClinicId) {
      DS._localSaveTCLE(doc);
      return;
    }
    const payload = {
      clinic_id:      _sbClinicId,
      doc_id:         doc.id,
      patient_name:   doc.patientName,
      patient_cpf:    doc.patientCpf,
      procedure_name: doc.procedure,
      procedure_key:  doc.procedureKey || null,
      region:         doc.region       || null,
      diagnosis:      doc.diagnosis    || null,
      risk_tags:      doc.riskTags     || [],
      legal_html:     doc.legalHTML    || '',
      summary_html:   doc.summaryHTML  || '',
      annex_a_html:   doc.annexAHTML   || '',
      generated_at:   new Date().toISOString().split('T')[0]
    };
    const { error } = await _sb.from('tcles').upsert(payload, { onConflict: 'doc_id' });
    if (error) {console.error('DentalSafe: erro ao salvar TCLE', error);DS._showToast('Cópia local salva; falha na sincronização com Supabase.','error');}
    else DS._showToast('Prontuário salvo no Supabase ✓', 'success');
  },

  /* =========================================================================
     CARREGAR LISTA DE TCLEs (usado por renderHistoryList)
     ========================================================================= */
  loadTCLEs: async function (filter = '') {
    if (!_sb || !_sbClinicId) return null;
    let query = _sb
      .from('tcles')
      .select('doc_id, patient_name, patient_cpf, procedure_name, generated_at, risk_tags, legal_html, summary_html, annex_a_html')
      .order('created_at', { ascending: false })
      .limit(200);

    if (filter) {
      query = query.or(
        `patient_name.ilike.%${filter}%,patient_cpf.ilike.%${filter}%,procedure_name.ilike.%${filter}%`
      );
    }
    const { data, error } = await query;
    if (error) { console.error('DentalSafe: erro ao carregar TCLEs', error); return null; }
    return data;
  },

  /* =========================================================================
     SALVAR / ATUALIZAR CLÍNICA
     ========================================================================= */
  saveClinic: async function () {
    const data = DS._getClinicFormData();
    if (!_sb || !_sbClinicId) { DS._localSaveClinic(data); return; }
    const { error } = await _sb
      .from('clinics')
      .update({ name: data.name, dentist_name: data.dentist, cro: data.cro, phone: data.phone, email: data.email, address: data.address })
      .eq('id', _sbClinicId);
    if (error) console.error('DentalSafe: erro ao salvar clínica', error);
    else DS._showToast('Configurações salvas no Supabase ✓', 'success');
  },

  /* =========================================================================
     CRIAR CLÍNICA (setup do 1º login sem clínica vinculada)
     ========================================================================= */
  createClinic: async function () {
    const data = DS._getClinicFormData();
    if (!data.name) { alert('Preencha o nome da clínica para criar o cadastro.'); return; }
    const { data: result, error } = await _sb.rpc('create_clinic_and_link_user', {
      p_name:         data.name,
      p_dentist_name: data.dentist,
      p_cro:          data.cro,
      p_phone:        data.phone,
      p_email:        data.email,
      p_address:      data.address
    });
    if (error) { alert('Erro ao criar clínica: ' + error.message); return; }
    _sbClinicId = result;
    DS._showToast('Clínica criada com sucesso! ✓', 'success');
    /* Atualizar exibição */
    document.getElementById('user-clinic-name').textContent = data.name;
    document.getElementById('setup-clinic-banner').style.display = 'none';
  },

  /* =========================================================================
     SALVAR PACIENTE
     ========================================================================= */
  savePatient: async function (p) {
    if (!_sb || !_sbClinicId) return null;
    const { data, error } = await _sb.from('patients').upsert({
      clinic_id: _sbClinicId,
      name: p.name, cpf: p.cpf, rg: p.rg, dob: p.dob, phone: p.phone, address: p.address
    }, { onConflict: 'clinic_id,cpf' }).select().single();
    if (error) console.error('DentalSafe: erro ao salvar paciente', error);
    return data;
  },

  /* =========================================================================
     BUSCAR PACIENTES (autocomplete)
     ========================================================================= */
  searchPatients: async function (query) {
    if (!_sb || !_sbClinicId || !query || query.length < 2) return [];
    const { data } = await _sb
      .from('patients')
      .select('id, name, cpf, rg, dob, phone, address')
      .or(`name.ilike.%${query}%,cpf.ilike.%${query}%`)
      .limit(8);
    return data || [];
  },

  /* =========================================================================
     PREENCHIMENTO AUTOMÁTICO DE PACIENTE
     ========================================================================= */
  fillPatientForm: function (p) {
    resetForm();
    document.getElementById('patient-name').value    = p.name    || '';
    document.getElementById('patient-cpf').value     = p.cpf     || '';
    document.getElementById('patient-rg').value      = p.rg      || '';
    document.getElementById('patient-phone').value   = p.phone   || '';
    document.getElementById('patient-address').value = p.address || '';
    if (p.dob) {
      /* Converte date do banco (YYYY-MM-DD) para o input date */
      document.getElementById('patient-dob').value = p.dob.substring(0, 10);
    }
    DS._closePatientSearch();
    DS._showToast(`Paciente "${DentalSafeSafety.escapeHTML(p.name)}" carregado ✓`, 'success');
  },

  /* ──────────────────────────────────────────────────────────────────────────
     INTERNOS
     ────────────────────────────────────────────────────────────────────────── */

  _afterLogin: async function () {
    /* Buscar clínica do usuário */
    const { data: cu, error } = await _sb
      .from('clinic_users')
      .select('clinic_id, clinics(*)')
      .eq('user_id', _sbUser.id)
      .single();

    if (!error && cu) {
      _sbClinicId = cu.clinic_id;
      _sbClinic   = cu.clinics;
      DS._applyClinicToForm(_sbClinic);
      document.getElementById('user-clinic-name').textContent = _sbClinic.name || 'Clínica';
      document.getElementById('setup-clinic-banner').style.display = 'none';
    } else {
      /* Usuário sem clínica → mostrar banner de setup */
      document.getElementById('setup-clinic-banner').style.display = 'flex';
    }

    document.getElementById('user-email-display').textContent = _sbUser.email;
    DS._setUserBar(true);
    DS._hideLogin();

    /* Carregar histórico inicial */
    await DS._refreshHistory('');

    /* Sobrescrever funções do app.js para usar Supabase */
    DS._patchAppFunctions(true);
  },

  _enterDemoMode: function () {
    /* Carregar do localStorage */
    try {
      const h = localStorage.getItem('dentalsafe_history') || localStorage.getItem('ds_history');
      if (h) { const parsed = JSON.parse(h); if (Array.isArray(parsed)) tcleHistory = parsed; }
    } catch (e) {}
    try {
      const c = localStorage.getItem('ds_clinic');
      if (c) DS._applyClinicToForm(JSON.parse(c));
    } catch (e) {}

    DS._setConnBadge('demo');
    DS._patchAppFunctions(false);
    renderHistoryList();
  },

  _patchAppFunctions: function (useSupabase) {
    /* ---- saveToHistory ---- */
    DS._useSupabase=useSupabase;
    if(!DS._originalSave) {
      DS._originalSave=window.saveToHistory;
      window.saveToHistory=function(){
        const saved=DS._originalSave();
        if(saved && DS._useSupabase && currentDocData){DS.saveTCLE(JSON.parse(JSON.stringify(currentDocData)));DS._savePacienteFromForm();}
        return saved;
      };
    }

    /* ---- saveClinicSettings ---- */
    const _origClinic = window.saveClinicSettings;
    window.saveClinicSettings = function () {
      _origClinic();
      useSupabase ? DS.saveClinic() : DS._localSaveClinic(DS._getClinicFormData());
    };

    /* ---- renderHistoryList ---- */
    if (useSupabase) {
      window.renderHistoryList = async function (filter = '') {
        await DS._refreshHistory(filter);
      };
      window.filterHistory = function () {
        renderHistoryList(document.getElementById('history-search').value);
      };
    } else {
      /* Demo: usar in-memory + localStorage */
      const _origRender = window.renderHistoryList;
      window.renderHistoryList = function (filter = '') {
        _origRender(filter);
      };
    }
  },

  _refreshHistory: async function (filter = '') {
    const container = document.getElementById('history-list-container');
    const badge     = document.getElementById('history-count');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div class="loading-spinner" style="margin:0 auto 12px;"></div>
        <p>Carregando prontuários…</p>
      </div>`;

    const rows = await DS.loadTCLEs(filter);
    if (!rows) { container.innerHTML = '<p style="color:var(--text-muted);padding:20px;">Erro ao carregar. Verifique a conexão.</p>'; return; }

    /* Mesclar com tcleHistory em memória para incluir itens desta sessão */
    const inMem = (window.tcleHistory || []).filter(i =>
      !rows.some(r => r.doc_id === i.id)
    );
    const all = [
      ...inMem.map(i => ({
        doc_id:         i.id,
        patient_name:   i.patientName,
        patient_cpf:    i.patientCpf,
        procedure_name: i.procedure,
        generated_at:   i.date,
        risk_tags:      i.riskTags || [],
        legal_html:     i.legalHTML   || '',
        summary_html:   i.summaryHTML || '',
        annex_a_html:   i.annexAHTML  || ''
      })),
      ...rows
    ];

    badge.textContent = all.length;

    if (!all.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:50px;color:var(--text-muted);">
          <i class="ri-folder-open-line" style="font-size:40px;display:block;margin-bottom:10px;opacity:.4;"></i>
          Nenhum prontuário encontrado.
        </div>`;
      return;
    }

    const ft = filter.toLowerCase();
    const filtered = ft ? all.filter(i =>
      (i.patient_name || '').toLowerCase().includes(ft) ||
      (i.patient_cpf  || '').includes(ft) ||
      (i.procedure_name || '').toLowerCase().includes(ft)
    ) : all;

    container.innerHTML = filtered.map((i,index) => `
      <div class="history-card">
        <div class="history-info">
          <i class="ri-shield-check-fill" style="color:var(--success);font-size:26px;flex-shrink:0;"></i>
          <div class="history-details">
            <h4>${DentalSafeSafety.escapeHTML(i.patient_name || '—')} <small style="color:var(--text-muted);font-size:10px;">CPF: ${DentalSafeSafety.escapeHTML(i.patient_cpf || '—')}</small></h4>
            <p><strong>${DentalSafeSafety.escapeHTML(i.procedure_name || '—')}</strong> · ${DentalSafeSafety.escapeHTML(i.generated_at || '—')} · ${DentalSafeSafety.escapeHTML(i.doc_id || '')}</p>
            <div class="risk-tags">${(i.risk_tags || []).map(t => `<span class="risk-tag">${DentalSafeSafety.escapeHTML(t)}</span>`).join('')}</div>
          </div>
        </div>
        <button class="btn btn-outline" data-cloud-index="${index}">
          <i class="ri-printer-line"></i> Reabrir PDF
        </button>
      </div>`).join('');
    container.querySelectorAll('[data-cloud-index]').forEach(button => button.addEventListener('click', () => { const item=filtered[Number(button.dataset.cloudIndex)]; DS._reopenCloud(item.doc_id,item); }));
  },

  _reopenCloud: function (docId,item) {
    const local=tcleHistory.find(r=>r.id===docId) || {};
    const record={...local,id:docId,patientName:item.patient_name || '',patientCpf:item.patient_cpf || '',procedure:item.procedure_name || '',date:item.generated_at || '',legalHTML:item.legal_html || '',summaryHTML:item.summary_html || '',annexAHTML:item.annex_a_html || local.annexAHTML || '',clinicalContext:local.clinicalContext || {},riskTags:item.risk_tags || []};
    tcleHistory=[record,...tcleHistory.filter(r => r.id !== docId)];
    reopenHistoryItem(docId);
  },

  _savePacienteFromForm: async function () {
    const p = {
      name:    document.getElementById('patient-name').value.trim(),
      cpf:     document.getElementById('patient-cpf').value.trim(),
      rg:      document.getElementById('patient-rg').value.trim(),
      dob:     document.getElementById('patient-dob').value || null,
      phone:   document.getElementById('patient-phone').value.trim(),
      address: document.getElementById('patient-address').value.trim()
    };
    if (p.name && p.cpf) await DS.savePatient(p);
  },

  /* ---- UI Helpers ---- */

  _showLogin: function () {
    const el = document.getElementById('login-overlay');
    if (el) el.style.display = 'flex';
  },

  _hideLogin: function () {
    const el = document.getElementById('login-overlay');
    if (el) el.style.display = 'none';
  },

  _loginError: function (msg) {
    const el = document.getElementById('login-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    const btn = document.getElementById('login-btn');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ri-login-box-line"></i> Entrar'; }
  },

  _setUserBar: function (visible) {
    const bar = document.getElementById('user-bar');
    if (bar) bar.style.display = visible ? 'flex' : 'none';
    DS._setConnBadge(visible ? 'cloud' : 'offline');
  },

  _setConnBadge: function (mode) {
    const b = document.getElementById('conn-badge');
    if (!b) return;
    b.style.display = 'flex';
    b.className = 'conn-badge ' + mode;
    if (mode === 'cloud') b.innerHTML = '<i class="ri-cloud-line"></i> Supabase';
    else if (mode === 'demo') b.innerHTML = '<i class="ri-database-2-line"></i> Demo (local)';
    else b.innerHTML = '<i class="ri-wifi-off-line"></i> Offline';
  },

  _applyClinicToForm: function (c) {
    if (!c) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('cfg-clinic-name',   c.name          || c.name);
    set('cfg-dentist-name',  c.dentist_name  || '');
    set('cfg-cro',           c.cro           || '');
    set('cfg-phone',         c.phone         || '');
    set('cfg-email',         c.email         || '');
    set('cfg-address',       c.address       || '');
    /* Dispara a função original para atualizar o timbrado */
    if (typeof saveClinicSettings === 'function') {
      /* Chamamos somente a versão original (antes do patch) para não criar loop */
      const _orig = window._origSaveClinic || null;
      if (_orig) _orig(); /* se já patchado */
    }
  },

  _getClinicFormData: function () {
    const g = id => (document.getElementById(id) || {}).value || '';
    return {
      name:    g('cfg-clinic-name'),
      dentist: g('cfg-dentist-name'),
      cro:     g('cfg-cro'),
      phone:   g('cfg-phone'),
      email:   g('cfg-email'),
      address: g('cfg-address')
    };
  },

  /* ---- localStorage fallback ---- */

  _localSaveTCLE: function (doc) {
    if (!doc) return;
    try { localStorage.setItem('dentalsafe_history', JSON.stringify(tcleHistory)); } catch (e) { DS._showToast('Falha ao salvar histórico local.','error'); }
  },

  _localSaveClinic: function (data) {
    try { localStorage.setItem('ds_clinic', JSON.stringify(data)); } catch (e) {}
  },

  /* ---- Toast ---- */
  _showToast: function (msg, type = 'info') {
    const t = document.getElementById('ds-toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'ds-toast visible ' + type;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('visible'), 3000);
  },

  /* ---- Patient autocomplete ---- */
  _patientSearchTimer: null,

  onPatientSearchInput: async function (val) {
    clearTimeout(DS._patientSearchTimer);
    const dropdown = document.getElementById('patient-search-dropdown');
    if (!val || val.length < 2) { dropdown.style.display = 'none'; return; }

    DS._patientSearchTimer = setTimeout(async () => {
      const results = await DS.searchPatients(val);
      if (!results.length) { dropdown.style.display = 'none'; return; }
      dropdown.innerHTML = results.map((p,index) => `
        <div class="patient-option" data-patient-index="${index}">
          <span class="opt-name">${DentalSafeSafety.escapeHTML(p.name)}</span>
          <span class="opt-cpf">CPF: ${DentalSafeSafety.escapeHTML(p.cpf || '—')}</span>
        </div>`).join('');
      dropdown.querySelectorAll('[data-patient-index]').forEach(el => el.addEventListener('click', () => DS.fillPatientForm(results[Number(el.dataset.patientIndex)])));
      dropdown.style.display = 'block';
    }, 350);
  },

  _closePatientSearch: function () {
    const d = document.getElementById('patient-search-dropdown');
    if (d) d.style.display = 'none';
    const inp = document.getElementById('patient-search-input');
    if (inp) inp.value = '';
  },

  /* =========================================================================
     REPOSITÓRIO INSTITUCIONAL (UNIVERSIDADES, CFO, CROS, ABOL, SCIELO)
     ========================================================================= */
  getInstitutionalTCLEs: async function (category = null) {
    if (_SB_CONFIGURED && _sb) {
      try {
        let query = _sb
          .from('tcle_institutional_repository')
          .select('*')
          .eq('is_public', true)
          .order('category', { ascending: true });

        if (category && category !== 'Todos') {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('DentalSafe: Falha ao buscar do Supabase, usando repositório local:', err);
      }
    }
    // Fallback garantido para repositório institucional embutido/local
    if (window.INSTITUTIONAL_TCLE_DB) {
      if (!category || category === 'Todos') return window.INSTITUTIONAL_TCLE_DB;
      return window.INSTITUTIONAL_TCLE_DB.filter(m => m.category === category);
    }
    return [];
  }

};
window.DS = DS;

/* ==========================================================================
   BOOTSTRAP — chamado pelo DOMContentLoaded DEPOIS que app.js inicializa
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  /* Pequeno delay garante que o app.js DOMContentLoaded já rodou */
  setTimeout(() => DS.init(), 50);

  /* Fechar dropdown de paciente ao clicar fora */
  document.addEventListener('click', e => {
    if (!e.target.closest('.patient-search-wrap')) {
      DS._closePatientSearch();
    }
  });

  /* Login com Enter */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('login-overlay')?.style.display === 'flex') {
      DS.signIn();
    }
  });
});
