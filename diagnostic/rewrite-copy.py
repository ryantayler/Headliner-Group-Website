# Ryan's September rewrite. Three things.
#   1. Every constraint body follows one shape. Sentence one names the issue and
#      carries the doubled customers test. The rest of that paragraph is their own
#      answers. The second paragraph is prewritten, and it says what will not fix
#      this and what will, which hands straight over to the steps.
#   2. Every fix list ends the same way. A time boxed test, then repeat or come back.
#   3. No copy assumes a delivery model, a sales process or a pricing method. No
#      quote, no sales call, no job, no invoice, because plenty of businesses this
#      tool serves do none of those.
import json, io
src = io.open('content.js', encoding='utf-8').read()
pre, post = src[:src.index('{')], src[src.rindex('}') + 1:]
D = json.loads(src[src.index('{'): src.rindex('}') + 1])
B = D['blocks']
A = lambda t, when=None: ({'text': t, 'when': when} if when else {'text': t})

CD, CF = B['constraintDef'], B['constraintFix']

# ----------------------------------------------------------------- TALENT
CD['talent']['open'] = [
  "Double your customers tomorrow and you'd struggle to deliver, because there's a layer of talent missing from the business.",
  "Being talent constrained means you're missing a layer, not missing extra hands.",
  "{d.unownedLayers}",
  "Most of last week went to {d.ownerTasks}."]
CD['talent']['evidence'] = [
  {"banded": "the work that actually moves the business forward got {q56.band}"},
  {"banded": "if you went dark for a month the business {q12.band}"},
  {"banded": "{q14.band}"}]
CD['talent']['close'] = ("Hiring another pair of hands underneath you doesn't fix this. "
  "What's missing is a whole role that doesn't exist yet, and adding it is what unblocks the business.")
CF['talent']['lead'] = ""
CF['talent']['actions'] = [
  A("Write down every task you do, in fifteen minute blocks, for a full week."),
  A("Against each task, write the role that should own it in an ideal world."),
  A("Take whichever role has the most tasks against it, or the most hours in the week."),
  A("Hire that role."),
  A("Train them yourself."),
  A("Give them the responsibility and the authority to run it. One without the other doesn't work."),
  A("Give them ninety days to prove they're the one."),
  A("If they don't work out, hire again and run it the same way. If they do, come back here and find out what's capping you now.")]

# ------------------------------------------------------------- FULFILMENT
CD['fulfilment']['open'] = [
  "Double your customers tomorrow and you couldn't deliver, because there isn't enough capacity in the business.",
  "This is capacity, not capability. You know how to do the work and you can't do enough of it."]
CD['fulfilment']['evidence'] = [
  {"banded": "you're running {q16.band}", "precise": "you're running at {q16.exact}% booked"},
  {"banded": "{q17.band}"},
  {"banded": "lead times have {q18.band}"},
  {"banded": "the work is typically ready {q19.band}"}]
CD['fulfilment']['close'] = ("Nothing at the front of the business needs attention until the back of it can breathe. "
  "More capacity is what fixes this, and there's work to do before you buy it.")
CF['fulfilment']['lead'] = ""
CF['fulfilment']['actions'] = [
  A("Write down, step by step, exactly how what you sell gets delivered."),
  A("Write down every other task your delivery people do that isn't that."),
  A("Find the three things across those two lists that slow delivery down the most."),
  A("Spend one week streamlining those three things and nothing else."),
  A("Rewrite the first list with what changed, and make it the way it's done from now on."),
  A("Cut the bottom ten percent of customers, the ones taking the most time for the least return."),
  A("Now hire more capacity into the roles that need it."),
  A("Run it that way for ninety days."),
  A("If delivery still can't keep up, work the list again. If it can, come back here and find out what's capping you now.")]

# ----------------------------------------------------------------- MARGIN
CD['margin']['open'] = [
  "Double your customers tomorrow and it wouldn't help, because there isn't enough margin in what you're already doing.",
  "You're busy, and there's nothing left at the end of it."]
CD['margin']['evidence'] = [
  {"banded": "what's left after direct costs sits {q36.band}", "precise": "what's left after direct costs sits at {q36.exact}%"},
  {"banded": "after everything it's {q37.band}", "precise": "after everything it's {q37.exact}%"},
  {"banded": "{q38.band}"},
  {"banded": "the work runs over what you priced it at {q39.band}"}]
CD['margin']['close'] = ("More volume won't solve this. You need to make more on the work you're already doing, "
  "without adding a single customer.")
CF['margin']['lead'] = ""
CF['margin']['actions'] = [
  A("Work out what each piece of work really costs you, your own time included, and rank the last twenty by what was left."),
  A("Take the bottom five. For each one, write down what it was that ate the money."),
  A("Whatever shows up on more than one of them, that's the leak. Fix that before you touch anything else."),
  A("Put your prices up on everything new. If nobody flinches, they were too low.",
    [["q38", ["c", "d"]]]),
  A("Build the thing that historically runs over into the price, so you stop absorbing it."),
  A("Reprice your three worst customers by what's left, or let them go."),
  A("Hold the new prices for ninety days without discounting to win anything."),
  A("If there's still nothing left at the end, work the list again. If there is, come back here and find out what's capping you now.")]

# ----------------------------------------------------------------- DEMAND
CD['demand']['open'] = [
  "Double your customers tomorrow and you'd have no trouble delivering, and you can't find enough of them to fill what you've got.",
  "You've got capacity sitting idle and not enough people asking."]
CD['demand']['evidence'] = [
  {"banded": "enquiries run {q31.band}", "precise": "enquiries run at about {q31.exact} a month"},
  {"banded": "volume has {q33.band} over the last year"},
  {"banded": "{q35.band}"}]
CD['demand']['close'] = ("Nothing downstream is broken. The business needs more people coming in the top, "
  "and it won't start feeding itself.")
CF['demand']['lead'] = ""
CF['demand']['actions'] = [
  A("Ask your happiest customers for something in writing or on camera. Pay for it, or give them something for it."),
  A("Put that where somebody deciding on you will actually see it."),
  A("Take the source that already brings your best customers and put two or three times the effort into it."),
  A("Stand up a second source that doesn't rely on being found. Going out and asking directly is the usual one."),
  A("Set up a referral programme with something real in it for the customer who refers."),
  A("Launch it by asking every customer, one at a time, for a single introduction."),
  A("Run all of that for ninety days without adding anything else."),
  A("If enquiries haven't moved, work the list again. If they have, come back here and find out what's capping you now.")]

# ------------------------------------------------------------------ OFFER
CD['offer']['open'] = [
  "Double your customers tomorrow and you'd have no trouble delivering, and you can't close enough of them to fill what you've got.",
  "People come to you and they don't buy. It's the offer. Either the value in it doesn't justify what you're asking, or there's something in the way of somebody saying yes."]
CD['offer']['evidence'] = [
  {"banded": "your close rate sits {q26.band}", "precise": "your close rate sits at {q26.exact}%"},
  {"banded": "the most common reason you lose is {q27.band}"},
  {"banded": "people come back asking what's included {q28.band}"},
  {"banded": "they find out what you charge {q30.band}"}]
CD['offer']['close'] = ("You don't fix this by dropping the price. You fix it by putting things into the offer "
  "that cost you very little and are worth real money to the buyer, and by clearing whatever somebody has to get over before they can say yes.")
CF['offer']['lead'] = ""
CF['offer']['actions'] = [
  A("List everything you already do for a customer that isn't written into the offer, and write it in."),
  A("Add two or three things that cost you close to nothing and are worth real money to the buyer. A guarantee, priority, something they'd otherwise go and source themselves."),
  A("Write down every question somebody asks you after they've seen the price."),
  A("Answer all of them inside the offer, before anybody has to ask."),
  A("Shorten the time between somebody making contact and somebody getting a number."),
  A("Make the price and what's in it easier to see."),
  A("Run the new offer for one month."),
  A("If the close rate hasn't moved, put more value in and go again. If it has, come back here and find out what's capping you now.")]

# ------------------------------------------------------------------ VALUE
CD['value']['open'] = [
  "Double your customers tomorrow and you'd have no trouble delivering, and you can't keep enough of them to fill what you've got.",
  "They buy, then they either stop or start giving most of the work to somebody else."]
CD['value']['evidence'] = [
  {"banded": "of the customers you had a year ago, {q21.band} still buy from you", "precise": "of the customers you had a year ago, {q21.exact}% still buy from you"},
  {"banded": "you get {q57.band} of the work they put out", "precise": "you get {q57.exact}% of the work they put out"},
  {"banded": "they come back unprompted {q22.band}"},
  {"banded": "referrals bring in {q23.band} of your new customers"}]
CD['value']['close'] = ("You're filling a leaky bucket. Every dollar going into finding new customers is paying to replace "
  "the ones walking out the other side, which is why the business feels busy and stays the same size. "
  "Selling to somebody who has already bought is far easier than finding somebody new.")
CF['value']['lead'] = ""
CF['value']['actions'] = [
  A("Write down every point of contact a customer has with you, from the moment they buy through to six months later."),
  A("Put as much as you can into the first ninety days. Surprise them. That's the window where they decide what you're worth."),
  A("Find the longest silence on that list and put something in it."),
  A("Ring ten customers who stopped or cut back and ask them straight why. Not a survey."),
  A("Whatever more than one of them says, fix that.",),
  A("Build one reason to come back that you start, rather than waiting to be asked.",),
  A("Ask your biggest customers what they give to somebody else, and why.", [["q57", ["c", "d"]]]),
  A("Run all of that for ninety days and measure who came back."),
  A("If they're still leaving, work the list again. If they're staying, come back here and find out what's capping you now.")]

D['thresholds']['MAX_ACTIONS'] = 9
io.open('content.js', 'w', encoding='utf-8').write(pre + json.dumps(D, indent=2, ensure_ascii=False) + post)
print('copy rewritten, MAX_ACTIONS ->', D['thresholds']['MAX_ACTIONS'])
