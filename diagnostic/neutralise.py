# No prewritten line may assume a delivery model, a sales process or a pricing
# method. Quote, invoice, deposit and job all do. The only place a model specific
# word survives is a question option that exists to ask which model they are,
# because neutralising those makes the question useless.
import json, io
src = io.open('content.js', encoding='utf-8').read()
pre, post = src[:src.index('{')], src[src.rindex('}') + 1:]
D = json.loads(src[src.index('{'): src.rindex('}') + 1])
B = D['blocks']
Q = {q['id']: q for q in D['questions']}
def opt(qid, oid): return [o for o in Q[qid]['options'] if o['id'] == oid][0]

RF = B['riskFix']['cash_flow']
RF[1]['text'] = ("Take money upfront on everything. Half of it well before you start and the rest "
                 "before you deliver, so it's in the account before your own costs go out.")
RF[2]['text'] = ("Line the upfront money up to land before your own costs do. Where the final number "
                 "can't be known in advance, take the balance afterwards and refund the difference.")
RF[3]['text'] = ("Ask for the money within twenty four hours of finishing. Whatever the gap is between "
                 "finishing and asking, that gap is yours to close.")
RF[5]['text'] = "Put your terms in writing before the next piece of work starts, and chase on day one past due."
B['riskDef']['cash_flow']['close'] = ("That's a timing problem rather than a rate problem. Every customer you "
  "win right now costs you money before they pay you.")

B['dontDoYet']['fulfilment']['items'][3] = "Don't promise a shorter lead time to win something."
B['dontDoYet']['margin']['items'][2] = "Don't take the big thin one because it's good for the brand. Reputation doesn't pay wages."

Q['q54']['text'] = "How do you usually get paid?"
for oid, text, band in [
  ('b', "Some upfront, the rest when it's done",     "with some upfront and the rest at the end"),
  ('c', "Progress payments along the way",           "in progress payments"),
  ('d', "Some upfront, the rest on terms after",     "with some upfront and the rest on terms"),
  ('e', "Nothing upfront, paid when it's done",      "with nothing upfront, paid at the end"),
  ('f', "Nothing upfront, paid on terms after",      "with nothing upfront and the rest on terms")]:
    o = opt('q54', oid); o['text'] = text
    if 'band' in o: o['band'] = band

Q['q7']['text'] = "Once you've asked for the balance, how long until it's actually in the account?"
opt('q7', 'a')['text'] = "Straight away, we're paid before we'd even ask"
Q['q10']['help'] = "Materials, wages, anything you'd have to pay for before the customer pays you."

opt('q13', 'a')['text'] = "Pricing and putting numbers together"
opt('q13', 'e')['text'] = "Chasing money and doing the books"

Q['q16']['help'] = "Capacity meaning the hours, people or materials you'd need to actually do the work."
Q['q19']['text'] = "How far ahead is the work actually ready?"
Q['q20']['help'] = "Long hours on a delivery day are the work itself. This is about the weeks in between."

Q['q26']['text'] = "Of the people who enquire and find out what it costs, how many go ahead?"
Q['q28']['text'] = "When somebody sees your price, how often do they come back asking what's included, or why it costs what it does?"
o = opt('q28', 'd'); o['text'] = "Almost every time"; o['band'] = "almost every time"
Q['q29']['text'] = "Has the proportion of enquiries that turn into work changed in the last 12 months?"
o = opt('q30', 'c'); o['text'] = "Every price is worked out from scratch"; o['band'] = "from a price worked out from scratch every time"

Q['q36']['text'] = "On a typical sale, what's left after the direct cost of delivering it?"
Q['q36']['help'] = "Direct cost meaning labour, materials, subcontractors, whatever that specific piece of work consumed."
Q['q39']['text'] = "How often does something end up costing more to deliver than you priced it at?"
o = opt('q39', 'd'); o['text'] = "Most of the time"; o['band'] = "most of the time"
Q['q40']['text'] = "Do you know which customers, products or lines of work actually make you money?"
opt('q40', 'a')['text'] = "Yes, down to the individual sale"
opt('q4', 'd')['band'] = "one piece of work at a time"

io.open('content.js', 'w', encoding='utf-8').write(pre + json.dumps(D, indent=2, ensure_ascii=False) + post)
print('neutralised')
