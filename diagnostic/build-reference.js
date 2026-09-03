/* Every constraint and every risk with all of their solutions, generated from
   content.js so it cannot drift. Each line is tagged with whether it is fixed,
   filled in from an answer, or only shown when an answer says so. */
global.window = {};
require('./content.js');
const D = window.DIAG;
const fs = require('fs');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const T = D.thresholds.FLAG_PRINT;
const byId = id => D.questions.find(q => q.id === id);
const qn = id => byId(id) ? 'Q' + byId(id).n : id;

const hasSlot = t => /\{(q\d+)\.(band|exact)\}|\{d\.\w+\}/.test(t);
const slots = t => esc(t)
  .replace(/\{(q\d+)\.band\}/g, (m,q) => `<b class="slot">their ${qn(q)} answer</b>`)
  .replace(/\{(q\d+)\.exact\}/g, (m,q) => `<b class="slot">the figure they typed on ${qn(q)}</b>`)
  .replace(/\{d\.\w+\}/g, '<b class="slot">worked out from their answers</b>');

const TAG = { fixed:'<span class="t t--f">Same for everyone</span>',
              filled:'<span class="t t--s">Their answer dropped in</span>' };
const tagIf = w => `<span class="t t--c">Only if ${w.map(p => qn(p[0]) + ' is ' + p[1].map(o => {
  const q = byId(p[0]); const opt = q.options.find(x => x.id === o);
  return '&ldquo;' + esc(opt ? opt.text : o) + '&rdquo;'; }).join(' or ')).join(', and ')}</span>`;

const line = (text, when) => `<li>${slots(text)}
  ${when ? tagIf(when) : hasSlot(text) ? TAG.filled : TAG.fixed}</li>`;

const constraints = D.chain.map((c, i) => {
  const cd = D.blocks.constraintDef[c], f = D.blocks.constraintFix[c], dd = D.blocks.dontDoYet[c];
  const opens = (Array.isArray(cd.open) ? cd.open : [cd.open]);
  const cond = f.actions.filter(a => a.when).length;
  return `<article class="item">
    <div class="item__h"><span class="num">${i + 1}</span>
      <h3 class="hl-face d3">You are <em>${esc(D.constraints[c].phrase)}</em> constrained</h3></div>

    <p class="lbl">What it says</p>
    <ul class="lines">${opens.map(o => line(o)).join('')}
      ${(cd.evidence || []).map(e => line(e.banded)).join('')}
      ${line(cd.close)}</ul>

    <p class="lbl">How to fix it &nbsp;<i>${f.actions.length} written, ${cond} conditional, at most ${D.thresholds.MAX_ACTIONS} ever print</i></p>
    <p class="sub">${esc(f.lead)}</p>
    <ol class="lines lines--n">${f.actions.map(a => line(a.text, a.when)).join('')}</ol>

    <p class="lbl">Don${String.fromCharCode(8217)}t do this yet</p>
    <p class="sub">${esc(dd.lead)}</p>
    <ol class="lines lines--x">${dd.items.map(x => line(x)).join('')}</ol>
  </article>`;
}).join('');

const fires = {};
for (const q of D.questions) for (const o of q.options) for (const f of (o.flags || [])) {
  const id = typeof f === 'string' ? f : f.id, sev = typeof f === 'string' ? 75 : f.sev;
  (fires[id] = fires[id] || []).push({ n: q.n, opt: o.text, sev,
    cond: (f.when || []).map(p => 'and only when ' + qn(p[0]) + ' is over 30%').join('') });
}
for (const q of D.questions) if (q.optionsFrom) for (const o of q.options) if (o.boost)
  (fires[o.boost] = fires[o.boost] || []).push({ n: q.n, opt: 'named as the one that would hurt most', sev: 100, cond: '' });

const riskCard = (id, m) => {
  const rd = D.blocks.riskDef[id];
  const list = (fires[id] || []).sort((a, b) => b.sev - a.sev);
  const prints = list.filter(x => x.sev >= T), quiet = list.filter(x => x.sev < T);
  return `<article class="item">
    <div class="item__h"><h3 class="hl-face d3">You have ${/^[aeiou]/i.test(m.name) ? 'an' : 'a'} <em>${esc(m.name)}</em> risk</h3></div>
    <p class="lbl">What it says</p>
    <ul class="lines">${line(rd.banded || rd.text)}
      ${(rd.variants || []).map(v => `<li>${slots(v.text)}<span class="t t--c">Only if ${qn(v.when[0][0])} ticks the person who knows how the work gets done</span></li>`).join('')}
      ${rd.alt ? `<li>${esc(rd.alt)}<span class="t t--c">Only if they answered Not sure</span></li>` : ''}</ul>
    <p class="lbl">Prints when they answer</p>
    <ul class="fires">${prints.map(x => `<li><b>${x.sev}</b> Q${x.n} &ldquo;${esc(x.opt)}&rdquo;${x.cond ? ` <i>${esc(x.cond)}</i>` : ''}</li>`).join('')}</ul>
    ${quiet.length ? `<p class="lbl">Adds weight, never prints alone</p>
      <ul class="fires fires--quiet">${quiet.map(x => `<li><b>${x.sev}</b> Q${x.n} &ldquo;${esc(x.opt)}&rdquo;</li>`).join('')}</ul>` : ''}
    <p class="lbl">What to do</p>
    <ol class="lines lines--n">${(D.blocks.riskFix[id] || []).map(a => line(a)).join('')}</ol>
  </article>`;
};

const LOGO = '<a class="hl-link" href="https://headlinergroup.com.au" aria-label="Headliner Group, home"><div class="hl-stage"><div class="hl-logo"><div class="hl-beam"></div><span class="hl-word">Headliner</span><div class="hl-group">Group</div></div></div></a>';
const css = fs.readFileSync('./diagnostic.css', 'utf8').replace('@import url("../assets/fonts/fonts.css");\n', '');

fs.writeFileSync('reference.html', `<title>Solutions Reference</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}
.hero{padding:clamp(40px,6vw,72px) 0 clamp(28px,4vw,44px);background:var(--base);color:var(--ink)}
.wrap{padding:clamp(40px,6vw,64px) 0 80px}
.key{display:grid;gap:0;margin:26px 0 0;border:1px solid var(--rim);border-radius:14px;overflow:hidden}
.key div{display:grid;grid-template-columns:210px 1fr;gap:18px;padding:14px 18px;border-top:1px solid var(--rim);background:var(--panel)}
.key div:first-child{border-top:0}
.key p{margin:0;font-size:14px;color:var(--sub);max-width:none}
.grp{margin-top:clamp(44px,6vw,64px)}
.grp:first-child{margin-top:0}
.grp__h{padding-bottom:12px;border-bottom:1px solid var(--line)}
.item{padding:30px 0;border-bottom:1px solid var(--line)}
.item__h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:6px}
.item__h em{font-style:normal;color:var(--tx-accent)}
.item__h h3{text-transform:uppercase}
.num{font-weight:700;font-size:13px;color:var(--tx-accent);font-variant-numeric:tabular-nums}
.lbl{font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--tx-mute);margin:22px 0 8px}
.lbl i{font-style:normal;letter-spacing:0;text-transform:none;font-weight:400;font-size:12px}
.sub{font-size:15.5px;color:var(--tx);margin:0 0 4px;max-width:72ch}
.lines{list-style:none;margin:0;padding:0;counter-reset:l}
.lines li{position:relative;padding:11px 0 11px 0;border-top:1px solid var(--line);font-size:15.5px;color:var(--tx);max-width:none}
.lines--n li,.lines--x li{counter-increment:l;padding-left:34px}
.lines--n li::before{content:counter(l);position:absolute;left:0;top:11px;font-weight:700;font-size:13px;color:var(--tx-accent);font-variant-numeric:tabular-nums}
.lines--x li::before{content:"\\00d7";position:absolute;left:0;top:11px;font-weight:700;font-size:15px;color:var(--cta-deep)}
.slot{font-weight:600;color:var(--tx-accent);background:rgba(45,226,195,.16);padding:1px 6px;border-radius:5px}
.t{display:inline-block;margin-left:8px;font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:2px 9px;border-radius:100px;white-space:normal;vertical-align:1px}
.t--f{border:1px solid var(--line);color:var(--tx-mute)}
.t--s{border:1px solid var(--tx-accent);color:var(--tx-accent)}
.t--c{border:1px solid var(--cta-deep);color:var(--cta-deep)}
.fires{list-style:none;margin:0;padding:0}
.fires li{font-size:14.5px;color:var(--tx);padding:6px 0;border-top:1px solid var(--line)}
.fires b{display:inline-block;min-width:34px;color:var(--tx-accent);font-variant-numeric:tabular-nums}
.fires i{color:var(--tx-mute);font-style:normal}
.fires--quiet li,.fires--quiet b{color:var(--tx-mute)}
</style>

<header class="hdr"><div class="shell hdr__in">${LOGO}<p class="hdr__tag">Solutions reference</p></div></header>

<section class="hero"><div class="shell">
  <p class="eyebrow">Business diagnostic</p>
  <h1 class="hl-face d1" style="text-transform:uppercase">Every solution<br>the tool can give</h1>
  <p class="lede" style="margin-top:20px">Seven constraints and ten risks, with every line each one can print. Generated from the tool, so it cannot go stale against it.</p>
  <div class="key">
    <div>${TAG.fixed}<p>The same words for every business that gets this finding.</p></div>
    <div>${TAG.filled}<p>The same sentence, with their own answer or figure dropped into it.</p></div>
    <div><span class="t t--c">Only if</span><p>The whole line only appears when they answered a particular way. Everyone else never sees it.</p></div>
  </div>
</div></section>

<main class="on-light"><div class="shell wrap">
  <section class="grp"><div class="grp__h"><h2 class="hl-face d2" style="text-transform:uppercase">The seven constraints</h2></div>${constraints}</section>
  <section class="grp"><div class="grp__h"><h2 class="hl-face d2" style="text-transform:uppercase">The ten risks</h2></div>
    ${Object.entries(D.flags).map(([id, m]) => riskCard(id, m)).join('')}
  </section>
</div></main>

<footer class="ftr"><div class="shell">${LOGO}
<p>Helping founders in live events &amp; production grow through partnerships.</p></div></footer>
`);
console.log('wrote reference.html |', D.chain.length, 'constraints,', Object.keys(D.flags).length, 'risks');
