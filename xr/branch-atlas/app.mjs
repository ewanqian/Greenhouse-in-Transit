import {INITIAL,evolve,metrics,ending,visitedIn,routeById,sceneExport} from './engine.mjs';
import {WireframeStage} from './wireframe.mjs';
const $=id=>document.getElementById(id);
let manifest=null,state={...INITIAL,discoveries:[],events:[]},stage=null;
let rehearsal=null,layer='WIRE',eventCount=0;
const summary={
 misdelivery:'空间转运中的异常与错投',
 case:'箱体如何容纳一个空间',
 climate:'被运输的环境条件',
 botany:'植物残影的保存与生长',
 traveler:'日常遗物与匿名旅客',
 navigation:'数字洋流中的路线',
 memory:'外部化的花园记忆',
 recovery:'封存与异常回收',
 habitation:'重新成为一个可居住的地方'
};
function updateUrl(){
 const url=new URL(location.href);
 url.searchParams.set('route',state.route);
 url.searchParams.set('node',String(state.selected+1));
 try{history.replaceState(null,'',url);}catch{}
}
function dispatch(action){
 state=evolve(state,action,manifest);
 stage.setState(state);
 updateUrl();render();
}
function routeSelect(id){
 stopRehearsal();
 dispatch({type:'ROUTE',id});
}
function nodeSelect(index,source='UI'){
 dispatch({type:'NODE',index,source});
}
function renderRoutes(){
 const host=$('routes');
 host.replaceChildren();
 for(const r of manifest.routes){
  const b=document.createElement('button');
  b.type='button';b.className='route'+(r.id===state.route?' active':'');
  b.dataset.route=r.id;b.setAttribute('aria-pressed',String(r.id===state.route));
  const i=document.createElement('span');i.className='idx';i.textContent=String(r.number).padStart(2,'0');
  const title=document.createElement('span');title.textContent=r.title.replace(/^\d+ \/ /,'');
  const count=document.createElement('span');count.className='count';count.textContent=visitedIn(state,r.id)+'/9';
  b.append(i,title,count);b.addEventListener('click',()=>routeSelect(r.id));
  host.append(b);
 }
}
function renderChoices(){
 const route=routeById(manifest,state.route);if(!route)return;
 const host=$('choices');host.replaceChildren();
 for(const n of route.nodes){
  const i=n.number-1;
  const b=document.createElement('button');
  b.type='button';b.className='choice'+(state.selected===i?' active':'');
  b.dataset.node=i;
  b.setAttribute('aria-pressed',String(state.selected===i));
  const a=document.createElement('span');a.textContent=String(n.number).padStart(2,'0');
  const t=document.createElement('span');t.textContent=n.title;
  const v=document.createElement('small');v.className=state.discoveries.includes(n.id)?'done':'';
  v.textContent=state.discoveries.includes(n.id)?'●':'+';
  b.append(a,t,v);b.addEventListener('click',()=>nodeSelect(i));
  host.append(b);
 }
}
function render(){
 if(!manifest)return;
 const route=routeById(manifest,state.route),node=route.nodes[state.selected];
 $('route-title').textContent=route.title;
 $('route-intro').textContent=route.intro;
 $('selected-title').textContent=String(node.number).padStart(2,'0')+' / '+node.title;
 $('selected-desc').textContent=node.description;
 $('selected-action').textContent=node.verb.toUpperCase()+' / '+summary[route.id];
 $('stage-route').textContent=route.system;
 $('stage-state').textContent=[
   '00 / SEALED EVIDENCE',
   '01 / CASE OPEN · '+route.title,
   '02 / INSIDE MISTGARDEN · '+route.title
 ][state.depth];
 $('intro').hidden=state.depth!==0;
 $('open').disabled=state.depth>0;
 $('enter').disabled=state.depth!==1;
 $('leave').disabled=state.depth===0;
 $('status').textContent=state.depth===0?'SEALED / READY':state.depth===1?'EXTERIOR / INSPECT':'INTERIOR / NAVIGATE';
 $('p-val').textContent=state.permeability+'%';
 $('m-val').textContent=state.memory+'%';
 $('d-val').textContent=state.deviation+'%';
 for(const [id,key] of [['permeability','permeability'],['memory','memory'],['deviation','deviation']]){
   $(id).value=state[key];
 }
 $('outcome').textContent=ending(state);
 $('progress-line').style.setProperty('--progress',Math.round(state.discoveries.length/81*100)+'%');
 $('progress').textContent='已识别 '+state.discoveries.length+' / 81 · 当前路径 '+visitedIn(state,state.route)+' / 9';
 renderRoutes();renderChoices();
}
function stopRehearsal(){
 if(rehearsal!==null){clearInterval(rehearsal);rehearsal=null;}
 $('rehearse').textContent='REHEARSE 09';
 if(state.playing)state=evolve(state,{type:'PLAY',value:false},manifest);
}
function startRehearsal(){
 if(rehearsal!==null){stopRehearsal();render();return;}
 if(state.depth===0)dispatch({type:'OPEN'});
 let index=0;const current=state.route;
 $('rehearse').textContent='STOP REHEARSAL';
 state=evolve(state,{type:'PLAY',value:true},manifest);
 // Deliberate research playback only; no automatic stories when page loads.
 rehearsal=setInterval(()=>{
  if(index>=9||state.route!==current){stopRehearsal();render();return;}
  nodeSelect(index++,'REHEARSAL');
 },1050);
}
function exportSession(){
 const blob=new Blob([sceneExport(state)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='MG17-branch-atlas-'+state.route+'.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function bind(){
 $('open').addEventListener('click',()=>dispatch({type:'OPEN'}));
 $('enter').addEventListener('click',()=>dispatch({type:'ENTER'}));
 $('leave').addEventListener('click',()=>dispatch({type:'LEAVE'}));
 $('rehearse').addEventListener('click',startRehearsal);
 $('reset').addEventListener('click',()=>{stopRehearsal();dispatch({type:'RESET'});});
 $('export').addEventListener('click',exportSession);
 for(const key of ['permeability','memory','deviation'])
   $(key).addEventListener('input',e=>dispatch({type:'SET',key,value:Number(e.target.value)}));
 for(const b of document.querySelectorAll('[data-layer]'))
   b.addEventListener('click',()=>{
    layer=b.dataset.layer;
    for(const s of document.querySelectorAll('[data-layer]'))s.classList.toggle('active',s===b);
    stage.setLayer(layer);
   });
 window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;
  if(e.key>='1'&&e.key<='9'){
   const i=Number(e.key)-1;
   if(e.shiftKey)routeSelect(manifest.routes[i].id);
   else nodeSelect(i,'KEYBOARD');
  }
  if(e.key==='Escape'&&state.depth>0){
   stopRehearsal();dispatch({type:'LEAVE'});
  }
  if(e.key.toLowerCase()==='e'&&state.depth===1)dispatch({type:'ENTER'});
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRehearsal();});
 window.addEventListener('pagehide',stopRehearsal);
}
async function init(){
 try{
  const r=await fetch('./paths.json',{cache:'no-cache'});
  if(!r.ok)throw new Error('Story manifest HTTP '+r.status);
  manifest=await r.json();
  if(manifest.routes?.length!==9||manifest.routes.some(x=>x.nodes?.length!==9))
    throw new Error('Narrative graph invalid: expected 9 routes × 9 nodes');
  const params=new URLSearchParams(location.search);
  const route=params.get('route');
  if(routeById(manifest,route))state={...state,route};
  const node=Number(params.get('node'));
  if(Number.isInteger(node)&&node>=1&&node<=9)state={...state,selected:node-1};
  stage=new WireframeStage($('scene'),index=>nodeSelect(index,'3D_HIT'));
  stage.setState(state);bind();render();
  $('runtime-state').textContent='9 × 9 ROUTES / 3D WIREFRAME READY';
 }catch(error){
  console.error('MG17 Branch Atlas startup failed',error);
  $('runtime-state').textContent='MANIFEST FAILED / '+error.message;
  $('selected-desc').textContent='Unable to load paths.json. Try serving this folder through HTTPS or a local HTTP server.';
 }
}
init();
