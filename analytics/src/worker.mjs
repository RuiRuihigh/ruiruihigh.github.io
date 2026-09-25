import { adminHTML } from './admin.mjs';
const enc = new TextEncoder();
export const PATHS = ['/', '/cv/', '/publications/', '/demos/singing-voice-conversion/'];
const cookieName = '__Host-mladmin';
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
export async function digest(text) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(text))); }
export async function sign(text, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(text)));
}
export function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let mismatch = 0; for (let i=0; i<a.length; i++) mismatch |= a.charCodeAt(i)^b.charCodeAt(i); return mismatch === 0;
}
export async function authenticated(request, env, now=Date.now()) {
  if (!env.ADMIN_SECRET) return false;
  const token = request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName+'='))?.slice(cookieName.length+1);
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!/^\d{13}$/.test(expires) || Number(expires)<now || Number(expires)>now+86400000) return false;
  return equal(signature, await sign('admin:'+expires, env.ADMIN_SECRET));
}
const json = (data, status=200, extra={}) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store',...extra}});
const fail = (message, status) => json({error:message},status);
async function body(request) {
  const text = await request.text(); if (text.length>2048) throw new Error('body'); return JSON.parse(text);
}
export function validEvent(data) { return data && /^[a-f0-9]{32}$/.test(data.code) && PATHS.includes(data.path) && /^[a-f0-9-]{32,36}$/.test(data.session); }
const randomCode = () => hex(crypto.getRandomValues(new Uint8Array(16)));
async function collect(request, env) {
  const origin = request.headers.get('Origin');
  if (origin !== env.SITE_ORIGIN) return fail('Origin not allowed',403);
  const cors = {'Access-Control-Allow-Origin':env.SITE_ORIGIN,'Vary':'Origin'};
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{...cors,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type'}});
  if (request.method !== 'POST') return fail('Method not allowed',405);
  if (/bot|crawler|spider|preview|facebookexternalhit|slackbot|headless/i.test(request.headers.get('User-Agent')||'')) return new Response(null,{status:204,headers:cors});
  const data = await body(request);
  if (!validEvent(data)) return json({error:'Invalid visit'},400,cors);
  const link = await env.DB.prepare('SELECT code FROM links WHERE code = ? AND active = 1').bind(data.code).first();
  if (!link) return new Response(null,{status:204,headers:cors});
  const now=Date.now(), bucket=Math.floor(now/1800000);
  const sessionHash=await sign(data.code+':'+data.session,env.ADMIN_SECRET);
  await env.DB.prepare('INSERT OR IGNORE INTO visits(code,path,bucket,session_hash,visited_at) VALUES(?,?,?,?,?)').bind(data.code,data.path,bucket,sessionHash,now).run();
  return new Response(null,{status:204,headers:cors});
}
export async function handle(request,env) {
  const url = new URL(request.url);
  if (url.pathname==='/health') return json({ok:true});
  if (url.pathname==='/collect') return collect(request,env);
  if (url.pathname==='/' && request.method==='GET') return Response.redirect(url.origin+'/admin',302);
  if (url.pathname==='/admin' && request.method==='GET') return new Response(adminHTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  if (!url.pathname.startsWith('/api/')) return fail('Not found',404);
  if (!env.ADMIN_SECRET || env.ADMIN_SECRET.length<32) return fail('Admin not configured',503);
  if (request.method!=='GET' && request.headers.get('Origin')!==url.origin) return fail('Origin not allowed',403);
  if (url.pathname==='/api/login' && request.method==='POST') {
    const bucket = Math.floor(Date.now()/300000);
    const limit = await env.DB.prepare('INSERT INTO login_limits(id,bucket,attempts) VALUES(1,?,1) ON CONFLICT(id) DO UPDATE SET attempts=CASE WHEN bucket=excluded.bucket THEN attempts+1 ELSE 1 END,bucket=excluded.bucket RETURNING attempts').bind(bucket).first();
    if (limit.attempts>20) return fail('尝试次数过多，请 5 分钟后重试。',429);
    const data=await body(request);
    if (!equal(await digest(String(data.password||'')),await digest(env.ADMIN_SECRET))) return fail('登录密钥不正确。',401);
    const expires=String(Date.now()+86400000), token=expires+'.'+await sign('admin:'+expires,env.ADMIN_SECRET);
    return json({ok:true},200,{'Set-Cookie':`${cookieName}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`});
  }
  if (!await authenticated(request,env)) return fail('请先登录。',401);
  if (url.pathname==='/api/logout' && request.method==='POST') return json({ok:true},200,{'Set-Cookie':`${cookieName}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`});
  if (url.pathname==='/api/links' && request.method==='GET') {
    const {results}=await env.DB.prepare('SELECT l.*,COUNT(v.id) AS visits,MAX(v.visited_at) AS last_visit FROM links l LEFT JOIN visits v ON v.code=l.code AND v.visited_at>=? GROUP BY l.code ORDER BY l.created_at DESC').bind(Date.now()-90*86400000).all();
    return json({links:results,site:env.SITE_ORIGIN});
  }
  if (url.pathname==='/api/links' && request.method==='POST') {
    const data=await body(request), label=typeof data.label==='string'?data.label.trim():'';
    if (!label || label.length>100 || !PATHS.includes(data.path)) return fail('填写备注（最多 100 字）并选择页面。',400);
    const count=await env.DB.prepare('SELECT COUNT(*) AS count FROM links').first();
    if(count.count>=1000) return fail('已达到 1000 个链接上限。',400);
    const code=randomCode();
    await env.DB.prepare('INSERT INTO links(code,label,path,created_at) VALUES(?,?,?,?)').bind(code,label,data.path,Date.now()).run();
    return json({code,url:env.SITE_ORIGIN+data.path+'?ref='+code},201);
  }
  const match=url.pathname.match(/^\/api\/links\/([a-f0-9]{32})$/);
  if (match && request.method==='PATCH') {
    const data=await body(request); if(typeof data.active!=='boolean') return fail('Invalid status',400);
    await env.DB.prepare('UPDATE links SET active=? WHERE code=?').bind(data.active?1:0,match[1]).run();
    return json({ok:true});
  }
  const visits=url.pathname.match(/^\/api\/links\/([a-f0-9]{32})\/visits$/);
  if(visits && request.method==='GET') {
    const {results}=await env.DB.prepare('SELECT path,visited_at FROM visits WHERE code=? AND visited_at>=? ORDER BY visited_at DESC LIMIT 200').bind(visits[1],Date.now()-90*86400000).all();
    return json({visits:results});
  }
  return fail('Not found',404);
}
export default {
  async fetch(request,env) {
    let response; try {response=await handle(request,env);} catch {response=fail('请求失败，请稍后重试。',400);}
    response=new Response(response.body,response);
    response.headers.set('X-Content-Type-Options','nosniff');
    response.headers.set('X-Frame-Options','DENY');
    response.headers.set('Referrer-Policy','no-referrer');
    response.headers.set('X-Robots-Tag','noindex, nofollow');
    response.headers.set('Content-Security-Policy',"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    return response;
  },
  async scheduled(controller,env) { await env.DB.prepare('DELETE FROM visits WHERE visited_at < ?').bind(Date.now()-90*86400000).run(); }
};
