# SEO and AEO

Everything search needs for headlinergroup.com.au and the leadership test funnel. SEO is
ranking in Google's normal results. AEO (answer engine optimisation) is being the name an
AI tool gives when someone asks it a question, in ChatGPT, Perplexity, Gemini or Google's
AI Overview.

## The goal, and an honest read on it

The target is the answer to "who is the partnerships expert in the live events industry
in Australia".

Nobody can guarantee the first answer. AI tools build that answer from what lots of
other sources say about you, so your own site is only part of it. The schema in this
folder makes sure they know exactly who Ryan Tayler is and what he does. It doesn't make
them pick you.

The good news is the query is narrow. Very few people in Australia are publicly tied to
"partnerships" and "live events" together, so it's winnable. These are the moves, most
important first:

1. **Say the same sentence everywhere.** AI tools trust a claim when many sources repeat
   it. Pick one line and use it word for word on the site, LinkedIn, Instagram, YouTube,
   speaker bios and podcast intros. The one the schema uses is below.
2. **Get other people to say it.** Podcasts, industry associations, trade publications,
   event awards and panel listings. One episode page that calls you "Ryan Tayler, who
   partners with founders in live events" is worth more than anything on your own site.
   Ask every host to use the sentence and link to `/ryantayler`.
3. **Link your profiles.** Add the four profile URLs to `build-schema.py` (see below).
   Until then, Google can't be sure the LinkedIn Ryan Tayler and the site Ryan Tayler
   are the same person.
4. **Answer the question on the page.** `/ryantayler` opens in the first person ("I
   partner with founders…"). AI tools quote third person facts more easily. One line on
   that page in the third person would help, for example in the footer or under the
   name. Your call, since it's site copy.
5. **Keep writing about partnerships in live events.** Your weekly LinkedIn posts already
   do this. Use the word "partnerships" in them, since it's the word people search with.
6. **Check it monthly.** Ask ChatGPT, Perplexity, Gemini and Google the target question
   on the first of each month. Note who comes up. Expect months, not weeks.

### The sentence

> Ryan Tayler is an entrepreneur who partners with founders in live events and production
> across Australia. He has delivered 115+ live events for 56,000+ attendees and is the
> founder of Headliner Group.

## What's in this folder

| File | What it is |
|---|---|
| `build-schema.py` | Builds the three schema blocks from one description of you and the business. |
| `schema/home.html` | Paste into the head code of `/home`. |
| `schema/ryan-tayler.html` | Paste into the head code of `/ryantayler`. |
| `schema/leadership-test.html` | Paste into the head code of the test's landing step. |

Schema (JSON-LD) is a hidden block of code that tells search engines and AI tools facts
in a form they can read without guessing. Nobody sees it on the page.

### Adding your profile links

1. Open `build-schema.py`.
2. Paste your full LinkedIn, Instagram, YouTube and Facebook URLs into `PROFILES`.
3. Run `python3 seo/build-schema.py`.
4. Paste the three `schema/` files again.

Or send me the four links and I'll do it.

### Pasting a schema block

1. Open the page's settings in Go High Level (for a funnel, the step's settings).
2. Find **Head tracking code**.
3. Paste the whole file, including the `<script>` tags.
4. Save and publish.
5. Check it at [Google's Rich Results Test](https://search.google.com/test/rich-results)
   by entering the live URL.

## Page titles and descriptions

These go in each page's SEO settings in Go High Level. The title is the blue link in
Google. The description is the grey text under it.

### Leadership test funnel

| Step | Title | Description | Index |
|---|---|---|---|
| `/headliner-leadership-styles-home` | Headliner Leadership Styles Test by Ryan Tayler | Take Ryan Tayler's leadership test and find out which of Ryan's six leadership styles you lead with. | Yes |
| `/headliner-leadership-styles-form` | Start the test \| Headliner Leadership Styles Test | (leave blank) | No |
| `/headliner-leadership-styles-test` | The test \| Headliner Leadership Styles Test | (leave blank) | No |
| `/headliner-leadership-styles-reults-page` | Your result \| Headliner Leadership Styles Test | (leave blank) | No |

Only the landing step should show in Google. The other three are useless to someone
arriving from a search, and the result step makes a new URL for every set of answers.
Paste this into the head tracking code of each "No" step:

```html
<meta name="robots" content="noindex, follow">
```

Social image for the landing step: the hero photo is fine for now. A proper 1200 by 630
card in the style of the site's others would share better.

### Main site

These are what the repo's page files already carry. Check the live SEO settings match.

| Page | Title | Description |
|---|---|---|
| `/home` | Headliner Group \| Partnering with founders in live events and production | Headliner Group partners with founders in live events and production across Australia. We take a stake, we help the business grow, and we give founders the option to exit. |
| `/partnerships` | Partnerships \| Headliner Group | What Headliner Group looks for, what we bring, and exactly what happens when we partner with a founder in live events and production. |
| `/ryantayler` | Ryan Tayler \| Entrepreneur and investor in live events and production | Ryan Tayler is an entrepreneur partnering with founders in live events and production. 115+ live events, 56,000+ attendees, and the founder of Headliner Group. |
| `/freeshit` | Free Sh!t \| Headliner Group | Templates, checklists and calculators for people who run live events. Built for real jobs and given away free. |
| `/letschat` | Start a conversation \| Headliner Group | Tell us about your business in live events or production. Everything you send stays between us. |

**One change worth making, for the target query.** The `/ryantayler` title doesn't say
"partnerships" or "Australia", and those are two of the words people search with. An
option, if you want it:

> Ryan Tayler \| Partnerships in live events and production, Australia

## Things to confirm

- The funnel runs on `headlinergroup.com.au`. The schema assumes it does. If it's on
  another domain, change `TEST_PATH` and `SITE` in `build-schema.py` to match.
- The four social links in the site footer are still placeholders pointing at each
  platform's home page. Same fix as `PROFILES` above, and it matters for the same reason.
