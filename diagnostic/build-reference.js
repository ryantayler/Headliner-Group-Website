/* Every finding the tool can produce, generated from content.js so the reference
   cannot drift from the thing it documents. Rerun after any content change. */
global.window = {};
require('./content.js');
const D = window.DIAG;
const fs = require('fs');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const T = D.thresholds.FLAG_PRINT;
const byId = id => D.questions.find(q => q.id === id);

// a slot shows as the question it reads, so the templated bits are visible
const slots = t => esc(t).replace(/\{(q\d+)\.(band|exact)\}/g,
  (m, q) => `<b class="slot">answer to Q${byId(q) ? byId(q).n : q}</b>`)
  .replace(/\{d\.\w+\}/g, '<b class="slot">from their answers</b>');

// what actually raises each risk, and whether that alone is enough to print it
const fires = {};
for (const q of D.questions) for (const o of q.options) for (const f of (o.flags || [])) {
  const id = typeof f === 'string' ? f : f.id, sev = typeof f === 'string' ? 75 : f.sev;
  (fires[id] = fires[id] || []).push({ n: q.n, opt: o.text, sev,
    cond: (f.when || []).map(p => 'only when Q' + byId(p[0]).n + ' is ' + p[1].join(' or ')).join('') });
}
for (const q of D.questions) if (q.optionsFrom) for (const o of q.options) if (o.boost)
  (fires[o.boost] = fires[o.boost] || []).push({ n: q.n, opt: 'named as the one that would hurt most', sev: 100, cond: '' });

const WHY = {
  cashflow:"First, because nothing else can be actioned without money to fund it.",
  talent:"Above fulfilment, because capacity added under a missing layer just loads the layer.",
  fulfilment:"Above demand, because adding demand to a business that can't deliver accelerates the damage.",
  value:"Above offer, because winning more customers into a leaky bucket wastes the win.",
  offer:"Above demand, because more enquiries against an offer that doesn't land changes nothing.",
  demand:"Second last. Real, but only once everything above it can absorb the work.",
  margin:"Last, because it is usually a symptom of something above it rather than a constraint of its own."
};

const constraints = D.chain.map((c, i) => {
  const cd = D.blocks.constraintDef[c], f = D.blocks.constraintFix[c], dd = D.blocks.dontDoYet[c];
  const opens = (Array.isArray(cd.open) ? cd.open : [cd.open]).join(' ');
  const qs = D.questions.filter(q => q.section === c);
  const always = f.actions.filter(a => !a.when).length, cond = f.actions.length - always;
  return `<article class="item">
    <div class="item__h"><span class="num">${i + 1}</span>
      <h3 class="display d3">You are <em>${esc(D.constraints[c].phrase)}</em> constrained</h3></div>
    <p class="def">${slots(opens)}</p>
    <p class="def">${slots(cd.close)}</p>
    <dl class="meta">
      <div><dt>Why it sits here</dt><dd>${esc(WHY[c])}</dd></div>
      <div><dt>The fix opens with</dt><dd>${esc(f.lead)}</dd></div>
      <div><dt>Actions</dt><dd>${always} always, ${cond} that only print when an answer makes them true, capped at ${D.thresholds.MAX_ACTIONS}</dd></div>
      <div><dt>Don${String.fromCharCode(8217)}t do this yet</dt><dd>${esc(dd.lead)} ${dd.items.length} items.</dd></div>
      <div><dt>Fed by</dt><dd>${qs.length} questions, Q${qs[0].n} to Q${qs[qs.length - 1].n}</dd></div>
    </dl></article>`;
}).join('');

const riskCard = (id, m) => {
  const rd = D.blocks.riskDef[id];
  const list = (fires[id] || []).sort((a, b) => b.sev - a.sev);
  const prints = list.filter(x => x.sev >= T), quiet = list.filter(x => x.sev < T);
  return `<article class="item">
    <div class="item__h"><h3 class="display d3">You have ${/^[aeiou]/i.test(m.name) ? 'an' : 'a'} <em>${esc(m.name)}</em> risk</h3>
      <span class="tag">${esc(m.group)}</span></div>
    <p class="def">${slots(rd.banded || rd.text)}</p>
    ${rd.alt ? `<p class="def def--alt"><b>If they answered Not sure.</b> ${esc(rd.alt)}</p>` : ''}
    <p class="lbl">Prints when they answer</p>
    <ul class="fires">${prints.map(x => `<li><b>${x.sev}</b> Q${x.n} &ldquo;${esc(x.opt)}&rdquo;${x.cond ? ` <i>${esc(x.cond)}</i>` : ''}</li>`).join('')}</ul>
    ${quiet.length ? `<p class="lbl">Adds weight but never prints on its own</p>
      <ul class="fires fires--quiet">${quiet.map(x => `<li><b>${x.sev}</b> Q${x.n} &ldquo;${esc(x.opt)}&rdquo;</li>`).join('')}</ul>` : ''}
    <p class="lbl">What to do</p>
    <ol class="acts">${(D.blocks.riskFix[id] || []).map(a => `<li>${esc(a)}</li>`).join('')}</ol>
  </article>`;
};
const group = g => Object.entries(D.flags).filter(([, m]) => m.group === g).map(([id, m]) => riskCard(id, m)).join('');

const LOGO = '<a class="hl-link" href="https://headlinergroup.com.au" aria-label="Headliner Group, home"><div class="hl-stage"><div class="hl-logo"><div class="hl-beam"></div><span class="hl-word">Headliner</span><div class="hl-group">Group</div></div></div></a>';
const css = fs.readFileSync('./diagnostic.css', 'utf8').replace('@import url("../assets/fonts/fonts.css");\n', '');

fs.writeFileSync('reference.html', `<title>Findings Reference</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}
.hero{padding:clamp(40px,6vw,72px) 0 clamp(28px,4vw,44px);background:var(--base);color:var(--ink)}
.wrap{padding:clamp(40px,6vw,64px) 0 80px}
.grp{margin-top:clamp(44px,6vw,64px)}
.grp:first-child{margin-top:0}
.grp__h{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;padding-bottom:12px;border-bottom:1px solid var(--line)}
.grp__h .count{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx-mute)}
.item{padding:26px 0;border-bottom:1px solid var(--line)}
.item__h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.item__h em{font-style:normal;color:var(--tx-accent)}
.num{font-weight:700;font-size:13px;color:var(--tx-accent);font-variant-numeric:tabular-nums}
.tag{font-size:10.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;padding:3px 10px;border-radius:100px;border:1px solid var(--line);color:var(--tx-mute)}
.def{font-size:16px;color:var(--tx);max-width:70ch;margin:0 0 12px}
.def--alt{color:var(--tx-mute);font-size:15px}
.def--alt b{color:var(--tx)}
.slot{font-weight:600;color:var(--tx-accent);background:rgba(45,226,195,.14);padding:1px 6px;border-radius:5px}
.lbl{font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--tx-mute);margin:18px 0 8px}
.fires{list-style:none;margin:0;padding:0}
.fires li{font-size:14.5px;color:var(--tx);padding:5px 0;border-top:1px solid var(--line)}
.fires b{display:inline-block;min-width:34px;color:var(--tx-accent);font-variant-numeric:tabular-nums}
.fires i{color:var(--tx-mute);font-style:normal}
.fires--quiet li,.fires--quiet b{color:var(--tx-mute)}
.meta{margin:16px 0 0;display:grid;gap:0}
.meta div{display:grid;grid-template-columns:170px 1fr;gap:16px;padding:9px 0;border-top:1px solid var(--line)}
.meta dt{font-size:11px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--tx-mute)}
.meta dd{margin:0;font-size:15px;color:var(--tx)}
@media (max-width:620px){.meta div{grid-template-columns:1fr;gap:3px}}
</style>

<header class="hdr"><div class="shell hdr__in">${LOGO}<p class="hdr__tag">Findings reference</p></div></header>

<section class="hero"><div class="shell">
  <p class="eyebrow">Business diagnostic</p>
  <h1 class="display d1">Every finding<br>the tool can make</h1>
  <p class="lede" style="margin-top:20px">Seven constraints and twelve risks. Generated from the tool itself, so it cannot go stale against it. The highlighted parts are filled in from their answers.</p>
</div></section>

<main class="on-light"><div class="shell wrap">
  <section class="grp">
    <div class="grp__h"><h2 class="display d2">The seven constraints</h2>
      <span class="count">Checked in this order, first to fail is called</span></div>
    ${constraints}
  </section>
  <section class="grp">
    <div class="grp__h"><h2 class="display d2">The twelve risks</h2>
      <span class="count">Loudest first, top ${D.thresholds.MAX_FLAGS_SHOWN} print, bar is ${T}</span></div>
    <p class="def" style="margin-top:22px">A risk has to fire on an answer that is genuinely unusual, never on the answer most small businesses would give. That is why fragility was removed and why some answers below add weight without ever printing on their own.</p>
    <h3 class="lbl" style="margin-top:26px">One of something that should be several</h3>
    ${group('Concentration')}
    <h3 class="lbl" style="margin-top:34px">The business owns you</h3>
    ${group('Owner')}
  </section>
</div></main>

<footer class="ftr"><div class="shell">${LOGO}
<p>Helping founders in live events &amp; production grow through partnerships.</p></div></footer>
`);
console.log('wrote reference.html');
console.log('  constraints:', D.chain.length, '| risks:', Object.keys(D.flags).length);
