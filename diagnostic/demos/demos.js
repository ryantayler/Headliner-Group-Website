// Requiring this file must not wipe an engine the caller already loaded.
if (!global.window) {
  global.window = {};
  require('/home/user/Headliner-Group-Website/diagnostic/content.js');
  global.DIAG = window.DIAG;
  require('/home/user/Headliner-Group-Website/diagnostic/engine.js');
}

const DEMOS = [
{ id:"northline", name:"Northline AV", trade:"Audio visual hire and event production",
  where:"Melbourne", size:"$1m to $3m, eleven staff", years:"Nine years trading",
  story:"Busy, profitable on paper, and never has any money. Hires in gear and pays crew the week of the job, then waits two months on a venue group that pays when it feels like it.",
  a:{ q1:"c", q2:"c", q3:["a","b"], q53:"c", q4:"c", q5:"d",
      q54:"e", q7:"d", q55:"d", q6:"c", q8:"c", q9:"c", q10:"a",
      q11:["a","b","e"], q12:"b", q13:["a","d"], q56:"b", q14:"b", q15:"c",
      q16:"c", q17:"b", q18:"b", q19:"b", q20:"b",
      q21:"a", q57:"b", q22:"b", q23:"b", q24:"b", q25:"b",
      q26:"b", q27:"a", q28:"b", q29:"b", q30:"b",
      q31:"c", q32:["a","b","d"], q33:"b", q34:"b", q35:"b",
      q36:"b", q37:"b", q38:"b", q39:"b", q40:"b",
      q41:"e", q42:"b", q43:"b", q44:["a"], q58:"a", q45:"b", q46:"b",
      q47:"b", q48:"a", q49:"b", q50:"b", q51:"b", q52:"b" },
  exact:{ q7:52, q41:54 } },

{ id:"fold", name:"Fold Event Co", trade:"End to end event management",
  where:"Sydney", size:"$3m to $10m, twenty six staff", years:"Twelve years trading",
  story:"Grew from six people to twenty six and the founder is still the general manager, the head of sales and the final say on every quote.",
  a:{ q1:"d", q2:"d", q3:["b","d"], q53:"b", q4:"d", q5:"d",
      q54:"b", q7:"b", q55:"b", q6:"a", q8:"b", q9:"a", q10:"a",
      q11:["e"], q12:"d", q13:["a","b","g"], q56:"d", q14:"d", q15:"d",
      q16:"c", q17:"b", q18:"c", q19:"b", q20:"c",
      q21:"a", q57:"b", q22:"a", q23:"a", q24:"b", q25:"b",
      q26:"b", q27:"b", q28:"b", q29:"b", q30:"b",
      q31:"c", q32:["a","b"], q33:"b", q34:"b", q35:"b",
      q36:"c", q37:"c", q38:"d", q39:"c", q40:"c",
      q41:"c", q42:"b", q43:"b", q44:["b","g"], q58:"g", q45:"b", q46:"c",
      q47:"c", q48:"c", q49:"d", q50:"c", q51:"b", q52:"c" },
  exact:{ q41:26 } },

{ id:"kerrick", name:"Kerrick Staging", trade:"Staging, rigging and custom fabrication",
  where:"Brisbane", size:"$1m to $3m, fourteen staff", years:"Seven years trading",
  story:"Turning work away most months. One fabricator holds every drawing and every supplier relationship in his head.",
  a:{ q1:"c", q2:"c", q3:["a","b","c"], q53:"b", q4:"c", q5:"b",
      q54:"b", q7:"b", q55:"b", q6:"a", q8:"b", q9:"b", q10:"a",
      q11:["a","b","d","e"], q12:"b", q13:["d","h"], q56:"b", q14:"b", q15:"c",
      q16:"e", q17:"d", q18:"d", q19:"d", q20:"c",
      q21:"a", q57:"b", q22:"a", q23:"a", q24:"b", q25:"b",
      q26:"a", q27:"b", q28:"b", q29:"b", q30:"b",
      q31:"d", q32:["a","b","g"], q33:"a", q34:"c", q35:"b",
      q36:"b", q37:"b", q38:"b", q39:"c", q40:"b",
      q41:"b", q42:"b", q43:"a", q44:["c","d"], q58:"c", q45:"b", q46:"c",
      q47:"c", q48:"b", q49:"c", q50:"b", q51:"a", q52:"b" },
  exact:{ q16:118 } },

{ id:"halcyon", name:"Halcyon Studio", trade:"Brand films and content production",
  where:"Melbourne", size:"$250k to $1m, four staff", years:"Three years trading",
  story:"Plenty of enquiries off the back of good work. Every job gets scoped and priced from scratch, and most of them quietly go nowhere.",
  a:{ q1:"b", q2:"b", q3:["b"], q53:"c", q4:"b", q5:"c",
      q54:"b", q7:"b", q55:"a", q6:"a", q8:"b", q9:"a", q10:"b",
      q11:["a","e"], q12:"b", q13:["a","b"], q56:"b", q14:"b", q15:"b",
      q16:"b", q17:"a", q18:"b", q19:"b", q20:"b",
      q21:"b", q57:"c", q22:"b", q23:"b", q24:"b", q25:"b",
      q26:"d", q27:"d", q28:"d", q29:"c", q30:"c",
      q31:"c", q32:["a","e"], q33:"b", q34:"a", q35:"b",
      q36:"b", q37:"c", q38:"c", q39:"c", q40:"b",
      q41:"c", q42:"c", q43:"c", q44:["g"], q58:"g", q45:"b", q46:"a",
      q47:"b", q48:"a", q49:"c", q50:"c", q51:"a", q52:"b" },
  exact:{ q26:9 } },

{ id:"tallow", name:"Tallow Crew", trade:"Event labour hire and crewing",
  where:"Perth", size:"$3m to $10m, sixty on the books", years:"Fifteen years trading",
  story:"Full order book, growing headcount, and less left at the end of each year than five years ago. Nobody has repriced anything since before the wage rises.",
  a:{ q1:"d", q2:"e", q3:["d"], q53:"a", q4:"d", q5:"b",
      q54:"b", q7:"c", q55:"b", q6:"a", q8:"b", q9:"a", q10:"c",
      q11:["a","b","d","e"], q12:"a", q13:["d"], q56:"b", q14:"b", q15:"c",
      q16:"c", q17:"b", q18:"b", q19:"b", q20:"b",
      q21:"a", q57:"b", q22:"a", q23:"a", q24:"b", q25:"b",
      q26:"b", q27:"a", q28:"b", q29:"b", q30:"b",
      q31:"d", q32:["a","b","f"], q33:"a", q34:"b", q35:"b",
      q36:"d", q37:"d", q38:"e", q39:"d", q40:"c",
      q41:"c", q42:"c", q43:"b", q44:["n"], q45:"b", q46:"b",
      q47:"c", q48:"b", q49:"b", q50:"b", q51:"b", q52:"b" },
  exact:{ q36:11, q37:0 } }
];

module.exports = { DEMOS, build: d => {
  const a = {};
  for (const k of Object.keys(d.a)) a[k] = Array.isArray(d.a[k]) ? {opts:d.a[k]} : {opt:d.a[k]};
  for (const k of Object.keys(d.exact || {})) { a[k] = a[k] || {}; a[k].exact = d.exact[k]; }
  return a;
}};

if (require.main === module) {
  for (const d of DEMOS) {
    const r = window.DiagEngine.diagnose(module.exports.build(d));
    console.log(`${d.name.padEnd(16)} ${r.primary.id.padEnd(11)} (${r.debug.how})`);
    console.log(`   minor constraint : ${r.minor ? r.minor.id : "none"}`);
    console.log(`   risk family      : ${r.risk.family || "none"}  ->  ${r.risk.flags.map(f=>f.name).join(", ") || "nothing named"}`);
    console.log(`   minor risk       : ${r.minorRisk ? r.minorRisk.name : "none"}`);
    console.log(`   compound         : ${r.compound ? r.compound.key : "none"}`);
    console.log(`   scores           : ${D_scores(r)}`);
    console.log();
  }
}
function D_scores(r){ return Object.entries(r.debug.scores).map(([k,v])=>`${k.slice(0,4)}:${v.score}`).join(" "); }
