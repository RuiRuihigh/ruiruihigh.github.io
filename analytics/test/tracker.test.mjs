import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=ts.transpile(readFileSync(new URL('../../src/scripts/link-analytics.ts',import.meta.url),'utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS});
function harness(url='https://ruiruihigh.github.io/?ref='+'a'.repeat(32),options={}) {
  const calls=[],store=new Map(),local=new Map();let callback,tick=0;
  if(options.optout)local.set('ml-analytics-optout','1');
  const storage=map=>({getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)});
  const context={exports:{},URL,Date,JSON,crypto,location:new URL(url),navigator:{doNotTrack:options.dnt?'1':'0'},localStorage:storage(local),sessionStorage:storage(store),history:{state:null,replaceState(){}},performance:{now:()=>tick},document:{visibilityState:'visible'},window:{setInterval:f=>callback=f,addEventListener(){}},clearInterval:()=>callback=null,fetch:async(...args)=>{calls.push(args);return {ok:true}}};
  vm.runInNewContext(source,context);context.exports.startLinkAnalytics();
  return {calls,store,context,advance:async()=>{for(let i=0;i<10;i++){tick+=500;if(callback)await callback();}}};
}
test('normal visits and privacy opt-outs send no records',async()=>{for(const h of [harness('https://ruiruihigh.github.io/'),harness(undefined,{optout:true}),harness(undefined,{dnt:true})]){await h.advance();assert.equal(h.calls.length,0);}});
test('attributed visit waits for five visible seconds',async()=>{const h=harness();assert.equal(h.calls.length,0);h.context.document.visibilityState='hidden';await h.advance();assert.equal(h.calls.length,0);h.context.document.visibilityState='visible';await h.advance();assert.equal(h.calls.length,1);assert.equal(JSON.parse(h.calls[0][1].body).code,'a'.repeat(32));assert.equal(h.calls[0][1].credentials,'omit');});
test('reloading same tab/page does not duplicate event',async()=>{const h=harness();await h.advance();h.context.exports.startLinkAnalytics();await h.advance();assert.equal(h.calls.length,1);});
test('new recipient link switches attribution',async()=>{const h=harness();await h.advance();h.context.location=new URL('https://ruiruihigh.github.io/?ref='+'b'.repeat(32));h.context.exports.startLinkAnalytics();await h.advance();assert.equal(h.calls.length,2);assert.equal(JSON.parse(h.calls[1][1].body).code,'b'.repeat(32));});
