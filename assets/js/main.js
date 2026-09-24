/* Headliner Group. Small and dependency free on purpose. */
(function () {
  'use strict';

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

  /* 4. Demo form handling.
     Template only. Point the form at your real endpoint and delete this block. */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.formmsg');
      if (msg) msg.classList.add('is-on');
      form.querySelectorAll('input, textarea, select').forEach(function (f) {
        if (f.type !== 'submit') f.value = '';
      });
    });
  });

  /* 5. Download wall: category filters and the detail sheet.
     Free Sh!t only. Both blocks no-op on every other page. */
  var wall = document.getElementById('wall');
  if (wall) {
    var cards = Array.prototype.slice.call(wall.querySelectorAll('.magnet'));
    var empty = document.getElementById('wall-empty');
    var chips = document.querySelectorAll('.chip--f');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.dataset.filter;
        chips.forEach(function (c) {
          var on = c === chip;
          c.setAttribute('aria-pressed', String(on));
          c.classList.toggle('is-on', on);
        });
        var shown = 0;
        cards.forEach(function (card) {
          /* a magnet can sit in more than one group, pipe separated */
          var cats = (card.dataset.cat || '').split('|');
          var on = want === 'all' || cats.indexOf(want) > -1;
          card.hidden = !on;
          if (on) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
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

  /* 7. Hero swap, a test control. Delete with the button and the losing hero. */
  var hero = document.getElementById('ryanHero'),
      swap = document.getElementById('heroSwap');
  if (hero && swap) {
    /* Both pictures cover by height, so the original renders 1.499 times the hero height
       wide and the wide one 2.874 times. The original sits in a box of min(60vw,980px),
       right anchored past its right edge by the same amount the stylesheet uses, which
       puts its left edge at box plus offset minus its own width. The wide one carries a
       sliver of new ground on its left too, so that comes off as well. The hero's height
       is set by its content, so none of this can live in the stylesheet. */
    var place = function () {
      var h = hero.getBoundingClientRect().height;
      /* A hidden hero measures zero, and a zero height makes this sum come out hugely
         positive, which shoves the photograph into the middle and blanks the left of the
         screen. Nothing is better than that, so it waits until it has a real number. */
      if (h < 200) return;
      var vw = document.documentElement.clientWidth,
          box = Math.min(vw * 0.6, 980),
          off = Math.max(0, 470 - Math.min(vw * 0.3, 490)),
          leftA = box + off - (1800 / 1201) * h,
          padB = 0.009 * (2000 / 696) * h;
      hero.style.setProperty('--hero-b-x', (leftA - padB).toFixed(1) + 'px');
    };
    place();
    addEventListener('resize', place, { passive: true });
    addEventListener('load', place);
    /* catches the hero going from hidden to shown, which is what the single file
       preview does when you move between its pages */
    if (window.ResizeObserver) new ResizeObserver(place).observe(hero);
    var set = function (mode) {
      hero.setAttribute('data-hero', mode);
      swap.setAttribute('aria-pressed', mode === 'b' ? 'true' : 'false');
      swap.textContent = mode === 'b' ? 'Back to the original hero' : 'Try the wide hero';
      try { localStorage.setItem('hg-hero', mode); } catch (e) {}
    };
    try { var m = localStorage.getItem('hg-hero'); if (m) set(m); } catch (e) {}
    swap.addEventListener('click', function () {
      set(hero.getAttribute('data-hero') === 'b' ? 'a' : 'b');
    });
  }

})();
