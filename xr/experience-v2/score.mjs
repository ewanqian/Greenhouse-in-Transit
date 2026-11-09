// MG-17 / Experience 02 — pure, authored finite-state visitor-loop semantics.
// Production renderer & XR adapters must read this module, not invent side effects.
export const BEATS=Object.freeze([
  {id:'MISDELIVERED',zh:'误投证物',en:'MISDELIVERED',targetSec:0,
    instruction:'观察没有收件人的 MG-17 箱体，选择锁扣或继续按钮，开启容器。'},
  {id:'INSPECT',zh:'箱内调查',en:'INSPECT',targetSec:12,
    instruction:'识别三件证物：登船票据、环境参数卡和植物记忆样本。'},
  {id:'BLOOM',zh:'植物显影',en:'BLOOM',targetSec:39,
    instruction:'触碰核心或右侧空间光标，让温室从箱子中显影。'},
  {id:'AFTERIMAGE',zh:'花园残影',en:'AFTERIMAGE',targetSec:53,
    instruction:'选择记忆节点，让花园的光与结构留在空间里。'},
  {id:'RECOVERY',zh:'异常回收',en:'RECOVERY',targetSec:66,
    instruction:'执行回收，观察箱体收束，但仍有记忆残留。'},
  {id:'HABITATION',zh:'重新栖居',en:'HABITATION',targetSec:78,
    instruction:'决定保留这处临时温室，体验至此完成。'}
]);
export const EVIDENCE=Object.freeze(['ticket','parameter','sample']);
export const MAX_LOG=240;
export const GESTURE={pinchOn:.032,pinchOff:.052,dwellMs:90,missingMs:180};
export function initial(){
 return {stage:'MISDELIVERED',seen:[],events:[],startedAt:null,finishedAt:null,
    lastInput:'NONE',simulation:false,sceneVersion:'MG17_PERFORMANCE_V1'};
}
export function beat(s){return BEATS.find(b=>b.id===s.stage)||BEATS[0];}
export const eligible=(s)=>EVIDENCE.every(id=>s.seen.includes(id));
export function nextCue(s){
 if(s.stage==='MISDELIVERED')return{action:'OPEN_CASE',label:'开启箱盖 / OPEN CASE',enabled:true};
 if(s.stage==='INSPECT')return{action:'GROW',label:eligible(s)?'触碰核心 / RELEASE GARDEN':'识别 3 件证物 '+s.seen.length+'/3',enabled:eligible(s)};
 if(s.stage==='BLOOM')return{action:'TRACE',label:'记录花园残影 / AFTERIMAGE',enabled:true};
 if(s.stage==='AFTERIMAGE')return{action:'RECALL',label:'尝试回收 / RECOVERY',enabled:true};
 if(s.stage==='RECOVERY')return{action:'STAY',label:'重新栖居 / STAY',enabled:true};
 return{action:'RESET',label:'新一位观众 / RESET',enabled:true};
}
function stamp(ms){return typeof ms==='number'&&Number.isFinite(ms)?Math.max(0,Math.round(ms)):0;}
export function reduce(previous,event){
 const state={...previous,seen:[...previous.seen],events:[...previous.events]};
 if(!event||typeof event.type!=='string')return previous;
 if(event.type==='RESET')return initial();
 const t=stamp(event.t_ms);
 const source=['DESKTOP','MOBILE','XR_HAND','XR_RAY','OPERATOR','SIMULATED'].includes(event.source)
    ?event.source:'UNKNOWN';
 let success=false,comment='';
 if(event.type==='OPEN_CASE'&&state.stage==='MISDELIVERED'){
   state.stage='INSPECT';success=true;comment='LID RELEASED';
 }else if(event.type==='SELECT_EVIDENCE'&&state.stage==='INSPECT'&&EVIDENCE.includes(event.id)){
   if(!state.seen.includes(event.id))state.seen.push(event.id);
   success=true;comment='EVIDENCE '+event.id+' '+state.seen.length+'/3';
 }else if(event.type==='GROW'&&state.stage==='INSPECT'&&eligible(state)){
   state.stage='BLOOM';success=true;comment='GARDEN UNSEALED';
 }else if(event.type==='TRACE'&&state.stage==='BLOOM'){
   state.stage='AFTERIMAGE';success=true;comment='BOTANICAL MEMORY';
 }else if(event.type==='RECALL'&&state.stage==='AFTERIMAGE'){
   state.stage='RECOVERY';success=true;comment='RECOVERY INCOMPLETE';
 }else if(event.type==='STAY'&&state.stage==='RECOVERY'){
   state.stage='HABITATION';state.finishedAt=t;success=true;comment='TEMPORARY HABITATION';
 }else if(event.type==='NOTE'){
   // A non-mutating observation may be logged without skipping story gates.
   success=true;comment=String(event.id||'OBSERVATION').slice(0,60);
 }else return previous;
 if(state.startedAt===null)state.startedAt=t;
 state.lastInput=source;state.simulation=state.simulation||source==='SIMULATED';
 state.events.push({index:state.events.length,type:event.type,
   id:typeof event.id==='string'?event.id:null,
   source,t_ms:t,stage:state.stage,comment});
 if(state.events.length>MAX_LOG)state.events=state.events.slice(-MAX_LOG);
 return state;
}
export function renderMode(s){
 const st=s.stage;
 return{
  lid:st==='MISDELIVERED'?0:1,
  dome:st==='BLOOM'?1:st==='AFTERIMAGE'?.85:st==='RECOVERY'?.28:st==='HABITATION'?1.12:0,
  garden:st==='BLOOM'?1:st==='AFTERIMAGE'?.82:st==='RECOVERY'?.17:st==='HABITATION'?1.02:0,
  ghost:st==='AFTERIMAGE'?.74:st==='RECOVERY'?1:st==='HABITATION'?.55:0,
  light:st==='BLOOM'?.74:st==='AFTERIMAGE'?.5:st==='RECOVERY'?.22:st==='HABITATION'?.68:0,
  clickableEvidence:st==='INSPECT',
  clickableCore:st==='INSPECT'&&eligible(s),
  period:st==='HABITATION'?'FINISHED':'ONGOING'
 };
}
export function progress(s){
 const base=BEATS.findIndex(b=>b.id===s.stage);
 return{beatIndex:base,total:BEATS.length,percent:Math.round((base+.08+(s.stage==='INSPECT'?s.seen.length/4:0))/BEATS.length*100),
   evidence:s.seen.length,completed:s.stage==='HABITATION'};
}
export function exportRecord(s,when=new Date()){
 return JSON.stringify({
  schema:'mg17-performance-session-v1',
  project:'Greenhouse in Transit',
  exportedAt:when.toISOString(),
  performance:s,
  gates:{requiresEvidence:[...EVIDENCE],noAutomaticProgress:true},
  hardwareVerification:'NOT_FROM_THIS_EXPORT',
  physicalCaseAnchoring:false,
  disclaimer:'Digital case follows a virtual XR reference space, NOT a registered real-world suitcase.'
 },null,2);
}
export class PinchDwell{
 constructor(config=GESTURE){this.on=config.pinchOn;this.off=config.pinchOff;
   this.dwellMs=config.dwellMs;this.missingMs=config.missingMs;this.hands=new Map();}
 reset(){this.hands.clear();}
 update(key,dist,now){
   const id=String(key),t=stamp(now),events=[];
   let s=this.hands.get(id)||{active:false,candidateAt:null,lastSeen:0,rearm:true,unknownAt:null};
   if(!(typeof dist==='number'&&Number.isFinite(dist)&&dist>=0)){
     if(s.unknownAt===null)s.unknownAt=t;
     if(t-s.unknownAt>=this.missingMs){
       if(s.active)events.push({kind:'TRACKING_LOST',hand:id,t_ms:t});
       // A missing tracked hand is UNKNOWN, not evidence of a deliberate lift.
       // Require observed distance > release threshold before rearming.
       s.active=false;s.rearm=false;s.candidateAt=null;
     }
   }else{
     s.lastSeen=t;s.unknownAt=null;
     if(s.active){
       if(dist>this.off){
         s.active=false;s.rearm=true;s.candidateAt=null;
         events.push({kind:'RELEASE',hand:id,t_ms:t});
       }
     }else if(s.rearm&&dist<this.on){
       if(s.candidateAt===null)s.candidateAt=t;
       else if(t-s.candidateAt>=this.dwellMs){
         s.active=true;s.rearm=false;s.candidateAt=null;
         events.push({kind:'PINCH',hand:id,t_ms:t,distance_m:dist});
       }
     }else if(dist>this.off){s.candidateAt=null;s.rearm=true;}
   }
   this.hands.set(id,s);
   return{events,active:s.active,progress:s.candidateAt===null?(s.active?1:0):
     Math.min(1,(t-s.candidateAt)/this.dwellMs),distance_m:dist};
 }
}
