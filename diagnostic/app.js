/* Business Diagnostic Tool, interface.
   Renders the questionnaire in groups, holds the answer set, hands it to the
   engine and prints the report. No logic lives here. If something about the
   diagnosis looks wrong, it is in engine.js or content.js, not this file. */
(function () {
  "use strict";
  var D = window.DIAG, E = window.DiagEngine;
  /* Group labels are deliberately neutral. They describe what is being asked
     about, never what the answers might mean, so nobody games the result. */
  var GROUPS = [
    { title: "About the business",          sub: "Six quick ones so the rest of the questions read against the right size of business.",   from: 1,  to: 6 },
    { title: "Money in and money out",      sub: "Timing, not profit. Two different things.",                                              from: 7,  to: 13 },
    { title: "You and the team",            sub: "Where your week actually went, and what happens when you aren't there.",                 from: 14, to: 19 },
    { title: "Getting the work done",       sub: "Capacity, lead times, and how much of it comes down to the wire.",                       from: 20, to: 24 },
    { title: "Your customers",              sub: "What happens after somebody buys.",                                                      from: 25, to: 30 },
    { title: "Winning work",                sub: "What happens between an enquiry and a yes.",                                             from: 31, to: 35 },
    { title: "Where the work comes from",   sub: "Volume and sources.",                                                                    from: 36, to: 40 },
    { title: "What's left over",            sub: "What the work actually earns you.",                                                      from: 41, to: 45 },
    { title: "What the business leans on",  sub: "The things there is only one of.",                                                       from: 46, to: 52 },
    { title: "You and the business",        sub: "The last six. These are the ones owners skip, so take them slowly.",                     from: 53, to: 58 }
  ];
  var answers = {}, step = 0;
  var $ = function (id) { return document.getElementById(id); };
  var qsOf = function (g) { return D.questions.filter(function (q) { return q.n >= g.from && q.n <= g.to; }); };
  // A question with showIf only appears once its trigger has been answered a
  // certain way. Hidden questions are never required and never scored.
  function visible(q) {
    if (!q.showIf) return true;
    var a = answers[q.showIf.q];
    if (!a) return false;
    var picked = a.opts || (a.opt ? [a.opt] : []);
    if (!picked.length) return false;
    if (q.showIf.notOnly) return picked.some(function (v) { return q.showIf.notOnly.indexOf(v) === -1; });
    return picked.some(function (v) { return (q.showIf.anyOf || []).indexOf(v) !== -1; });
  }
  // optionsFrom narrows a follow up to what they actually ticked on the question
  // before it, so nobody is asked to rank something they never flagged.
  function optionsOf(q) {
    if (!q.optionsFrom) return q.options;
    var a = answers[q.optionsFrom] || {};
    var picked = a.opts || [];
    var narrowed = q.options.filter(function (o) { return picked.indexOf(o.id) !== -1; });
    return narrowed.length ? narrowed : q.options;
  }
  var article = function (n) { return /^[aeiou]/i.test(n) ? "an" : "a"; };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  /* ---------- storage. Per browser, never leaves the device. ---------- */
  var KEY = "diag.answers.v1";
  function save() { try { localStorage.setItem(KEY, JSON.stringify(answers)); } catch (e) {} }
  function load() { try { var v = localStorage.getItem(KEY); if (v) answers = JSON.parse(v) || {}; } catch (e) { answers = {}; } }
  /* ---------- rendering ---------- */
  function optionRow(q, o) {
    var a = answers[q.id] || {};
    var multi = q.type === "multi";
    var on = multi ? (a.opts || []).indexOf(o.id) !== -1 : a.opt === o.id;
    return '<label class="opt' + (o.notSure ? " opt--unsure" : "") + '">' +
      '<input type="' + (multi ? "checkbox" : "radio") + '" name="' + q.id + '" value="' + o.id + '"' + (on ? " checked" : "") + '>' +
      '<span>' + esc(o.text) + '</span></label>';
  }
  function questionBlock(q) {
    var h = '<fieldset class="q" data-q="' + q.id + '" style="border:0;padding:0;margin:0">' +
      '<span class="q__n">Question ' + q.n + '</span>' +
      '<legend class="q__t" style="padding:0">' + esc(q.text) + '</legend>';
    if (q.help) h += '<p class="q__help">' + esc(q.help) + '</p>';
    if (q.type === "multi") h += '<p class="q__help">Tick everything that applies.</p>';
    h += '<div class="opts">' + optionsOf(q).map(function (o) { return optionRow(q, o); }).join("") + '</div>';
    if (q.exact) {
      var a = answers[q.id] || {};
      h += '<div class="exact" data-exact="' + q.id + '">' +
        '<label for="x-' + q.id + '">' + esc(q.exact.label) + '</label>' +
        '<input id="x-' + q.id + '" type="number" step="any" min="0" inputmode="decimal" value="' + (a.exact != null ? esc(a.exact) : "") + '">' +
        ' <span class="mute" style="font-size:13px">' + esc(q.exact.unit) + '</span>' +
        '<small>Optional. It sharpens the wording of the report and it never changes the finding.</small></div>';
    }
    return h + "</fieldset>";
  }
  function renderStep() {
    var g = GROUPS[step];
    $("g-title").textContent = g.title;
    $("g-sub").textContent = g.sub;
    $("g-form").innerHTML = qsOf(g).filter(visible).map(questionBlock).join("");
    $("p-step").textContent = step + 1;
    $("p-total").textContent = GROUPS.length;
    $("prev").textContent = step === 0 ? "Back to start" : "Back";
    $("next").innerHTML = step === GROUPS.length - 1 ? "See the diagnosis" : 'Next<span aria-hidden="true">&rarr;</span>';
    $("warn").hidden = true;
    qsOf(g).forEach(function (q) { if (q.exact) toggleExact(q); });
    updateProgress();
    window.scrollTo(0, 0);
  }
  function toggleExact(q) {
    var box = document.querySelector('[data-exact="' + q.id + '"]');
    if (!box) return;
    var a = answers[q.id] || {}, o = a.opt ? optOf(q, a.opt) : null;
    box.classList.toggle("is-on", !!(o && !o.notSure));
  }
  function optOf(q, id) { for (var i = 0; i < q.options.length; i++) if (q.options[i].id === id) return q.options[i]; return null; }
  function answeredCount() {
    return D.questions.filter(visible).filter(function (q) {
      var a = answers[q.id];
      return a && (q.type === "multi" ? (a.opts || []).length : !!a.opt);
    }).length;
  }
  function updateProgress() {
    var n = answeredCount();
    var total = D.questions.filter(visible).length;
    $("p-count").textContent = n + " of " + total + " answered";
    $("p-fill").style.width = (100 * n / total) + "%";
  }
  /* ---------- answering ---------- */
  $("g-form").addEventListener("change", function (e) {
    var t = e.target;
    if (t.type === "number") {
      var qid = t.id.slice(2);
      answers[qid] = answers[qid] || {};
      answers[qid].exact = t.value === "" ? null : Number(t.value);
      save(); return;
    }
    var q = D.questions.filter(function (x) { return x.id === t.name; })[0];
    if (!q) return;
    if (q.type === "multi") {
      var picked = Array.prototype.slice.call(document.querySelectorAll('input[name="' + q.id + '"]:checked')).map(function (i) { return i.value; });
      // An exclusive option (None of these, All of them sit with me) clears the rest,
      // and picking anything else clears the exclusive one.
      var ex = q.options.filter(function (o) { return o.exclusive; }).map(function (o) { return o.id; });
      if (ex.indexOf(t.value) !== -1 && t.checked) picked = [t.value];
      else picked = picked.filter(function (v) { return ex.indexOf(v) === -1; });
      answers[q.id] = { opts: picked };
      document.querySelectorAll('input[name="' + q.id + '"]').forEach(function (i) { i.checked = picked.indexOf(i.value) !== -1; });
    } else {
      answers[q.id] = Object.assign({}, answers[q.id], { opt: t.value });
      var o = optOf(q, t.value);
      if (o && o.notSure) delete answers[q.id].exact;
      toggleExact(q);
    }
    save();
    if (D.questions.some(function (x) { return x.showIf && x.showIf.q === q.id; }) ||
        D.questions.some(function (x) { return x.optionsFrom === q.id; })) {
      renderStep();
      return;
    }
    updateProgress();
  });
  /* ---------- navigation ---------- */
  $("start").addEventListener("click", function () { show("s-quiz"); renderStep(); });
  $("prev").addEventListener("click", function () {
    if (step === 0) { show("s-intro"); return; }
    step--; renderStep();
  });
  $("next").addEventListener("click", function () {
    var missing = qsOf(GROUPS[step]).filter(visible).filter(function (q) {
      var a = answers[q.id];
      return !(a && (q.type === "multi" ? (a.opts || []).length : !!a.opt));
    });
    if (missing.length) {
      $("warn").hidden = false;
      var el = document.querySelector('[data-q="' + missing[0].id + '"]');
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (step === GROUPS.length - 1) { runReport(); return; }
    step++; renderStep();
  });
  function show(id) {
    ["s-intro", "s-quiz", "s-report"].forEach(function (s) { $(s).classList.toggle("is-on", s === id); });
  }
  /* ---------- the report ---------- */
  function para(t) { return String(t).split("\n\n").map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); }
  function runReport() {
    var r = E.diagnose(answers);
    var h = "", n = 0;
    // Sections number themselves as they print. Optional blocks come and go, and a
    // fixed number would leave a gap the moment one of them did not fire.
    // Plain headings, not numbered labels. The order is the sequence, the numbers
    // were decoration on top of it.
    var label = function (t) { return '<h2 class="hl-face d3 sec__h">' + esc(t) + "</h2>"; };
    void n;
    // Preamble first and small, then the finding at full size. It used to announce
    // the constraint, explain itself, then announce the constraint again.
    h += '<div class="rep__lead">' +
      '<p class="eyebrow">Your diagnosis</p>' + para(r.opening) +
      '<p class="privacy">We do not use <u>any</u> AI in this tool, and <u>none</u> of your data is sent or stored offsite.</p></div>';
    h += '<div class="sec" style="padding-top:0">' +
      '<div class="verdict"><div class="glow"></div>' +
      '<h1 class="hl-face display">' + esc(r.primary.title.before) +
        '<em>' + esc(r.primary.title.phrase) + '</em>' + esc(r.primary.title.after) + '</h1>' +
      para(r.primary.body) + '</div></div>';
    h += '<div class="sec">' + label("How to fix it") +
      "<p>" + esc(r.primary.fix.lead) + "</p>" +
      '<ol class="acts">' + r.primary.fix.actions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol></div>";
    h += '<div class="sec">' + label("Your risks, and what to do about them") +
      "<p>" + esc(r.risk.lead) + "</p>" +
      r.risk.flags.map(function (f) {
        return '<div class="risk">' +
          '<div class="risk__head"><div class="glow"></div>' +
            '<span>You have ' + article(f.name) + '</span><h3 class="hl-face d3">' + esc(f.name) + "</h3><span>risk</span></div>" +
          '<div class="risk__body"><p>' + esc(f.body) + "</p>" +
            '<ol class="acts acts--risk">' +
              f.fix.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") +
            "</ol></div></div>";
      }).join("") + "</div>";
    if (r.dontDo) {
      h += '<div class="sec sec--dont">' +
        '<h2 class="hl-face d2 dont__h">Don\u2019t do this yet</h2>' +
        "<p>" + esc(r.dontDo.lead) + "</p>" +
        '<ol class="acts dont">' + r.dontDo.items.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol></div>";
    }
    h += '<div class="sec">' + para(r.closing.text) +
      (r.closing.cta ? "<p>" + esc(r.closing.cta) + "</p>" : "") +
      "</div>";
    h += '<div class="rep__actions" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:34px">' +
      '<button class="btn btn--fill" onclick="window.print()">Save as PDF</button>' +
      '<button class="btn btn--ghost" id="again">Change my answers</button></div>';
    h += '<details class="why"><summary>Why this fired, working out</summary><pre>' + esc(explain(r)) + "</pre></details>";
    $("report").innerHTML = h;
    $("again").addEventListener("click", function () { show("s-quiz"); renderStep(); });
    show("s-report");
    window.scrollTo(0, 0);
  }
  function explain(r) {
    var d = r.debug, L = [];
    L.push("PRIMARY   " + r.primary.id + "   (" + d.how + ")");
    L.push("");
    L.push("Constraint scores, checked in chain order. First one to fail is called.");
    D.chain.forEach(function (c) {
      var s = d.scores[c], mark = c === r.primary.id ? " <-- called" : (d.disqualified[c] ? "  disqualified by " + d.disqualified[c] : "");
      L.push("  " + c.padEnd(12) + String(s.score).padStart(3) + mark);
    });
    L.push("");
    L.push("Thresholds  fail " + D.thresholds.PRIMARY_FAIL + ", floor " + D.thresholds.FALLBACK_FLOOR + ", risk print " + D.thresholds.FLAG_PRINT);
    L.push("Downstream of the finding, so never the finding itself  " + (d.suppressed.join(", ") || "nothing"));
    L.push("");
    L.push("Risks, loudest first. The top " + D.thresholds.MAX_FLAGS_SHOWN + " above " + D.thresholds.FLAG_PRINT + " print.");
    L.push("");
    L.push("Flags raised");
    Object.keys(d.flagSev).sort(function (a, b) { return d.flagSev[b] - d.flagSev[a]; })
      .forEach(function (k) { L.push("  " + k.padEnd(20) + String(d.flagSev[k]).padStart(3)); });
    L.push("");
    L.push('"Not sure" answers  ' + d.notSureCount + (d.tooUnsure ? "   (over the limit, report framed as provisional)" : ""));
    return L.join("\n");
  }
  /* ---------- test presets ---------- */
  var PRESETS = {
    healthy: {},
    cashflow:   { q54:"f", q7:"e", q55:"d", q6:"d", q8:"d", q9:"c", q10:"a", q41:"d", q45:"d" },
    talent:     { q11:["n"], q12:"d", q13:["a","c","g"], q56:"d", q14:"d", q15:"e",
                  q48:"c", q49:"d", q50:"c" },
    fulfilment: { q16:"e", q17:"d", q18:"d", q19:"d", q20:"d", q34:"c",
                  q44:["c"], q58:"c", q46:"c" },
    value:      { q21:"c", q57:"e", q22:"c", q23:"d", q24:"c", q25:"c", q47:"c", q42:"d" },
    offer:      { q26:"d", q27:"c", q28:"d", q29:"d", q30:"c", q43:"c" },
    demand:     { q16:"a", q31:"a", q32:["a"], q33:"d", q34:"a", q35:"c", q43:"c", q41:"d" },
    margin:     { q10:"c", q36:"d", q37:"d", q38:"e", q39:"d", q40:"c", q47:"c", q41:"d" },
    talent_suppressed: { q11:["n"], q12:"d", q13:["a","c","g"], q56:"d", q14:"d", q15:"e",
                         q16:"e", q17:"d", q18:"d", q19:"d", q20:"d",
                         q21:"c", q57:"d", q22:"c", q23:"c", q24:"c", q25:"c", q34:"c", q49:"d" },
    // Customers still buying, and most of their work going somewhere else. The case
    // the old question set scored as healthy retention.
    wallet:     { q21:"a", q57:"e", q22:"b", q23:"c", q24:"c", q25:"c",
                  q42:"d", q43:"c", q46:"c", q49:"c" }
  };
  var BASE = {
    q1:"c", q2:"c", q3:["b"], q53:"b", q4:"c", q5:"b",
    q54:"a", q6:"a", q7:"a", q8:"a", q9:"a", q10:"a", q55:"a",
    q11:["a","b","c","d","e"], q12:"a", q13:["n"], q56:"a", q14:"a", q15:"b",
    q16:"b", q17:"a", q18:"b", q19:"a", q20:"a",
    q21:"a", q57:"a", q22:"a", q23:"a", q24:"a", q25:"a",
    q26:"a", q27:"b", q28:"a", q29:"a", q30:"a",
    q31:"d", q32:["a","c","d"], q33:"a", q34:"a", q35:"a",
    q36:"a", q37:"a", q38:"a", q39:"a", q40:"a",
    q41:"a", q42:"a", q43:"a", q44:["n"], q45:"a", q46:"a",
    q47:"a", q48:"a", q49:"a", q50:"a", q51:"a", q52:"a"
  };
  function applyPreset(name) {
    if (name === "clear") { answers = {}; save(); step = 0; show("s-intro"); return; }
    if (name === "unsure") {
      answers = {};
      D.questions.forEach(function (q) {
        var z = q.options.filter(function (o) { return o.notSure; })[0] || q.options.filter(function (o) { return o.exclusive; })[0] || q.options[0];
        answers[q.id] = q.type === "multi" ? { opts: [z.id] } : { opt: z.id };
      });
      save(); runReport(); return;
    }
    var mix = Object.assign({}, BASE, PRESETS[name] || {});
    answers = {};
    Object.keys(mix).forEach(function (k) {
      answers[k] = Array.isArray(mix[k]) ? { opts: mix[k] } : { opt: mix[k] };
    });
    save();
    runReport();
  }
  $("dev").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-p]");
    if (b) applyPreset(b.dataset.p);
  });
  /* ---------- boot ---------- */
  load();
  document.body.classList.add("has-dev");
  if (answeredCount() > 0) {
    // Pick up where they left off rather than making them start again.
    for (var i = 0; i < GROUPS.length; i++) {
      var done = qsOf(GROUPS[i]).filter(visible).every(function (q) {
        var a = answers[q.id];
        return a && (q.type === "multi" ? (a.opts || []).length : !!a.opt);
      });
      if (!done) { step = i; break; }
      step = i;
    }
  }
})();
