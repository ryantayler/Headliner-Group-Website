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

---

## Which brand a thing wears

Ryan's ruling, September 2026. Permanent.

- **Tools are Headliner Group.** Anything somebody uses, a calculator, a diagnostic,
  a form, a dashboard, a web app. Headliner's system: aqua accent, coral for actions,
  Inter for body copy, and Archivo Black for the logo and for report and section
  headings. Ryan widened this in September 2026 from logo only, after seeing the
  diagnostic report set in Inter throughout. Body copy is still Inter, always.
- **Content and IP are Ryan Tayler.** Anything he authored, frameworks, posts,
  models, points of view. His system: pink accent, Anton headers, Caveat once,
  and the signature as the sign off.

The four pillars of partnership are content, so they wear Ryan. The business
diagnostic is a tool, so it wears Headliner. His signature, Caveat and Anton never
appear on a tool, because a tool is not signed by a person.


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

## Known traps

- `clip-path` applies **after** `filter`. The logo beam depends on it. The section beam
  must not (blur on the element, clip on the `::before`).
- Inside `object-position`, a percentage resolves against **box width minus image width**,
  which is negative under `object-fit: cover`. Use viewport units.
- `[hidden]` is a UA rule at UA priority, so any author `display` un hides it. The
  stylesheet carries `[hidden]{display:none!important}` for this reason.
