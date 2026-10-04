/* Business Diagnostic, data capture.
   Sends two things to one endpoint, kept apart inside the payload.
     answers  every question, as the words they picked, plus the codes
     result   what the engine made of it
   One POST per group boundary and one at the report, so somebody who walks away
   at question 31 is still a record rather than nothing.

   It never blocks the report. A failed send is logged and dropped, because the
   person in front of us came for a diagnosis, not to watch a spinner.
*/
(function (global) {
  "use strict";
  var D = global.DIAG, cfg = (D && D.capture) || {};
  var SENT = {};                                  // one send per stage per session
  var started = null, sid = null;

  function id() {
    return "d-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
  }
  function session() {
    if (sid) return sid;
    try {
      sid = localStorage.getItem("diag-sid");
      started = localStorage.getItem("diag-started");
      if (!sid) { sid = id(); localStorage.setItem("diag-sid", sid); }
      if (!started) { started = new Date().toISOString(); localStorage.setItem("diag-started", started); }
    } catch (e) { sid = sid || id(); started = started || new Date().toISOString(); }
    return sid;
  }
  function byId(qid) {
    for (var i = 0; i < D.questions.length; i++) if (D.questions[i].id === qid) return D.questions[i];
    return null;
  }
  // The label, not the code. A spreadsheet column reading "More than 80%" is still
  // readable in a year. One reading "a" is not, and the codes move when bands do.
  function label(q, a) {
    if (!a) return "";
    var picked = q.type === "multi" ? (a.opts || []) : (a.opt ? [a.opt] : []);
    return picked.map(function (oid) {
      for (var i = 0; i < q.options.length; i++) if (q.options[i].id === oid) return q.options[i].text;
      return oid;
    }).join(" | ");
  }

  function payload(answers, stage) {
    var out = { answers: {}, result: {}, meta: {} }, codes = {}, n = 0;
    D.questions.forEach(function (q) {
      var a = answers[q.id];
      out.answers["q" + q.n + "_" + q.id] = label(q, a);
      if (a) {
        n++;
        codes[q.id] = q.type === "multi" ? (a.opts || []) : a.opt;
        if (a.exact !== undefined && a.exact !== null && a.exact !== "") {
          out.answers["q" + q.n + "_" + q.id + "_exact"] = a.exact;
          codes[q.id + "_exact"] = a.exact;
        }
      }
    });
    // The report is only generated once the whole thing is answered. Before that
    // the result block stays empty rather than carrying a half formed finding.
    if (stage === "complete" && global.DiagEngine) {
      var r = global.DiagEngine.diagnose(answers);
      out.result = {
        major: r.debug.major,
        constraint: r.primary.id,
        verdict: (r.primary.title.before + r.primary.title.phrase + r.primary.title.after) + ". " + r.primary.due + ".",
        confident: r.primary.confident,
        underpriced: (r.primary.prompts || []).length > 0,
        risks: r.risk.flags.map(function (f) { return f.name; }).join(" | "),
        top_risk: r.risk.flags.length ? r.risk.flags[0].name : "",
        scores: Object.keys(r.debug.scores).map(function (k) {
          return k + "=" + r.debug.scores[k].score; }).join(" | "),
        ruled_out: Object.keys(r.debug.disqualified).join(" | "),
        why_major: (r.debug.majorWhy || []).join("; ")
      };
    }
    out.meta = {
      session: session(),
      stage: stage,
      answered: n,
      of: D.questions.length,
      started_at: started,
      sent_at: new Date().toISOString(),
      content_version: D.meta && D.meta.version ? D.meta.version : "",
      source: global.location ? global.location.href : ""
    };
    // The codes, compact. The engine is deterministic, so this one field is enough
    // to reproduce any report from any version of the questions.
    out.raw_json = JSON.stringify(codes);
    return out;
  }

  // GoHighLevel's inbound webhook reads a flat body, so the three namespaces are
  // flattened with a prefix rather than nested. Everything stays separable.
  function flatten(o) {
    var out = {};
    ["answers", "result", "meta"].forEach(function (ns) {
      Object.keys(o[ns] || {}).forEach(function (k) { out[ns + "_" + k] = o[ns][k]; });
    });
    out.raw_json = o.raw_json;
    return out;
  }

  function send(answers, stage, contact) {
    if (!cfg.url) return;                         // nothing configured, nothing sent
    if (SENT[stage] && stage !== "complete") return;
    SENT[stage] = true;
    var body = flatten(payload(answers, stage));
    if (contact) Object.keys(contact).forEach(function (k) { body[k] = contact[k]; });
    try {
      fetch(cfg.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true                           // survives the tab closing mid send
      })["catch"](function () {});
    } catch (e) {}
  }

  global.DiagCapture = { send: send, payload: payload, flatten: flatten, session: session };
})(window);
