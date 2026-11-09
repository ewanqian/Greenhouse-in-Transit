const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({
   headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']
 });
 const errors=[];
 const src='http://127.0.0.1:8765/xr/experience-v2/index.html';
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push('PAGE: '+e.message));
  page.on('console',e=>{if(e.type()==='error')errors.push('CONSOLE: '+e.text())});
  await page.goto(src,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('renderStatus')?.textContent?.includes('WEBGL / ACTIVE'),null,{timeout:30000});
  assert.match(await page.locator('#beat-title').innerText(),/误投证物/);
  assert.equal(await page.locator('#story-action').isEnabled(),true);
  await page.locator('#story-action').click(); // OPEN CASE
  assert.match(await page.locator('#beat-title').innerText(),/箱内调查/);
  assert.equal(await page.locator('#story-action').isEnabled(),false);
  const evidence=[/数字航行票据/,/环境参数卡/,/植物记忆样本/];
  for(const name of evidence)await page.locator('#objectList button').getByText(name).click();
  assert.equal(await page.locator('#story-action').isEnabled(),true);
  assert.match(await page.locator('#evidence-status').innerText(),/3\/3/);
  await page.locator('#story-action').click(); // GROW
  assert.match(await page.locator('#beat-title').innerText(),/植物显影/);
  await page.locator('#story-action').click(); // TRACE
  assert.match(await page.locator('#beat-title').innerText(),/花园残影/);
  await page.locator('#story-action').click(); // RECALL
  assert.match(await page.locator('#beat-title').innerText(),/异常回收/);
  await page.locator('#story-action').click(); // STAY
  assert.match(await page.locator('#beat-title').innerText(),/重新栖居/);
  await page.locator('#wireframe-toggle').click();
  assert.match(await page.locator('#wireframe-toggle').innerText(),/WIREFRAME/);
  const dl=page.waitForEvent('download');
  await page.locator('#story-export').click();
  const artifact=await dl;
  assert.equal(artifact.suggestedFilename(),'MG17-visitor-performance.json');
  await page.screenshot({path:'mg17-v2-desktop.png',fullPage:true});
  await page.locator('#story-reset').click();
  assert.match(await page.locator('#beat-title').innerText(),/误投证物/);
  assert.equal(await page.locator('#story-action').isEnabled(),true);
  await context.close();

  const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const phone=await mobile.newPage();
  phone.on('pageerror',e=>errors.push('MOBILE: '+e.message));
  await phone.goto(src,{waitUntil:'domcontentloaded'});
  await phone.waitForFunction(()=>document.getElementById('renderStatus')?.textContent?.includes('WEBGL / ACTIVE'),null,{timeout:30000});
  await phone.locator('#story-action').click();
  assert.match(await phone.locator('#beat-title').innerText(),/箱内调查/);
  assert.equal(await phone.locator('#beat-rail .beat').count(),6);
  await phone.screenshot({path:'mg17-v2-mobile.png',fullPage:true});
  if(errors.length)throw new Error('Browser errors: '+errors.join('\n'));
  console.log('PASS: Desktop+Mobile actual WebGL rendered, 3 evidence locks, 6 authored beats, reset, wireframe and JSON export.');
  console.log('NOT hardware QA: no real hand occlusion, controller, Quest MR, physical suitcase anchoring or audio onset measured.');
  await mobile.close();
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack||String(err));process.exitCode=1});
