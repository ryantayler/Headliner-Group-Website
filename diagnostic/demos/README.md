# Demo reports

Five fabricated businesses, each answering all 58 questions, each run through the
live engine. Nothing in the output is written by hand.

```
cd diagnostic/demos && node build-demos.js
```

Writes `five-demos.html`, a static page with one tab per business. Regenerate it
after any change to `content.js` or `engine.js`, or the page goes stale against
the tool it is meant to be demonstrating.

`demos.js` holds the five answer sets and the business descriptions. They were
tuned so the five between them cover five different constraints, all three risk
families, and every optional section. Fold Event Co prints everything including a
minor constraint. Tallow Crew prints the fewest sections, with no minor risk.

| Business | Constraint | Risk family |
|---|---|---|
| Northline AV | Cash flow | Concentration |
| Fold Event Co | Talent | Owner |
| Kerrick Staging | Fulfilment | Fragility |
| Halcyon Studio | Offer | Concentration |
| Tallow Crew | Margin | Fragility |
