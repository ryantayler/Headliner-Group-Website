// Renders five demo reports to one static page. Every word of every report comes
// out of the real engine, so the reasoning on the page is the reasoning that ships.
global.window = {};
require('/home/user/Headliner-Group-Website/diagnostic/content.js');
global.DIAG = window.DIAG;
require('/home/user/Headliner-Group-Website/diagnostic/engine.js');
const fs = require('fs');
const { DEMOS, build } = require('./demos.js');
const D = DIAG, E = window.DiagEngine;

const article = n => /^[aeiou]/i.test(n) ? 'an' : 'a';
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const para = t => String(t).split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');

function report(r) {
  let h = '', n = 0;
  const label = t => `<h3 class="display d3 sec__h">${esc(t)}</h3>`; void n;
  const title = `${esc(r.primary.title.before)}<em>${esc(r.primary.title.phrase)}</em>${esc(r.primary.title.after)}`;

  h += `<div class="rep__head"><p class="eyebrow">Your diagnosis</p>
        <h2 class="display d2">${title}</h2></div>`;
  h += `<div class="sec">${para(r.opening)}
        <p class="privacy">We do not use <u>any</u> AI in this tool, and <u>none</u> of your data is sent or stored offsite.</p></div>`;
  h += `<div class="sec">
        <div class="verdict"><div class="glow"></div>
        <h4 class="display d3">${title}</h4>${para(r.primary.body)}</div></div>`;
  h += `<div class="sec">${label('How to fix it')}<p>${esc(r.primary.fix.lead)}</p>
        <ol class="acts">${r.primary.fix.actions.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div>`;
  h += `<div class="sec">${label('Your risks, and what to do about them')}<p>${esc(r.risk.lead)}</p>` +
       r.risk.flags.map(f => `<div class="risk">
         <div class="risk__head"><div class="glow"></div><span>You have ${article(f.name)}</span><h4 class="display d3">${esc(f.name)}</h4><span>risk</span></div>
         <div class="risk__body"><p>${esc(f.body)}</p>
         <ol class="acts acts--risk">${f.fix.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div></div>`).join('') + '</div>';
  if (r.dontDo) h += `<div class="sec sec--dont"><h3 class="display d2 dont__h">Don’t do this yet</h3>
        <p>${esc(r.dontDo.lead)}</p>
        <ol class="acts dont">${r.dontDo.items.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div>`;
  h += `<div class="sec">${para(r.closing.text)}
        <div class="sign"><span class="wordmark">HEADLINER <span>Group</span></span></div></div>`;
  return h;
}

function working(r) {
  const rows = D.chain.map(c => {
    const s = r.debug.scores[c], me = c === r.primary.id;
    const dq = r.debug.disqualified[c];
    return `<tr${me ? ' class="is-it"' : ''}><td>${esc(D.constraints[c].short)}</td>
      <td class="num">${dq ? '&mdash;' : s.score}</td>
      <td>${me ? 'called' : dq ? 'ruled out by ' + dq : s.score >= D.thresholds.PRIMARY_FAIL ? 'over the bar, but downstream' : ''}</td></tr>`;
  }).join('');
  return `<details class="why"><summary>Why this one fired</summary><div class="why__in">
    <p class="why__lede">Checked in chain order. The first one to fail is called, never the highest score.</p>
    <table class="scores"><thead><tr><th>Constraint</th><th class="num">Score</th><th></th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="why__lede">Bar is ${D.thresholds.PRIMARY_FAIL}. Suppressed by the finding above: ${esc(r.debug.suppressed.join(', ') || 'nothing')}.
    Risks are listed loudest first across all three families, capped at ${D.thresholds.MAX_FLAGS_SHOWN}.</p>
    </div></details>`;
}

let css = fs.readFileSync('/home/user/Headliner-Group-Website/diagnostic/diagnostic.css','utf8')
  .replace('@import url("../assets/fonts/fonts.css");\n','')
  .replace('.sign img{width:132px;height:auto;filter:brightness(0) invert(1);opacity:.9}',
           '.sign svg{display:none}')
  .replace('.sign img{filter:none;opacity:1}','.sign svg{color:#1A1A1A;opacity:1}');

const EXTRA = `
/* ---- demo page only ---- */
.hero{padding:clamp(40px,6vw,72px) 0 0}
.hero .lede{margin-top:20px;max-width:60ch}
.tabs{position:sticky;top:0;z-index:30;background:var(--base);border-bottom:1px solid var(--rim);
  margin-top:34px;padding:12px 0 0}
.tabs__row{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding-bottom:1px}
.tabs__row::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;font:inherit;font-size:13.5px;font-weight:500;cursor:pointer;
  background:none;border:0;border-bottom:2px solid transparent;color:var(--mute);
  padding:11px 15px 12px;white-space:nowrap;transition:color .18s var(--ease),border-color .18s var(--ease)}
.tab:hover{color:var(--ink)}
.tab[aria-selected="true"]{color:var(--accent);border-bottom-color:var(--accent)}
.tab:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.tab b{display:block;font-weight:600;font-size:14px;color:inherit}
.tab span{display:block;font-size:11px;letter-spacing:.11em;text-transform:uppercase;opacity:.72;margin-top:2px}
.panel{display:none;padding-top:8px}
.panel.is-on{display:block}
.biz{border:1px solid var(--rim);border-radius:18px;background:var(--panel);
  padding:clamp(22px,3vw,32px);margin:34px 0 8px}
.biz h2{margin:0 0 4px}
.biz__meta{font-size:12px;letter-spacing:.11em;text-transform:uppercase;color:var(--accent);margin:0 0 14px}
.biz p{margin:0;color:var(--ink)}
.biz__facts{display:flex;flex-wrap:wrap;gap:0 26px;margin:16px 0 0;padding-top:16px;border-top:1px solid var(--hair)}
.biz__facts div{font-size:13px;color:var(--mute);padding:3px 0}
.biz__facts b{color:var(--ink);font-weight:500}
.why{margin:34px 0 0;border:1px solid var(--rim);border-radius:14px;background:var(--panel);overflow:hidden}
.why__in{padding:0 18px 18px}
.why__lede{font-size:13px;color:var(--mute);margin:0 0 14px;max-width:none}
.scores{border-collapse:collapse;width:100%;max-width:460px;margin:0 0 16px;font-size:13px}
.scores th{text-align:left;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--mute);font-weight:600;padding:0 12px 7px 0;border-bottom:1px solid var(--hair)}
.scores td{padding:7px 12px 7px 0;border-bottom:1px solid var(--hair);color:var(--mute)}
.scores .num{text-align:right;font-variant-numeric:tabular-nums;padding-right:18px}
.scores tr.is-it td{color:var(--accent);font-weight:600}
.note{font-size:13.5px;color:var(--mute);max-width:66ch}
@media print{ .tabs,.why{display:none!important} .panel{display:block!important;break-before:page} .panel:first-of-type{break-before:auto} }
`;

const reports = DEMOS.map(d => ({ d, r: E.diagnose(build(d)) }));
const page = `<title>Five Demo Diagnostics</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}${EXTRA}</style>

<header class="shell hero">
  <p class="eyebrow">Sample output, five made up businesses</p>
  <h1 class="display d1">Five Demo<br>Diagnostics</h1>
  <p class="lede">Five businesses that don't exist, each filled out end to end, each run through the live engine. Nothing on this page is written by hand. Every finding, every risk and every line of prose came out of the answers above it, the same way it will for a real one.</p>
  <p class="hand" style="margin-top:22px">Five different constraints, so you can see how the shape of the report changes.</p>
</header>

<nav class="tabs"><div class="shell"><div class="tabs__row" role="tablist">
${reports.map(({d,r},i) => `<button class="tab" role="tab" id="t-${d.id}" aria-controls="p-${d.id}" aria-selected="${i===0}">
  <b>${esc(d.name)}</b><span>${esc(D.constraints[r.primary.id].short)}</span></button>`).join('\n')}
</div></div></nav>

<main class="shell">
${reports.map(({d,r},i) => `<section class="panel${i===0?' is-on':''}" id="p-${d.id}" role="tabpanel" aria-labelledby="t-${d.id}">
  <div class="biz">
    <p class="biz__meta">${esc(d.trade)}</p>
    <h2 class="display d3">${esc(d.name)}</h2>
    <p>${esc(d.story)}</p>
    <div class="biz__facts">
      <div><b>${esc(d.where)}</b></div><div><b>${esc(d.size)}</b></div><div><b>${esc(d.years)}</b></div>
      <div>Answered <b>${Object.keys(d.a).length} of ${D.questions.length}</b></div>
    </div>
  </div>
  ${report(r)}
  ${working(r)}
</section>`).join('\n')}
  <p class="note" style="margin:48px 0 0;padding-top:28px;border-top:1px solid var(--rim)">
    These five are fabricated to show the range. The businesses aren't real, the answers were written to land on five different constraints, and everything after that is the engine's.</p>
</main>
<footer class="shell" style="padding:40px 0 80px"></footer>

<script>
(function(){
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  function show(i){
    tabs.forEach(function(t,n){
      t.setAttribute('aria-selected', n===i);
      document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-on', n===i);
    });
    window.scrollTo(0,0);
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click', function(){ show(i); });
    t.addEventListener('keydown', function(e){
      var d = e.key==='ArrowRight' ? 1 : e.key==='ArrowLeft' ? -1 : 0;
      if(!d) return;
      e.preventDefault();
      var n = (i+d+tabs.length)%tabs.length;
      tabs[n].focus(); show(n);
    });
  });
})();
</script>
`;
fs.writeFileSync('five-demos.html', page);
console.log('wrote five-demos.html,', page.length, 'bytes');
reports.forEach(({d,r}) => console.log(`  ${d.name.padEnd(16)} ${r.primary.id.padEnd(11)} minor:${(r.minor?r.minor.id:'-').padEnd(8)} ${r.primary.fix.actions.length} actions  risks: ${r.risk.flags.map(f=>f.name).join(', ')}`));
