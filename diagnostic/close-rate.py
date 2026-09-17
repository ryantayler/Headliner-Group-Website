# Ryan's ruling. Closing more than eight in ten means the offer is not the problem,
# so it cannot be called offer constrained, and it means the price is too low, so a
# prompt to put prices up prints on top of whatever the constraint turns out to be.
import json, io
src = io.open('content.js', encoding='utf-8').read()
pre, post = src[:src.index('{')], src[src.rindex('}') + 1:]
D = json.loads(src[src.index('{'): src.rindex('}') + 1])

q26 = [q for q in D['questions'] if q['id'] == 'q26'][0]
q26['options'] = [
  {"id": "a", "text": "More than 80%", "band": "above 80%",            "w": 0, "disqualify": "offer"},
  {"id": "b", "text": "50% to 80%",    "band": "in the 50 to 80% range", "w": 33},
  {"id": "c", "text": "25% to 50%",    "band": "in the 25 to 50% range", "w": 67},
  {"id": "d", "text": "Under 25%",     "band": "under 25%",              "w": 100},
]

# Prompts sit above the steps and are independent of the constraint. They exist for
# the case where one answer is worth acting on whatever else is wrong.
D['blocks']['prompts'] = [
  {"id": "underpriced",
   "text": "You're closing {q26.band}, which means you're too cheap. "
           "Put your prices up between five and twenty percent before you touch anything else on this list.",
   "when": [["q26", ["a"]]]}
]
io.open('content.js', 'w', encoding='utf-8').write(pre + json.dumps(D, indent=2, ensure_ascii=False) + post)
print('q26 re-banded, prompt added')
