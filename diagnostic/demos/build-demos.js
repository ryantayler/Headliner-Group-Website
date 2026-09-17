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
  const label = t => `<h3 class="hl-face d3 sec__h">${esc(t)}</h3>`; void n;
  const title = `${esc(r.primary.title.before)}<em>${esc(r.primary.title.phrase)}</em>${esc(r.primary.title.after)}`;

  h += `<div class="rep__lead"><p class="eyebrow">Your diagnosis</p>${para(r.opening)}
        <p class="privacy">We do not use <u>any</u> AI in this tool, and <u>none</u> of your data is sent or stored offsite.</p></div>`;
  h += `<div class="sec" style="padding-top:0">
        <div class="verdict"><div class="glow"></div>
        <h2 class="hl-face display">${title}</h2>
        <p class="due">${esc(r.primary.due)}</p>${para(r.primary.body)}</div></div>`;
  h += `<div class="sec">${label('How to fix it')}
        ${r.primary.prompts.map(t => `<p class="prompt">${esc(t)}</p>`).join('')}
        <ol class="acts">${r.primary.fix.actions.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div>`;
  h += `<div class="sec">${label('Your risks, and what to do about them')}<p>${esc(r.risk.lead)}</p>` +
       r.risk.flags.map(f => `<div class="risk">
         <div class="risk__head"><div class="glow"></div><span>You have ${article(f.name)}</span><h4 class="hl-face d3">${esc(f.name)}</h4><span>risk</span></div>
         <div class="risk__body"><p>${esc(f.body)}</p>
         <ol class="acts acts--risk">${f.fix.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div></div>`).join('') + '</div>';
  if (r.dontDo) h += `<div class="sec sec--dont"><h3 class="hl-face d2 dont__h">Don’t do this yet</h3>
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
.hero{padding:clamp(40px,6vw,72px) 0 clamp(24px,4vw,40px);background:var(--base);color:var(--ink)}
.hero .lede{margin-top:20px;max-width:60ch}
.tabs{position:sticky;top:0;z-index:30;background:var(--base);border-bottom:1px solid var(--rim);padding:12px 0 0}
.tabs__row{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding-bottom:1px}
.tabs__row::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;font:inherit;font-size:13.5px;font-weight:500;cursor:pointer;
  background:none;border:0;border-bottom:2px solid transparent;color:var(--tx-mute);
  padding:11px 15px 12px;white-space:nowrap;transition:color .18s var(--ease),border-color .18s var(--ease)}
.tab:hover{color:var(--ink)}
.tab[aria-selected="true"]{color:var(--accent);border-bottom-color:var(--accent)}
.tab b{color:inherit}
.tab:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.tab b{display:block;font-weight:600;font-size:14px;color:inherit}
.tab span{display:block;font-size:11px;letter-spacing:.11em;text-transform:uppercase;opacity:.72;margin-top:2px}
.panel{display:none;padding-top:8px}
.panel.is-on{display:block}
.biz{border:1px solid var(--line);border-radius:18px;background:var(--surface);
  padding:clamp(22px,3vw,32px);margin:34px 0 8px}
.biz h2{margin:0 0 4px}
.biz__meta{font-size:12px;letter-spacing:.11em;text-transform:uppercase;color:var(--tx-accent);margin:0 0 14px}
.biz p{margin:0;color:var(--tx)}
.biz__facts{display:flex;flex-wrap:wrap;gap:0 26px;margin:16px 0 0;padding-top:16px;border-top:1px solid var(--line)}
.biz__facts div{font-size:13px;color:var(--tx-mute);padding:3px 0}
.biz__facts b{color:var(--tx);font-weight:500}
.why{margin:34px 0 0;border:1px solid var(--line);border-radius:14px;background:var(--surface);overflow:hidden}
.why__in{padding:0 18px 18px}
.why__lede{font-size:13px;color:var(--tx-mute);margin:0 0 14px;max-width:none}
.scores{border-collapse:collapse;width:100%;max-width:460px;margin:0 0 16px;font-size:13px}
.scores th{text-align:left;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--tx-mute);font-weight:600;padding:0 12px 7px 0;border-bottom:1px solid var(--line)}
.scores td{padding:7px 12px 7px 0;border-bottom:1px solid var(--line);color:var(--tx-mute)}
.scores .num{text-align:right;font-variant-numeric:tabular-nums;padding-right:18px}
.scores tr.is-it td{color:var(--tx-accent);font-weight:600}
.note{font-size:13.5px;color:var(--tx-mute);max-width:66ch}
@media print{ .tabs,.why,.hdr,.ftr,.hero{display:none!important} .panel{display:block!important;break-before:page} .panel:first-of-type{break-before:auto} }

/* ---- the map panel, internal reference only ---- */
/* the reading column is 820. The map needs the width, so it breaks out of it. */
.map{width:min(1180px,calc(100vw - 2*var(--gutter)));margin-left:50%;transform:translateX(-50%)}
.map__grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:8px}
@media(max-width:860px){.map__grid{grid-template-columns:1fr}}
.mcard{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:clamp(26px,3vw,40px) clamp(24px,2.6vw,36px) clamp(22px,2.4vw,32px);position:relative;overflow:hidden}
.mcard::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:var(--accent-deep)}
.mcard__k{font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--tx-accent);margin:0 0 10px}
.mcard h3{margin:0 0 14px;text-transform:uppercase}
.mcard__test{margin:0 0 24px;padding:18px 20px;background:var(--ground);border-radius:12px;
  font-size:16px;line-height:1.55;color:var(--tx-sub)}
.mcard__test b{color:var(--tx);font-weight:600}
.mrow{display:flex;gap:18px;padding:16px 0;border-top:1px solid var(--line)}
.mrow__n{flex:0 0 118px;font-weight:700;font-size:16px;color:var(--tx)}
.mrow__d{font-size:15.5px;line-height:1.55;color:var(--tx-sub);margin:0}
.mrow--flag .mrow__n::after{content:"?";display:inline-block;margin-left:5px;color:var(--cta-deep);font-weight:700}
.mout{margin-top:24px;background:var(--paper-2);border:1px dashed var(--line);border-radius:16px;padding:clamp(24px,2.6vw,36px)}
.mout h3{margin:0 0 10px;text-transform:uppercase}
.mout p{margin:0 0 12px;font-size:16px;line-height:1.6;color:var(--tx-sub);max-width:74ch}
.mout p:last-child{margin-bottom:0}
.mnote{margin-top:22px;font-size:13.5px;line-height:1.6;color:var(--tx-mute);max-width:74ch}
.mnote b{color:var(--tx-sub)}
.mexp{margin-top:44px;padding-top:30px;border-top:1px solid var(--line)}
.mexp__grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px}
@media(max-width:860px){.mexp__grid{grid-template-columns:1fr}}
.exp{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:20px 22px}
.exp__h{display:flex;align-items:baseline;gap:10px;margin:0 0 6px}
.exp__h h4{margin:0;font-size:17px;font-weight:700;color:var(--tx)}
.exp__g{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  color:var(--tx-accent);border:1px solid var(--line);border-radius:99px;padding:3px 8px}
.exp__d{margin:0 0 14px;font-size:14.5px;line-height:1.55;color:var(--tx-sub)}
.exp__k{margin:0 0 8px;font-size:10.5px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--tx-mute)}
.qa{margin:0;padding:10px 0 0;border-top:1px solid var(--line)}
.qa dt{font-size:13.5px;line-height:1.45;color:var(--tx-mute);margin:0}
.qa dd{margin:3px 0 12px;font-size:14.5px;line-height:1.45;font-weight:600;color:var(--tx)}
.qa dd::before{content:"→ ";color:var(--tx-accent);font-weight:700}
.qa dd:last-child{margin-bottom:2px}

`;


const SUPPLY = [
  ['Talent',     'A missing layer, not missing hands. The work routes through the owner because nobody owns a part of it.'],
  ['Fulfilment', 'Capacity, not capability. They know how to do the work, they just can’t do enough of it.'],
  ['Margin',     'Full, and still not making money. Only binds once the calendar is full, which is why it sits here.'],
];
const DEMAND = [
  ['Demand',     'Not enough people asking. The calendar has room and nothing is filling it.'],
  ['Offer',      'They ask, and they don’t buy. Enquiries arrive and stall at the quote.'],
  ['Value',      'They buy once, then shrink or leave. Capacity keeps opening back up.'],
];
const mrow = ([n, d], flag) => `<div class="mrow${flag?' mrow--flag':''}">
  <div class="mrow__n">${esc(n)}</div><p class="mrow__d">${esc(d)}</p></div>`;


// The example answers are generated off the real content, never written by hand, so this
// page can't drift from what the engine actually scores. Top weighted questions in each
// block, each shown with the option that scores worst.
const GROUP = { talent:'Supply', fulfilment:'Supply', margin:'Supply',
                demand:'Demand', offer:'Demand', value:'Demand' };
const BLURB = {
  talent:    'A missing layer. The work routes through the owner because nobody else owns a part of it.',
  fulfilment:'Capacity, not capability. They know how to do the work and can’t do enough of it.',
  margin:    'Busy, full, and nothing left at the end of it.',
  demand:    'The calendar has room and not enough people are asking.',
  offer:     'Enquiries arrive and stall at the quote.',
  value:     'Customers buy once, then shrink or leave, so capacity keeps opening back up.',
};
const ORDER = ['talent','fulfilment','margin','value','offer','demand'];

function examples(cid, n) {
  return D.questions
    .filter(q => q.section === cid && q.weight > 0)
    .map(q => ({ q, worst: (q.options||[]).filter(o => typeof o.w === 'number')
                                          .sort((a,b) => b.w - a.w)[0] }))
    .filter(x => x.worst && x.worst.w >= 80)
    .sort((a,b) => b.q.weight - a.q.weight)
    .slice(0, n);
}

const EXPLAIN = `<section class="mexp">
  <h3 class="hl-face d3" style="margin:0 0 8px">What counts towards each one</h3>
  <p style="max-width:70ch;margin:0;color:var(--tx-sub)">The heaviest questions in each block, with the answer that scores worst. Pulled straight out of the content file, so this list moves when the questions do.</p>
  <div class="mexp__grid">
  ${ORDER.map(cid => `<div class="exp">
    <div class="exp__h"><h4>${esc(D.constraints[cid].short)}</h4><span class="exp__g">${GROUP[cid]}</span></div>
    <p class="exp__d">${esc(BLURB[cid])}</p>
    <p class="exp__k">Answers that count towards it</p>
    <dl class="qa">${examples(cid, 3).map(x =>
      `<dt>${esc(x.q.text)}</dt><dd>${esc(x.worst.text)}</dd>`).join('')}</dl>
  </div>`).join('')}
  </div>
</section>`;

const MAP = `<section class="panel" id="p-map" role="tabpanel" aria-labelledby="t-map">
<div class="map">
  <p class="eyebrow">Internal reference, not part of the tool</p>
  <h2 class="hl-face d1" style="margin:0 0 12px">Supply and demand map</h2>
  <p style="max-width:64ch;margin:0 0 26px">Where the seven constraints sit if you split them by the one question. The engine doesn’t use this split. It’s here so the shape is visible.</p>

  <div class="map__grid">
    <div class="mcard">
      <p class="mcard__k">Group one</p>
      <h3 class="hl-face d2">Supply constrained</h3>
      <p class="mcard__test">Double the clients tomorrow and <b>it wouldn’t help you</b>. Either you can’t deliver them, or delivering them doesn’t pay.</p>
      ${SUPPLY.map((r,i) => mrow(r, i===2)).join('')}
    </div>
    <div class="mcard">
      <p class="mcard__k">Group two</p>
      <h3 class="hl-face d2">Demand constrained</h3>
      <p class="mcard__test">Double the clients tomorrow and <b>you could handle it</b>. The capacity is there and filling it is what caps you.</p>
      ${DEMAND.map(r => mrow(r)).join('')}
    </div>
  </div>

  <div class="mout">
    <h3 class="hl-face d3">Not a constraint any more</h3>
    <p><b>Cash flow is a risk.</b> It isn’t a supply problem or a demand problem, and forcing it into either card made the verdict read as two facts instead of one cause. It keeps its questions, its scoring and all seven of its actions, and it pins to the top of the risk list whenever it fires.</p>
  </div>

  <p class="mnote"><b>The major is decided before anything is scored.</b> q34 asks it. “If twice as many enquiries landed next month, could you deliver the work?” q16, q17 and q18 carry it when q34 isn’t decisive, and a tie breaks to supply.</p>
  <p class="mnote"><b>Then highest score wins inside that family.</b> Not position. Anything inside five points falls back to the order above, so a near tie isn’t decided by noise. The three on the other side are unreachable, which is what stops the report telling an owner with an empty diary to go and hire.</p>

  <details class="why" style="margin-top:26px"><summary>How often each one actually gets called</summary><div class="why__in">
    <p class="why__lede">20,000 answer sets, every question answered at random, after the four option rebuild.</p>
    <table class="scores"><thead><tr><th>Constraint</th><th class="num">Mean</th><th class="num">Fails</th><th class="num">Called</th></tr></thead><tbody>
      <tr><td>Fulfilment</td><td class="num">50.1</td><td class="num">29.7%</td><td class="num">25.8%</td></tr>
      <tr><td>Value</td><td class="num">50.0</td><td class="num">28.4%</td><td class="num">18.3%</td></tr>
      <tr><td>Talent</td><td class="num">48.2</td><td class="num">20.0%</td><td class="num">17.2%</td></tr>
      <tr><td>Margin</td><td class="num">50.0</td><td class="num">29.3%</td><td class="num">14.3%</td></tr>
      <tr><td>Demand</td><td class="num">50.4</td><td class="num">31.0%</td><td class="num">12.7%</td></tr>
      <tr><td>Offer</td><td class="num">50.0</td><td class="num">29.8%</td><td class="num">11.7%</td></tr>
    </tbody></table>
    <p class="why__lede">Supply comes out 57.3% and demand 42.7%, the lean coming from ties breaking to supply. Means sit between 48.2 and 50.4, which is what four options at 0, 33, 67 and 100 buys you. Talent still runs about two points cold because its two multi selects don’t distribute like a single select does.</p>
  </div></details>
  ${EXPLAIN}
</div>
</section>`;

const reports = DEMOS.map(d => ({ d, r: E.diagnose(build(d)) }));
const LOGO = `<a class="hl-link" href="https://headlinergroup.com.au" aria-label="Headliner Group, home"><div class="hl-stage"><div class="hl-logo"><div class="hl-beam"></div><span class="hl-word">Headliner</span><div class="hl-group">Group</div></div></div></a>`;
const page = `<title>Five Demo Diagnostics</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}${EXTRA}</style>

<header class="hdr"><div class="shell hdr__in">${LOGO}<p class="hdr__tag">Business Diagnostic</p></div></header>

<section class="hero"><div class="shell">
  <p class="eyebrow">Sample output, five made up businesses</p>
  <h1 class="display d1">Five Demo<br>Diagnostics</h1>
  <p class="lede">Five businesses that don't exist, each filled out end to end, each run through the live engine. Nothing on this page is written by hand. Every finding, every risk and every line of prose came out of the answers above it, the same way it will for a real one.</p>
  <p class="hand" style="margin-top:22px">Five different constraints, so you can see how the shape of the report changes.</p>
</div></section>

<nav class="tabs"><div class="shell"><div class="tabs__row" role="tablist">
${reports.map(({d,r},i) => `<button class="tab" role="tab" id="t-${d.id}" aria-controls="p-${d.id}" aria-selected="${i===0}">
  <b>${esc(d.name)}</b><span>${esc(D.constraints[r.primary.id].short)}</span></button>`).join('\n')}
<button class="tab" role="tab" id="t-map" aria-controls="p-map" aria-selected="false"><b>The map</b><span>Reference</span></button>
</div></div></nav>

<main class="on-light"><div class="shell">
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
${MAP}
  <p class="note" style="margin:48px 0 0;padding-top:28px;border-top:1px solid var(--rim)">
    These five are fabricated to show the range. The businesses aren't real, the answers were written to land on five different constraints, and everything after that is the engine's.</p>
</div></main>
<footer class="ftr"><div class="shell">${LOGO}<p>Helping founders in live events &amp; production grow through partnerships.</p></div></footer>

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
