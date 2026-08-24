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

Headliner Group is its own brand. It shares taste with Ryan's personal system but not its assets.

| | Headliner Group | Ryan Tayler |
| --- | --- | --- |
| Accent | Marquee amber `#E0A040` | Purple `#8B5CF6` |
| Display face | Archivo, uppercase, set wide (`font-stretch:118%`) | Anton in his own system |
| Editorial voice | Instrument Serif, one pull quote per page | Caveat handwriting, one moment per page |
| Signature | Never used | Ink only, clean ground, `ryan.html` only |

The Ryan page flips the whole palette with one class on `<body>`:

```html
<body class="theme-ryan">
```

That swaps `--accent` and `--accent-deep`. Nothing else in the stylesheet changes. Adding another themed page is one class and two tokens.

## Structure of every page

Every page runs the same rhythm: **dark hero, light body, dark close.** The dark is structural, not decoration, and it is what stops the site reading as a template. Keep the rhythm when you add sections.

Bands are the unit of layout:

```html
<section class="band band--bone">   <!-- warm paper, the default reading ground -->
<section class="band band--paper">  <!-- white, for contrast against bone -->
<section class="band band--recess"> <!-- slightly deeper paper -->
<section class="band band--dark">   <!-- stage black -->
```

Tokens live at the top of `assets/css/styles.css`. Never hardcode a hex where a token exists.

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

- Fonts are **self hosted** in `assets/fonts/` (about 460KB, latin and latin-ext subsets). No third party request, works offline. Archivo, Instrument Serif, Inter and Caveat are all under the SIL Open Font License 1.1.
- Caveat only appears on `ryan.html`. If you care about the last 100KB, split `fonts.css` and load it there only.
- `main.js` is about eighty lines and has no dependencies. It handles the sticky header, the mobile menu, reveal on scroll and the demo forms.
- The header and footer markup is duplicated across all six pages. Editing the nav means editing six files. That is the cost of having no build step, and at six pages it is the cheaper trade.
- Motion respects `prefers-reduced-motion`.
