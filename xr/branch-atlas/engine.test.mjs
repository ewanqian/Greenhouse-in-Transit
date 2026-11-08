import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INITIAL,ACTIONS,evolve,metrics,ending,routeById,visitedIn,sceneExport} from './engine.mjs';
const manifest=JSON.parse(readFileSync(new URL('./paths.json',import.meta.url),'utf8'));
const fresh=()=>({...INITIAL,discoveries:[],events:[]});
test('nine autonomous routes and nine distinct nodes each',()=>{
 assert.equal(manifest.routes.length,9);
 assert.deepEqual(manifest.routes.map(x=>x.nodes.length),Array(9).fill(9));
 const ids=manifest.routes.flatMap(x=>x.nodes.map(n=>n.id));
 assert.equal(new Set(ids).size,81);
 for(const r of manifest.routes)for(const n of r.nodes){
  assert.ok(n.description.length>=12,n.id+' should explain consequence');
  assert.ok(n.verb&&n.title);
 }
 assert.equal(ACTIONS.length,9);
});
test('opening and entering changes stage without auto-advancing story',()=>{
 let s=fresh();assert.equal(s.depth,0);
 s=evolve(s,{type:'OPEN'},manifest);assert.equal(s.depth,1);
 s=evolve(s,{type:'ENTER'},manifest);assert.equal(s.depth,2);
 assert.equal(s.discoveries.length,0);
 const p=metrics(s);assert.ok(p.shell>1&&p.plant>0);
 s=evolve(s,{type:'LEAVE'},manifest);assert.equal(s.depth,1);
});
test('nine chapters x nine selections are actually reachable',()=>{
 let s=fresh();
 for(const route of manifest.routes){
  s=evolve(s,{type:'ROUTE',id:route.id},manifest);
  assert.equal(s.route,route.id);
  for(let i=0;i<9;i++)s=evolve(s,{type:'NODE',index:i,source:'NODE_TEST'},manifest);
  assert.equal(visitedIn(s,route.id),9);
 }
 assert.equal(s.discoveries.length,81);
 assert.ok(s.events.every(e=>e.source==='NODE_TEST'));
});
test('repeating a node does not repeatedly raise narrative variables',()=>{
 let s=fresh();s=evolve(s,{type:'NODE',index:3},manifest);
 const after=s.permeability;
 s=evolve(s,{type:'NODE',index:3},manifest);
 assert.equal(s.permeability,after);
 assert.equal(s.discoveries.length,1);
});
test('variables and scene parameters are bounded',()=>{
 let s=fresh();
 for(const key of ['permeability','memory','deviation']){
  s=evolve(s,{type:'SET',key,value:500},manifest);assert.equal(s[key],100);
  s=evolve(s,{type:'SET',key,value:-20},manifest);assert.equal(s[key],0);
 }
 const m=metrics(s);assert.ok(m.door>=0&&m.plant>=0&&m.shards>=0);
 assert.match(ending(s),/调查/);
});
test('invalid route and selection cannot erase progress',()=>{
 let s=fresh();s=evolve(s,{type:'NODE',index:0},manifest);
 const before=s.discoveries.length;
 s=evolve(s,{type:'ROUTE',id:'not-real'},manifest);
 s=evolve(s,{type:'NODE',index:99},manifest);
 assert.equal(s.discoveries.length,before);
});
test('session export preserves result and disclaims XR accuracy',()=>{
 let s=fresh();s=evolve(s,{type:'NODE',index:2},manifest);
 const out=JSON.parse(sceneExport(s));
 assert.equal(out.state.discoveries.length,1);
 assert.match(out.limits,/not a measured physical suitcase anchor/);
});
test('full reset clears discoveries and restores sealed case',()=>{
 let s=fresh();s=evolve(s,{type:'OPEN'},manifest);
 s=evolve(s,{type:'NODE',index:8},manifest);
 s=evolve(s,{type:'RESET'},manifest);
 assert.equal(s.depth,0);assert.equal(s.discoveries.length,0);
 assert.equal(s.route,'misdelivery');
});