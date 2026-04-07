/**
 * Header fixed on scroll + Mobile nav toggle
 */
(function() {
  'use strict';

  const header = document.querySelector('#header');
  if (!header) return;

  const nextElement = header.nextElementSibling;
  let headerOffset = header.offsetTop;

  function headerFixed() {
    if ((headerOffset - window.scrollY) <= 0) {
      header.classList.add('fixed-top');
      if (nextElement) nextElement.classList.add('scrolled-offset');
    } else {
      header.classList.remove('fixed-top');
      if (nextElement) nextElement.classList.remove('scrolled-offset');
    }
  }

  window.addEventListener('load', headerFixed);
  document.addEventListener('scroll', headerFixed);

  // Mobile nav toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      document.querySelector('#navbar').classList.toggle('navbar-mobile');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }
})();
