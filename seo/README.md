# SEO pack, per page

Each folder matches a page folder in the code zip. In the builder, per page:

1. Page settings, SEO meta tags. Paste the title, the description and the image URL
   from `meta.txt`. The images are the five brand cards, 1200 by 630, already hosted
   at the URLs given; the PNGs ride along in `og-images/` in case a field wants an
   upload instead of a URL.
2. Page settings, head tracking code. Paste the whole of `head-schema.html`. It is
   one JSON-LD script block: the organisation on Home, the full FAQ on Partner with
   us, Ryan as a person on his page with his real profiles, the two worksheets on
   Resources, and the contact page on Book a call.

Every description is a sentence from the site itself, so the search snippet and the
page say the same thing. The FAQ schema is the Partner with us FAQ verbatim; if that
copy changes on the page, re-run the pack or the two will drift.
