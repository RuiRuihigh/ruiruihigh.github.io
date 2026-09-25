// Run manually after deploying. Creates two clearly labeled test links.
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='https://mingrui-link-analytics.mingrui-link-analytics.workers.dev';
const secret=(await readFile(new URL('../secrets/admin-key.txt',import.meta.url),'utf8')).trim();
let cookie='';
async function call(path,method='GET',data,site=false){const res=await fetch(base+path,{method,headers:{Origin:site?'https://ruiruihigh.github.io':base,...(cookie&&!site?{Cookie:cookie}:{}),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});return res;}
assert.equal((await call('/api/links')).status,401);
const login=await call('/api/login','POST',{password:secret});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];
const links=[];
for(const label of ['功能测试 A','功能测试 B']){const res=await call('/api/links','POST',{label,path:'/'});assert.equal(res.status,201);links.push(await res.json());}
const event={code:links[0].code,path:'/',session:crypto.randomUUID()};
for(let i=0;i<2;i++)assert.equal((await call('/collect','POST',event,true)).status,204);
assert.equal((await call('/collect','POST',{...event,code:links[1].code},true)).status,204);
let data=await (await call('/api/links')).json();for(const l of links)assert.equal(data.links.find(x=>x.code===l.code).visits,1);
assert.equal((await call('/api/links/'+links[1].code,'PATCH',{active:false})).status,200);
await call('/collect','POST',{...event,code:links[1].code,session:crypto.randomUUID()},true);
data=await (await call('/api/links')).json();assert.equal(data.links.find(x=>x.code===links[1].code).visits,1);
await writeFile(new URL('../secrets/test-links.json',import.meta.url),JSON.stringify(links,null,2),{mode:0o600});
console.log('Live checks passed: auth, A/B attribution, deduplication and disabled links. Test A remains enabled for browser verification.');
console.log('Browser test link: '+links[0].url);
