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

  /* 3. Reveal on scroll */
  var items = document.querySelectorAll('.rv');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!items.length) {
    /* nothing to reveal, but the blocks below still have to run */
  } else if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

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
          var on = want === 'all' || card.dataset.cat === want;
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
})();
