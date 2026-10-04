/* Everything needed to set the GoHighLevel side up, generated off content.js so the
   field list can never drift from the questions. */
global.window = {};
require('./content.js'); global.DIAG = window.DIAG;
require('./engine.js'); require('./capture.js');
const D = DIAG, C = window.DiagCapture, fs = require('fs');

// a fully answered set, worst answers, so the example carries real values
const a = {};
D.questions.forEach(q => {
  const o = q.options[Math.min(3, q.options.length - 1)];
  a[q.id] = q.type === 'multi' ? { opts: [o.id] } : { opt: o.id };
});
a.q26 = { opt: 'a' };
a.q7 = { opt: 'c', exact: 48 };

const sample = C.flatten(C.payload(a, 'complete'));
sample.email = 'owner@example.com.au';
sample.first_name = 'Sample';
sample.phone = '+61400000000';
fs.writeFileSync('capture-payload-example.json', JSON.stringify(sample, null, 2));

const esc = s => '"' + String(s).replace(/"/g, '""') + '"';
const rows = [['Field key in the payload', 'Suggested GHL field name', 'Type', 'Goes to', 'What it is']];
D.questions.forEach(q => {
  rows.push(['answers_q' + q.n + '_' + q.id, 'Q' + q.n + ' ' + q.text.slice(0, 60),
             'Multi line text', 'Sheet', 'Their answer, in the words they picked']);
  if (q.exact) rows.push(['answers_q' + q.n + '_' + q.id + '_exact',
             'Q' + q.n + ' exact figure', 'Number', 'Sheet', 'The figure they typed, if they typed one']);
});
const RESULT = {
  major: ['Diagnostic major', 'Text', 'GHL + Sheet', 'supply or demand'],
  constraint: ['Diagnostic constraint', 'Text', 'GHL + Sheet', 'Which of the six was called'],
  verdict: ['Diagnostic verdict', 'Multi line text', 'GHL + Sheet', 'The headline, as printed'],
  confident: ['Diagnostic confident', 'Text', 'GHL + Sheet', 'false means nothing failed outright'],
  underpriced: ['Diagnostic underpriced', 'Text', 'GHL + Sheet', 'true when they close above 80%'],
  risks: ['Diagnostic risks', 'Multi line text', 'GHL + Sheet', 'Every risk that printed'],
  top_risk: ['Diagnostic top risk', 'Text', 'GHL + Sheet', 'The loudest one'],
  scores: ['Diagnostic scores', 'Multi line text', 'Sheet', 'All six block scores'],
  ruled_out: ['Diagnostic ruled out', 'Text', 'Sheet', 'Anything a disqualifier removed'],
  why_major: ['Diagnostic why major', 'Multi line text', 'Sheet', 'Which answers decided supply or demand']
};
Object.keys(RESULT).forEach(k => rows.push(['result_' + k, RESULT[k][0], RESULT[k][1], RESULT[k][2], RESULT[k][3]]));
const META = {
  session: ['Diagnostic session', 'Text', 'GHL + Sheet', 'Ties partial sends to the finished one'],
  stage: ['Diagnostic stage', 'Text', 'GHL + Sheet', 'group-1 to group-10, or complete'],
  answered: ['Diagnostic answered', 'Number', 'GHL + Sheet', 'How many questions they got through'],
  of: ['Diagnostic of', 'Number', 'Sheet', 'How many there were'],
  started_at: ['Diagnostic started', 'Text', 'Sheet', 'When they began'],
  sent_at: ['Diagnostic sent', 'Text', 'Sheet', 'When this send left the browser'],
  content_version: ['Diagnostic content version', 'Text', 'GHL + Sheet', 'Which version of the questions produced it'],
  source: ['Diagnostic source', 'Multi line text', 'Sheet', 'The page it ran on']
};
Object.keys(META).forEach(k => rows.push(['meta_' + k, META[k][0], META[k][1], META[k][2], META[k][3]]));
rows.push(['raw_json', 'Diagnostic raw', 'Multi line text', 'GHL + Sheet',
           'Every answer as codes. The engine is deterministic, so this alone reproduces any report']);

fs.writeFileSync('capture-fields.csv', rows.map(r => r.map(esc).join(',')).join('\n'));
console.log('wrote capture-fields.csv       ' + (rows.length - 1) + ' fields');
console.log('wrote capture-payload-example.json  ' + Object.keys(sample).length + ' keys');
