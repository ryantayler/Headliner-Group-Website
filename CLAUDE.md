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
- **tag balance**, all five pages. A slice edit that eats a closing tag passes every
  other check, because the browser repairs the tree and Playwright never sees it. It cost
  the end of `ryan.html` once. Run it after any edit that cuts markup by index.

`build-preview.py <dir>` inlines the whole site into one file for the preview artifact. It
discovers images and lifts the footer out of `index.html` rather than keeping copies. Do
not reintroduce a hardcoded list of either.

## The look

Section 12 of the stylesheet is how the site looks. It was built behind a
`[data-spice="on"]` switch so Ryan could compare it against the signed off build, he
picked it, and the attribute, the header button and the no flash `<head>` script are all
gone. The rules there apply always and there is no second state to check. Nothing in the
repo should mention spice; if you find the word, it is a leftover.

The markers it left behind are `beam-band`, `beam-soft`, `beam--l`, `beam--r`,
`band--dark`, `head--mid` and `facts--cards`. Older notes in `CONTENT-DECISIONS.md` call
them `spice-beam-band`, `spice-beam-soft`, `spice-beam--l/--r`, `spice-dark`,
`spice-center` and `spice-cards`.

### Where the light is allowed

**The background shaft.** Home once, Partnerships twice, mirrored so the second is not the
same picture again, and Free Sh!t once on the download wall. On paper it runs at about a
third of the dark band alpha. **Never on Ryan's page**, in any form: that page runs his
brand and his brand has its own rules. Contact has none.

**The grain.** Ryan's page only, one fixed layer over the whole viewport.

**The centred head: a heading that opens a symmetric block.** Three cards, three facts, a
pair of lanes. Headliner pages only. It is not a way to make a section feel important, so
a heading over prose stays on its left edge. All three are on Partnerships, because it is
the only page whose sections are built as sets.

**A rule under the heading was built and cut**, in four versions. Do not bring it back.

## Known traps

- `clip-path` applies **after** `filter`. The logo beam depends on it. The section beam
  must not (blur on the element, clip on the `::before`).
- Inside `object-position`, a percentage resolves against **box width minus image width**,
  which is negative under `object-fit: cover`. Use viewport units.
- `[hidden]` is a UA rule at UA priority, so any author `display` un hides it. The
  stylesheet carries `[hidden]{display:none!important}` for this reason.
- `feTurbulence` writes noise into the **alpha** channel as well as the colour, so a noise
  layer is about half transparent before any opacity is applied. Force alpha opaque in the
  filter chain.
- **`mix-blend-mode` cannot see the canvas.** Body's background propagates to the canvas,
  so a blended child of `body` blends against nothing and paints nothing. The page grain
  uses plain opacity for this reason. A blended layer inside a section with its own
  background is fine.
- **A low alpha gradient on a dark ground bands because of the bit depth, and adding
  gradient stops can never fix it.** Aqua at 12.5 percent over `#0A0A0A` composites to
  rgb(14,37,33), which is 27 integer values of green away from the ground. Those 27 have
  to cover 1800px of shaft, so there is a flat band every 66px. Dropping the opacity is
  what destroys the levels, so subtlety and smoothness are in direct tension. The fix is
  dithering, noise carrying the shaft's own mask so it lifts nothing outside the beam,
  blended normally because `overlay` does almost nothing over near black.
- **`filter:blur()` bands it a second time and `mask-image` a third.** Blur renders in
  tiles at reduced precision and returns stair steps. A mask multiplies a second
  quantised alpha into a gradient that is already only 27 values wide, and the product
  lands on a lattice whose contours run along the shaft. Tested side by side at nine
  times brightness, the same gradient with a mask bands and without one does not. **The
  beams are a single angled `linear-gradient` across the whole band and nothing else**,
  no rotated box, no filter, no mask on the shaft itself. The cost is that the shaft runs
  edge to edge rather than fading along its length. A radial gradient also avoids all of
  it but reads as a round glow rather than a beam, and Ryan rejected that.
- **A background is sized to the padding box but painted across the border box.** `.btn`
  carries a 1px transparent border, so a gradient on a button paints into that ring by
  tiling round to the opposite edge, which showed as a pixel of the wrong colour along
  the top and bottom of the Instagram button. `background-origin:border-box` and
  `background-repeat:no-repeat` on any gradient button.
- **`hero--bright-right` is shared by Partnerships and Free Sh!t.** So is every other
  hero modifier. Anything about one photograph in particular, a crop, a blur, a scrim,
  goes on that page's own marker, never on the shared class. It silently moved the
  Partnerships hero once.
- A `clip-path` polygon has to be **wound in order** round the shape. Listing the two left
  corners together sends the outline left, left, right, right, and it crosses itself.
