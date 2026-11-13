#!/usr/bin/env python3
"""Package the new view for the page builder.

Reads newview.html, the picked design, and writes one folder per live page holding
the three files Ryan pastes: page.html, styles.css and script.js. A page that a
native builder element splits (the booking calendar on Book a call) ships its
markup below the element as page-2.html. Images are already the builder's own
hosted URLs, carried on each img's data-ghl, so nothing needs uploading.

    python3 build-ghl-new.py <output dir>

The pages, the live addresses and the hosted URLs are all read out of newview.html
rather than listed here, so they cannot drift. Ryan's page links across domains per
the LIVE map in the view's script: on his page every nav link is absolute, on the
Headliner pages the link to him is, and Headliner's own links stay relative.
"""
import os, re, sys

SRC = os.path.dirname(os.path.abspath(__file__))
VOID = {'area','base','br','col','embed','hr','img','input','link','meta',
        'param','source','track','wbr'}

FONTS = ("@import url('https://fonts.googleapis.com/css2?family=Anton&"
         "family=Archivo+Black&family=Caveat:wght@400..700&"
         "family=Inter:wght@400;500;600&display=swap');\n\n")

OVERRIDES = """

/* ==========================================================================
   PAGE BUILDER OVERRIDES
   Appended by build-ghl-new.py. Only in the pasted build.
   ========================================================================== */

/* The builder drops the block into a centred column with its own width. This pulls
   the wrapper back out to the full viewport, from any centred ancestor: 50% is half
   the column and 50vw is half the window. */
.nv{position:relative;width:100vw;max-width:100vw;
  margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw)}
"""


def template_of(doc):
    i = doc.index('<template id="nv-src">')
    depth = 0
    for m in re.finditer(r'<template\b|</template>', doc[i:]):
        depth += 1 if m.group(0) == '<template' else -1
        if depth == 0:
            return doc[i:i + m.end()]
    raise SystemExit('template never closes')


def cut_block(text, start_pat):
    """(before, block, after) for the element whose open tag matches start_pat."""
    m = re.search(start_pat, text)
    if not m:
        raise SystemExit('no match: ' + start_pat)
    tag = m.group(0)[1:].split()[0].split('>')[0]
    depth = 0
    for t in re.finditer(r'<' + tag + r'\b|</' + tag + r'>', text[m.start():]):
        depth += 1 if not t.group(0).startswith('</') else -1
        if depth == 0:
            end = m.start() + t.end()
            return text[:m.start()], text[m.start():end], text[end:]
    raise SystemExit('unclosed: ' + start_pat)


def open_stack(fragment):
    """The elements still open at the end of the fragment, outermost first."""
    stack = []
    for m in re.finditer(r'<(/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|\'[^\']*\'|[^>"\'])*)>', fragment):
        close, tag, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if close:
            if stack and stack[-1][0] == tag:
                stack.pop()
        elif tag not in VOID and not attrs.rstrip().endswith('/'):
            stack.append((tag, m.group(0)))
    return stack


def main(dest):
    doc = open(os.path.join(SRC, 'newview.html')).read()
    tpl = template_of(doc)
    style = tpl[tpl.index('<style>') + 7:tpl.index('</style>')]
    body = tpl[tpl.index('</style>') + len('</style>'):tpl.index('<script data-nv>')]
    js = tpl[tpl.index('<script data-nv>') + len('<script data-nv>'):tpl.rindex('</script>')]

    # The live addresses, read from the view's own script.
    live = dict(re.findall(r"^\s+(\w+):'(https://[^']+)'", js, re.M))
    pages = re.findall(r'<div class="pg" data-pg="([\w-]+)"', body)
    assert set(pages) == set(live), (pages, sorted(live))
    folder = {k: ('ryan-tayler' if k == 'ryan' else live[k].rstrip('/').rsplit('/', 1)[-1])
              for k in pages}

    # ---------- the stylesheet, once, same file in every folder ----------
    css = style
    swaps = [
        (':host{all:initial;display:block}', '.nv{all:initial;display:block}'),
        ('*,*::before,*::after{box-sizing:border-box}',
         '.nv,.nv *,.nv *::before,.nv *::after{box-sizing:border-box}'),
        ('[hidden]{display:none!important}', '.nv [hidden]{display:none!important}'),
        # The reveal hides the page, so its hiding is gated and must stay gated (see
        # CLAUDE.md): these start-hidden states only apply once script.js has claimed
        # nv-on, so a page whose script never runs reads in full instead of blank.
        ('.fade{opacity:0;translate:0 24px;transition:opacity 1s var(--out),translate 1.2s var(--out)}',
         '.fade{transition:opacity 1s var(--out),translate 1.2s var(--out)}\n'
         ':where(.nv-on) .fade{opacity:0;translate:0 24px}'),
        ('.wi{display:inline-block;translate:0 108%;transition:translate 1.1s var(--out);transition-delay:calc(var(--i,0) * 40ms)}',
         '.wi{display:inline-block;transition:translate 1.1s var(--out);transition-delay:calc(var(--i,0) * 40ms)}\n'
         ':where(.nv-on) .wi{translate:0 108%}'),
        ('.pinkband__me{translate:60% 0;opacity:0;transition:translate 1.3s var(--out),opacity .6s}',
         '.pinkband__me{transition:translate 1.3s var(--out),opacity .6s}\n'
         ':where(.nv-on) .pinkband__me{translate:60% 0;opacity:0}'),
    ]
    for old, new in swaps:
        assert css.count(old) == 1, old[:60]
        css = css.replace(old, new)
    css = FONTS + css + OVERRIDES

    # ---------- the script, once, same file in every folder ----------
    swaps = [
        # claim the reveal the moment the script runs
        ("var nv=root.getElementById('nv'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;",
         "var nv=root.getElementById('nv'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;\n"
         "  if(nv) nv.classList.add('nv-on');"),
        # no shadow root live
        ('function live(){ return nv.isConnected && !nv.getRootNode().host.hidden; }',
         'function live(){ return nv.isConnected; }'),
        # the links are real now, so nothing intercepts them
        ("""    var a=e.target.closest('[data-go]'); if(!a) return;
    e.preventDefault(); closeDrawer(); closeSheet();
    if(current && current.dataset.pg===a.dataset.go){ snapHold=performance.now()+1600; scrollTo({top:0,behavior:reduce?'auto':'smooth'}); return; }
    show(a.dataset.go,true,a.dataset.goto);
""", ''),
        # one page per document: show it, name it, wake it
        ("""  root.host.nvShow=function(name){ show(name||'index',false); };
  requestAnimationFrame(frame);""",
         """  /* One page per document live, so there is no router: the only page is shown,
     named and woken. Markup below a builder element (page-2.html) is a second .nv
     wrapper; it stays out of nv-on, so it reads in full without the animations. */
  current=$('.pg'); if(current){ current.hidden=false;
    nv.classList.toggle('is-ryan', current.dataset.pg==='ryan');
    wake(current); }
  requestAnimationFrame(frame);"""),
    ]
    for old, new in swaps:
        assert js.count(old) == 1, old[:60]
        js = js.replace(old, new)
    assert js.rstrip().endswith('})(this);')
    js = js.rstrip()[:-len('})(this);')] + '})(document);'
    js = ('/* The new view, packaged for the page builder by build-ghl-new.py. */\n' + js.strip() + '\n')

    # ---------- the markup, per page ----------
    pre, curtain, rest = cut_block(body, r'<div class="curtain"')
    chrome = pre + rest  # bar, drawer, main with every pg, foot
    before_main, main, after_main = cut_block(chrome, r'<main\b')

    def links(html, pg):
        def sub(m):
            tag = m.group(0)
            go = re.search(r'data-go="([\w-]+)"', tag).group(1)
            goto = re.search(r'data-goto="([\w-]+)"', tag)
            if pg == 'ryan' or go == 'ryan':
                url = live[go]              # the other domain, a real absolute link
            else:
                url = '/' + live[go].rstrip('/').rsplit('/', 1)[-1]
            if goto:
                url = ('#' + goto.group(1)) if go == pg else (url + '#' + goto.group(1))
            tag = re.sub(r'\s*data-go(to)?="[\w-]+"', '', tag)
            tag = re.sub(r'href="[^"]*"', 'href="' + url + '"', tag, count=1)
            if go == pg and re.match(r'<a\b', tag) and 'class="btn' not in tag and 'hl-link' not in tag and 'rt-mark' not in tag:
                tag = re.sub(r'class="', 'class="is-here ', tag, count=1) if 'class="' in tag \
                    else tag.replace('<a ', '<a class="is-here" ', 1)
            return tag
        return re.sub(r'<a\b[^>]*data-go="[\w-]+"[^>]*>', sub, html)

    def hosted(html):
        return re.sub(r'(<img\b[^>]*data-ghl="([^"]+)"[^>]*?)src="[^"]*"',
                      lambda m: m.group(1) + 'src="' + m.group(2) + '"', html)

    written = []
    for pg in pages:
        _, pgdiv, _ = cut_block(main, r'<div class="pg" data-pg="' + pg + r'"[^>]*>')
        pgdiv = re.sub(r'(<div class="pg" data-pg="' + pg + r'")[^>]*>', r'\1>', pgdiv, count=1)
        page = before_main + '<main>\n' + pgdiv + '\n</main>' + after_main
        page = hosted(links(page, pg))

        # a native builder element splits the page at each slot
        chunks, remainder = [], page
        while '<div class="slot"' in remainder:
            above, slot, below = cut_block(remainder, r'<div class="slot"')
            stack = open_stack(above)
            chunks.append(above + ''.join('</%s>' % t for t, _ in reversed(stack)))
            remainder = ''.join(o for _, o in stack) + below
        chunks.append(remainder)

        d = os.path.join(dest, '1-pages', folder[pg])
        os.makedirs(d, exist_ok=True)
        ryan = ' is-ryan' if pg == 'ryan' else ''
        for i, chunk in enumerate(chunks):
            wrap = ('<!-- The new view, packaged by build-ghl-new.py. One wrapper; the\n'
                    '     stylesheet pins it to the full viewport width. -->\n'
                    '<div class="nv%s"%s>\n%s\n</div>\n'
                    % (ryan, ' id="nv"' if i == 0 else '', chunk.strip('\n')))
            name = 'page.html' if i == 0 else 'page-%d.html' % (i + 1)
            open(os.path.join(d, name), 'w').write(wrap)
        open(os.path.join(d, 'styles.css'), 'w').write(css)
        open(os.path.join(d, 'script.js'), 'w').write(js)
        written.append((pg, folder[pg], len(chunks)))
        print('page', folder[pg], '(%d html file%s)' % (len(chunks), 's' if len(chunks) > 1 else ''))

    readme(dest, written, live)
    print('readme')
    return written


def readme(dest, written, live):
    t = ["# The new view, packaged for the page builder", "",
         "%d pages. Each folder holds what its live page takes: `page.html` in a full" % len(written),
         "width custom code element, `styles.css` in the page's custom CSS, `script.js`",
         "in the page's footer code (wrap it in script tags if the box wants HTML).", "",
         "```"]
    for pg, f, n in written:
        extra = '  + page-2.html' if n > 1 else ''
        t.append("1-pages/%-14s ->  %s%s" % (f + '/', live[pg], extra))
    t += ["```", "",
          "## The split page", "",
          "Book a call (`lets-chat`) is two blocks. `page.html` ends where the speed-run",
          "booking calendar goes: place the builder's own calendar element there, then a",
          "second custom code element holding `page-2.html`. The second block carries no",
          "animations on purpose, so it reads in full wherever the script runs from.", "",
          "## The domains", "",
          "Ryan's page is its own site on ryantayler.com, so every nav link on it is a",
          "real absolute link to headlinergroup.com.au, and every other page links to him",
          "absolutely. The Headliner pages link among themselves with relative slugs. The",
          "addresses live in the LIVE map in `newview.html`; re-run this build if one",
          "changes.", "",
          "## The pictures", "",
          "Already done: every `src` is the builder's own hosted URL, carried on each",
          "img's `data-ghl`. Nothing to upload.", "",
          "## If a page comes out blank below the hero", "",
          "The script is not running. The start-hidden animation states only apply once",
          "`script.js` adds `nv-on`, so with no script the page reads in full; if things",
          "sit frozen mid-animation instead, the script ran and then failed, so check the",
          "console.", ""]
    open(os.path.join(dest, 'README.md'), 'w').write('\n'.join(t))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'ghl-new-export')
