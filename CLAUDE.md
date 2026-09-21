# Headliner Group website

Static multi page site. Five hand written HTML files, one stylesheet, one JS file, no
build step. `CONTENT-DECISIONS.md` is the source of truth for every copy decision Ryan has
made. Where it contradicts the HTML, it wins.

---

## Copy rules

These are on top of the `ryan-voice` skill, not instead of it. Everything in that skill
still applies (no dashes of any kind in prose, no colons except before a list, Australian
spelling, contractions).

### Banned sentence shapes

Ryan named these on 31 August 2026 and the ruling is permanent. They are the shapes that
make copy read as machine written.

**1. The trailing reassurance.** A clause bolted onto the end of a sentence that stops
describing the thing and starts reassuring the reader about it.

> These are the real ones, out of real businesses, **and you can take the lot without ever
> speaking to us.**

> The first conversation costs nothing **and stays between us.**

The reassurance is usually true and often worth saying. It does not go on the end of
another sentence. Give it its own short sentence, put it on the control it describes (a
note under a button, a label on a form), or cut it because the page already said it.

**2. The rising tricolon.** Three beats where the third runs longer than the first two and
carries the payoff.

> The real ones, out of real jobs, and you can take the lot.

Three item lists are fine. A three item list built as a ramp into a punch is not.

**3. The bolted on kicker.** A closing line added to a paragraph to land a punch rather
than to say something the paragraph had not already said.

> It is the least exciting half of the job **and it is usually the fastest money in the
> business.**

**Conflict, flagged rather than resolved.** The `ryan-voice` skill requires LinkedIn posts
to close with one dry punch, earned by the story above it. That is a different device and
it stays. The ban here is on the manufactured version, in website and marketing copy,
where nothing has been earned and the line exists to sound good. If a punch is doing real
work, keep it. If it is decoration, it goes.

### Write what Ryan said, not more

When Ryan briefs copy, write it at roughly the length he briefed it. He gives the argument
in three or four lines and the temptation is to turn each line into a paragraph. Do not.
The expansion is where the voice goes, because the extra sentences are the writer's, not
his. If a beat genuinely needs more, ask, rather than filling it in.

Read `ryan-voice/references/exemplars.md` before drafting anything, not just `SKILL.md`
and the voice guide. That file says it outranks every other instruction and it does.

### How to check your own draft

Read the last clause of every sentence on its own. If it could be deleted and the reader
would lose no information, it is one of the three above.

---

## Build and verification

Playwright scripts live in the session scratchpad, not in the repo. The ones that matter:

- **contrast**, site wide, every text and ground pair at 1440 and 390
- **hero contrast**, pixel sampled: hide the headline, screenshot the ground, find the
  brightest pixel under the text box. A token audit passes while text sits on bright image
  pixels, so the token audit is not enough on its own.
- **download wall**, every card opens, the form swaps in, the filters count correctly

`build-preview.py <dir>` inlines the whole site into one file for the preview artifact. It
discovers images and lifts the footer out of `index.html` rather than keeping copies. Do
not reintroduce a hardcoded list of either.

## The spice layer

`[data-spice="on"]` on `<html>` switches an experimental look, section 12 of the
stylesheet plus the block at the end of `main.js`. **Off is the signed off site and has to
stay pixel identical to it**, so nothing in that layer may be written without the
attribute in front of it, and nothing outside it may be changed to serve it. The scratch
scripts `allspice.js`, `auditspice.js` and `fwspice.js` run the standard checks with the
layer on; run both states before pushing anything that touches it.

### Where the beam is allowed

Three devices come out of the logo and each has a rule. They are rules, not preferences.
Adding a fourth instance of any of them is a change to the system, not a tweak.

**The beam rule under a heading: once per page, on the section that says how we work.**
`data-rule="beam"`. Home, how we do it. Partnerships, our process. **Headliner pages
only.** Ryan's page never takes it, and never takes the centred head either, because that
page runs his brand and his brand has its own rules. It was on every heading on three
pages for a round and the site drowned in it. **Do not put a second one on a page.** A new
section never inherits it.

**The background shaft: once per page, and never on a page without one.** Free Sh!t and
Contact have none, because neither page makes an argument. It takes the accent token, so
on Ryan's page it comes out pink on its own.

**The centred head: a heading that opens a symmetric block.** Three cards, three facts, a
pair of lanes. Headliner pages only, same as the beam. It is not a way to make a section
feel important, so a heading over prose stays on its left edge. All three on the site are
on Partnerships, because it is the only page whose sections are built as sets.

## Known traps

- `clip-path` applies **after** `filter`. The logo beam depends on it. The section beam
  must not (blur on the element, clip on the `::before`).
- Inside `object-position`, a percentage resolves against **box width minus image width**,
  which is negative under `object-fit: cover`. Use viewport units.
- `[hidden]` is a UA rule at UA priority, so any author `display` un hides it. The
  stylesheet carries `[hidden]{display:none!important}` for this reason.
