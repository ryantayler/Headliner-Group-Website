#!/usr/bin/env python3
"""Package the site for a page builder that takes pasted HTML, CSS and JS.

Writes one folder per page, each holding the three files that page needs, plus the
images to upload and a working local copy to check against. The five stylesheets and
the five scripts are identical by design, because the site is one stylesheet and one
script; the README says so and says where to put them once instead.

    python3 build-ghl.py <output dir>
"""
import json, os, re, shutil, sys

SRC = os.path.dirname(os.path.abspath(__file__))

# file name -> (folder name, slug the other pages link to)
PAGES = {
    'index.html':        ('home',          '/'),
    'partnerships.html': ('partnerships',  '/partnerships'),
    'ryan.html':         ('ryan-tayler',   '/ryan'),
    'free.html':         ('free-shit',     '/free'),
    'contact.html':      ('lets-chat',     '/contact'),
}

# Anton, Archivo Black, Caveat and Inter are all Google faces, self hosted here only
# because this build has no network. On a live site the CDN saves uploading nine files.
FONTS = ("@import url('https://fonts.googleapis.com/css2?family=Anton&"
         "family=Archivo+Black&family=Caveat:wght@400..700&"
         "family=Inter:wght@400;500;600&display=swap');\n\n")

TOKEN = 'ASSETS_BASE'
FILES = 'DOWNLOADS_BASE'

# filename -> uploaded URL. The host renames every upload to a random id, so without
# this the markup cannot name a picture. Anything not in here keeps the token and has
# to be found and replaced by hand.
MAP = {k: v for k, v in json.load(
    open(os.path.join(SRC, 'ghl-assets.json'))).items() if not k.startswith('_')} \
    if os.path.exists(os.path.join(SRC, 'ghl-assets.json')) else {}


def body_of(doc):
    """The inside of <body>, without the script tag that pulls main.js."""
    i = doc.index('>', doc.index('<body')) + 1
    j = doc.rindex('</body>')
    out = doc[i:j]
    out = re.sub(r'\s*<script src="assets/js/main\.js"></script>\s*', '\n', out)
    return out.strip('\n')


def relink(out):
    """Pictures become their uploaded URLs where one is known, and fall back to a token
    where it is not. The seven downloads have no files yet, so they keep their own."""
    out = out.replace('assets/downloads/', FILES + '/')
    out = re.sub(r'assets/img/([A-Za-z0-9_-]+\.(?:jpg|png|svg))',
                 lambda m: MAP.get(m.group(1), TOKEN + '/' + m.group(1)), out)
    for name, (_, slug) in PAGES.items():
        out = re.sub(r'(href=")' + re.escape(name) + r'(#|")',
                     lambda m: m.group(1) + slug + ('#' if m.group(2) == '#' else '"'),
                     out)
    return out


def main(dest):
    css = open(os.path.join(SRC, 'assets/css/styles.css')).read()
    js = open(os.path.join(SRC, 'assets/js/main.js')).read()

    # main.js is an IIFE that reads the DOM as it runs. At the end of <body> that is
    # fine. Pasted into a builder's header slot it would run too early, so it waits.
    def wrap(extra=''):
        return ('/* The reveal is claimed on the first line, outside the wait, so it is set\n'
                '   before anything paints. The stylesheet only hides .rv while this class\n'
                '   is there, so a box that never executes this file leaves the page\n'
                '   readable rather than blank. */\n'
                "document.documentElement.classList.add('rv-on');\n\n"
                '/* The rest runs once the markup exists, so this works from a header slot\n'
                '   as well as a footer one. */\n'
                'document.addEventListener("DOMContentLoaded", function () {\n'
                + extra + js.rstrip() + '\n});\n')

    for name, (folder, _) in PAGES.items():
        d = os.path.join(dest, '1-pages', folder)
        os.makedirs(d, exist_ok=True)
        doc = open(os.path.join(SRC, name)).read()

        open(os.path.join(d, 'page.html'), 'w').write(relink(body_of(doc)) + '\n')
        open(os.path.join(d, 'styles.css'), 'w').write(FONTS + css)

        # ryan.html carries a class on <body> that a pasted block cannot set, and the
        # page grain hangs off body.theme-ryan, so the script puts it there instead.
        extra = ('  document.body.classList.add("theme-ryan");\n'
                 if 'class="theme-ryan"' in doc[:doc.index('>', doc.index('<body'))] else '')
        body_js = wrap(extra)
        open(os.path.join(d, 'script.js'), 'w').write(body_js)
        # Some builders' code boxes take markup rather than bare JS and will paste this
        # in as text, where it never runs. Same file, tags already on it.
        open(os.path.join(d, 'script-in-tags.html'), 'w').write(
            '<script>\n' + body_js + '</script>\n')
        print('page', folder)

    # Every image the five pages ask for, gathered by reading them rather than listed.
    want = set()
    for name in PAGES:
        want |= set(re.findall(r'assets/img/([A-Za-z0-9_.-]+)', open(os.path.join(SRC, name)).read()))
    imgs = os.path.join(dest, '2-images')
    os.makedirs(imgs, exist_ok=True)
    for f in sorted(want):
        shutil.copy2(os.path.join(SRC, 'assets/img', f), imgs)
    print('images', len(want))

    # The site as it stands, to open in a browser and compare against.
    prev = os.path.join(dest, '3-working-copy')
    if os.path.isdir(prev):
        shutil.rmtree(prev)
    os.makedirs(prev)
    for name in PAGES:
        shutil.copy2(os.path.join(SRC, name), prev)
    for sub in ('css', 'js', 'fonts'):
        shutil.copytree(os.path.join(SRC, 'assets', sub), os.path.join(prev, 'assets', sub))
    shutil.copytree(os.path.join(SRC, 'assets/img'), os.path.join(prev, 'assets/img'),
                    ignore=shutil.ignore_patterns('_src'))
    print('working copy')

    readme(dest)
    print('readme')
    return want


def readme(dest):
    """Written from the files themselves, so the lists cannot drift."""
    rows = []
    for name, (folder, slug) in PAGES.items():
        doc = relink(body_of(open(os.path.join(SRC, name)).read()))
        back = {v: k for k, v in MAP.items()}
        imgs = sorted(set(re.findall(TOKEN + r'/([A-Za-z0-9_-]+\.(?:jpg|png|svg))', doc))) \
             + sorted({back[u] + ' (linked)' for u in back if u in doc})
        rows.append((folder, slug, name, imgs))

    t = ["# Headliner Group, packaged for a page builder", "",
         "Five pages. Each one is a folder holding the files that page needs.", "",
         "```"]
    for folder, slug, name, imgs in rows:
        t.append("1-pages/%-13s page.html  styles.css  script.js     ->  %s" % (folder + '/', slug))
    t += ["2-images/       every picture the five pages ask for",
          "3-working-copy/ the site as it stands. Open index.html in a browser to",
          "                compare against once it is live.",
          "```", "",
          "**styles.css and script.js are the same file five times over**, because the site is",
          "one stylesheet and one script. If your builder has a site wide custom CSS box and a",
          "site wide custom JS box, paste each one once there and skip them on the other four",
          "pages. The one exception is `1-pages/ryan-tayler/script.js`, which carries an extra",
          "line at the top. See **Ryan's page** below.", "",
          "---", "", "## Putting a page in", "",
          "1. Make a blank page, no template and no builder header or footer. The markup",
          "   carries its own header and footer, and two headers will fight.",
          "2. Drop in a custom code or raw HTML element that spans the full width, edge to",
          "   edge, with no padding. The page sets its own margins.",
          "3. Paste `page.html` into it.",
          "4. Paste `styles.css` into the page's custom CSS, or the site's.",
          "5. Paste `script.js` into the page's footer code, or the site's.", "",
          "The script waits for the markup before it runs, so a header slot works too.", "",
          "### If the page comes out mostly blank", "",
          "**The script is not running.** That is the one failure that empties a page, and",
          "it looks like the header and the hero photograph over nothing at all.", "",
          "Some code boxes want markup rather than bare JavaScript, and paste a `.js` file",
          "in as text where it never runs. Every page folder carries the same script a",
          "second time as `script-in-tags.html`, already inside a `<script>` tag. Use that",
          "one in any box that is expecting HTML, such as a header or footer tracking code",
          "field. Use the plain `script.js` only in a box that is expecting JavaScript.", "",
          "To tell which happened, open the page and look at the browser console. If the",
          "script ran, `document.documentElement.className` contains `rv-on`.", "",
          "## The pictures", "",
          "**Already done.** Every `src` in the markup is the uploaded URL, so the pages load",
          "their pictures the moment they are pasted. Nothing to find, nothing to replace.", "",
          "`ghl-assets.json` in the repo holds filename to URL. The host renames every upload",
          "to a random id, so that file is the only record of which picture is which. Upload a",
          "new one, add its line, re-run `build-ghl.py`.", "",
          "`2-images` is still here as the originals, in case anything has to go up again.",
          "Anything marked `(linked)` below is live. Anything not marked is still a token.",
          "Per page, in full:", ""]
    for folder, slug, name, imgs in rows:
        t.append("- **%s** (%d): %s" % (folder, len(imgs), ', '.join(imgs) if imgs else 'none'))
    t += ["",
          "`favicon.svg` is the only picture with no URL. It is not in the markup, it is a head",
          "tag, and the builder sets the favicon in its own settings.", "",
          "The five `og-*.png` are the social preview cards. They are not in the markup either.",
          "Their URLs are in `ghl-assets.json`, for each page's own SEO or sharing settings.", "",
          "## Links between pages", "",
          "The markup already points at these paths, so name the pages to match or edit the",
          "links once in the header and footer of each file.", ""]
    for folder, slug, name, imgs in rows:
        t.append("- `%s` is %s" % (slug, name.replace('.html', '')))
    t += ["",
          "## Fonts", "",
          "The first line of `styles.css` pulls Anton, Archivo Black, Caveat and Inter from",
          "Google. It has to stay the first line in the box or the browser ignores it. For a",
          "faster first paint put this in the page head instead and delete that line:", "",
          "```html",
          '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
          '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Archivo+Black&amp;family=Caveat:wght@400..700&amp;family=Inter:wght@400;500;600&amp;display=swap">',
          "```", "",
          "`3-working-copy` carries the font files instead, so it works with no network.", "",
          "## Ryan's page", "",
          "His page runs a different palette, and the switch for it sits on `<body>`, which a",
          "pasted block cannot reach. So `1-pages/ryan-tayler/script.js` puts it there itself,",
          "in its first line. **That page needs its own script, not the shared one.** Without it",
          "the page renders in the group's colours.", "",
          "## What is still a placeholder", "",
          "None of this is broken by the packaging. It was already outstanding.", "",
          "- **Every form does nothing.** They carry `data-demo` and only show the thank you",
          "  note. Point them at a real endpoint, or swap them for your builder's own form",
          "  elements, which is the easier road if the builder holds the contacts.",
          "- **The seven downloads do not exist**, so they are the one thing still on a token.",
          "  The markup asks for `DOWNLOADS_BASE/pillars.pdf` and six more. Upload the real",
          "  files, add them to `ghl-assets.json`, and they will bake in like the pictures did.",
          "  Until then the form on each card shows its note and releases nothing.",
          "- **The LinkedIn posts** are three real embeds. They need no work, but they will not",
          "  render anywhere that blocks third party frames.",
          "- **`headlinergroup.com.au` is a placeholder** in the social tags of the working copy.",
          "  It is not in the pasted markup, because those tags live in the head.",
          "- **The social links** point at bare linkedin.com, instagram.com, facebook.com and",
          "  youtube.com rather than at the real profiles. Seven of them are LinkedIn.", ""]
    open(os.path.join(dest, 'README.md'), 'w').write('\n'.join(t))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'ghl-export')
