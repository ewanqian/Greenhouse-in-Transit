// Headless, real-browser smoke tests. Desktop + mobile. No headset certification.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const errors=[],base='http://127.0.0.1:8765/xr/branch-atlas/index.html';
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('#runtime-state').waitFor();
  assert.match(await page.locator('#runtime-state').innerText(),/9 × 9/);
  assert.equal(await page.locator('#routes button').count(),9);
  assert.equal(await page.locator('#choices button').count(),9);
  assert.equal(await page.locator('#open').isEnabled(),true);
  await page.locator('#open').click();
  assert.equal(await page.locator('#enter').isEnabled(),true);
  await page.locator('#enter').click();
  assert.match(await page.locator('#stage-state').innerText(),/INSIDE/);
  await page.locator('#routes button[data-route="botany"]').click();
  assert.match(await page.locator('#route-title').innerText(),/植物记忆/);
  await page.locator('#choices button[data-node="3"]').click();
  assert.match(await page.locator('#selected-title').innerText(),/样本袋/);
  const p=Number((await page.locator('#p-val').innerText()).replace('%',''));
  assert.ok(p>12);
  await page.locator('#permeability').evaluate(el=>{
   el.value='82';el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await page.locator('#p-val').innerText(),'82%');
  await page.locator('[data-layer="SECTION"]').click();
  await page.locator('[data-layer="MEMORY"]').click();
  const event=page.waitForEvent('download');
  await page.locator('#export').click();
  const dl=await event;assert.match(dl.suggestedFilename(),/MG17-branch-atlas/);
  await page.screenshot({path:'branch-atlas-desktop.png'});
  await page.locator('#reset').click();
  assert.match(await page.locator('#stage-state').innerText(),/SEALED/);
  await context.close();
  const mobile=await browser.newContext({
   viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true
  });
  const phone=await mobile.newPage();
  phone.on('pageerror',e=>errors.push(e.message));
  await phone.goto(base,{waitUntil:'networkidle'});
  assert.equal(await phone.locator('#routes button').count(),9);
  await phone.locator('#open').click();
  await phone.locator('#routes button[data-route="habitation"]').click();
  await phone.locator('#choices button[data-node="8"]').click();
  assert.match(await phone.locator('#selected-title').innerText(),/回到入口/);
  await phone.screenshot({path:'branch-atlas-mobile.png',fullPage:true});
  if(errors.length)throw new Error('Browser page errors:\n'+errors.join('\n'));
  console.log('PASS: desktop+mobile, route selection, open/enter, variables, layer toggles, export and reset.');
  console.log('Canvas wireframe is rendered in a browser, not a physical XR headset test.');
  await mobile.close();
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||String(e));process.exit(1)});
