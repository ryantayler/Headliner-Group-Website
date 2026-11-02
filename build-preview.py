import re, sys, os, base64
scr = sys.argv[1]
PAGES = [('index','Home'),('partnerships','Partnerships'),
         ('ryan','Ryan Tayler'),('free','Free Sh!t'),('contact','Contact'),
         ('optimisation-engine','The optimisation engine'),
         ('four-pillars','The 4 pillars of partnership'),
         ('four-pillars-form','The 4 pillars form'),
         ('optimisation-engine-form','The optimisation engine form')]
# in the preview but not in its nav, same as the site. The preview footer links them.
HIDDEN = {'optimisation-engine', 'four-pillars', 'four-pillars-form', 'optimisation-engine-form'}
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
# The artifact host's content policy admits nothing from another site, so every frame in
# the published preview renders as an empty box. Each frame on the real pages has a card
# underneath it for exactly that case, so the artifact build drops the frames and the
# card is what shows. The second file keeps them, for opening off disk in a browser,
# which is the only way to see an embed before the site is hosted. General rule over any
# iframe, not a list of URLs.
_framed = list(bodies)
bodies = [re.sub(r'<iframe\b[^>]*>.*?</iframe>', '', x, flags=re.S) for x in bodies]
# Home is in the real nav, so the preview has to carry it too, or the two disagree
nav = "\n      ".join(f'<a href="#{s}" data-pg="{s}">{l}</a>' for s,l in PAGES if s != 'contact' and s not in HIDDEN)

# The footer is lifted out of index.html rather than kept as a second copy in the
# template. It was a second copy for a while and it silently went stale, so an edit to
# the real footer did not show up in the preview at all.
_raw_home = open('index.html').read()
footer = re.search(r'<footer class="ftr">.*?</footer>', _raw_home, re.S).group(0)
def _toroute(m):
    slug = m.group(1) or 'index'
    return f'href="#{slug}" data-pg="{slug}"'
footer = re.sub(r'href="(?:(\w+)\.html|(index)\.html)"',
                lambda m: _toroute(m), footer)
footer = footer.replace('href="index.html"', 'href="#index" data-pg="index"')
footer = footer.replace('id="f-nl-home"', 'id="f-nl"').replace('for="f-nl-home"', 'for="f-nl"')
# The artifact runs in a frame, so a #page on its address never reaches the page and a
# hidden page has no way in. The preview footer carries one, the real site does not.
_hid = " ".join(f'<a href="#{s}" data-pg="{s}">{l}</a>' for s,l in PAGES if s in HIDDEN)
if _hid:
    footer = footer.replace('All rights reserved.</span>',
        'All rights reserved.</span>\n      <span class="row pv-only">Preview only, hidden pages: ' + _hid + '</span>', 1)
# lift the wall and dialog logic straight out of main.js rather than keeping a
# second copy of it in the preview template
_js = open('assets/js/main.js').read()
wall = _js[_js.index('  /* 5. Download wall'):_js.rindex('})();')].rstrip()

# The new view: a redesign that exists only in this preview, behind the toggle in the
# top right. Its markup, style and script are one file, mounted by the shell inside a
# shadow root so the site's stylesheet and it never touch. Images, the signature and
# the platform icons are lifted from the real pages rather than copied in.
_nv = open('tools-preview/next.html').read()
_ryan = open('ryan.html').read()
_sig = re.search(r'<svg class="sig sig--hero".*?</svg>', _ryan, re.S).group(0)
_nv = _nv.replace('<!--__SIG__-->', re.sub(r' class="[^"]*"', '', _sig, count=1))
for _k in ('li', 'ig', 'yt', 'fb'):
    _ic = re.search(r'btn--' + _k + r'"[^>]*>(<svg.*?</svg>)', _ryan, re.S).group(1)
    _nv = _nv.replace('<!--__ICON:' + _k + '-->', _ic)
for _m in sorted(set(re.findall(r'assets/img/[\w.-]+\.(?:jpg|png)', _nv))):
    _nv = _nv.replace(_m, _b64(_m))
_left = re.findall(r'<!--__\w+(?::\w+)?__?-->', _nv)
if _left:
    sys.exit('new view placeholders not filled: ' + ', '.join(sorted(set(_left))))

# The new view's own serif. A face declared inside a shadow root is ignored, so it is
# declared here in the page, and only the new view uses it. Preview only.
_nvfonts = ''.join(
    "@font-face{font-family:'Instrument Serif';font-style:%s;font-weight:400;font-display:swap;"
    "src:url(data:font/woff2;base64,%s) format('woff2')}\n"
    % (st, base64.b64encode(open('tools-preview/fonts/' + f, 'rb').read()).decode())
    for f, st in (('instrument-serif-latin.woff2', 'normal'), ('instrument-serif-italic-latin.woff2', 'italic'))
    if os.path.exists('tools-preview/fonts/' + f))

# the template lives in the repo. It lived in a session scratchpad once and was lost
# with the session, and had to be rebuilt from the published artifact.
tpl = open('tools-preview/template.html').read()
def _render(bs):
    return (tpl.replace('/*__FONTS__*/', fonts).replace('/*__CSS__*/', css)
               .replace('/*__WALL__*/', wall)
               .replace('<!--__NAV__-->', nav).replace('<!--__BODIES__-->', "\n".join(bs))
               .replace('<!--__FOOTER__-->', footer)
               .replace('<!--__NEXT__-->', _nv)
               .replace('/*__NVFONTS__*/', _nvfonts))

for name, bs in (('headliner-preview.html', bodies), ('headliner-preview-frames.html', _framed)):
    doc = _render(bs)
    open(os.path.join(scr,name),'w').write(doc)
    print('built', name, round(len(doc)/1024), 'KB')
