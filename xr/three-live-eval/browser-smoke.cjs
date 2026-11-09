const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({
  headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']
 });
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1380,height:850}});
  page.on('pageerror',error=>errors.push('PAGE '+error.message));
  await page.goto('http://127.0.0.1:8765/xr/three-live-eval/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{
   const msg=document.getElementById('three-status')?.textContent||'';
   return msg.includes('LOADED')||msg.includes('FAILED');
  },null,{timeout:30000});
  const threeText=await page.locator('#three-status').innerText();
  assert.match(threeText,/LOADED/,threeText);
  let defined=false;
  try{
   await page.waitForFunction(()=>Boolean(customElements.get('three-live')),null,{timeout:18000});
   defined=true;
  }catch{}
  const live=await page.evaluate(()=>{
   const v=document.getElementById('live-stage');
   return{tag:v?.tagName,hasShadow:!!v?.shadowRoot,
     hasCanvas:!!v?.shadowRoot?.querySelector('canvas'),
     status:document.getElementById('live-status')?.textContent,
     width:v?.getBoundingClientRect().width,height:v?.getBoundingClientRect().height};
  });
  await page.screenshot({path:'mg17-three-live-ab.png',fullPage:true});
  console.log('REFERENCE_GLTF',threeText);
  console.log('THREE_LIVE_CUSTOM_ELEMENT_REGISTERED',defined);
  console.log('THREE_LIVE_RENDER_DOM',JSON.stringify(live));
  console.log('PAGE_ERRORS',JSON.stringify(errors));
  if(!defined)throw Error('Three-Live official hosted module did not register within 18s');
  // Registration and canvas existence alone do not prove model load, XR
  // interaction parity, or an actual native USDZ export. Document honestly.
 }finally{await browser.close()}
})().catch(e=>{console.error('THREE-LIVE SPIKE FAILED / '+(e.stack||String(e)));process.exit(1)});
