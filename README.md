# Headliner Group

Static template for the Headliner Group website. Six pages, one stylesheet, no build step. Open `index.html` in a browser and it runs.

## Pages

| File | Page | Job |
| --- | --- | --- |
| `index.html` | Home | Sets the scene. Images, short headings, proof, one link into every other page. |
| `lineup.html` | The Lineup | The businesses in the group. Each card links out to that business's own site. |
| `partnerships.html` | Partnerships | The depth page. What we look for, what we bring, the process, the deal shapes. |
| `ryan.html` | Ryan | Ryan's personal brand page. Runs on his own colours, not the group's. |
| `free.html` | Free Sh!t | Lead magnets. Some download straight away, some sit behind an email. |
| `contact.html` | Contact | The conversion point. Form, direct contact, what happens next. |

## The identity

Built to the Headliner Group logo and beam spec. Dark only, one accent, and Archivo Black reserved entirely for the logo.

| | Value |
| --- | --- |
| Page ground | `--base #0A0A0A`. Dark only, there is no light theme |
| Raised surfaces | `--panel #111111` for cards and alternating bands |
| Accent | Aqua `#2DE2C3`, one per page, no second accent anywhere |
| Logo face | Archivo Black, the logo and nothing else |
| Everything else | Inter 400 / 500 / 600, headings included |
| Light source | The beam, one per section and not every section |

`ryan.html` is his personal brand page, so it swaps the one accent to purple `#8B5CF6` through `.theme-ryan` on the body. It is also the only page with Caveat handwriting and his signature. Still one accent on that page, just a different one.

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

`--beam` is scoped to `.hl-logo` and hardcoded aqua, so the logo stays aqua everywhere, including `ryan.html` where the page accent is purple.

The logo beam is a **hard edged tapered shaft with a gradient inside**. CSS applies `clip-path` after `filter`, which is what produces that edge. It looks like a bug and is not. Do not move the blur and the clip onto separate layers.

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

Hero images work the same way, inside `<div class="hero__media">`. The scrim above them is already tuned so white text stays readable on any photo.

## Adding a business to the lineup

Copy any `<a class="card biz card--hover">` block in `lineup.html` and change five things: the image, the sector, the city, the name, and the link. The grid reflows on its own.

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

- [ ] Business names, sectors, cities, copy and links in `lineup.html` and on the home page
- [ ] The stat band numbers. `115+` and `56,000+` are real, `6` businesses and `20+` years are not
- [ ] Revenue thresholds on `partnerships.html` (currently $2m to $20m)
- [ ] The three frameworks on `ryan.html`. Confirm which are public and delete the rest
- [ ] Real files in `assets/downloads/` for every link on `free.html`
- [ ] The contact email, currently `hello@headlinergroup.com.au`
- [ ] LinkedIn and Instagram URLs, currently pointing at the platform home pages
- [ ] Privacy and Terms pages, currently `#`
- [ ] Photography for every placeholder
- [ ] Open Graph images and tags if this gets shared anywhere

## Notes

- Fonts are **self hosted** in `assets/fonts/` (about 284KB, latin and latin-ext subsets). No third party request, works offline. Archivo Black, Inter and Caveat are all under the SIL Open Font License 1.1.
- Caveat only appears on `ryan.html`. If you care about the last 100KB, split `fonts.css` and load it there only.

## One accessibility note

`--mute #7A7A7A` on `--panel #111111` measures **4.40:1**, just under the 4.5:1 needed for normal text. On `--base` it is 4.61:1 and passes. Since cards are `--panel` on base bands, roughly half the body copy sits at 4.40. The tokens are locked so it has been left exactly as specced. Moving `--mute` to `#7C7C7C` takes it to 4.51:1 and is not perceptibly different, if you want it to clear AA outright.
- `main.js` is about eighty lines and has no dependencies. It handles the sticky header, the mobile menu, reveal on scroll and the demo forms.
- The header and footer markup is duplicated across all six pages. Editing the nav means editing six files. That is the cost of having no build step, and at six pages it is the cheaper trade.
- Motion respects `prefers-reduced-motion`.
