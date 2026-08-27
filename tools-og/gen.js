const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CARDS = [
  ['index',        'Helping founders grow through partnerships', 'headlinergroup.com.au', false],
  ['partnerships', 'What happens when we partner',               'Partnerships',          false],
  ['free',         'Free sh!t we actually use',                  'Templates, checklists and calculators', false],
  ['contact',      'Tell me what you’ve built',             'Contact',               false],
  ['ryan',         'Live events and production', 'Entrepreneur and investor', true],
];
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
for(const [slug,title,foot,ryan] of CARDS){
  await p.goto('file://'+__dirname+'/card.html');
  await p.evaluate(([t,f,r])=>{
    if(!r) document.querySelector('.r').remove();
    document.getElementById('t').textContent=t;
    document.getElementById('f').textContent=f;
    if(r) document.body.classList.add('ryan');
  },[title,foot,ryan]);
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({path:`/home/user/Headliner-Group-Website/assets/img/og-${slug}.png`});
  console.log('og-'+slug+'.png');
}
await b.close();})();
