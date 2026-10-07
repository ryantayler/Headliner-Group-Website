# Leadership Styles Test, the model

Everything the test does, in plain terms, so it can be rebuilt from scratch
or edited without reading the code.

---

## 1. Shape

- 28 statements, four answer options each.
- No neutral option, on purpose. Every statement costs something to agree with.
- Four axes, seven statements each.
- The result is one of six styles, plus two descriptive labels.

## 2. The four axes

| Axis | Low end | High end |
|---|---|---|
| **Trigger** | gut, acts on instinct | proof, wants evidence first |
| **Drive** | people | the work |
| **Manner** | blunt | measured |
| **Reactiveness** | immediate | thought |

Manner and Reactiveness were split out of a single Delivery axis in v3,
because how bluntly you say something and how fast you get around to saying
it are not the same trait.

## 3. Scoring

Answers map to 1, 2, 3, 4 (strongly disagree through strongly agree).

```
raw(axis)  = sum of the 7 items on that axis
             a reverse item contributes (5 - answer) instead of the answer
range      = 7 to 28
percent    = (raw - 7) / 21 * 100
```

Bands:

```
Trigger        7-17  gut            18-28 proof
Drive          7-14  people         15-21 mixed        22-28 the work
Manner         7-14  blunt          15-20 balanced     21-28 measured
Reactiveness   7-14  immediate      15-20 balanced     21-28 thought
```

The style is picked from Trigger and Drive only. Manner and Reactiveness
describe how the style shows up, they do not change which style you get.

```
style = the one style whose (trigger band, drive band) matches yours
```

## 4. The six styles

| Key | Name | Closest read | Trigger | Drive | Pairing | |
|---|---|---|---|---|---|---|
| `believer` | The Believer | Richard Branson | 0 | 0 | pairs best with `optimiser` | works for `architect` |
| `charger` | The Charger | Elon Musk | 0 | 1 | pairs best with `anchor` and `architect` | no workable |
| `purist` | The Purist | Steve Jobs | 0 | 2 | pairs best with `optimiser` | works for `anchor` |
| `anchor` | The Anchor | Ted Lasso | 1 | 0 | pairs best with `charger` | works for `purist` |
| `optimiser` | The Optimiser | Jeff Bezos | 1 | 1 | pairs best with `believer` and `purist` | no workable |
| `architect` | The Architect | Warren Buffett | 1 | 2 | pairs best with `charger` | works for `believer` |

**The Believer** (Richard Branson)
: Sells the vision before it exists and pulls people into it on belief alone. Moves fast, starts more than they finish, and the room follows because they want to.

  Pairs best with `optimiser`. You sell it, they prove it and build the machine that holds it up.

**The Charger** (Elon Musk)
: Backs an instinct hard, then builds a machine around it at brutal speed. Rewrites the plan mid flight and expects everyone to keep up.

  Pairs best with `anchor`. You set the direction hard and fast, they keep the humans intact behind you.

**The Purist** (Steve Jobs)
: Knows what good looks like and will not ship until it is. Slow to release, uncompromising on detail, and usually right in a way that annoys people.

  Pairs best with `optimiser`. You will not compromise the work, so they run everything around it.

**The Anchor** (Ted Lasso)
: Reads the evidence, then moves the org through trust and patience rather than force. Steady, deeply consultative, plays a long game on culture.

  Pairs best with `charger`. You build the team, they supply the conviction to point it somewhere.

**The Optimiser** (Jeff Bezos)
: Measures everything and lets the numbers pick the direction. Builds process that outlives them and scales aggressively once the data clears.

  Pairs best with `believer`. You measure and systemise, they create the thing worth measuring.

**The Architect** (Warren Buffett)
: Waits for the right thing, then commits and holds. Almost no activity for long stretches, enormous conviction when they finally act.

  Pairs best with `charger`. You wait for the right call, they create the momentum between calls.


### Two best fits for the middle

Best fit is one Drive step across, workable is two. The Charger and the
Optimiser sit on systems, the middle of Drive, so both of their matches are one
step across. They get two best fits and no workable. Ryan's ruling, October 2026.
The funnel shows this. The single file tests in this folder still print the old
Workable line for those two.

## 5. The question set

`reverse` means the score is flipped, so agreeing pushes the axis down
rather than up. Keep roughly half of each axis reversed or the test
measures agreeableness instead of leadership.

| # | Axis | Direction | Statement |
|---|---|---|---|
| 1 | Trigger | reverse | I have committed real money to something I could not have justified on paper at the time. |
| 2 | Drive | reverse | When something goes wrong, my first instinct is who needs support, not what broke. |
| 3 | Manner | reverse | I have said something in a meeting knowing it would embarrass someone, because it needed saying. |
| 4 | Reactiveness | forward | I have let a problem run for a fortnight while I worked out how to raise it. |
| 5 | Trigger | forward | I have asked for another round of numbers when the team was already ready to move. |
| 6 | Drive | forward | I have let a team member struggle through a week because fixing the output mattered more. |
| 7 | Manner | reverse | People have described me as blunt more than once. |
| 8 | Reactiveness | forward | I will hold an issue until I can raise it privately, even if the group keeps working off bad information. |
| 9 | Trigger | reverse | I have overruled an analysis because it did not match what I believed was true. |
| 10 | Drive | reverse | I spend more of my week in conversations than producing anything myself. |
| 11 | Manner | forward | I spend more time deciding how to say something than deciding whether it is true. |
| 12 | Reactiveness | reverse | I would rather have an awkward conversation today than a smooth one on Friday. |
| 13 | Trigger | forward | I have missed an opportunity because I wanted more certainty before committing. |
| 14 | Drive | forward | I have redone someone's work myself instead of coaching them through it. |
| 15 | Manner | reverse | I have named a problem in front of a group before checking how the person would take it. |
| 16 | Reactiveness | reverse | When something annoys me, the person usually hears about it the same day. |
| 17 | Trigger | reverse | I would rather back the wrong thing early than the right thing late. |
| 18 | Drive | reverse | I could describe my team's mood more accurately than the status of the work. |
| 19 | Manner | forward | I soften feedback so it lands, even when that means the point arrives weaker. |
| 20 | Reactiveness | forward | I sit on bad news until I have worked out what to do about it. |
| 21 | Trigger | forward | I need to see something work at small scale before I will put real weight behind it. |
| 22 | Drive | forward | I would rather ship the right thing with a strained team than the wrong thing with a happy one. |
| 23 | Manner | reverse | I would rather be understood than liked. |
| 24 | Reactiveness | reverse | I have reacted to a problem before I had the full picture. |
| 25 | Trigger | reverse | I have started work on something before the business case was finished. |
| 26 | Drive | forward | I judge my week by what got finished, not by how the team is travelling. |
| 27 | Manner | forward | I have rewritten a message several times to get the tone right. |
| 28 | Reactiveness | forward | I would rather raise something once, properly, than raise it early and be half right. |

## 6. Output

- The named style, its closest read, and the description.
- A two axis map with a dot placed at the Trigger and Drive percentages.
- Four sliders, one per axis, with the band label.
- Six bars ranking every style by fit, the user's own marked.
- Raw scores out of 28 for all four axes.
- A print sheet, light or dark.
