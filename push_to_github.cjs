#!/usr/bin/env node
'use strict';

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

async function pushToGithub() {
  const repoArg = process.argv[2];
  const tokenArg = process.argv[3];

  if (!repoArg) {
    console.log(`
==============================================================
🚀 DentalSafe TCLE AI — Assistente de Publicação para GitHub
==============================================================

Uso:
  node push_to_github.cjs <URL_DO_REPOSITORIO> [TOKEN_GITHUB]

Exemplo 1 (com Token de Acesso Pessoal - PAT):
  node push_to_github.cjs https://github.com/seu-usuario/dentalsafe-tcle-ai.git ghp_xxxxxx

Exemplo 2 (simplificado se a URL já tiver o token):
  node push_to_github.cjs https://ghp_xxxxxx@github.com/seu-usuario/dentalsafe-tcle-ai.git
==============================================================
`);
    return;
  }

  let remoteUrl = repoArg.trim();
  if (!remoteUrl.startsWith('http://') && !remoteUrl.startsWith('https://')) {
    remoteUrl = `https://github.com/${remoteUrl.replace(/^\//, '')}.git`;
  }
  if (!remoteUrl.endsWith('.git')) {
    remoteUrl += '.git';
  }

  const dir = __dirname;
  console.log(`\n📦 Repositório local: ${dir}`);
  console.log(`🌐 Repositório remoto: ${remoteUrl}`);

  // Configurar remote origin
  try {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  } catch (e) {}

  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: remoteUrl
  });

  console.log('🔄 Sincronizando e enviando commits para a branch main...');

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    force: true,
    onAuth: () => {
      if (tokenArg) {
        return { username: tokenArg };
      }
      return { username: '' };
    }
  });

  console.log('✅ Sucesso! O código foi publicado no GitHub!');
  console.log('\n👉 Agora no Lovable (https://lovable.dev):');
  console.log('   1. Clique em "Import from GitHub"');
  console.log('   2. Selecione o repositório sincronizado');
  console.log('   3. O Lovable carregará o DentalSafe completo sem gastar créditos!\n');
}

pushToGithub().catch(err => {
  console.error('\n❌ Erro ao enviar para o GitHub:', err.message);
  if (err.message.includes('401') || err.message.includes('Authentication') || err.message.includes('credentials')) {
    console.error('💡 Dica de Autenticação: O GitHub exige um Personal Access Token (PAT) com escopo "repo".');
    console.error('   Crie um token em: https://github.com/settings/tokens?type=beta (ou classic)');
  }
});
