# Headliner Group

Static template for the Headliner Group website. Six pages, one stylesheet, no build step. Open `index.html` in a browser and it runs.

## Pages

| File | Page | Job |
| --- | --- | --- |
| `index.html` | Home | Sets the scene. Images, short headings, proof, one link into every other page. |
| `partnerships.html` | Partnerships | The depth page. The belief, the two lanes, the exit sequence, the deal, who it fits. |
| `ryan.html` | Ryan | Ryan's personal brand page. Runs on his own colours, not the group's. |
| `free.html` | Free Sh!t | Lead magnets. Some download straight away, some sit behind an email. |
| `contact.html` | Contact | The conversion point. Form, direct contact, what happens next. |

## The identity

Dark at the ends, light through the middle. Header, hero and footer are the locked dark set; every reading section between them is light. One brand accent, aqua, plus a separate functional colour for actions.

| | Value |
| --- | --- |
| Dark surfaces | `--base #0A0A0A`, `--panel #111111`. Header, hero, footer |
| Light surfaces | `--paper #F2F4F3`, `--paper-2 #E7EBE9`, cards `#FFFFFF` |
| Brand accent | Aqua `#2DE2C3` on dark, deepened to `#0A7261` on light so it can carry text |
| Action colour | Coral `#FF5A36` with `#0A0A0A` labels, 6.38:1. **Buttons only** |
| Logo face | Archivo Black, the logo and nothing else |
| Everything else | Inter 400 / 500 / 600, headings included |
| Light source | The beam, on dark surfaces only |

Components never name a surface. Each band sets a context and the components read from it:

```css
:root{ --ground --surface --line --tx --tx-sub --tx-mute --tx-accent }   /* dark */
.band--paper,.band--paper2,.cta-band{ /* the same seven, light */ }
```

To restyle a surface, change those seven in one place. Nothing else moves.

**Two consequences of going light**, both worth knowing before you add sections:

- **The beam only works on dark.** `mix-blend-mode:screen` adds light and does nothing on a light ground, which is in your own spec. Section beams were removed from every light band. Beams now live on the header logo, the footer logo and the hero.
- **Coral is a second colour.** The spec says one accent per page, and this breaks it deliberately because the aqua buttons were disappearing into the page. It is scoped to `--cta` and used on `.btn--fill` only, never a surface and never type elsewhere, so aqua remains the only brand accent.

## Motion in the hero

Two drifts, deliberately out of step so they never look mechanical.

```css
.hero__media img   { animation:heroDrift 26s var(--ease-sway) infinite alternate }
.hl-lit-beam--hero { animation:beamSway  19s var(--ease-sway) infinite alternate }
```

`alternate` plus a symmetric ease is the whole trick: it decelerates into each end, holds a beat, then accelerates back the other way. The photo travels asymmetrically, `-1.15%` to `+0.58%`, and is scaled to 1.06 so the drift never exposes an edge. Positive `translateX` slides the photo right, which pans the view onto the far left of the frame, and that third is the emptiest part of the shot (mean luminance 39.9 against 63.9 on the right, and the least detail of the three). So the travel that way is half the other. The beam is a followspot. Its lamp sits off screen at roughly x 1520, y -300 on a 1440 hero, which is 80px past the right edge and 300px above the top. The element's top centre **is** that lamp, so `transform-origin` stays `top center` and the whole throw swings from it. It sweeps 11.5 to 56.5 degrees, 45 end to end, 22.5 either side of the spec's 34, and it is long enough (1800px) that the tail leaves the frame at both ends.

The hero throw is **462px** at the tail, 10% wider than the 420 it started at. The source is held: the narrow end keeps its 58.8px and is re-expressed as a percentage of the wider box, 14% of 420 becoming 12.73% of 462. `right` shifts by half the extra width so the lamp stays put at x 1520.

### Beam lit copy

As the throw passes over a piece of hero copy it picks up the beam colour, and the glow fades the further from the lamp it falls.

Each element runs the beam's own 16s clock, `alternate`, but with **linear** timing so its peak keyframe lands exactly where the eased beam crosses it. `alternate` then mirrors it on the way back, so the two stay locked forever without any script.

The windows and amplitudes are derived, not eyeballed. For each element: the angle the lamp sees it at, the angular width of the throw at that distance (the clip taper plus the 52px blur, which is real width), and the distance from the lamp. That gives when the glow starts, peaks and ends, and how strong it is.

| element | lit window | peak | alpha |
| --- | --- | --- | --- |
| lede | 39% to 73% | 54% | .320 |
| ghost button | 25% to 58% | 43% | .301 |
| primary button | 42% to 74% | 56% | .266 |
| headline | 69% to 100% | 100% | .084 |
| eyebrow | 85% to 100% | 100% | .017 |

The headline is faint and the eyebrow nearly nothing because the sweep only just reaches that far. That is the falloff doing its job, not a mistake. Buttons use `box-shadow`, text uses `text-shadow`. The colour is `--accent-rgb`, so the glow is aqua on the group's pages and purple on Ryan's without a second rule. The whole block sits inside `prefers-reduced-motion: no-preference`.

If you move hero copy, the phases go stale. They are geometry, so recompute them rather than nudging by eye.

Hero beam peak alpha is `.342`, not the `.55` the section beam uses. The wider sweep carries the throw across the lede, and at `.5` that dropped the lede to 4.22:1. Contrast was checked at five points through the sweep, not just the ends; the worst is the lede at 4.97:1 mid sweep. Both stop under `prefers-reduced-motion`.

## `ryan.html` runs a different brand

It is his personal brand page and it uses **his** system, not Headliner's. One class on the body, `.theme-ryan`, swaps the whole thing.

| | Headliner | Ryan |
| --- | --- | --- |
| Ground | light body, dark ends | **dark end to end**, his canonical |
| Accent | aqua `#2DE2C3` | **pink `#FF2D6B`**, the only one |
| Action colour | coral `#FF5A36` | pink, because pink does every accent job |
| Headers | Inter 600 | **Anton**, uppercase |
| Beam | hero and both logos | **none on this page** |

Rules of his system that this build honours: text on a pink fill is always black `#0A0A0A` (5.5:1, off white fails at 2.9); one handwritten Caveat moment per view and no more; the signature is ink only on a clean ground, never on a photo or a colour; purple, cyan and aqua are **archived** in his system and appear nowhere on the page.

**The site header is the one thing that does not change.** It re-asserts Headliner's accent and action colour inside the bar, so the CTA stays coral, the active nav link stays aqua and the logo beam stays aqua. Verified identical to `index.html` on every one of those.

The hero is his portrait holding the left of the frame and dissolving into the ground on two axes, with the **signature as the name mark** on the clean right. That placement is not decorative: his system forbids the signature on a photo, so the image has to be gone by the time it reaches the mark. There is no Anton headline in the hero because the signature is the wordmark.

`assets/img/ryan-hero.jpg` is 1800px wide with a 900px variant on `srcset`. No blur on this one, unlike the home hero. `object-position: 58% 32%` is what keeps his face in the left third as the frame narrows.

Two things had to be tuned against pixels rather than tokens. The bar sits over the brightest part of the shot (the blown out background behind his head), and without help the wordmark measured **2.29:1** and GROUP **1.19:1**, effectively invisible. The scrim therefore carries a dedicated top band, `rgba(10,10,10,.93)` holding to `.86` at 100px and clearing by 300px, and the image itself drops to `opacity:.92`. Re-measured: wordmark 14.15, GROUP 7.31, eyebrow 6.22, lede 11.59, ghost button 16.11, signature 11.02. The signature's own ground samples at luminance **0.028**, which is the rule about clean grounds being satisfied rather than approximated.

Below 900px there is no clean right hand side to move to, so the split turns horizontal instead of collapsing. The portrait takes a band under the bar (`min(44vh, 360px)`), dissolves downward, and the whole text stack including the signature sits on flat ground beneath it. Going full bleed here is the obvious shortcut and it is wrong: it puts the signature straight back on the photo. Measured at 390px, the signature's ground is luminance 0.003 and every element clears 6.8:1.

```html
<body class="theme-ryan">
```

That swaps `--accent` and `--accent-rgb`. Nothing else changes, including the beams, which read the accent from those tokens.

## Structure of every page

Dark only, so separation comes from alternating the two dark surfaces and from where the light falls.

```html
<section class="band band--base">   <!-- #0A0A0A -->
<section class="band band--panel">  <!-- #111111 -->
```

Alternate them. Cards invert against their band, so a card on `band--base` is `--panel` and a card on `band--panel` is `--base`. Every band carries `band--lit` (`overflow:hidden`), which is required or a beam bleeds into the next section.

Tokens live at the top of `assets/css/styles.css`. Never hardcode a hex where a token exists.

## The logo

`assets/css/styles.css` section 3 is the Headliner Group 14.8 logo, verbatim. Do not adjust the beam's `transform`, `width`, `margin` or `clip-path`. Resize the lockup by changing `font-size` on `.hl-logo` and nothing else, which is what the header (21px) and footer (34px) do.

The spec block is byte for byte as supplied. Two inherited properties are neutralised in a **separate** rule directly beneath it, because this page sets them on `body` and the logo would otherwise render differently to the spec's neutral context:

```css
.hl-logo{line-height:normal;-webkit-font-smoothing:auto}
```

Neither belongs to the logo. Delete that one rule and the block above is a bare drop in.

Markup is `div.hl-logo > div.hl-beam + span.hl-word + div.hl-group`, exactly as supplied. The link wraps **outside** it (`a.hl-link`), so the logo is a div rather than an anchor and is not blockified into a flex item, which would change its computed `display` from `inline-block` to `block`.

Verified by diffing every computed property and every box measurement of `.hl-logo`, `.hl-word`, `.hl-group` and `.hl-beam` against the supplied code rendered in isolation. They match exactly.

### The lockup is never resized, the container is

The logo always runs at its full 44px. It sits inside `.hl-stage`, a fixed box that crops it the way the reference card does, and the **whole container** is scaled down with one `transform`. Word, GROUP, beam, taper, blur and every distance between them shrink by one factor, because they are one image.

```html
<a class="hl-link" href="index.html">
  <div class="hl-stage">
    <div class="hl-logo">…your code…</div>
  </div>
</a>
```

```css
.hl-stage{font-size:44px;width:12.5em;height:5.9em;overflow:hidden;transform-origin:left top}
.hdr .hl-stage{transform:scale(.385)}    /* header, 100px bar */
.ftr .hl-stage{transform:scale(.6)}      /* footer */
```

`.hl-link` reserves the scaled footprint so layout is not thrown out by the unscaled box. To resize the logo anywhere, change the `scale()` and the matching `.hl-link` width and height. Never touch the values inside `.hl-logo`.

The container is `18em` wide, which is what it takes to hold the whole throw. The beam is a long diagonal, so it reaches much further left than the wordmark does; anything narrower puts a vertical cut through it. Verified as contained, not assumed: the beam's painted left edge sits inside the container's, measured in the browser.

The only crop left is top and bottom, and `.hl-stage` carries a vertical mask that dissolves those rather than cutting them. A card has a border to justify a hard edge. A header does not. The fades clear the wordmark.

`.hdr .hl-link` pulls left with `max(-60px, calc(var(--gutter) * -1))` so the throw starts before the gutter on wide screens, and never further left than the gutter itself, which would drag it off a narrow viewport.

The header bar is `--hdr-h:100px` rather than 74px, so the lockup lands at a legible 17px wordmark while keeping the container's proportions.

## The section beam

Different treatment to the logo beam, on purpose. Sized to the block rather than the word, and **soft**: the blur sits on the element and the clip on `::before`, so the throw fades rather than ending on a hard edge.

```html
<div class="hl-lit-beam hl-lit-beam--hero"></div>   <!-- inside .hero -->
<div class="hl-lit-beam hl-lit-beam--right"></div>  <!-- inside any .band--lit -->
```

- `mix-blend-mode:screen` needs a dark ground. Light only ever adds.
- One per section, and not every section. More than one implies more than one lamp.
- Keep it off body copy. Behind a heading is fine, behind a paragraph is not.
- Every band carrying a beam needs `band--lit` (`overflow:hidden`) or it bleeds into the next section.

The hero beam enters top right and rakes down across the middle of the body. All beams throw down and to the left, matching the logo, so they read as one distant source.

## The download wall on `free.html`

Twelve magnets in a four by three grid, filtered by which part of the business they fix (Quote it, Run it, Protect it, Grow it). Clicking a card opens one full screen dialog, not twelve.

The content lives in the page, not in a JS array. Each card carries `data-id`, and a matching `<template data-detail="...">` at the bottom of the file holds the long write up, the ticks and the download button. `main.js` section 5 clones the template into the dialog and clones the card's own `.media` in beside it, so the artwork is written once. To add a magnet, copy a card and its template, give both the same id, and put the real file in `assets/downloads/`.

Nine download straight away. Three are gated, marked with an `Email` pill on the card, and their button jumps to `#gate` instead of a file. Which ones are gated is a copy decision, not a code one, so flipping a magnet either way means editing its template and its pill.

The dialog is a real one. It traps Tab, closes on Escape and on the scrim, locks body scroll, and returns focus to the card that opened it. The one exception is the gated button, which closes the dialog without pulling focus back, because it is jumping the reader down to the form.

Card titles are buttons, and the button's `::after` covers the whole card. That gives one big hit area while the accessibility tree still sees a single named control per card, rather than a heading and a link and a stray click handler.

## The copy

`CONTENT-DECISIONS.md` is the source of truth for what every page says. It records Ryan's answers round by round, and where it contradicts something in the HTML, it wins.

Three things in there change how you edit these pages:

**Headliner Group and Ryan Tayler are different brands.** Equity, minority share, acquisition and full sale are allowed on the group's pages and written in his voice. None of that language appears on `ryan.html`, which runs his personal brand and its own stricter rules.

**Two locked quotes, one per page.** The keeper line about suppliers and partners is on the home page. The emergency line is on Partnerships. They are reproduced word for word and they are never chained in the same piece, so if you move one, move it whole and do not put both on one page. The long belief statement on Partnerships is also verbatim and stays in the first person, attributed, because that is how it was written.

**The prose rules bite.** No dash of any kind in prose, no colon unless a list follows immediately, Australian spelling, and no "not X, Y" contrast constructions. The last one is easy to write by accident in a headline. `We take equity, not a fee` was drafted and cut for exactly that reason.

Two claims the site deliberately does not make. It never says the partner network is large, because it is not one yet, and it never puts a percentage or a timeline on a deal. Both absences are explained in the copy rather than left as holes.

## Swapping in photography

Every image slot is a placeholder that names the shot it wants, so nothing looks broken before the photos land. To use a real image, delete the `<div class="ph">` and drop in an `<img>`:

```html
<!-- before -->
<div class="media r-32">
  <div class="ph" data-slot="Image 3:2"><span>Load in, empty room, trucks at the dock.</span></div>
</div>

<!-- after -->
<div class="media r-32">
  <img src="assets/img/load-in.jpg" alt="Crew unloading cases at the dock before doors">
</div>
```

Ratio classes: `r-32` `r-43` `r-11` `r-45` `r-169` `r-219`.

Hero images work the same way, inside `<div class="hero__media">`. The home hero is live: `assets/img/hero-foh.jpg`, a 2400px wide crop of the front of house shot with a Gaussian blur of 4 baked in, plus a 1200px variant wired through `srcset` for phones. Baked rather than a CSS `filter`, so it costs nothing to paint and has no soft edge artefacts.

When you drop a photo into a hero, re-check contrast against the **pixels**, not the tokens. A CSS audit will pass while text sits on a bright part of the image. The scrim and `img` opacity on this one were tuned by sampling the brightest ground pixel under each piece of hero text: eyebrow 7.67:1, headline 12.74:1, lede 4.99:1, ghost button 14.17:1. The hero eyebrow also lifts from `--mute` to `--sub`, because the dimmest token does not hold over a photograph.

## The Lineup, cut on purpose

There used to be a sixth page listing the businesses in the group, plus a three card preview of it on the home page. Both are gone. The group is one business, and a portfolio wall with one card on it makes a group look smaller than saying nothing does.

The `.biz` card styles are still in the stylesheet and the pattern is documented in git history, so bringing the page back is a copy job once there are three or four names to put on it. Until then the home page carries what the group does, and `partnerships.html` carries the detail.

## Metadata and social cards

Every page carries a canonical, the Open Graph set and `twitter:card`, with the title and description pulled from what the page already declares so the two can never drift.

The five cards in `assets/img/og-*.png` are 1200 by 630 and they are **generated, not drawn**. `tools-og/card.html` links the real stylesheet and uses the real `.hl-stage` markup, so the lockup on the card is the header lockup rather than a redrawing of it, beam and taper included. Re-run `tools-og/gen.js` whenever a page headline changes.

All five share one anatomy. A photograph holds the left and dissolves into the ground on two axes, with the headline and record bottom right. Only the brand changes. The group's four put the header lockup top left with the beam bleeding off the edge exactly as it does in the bar, run the venue shot to 80 percent of the card, and rake the aqua beam across from the top right corner. His keeps the signature top right.

The venue shot is far lighter and wider than his portrait, so it carries its own numbers: an earlier dissolve, a heavier right hand scrim, and a pool of shade in the bottom right corner where the copy sits over a lit floor and a front of house monitor. Without that pool the headline measures 4.71:1, with the bright pixel landing under the first word.

`ryan.html` gets a different card on purpose, built to the anatomy of his LinkedIn banner. Signature as the mark, Caveat kicker, Anton headline and the record, all right aligned, with his portrait holding the left of the frame and dissolving into the ground on two axes, the same move his page hero makes. No round crop. That is a LinkedIn requirement rather than a design decision and it does not belong on a surface with no such rule. His page exists to read as a different business and the card has to do the same job.

Two of his brand rules constrain it and both were checked against pixels rather than tokens. The pink bloom stops short of the signature, since his system keeps that mark on clean ground and never on a colour fill, and the ground under it measures luminance 0.003. The kicker is the single handwritten moment. Pink at 5.51:1, the record at 15.67, and the headline at 10.03 where it crosses the softest part of the dissolve.

**The domain in every canonical and `og:url` is a placeholder.** Until `headlinergroup.com.au` is swapped for the real one, every shared link points at nothing.

## Wiring the forms

Every form is inert on purpose. It carries `data-demo`, which makes `main.js` fake a success message so you can see the state. To make one real:

1. Set `action` and `method` on the `<form>`, or point it at your form service.
2. Delete the `data-demo` attribute.
3. Delete the `<p class="formmsg">` line if your service redirects instead.

Forms live in the footer of every page (newsletter), on `free.html` (the download gate), and on `contact.html` (the main enquiry form).

## Copy rules this site is written to

These are Ryan's locked positioning rules and the copy already obeys them. Keep them if you edit.

- The words **equity, acquisition, acquire, roll-up and PE never appear**. "Buy into", "take a stake", "partner" and "exit" carry the same meaning without the language.
- **No dashes in prose.** No em dash, en dash or hyphen. Restructure with commas, full stops or brackets. Hyphens in code, class names and URLs are fine.
- **No colon in prose** unless it immediately introduces a list.
- **Australian spelling** throughout.
- Ryan is an entrepreneur, partner and investor. Never an operator, never a CEO for hire.
- Aaron Sansoni appears as past tense backstory only.
- Proof numbers are **115+ live events** and **56,000+ attendees**. Do not mix these with other figures.

## Before this goes live

Everything marked `PLACEHOLDER` in the HTML needs a real answer.

- [ ] The stat band on `ryan.html`. `115+` and `56,000+` are real and locked. The `6` businesses figure is invented and has to go, since Ryan has ruled the stat band is his personal record only
- [ ] Revenue thresholds on `partnerships.html` (currently $2m to $20m)
- [ ] The three frameworks on `ryan.html`. Confirm which are public and delete the rest
- [ ] Real files in `assets/downloads/` for every link on `free.html`
- [ ] The contact email, currently `hello@headlinergroup.com.au`
- [ ] LinkedIn and Instagram URLs, currently pointing at the platform home pages
- [ ] A privacy policy, before the forms are wired to anything real. Ryan removed the footer links because this paperwork is per deal, which is right for Terms and not for privacy. Collecting an email address triggers Privacy Act and Spam Act obligations regardless of what the site says
- [ ] Photography for the remaining placeholders. The home hero and the Ryan hero are done
- [ ] The real domain, in every canonical and `og:url`. Currently `headlinergroup.com.au` as a placeholder
- [ ] Regenerate the social cards if any page headline changes

## Notes

- Fonts are **self hosted** in `assets/fonts/` (about 284KB, latin and latin-ext subsets). No third party request, works offline. Archivo Black, Inter and Caveat are all under the SIL Open Font License 1.1.
- Caveat only appears on `ryan.html`. If you care about the last 100KB, split `fonts.css` and load it there only.

## One accessibility note

`--mute #7A7A7A` on `--panel #111111` measures **4.40:1**, just under the 4.5:1 needed for normal text. On `--base` it is 4.61:1 and passes. Since cards are `--panel` on base bands, roughly half the body copy sits at 4.40. The tokens are locked so it has been left exactly as specced. Moving `--mute` to `#7C7C7C` takes it to 4.51:1 and is not perceptibly different, if you want it to clear AA outright.
- `main.js` is about eighty lines and has no dependencies. It handles the sticky header, the mobile menu, reveal on scroll and the demo forms.
- The header and footer markup is duplicated across all six pages. Editing the nav means editing six files. That is the cost of having no build step, and at six pages it is the cheaper trade.
- Motion respects `prefers-reduced-motion`.
