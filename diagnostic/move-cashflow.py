# Cash flow stops being a constraint and becomes a risk, keeping its content.
import json, io
src = io.open('content.js', encoding='utf-8').read()
pre, post = src[:src.index('{')], src[src.rindex('}') + 1:]
D = json.loads(src[src.index('{'): src.rindex('}') + 1])
B = D['blocks']

D['flags']['cash_flow'] = {'name': 'Cash flow', 'group': 'Money', 'pinned': True}

# The definition keeps the evidence sentences the constraint block was built from.
B['riskDef']['cash_flow'] = B['constraintDef']['cashflow']
# The fix keeps all seven actions, conditionals and all. It is the most concrete
# list in the tool and a three line risk fix would throw most of it away.
B['riskFix']['cash_flow'] = B['constraintFix']['cashflow']['actions']

for blk in ['constraintDef', 'constraintFix', 'dontDoYet']:
    B[blk].pop('cashflow', None)
D['constraints'].pop('cashflow', None)

# nothing left that can be too unsure to call
for k in ['tooUnsure', 'unsureBody', 'titleUnsure']:
    if k in B: B.pop(k)
    if isinstance(B.get('opening'), dict): B['opening'].pop('tooUnsure', None)
if isinstance(B.get('closing'), dict): B['closing'].pop('unsure', None)

io.open('content.js', 'w', encoding='utf-8').write(pre + json.dumps(D, indent=2, ensure_ascii=False) + post)
print('cash flow moved to risks, unsure blocks removed')
print('constraints:', list(D['constraints'].keys()))
print('risks:', len(D['flags']))
