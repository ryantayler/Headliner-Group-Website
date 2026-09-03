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
    if (q.scoreRule === "unowned_layers") {
      if (sel.some(function (o) { return o.exclusive; })) return 100;
      var layers = q.options.filter(function (o) { return !o.exclusive; }).length;
      var owned = sel.filter(function (o) { return !o.exclusive; }).length;
      return Math.round(((layers - owned) / layers) * 100);
    }
    if (q.scoreRule === "owner_task_load") {
      if (sel.some(function (o) { return o.exclusive; })) return 0;
      return Math.min(100, sel.length * 34);
    }
    if (q.scoreRule === "channel_count") {
      if (sel.some(function (o) { return o.exclusive; })) return 100;
      var n = sel.length;
      return Math.max(0, Math.min(100, 100 - (n - 1) * 25));
    }
    var o = sel[0];
    return typeof o.w === "number" ? o.w : 0;
  }

  /* ---------- constraint block scores ---------- */
  function scoreConstraints(ans) {
    var out = {};
    cfg().chain.forEach(function (cid) {
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
    var raw = {}, counts = {}, notSure = 0;
    cfg().questions.forEach(function (q) {
      selected(ans, q).forEach(function (o) {
        if (o.notSure) notSure++;
        (o.flags || []).forEach(function (f) {
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
    if (counts.no_data) raw.no_data = Math.max(raw.no_data, Math.min(100, 40 + 15 * counts.no_data));
    if (notSure >= T("NOT_SURE_DATA_FLAG")) raw.no_data = Math.max(raw.no_data || 0, 80);
    return { sev: raw, counts: counts, notSureCount: notSure };
  }

  /* ---------- risk families ---------- */
  function scoreFamilies(flagSev) {
    var fams = {}, defs = cfg().flags;
    Object.keys(cfg().riskFamilies).forEach(function (fid) { fams[fid] = { id: fid, flags: [], max: 0, raised: 0, total: 0 }; });
    Object.keys(defs).forEach(function (id) {
      var f = fams[defs[id].family]; f.total++;
      var sev = flagSev[id] || 0;
      if (sev > 0) f.flags.push({ id: id, name: defs[id].name, sev: sev });
      f.max = Math.max(f.max, sev);
      if (sev >= T("FLAG_PRINT")) f.raised++;
    });
    Object.keys(fams).forEach(function (fid) {
      var f = fams[fid];
      f.score = Math.round(0.6 * f.max + 0.4 * (100 * f.raised / f.total));
      f.flags.sort(function (a, b) { return b.sev - a.sev; });
    });
    return fams;
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
    // A Not sure answer has no band by design. Returning empty is what lets the
    // clause holding it drop out of the sentence instead of printing "not sure".
    if (sel[0].notSure) return "";
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
    if (sel.some(function (o) { return o.exclusive; })) {
      d.unownedLayers = "Operations, sales, marketing, the numbers and managing delivery all sit with you rather than with somebody whose job it is.";
    } else {
      var owned = sel.map(function (o) { return o.id; });
      var missing = Object.keys(LAYER_NAMES).filter(function (k) { return owned.indexOf(k) === -1; }).map(function (k) { return LAYER_NAMES[k]; });
      if (!missing.length) d.unownedLayers = "";
      else if (missing.length === 1) d.unownedLayers = cap(missing[0]) + " sits with you rather than with somebody whose job it is.";
      else d.unownedLayers = cap(missing.slice(0, -1).join(", ") + " and " + missing[missing.length - 1]) + " sit with you rather than with somebody whose job it is.";
    }
    var q13 = byId("q13"), t = selected(ans, q13)
      .filter(function (o) { return !o.exclusive; })     // the opt out is not a task
      .map(function (o) { return o.text.toLowerCase(); });
    // A serial comma when an item carries its own "and", so "chasing invoices and
    // doing the books, and fixing things that went wrong" does not run together.
    var joiner = t.some(function (x) { return / and /.test(x); }) ? ", and " : " and ";
    d.ownerTasks = t.length === 0 ? ""
      : t.length === 1 ? t[0]
      : t.slice(0, -1).join(", ") + joiner + t[t.length - 1];
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
  function buildDef(def, ans, d) {
    var parts = [], clauses = [];
    (def.evidence || []).forEach(function (e) {
      if (e.precise && resolvable(e.precise, ans) && bandsResolve(e.precise, ans)) { clauses.push(fill(e.precise, ans, d)); return; }
      if (bandsResolve(e.banded, ans)) clauses.push(fill(e.banded, ans, d));
    });
    // The opening may be a list of sentences. One whose data did not resolve is
    // dropped, same as an evidence clause, so a missing answer never leaves a hole.
    var opens = (Array.isArray(def.open) ? def.open : [def.open]).filter(function (t) {
      return t && bandsResolve(t, ans);
    }).map(function (t) { return fill(t, ans, d).trim(); }).filter(Boolean);
    var open = opens.join(" ");
    // Four or five clauses in one sentence is a comma pile up, so they break into
    // sentences of at most three.
    var sentences = [];
    for (var i = 0; i < clauses.length; i += 3) {
      var part = clauses.slice(i, i + 3);
      sentences.push(cap(part.length === 1 ? part[0]
        : part.slice(0, -1).join(", ") + " and " + part[part.length - 1]) + ".");
    }
    if (sentences.length) open = (open ? open + " " : "") + sentences.join(" ");
    if (open) parts.push(open);
    if (def.close) parts.push(fill(def.close, ans, d));
    return sentenceCase(parts.join("\n\n"));
  }

  /* ---------- the diagnosis ---------- */
  function diagnose(ans) {
    var B = cfg().blocks;
    var scores = scoreConstraints(ans);
    var dq = disqualified(ans);
    var flags = collectFlags(ans);

    // Primary. Walk the chain in order and call the first one that fails.
    // Order is fixed on purpose. A downstream constraint never overtakes an
    // upstream one on score, because fixing downstream first makes it worse.
    var primaryId = null, how = null;
    for (var i = 0; i < cfg().chain.length; i++) {
      var cid = cfg().chain[i];
      if (dq[cid]) continue;
      if (hardTriggered(ans, cid)) { primaryId = cid; how = "hard trigger"; break; }
      if (scores[cid].score >= T("PRIMARY_FAIL")) { primaryId = cid; how = "score " + scores[cid].score + " over " + T("PRIMARY_FAIL"); break; }
    }
    var noneSevere = false, wellRun = false;
    if (!primaryId) {
      // Nothing failed outright. Name the tightest thing, chain order breaking ties.
      noneSevere = true;
      var best = null;
      cfg().chain.forEach(function (cid) {
        if (dq[cid]) return;
        if (!best || scores[cid].score > scores[best].score) best = cid;
      });
      primaryId = best || cfg().chain[0];
      wellRun = scores[primaryId].score < T("FALLBACK_FLOOR");
      how = "fallback, nothing cleared " + T("PRIMARY_FAIL") + (wellRun ? ", and nothing cleared the floor either" : "");
    }
    // Too much of the questionnaire came back Not sure to stand behind a diagnosis.
    // The finding still prints, framed as provisional, and data blindness carries the report.
    var tooUnsure = flags.notSureCount >= 15;
    // A confident finding is one that actually failed a gate. Everything else is a
    // reading, and the report has to say so rather than dress it up as a diagnosis.
    var confident = !wellRun && !tooUnsure;

    // Minor constraint. Higher bar than the primary, then suppression.
    var supp = suppressedBy(primaryId);
    var minorId = null, minorRejected = [];
    cfg().chain.forEach(function (cid) {
      if (cid === primaryId || dq[cid]) return;
      if (scores[cid].score < T("MINOR_PRINT")) return;
      if (supp.indexOf(cid) !== -1) { minorRejected.push({ id: cid, why: "suppressed by " + primaryId }); return; }
      if (!minorId || scores[cid].score > scores[minorId].score) minorId = cid;
    });

    var d = derived(ans, primaryId);
    d_cache = d;

    // Risk. Families first, individual flags second.
    var fams = scoreFamilies(flags.sev);
    var ranked = Object.keys(fams).map(function (k) { return fams[k]; })
      .sort(function (a, b) { return b.score - a.score; });
    var primaryFam = ranked[0] && ranked[0].score >= T("RISK_FAMILY_PRINT") ? ranked[0] : null;
    var minorFam = ranked[1] && ranked[1].score >= T("MINOR_RISK_PRINT") ? ranked[1] : null;

    var shown = primaryFam
      ? primaryFam.flags.filter(function (f) { return f.sev >= T("FLAG_PRINT"); }).slice(0, T("MAX_FLAGS_SHOWN"))
      : [];

    // Minor risk. Names one specific flag from the second family rather than the
    // family itself, because "there is also fragility here" tells nobody anything.
    var minorRisk = null;
    if (minorFam) {
      var top = minorFam.flags.filter(function (f) {
        return f.sev >= T("FLAG_PRINT") && shown.indexOf(f) === -1;
      })[0];
      if (top && B.minorRisk[top.id]) {
        minorRisk = { family: minorFam.id, id: top.id, name: top.name,
                      framing: B.minorRisk.framing, line: B.minorRisk[top.id] };
      }
    }

    // Compound. One block only, the highest priority match on the primary constraint.
    var compound = null;
    var shownIds = shown.map(function (f) { return f.id; });
    var matches = B.compound.filter(function (c) {
      // Naming a risk the reader has not been shown reads as a non sequitur, so a
      // compound block only fires on a flag that actually printed above it.
      return c.constraint === primaryId && shownIds.indexOf(c.flag) !== -1;
    }).sort(function (a, b) {
      return a.priority - b.priority || (flags.sev[b.flag] - flags.sev[a.flag]);
    });
    for (var mi = 0; mi < matches.length && !compound; mi++) {
      if (!bandsResolve(matches[mi].text, ans)) continue;
      compound = { key: matches[mi].constraint + " + " + matches[mi].flag,
                   text: sentenceCase(fill(matches[mi].text, ans, d)) };
    }

    return {
      opening: tooUnsure ? B.opening.tooUnsure : wellRun ? B.opening.wellRun : noneSevere ? B.opening.noneSevere : B.opening.normal,
      primary: {
        id: primaryId,
        // Only a real failure gets called "constrained". A well run business and a
        // respondent who could not answer enough both get the softer label, because
        // neither of them has been shown to be constrained by anything.
        name: confident ? cfg().constraints[primaryId].name : cfg().constraints[primaryId].loose,
        title: confident ? B.constraintDef[primaryId].title : B.constraintDef[primaryId].titleLoose,
        body: tooUnsure ? sentenceCase(fill(B.unsureBody, ans, d))
            : wellRun ? sentenceCase(fill(B.looseBody, ans, d))
            : buildDef(B.constraintDef[primaryId], ans, d),
        fix: B.constraintFix[primaryId],
        confident: confident
      },
      minor: minorId ? { id: minorId, line: sentenceCase(fill(B.minorConstraint[minorId], ans, d)) } : null,
      compound: compound,
      risk: primaryFam ? {
        family: primaryFam.id,
        name: cfg().riskFamilies[primaryFam.id].name,
        framing: B.riskFamilyFraming[primaryFam.id],
        flags: shown.map(function (f) {
          return { id: f.id, name: f.name, sev: f.sev, body: pick(B.riskDef[f.id], ans, d), fix: B.riskFix[f.id] };
        }).filter(function (f) { return f.body; })
      } : { family: null, framing: B.riskFamilyFraming.none, flags: [] },
      minorRisk: minorRisk,
      dontDo: confident ? B.dontDoYet[primaryId] : null,
      closing: { text: tooUnsure ? B.closing.unsure : wellRun ? B.closing.loose : B.closing.text, cta: B.closing.cta },
      debug: {
        scores: scores, disqualified: dq, how: how, noneSevere: noneSevere, wellRun: wellRun, tooUnsure: tooUnsure, confident: confident,
        suppressed: supp, minorRejected: minorRejected,
        flagSev: flags.sev, notSureCount: flags.notSureCount,
        families: ranked.map(function (f) { return { id: f.id, score: f.score, max: f.max, raised: f.raised, total: f.total }; })
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
