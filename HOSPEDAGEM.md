# Hospedagem do DentalSafe

O site hospedado usa um endereço estável do Sites e funciona sem o computador local ligado. O projeto e o público solicitado são DentalSafe AI e acesso público, respectivamente.

O identificador da publicação fica em `.openai/hosting.json`. Reutilize esse projeto para todas as atualizações; não crie outro site.

## Atualizações

1. Editar os arquivos deste projeto, preservando Vanilla JS.
2. Executar `npm test` e `npm run build`.
3. Usar a habilidade `sites-hosting`: enviar o código validado ao repositório associado, empacotar a pasta pública e publicar uma versão no mesmo site. Obter credencial temporária pelo conector, nunca salvar tokens no projeto.
4. Confirmar a publicação concluída e o endereço de produção.

Salvar arquivos no disco continua atualizando o servidor local. O endereço hospedado recebe as mudanças somente após a publicação de uma nova versão. Não há sincronização automática de edições locais configurada.

## Recursos publicados e dados

`build-static.cjs` copia para `dist/` apenas os recursos explicitamente públicos, equivalentes aos de `server.js`. Backups, SQL, relatórios, arquivos de ambiente e scripts internos não fazem parte da publicação. Não usar a raiz do projeto como pasta pública.

O Supabase permanece sem credenciais configuradas. Prontuários e preferências continuam no armazenamento de cada navegador; hospedar a interface não cria backup ou sincronização de pacientes. A mudança de endereço não transfere dados de origens anteriores. Para recuperar registros, usar as funções de exportação/importação da aplicação no navegador onde foram salvos.

A IA externa permanece opcional e depende de configuração explícita pelo usuário. O webhook de pagamentos não está implementado na publicação estática, assim como não estava ativo no servidor local.
