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

// Who wrote each line. Anything not listed in provenance.json is Claude's, because
// claiming Ryan signed something off when he did not is the worse of the two errors.
const PROV = JSON.parse(fs.readFileSync('./provenance.json', 'utf8'));
const mark = path => PROV[path] === 'yes'
  ? '<span class="who who--y" title="Ryan wrote this">\u2713</span>'
  : '<span class="who who--n" title="Claude wrote this, not signed off">\u2715</span>';

const TAG = { fixed:'<span class="t t--f">Same for everyone</span>',
              filled:'<span class="t t--s">Their answer dropped in</span>' };
const tagIf = w => `<span class="t t--c">Only if ${w.map(p => qn(p[0]) + ' is ' + p[1].map(o => {
  const q = byId(p[0]); const opt = q.options.find(x => x.id === o);
  return '&ldquo;' + esc(opt ? opt.text : o) + '&rdquo;'; }).join(' or ')).join(', and ')}</span>`;

const line = (text, when, path) => `<li>${path ? mark(path) : ''}${slots(text)}
  ${when ? tagIf(when) : hasSlot(text) ? TAG.filled : TAG.fixed}</li>`;

const constraints = D.chain.map((c, i) => {
  const cd = D.blocks.constraintDef[c], f = D.blocks.constraintFix[c], dd = D.blocks.dontDoYet[c];
  const opens = (Array.isArray(cd.open) ? cd.open : [cd.open]);
  const cond = f.actions.filter(a => a.when).length;
  return `<article class="item">
    <div class="item__h"><span class="num">${i + 1}</span>
      <h3 class="hl-face d3">You are <em>${esc(D.constraints[c].phrase)}</em> constrained</h3></div>

    <p class="lbl">What it says</p>
    <ul class="lines">${opens.map((o, n) => line(o, null, `constraintDef.${c}.open[${n}]`)).join('')}
      ${(cd.evidence || []).map((e, n) => line(e.banded, null, `constraintDef.${c}.evidence[${n}]`)).join('')}
      ${line(cd.close, null, `constraintDef.${c}.close`)}</ul>

    <p class="lbl">How to fix it &nbsp;<i>${f.actions.length} written, ${cond} conditional, at most ${D.thresholds.MAX_ACTIONS} ever print</i></p>
    <ol class="lines lines--n">${f.actions.map((a, n) => line(a.text, a.when, `constraintFix.${c}.actions[${n}]`)).join('')}</ol>

    <p class="lbl">Don${String.fromCharCode(8217)}t do this yet</p>
    <p class="sub">${esc(dd.lead)}</p>
    <ol class="lines lines--x">${dd.items.map((x, n) => line(x, null, `dontDoYet.${c}.items[${n}]`)).join('')}</ol>
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
  if (rd && rd.evidence) {
    const opens = Array.isArray(rd.open) ? rd.open : [rd.open];
    rd.banded = null;
    rd.text = opens.concat((rd.evidence || []).map(e => e.banded), [rd.close]).join(' ');
  }
  const list = (fires[id] || []).sort((a, b) => b.sev - a.sev);
  const prints = list.filter(x => x.sev >= T), quiet = list.filter(x => x.sev < T);
  return `<article class="item">
    <div class="item__h"><h3 class="hl-face d3">You have ${/^[aeiou]/i.test(m.name) ? 'an' : 'a'} <em>${esc(m.name)}</em> risk</h3></div>
    <p class="lbl">What it says</p>
    <ul class="lines">${line(rd.banded || rd.text, null, `riskDef.${id}`)}
      ${(rd.variants || []).map(v => `<li>${slots(v.text)}<span class="t t--c">Only if ${qn(v.when[0][0])} ticks the person who knows how the work gets done</span></li>`).join('')}
      ${rd.alt ? `<li>${esc(rd.alt)}<span class="t t--c">Only if they answered Not sure</span></li>` : ''}</ul>
    <p class="lbl">Prints when they answer</p>
    <ul class="fires">${prints.map(x => `<li><b>${x.sev}</b> Q${x.n} &ldquo;${esc(x.opt)}&rdquo;${x.cond ? ` <i>${esc(x.cond)}</i>` : ''}</li>`).join('')}</ul>
    ${quiet.length ? `<p class="lbl">Adds weight, never prints alone</p>
      <ul class="fires fires--quiet">${quiet.map(x => `<li><b>${x.sev}</b> Q${x.n} &ldquo;${esc(x.opt)}&rdquo;</li>`).join('')}</ul>` : ''}
    <p class="lbl">What to do</p>
    <ol class="lines lines--n">${(D.blocks.riskFix[id] || []).map((a, n) =>
      line(typeof a === 'string' ? a : a.text, typeof a === 'string' ? null : a.when, `riskFix.${id}[${n}]`)).join('')}</ol>
  </article>`;
};

// Counted off the content, not typed in, so the number moves when the copy does.
let mineN = 0, ryanN = 0;
(function tally() {
  const bump = p => (PROV[p] === 'yes' ? ryanN++ : mineN++);
  for (const c of D.chain) {
    const cd = D.blocks.constraintDef[c];
    (Array.isArray(cd.open) ? cd.open : [cd.open]).forEach((_, n) => bump(`constraintDef.${c}.open[${n}]`));
    (cd.evidence || []).forEach((_, n) => bump(`constraintDef.${c}.evidence[${n}]`));
    bump(`constraintDef.${c}.close`);
    D.blocks.constraintFix[c].actions.forEach((_, n) => bump(`constraintFix.${c}.actions[${n}]`));
    D.blocks.dontDoYet[c].items.forEach((_, n) => bump(`dontDoYet.${c}.items[${n}]`));
  }
  for (const id of Object.keys(D.flags)) {
    bump(`riskDef.${id}`);
    (D.blocks.riskFix[id] || []).forEach((_, n) => bump(`riskFix.${id}[${n}]`));
  }
})();

const LOGO = '<a class="hl-link" href="https://headlinergroup.com.au" aria-label="Headliner Group, home"><div class="hl-stage"><div class="hl-logo"><div class="hl-beam"></div><span class="hl-word">Headliner</span><div class="hl-group">Group</div></div></div></a>';
const css = fs.readFileSync('./diagnostic.css', 'utf8').replace('@import url("../assets/fonts/fonts.css");\n', '');

fs.writeFileSync('reference.html', `<title>Solutions Reference</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}
.hero{padding:clamp(40px,6vw,72px) 0 clamp(28px,4vw,44px);background:var(--base);color:var(--ink)}
.wrap{padding:clamp(40px,6vw,64px) 0 80px}
.key{display:grid;gap:0;margin:26px 0 0;border:1px solid var(--rim);border-radius:14px;overflow:hidden}
.key div{display:grid;grid-template-columns:210px 1fr;gap:18px;padding:14px 18px;border-top:1px solid var(--rim);background:var(--panel);align-items:start}
.key .who{margin:0}
.onlymine{display:inline-flex;align-items:center;gap:11px;margin:22px 0 0;padding:12px 18px;
  border:1px solid var(--rim);border-radius:100px;background:var(--panel);cursor:pointer;
  font-size:14px;font-weight:500;color:var(--ink);user-select:none}
.onlymine:hover{border-color:var(--sub)}
.onlymine input{appearance:none;-webkit-appearance:none;margin:0;width:17px;height:17px;border-radius:5px;
  border:1.5px solid var(--sub);background:transparent;cursor:pointer;flex:0 0 auto}
.onlymine input:checked{border-color:var(--accent);background:var(--accent);box-shadow:inset 0 0 0 3px var(--panel)}
.onlymine input:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.onlymine__n{margin:14px 0 0;font-size:13.5px;color:var(--sub)}
.is-hidden{display:none}
/* With the approved lines out, a card whose copy is all Ryan's leaves nothing but
   its heading, so the heading goes too rather than sitting there empty. */
body.only-mine .lines li:not(.mine),
body.only-mine .item.all-approved,
body.only-mine .lbl.empty-after,
body.only-mine .sub.empty-after{display:none}
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
/* The don't do list used a cross as its bullet. The provenance mark is a cross too,
   so the bullet goes and the heading carries the meaning instead. */
.lines--x li{padding-left:0}
.lines--x li::before{content:none}
.slot{font-weight:600;color:#08594C;background:#DCEFEB;padding:1px 6px;border-radius:5px}
.t{display:inline-block;margin-left:8px;font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:2px 9px;border-radius:100px;white-space:normal;vertical-align:1px}
.t--f{border:1px solid var(--line);color:var(--tx-mute)}
.who{display:inline-block;width:19px;height:19px;line-height:19px;text-align:center;border-radius:50%;
  font-size:11px;font-weight:700;margin-right:10px;vertical-align:1px;flex:0 0 auto}
/* Solid, not rgba. A translucent chip reads fine and audits as 1.00, because the
   sampler sees the solid channel behind the alpha. Solid keeps the two honest. */
.who--y{background:#DCEFEB;color:#08594C}
.who--n{background:#FAE6E0;color:#A32C0C}
.key .who--y,.key .who--n{background:#2A2A2A}
.key .who--y{color:#5FD8C2}
.key .who--n{color:#FF8A66}
.t--s{border:1px solid var(--tx-accent);color:var(--tx-accent)}
.t--c{border:1px solid #A32C0C;color:#A32C0C;background:var(--surface)}
/* the key sits on the dark panel, where the deep coral cannot carry text */
.key .t--c{border-color:#FF8A66;color:#FF8A66;background:transparent}
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
    <div><span class="who who--y">&#10003;</span><p><b>${ryanN} lines.</b> Ryan wrote this or dictated it in a message. Some have had their wording changed to meet the no dashes rule, the banned sentence shapes, or the ruling that no copy may assume a delivery model, a sales process or a pricing method. The line is still his.</p></div>
    <div><span class="who who--n">&#10005;</span><p><b>${mineN} lines.</b> Claude wrote it and Ryan has not signed it off. Anything uncertain is marked this way on purpose, because claiming he approved something he did not is the worse of the two errors.</p></div>
  </div>
  <label class="onlymine"><input type="checkbox" id="only-mine">
    <span>Hide the ${ryanN} lines I${String.fromCharCode(8217)}ve approved, show me what${String.fromCharCode(8217)}s left</span></label>
  <p class="onlymine__n" id="only-mine-n" hidden></p>
</div></section>

<main class="on-light"><div class="shell wrap">
  <section class="grp"><div class="grp__h"><h2 class="hl-face d2" style="text-transform:uppercase">The six constraints</h2></div>${constraints}</section>
  <section class="grp"><div class="grp__h"><h2 class="hl-face d2" style="text-transform:uppercase">The eleven risks</h2></div>
    ${Object.entries(D.flags).map(([id, m]) => riskCard(id, m)).join('')}
  </section>
</div></main>

<script>
(function () {
  var box = document.getElementById('only-mine'), note = document.getElementById('only-mine-n');
  // Marked on the line rather than read from the tick, so the rule is one class.
  [].forEach.call(document.querySelectorAll('.lines li'), function (li) {
    if (li.querySelector('.who--n')) li.classList.add('mine');
  });
  function apply(on) {
    document.body.classList.toggle('only-mine', on);
    var left = 0;
    [].forEach.call(document.querySelectorAll('.item'), function (item) {
      var mine = item.querySelectorAll('.lines li.mine').length;
      item.classList.toggle('all-approved', on && mine === 0);
      if (on) left += mine;
      // A label with nothing under it any more is noise, so it goes with its list.
      [].forEach.call(item.querySelectorAll('.lbl'), function (lbl) {
        var list = lbl.nextElementSibling;
        while (list && !/^(UL|OL)$/.test(list.tagName)) list = list.nextElementSibling;
        var none = !!list && list.querySelectorAll('li.mine').length === 0 &&
                   list.querySelectorAll('li').length > 0 && list.classList.contains('lines');
        lbl.classList.toggle('empty-after', on && none);
        if (list) list.classList.toggle('is-hidden', on && none);
      });
    });
    note.hidden = !on;
    note.textContent = on ? left + ' lines still need you. Everything you have signed off is hidden.' : '';
    try { localStorage.setItem('diag-only-mine', on ? '1' : '0'); } catch (e) {}
  }
  var saved = '0';
  try { saved = localStorage.getItem('diag-only-mine') || '0'; } catch (e) {}
  box.checked = saved === '1';
  apply(box.checked);
  box.addEventListener('change', function () { apply(box.checked); });
})();
</script>

<footer class="ftr"><div class="shell">${LOGO}
<p>Helping founders in live events &amp; production grow through partnerships.</p></div></footer>
`);
console.log('wrote reference.html |', D.chain.length, 'constraints,', Object.keys(D.flags).length, 'risks');
