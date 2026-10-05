# Headliner Leadership Styles Test, v3

The leadership styles test on the Headliner Group identity. Same questions,
same scoring, same print sheet as the original v3 package. Only the look has
changed.

## Files

| File | What it is |
|---|---|
| `index.html` | The test. Open it in a browser. No build step, no server. |
| `ryan-baseline.html` | The same test with Ryan's answers filled in. Use it to sanity check scoring changes. It should read Purist, Trigger 15, Drive 25, Manner 13, Reactiveness 21. |
| `MODEL.md` | The axes, the scoring maths, the six styles and all 28 statements. |
| `BRAND.md` | Colours, fonts and the rules the look depends on. |

This folder is not one of the site's pages. `build-preview.py` and
`build-ghl.py` do not pick it up.

## Running it

Double click `index.html`. The only external request is Google Fonts.

## Editing it

Everything lives in one `<script>` block near the bottom. The two HTML files
differ only in their copy and the `BASE` answer array, so make every other
edit in both.

- **Change the wording of a question.** Edit the `q` string in the `Q` array.
- **Add or remove a question.** Add to `Q`, then fix the band thresholds in
  `update()`. They are tuned to 7 items per axis.
- **Change a style's copy.** Edit `STYLES`. Leave `t` and `d` alone unless
  you redraw the map.
- **Move the dots on the map.** `ANCHORS` holds the six label positions,
  `BOX` holds the six boxes.

## The one thing that will bite you

The band thresholds assume seven questions per axis. Add an eighth to any
axis and the maximum moves from 28 to 32, but the cutoffs stay put, so
everyone drifts toward the high band. Change the questions and the
thresholds in the same edit.
