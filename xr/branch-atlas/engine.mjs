// Greenhouse in Transit — pure scene/narrative reducer.
export const ACTIONS=Object.freeze([
 {id:'inspect',delta:[2,1,-1]},{id:'compare',delta:[-1,2,-2]},
 {id:'trace',delta:[2,2,3]},{id:'unseal',delta:[12,1,1]},
 {id:'suspend',delta:[-4,3,0]},{id:'activate',delta:[5,9,1]},
 {id:'recall',delta:[2,11,-1]},{id:'transfer',delta:[0,2,9]},
 {id:'retain',delta:[-3,7,-4]}
]);
export const INITIAL=Object.freeze({
 route:'misdelivery',selected:0,depth:0,permeability:12,
 memory:8,deviation:78,discoveries:[],events:[],playing:false,viewport:'EXTERIOR'
});
export const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
export const routeById=(manifest,id)=>manifest.routes.find(r=>r.id===id)||null;
export const currentNode=(manifest,state)=>routeById(manifest,state.route)?.nodes[state.selected]||null;
export const visitedIn=(state,id)=>state.discoveries.filter(n=>n.startsWith(id+'-')).length;
export function evolve(state,cmd,manifest){
 const s={...state,discoveries:state.discoveries.slice(),events:state.events.slice()};
 switch(cmd.type){
  case 'OPEN':s.depth=Math.max(1,s.depth);s.viewport='OPEN';break;
  case 'ENTER':s.depth=2;s.viewport='INTERIOR';s.permeability=clamp(s.permeability+4);break;
  case 'LEAVE':s.depth=Math.max(0,s.depth-1);s.viewport=s.depth===0?'SEALED':'EXTERIOR';break;
  case 'ROUTE':
   if(routeById(manifest,cmd.id)){s.route=cmd.id;s.selected=0;s.viewport=s.depth===0?'SEALED':'ROUTE';}
   else return state;
   break;
  case 'NODE':{
   const route=routeById(manifest,s.route);
   const node=route?.nodes[cmd.index];
   if(!node)return state;
   s.selected=cmd.index;
   if(s.depth===0){s.depth=1;s.viewport='OPEN';}
   const fresh=!s.discoveries.includes(node.id);
   if(fresh){
    s.discoveries.push(node.id);
    const [p,m,d]=ACTIONS[cmd.index].delta;
    s.permeability=clamp(s.permeability+p);
    s.memory=clamp(s.memory+m);
    s.deviation=clamp(s.deviation+d);
   }
   s.events.push({kind:'SELECT_NODE',node:node.id,route:route.id,verb:node.verb,new:fresh,
     source:cmd.source||'INTERFACE'});
   if(s.events.length>162)s.events=s.events.slice(-162);
   break;
  }
  case 'SET':
   if(['permeability','memory','deviation'].includes(cmd.key))
    s[cmd.key]=clamp(Number(cmd.value));
   else return state;
   break;
  case 'PLAY':s.playing=Boolean(cmd.value);break;
  case 'RESET':return {...INITIAL,discoveries:[],events:[]};
  default:return state;
 }
 return s;
}
export function metrics(s){
 const p=s.permeability/100,m=s.memory/100,d=s.deviation/100;
 return {
  shell:1+p*1.6,plant:.17+m*1.4,shards:Math.round(8+m*72),
  offset:(d-.5)*.95,door:p*Math.PI*.62,
  wire:.20+p*.75,permeability:p,memory:m,deviation:d,
  scale:s.depth===2?2.2:s.depth===1?1.4:1
 };
}
export function ending(s){
 if(s.discoveries.length<3)return '调查刚开始：请识别至少三件物证。';
 if(s.permeability>64&&s.memory>45)return '花园越过箱体边界，成为现实中的一处临时驻留空间。';
 if(s.deviation>76)return '潮线偏航仍未恢复，转栈署无法确认这是一件普通遗失行李。';
 if(s.memory>48)return '植物与生活记忆逐渐显影：容器开始像一座曾经存在的家。';
 return '边界、航线和物证正在拼合，但这份调查仍然开放。';
}
export function sceneExport(s){return JSON.stringify({
 version:'MG17-BRANCH-ATLAS-0.1',project:'Greenhouse in Transit',
 created_at:new Date().toISOString(),
 state:{...s,events:s.events.slice(-81)},
 limits:'Interactive wireframe concept, not a measured physical suitcase anchor, headset hardware validation, scanned plant or final asset.'
},null,2);}
