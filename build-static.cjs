'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'dist') throw new Error('Saída fora do projeto.');
// Mirror the local server's explicit public allowlist; never publish the source directory.
const publicFiles = ['index.html','style.css','app.js','safety.js','procedure-db.js','clinical-ai-engine.js','prescriptions-db.js','postop-guidelines-db.js','institutional-db.js','institutional_db.json','intercurrences-db.js','hof-db.js','supabase.js','assets/apple_dentalsafe_logo.jpg','assets/apple_certified_seal.jpg'];
for (const file of publicFiles) {
  const input = fs.readFileSync(path.join(root, file));
  if (file.endsWith('.js')) new vm.Script(input.toString('utf8'), {filename:file});
  if (file.endsWith('.json')) JSON.parse(input.toString('utf8'));
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  const url=match[1];
  if (/^(https?:|data:|#|mailto:|tel:)/.test(url)) continue;
  const file=url.replace(/^\.\//,'').split(/[?#]/)[0];
  if (!publicFiles.includes(file)) throw new Error('Recurso local não incluído: '+file);
}
fs.rmSync(output, {recursive:true,force:true});
fs.mkdirSync(output, {recursive:true});
for (const file of publicFiles) {
  const dest=path.join(output,file);
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  fs.copyFileSync(path.join(root,file),dest);
}
fs.copyFileSync(path.join(root,'hosting-headers.txt'),path.join(output,'_headers'));
fs.writeFileSync(path.join(output,'404.html'),'<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Página não encontrada</title><h1>Página não encontrada</h1><p><a href="/">Abrir DentalSafe</a></p></html>');
console.log('Publicação estática validada: '+publicFiles.length+' recursos públicos. Backups, SQL e arquivos internos excluídos.');
