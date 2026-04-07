/**
 * Main app - Preloader, Back to top, Scroll spy, Smooth scroll
 */
(function() {
  'use strict';

  /**
   * Navbar links active state on scroll
   */
  const navbarlinks = document.querySelectorAll('#navbar .scrollto');

  function navbarlinksActive() {
    const position = window.scrollY + 200;
    navbarlinks.forEach(function(navbarlink) {
      if (!navbarlink.hash) return;
      const section = document.querySelector(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  function scrollto(el) {
    const header = document.querySelector('#header');
    let offset = header.offsetHeight;
    if (!header.classList.contains('header-scrolled')) {
      offset -= 16;
    }
    const elementPos = document.querySelector(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  }

  /**
   * Smooth scroll on .scrollto click
   */
  document.querySelectorAll('.scrollto').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (document.querySelector(this.hash)) {
        e.preventDefault();

        const navbar = document.querySelector('#navbar');
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile');
          const navbarToggle = document.querySelector('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
        scrollto(this.hash);
      }
    });
  });

  /**
   * Scroll with offset on page load with hash links
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      preloader.remove();
    });
  }

  /**
   * Back to top button
   */
  const backtotop = document.querySelector('.back-to-top');
  if (backtotop) {
    function toggleBacktotop() {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    }
    window.addEventListener('load', toggleBacktotop);
    document.addEventListener('scroll', toggleBacktotop);
  }
})();
