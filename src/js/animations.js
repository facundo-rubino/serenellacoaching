/**
 * Scroll animations - IntersectionObserver (replaces AOS)
 */
(function() {
  'use strict';

  const animatedElements = document.querySelectorAll('[data-animate]');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-animate-delay') || '0', 10);
        setTimeout(function() {
          el.classList.add('animated');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
})();
