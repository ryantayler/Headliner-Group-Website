/* Business Diagnostic Tool, engine.
   Pure logic. Reads window.DIAG, takes an answer set, returns a report object.
   Deterministic. Same answers in, same report out.
   Answer shape:
     { q6:{opt:"c"}, q11:{opts:["a","b"]}, q7:{opt:"d", exact:45} }
*/
(function (global) {
  "use strict";
  var D = null;
  function cfg() { return D || (D = global.DIAG); }
  function T(k) { return cfg().thresholds[k]; }
  function byId(id) {
    var qs = cfg().questions;
    for (var i = 0; i < qs.length; i++) if (qs[i].id === id) return qs[i];
    return null;
  }
  function optOf(q, id) {
    for (var i = 0; i < q.options.length; i++) if (q.options[i].id === id) return q.options[i];
    return null;
  }
  function selected(ans, q) {
    var a = ans[q.id];
    if (!a) return [];
    if (q.type === "multi") return (a.opts || []).map(function (id) { return optOf(q, id); }).filter(Boolean);
    return a.opt ? [optOf(q, a.opt)].filter(Boolean) : [];
  }
  /* ---------- per question severity ---------- */
  function questionSeverity(ans, q) {
    var sel = selected(ans, q);
    if (!sel.length) return null;                     // unanswered, excluded from the average
    // Every single select now scores 0, 33, 67 or 100, so a multi select has to land
    // on the same four rungs or it runs hot against them. That is what made talent
    // score eleven points above demand on identical random input.
    function rung(frac) { return [0, 33, 67, 100][Math.min(3, Math.max(0, Math.round(frac * 3)))]; }
    if (q.scoreRule === "unowned_layers") {
      if (sel.some(function (o) { return o.exclusive; })) return 100;
      var layers = q.options.filter(function (o) { return !o.exclusive; }).length;
      var owned = sel.filter(function (o) { return !o.exclusive; }).length;
      return rung((layers - owned) / layers);
    }
    if (q.scoreRule === "owner_task_load") {
      if (sel.some(function (o) { return o.exclusive; })) return 0;
      var pool = q.options.filter(function (o) { return !o.exclusive; }).length || 1;
      return rung(sel.length / pool);
    }
    if (q.scoreRule === "channel_count") {
      if (sel.some(function (o) { return o.exclusive; })) return 100;
      return rung(Math.max(0, 4 - sel.length) / 3);
    }
    var o = sel[0];
    return typeof o.w === "number" ? o.w : 0;
  }
  /* ---------- constraint block scores ---------- */
  function scoreConstraints(ans) {
    var out = {};
    // The cash flow block is scored the same way it always was. It just is not in
    // the chain any more, so what comes out of it raises a risk instead of a verdict.
    var blocks = cfg().chain.concat([cfg().cashflowRisk.block]);
    blocks.forEach(function (cid) {
      var qs = cfg().questions.filter(function (q) { return q.section === cid && q.weight > 0; });
      var num = 0, den = 0, unanswered = 0, detail = [];
      qs.forEach(function (q) {
        var w = q.weight;
        // one off businesses cannot be judged on repeat purchase, so the value block
        // shifts its weight onto referral instead of retention.
        if (cid === "value" && isOneOff(ans)) {
          if (q.id === "q21" || q.id === "q22" || q.id === "q24") w = w * 0.4;
          if (q.id === "q23") w = w * 1.8;
        }
        var s = questionSeverity(ans, q);
        if (s === null) { unanswered++; return; }
        num += s * w; den += w;
        detail.push({ q: q.id, sev: s, weight: Math.round(w * 100) / 100 });
      });
      out[cid] = {
        id: cid,
        score: den ? Math.round(num / den) : 0,
        unanswered: unanswered,
        detail: detail
      };
    });
    return out;
  }
  function isOneOff(ans) {
    var sel = selected(ans, byId("q53"));
    return !!(sel.length && sel[0].oneoff);
  }
  /* ---------- disqualifiers and hard triggers ---------- */
  function disqualified(ans) {
    var out = {};
    cfg().questions.forEach(function (q) {
      selected(ans, q).forEach(function (o) {
        if (o.disqualify) out[o.disqualify] = q.id;
      });
    });
    return out;
  }
  function condMet(ans, pair) {
    var q = byId(pair[0]); if (!q) return false;
    var want = pair[1], sel = selected(ans, q);
    return sel.some(function (o) { return want.indexOf(o.id) !== -1; });
  }
  function hardTriggered(ans, cid) {
    var rules = (cfg().hardTriggers || {})[cid] || [];
    return rules.some(function (r) {
      return (r.all || []).every(function (pair) { return condMet(ans, pair); });
    });
  }
  /* ---------- flags ---------- */
  function collectFlags(ans) {
    var raw = {}, counts = {};
    cfg().questions.forEach(function (q) {
      selected(ans, q).forEach(function (o) {
        (o.flags || []).forEach(function (f) {
          // A conditional flag only fires when the answer it depends on agrees.
          // Uncommitted revenue is only a risk in proportion to who owes it.
          if (f.when && !f.when.every(function (pair) { return condMet(ans, pair); })) return;
          var id = typeof f === "string" ? f : f.id;
          var sev = typeof f === "string" ? 75 : f.sev;
          raw[id] = Math.max(raw[id] || 0, sev);
          counts[id] = (counts[id] || 0) + 1;
        });
      });
    });
    // Not sure is a finding. Repeated blindness compounds, and four or more
    // unanswerable data questions raises the flag on its own.
    // "Of the ones you ticked, which would hurt most" promotes that one flag.
    var worst = selected(ans, byId("q58"));
    if (worst.length && worst[0].boost) raw[worst[0].boost] = 100;
    // Blindness is asked directly now rather than inferred from ducked questions.
    // The fewer things the business measures, the louder it gets.
    var meas = selected(ans, byId("q59"));
    if (meas.length) {
      var real = meas.filter(function (o) { return !o.exclusive; }).length;
      var pool = byId("q59").options.filter(function (o) { return !o.exclusive; }).length;
      var sev = Math.round((pool - real) / pool * 100);
      if (sev >= 60) raw.no_data = Math.max(raw.no_data || 0, sev);
    }
    if (counts.no_data) raw.no_data = Math.max(raw.no_data || 0, 95);
    // Not looking at the numbers is the same blindness as not being able to answer,
    // so it counts toward the provisional framing rather than printing as a risk.
    var q47 = selected(ans, byId("q47"));
    return { sev: raw, counts: counts };
  }
  /* ---------- suppression, transitive ---------- */
  function suppressedBy(cid) {
    var map = cfg().suppresses, seen = {}, stack = (map[cid] || []).slice();
    while (stack.length) {
      var n = stack.pop();
      if (seen[n] || n === cid) continue;
      seen[n] = true;
      (map[n] || []).forEach(function (x) { if (!seen[x]) stack.push(x); });
    }
    return Object.keys(seen);
  }
  /* ---------- slot resolution ---------- */
  function bandOf(ans, qid) {
    var q = byId(qid); if (!q) return "";
    var sel = selected(ans, q); if (!sel.length) return "";
    // Unanswered still drops the clause. Not sure no longer exists as an answer.
    return sel[0].band || sel[0].text.toLowerCase();
  }
  function exactOf(ans, qid) {
    var a = ans[qid];
    if (!a || a.exact === null || a.exact === undefined || a.exact === "") return null;
    return a.exact;
  }
  var LAYER_NAMES = { a: "day to day operations", b: "sales", c: "marketing", d: "the numbers", e: "managing the delivery team" };
  function derived(ans, primaryId) {
    var d = {};
    d.primaryShort = primaryId ? cfg().constraints[primaryId].short.toLowerCase() : "";
    d.primaryName = primaryId ? cfg().constraints[primaryId].name.toLowerCase() : "";
    var q11 = byId("q11"), sel = selected(ans, q11);
    // Naming four layers builds a three item list, which is banned. Past two, count them.
    var LAYER_TOTAL = Object.keys(LAYER_NAMES).length;
    if (sel.some(function (o) { return o.exclusive; })) {
      d.unownedLayers = "Every layer sits with you rather than with somebody whose job it is.";
    } else {
      var owned = sel.map(function (o) { return o.id; });
      var missing = Object.keys(LAYER_NAMES).filter(function (k) { return owned.indexOf(k) === -1; }).map(function (k) { return LAYER_NAMES[k]; });
      var WORD = ["", "One", "Two", "Three", "Four", "Five"];
      if (!missing.length) d.unownedLayers = "";
      else if (missing.length === LAYER_TOTAL) d.unownedLayers = "Every layer sits with you rather than with somebody whose job it is.";
      else if (missing.length === 1) d.unownedLayers = cap(missing[0]) + " sits with you rather than with somebody whose job it is.";
      else if (missing.length === 2) d.unownedLayers = cap(missing[0] + " and " + missing[1]) + " sit with you rather than with somebody whose job it is.";
      else d.unownedLayers = WORD[missing.length] + " of the five layers sit with you rather than with somebody whose job it is.";
    }
    var q13 = byId("q13"), t = selected(ans, q13)
      .filter(function (o) { return !o.exclusive; })     // the opt out is not a task
      .map(function (o) { return o.text.toLowerCase(); });
    // A serial comma when an item carries its own "and", so "chasing invoices and
    // doing the books, and fixing things that went wrong" does not run together.
    // The heaviest one only. Naming two builds a list, naming three builds the shape
    // Ryan banned, and the point of the sentence is made by the first one anyway.
    d.ownerTasks = t.length ? t[0] : "";
    return d;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var SLOT = /\{(q\d+)\.(band|exact)\}|\{d\.(\w+)\}/g;
  // A slot can sit at the start of a sentence, and a band phrase is written lower case
  // so it reads mid sentence. Case is fixed after filling rather than by hand in the
  // copy, so a reworded block cannot reintroduce a lower case sentence opening.
  function sentenceCase(s) {
    return s.replace(/(^|[.!?]\s+|\n\n)([a-z])/g, function (m, pre, ch) { return pre + ch.toUpperCase(); });
  }
  function fill(text, ans, d) {
    if (!text) return "";
    return text.replace(SLOT, function (m, qid, kind, dkey) {
      if (dkey) return d[dkey] !== undefined ? d[dkey] : "";
      return kind === "band" ? bandOf(ans, qid) : (exactOf(ans, qid) === null ? "" : String(exactOf(ans, qid)));
    });
  }
  // A precise variant only prints when every exact slot it names actually has a number.
  function resolvable(text, ans) {
    var ok = true, m;
    SLOT.lastIndex = 0;
    while ((m = SLOT.exec(text)) !== null) {
      if (m[2] === "exact" && exactOf(ans, m[1]) === null) ok = false;
    }
    return ok;
  }
  // Every {qN.band} in the text has to resolve to something. A Not sure answer
  // carries no band, so the clause holding it is dropped rather than printed empty.
  var d_cache = {};
  function bandsResolve(text, ans) {
    var ok = true, m;
    SLOT.lastIndex = 0;
    while ((m = SLOT.exec(text)) !== null) {
      if (m[2] === "band" && !bandOf(ans, m[1])) ok = false;
      if (m[3] && !d_cache[m[3]]) ok = false;
    }
    return ok;
  }
  function pick(block, ans, d) {
    if (!block) return "";
    // The person the business cannot run without is not always the owner, so the
    // definition follows whichever answer raised it.
    var v = (block.variants || []).filter(function (x) {
      return (x.when || []).every(function (pair) { return condMet(ans, pair); });
    })[0];
    if (v && bandsResolve(v.text, ans)) return sentenceCase(fill(v.text, ans, d));
    if (block.precise && resolvable(block.precise, ans) && bandsResolve(block.precise, ans)) return sentenceCase(fill(block.precise, ans, d));
    var banded = block.banded || block.text || "";
    if (!bandsResolve(banded, ans)) {
      // No alt to fall back on, so print nothing. A gap in a sentence is worse than
      // a missing paragraph, and the caller drops the finding entirely.
      return block.alt ? sentenceCase(fill(block.alt, ans, d)) : "";
    }
    return sentenceCase(fill(banded, ans, d));
  }
  // open + whichever evidence clauses actually resolved + close.
  // A clause is evidence only if the answer behind it is one of the two bad ones.
  // Reporting "lead times have held steady" as a symptom of a delivery problem reads
  // as though the tool has not understood its own finding.
  function isSymptom(tpl, ans) {
    var ids = String(tpl).match(/\{(q\d+)\./g) || [];
    if (!ids.length) return true;
    return ids.every(function (m) {
      var q = byId(m.slice(1, -1));
      if (!q) return true;
      var sev = questionSeverity(ans, q);
      return sev === null || sev >= 67;
    });
  }
  function buildDef(def, ans, d) {
    var parts = [], clauses = [];
    (def.evidence || []).forEach(function (e) {
      var src = e.banded || "";
      if (!isSymptom(src, ans)) return;
      if (e.precise && resolvable(e.precise, ans) && bandsResolve(e.precise, ans)) { clauses.push(fill(e.precise, ans, d)); return; }
      if (bandsResolve(src, ans)) clauses.push(fill(src, ans, d));
    });
    // The opening may be a list of sentences. One whose data did not resolve is
    // dropped, same as an evidence clause, so a missing answer never leaves a hole.
    var opens = (Array.isArray(def.open) ? def.open : [def.open]).filter(function (t) {
      return t && bandsResolve(t, ans);
    }).map(function (t) { return fill(t, ans, d).trim(); }).filter(Boolean);
    var open = opens.join(" ");
    // Three items in a row is the shape Ryan banned, so evidence pairs up rather
    // than stacking. Two clauses a sentence, however many resolved.
    var sentences = [];
    for (var i = 0; i < clauses.length; i += 2) {
      var part = clauses.slice(i, i + 2);
      sentences.push(cap(part.length === 1 ? part[0]
        : part.slice(0, -1).join(", ") + " and " + part[part.length - 1]) + ".");
    }
    if (sentences.length) open = (open ? open + " " : "") + sentences.join(" ");
    if (open) parts.push(open);
    if (def.close) parts.push(fill(def.close, ans, d));
    return sentenceCase(parts.join("\n\n"));
  }
  // A fix action either always applies, or names the answers that make it apply.
  // Conditional actions keep the advice honest without making it unpredictable.
  // Risk fixes are plain strings, constraint fixes are objects that can carry a
  // condition. Both go through here so cash flow keeps its conditional actions.
  function actionsFor(fix, ans) {
    return (fix.actions || []).map(function (a) {
      return typeof a === "string" ? { text: a } : a;
    }).filter(function (a) {
      return !a.when || a.when.every(function (pair) { return condMet(ans, pair); });
    }).map(function (a) { return a.text; }).slice(0, fix.max || T("MAX_ACTIONS") || 5);
  }
  // "You are cash flow constrained", split so the constraint itself can be lifted.
  function titleParts(tpl, phrase) {
    var t = String(tpl);
    // A heading that never names the constraint carries no phrase to lift out of it.
    if (t.indexOf("{c}") === -1) return { before: t, phrase: "", after: "" };
    var bits = t.split("{c}");
    return { before: bits[0] || "", phrase: phrase, after: bits[1] || "" };
  }
  /* ---------- supply or demand ----------
     Decided from facts before anything is scored, so the heading can never claim
     something the answers do not support. q34 is the question, could you deliver
     twice the enquiries. q16, q17 and q18 carry it when q34 is not decisive.
     Supply means more customers will not help you. Demand means more customers is
     exactly what you need. */
  function majorOf(ans) {
    function g(id) { var a = ans[id]; return a && a.opt; }
    var why = [];
    var q34 = g("q34");
    if (q34 === "a") { why.push("q34 could not deliver twice the work"); return { id: "supply", why: why }; }
    if (q34 === "d") { why.push("q34 could deliver twice the work easily"); return { id: "demand", why: why }; }
    var sup = 0, dem = 0;
    if (q34 === "b") { sup += 2; why.push("q34 only with a real stretch"); }
    if (q34 === "c") { dem += 2; why.push("q34 with room to spare"); }
    if (["c", "d"].indexOf(g("q16")) !== -1) { sup++; why.push("q16 at or over capacity"); }
    if (g("q16") === "a") { dem++; why.push("q16 under half full"); }
    if (["c", "d"].indexOf(g("q17")) !== -1) { sup++; why.push("q17 turning work away"); }
    if (g("q17") === "a") { dem++; why.push("q17 never turned work away"); }
    if (["c", "d"].indexOf(g("q18")) !== -1) { sup++; why.push("q18 lead time out"); }
    if (g("q18") === "a") { dem++; why.push("q18 lead time shorter"); }
    if (dem > sup) return { id: "demand", why: why };
    // Ties break to supply. Delivering badly loses customers you already have, and
    // that costs more than a slow month does.
    if (sup === dem) why.push("tied, broken to supply");
    return { id: "supply", why: why };
  }
  function familyOf(cid) {
    var f = cfg().families;
    return f.supply.indexOf(cid) !== -1 ? "supply" : "demand";
  }
  /* ---------- the diagnosis ---------- */
  function diagnose(ans) {
    var B = cfg().blocks;
    var scores = scoreConstraints(ans);
    var dq = disqualified(ans);
    var flags = collectFlags(ans);
    // Running out of money is the one finding that cannot wait behind another, so
    // when the block clears its bar the risk is raised at that severity and pinned.
    var cfScore = scores[cfg().cashflowRisk.block].score;
    if (cfScore >= cfg().cashflowRisk.raiseAt) {
      flags.sev.cash_flow = Math.max(flags.sev.cash_flow || 0, cfScore);
    }
    // Primary. Walk the chain in order and call the first one that fails.
    // Order is fixed on purpose. A downstream constraint never overtakes an
    // upstream one on score, because fixing downstream first makes it worse.
    var major = majorOf(ans);
    var M = cfg().majors[major.id];
    // Only the three constraints on the right side of the business can be called.
    // The other three are not reachable, which is what stops the report telling an
    // owner with an empty diary to go and hire.
    var pool = cfg().families[major.id].filter(function (cid) { return !dq[cid]; });
    // Highest score wins, not position. Anything inside the gap falls back to the
    // old order, so a near tie is not decided by noise.
    var ranked = pool.slice().sort(function (a, b) {
      var d = scores[b].score - scores[a].score;
      if (Math.abs(d) >= T("TIE_GAP")) return d;
      return cfg().families[major.id].indexOf(a) - cfg().families[major.id].indexOf(b);
    });
    var hard = pool.filter(function (cid) { return hardTriggered(ans, cid); });
    var primaryId = null, how = null;
    if (hard.length) {
      primaryId = ranked.filter(function (c) { return hard.indexOf(c) !== -1; })[0];
      how = "hard trigger";
    } else if (ranked.length && scores[ranked[0]].score >= T("PRIMARY_FAIL")) {
      primaryId = ranked[0];
      how = "highest in " + major.id + ", score " + scores[primaryId].score + " over " + T("PRIMARY_FAIL");
    }
    var noneSevere = false, wellRun = false;
    if (!primaryId) {
      noneSevere = true;
      primaryId = ranked[0] || cfg().families[major.id][0];
      wellRun = scores[primaryId].score < T("FALLBACK_FLOOR");
      how = "fallback in " + major.id + ", nothing cleared " + T("PRIMARY_FAIL") +
            (wellRun ? ", and nothing cleared the floor either" : "");
    }
    // A confident finding is one that actually failed a gate. Everything else is a
    // reading, and the report has to say so rather than dress it up as a diagnosis.
    var confident = !wellRun;
    var d = derived(ans, primaryId);
    d_cache = d;
    // Risk. Families first, individual flags second.
    // One list, loudest first. Fragility was a symptom of the other risks rather
    // than a family of its own, and once it went the family layer scored nothing.
    var shown = Object.keys(cfg().flags)
      .filter(function (id) { return (flags.sev[id] || 0) >= T("FLAG_PRINT"); })
      .map(function (id) { return { id: id, name: cfg().flags[id].name, sev: flags.sev[id] }; })
      .sort(function (a, b) {
        var pa = cfg().flags[a.id].pinned ? 1 : 0, pb = cfg().flags[b.id].pinned ? 1 : 0;
        return (pb - pa) || (b.sev - a.sev) || a.id.localeCompare(b.id);
      })
      .slice(0, T("MAX_FLAGS_SHOWN"));
    return {
      opening: wellRun ? B.opening.wellRun : noneSevere ? B.opening.noneSevere : B.opening.normal,
      primary: {
        id: primaryId,
        // Only a real failure gets called "constrained". A well run business and a
        // respondent who could not answer enough both get the softer label, because
        // neither of them has been shown to be constrained by anything.
        name: confident ? cfg().constraints[primaryId].name : cfg().constraints[primaryId].loose,
        // The heading is the major, because that is the claim the capacity answers
        // established. The constraint it resolves to sits under it as the cause.
        title: titleParts(confident ? M.title : M.titleLoose, M.name),
        due: M.due + " " + cfg().constraints[primaryId].short.toLowerCase(),
        major: major.id,
        majorTest: M.test,
        body: wellRun ? sentenceCase(fill(B.looseBody, ans, d))
            : buildDef(B.constraintDef[primaryId], ans, d),
        fix: { lead: B.constraintFix[primaryId].lead, actions: actionsFor(B.constraintFix[primaryId], ans) },
        confident: confident
      },
      risk: {
        lead: B.riskLead,
        flags: shown.map(function (f) {
          return { id: f.id, name: f.name, sev: f.sev,
                   // Cash flow arrived from the constraint side, so its definition is
                   // an opening plus evidence clauses rather than a single banded line.
                   body: (B.riskDef[f.id] && B.riskDef[f.id].evidence)
                         ? buildDef(B.riskDef[f.id], ans, d)
                         : pick(B.riskDef[f.id], ans, d),
                   fix: actionsFor({ actions: B.riskFix[f.id] || [], max: 8 }, ans) };
        }).filter(function (f) { return f.body; })
      },
      dontDo: confident ? B.dontDoYet[primaryId] : null,
      closing: { text: wellRun ? B.closing.loose : B.closing.text, cta: B.closing.cta },
      debug: {
        scores: scores, disqualified: dq, how: how, noneSevere: noneSevere, wellRun: wellRun, confident: confident,
        major: major.id, majorWhy: major.why, ranked: ranked,
        // Suppression no longer removes anything from the report, because the minor
        // constraint section it fed is gone. Kept in the working out because it still
        // explains why a loud downstream constraint is not the finding.
        suppressed: suppressedBy(primaryId),
        flagSev: flags.sev,
        risksRaised: Object.keys(flags.sev).sort(function (a, b) { return flags.sev[b] - flags.sev[a]; })
      }
    };
  }
  global.DiagEngine = {
    diagnose: diagnose, scoreConstraints: scoreConstraints, suppressedBy: suppressedBy,
    // exposed so the grammar sweep can assemble a block for any answer set, without
    // needing that answer set to actually make the constraint fire
    _internals: { buildDef: buildDef, pick: pick, derived: derived, fill: fill, bandsResolve: bandsResolve,
                  setCache: function (d) { d_cache = d; } }
  };
})(window);
