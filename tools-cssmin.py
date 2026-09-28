#!/usr/bin/env python3
"""Shrink the stylesheet for a paste box with a size limit.

NOT WIRED INTO build-ghl.py. Parked here with what was learned.

WHY: the builder's CSS box truncates. The full sheet is 87KB and it was being cut
off partway through, which reads on screen as the fonts and the colours landing and
the card layout not, because the grid rules sit around 60 percent through the file.

minify() is lossless by construction: comments and whitespace only. It takes the
sheet from 85KB to 47KB.

strip() DOES NOT WORK. It drops rules whose selectors cannot match the page being
shipped, which got Free Sh!t to 23KB, but rendered against the full sheet and
compared pixel for pixel it differs on all five pages at both widths, by tens of
pixels of height. Something it drops is load bearing and it has not been chased
down. Do not use it without redoing that comparison and getting it clean.

Verify either pass by rendering both versions full page and diffing the images.
Never by reading the output. A wrong drop is invisible in the text.
"""
import re


def minify(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s*([{}:;,>])\s*', r'\1', css)
    css = re.sub(r';}', '}', css)
    css = re.sub(r'\s+', ' ', css)
    # a combinator that got eaten back, and the space selectors need
    css = re.sub(r'\s*([+~])\s*', r'\1', css)
    return css.strip()


def split_rules(css):
    """Top level chunks: at-rules with blocks stay whole, everything else is a rule."""
    out, i, n = [], 0, len(css)
    while i < n:
        j, depth = i, 0
        while j < n:
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0:
                    j += 1
                    break
            elif css[j] == ';' and depth == 0:      # @import and friends
                j += 1
                break
            j += 1
        chunk = css[i:j].strip()
        if chunk:
            out.append(chunk)
        i = j
    return out


TOKENS = re.compile(r'[.#]?[A-Za-z_][\w-]*')


def selector_of(chunk):
    b = chunk.find('{')
    return chunk[:b] if b > 0 else ''


def needed(sel, classes, ids, tags):
    """A selector survives if EVERY comma part that could match does. A part matches
    when every class and id it names is on the page. Tags, pseudos and attributes are
    not used to reject, because they are cheap and easy to get wrong."""
    for part in sel.split(','):
        part = part.strip()
        if not part:
            continue
        cls = re.findall(r'\.(-?[A-Za-z_][\w-]*)', part)
        idz = re.findall(r'#(-?[A-Za-z_][\w-]*)', part)
        if all(c in classes for c in cls) and all(i in ids for i in idz):
            return True
    return False


def strip(css, html):
    classes = set(re.findall(r'class="([^"]*)"', html))
    classes = {c for group in classes for c in group.split()}
    ids = set(re.findall(r'id="([^"]+)"', html))
    tags = set(t.lower() for t in re.findall(r'<([A-Za-z][\w-]*)', html))

    kept, used_kf = [], set()
    for chunk in split_rules(css):
        if chunk.startswith('@'):
            head = chunk[:chunk.find('{')] if '{' in chunk else chunk
            if head.startswith('@media') or head.startswith('@supports'):
                inner = chunk[chunk.find('{') + 1:chunk.rfind('}')]
                sub = [c for c in split_rules(inner)
                       if c.startswith('@') or needed(selector_of(c), classes, ids, tags)]
                if sub:
                    kept.append(head + '{' + ''.join(sub) + '}')
                continue
            kept.append(chunk)          # @import, @font-face, @keyframes
            continue
        if needed(selector_of(chunk), classes, ids, tags):
            kept.append(chunk)

    body = ''.join(kept)
    # a keyframes block only earns its place if something left still calls for it
    out = []
    for chunk in kept:
        m = re.match(r'@keyframes\s+([\w-]+)', chunk)
        if m and not re.search(r'animation[^;}]*\b' + re.escape(m.group(1)) + r'\b', body):
            continue
        out.append(chunk)
    return ''.join(out)
