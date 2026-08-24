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
  if (!items.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
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
})();
