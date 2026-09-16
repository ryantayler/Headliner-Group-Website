# Generates the workbook Ryan fills in to set the new four option bands.
# Reads content.js directly so it can never drift from what ships.
import json, re, io
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

src = io.open('content.js', encoding='utf-8').read()
D = json.loads(src[src.index('{'): src.rindex('}') + 1])

SIX = ['talent', 'fulfilment', 'margin', 'value', 'offer', 'demand']
FAM = {'talent':'Supply','fulfilment':'Supply','margin':'Supply',
       'value':'Demand','offer':'Demand','demand':'Demand'}
NEW_SEV = [0, 33, 67, 100]
NEW_LBL = ['Best answer', 'Second best', 'Second worst', 'Worst answer']

HEAD = PatternFill('solid', fgColor='0A0A0A')
BAND = PatternFill('solid', fgColor='E7EBE9')
FILLIN = PatternFill('solid', fgColor='FFF7E8')
GOOD = PatternFill('solid', fgColor='EAF6F2')
BADF = PatternFill('solid', fgColor='FBECE8')
W = Font(color='FFFFFF', bold=True, size=11)
B = Font(bold=True)
MUTE = Font(color='6B7370', size=10)
THIN = Border(bottom=Side('thin', color='D7DDDA'))
wrap = Alignment(wrap_text=True, vertical='top')

wb = Workbook(); wb.remove(wb.active)

def head(ws, cols, widths):
    ws.append(cols)
    for i, c in enumerate(cols, 1):
        ws.cell(1, i).fill = HEAD; ws.cell(1, i).font = W
        ws.column_dimensions[get_column_letter(i)].width = widths[i-1]
    ws.freeze_panes = 'A2'

# ---------- 1. Read me ----------
ws = wb.create_sheet('Read me')
ws.column_dimensions['A'].width = 24; ws.column_dimensions['B'].width = 104
rows = [
 ('WHAT THIS IS', 'The four option rebuild. You set the bands, I build to spec. Fill in the Set the bands tab and send it back.'),
 ('', ''),
 ('THE RULE', 'Every single select scoring question gets exactly four options. Two good, two bad. No middle, no not sure.'),
 ('SEVERITIES', 'Pre filled at 0, 33, 67 and 100 and not yours to change. They are what make the maths work, see below.'),
 ('YOUR JOB', 'Write the four option texts, in order best to worst. The line between option 2 and option 3 is the benchmark.'),
 ('', ''),
 ('WHY 0/33/67/100', 'Symmetric around 50, so every question has an expected score of 50 under a random answer. Which means every'),
 ('', 'constraint does too, and all six fail at the same rate. That is the even spread you asked for, and it only'),
 ('', 'works if every question is four options with symmetric severities. One five option question breaks it.'),
 ('', ''),
 ('WHAT ELSE CHANGES', ''),
 ('Selection', 'Highest score wins, not chain order. Within a family only, because the supply or demand call comes first.'),
 ('Tiebreak', 'Under a 5 point gap, the old order decides. Supply goes talent, fulfilment, margin. Demand goes value, offer, demand.'),
 ('Not sure', 'Gone from all 48 questions that have one. Takes the too unsure report state and the unsure title with it.'),
 ('New question', 'One added, covering what the business actually measures. Feeds a risk, not a constraint.'),
 ('Cash flow', 'Leaves the chain and becomes a risk. Six constraints, three per family.'),
 ('Multi selects', 'Three stay as they are, exempt from the four option rule. Their score rules get rescaled so they stop'),
 ('', 'running hot against the single selects. Nothing for you to fill in there, it is a maths fix.'),
 ('Risks', 'Unchanged in how they work. They read answers only and never look at the constraint.'),
]
for k, v in rows:
    ws.append([k, v]); r = ws.max_row
    ws.cell(r,1).font = B; ws.cell(r,2).alignment = wrap

# ---------- 2. Set the bands ----------
ws = wb.create_sheet('Set the bands')
head(ws, ['Question','Family','Block','Weight','Question text','Today','Sev',
          'YOUR OPTION','Sev','Good or bad'],
         [11, 9, 12, 8, 62, 46, 6, 50, 6, 12])
singles = [q for q in D['questions']
           if q.get('section') in SIX and q.get('weight', 0) > 0 and q.get('type') != 'multi']
for q in singles:
    # a not sure carries w:0 as well, so exclude it here or it lists twice
    opts = [o for o in q.get('options', [])
            if isinstance(o.get('w'), (int, float)) and not o.get('notSure')]
    ns = [o for o in q.get('options', []) if o.get('notSure')]
    ws.append([q['id'], FAM[q['section']], q['section'], q.get('weight'), q['text'],
               '', '', '', '', ''])
    r = ws.max_row
    for c in range(1, 11):
        ws.cell(r, c).fill = BAND; ws.cell(r, c).font = B; ws.cell(r, c).border = THIN
    ws.cell(r, 5).alignment = wrap
    n = max(len(opts) + len(ns), 4)
    for i in range(n):
        cur = ''
        if i < len(opts): cur = opts[i]['text']
        elif i - len(opts) < len(ns): cur = ns[i - len(opts)]['text'] + '   (to be removed)'
        sev = opts[i]['w'] if i < len(opts) else ''
        row = ['', '', '', '', '', cur, sev,
               '', NEW_SEV[i] if i < 4 else '', NEW_LBL[i] if i < 4 else '']
        ws.append(row); rr = ws.max_row
        ws.cell(rr, 6).alignment = wrap; ws.cell(rr, 6).font = MUTE
        ws.cell(rr, 7).font = MUTE
        if i < 4:
            ws.cell(rr, 8).fill = FILLIN; ws.cell(rr, 8).alignment = wrap
            tint = GOOD if i < 2 else BADF
            ws.cell(rr, 9).fill = tint; ws.cell(rr, 10).fill = tint
            ws.cell(rr, 10).font = MUTE
    ws.append([])

# ---------- 3. Multi selects ----------
ws = wb.create_sheet('Multi selects')
head(ws, ['Question','Block','Rule','Question text','Options today','What I am changing'],
         [11, 12, 20, 60, 12, 62])
for q in D['questions']:
    if q.get('type') == 'multi' and q.get('section') in SIX and q.get('weight', 0) > 0:
        ws.append([q['id'], q['section'], q.get('scoreRule',''), q['text'],
                   len(q.get('options', [])),
                   'Stays a multi select. The rule is rescaled so its scores sit on the same '
                   'spread as a four option single select, instead of spiking high.'])
        for c in (4, 6): ws.cell(ws.max_row, c).alignment = wrap

# ---------- 4. Not sure removals ----------
ws = wb.create_sheet('Not sure removals')
head(ws, ['Question','Feeds','Question text','Option being removed','Options left'],
         [11, 14, 62, 34, 12])
for q in D['questions']:
    ns = [o for o in q.get('options', []) if o.get('notSure')]
    if not ns: continue
    scoring = q.get('section') in SIX and q.get('weight', 0) > 0
    ws.append([q['id'], 'Constraint' if scoring else 'Risk or profiling', q['text'],
               ns[0]['text'], len(q.get('options', [])) - len(ns)])
    for c in (3, 4): ws.cell(ws.max_row, c).alignment = wrap

wb.save('Business-Diagnostic-Rebuild.xlsx')
print('wrote Business-Diagnostic-Rebuild.xlsx')
print('  set the bands :', len(singles), 'questions')
