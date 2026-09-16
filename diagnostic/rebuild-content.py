# The four option rebuild, applied to content.js.
#   - every single select scoring question becomes four options at 0/33/67/100
#   - not sure comes out of all 48 questions that carry one
#   - cash flow leaves the chain and becomes a risk, keeping its questions and its scoring
#   - the six constraints split into two families
# Run once. content.js.bak holds the version before it.
import json, io, re, collections

src = io.open('content.js', encoding='utf-8').read()
pre  = src[:src.index('{')]
post = src[src.rindex('}') + 1:]
D = json.loads(src[src.index('{'): src.rindex('}') + 1])
PROP = json.load(io.open('reband-proposals.json', encoding='utf-8'))

SIX = ['talent', 'fulfilment', 'margin', 'value', 'offer', 'demand']
NEW_W = [0, 33, 67, 100]
Q = {q['id']: q for q in D['questions']}

# ---------------------------------------------------------------- 1. new bands
# Ten questions change shape, so their options are written out in full. The other
# nineteen keep their text, band and flags and only lose the not sure.
NEW = {
 'q15': [('Two or fewer',        'two or fewer direct reports'),
         ('Three to six',        'three to six direct reports'),
         ('Seven to twelve',     'seven to twelve direct reports'),
         ('More than twelve',    'more than twelve direct reports')],
 'q16': [('Under half full',     'under half full'),
         ('About two thirds',    'around two thirds full'),
         ('Full, or close to it','at or near full'),
         ("Over capacity, we're behind", 'over capacity and behind')],
 'q57': [('Nearly all of it',    'nearly all'),
         ('More than half',      'more than half'),
         ('About half or less',  'about half or less'),
         ('A small slice, they spread it around', 'only a small slice')],
 'q25': [('Yes, we ask every one and we know',      'you ask every one and you know'),
         ('We ask sometimes, so we know for some',  'you ask sometimes, so you know for some'),
         ("We've got a theory, we've never asked",  "you've got a theory and you've never asked"),
         ('No idea',                                'no idea')],
 'q27': [("Timing, they weren't ready",  'timing'),
         ('Price, we were too expensive','price'),
         ('They went with someone else', 'a competitor'),
         ("They did nothing at all, or we don't know", 'inaction, or something you cannot put your finger on')],
 'q31': [('More than 30',        'above 30'),
         ('11 to 30',            'in the 11 to 30 range'),
         ('3 to 10',             'in the 3 to 10 range'),
         ('0 to 2',              'a handful at most')],
 'q34': [("No, we'd be well over capacity",        'not a chance'),
         ('Yes, with a real stretch',              'with a real stretch'),
         ('Yes, with a bit of room to spare',      'with a bit of room to spare'),
         ("Yes, easily, we've got the space now",  'comfortably, with the space sitting there')],
 'q35': [('Yes, the same things every week',   "you're generating enquiries the same way every week"),
         ('Yes, but it fits around the work',  "you're generating enquiries when the work allows"),
         ('On and off, when it goes quiet',    "you're generating enquiries on and off"),
         ('No, it all comes to us',            "you're doing nothing to generate enquiries, it all comes to you")],
 'q38': [('In the last 6 months',   'you last raised prices inside the last six months'),
         ('6 to 12 months ago',     'you last raised prices in the last year'),
         ('1 to 2 years ago',       'you last raised prices one to two years ago'),
         ('More than 2 years ago, or never', "you last raised prices more than two years ago, if ever")],
 'q40': [('Yes, job by job',                  'job by job'),
         ('Yes by category, not job by job',  'by category rather than job by job'),
         ("Roughly, it's a feel",             'roughly, on feel'),
         ('No',                               'not at all')],
}
# Flags to carry onto the rewritten options, by new option index.
KEEP_FLAGS = {
 'q15': {}, 'q16': {}, 'q57': {}, 'q25': {}, 'q27': {}, 'q31': {},
 'q34': {}, 'q35': {}, 'q38': {}, 'q40': {},
}
for qid, old in [(k, Q[k]) for k in NEW]:
    for i, o in enumerate(old['options']):
        if o.get('flags'):
            KEEP_FLAGS[qid].setdefault(o['text'], o['flags'])

reband = 0
for q in D['questions']:
    if q.get('section') not in SIX or not q.get('weight') or q.get('type') == 'multi':
        continue
    if q['id'] in NEW:
        opts = []
        for i, (text, band) in enumerate(NEW[q['id']]):
            o = {'id': 'abcd'[i], 'text': text, 'band': band, 'w': NEW_W[i]}
            if text in KEEP_FLAGS[q['id']]:
                o['flags'] = KEEP_FLAGS[q['id']][text]
            opts.append(o)
        q['options'] = opts
    else:
        keep = [o for o in q['options'] if not o.get('notSure')]
        assert len(keep) == 4, q['id']
        for i, o in enumerate(keep):
            o['id'] = 'abcd'[i]
            o['w'] = NEW_W[i]
        q['options'] = keep
    reband += 1

# --------------------------------------------------- 2. not sure, everywhere else
stripped = 0
for q in D['questions']:
    before = len(q.get('options', []))
    q['options'] = [o for o in q.get('options', []) if not o.get('notSure')]
    stripped += before - len(q['options'])

# ------------------------------------------- 3. cash flow leaves, families arrive
D['chain'] = SIX
D['families'] = {'supply': ['talent', 'fulfilment', 'margin'],
                 'demand': ['value', 'offer', 'demand']}
# The cash flow block keeps its questions and its weights. The engine scores it as
# before and raises a risk off that score instead of calling it as a constraint.
D['cashflowRisk'] = {'block': 'cashflow', 'raiseAt': 45}
D['thresholds']['TIE_GAP'] = 5
D['thresholds'].pop('NOT_SURE_DATA_FLAG', None)
D['hardTriggers'].pop('cashflow', None)

# Triggers that named an option id which no longer exists.
D['hardTriggers']['fulfilment'] = [{'all': [['q16', ['c', 'd']], ['q17', ['c', 'd']]]}]
D['hardTriggers']['value']      = [{'all': [['q21', ['c', 'd']], ['q22', ['c', 'd']]]},
                                   {'all': [['q57', ['c', 'd']], ['q24', ['c', 'd']]]}]
D['hardTriggers']['demand']     = [{'all': [['q31', ['c', 'd']], ['q34', ['c', 'd']], ['q33', ['c', 'd']]]}]
D['hardTriggers']['margin']     = [{'all': [['q37', ['d']], ['q36', ['c', 'd']]]}]

io.open('content.js', 'w', encoding='utf-8').write(pre + json.dumps(D, indent=2, ensure_ascii=False) + post)
print('rebanded %d questions, stripped %d not sure options' % (reband, stripped))
print('chain now:', D['chain'])
