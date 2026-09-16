# Next update, queued

Nothing here is applied yet. Agreed 16 September 2026, off the back of the supply and
demand document. The two tier restructure was considered and dropped. The seven
constraints and the chain stay as they are.

---

## 1. Constraint descriptions, the doubled clients line

Every constraint opening leads with the same test, so the reader knows which half of the
business they're in before they read the finding.

**Supply side.** Talent, fulfilment, margin.

> Double your clients tomorrow and you couldn't handle it. So ...

**Demand side.** Demand, offer, value.

> Double your clients tomorrow and you could handle it. So ...

**Cash flow** gets neither. It isn't a supply problem or a demand problem, and a full
business can run out of money the same as an empty one.

### The engineering note on this

This is an assertion about their business, so it has to be established, not assumed. q34
already asks it. *If twice as many enquiries landed next month, could you deliver the
work?*

Two things to sort before writing the copy.

- Make the clause conditional on q34, so it drops out when they answered not sure.
- Decide what happens when q34 contradicts the constraint. A business called fulfilment
  constrained that answered yes easily is rare but possible. Either the line suppresses
  itself, or the contradiction is worth surfacing.

---

## 2. Solutions, folded in rather than bolted on

Five to take from the document. Each one goes **inside** an existing action set, in the
sequence that's already there. None of them becomes a new section.

### Cash flow, sell something you don't have to fund

Every action we have is about timing. Deposits, invoicing, collecting, terms, a facility.
Nothing is about changing what you sell to change the cash shape.

> Sell something you can deliver without funding it first. Design work, a site visit,
> consulting time.

### Fulfilment, raise the price instead of picking the jobs off by hand

Goes **into step 4**, the cut step. Same job as cutting the jobs that eat capacity for the
least return, and it does the cutting for you. It extends the step rather than adding a
sixth, so Ryan's sequence stays as he wrote it.

> Raise your prices on new work. When you're full, the price does the cutting for you.

### Fulfilment, productise the repeat work

Steps 1 and 2 are process, not repeatability. This one needs a slot of its own.

> Turn your three most common jobs into fixed packages. Same scope, same price, same
> build every time.

### Margin, more out of the job you're already on

The strongest single item in the document and there's no version of it in the tool.
Margin ranks jobs by what's left and never says lift what's left per job.

> Write down three things you could add to a job you're already on site for. You've
> already paid for the truck and the crew to be there.

### Offer, write it to whoever signs

Every offer action is about the offer's contents. None is about who receives it.

> Check who actually signs off on the spend, and write the offer to them. The person who
> does the work inherits the effort, and the person with the budget gets the result.

---

## 3. The slot problem

`MAX_ACTIONS` is 5. Current counts are cash flow 7 (conditional), fulfilment 5, margin 5,
offer 6.

Cuts to make room.

- **Offer, action 6.** *Test the new offer on the next ten enquiries before you change
  anything else.* It's process, not a fix.
- **Margin, action 5.** *Don't discount to win.* It's a Don't Do item sitting in the fix
  list, and the Don't Do section already says don't discount anything.

That covers offer and margin. Fulfilment's productise line still has nowhere to go, and
the fulfilment sequence isn't up for cutting. So either it waits, or `MAX_ACTIONS` goes
to 6. **Ryan to call.**

---

## 4. Blocked

**Peak and off peak pricing.** The best fit for live events in the whole document and it
can't be written yet. We have no seasonality question, so the line would assert the
business has peaks without having established it. Add one question and write it properly,
or drop it.

---

## Taking nothing

- **Talent.** Rewritten to Ryan's sequence in September. The document's talent section is
  about training existing staff, which is our fulfilment, not our talent.
- **Value.** The document has no counterpart. It assumes churn is already low.
- **Demand.** Full at six actions, and the document's demand fixes are app store
  listings, banner swaps and landing page tweaks.

---

## Still open from before

- Value and offer copy audit. It stops at value. See `AUDIT-PROGRESS.md`.
- Whether Blind spot and Model misfit belong in the risk list.
- Data capture. Whether the report is gated, and which fields.
