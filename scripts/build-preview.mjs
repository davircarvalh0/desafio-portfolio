import { build } from 'esbuild';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const argument=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const output=resolve(root,argument('--output','preview/index.html'));
const assetPrefix=argument('--asset-prefix','../public');
async function findCss(folder){const files=[];for(const entry of await readdir(folder,{withFileTypes:true})){const path=join(folder,entry.name);if(entry.isDirectory())files.push(...await findCss(path));else if(path.endsWith('.css'))files.push(path);}return files;}
const cssPaths=await findCss(resolve(root,'.next/static'));
if(!cssPaths.length)throw new Error('Execute npm run build antes de gerar a prévia.');
const css=(await Promise.all(cssPaths.map(path=>readFile(path,'utf8')))).join('\n');
const result=await build({entryPoints:[resolve(root,'scripts/preview-entry.tsx')],bundle:true,write:false,minify:true,format:'iife',platform:'browser',jsx:'automatic',tsconfig:resolve(root,'tsconfig.json'),define:{'process.env.NODE_ENV':'"production"','process.env.NEXT_PUBLIC_BASE_PATH':JSON.stringify(assetPrefix)},alias:{'next/link':resolve(root,'scripts/preview-link.tsx')},plugins:[{name:'inline-preview-covers',setup(builder){builder.onLoad({filter:/lib[\\/]projects\.ts$/},async({path})=>{let contents=await readFile(path,'utf8');for(const name of ['dados','marketing','desenvolvimento','gente-e-gestao','produto','comercial']){const bytes=await readFile(resolve(root,`public/images/${name}.jpg`));contents=contents.replace(`"images/${name}.jpg"`,JSON.stringify('data:image/jpeg;base64,'+bytes.toString('base64')));}return{contents,loader:'ts'};});}}]});
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Davi Rosendo · Desafios CITi</title><style>${css.replaceAll('</style','<\\/style')}</style></head><body><div id="root"></div><script>${result.outputFiles[0].text.replaceAll('</script','<\\/script')}</script></body></html>`;
await mkdir(dirname(output),{recursive:true});await writeFile(output,html,'utf8');console.log(`Prévia independente: ${output}`);
