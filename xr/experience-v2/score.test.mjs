import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,BEATS,EVIDENCE,reduce,eligible,nextCue,PinchDwell,renderMode,progress,exportRecord} from './score.mjs';
const ev=(type,t_ms=0,id=null,source='DESKTOP')=>({type,t_ms,id,source});
test('six authored beats and three required physical evidence targets',()=>{
 assert.deepEqual(BEATS.map(x=>x.id),['MISDELIVERED','INSPECT','BLOOM','AFTERIMAGE','RECOVERY','HABITATION']);
 assert.deepEqual(EVIDENCE,['ticket','parameter','sample']);
});
test('a 60–90 second performance progresses only through intentional actions',()=>{
 let s=initial();assert.equal(s.stage,'MISDELIVERED');
 assert.equal(reduce(s,ev('GROW',0)).stage,'MISDELIVERED');
 s=reduce(s,ev('OPEN_CASE',9000));assert.equal(s.stage,'INSPECT');
 assert.equal(nextCue(s).enabled,false);
 for(const [id,t] of [['sample',22000],['ticket',29000],['parameter',38000]]){
  s=reduce(s,ev('SELECT_EVIDENCE',t,id));
 }
 assert.equal(s.seen.length,3);assert.ok(eligible(s));assert.equal(nextCue(s).action,'GROW');
 s=reduce(s,ev('GROW',44000));assert.equal(s.stage,'BLOOM');
 s=reduce(s,ev('TRACE',57000));assert.equal(s.stage,'AFTERIMAGE');
 s=reduce(s,ev('RECALL',70000));assert.equal(s.stage,'RECOVERY');
 s=reduce(s,ev('STAY',85000));assert.equal(s.stage,'HABITATION');
 assert.equal(s.finishedAt,85000);
 assert.ok(progress(s).completed);assert.equal(s.events.length,8);
 assert.equal(renderMode(s).garden>0,true);
 const record=JSON.parse(exportRecord(s));
 assert.equal(record.physicalCaseAnchoring,false);assert.equal(record.hardwareVerification,'NOT_FROM_THIS_EXPORT');
 assert.equal(record.performance.events.filter(x=>x.type==='SELECT_EVIDENCE').length,3);
});
test('duplicate selection never counts a missing prop',()=>{
 let s=reduce(initial(),ev('OPEN_CASE',4000));
 s=reduce(s,ev('SELECT_EVIDENCE',6000,'ticket'));
 s=reduce(s,ev('SELECT_EVIDENCE',6500,'ticket'));
 assert.equal(s.seen.length,1);
 assert.equal(reduce(s,ev('GROW',7000)).stage,'INSPECT');
 s=reduce(s,ev('SELECT_EVIDENCE',9000,'core'));
 assert.equal(s.seen.length,1);
});
test('every scene has distinct, bounded visual target levels',()=>{
 const states=['MISDELIVERED','INSPECT','BLOOM','AFTERIMAGE','RECOVERY','HABITATION'].map(stage=>renderMode({...initial(),stage}));
 assert.equal(states[0].lid,0);assert.equal(states[1].lid,1);
 assert.ok(states[2].garden>states[4].garden);
 assert.ok(states[3].ghost>0);
 assert.ok(states[4].ghost>states[3].ghost);
 assert.ok(states[5].dome>states[4].dome);
 assert.ok(states.every(s=>Object.values(s).every(v=>typeof v==='number'||typeof v==='boolean'||typeof v==='string')));
});
test('manual reset clears 100% of state',()=>{
 let s=reduce(initial(),ev('OPEN_CASE',2000));s=reduce(s,ev('SELECT_EVIDENCE',3000,'sample'));
 s=reduce(s,ev('RESET',8000));assert.deepEqual(s,initial());
});
test('pinch requires 90ms dwell and deliberate >52mm release',()=>{
 const p=new PinchDwell();
 assert.equal(p.update('left',.022,0).events.length,0);
 assert.equal(p.update('left',.025,80).events.length,0);
 const e=p.update('left',.024,100).events;
 assert.equal(e[0]?.kind,'PINCH');
 assert.equal(p.update('left',.023,200).events.length,0);
 assert.equal(p.update('left',.044,250).events.length,0);
 assert.equal(p.update('left',.061,270).events[0]?.kind,'RELEASE');
 assert.equal(p.update('left',.025,280).events.length,0);
 assert.equal(p.update('left',.024,390).events[0]?.kind,'PINCH');
});
test('tracking loss cannot fabricate PINCH or leave stuck gate',()=>{
 const p=new PinchDwell();p.update('right',.01,0);p.update('right',.01,200);
 assert.equal(p.update('right',null,210).events.length,0);
 assert.equal(p.update('right',null,410).events[0]?.kind,'TRACKING_LOST');
 assert.equal(p.update('right',null,420).events.length,0);
 p.update('right',.025,500);assert.equal(p.update('right',.025,610).events[0]?.kind,'PINCH');
});
test('two hands isolated; 10000-frame simulated input does not storm',()=>{
 const p=new PinchDwell();let all=0;
 for(let i=0;i<10000;i++){
  const t=i*11,dist=(i%170<60)?.018:.08;
  all+=p.update('left',dist,t).events.filter(x=>x.kind==='PINCH').length;
  if(i%2===0)p.update('right',.07,t);
 }
 assert.ok(all>=40&&all<=80);
});
