/* Headliner Group. Small and dependency free on purpose. */
(function () {
  'use strict';

  /* Claim the reveal first. The stylesheet only hides .rv when this class is set, so
     nothing can leave the page hidden if this file fails to load or to run. Every page
     also sets it in its head, which is what keeps the content from flashing. */
  document.documentElement.classList.add('rv-on');

  var hdr = document.querySelector('.hdr');
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');

  /* 1. Header state.
     Pages that open on a dark hero keep the header transparent until scroll.
     Pages that open on paper get the light header straight away. */
  var lightStart = document.body.hasAttribute('data-light-header');

  function onScroll() {
    if (!hdr) return;
    var past = window.scrollY > 24;
    hdr.classList.toggle('is-stuck', past && !lightStart);
    hdr.classList.toggle('is-light', past && lightStart);
  }
  if (lightStart && hdr) hdr.classList.add('is-light');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. Mobile nav */
  if (burger && nav && hdr) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      hdr.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) burger.click();
    });
  }

  /* 3. Reveal on scroll. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealIO = null;

  function runReveal() {
    if (revealIO) { revealIO.disconnect(); revealIO = null; }
    var items = document.querySelectorAll('.rv');
    if (!items.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { revealIO.observe(el); });
  }

  runReveal();

  /* 4a. The footer's email box, live. Each sign up goes to Ryan's Go High Level inbound
     webhook, which a workflow turns into a contact tagged for the newsletter. Sent as a
     plain form post with no-cors, because a cross site JSON post asks the server's
     permission first and a webhook is not guaranteed to answer, so the reply cannot be
     read. The message shows once the browser has sent it. The address lives here only. */
  var NEWSLETTER_HOOK = 'https://services.leadconnectorhq.com/hooks/o4ouZJKFsMqn4NIUgEY6/webhook-trigger/7c9c1368-3e74-4f9a-ab60-63ff91baff5d';
  /* .ftr .inline-form too, so the footer already live, still marked data-demo, picks
     this up from the new script alone */
  var hooked = document.querySelectorAll('form[data-newsletter], .ftr form.inline-form');
  hooked.forEach(function (form) {
    form.setAttribute('data-newsletter', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (!email || !email.value) return;
      var body = new URLSearchParams({
        email: email.value.trim(),
        source: 'Website footer',
        page: location.pathname
      });
      var done = function () {
        var msg = form.querySelector('.formmsg');
        /* set here too, so a footer pasted before the wording changed says the same */
        if (msg) { msg.textContent = 'You\u2019re in'; msg.classList.add('is-on'); }
        email.value = '';
        /* the field gives up room to the message, so its hint would be cut off */
        email.placeholder = '';
      };
      fetch(NEWSLETTER_HOOK, { method: 'POST', mode: 'no-cors', body: body, keepalive: true })
        .then(done, done);
    });
  });

  /* 4. Demo form handling.
     Template only. Point the form at your real endpoint and delete this block. */
  document.querySelectorAll('form[data-demo]:not([data-newsletter])').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.formmsg');
      if (msg) msg.classList.add('is-on');
      form.querySelectorAll('input, textarea, select').forEach(function (f) {
        if (f.type !== 'submit') f.value = '';
      });
    });
  });

  /* 5. Download wall: the detail sheet. Free Sh!t only, a no op on every other page.
     The filters are gone, four cards do not need them. */

  /* The cards keep a fixed shape on desktop, so a line that runs long is cut at the last
     line that fits, with an ellipsis. How many fit depends on the width and on whether
     the title wraps, so it is counted here, and again on resize. Below the fixed shape
     nothing is cut. */
  var wallLines = document.querySelectorAll('#wall .magnet p:not(.card__n)');
  function fitWallLines() {
    wallLines.forEach(function (p) {
      p.style.webkitLineClamp = '';
      p.style.maxHeight = '';
      var card = p.closest('.magnet');
      if (getComputedStyle(card).aspectRatio === 'auto') return;
      var lh = parseFloat(getComputedStyle(p).lineHeight) || 22;
      var n = Math.max(1, Math.floor((p.clientHeight + 1) / lh));
      /* the clamp puts the ellipsis on line n, the height stops line n+1 showing under it */
      if (p.scrollHeight > p.clientHeight + 1) {
        p.style.webkitLineClamp = String(n);
        p.style.maxHeight = (n * lh) + 'px';
      }
    });
  }
  if (wallLines.length) {
    fitWallLines();
    addEventListener('resize', fitWallLines);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWallLines);
  }
  var sheet = document.getElementById('sheet');
  if (sheet) {
    var sMedia = document.getElementById('sheet-media');
    var sBody = document.getElementById('sheet-body');
    var panel = sheet.querySelector('.sheet__panel');
    var opener = null;
    var current = null;   /* the detail id on screen, so the form can go back to it */

    function focusables() {
      return panel.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
    }

    function openSheet(id, from) {
      var tpl = document.querySelector('template[data-detail="' + id + '"]');
      var card = document.querySelector('.magnet[data-id="' + id + '"]');
      if (!tpl) return;
      if (from) opener = from;
      current = id;
      sMedia.innerHTML = '';
      sBody.innerHTML = '';
      /* the card already holds the artwork, so it gets cloned rather than
         written twice in the markup */
      if (card && card.querySelector('.media')) {
        sMedia.appendChild(card.querySelector('.media').cloneNode(true));
      }
      sBody.appendChild(tpl.content.cloneNode(true));
      sheet.hidden = false;
      document.body.classList.add('sheet-open');
      panel.scrollTop = 0;
      var first = focusables()[0];
      if (first) first.focus();
    }

    function closeSheet(restore) {
      if (sheet.hidden) return;
      sheet.hidden = true;
      document.body.classList.remove('sheet-open');
      sMedia.innerHTML = '';
      sBody.innerHTML = '';
      if (restore !== false && opener) opener.focus();
      opener = null;
      current = null;
    }

    /* Every file is free and every file goes through the same short form. The
       download button swaps the sheet body for it rather than sending anyone to a
       separate page, so the card they were reading is one button away. */
    function openGetForm(btn) {
      var tpl = document.getElementById('tpl-getfile');
      if (!tpl) return;
      var back = current;
      var file = btn.dataset.getfile;
      var fmt = btn.dataset.fmt || 'file';
      sBody.innerHTML = '';
      sBody.appendChild(tpl.content.cloneNode(true));
      var form = sBody.querySelector('[data-getform]');
      var link = sBody.querySelector('[data-getlink]');
      var sub = sBody.querySelector('[data-getsubmit]');
      if (link) { link.href = file; link.setAttribute('download', ''); }
      if (sub) sub.textContent = 'Send it and download the ' + fmt;
      sBody.querySelector('[data-getback]').addEventListener('click', function () {
        openSheet(back, null);
      });
      form.addEventListener('submit', function (e) {
        /* PLACEHOLDER. No endpoint yet, so it only releases the file and shows the
           note. Post to the real database first, then start the download. */
        e.preventDefault();
        var msg = form.querySelector('.formmsg');
        if (msg) msg.classList.add('is-on');
        /* the download attribute is same origin only, and a file:// page is its own
           opaque origin, so the click would navigate instead of downloading. Off a
           server it behaves; opened straight off disk the visible link does the job. */
        if (location.protocol === 'http:' || location.protocol === 'https:') {
          var a = document.createElement('a');
          a.href = file;
          a.setAttribute('download', '');
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      });
      panel.scrollTop = 0;
      var first = focusables()[0];
      if (first) first.focus();
    }

    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) { e.preventDefault(); openSheet(open.dataset.open, open); return; }
      /* anywhere on a card opens it, not only the title */
      var card = e.target.closest('.magnet[data-id]');
      if (card) { openSheet(card.dataset.id, card.querySelector('[data-open]')); return; }
      var get = e.target.closest('[data-getfile]');
      if (get) { e.preventDefault(); openGetForm(get); return; }
      var close = e.target.closest('[data-sheet-close]');
      /* a close control that is a real link goes somewhere, so pulling focus back to
         the card it came from would undo the jump */
      if (close) closeSheet(!close.hasAttribute('href'));
    });

    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { closeSheet(); return; }
      if (e.key !== 'Tab') return;
      /* trap: the dialog covers the page, so tabbing out of it goes nowhere useful */
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* 6b. LinkedIn embeds, if they ever tell us how tall they are.
     A cross origin frame cannot be measured from out here, so the height on each post
     is set by hand. Some embeds do post their height to the parent though, and if
     LinkedIn ever starts, this takes it. It does nothing until then. */
  addEventListener('message', function (e) {
    if (!/(^|\.)linkedin\.com$/.test(new URL(e.origin).hostname)) return;
    var h = e.data && (e.data.height || e.data.offsetHeight ||
            (typeof e.data === 'string' && /^\d+$/.test(e.data) && +e.data));
    if (!h || h < 200 || h > 4000) return;
    var frames = document.querySelectorAll('.feed__post iframe');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) {
        frames[i].parentElement.style.setProperty('--feed-h', Math.round(h) + 'px');
        return;
      }
    }
  });

  /* 7. Places the wide hero. Both pictures cover by height, so the original renders
     1.499 times the hero height wide and the wide one 2.874 times. The original sits in
     a box of min(60vw,980px), right anchored past its right edge by the same amount the
     stylesheet uses, which puts its left edge at box plus offset minus its own width.
     The wide one carries a sliver of new ground on its left too, so that comes off as
     well. The hero's height is set by its content, so none of this can live in CSS. */
  var hero = document.getElementById('ryanHero');
  if (hero) {
    var place = function () {
      var h = hero.getBoundingClientRect().height;
      /* A hidden hero measures zero, and a zero height makes this sum come out hugely
         positive, which shoves the photograph into the middle and blanks the left of the
         screen. Nothing is better than that, so it waits for a real number. */
      if (h < 200) return;
      var vw = document.documentElement.clientWidth,
          box = Math.min(vw * 0.6, 980),
          off = Math.max(0, 470 - Math.min(vw * 0.3, 490)),
          leftA = box + off - (1800 / 1201) * h,
          padB = 0.009 * (2000 / 696) * h,
          /* As the window narrows the copy comes in over him, so the crop eats a little
             further into the back of his head and brings his face forward of the wash. */
          bite = Math.max(0, (1440 - vw) * 0.12);
      hero.style.setProperty('--hero-b-x', (leftA - padB - bite).toFixed(1) + 'px');
    };
    place();
    addEventListener('resize', place, { passive: true });
    addEventListener('load', place);
    /* catches the hero going from hidden to shown, which is what the single file
       preview does when you move between its pages */
    if (window.ResizeObserver) new ResizeObserver(place).observe(hero);
  }


})();
