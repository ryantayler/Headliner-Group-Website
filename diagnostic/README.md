# Business Diagnostic

A local prototype. Fifty two closed questions in, one constraint out, plus a risk
profile and a list of things not to touch yet. Deterministic. Same answers in,
same report out, every time. No AI at runtime.

Open `diagnostic/index.html` in a browser. There is no build step and no server
needed. Nothing about it touches the five live Headliner pages.

## Files

| File | What it is |
|---|---|
| `content.js` | Every question, option, band, weight, threshold and line of report prose. The only file with copy in it. |
| `engine.js` | The logic. Scores the blocks, walks the chain, applies suppression, assembles the report. No copy lives here. |
| `app.js` | The interface. Renders the form, holds the answers, prints the report. No logic lives here. |
| `diagnostic.css` | Ryan's brand system, scoped to this folder. Dark on screen, paper when printed. |
| `build-spec-xlsx.py` | Generates `Business-Diagnostic-Spec.xlsx` from `content.js`. |
| `Business-Diagnostic-Spec.xlsx` | The editing surface. Fourteen tabs covering every question and every block. |

If the diagnosis looks wrong, the cause is in `content.js` or `engine.js`. If the
page looks wrong, it is `app.js` or the stylesheet. That split is deliberate,
keep it.

## How the diagnosis is made

**Primary constraint.** The engine walks the seven constraints in fixed chain
order and calls the first one that fails. A constraint fails when its hard
trigger fires, or when its block score reaches `PRIMARY_FAIL`. It never picks
the highest scoring one, because a downstream constraint overtaking a failing
upstream one is exactly the mistake the tool exists to prevent.

There is no dominance override. If demand scores 95 while cash flow scores 61,
cash flow is still called. The protection against naming a mild problem is that
the bar is set high enough that clearing it means genuinely broken, not that a
louder problem gets to jump the queue.

**Minor constraint.** Bar is `MINOR_PRINT`, deliberately higher than
`PRIMARY_FAIL`. A minor has to be louder than the threshold that would have made
it a primary in its own right. Suppression then removes anything explained by the
primary, and it runs transitively through the chain, so talent removes fulfilment
and value underneath it. One survivor prints, one line, no fix.

A useful property falls out of that. Anything above `MINOR_PRINT` that survives
suppression is necessarily downstream of the primary, because if it were upstream
chain order would have made it the primary. So the line saying it is downstream
is always literally true.

**Risk.** Sixteen flags across three families. Family score is 60 percent of the
loudest single flag plus 40 percent of the proportion of that family's flags
raised. Top family prints with up to three named flags, second family gets one
line if it clears `MINOR_RISK_PRINT`.

**Not sure.** Never scores zero and nothing else. It contributes no severity,
feeds the data blindness flag, and at fifteen or more the report opening switches
to a provisional version. A Not sure answer also carries no band phrase, which is
what makes its evidence clause drop out of a sentence rather than print a hole in
one. That is why evidence is stored as separate clauses rather than whole
paragraphs.

**The exact figure.** Optional, offered on nine questions whose answers actually
reach the report. It changes the wording and never the finding. The logic already
fired on the band, so a typo cannot flip the verdict.

## Editing the content

Run the tool, hand out `Business-Diagnostic-Spec.xlsx`, take the edits back, then
apply them to `content.js` and regenerate the workbook.

```
python3 build-spec-xlsx.py
```

Yellow cells in the workbook are wording. Grey cells are ids the engine matches
on and changing one breaks the link between a question, its answer and the
report line quoting it.

## Testing

The dev bar at the bottom of the page is screen only and never prints. Each
button loads a scenario built to fire one specific constraint, so you can read
the wording without answering fifty two questions. Every report also carries a
`Why this fired` panel showing all seven scores, what was disqualified, what
suppression removed and every flag raised.

The node test in the scratchpad checks that each of the seven scenarios fires its
own constraint and that suppression holds.

## Still open

- Product name.
- Whether the report ends in a call to action. `closing.cta` is deliberately empty.
- Band thresholds and weights are a first pass. They are the first thing to tune
  once real businesses have been through it.
- No lead capture, no email gate, no analytics. Answers are saved to the browser
  and go nowhere else.
