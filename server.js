'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
// Apenas recursos públicos: backups, SQL, servidor e prontuários ficam inacessíveis.
const publicFiles = new Set(['index.html','style.css','app.js','safety.js','procedure-db.js','clinical-ai-engine.js','prescriptions-db.js','postop-guidelines-db.js','institutional-db.js','institutional_db.json','intercurrences-db.js','hof-db.js','supabase.js','assets/apple_dentalsafe_logo.jpg','assets/apple_certified_seal.jpg','express.html','express.css','express.js','express/index.html','express/style.css','express/app.js','express/procedure-db.js']);
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg'};
function createServer() {
  return http.createServer((req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy',"default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; img-src 'self' data: https: blob:; font-src 'self' https: data:; frame-ancestors 'none';");
    const reply = (status,text) => { res.writeHead(status,{'Content-Type':'text/plain; charset=utf-8'}); res.end(text); };
    if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(req.headers.host || '')) return reply(403,'Host não autorizado.');
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
    catch { return reply(400,'URL inválida.'); }
    if (pathname === '/api/webhooks/kiwify') return reply(501,'Webhook de pagamentos não configurado neste servidor local.');
    if (!['GET','HEAD'].includes(req.method)) { res.setHeader('Allow','GET, HEAD'); return reply(405,'Método não permitido.'); }
    if (pathname === '/health') { res.writeHead(200,{'Content-Type':'application/json'}); return res.end(req.method === 'HEAD' ? undefined : JSON.stringify({app:'dentalsafe-tcle-ai',status:'ok'})); }
    const name = pathname === '/' ? 'index.html' : (pathname === '/express' || pathname === '/express/' ? 'express/index.html' : pathname.slice(1));
    if (!publicFiles.has(name)) return reply(404,'Recurso não encontrado.');
    fs.readFile(path.join(__dirname,name),(err,data) => {
      if (err) return reply(err.code === 'ENOENT' ? 404 : 500,'Não foi possível carregar o recurso.');
      res.writeHead(200,{'Content-Type':mime[path.extname(name)] + '; charset=utf-8','Content-Length':data.length});
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
}
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  const server = createServer();
  server.on('error',err => { console.error(err.code === 'EADDRINUSE' ? `A porta ${port} já está em uso. Verifique o servidor aberto.` : err.message); process.exitCode=1; });
  server.listen(port,'127.0.0.1',() => {
    console.log('DentalSafe AI: http://127.0.0.1:'+port+'\nCtrl+C para encerrar.');
    if(process.argv.includes('--open') && process.platform === 'win32') {
      require('node:child_process').execFile('powershell.exe',['-NoProfile','-WindowStyle','Hidden','-Command',"Start-Process 'http://127.0.0.1:"+port+"'"],{windowsHide:true},err => { if(err) console.error('Abra o endereço acima no navegador.'); });
    }
  });
}
module.exports = {createServer};
