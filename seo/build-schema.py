#!/usr/bin/env python3
"""Write the paste ready schema (JSON-LD) blocks for the live site and the test funnel.

    python3 seo/build-schema.py

One definition of Ryan and one of Headliner Group, used by every block, so the pages
can never describe him two different ways. Search engines and AI tools match a person
across pages by the "@id", so it stays the same everywhere.

Fill PROFILES with Ryan's real profile links and run it again. Empty ones are left out
rather than shipped as a placeholder.

The six styles and their lines are read out of the test's own script, so the schema
always says what the page says.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT = os.path.join(HERE, 'schema')

SITE = 'https://headlinergroup.com.au'
TEST_PATH = '/headliner-leadership-styles-home'   # the live landing step, see build-ghl-funnel.py

# Ryan's own profiles. These are the strongest signal that every mention of
# "Ryan Tayler" online is the same person. Paste the full URL of each.
PROFILES = {
    'linkedin':  '',
    'instagram': '',
    'youtube':   '',
    'facebook':  '',
}

ASSETS = json.load(open(os.path.join(REPO, 'ghl-assets.json')))

PERSON_ID = SITE + '/ryantayler#ryan'
ORG_ID = SITE + '/#org'
SITE_ID = SITE + '/#website'

PERSON = {
    '@type': 'Person',
    '@id': PERSON_ID,
    'name': 'Ryan Tayler',
    'givenName': 'Ryan',
    'familyName': 'Tayler',
    'url': SITE + '/ryantayler',
    'image': ASSETS['ryan-hero.jpg'],
    'jobTitle': 'Founder',
    'worksFor': {'@id': ORG_ID},
    'description': ('Ryan Tayler is an entrepreneur who partners with founders in live events '
                    'and production across Australia. He has delivered 115+ live events for '
                    '56,000+ attendees and is the founder of Headliner Group.'),
    'knowsAbout': [
        'Business partnerships in the live events industry',
        'Live events',
        'Event production',
        'Growing live events and production businesses',
        'Leadership styles',
    ],
    'sameAs': [u for u in PROFILES.values() if u],
}

ORG = {
    '@type': 'Organization',
    '@id': ORG_ID,
    'name': 'Headliner Group',
    'legalName': 'Headliner Group Pty Ltd',
    'url': SITE + '/',
    'image': ASSETS['og-index.png'],
    'description': 'Headliner Group partners with founders in live events and production across Australia.',
    'founder': {'@id': PERSON_ID},
    'areaServed': {'@type': 'Country', 'name': 'Australia'},
    'knowsAbout': ['Live events', 'Event production', 'Business partnerships'],
}

WEBSITE = {
    '@type': 'WebSite',
    '@id': SITE_ID,
    'url': SITE + '/',
    'name': 'Headliner Group',
    'publisher': {'@id': ORG_ID},
    'inLanguage': 'en-AU',
}


def clean(d):
    return {k: v for k, v in d.items() if v not in ([], '', None)}


def styles():
    js = open(os.path.join(REPO, 'leadership-test', 'funnel', 'leadership.js')).read()
    out = []
    for name, made in re.findall(r'n:"(The [A-Za-z]+)",c:"[^"]*",t:\d,d:\d,made:"([^"]+)"', js):
        out.append((name, made))
    assert len(out) == 6, out
    return out


def landing_copy():
    """The visible sentences the FAQ answers are lifted from. FAQ markup has to match
    what a reader can see on the page, word for word, or it counts as spam."""
    s = open(os.path.join(REPO, 'leadership-test', 'funnel', 'landing.html')).read()
    def text(pattern):
        m = re.search(pattern, s, re.S)
        t = re.sub(r'<[^>]+>', '', m.group(1))
        return t.replace('&rsquo;', '\u2019').replace('&amp;', '&').strip()
    return {
        'lede': text(r'<h1[^>]*>.*?</h1>\s*<p class="lede">(.*?)</p>'),
        'measures': text(r'What it measures</h2>\s*<p class="sub">(.*?)</p>'),
        'six': text(r'The six styles</h2>\s*<p class="sub">(.*?)</p>'),
    }


def block(graph, note):
    data = {'@context': 'https://schema.org', '@graph': [clean(g) for g in graph]}
    return ('<!-- ' + note + '\n     Built by seo/build-schema.py. Edit that, not this. -->\n'
            '<script type="application/ld+json">\n'
            + json.dumps(data, indent=2, ensure_ascii=False) + '\n</script>\n')


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {}

    files['home.html'] = block(
        [WEBSITE, ORG, PERSON],
        'Home page. Paste into the head tracking code of /home.')

    page = SITE + '/ryantayler'
    files['ryan-tayler.html'] = block(
        [{'@type': 'ProfilePage', '@id': page + '#page', 'url': page,
          'name': 'Ryan Tayler', 'inLanguage': 'en-AU',
          'isPartOf': {'@id': SITE_ID}, 'mainEntity': {'@id': PERSON_ID}},
         PERSON, ORG, WEBSITE],
        'Ryan Tayler page. Paste into the head tracking code of /ryantayler.')

    copy = landing_copy()
    six = styles()
    url = SITE + TEST_PATH
    set_id = url + '#styles'
    names = ', '.join(n for n, _ in six[:-1]) + ' and ' + six[-1][0]
    files['leadership-test.html'] = block(
        [{'@type': 'WebPage', '@id': url + '#page', 'url': url,
          'name': 'Headliner Leadership Styles Test by Ryan Tayler',
          'description': copy['lede'], 'inLanguage': 'en-AU',
          'isPartOf': {'@id': SITE_ID}, 'author': {'@id': PERSON_ID},
          'mainEntity': {'@id': url + '#test'}},
         {'@type': 'Quiz', '@id': url + '#test',
          'name': 'Headliner Leadership Styles Test',
          'alternateName': 'Ryan Tayler\u2019s leadership styles test',
          'description': copy['lede'],
          'author': {'@id': PERSON_ID}, 'creator': {'@id': PERSON_ID},
          'publisher': {'@id': ORG_ID}, 'about': {'@id': set_id},
          'timeRequired': 'PT5M', 'isAccessibleForFree': True, 'inLanguage': 'en-AU'},
         {'@type': 'DefinedTermSet', '@id': set_id,
          'name': 'Ryan\u2019s six leadership styles', 'creator': {'@id': PERSON_ID},
          'hasDefinedTerm': [{'@type': 'DefinedTerm', 'name': n, 'description': m + '.',
                              'inDefinedTermSet': {'@id': set_id}} for n, m in six]},
         {'@type': 'FAQPage', '@id': url + '#faq',
          'mainEntity': [
              {'@type': 'Question', 'name': 'What is the Headliner Leadership Styles Test?',
               'acceptedAnswer': {'@type': 'Answer', 'text': copy['lede']}},
              {'@type': 'Question', 'name': 'What are Ryan\u2019s six leadership styles?',
               'acceptedAnswer': {'@type': 'Answer', 'text': names + '. ' + copy['six']}},
              {'@type': 'Question', 'name': 'What does the leadership styles test measure?',
               'acceptedAnswer': {'@type': 'Answer', 'text': copy['measures']}},
          ]},
         PERSON, ORG, WEBSITE],
        'Leadership test landing step. Paste into the head tracking code of ' + TEST_PATH + '.')

    for name, text in files.items():
        open(os.path.join(OUT, name), 'w').write(text)
        # it has to parse, or the whole block is ignored without a word
        json.loads(re.search(r'<script[^>]*>(.*)</script>', text, re.S).group(1))
        print('wrote seo/schema/' + name)
    missing = [k for k, v in PROFILES.items() if not v]
    if missing:
        print('\nNo profile links yet for: ' + ', '.join(missing) + '. Add them to PROFILES and run again.')


if __name__ == '__main__':
    main()
