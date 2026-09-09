/**
 * Teste de integração do Repositório Institucional de TCLEs
 */
const fs = require('fs');
const path = require('path');

// 1. Verificar institutional_db.json
const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'institutional_db.json'), 'utf-8'));
console.log(`[TEST 1] Total de modelos no JSON: ${db.length}`);
if (db.length !== 16) throw new Error(`Esperado 16 modelos, obtido ${db.length}`);

// 2. Verificar distribuição por categorias
const counts = {};
db.forEach(m => {
  counts[m.category] = (counts[m.category] || 0) + 1;
  // Checar campos obrigatórios
  if (!m.id || !m.title || !m.institution_name || !m.full_tcle_text || !m.normative_grounding) {
    throw new Error(`Modelo incompleto: ${m.id}`);
  }
  if (!Array.isArray(m.essential_clauses) || m.essential_clauses.length === 0) {
    throw new Error(`Modelo sem cláusulas: ${m.id}`);
  }
  if (!Array.isArray(m.risks_and_statistics) || m.risks_and_statistics.length === 0) {
    throw new Error(`Modelo sem riscos e estatísticas: ${m.id}`);
  }
});
console.log('[TEST 2] Categorias validadas:', counts);

// 3. Verificar supabase/seed.sql
const seedSql = fs.readFileSync(path.join(__dirname, 'supabase', 'seed.sql'), 'utf-8');
console.log(`[TEST 3] Tamanho do seed.sql: ${(seedSql.length / 1024).toFixed(1)} KB`);
if (!seedSql.includes('public.tcle_institutional_repository')) {
  throw new Error('seed.sql não contém inserção em public.tcle_institutional_repository');
}
db.forEach(m => {
  if (!seedSql.includes(`'${m.id}'`)) {
    throw new Error(`seed.sql não contém o id: ${m.id}`);
  }
});
console.log('[TEST 4] Todos os 16 IDs presentes no seed.sql com sucesso!');

// 4. Verificar institutional-db.js
const jsDb = fs.readFileSync(path.join(__dirname, 'institutional-db.js'), 'utf-8');
if (!jsDb.includes('window.INSTITUTIONAL_TCLE_DB')) {
  throw new Error('institutional-db.js não declara window.INSTITUTIONAL_TCLE_DB');
}
console.log('[TEST 5] institutional-db.js verificado e pronto para o browser!');

console.log('\n✅ TODOS OS 5 TESTES DE INTEGRAÇÃO PASSARAM COM SUCESSO!');
