import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const root=await realpath(resolve(project,'out'));
const index=await readFile(resolve(root,'index.html'),'utf8');
const prefix=index.includes('/desafio-portfolio/_next/')?'/desafio-portfolio':'';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.pdf':'application/pdf','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4173);
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(prefix&&url==='/'){res.writeHead(302,{Location:prefix+'/'}).end();return;}
  if(prefix&&url.startsWith(prefix+'/'))url=url.slice(prefix.length);
  let path=resolve(root,'.'+url);
  if((await stat(path)).isDirectory())path=resolve(path,'index.html');
  path=await realpath(path);
  if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});
  res.end(req.method==='HEAD'?undefined:await readFile(path));
 }catch{res.writeHead(404).end('Não encontrado');}
}).listen(port,'0.0.0.0',()=>console.log(`Prévia: http://localhost:${port}${prefix}/`));
