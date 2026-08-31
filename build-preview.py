import re, sys, os, base64
scr = sys.argv[1]
PAGES = [('index','Home'),('partnerships','Partnerships'),
         ('ryan','Ryan Tayler'),('free','Free Sh!t'),('contact','Contact')]
css = open('assets/css/styles.css').read()
fonts = open('assets/fonts/fonts.css').read()
fonts = re.sub(r'url\(\./([^)]+\.woff2)\)',
    lambda m: "url(data:font/woff2;base64,"+base64.b64encode(open('assets/fonts/'+m.group(1),'rb').read()).decode()+")",
    fonts)
bodies=[]
for slug,_ in PAGES:
    raw = open(f'{slug}.html').read()
    inner = re.search(r'<main id="main">(.*?)</main>', raw, re.S).group(1)
    # free.html parks its dialog and its <template> blocks after </main>, so the
    # page div has to carry those across too or the cards open onto nothing
    tail = re.search(r'</main>(.*?)<footer', raw, re.S).group(1).strip()
    bodies.append(f'<div class="pg" data-pg="{slug}"{"" if slug=="index" else " hidden"}>{inner}{tail}</div>')
# single file preview: inline the hero photo so it travels with the page
def _b64(f):
    mime = 'png' if f.endswith('.png') else 'jpeg'
    return f'data:image/{mime};base64,' + base64.b64encode(open(f,'rb').read()).decode()
# strip the srcsets first, then swap the fallback src, or the small file rides along too
# every srcset has to go, or the small variant rides along as a second copy and the
# browser may pick a path that no longer resolves inside a single file
_srcsets = [r'srcset="[^"]*"', r'sizes="[^"]*"']
# discovered, not listed. A hardcoded list means every new photograph renders as a
# broken path in the preview until somebody remembers to edit this file, and nobody does.
# discovered, not listed. A hardcoded list means every new photograph renders as a
# broken path in the preview until somebody remembers to edit this file, and nobody does.
# Commented out slots are skipped, since they name files that do not exist yet.
_found = re.findall(r'assets/img/[\w.-]+\.(?:jpg|png)',
                    re.sub(r'<!--.*?-->', '', ''.join(bodies), flags=re.S))
_imgs = {m: _b64(m) for m in sorted(set(_found)) if os.path.exists(m)}
def _inline(x):
    for pat in _srcsets:
        x = re.sub(pat, '', x)
    for src, data in _imgs.items():
        x = x.replace(src, data)
    return x
bodies = [_inline(x) for x in bodies]
# Home is in the real nav, so the preview has to carry it too, or the two disagree
nav = "\n      ".join(f'<a href="#{s}" data-pg="{s}">{l}</a>' for s,l in PAGES if s != 'contact')
fl = lambda items: "\n          ".join(f'<li><a href="#{s}" data-pg="{s}">{l}</a></li>' for s,l in items)
# lift the wall and dialog logic straight out of main.js rather than keeping a
# second copy of it in the preview template
_js = open('assets/js/main.js').read()
wall = _js[_js.index('  /* 5. Download wall'):_js.rindex('})();')].rstrip()

tpl = open(os.path.join(scr,'preview-template.html')).read()
html = (tpl.replace('/*__FONTS__*/', fonts).replace('/*__CSS__*/', css)
           .replace('/*__WALL__*/', wall)
           .replace('<!--__NAV__-->', nav).replace('<!--__BODIES__-->', "\n".join(bodies))
           .replace('<!--__FGROUP__-->', fl([('partnerships','Partnerships'),('ryan','Ryan Tayler')]))
           .replace('<!--__FMORE__-->', fl([('free','Free Sh!t'),('contact','Contact')])))
out = os.path.join(scr,'headliner-preview.html')
open(out,'w').write(html)
print('built', round(len(html)/1024), 'KB')
