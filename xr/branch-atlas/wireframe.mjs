// MG-17: lightweight 3D wireframe renderer without model/CDN dependency.
// World-space lines are projected through a perspective camera. This is not an XR renderer.
import {metrics,clamp} from './engine.mjs';
const C={structure:'#678274',thin:'#92a99a',accent:'#397e5a',pale:'#a7b9a7',plant:'#5b9a73',
  archive:'#b08a60',memory:'#91a5b4',selected:'#244f3b',mist:'#889a91',ghost:'#c0cfc2'};
const TAU=Math.PI*2;
const lerp=(a,b,t)=>a+(b-a)*t;
const nodePosition=i=>{
 const a=i*TAU/9-Math.PI/2;
 return [Math.cos(a)*.91,.10+Math.sin(a)*.47,Math.sin(a*1.7)*.48];
};
const fractional=x=>x-Math.floor(x);
const pseudo=i=>fractional(Math.sin(i*127.1+79.7)*43758.5453);
export class WireframeStage{
 constructor(canvas,onNode){
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});
  this.onNode=onNode;this.layer='WIRE';this.state=null;
  this.yaw=-.45;this.pitch=.24;this.distance=5.3;this.targetDistance=5.3;
  this.drag=null;this.clickables=[];this.frame=0;this.lastTick=0;this.avgFrame=16.6;
  this.running=true;this.initInput();requestAnimationFrame(t=>this.draw(t));
 }
 setState(state){this.state=state;this.targetDistance=[5.3,4.5,3.25][state.depth]||5.3;}
 setLayer(layer){if(['WIRE','SECTION','MEMORY'].includes(layer))this.layer=layer;}
 initInput(){
  const c=this.canvas;
  c.addEventListener('pointerdown',e=>{
   c.setPointerCapture?.(e.pointerId);
   this.drag={id:e.pointerId,x:e.clientX,y:e.clientY,originX:e.clientX,originY:e.clientY,active:false};
  });
  c.addEventListener('pointermove',e=>{
   if(this.drag?.id!==e.pointerId)return;
   const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;
   if(Math.hypot(e.clientX-this.drag.originX,e.clientY-this.drag.originY)>5)this.drag.active=true;
   if(this.drag.active){
    this.yaw+=dx*.0053;this.pitch=clamp(this.pitch+dy*.005,-.72,.82);
    c.classList.add('dragging');
   }
   this.drag.x=e.clientX;this.drag.y=e.clientY;
  });
  const up=e=>{
   if(!this.drag||e.pointerId!==this.drag.id)return;
   if(!this.drag.active){
    const rect=c.getBoundingClientRect(),px=e.clientX-rect.left,py=e.clientY-rect.top;
    let nearest=null,best=31;
    for(const p of this.clickables){
      const d=Math.hypot(px-p.x,py-p.y);
      if(d<best){nearest=p.index;best=d;}
    }
    if(nearest!==null)this.onNode?.(nearest);
   }
   this.drag=null;c.classList.remove('dragging');
  };
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  c.addEventListener('wheel',e=>{
   e.preventDefault();this.targetDistance=clamp(this.targetDistance+Math.sign(e.deltaY)*.25,2.5,8.5);
  },{passive:false});
  c.addEventListener('keydown',e=>{
   if(e.key==='ArrowLeft')this.yaw-=.12;
   if(e.key==='ArrowRight')this.yaw+=.12;
   if(e.key==='ArrowUp')this.pitch=clamp(this.pitch-.1,-.72,.82);
   if(e.key==='ArrowDown')this.pitch=clamp(this.pitch+.1,-.72,.82);
  });
 }
 project(p){
  const [x,y,z]=p;
  const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw);
  const xx=x*cy-z*sy,zz=x*sy+z*cy;
  const cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);
  const yy=y*cp-zz*sp,z2=y*sp+zz*cp;
  const denom=this.distance-z2;
  if(denom<.35)return null;
  const f=Math.min(this.W,this.H)*1.72/denom;
  return {x:this.W/2+xx*f,y:this.H*.535-yy*f,z:z2,scale:f};
 }
 line(a,b,color=C.thin,alpha=.5,width=1,dash=false){
  const p=this.project(a),q=this.project(b);
  if(!p||!q)return;
  const ctx=this.ctx;
  ctx.globalAlpha=Math.max(0,Math.min(1,alpha));ctx.strokeStyle=color;ctx.lineWidth=width;
  if(dash)ctx.setLineDash([3,6]);
  ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
  if(dash)ctx.setLineDash([]);ctx.globalAlpha=1;
  this.lines++;
 }
 poly(points,color=C.thin,alpha=.5,width=1,closed=false){
  for(let i=1;i<points.length;i++)this.line(points[i-1],points[i],color,alpha,width);
  if(closed&&points.length>2)this.line(points.at(-1),points[0],color,alpha,width);
 }
 box(w,h,d,center=[0,0,0],color=C.structure,alpha=.62){
  const [cx,cy,cz]=center,xa=[cx-w/2,cx+w/2],ya=[cy-h/2,cy+h/2],za=[cz-d/2,cz+d/2];
  for(const y of ya){
   this.poly([[xa[0],y,za[0]],[xa[1],y,za[0]],[xa[1],y,za[1]],[xa[0],y,za[1]]],color,alpha,1,true);
  }
  for(const x of xa)for(const z of za)this.line([x,ya[0],z],[x,ya[1],z],color,alpha,1);
 }
 ring(radius,y=0,center=[0,0,0],color=C.thin,alpha=.4,n=56){
  for(let i=0;i<n;i++){
   const a=i*TAU/n,b=(i+1)*TAU/n;
   this.line([center[0]+Math.cos(a)*radius,y+center[1],center[2]+Math.sin(a)*radius],
     [center[0]+Math.cos(b)*radius,y+center[1],center[2]+Math.sin(b)*radius],color,alpha);
  }
 }
 dome(m,time){
  const p=m.permeability,r=.53+p*1.05,cy=-.21;
  const alpha=this.state.depth===0?.12:.18+.44*p;
  const sections=this.layer==='SECTION'?10:16;
  for(let k=0;k<sections;k++){
   const theta=k*TAU/sections;
   const points=[];
   for(let j=0;j<=22;j++){
    const phi=j/22*Math.PI;
    points.push([Math.sin(phi)*Math.cos(theta)*r,
      cy+Math.cos(phi)*r*.95,Math.sin(phi)*Math.sin(theta)*r]);
   }
   this.poly(points,this.layer==='MEMORY'?C.memory:C.structure,alpha);
  }
  const levels=this.layer==='SECTION'?12:7;
  for(let j=1;j<levels;j++){
    const phi=j*Math.PI/levels,rr=Math.sin(phi)*r,y=cy+Math.cos(phi)*r*.95;
    this.ring(rr,y,[0,0,0],C.thin,alpha*.8,48);
  }
  if(this.state.depth>=1){
   for(let k=0;k<4;k++){
    const r2=r*(.5+k*.14);
    this.ring(r2,cy-.08,[m.offset*.20,0,0],C.mist,.09+p*.20,72);
   }
  }
 }
 plant(m,t){
  const growth=m.plant*(this.state.depth===0?.15:1);
  const count=this.layer==='MEMORY'?20:11;
  for(let k=0;k<count;k++){
   const a=k*2.39996,r=.10+.54*Math.sqrt((k+.6)/count);
   const x=Math.cos(a)*r,z=Math.sin(a)*r*.73;
   const hh=growth*(.50+.48*pseudo(k+8));
   const pts=[];
   for(let j=0;j<=17;j++){
    const f=j/17;
    pts.push([x+Math.sin(f*5+k)*f*.08,-.63+f*hh,
       z+Math.cos(f*3+k)*f*.055]);
   }
   this.poly(pts,C.plant,.16+.48*m.memory);
   if(m.memory>.15){
    for(const frac of [.34,.63,.85]){
     const p=pts[Math.floor(frac*17)],b=.07+.11*m.memory;
     this.poly([p,[p[0]+b,p[1]+b*.42,p[2]+b*.30],
       [p[0]+b*.9,p[1]+b*.66,p[2]+b*.55],p],
       C.plant,.20+.32*m.memory,.9);
     this.poly([p,[p[0]-b,p[1]+b*.32,p[2]-b*.33],
       [p[0]-b*.9,p[1]+b*.6,p[2]-b*.5],p],
       C.plant,.20+.30*m.memory,.9);
    }
   }
  }
 }
 caseShell(m){
  const alpha=this.state.depth===2?.28:.55;
  this.box(2.12,.51,1.54,[0,-.67,0],C.structure,alpha);
  this.box(1.95,.35,1.37,[0,-.67,0],C.thin,alpha*.42);
  // Hinged lid is a true 3D rotating plane, not a background image.
  const angle=this.state.depth===0?.045:(.56+m.door*.8);
  const lidPoint=(x,z)=>{
   const z0=z+.77;return [x,-.405+z0*Math.sin(angle),-.77+z0*Math.cos(angle)];
  };
  const corners=[lidPoint(-1.06,-.77),lidPoint(1.06,-.77),
    lidPoint(1.06,.77),lidPoint(-1.06,.77)];
  this.poly(corners,C.structure,alpha,.95,true);
  this.poly([lidPoint(-.94,-.66),lidPoint(.94,-.66),lidPoint(.94,.66),lidPoint(-.94,.66)],C.thin,alpha*.5,.8,true);
  // carry handle + two physical locks
  this.poly([[-.23,-.60,.79],[-.23,-.40,.81],[.23,-.40,.81],[.23,-.60,.79]],C.structure,alpha);
  for(const x of [-.69,.69])this.box(.14,.11,.08,[x,-.43,.78],C.structure,alpha);
  // explicit exploded stage for SECTION only
  if(this.layer==='SECTION')for(let y=-.9;y<.85;y+=.15){
   this.line([-1.2,y,-.2],[1.2,y,-.2],C.archive,.10,.9,true);
  }
 }
 routeDecoration(m,sec){
  const id=this.state.route;
  const alpha=this.state.depth===0?.10:.26;
  if(id==='climate'){
    for(let k=0;k<12;k++){
      const y=-.55+k*.12;
      this.ring(.5+k*.035,y,[0,0,0],C.memory,alpha*(.35+k/17),60);
    }
  }else if(id==='navigation'){
    for(let i=0;i<6;i++){
      const pts=[];
      for(let j=0;j<90;j++){
       const u=j/89*TAU*1.7;
       pts.push([Math.cos(u+i)*(.35+i*.14)+m.offset*.5,-.60+j/89*1.45,
        Math.sin(u+i)*(.30+i*.10)]);
      }
      this.poly(pts,C.archive,alpha+.12,.9);
    }
  }else if(id==='traveler'){
    for(let i=0;i<6;i++){
      this.box(.12+i*.04,.09+i*.015,.18+i*.015,
       [Math.cos(i*2.4)*.5,-.36+Math.floor(i/3)*.26,Math.sin(i*2.1)*.4],
       C.archive,alpha+.14);
    }
  }else if(id==='memory'||id==='recovery'){
    for(let k=0;k<m.shards;k++){
     const x=(pseudo(k+1)-.5)*2.5,y=(pseudo(k+4)-.5)*2.5,z=(pseudo(k+15)-.5)*2.0;
     const scale=.015+.03*pseudo(k+9);
     this.line([x,y,z],[x+scale,y+scale*.5,z+scale],C.memory,.12+m.memory*.32,.85);
    }
  }else if(id==='habitation'){
    for(let i=0;i<5;i++){
     const x=-.8+i*.4;
     this.line([x,-.55,-.8],[x,.50,-.8],C.plant,alpha);
     this.line([x,-.55,.8],[x,.50,.8],C.plant,alpha);
     this.poly([[x,.5,-.8],[x,.8,0],[x,.5,.8]],C.plant,alpha);
    }
  }else if(id==='botany'){
    for(let k=0;k<9;k++){
     const a=k/9*TAU;
     this.ring(.24+k*.10,-.49,[.02*Math.cos(a),0,.02*Math.sin(a)],C.plant,.10+.26*m.memory,48);
    }
  }else if(id==='case'){
    for(let i=0;i<7;i++){
     this.box(1.25+i*.09,.11,1.12+i*.08,[0,-.52+i*.18,0],C.archive,.13+i*.015);
    }
  }else if(id==='misdelivery'){
    for(let i=0;i<6;i++){
     const x=-.9+i*.36;
     this.line([x,-.72,-.93+m.offset*.25],[x,.83,-.93+m.offset*.25],
       C.archive,.12+i*.03,1,true);
    }
  }else{
    for(let i=0;i<9;i++)this.ring(.21+i*.12,-.58,
      [m.offset*.10,0,0],C.plant,.11+i*.02,48);
  }
 }
 nodes(){
  this.clickables=[];
  if(this.state.depth===0)return;
  const c=this.ctx;
  for(let i=0;i<9;i++){
   const p=this.project(nodePosition(i));if(!p)continue;
   this.clickables.push({index:i,x:p.x,y:p.y});
   const selected=this.state.selected===i;
   const r=selected?17:12;
   c.globalAlpha=selected?1:.82;
   c.lineWidth=selected?2:1;
   c.strokeStyle=selected?C.selected:C.accent;
   c.fillStyle=selected?'rgba(229,245,225,.92)':'rgba(240,245,238,.76)';
   c.beginPath();c.arc(p.x,p.y,r,0,TAU);c.fill();c.stroke();
   c.fillStyle=C.selected;
   c.textAlign='center';c.font='11px ui-monospace,monospace';
   c.fillText(String(i+1).padStart(2,'0'),p.x,p.y+4);
   if(selected){
    c.strokeStyle=C.accent;c.globalAlpha=.4;
    c.beginPath();c.arc(p.x,p.y,r+8,0,TAU);c.stroke();
   }
   c.globalAlpha=1;
  }
 }
 renderBackground(){
  const c=this.ctx,W=this.W,H=this.H;
  c.fillStyle='#e4ece3';c.fillRect(0,0,W,H);
  c.strokeStyle='rgba(79,110,90,.09)';c.lineWidth=.7;
  for(let x=0;x<W;x+=39){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}
  for(let y=0;y<H;y+=39){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // fixed quiet horizon, no loud animated scanner or frequency bars
  c.strokeStyle='rgba(74,113,91,.20)';c.beginPath();
  c.moveTo(W*.08,H*.76);c.lineTo(W*.92,H*.76);c.stroke();
 }
 draw(time){
  if(!this.running)return;
  requestAnimationFrame(t=>this.draw(t));
  if(!this.state)return;
  const rect=this.canvas.getBoundingClientRect();
  if(rect.width<2||rect.height<2)return;
  const dpr=Math.min(1.7,window.devicePixelRatio||1);
  const w=Math.floor(rect.width*dpr),h=Math.floor(rect.height*dpr);
  if(this.canvas.width!==w||this.canvas.height!==h){
   this.canvas.width=w;this.canvas.height=h;
  }
  this.ctx.setTransform(dpr,0,0,dpr,0,0);this.W=rect.width;this.H=rect.height;
  this.distance=lerp(this.distance,this.targetDistance,.085);
  this.lines=0;this.renderBackground();
  const m=metrics(this.state);
  this.caseShell(m);
  if(this.state.depth>=1){
   this.dome(m,time);this.plant(m,time);this.routeDecoration(m,time);
   if(this.layer==='MEMORY'){
    for(let i=0;i<m.shards;i++){
     const p=[(pseudo(i+3)-.5)*2.2,(pseudo(i+13)-.5)*2,
      (pseudo(i+37)-.5)*2.1],point=this.project(p);
     if(point){
      this.ctx.fillStyle=C.memory;this.ctx.globalAlpha=.17+.36*m.memory;
      this.ctx.fillRect(point.x,point.y,1.4,1.4);this.ctx.globalAlpha=1;
     }
    }
   }
   this.nodes();
  }else this.clickables=[];
  if(this.frame++%50===0){
   const dt=Math.max(4,Math.min(80,time-this.lastTick));
   this.avgFrame=lerp(this.avgFrame,dt,.32);
   const el=document.getElementById('render-info');
   if(el)el.textContent='3D PROJECTION / '+this.lines+' SEGMENTS';
  }
  this.lastTick=time;
 }
 destroy(){this.running=false;}
}
