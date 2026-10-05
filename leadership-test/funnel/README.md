# Leadership Styles Test, the funnel

Three pages for the funnel builder, plus the stylesheet and script they share.

| Step | File | Job |
|---|---|---|
| 1 | `landing.html` | What the test is, the four scales, an example result, the six styles, and the button into the test. |
| 2 | `questions.html` | The 28 statements. The result button unlocks when all 28 are answered. |
| 3 | `result.html` | The result, the print sheet, and links back to the test and the website. |

`leadership.css` and `leadership.js` serve all three.

## What carries between pages

The questions page sends the answers to the result page in the link, as
`result.html?a=` followed by 28 digits. That makes every result a link someone
can save or send. The browser also keeps a copy, so a visitor who leaves the
questions page halfway comes back to where they were.

## Putting it in the funnel builder

1. Make three steps, one per page.
2. Paste the markup between `<body>` and the `<script>` line of each page.
3. Paste `leadership.css` into each page's CSS, and `leadership.js` into each page's script box.
4. Change the three addresses in `LINKS` at the top of `leadership.js` to the funnel's step URLs and the website.
5. Add the fonts in the builder's settings, or as the `<link>` in each page's head. The families are Archivo Black and Inter 400, 500 and 600.

The pasted markup has no `<script>` tags and no void tags. The script fills in
everything that depends on the answers.

## Editing

Questions, scoring and every line of result copy live in `leadership.js`. The
landing page example is a real answer set (`EXAMPLE`) run through the real
scoring, so it always matches what a visitor gets. See `../MODEL.md` for the
model and the threshold warning.
