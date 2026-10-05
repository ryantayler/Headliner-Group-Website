#!/usr/bin/env python3
"""Package the leadership test funnel for Go High Level.

One folder per funnel step, each holding the markup, one stylesheet and one script.
The form step is cut at its GHL:FORM markers into the block above the builder's form
and the block below it, the same way the site's own form pages are.

    python3 build-ghl-funnel.py <output dir>

It follows what the site's build-ghl.py learned on the live site (see CLAUDE.md):
the fonts are loaded by the script, because the builder puts its own CSS ahead of
ours and drops an @import; the script runs at once if the page is already parsed,
because Go High Level adds footer code after DOMContentLoaded; and the markup holds
no script tags and no void tags.
"""
import json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))

# file -> (folder, the funnel step's path). The paths are the live ones Ryan set on
# 5 October 2026. "reults" is spelt as it is live; change both together if it is fixed.
PAGES = {
    'landing.html':   ('1-landing',   '/headliner-leadership-styles-home'),
    'form.html':      ('2-form',      '/headliner-leadership-styles-form'),
    'questions.html': ('3-questions', '/headliner-leadership-styles-test'),
    'result.html':    ('4-result',    '/headliner-leadership-styles-reults-page'),
}
KEYS = {'landing.html': 'landing', 'form.html': 'form', 'questions.html': 'test', 'result.html': 'result'}

FONTS_URL = ("https://fonts.googleapis.com/css2?family=Archivo+Black&"
             "family=Inter:wght@400;500;600&display=swap")

OVERRIDES = """

/* ==========================================================================
   PAGE BUILDER OVERRIDES
   Added by build-ghl-funnel.py, as the site's own export adds them.
   ========================================================================== */

/* The builder drops the block into a centred column. This pulls it back out to the
   full width of the window, whatever that column is doing. */
.hl-root{
  position:relative;
  width:100vw;max-width:100vw;
  margin-left:calc(50% - 50vw);
  margin-right:calc(50% - 50vw);
}
.hl-root>*{margin-left:0;margin-right:0}

/* The header carries its ground always. A host that scrolls its own container never
   fires the scroll that fades it in, so it stays see through without this. */
.hdr{
  background:rgba(10,10,10,.88);
  border-bottom-color:var(--rim);
  -webkit-backdrop-filter:saturate(140%) blur(10px);
  backdrop-filter:saturate(140%) blur(10px);
}

/* A builder's own reset can reach into the block. */
.hl-root img,.hl-root svg{max-width:100%}
.hl-root *,.hl-root *::before,.hl-root *::after{box-sizing:border-box}
"""

ASSETS = {k: v for k, v in json.load(open(os.path.join(REPO, 'ghl-assets.json'))).items()
          if not k.startswith('_')}


def body_of(doc):
    i = doc.index('>', doc.index('<body')) + 1
    out = doc[i:doc.rindex('</body>')]
    out = re.sub(r'\s*<script src="leadership\.js"></script>\s*', '\n', out)
    return out.strip('\n')


def slug(key):
    for name, (_, path) in PAGES.items():
        if KEYS[name] == key:
            return path
    return None


def relink(out):
    # links between steps become the funnel paths
    def fix(m):
        p = slug(m.group(1))
        return m.group(0) if p is None else 'data-link="%s" href="%s"' % (m.group(1), p)
    out = re.sub(r'data-link="(\w+)" href="[^"]*"', fix, out)
    # the hero photograph is already uploaded, so it goes in as its live URL
    out = re.sub(r'url\(img/([A-Za-z0-9_.-]+)\)', lambda m: 'url(%s)' % ASSETS[m.group(1)], out)
    return out


def root(markup):
    return ('<!-- One wrapper, so the page can break out of whatever column the builder\n'
            '     drops it into. The stylesheet pins it to the full viewport width. -->\n'
            '<div class="hl-root">\n' + markup.strip('\n') + '\n</div>\n')


def script():
    js = open(os.path.join(HERE, 'leadership.js')).read()
    block = re.search(r'var LINKS=\{.*?\n\};', js, re.S).group(0)
    new = ('var LINKS={\n' + ''.join('  %s:"%s",\n' % (KEYS[n], PAGES[n][1]) for n in PAGES)
           + '  site:"https://headlinergroup.com.au"\n};')
    js = js.replace(block, new)
    return ('<script>\n'
            '/* The fonts load from here. The builder puts its own CSS ahead of ours, and a\n'
            '   browser only honours @import as the first rule, so the stylesheet cannot do it. */\n'
            '(function () {\n'
            '  if (document.querySelector(\'link[data-hl-fonts]\')) return;\n'
            '  var l = document.createElement("link");\n'
            '  l.rel = "stylesheet";\n'
            '  l.href = "' + FONTS_URL + '";\n'
            '  l.setAttribute("data-hl-fonts", "");\n'
            '  document.head.appendChild(l);\n'
            '})();\n\n'
            '/* Runs at once if the page is already parsed, which it is when Go High Level\n'
            '   adds footer code, and only waits if it is not. */\n'
            '(function (run) {\n'
            '  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);\n'
            '  else run();\n'
            '})(function () {\n' + js.rstrip() + '\n});\n'
            '</script>\n')


def main(dest):
    if os.path.isdir(dest):
        shutil.rmtree(dest)
    css = open(os.path.join(HERE, 'leadership.css')).read() + OVERRIDES
    js = script()
    rows = []
    for name, (folder, path) in PAGES.items():
        d = os.path.join(dest, folder)
        os.makedirs(d)
        body = relink(body_of(open(os.path.join(HERE, name)).read()))
        if '<!-- GHL:FORM -->' in body:
            top, rest = body.split('<!-- GHL:FORM -->')
            bottom = rest.split('<!-- /GHL:FORM -->')[1]
            open(os.path.join(d, 'page-1-above-form.html'), 'w').write(root(top))
            open(os.path.join(d, 'page-2-below-form.html'), 'w').write(root(bottom))
            files = ['page-1-above-form.html', 'page-2-below-form.html']
        else:
            open(os.path.join(d, 'page.html'), 'w').write(root(body))
            files = ['page.html']
        open(os.path.join(d, 'styles.css'), 'w').write(css)
        open(os.path.join(d, 'script.html'), 'w').write(js)
        rows.append((folder, path, files))
    readme(dest, rows)
    return rows


def readme(dest, rows):
    t = ["# Headliner Leadership Styles Test, for Go High Level", "",
         "Four funnel steps. Each folder holds what that step needs.", "", "```"]
    for folder, path, files in rows:
        t.append("%-13s %-48s -> %s" % (folder + '/', '  '.join(files + ['styles.css', 'script.html']), path))
    t += ["```", "",
          "**styles.css and script.html are the same in every folder.** If the funnel has a",
          "funnel wide CSS box and a funnel wide footer code box, paste each once there and",
          "skip them on the steps.", "",
          "## Putting a step in", "",
          "1. Make a blank step, with no builder header or footer. The markup carries its own.",
          "2. Add a custom HTML element that runs full width, edge to edge, with no padding.",
          "3. Paste `page.html` into it.",
          "4. Paste `styles.css` into the step's custom CSS.",
          "5. Paste `script.html` into the step's footer tracking code. It is JavaScript,",
          "   already inside a `<script>` tag, because that box expects markup.", "",
          "## The form step", "",
          "It is cut in two around the form, so the form is the builder's own:", "",
          "1. Custom HTML element with `page-1-above-form.html` (header, hero, the heading).",
          "2. The builder's form element.",
          "3. Custom HTML element with `page-2-below-form.html` (the footer).", "",
          "Set the form to send people to `%s` on submit." % rows[2][1], "",
          "## Step paths", "",
          "Every button already points at these, the live paths. To change one, edit `PAGES`",
          "at the top of `build-ghl-funnel.py` and build again.", ""]
    for folder, path, files in rows:
        t.append("- `%s` is %s" % (path, folder.split('-', 1)[1]))
    t += ["",
          "The result step reads the answers from its link, `?a=` and 28 digits, so leave",
          "query strings on in the funnel settings.", "",
          "## The hero photograph", "",
          "Already linked. It is the Free Sh!t hero, uploaded to your media on 25 September,",
          "so nothing to upload.", ""]
    open(os.path.join(dest, 'README.md'), 'w').write('\n'.join(t))


if __name__ == '__main__':
    dest = sys.argv[1] if len(sys.argv) > 1 else 'ghl-funnel-export'
    rows = main(dest)
    for folder, path, files in rows:
        print(folder, path, files)
    # nothing in the markup may be a script tag or a void tag
    bad = []
    for folder, _, files in rows:
        for f in files:
            s = open(os.path.join(dest, folder, f)).read()
            for tag in ('script', 'link', 'img', 'input', 'br', 'hr', 'meta'):
                if re.search(r'<' + tag + r'\b', s):
                    bad.append('%s/%s: <%s>' % (folder, f, tag))
            if 'img/' in s and 'filesafe' not in s:
                bad.append('%s/%s: unlinked image' % (folder, f))
    if bad:
        print('\nNOT READY:')
        for b in bad:
            print('  ' + b)
        sys.exit(1)
