import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('qa-results',{recursive:true});
const browser=await chromium.launch();
try {
 for(const width of [320,360,375,390,430,768,1024,1280,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  for(const path of ['/','/comecar/','/privacidade.html']){
   await page.goto('http://127.0.0.1:8765'+path);
   assert.equal(await page.locator('h1').count(),1);
   const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(geometry.scroll<=geometry.viewport+1,`${path} ${width}: overflow ${JSON.stringify(geometry)}`);
   if(path==='/'){
    await page.getByRole('radio',{name:/Anual/}).check();
    assert.match(await page.locator('[data-price="Start"]').innerText(),/674,91/);
    await page.getByRole('radio',{name:'Mensal',exact:true}).check();
    assert.match(await page.locator('[data-price="Start"]').innerText(),/749,90/);
   }
   await page.screenshot({path:`qa-results/${path==='/'?'home':path.includes('comecar')?'form':'privacy'}-${width}.png`,fullPage:true});
  }
  assert.deepEqual(errors,[]);await page.close();console.log(`${width}px: 3 páginas, overflow e preço mensal/anual OK`);
 }
}finally{await browser.close()}
