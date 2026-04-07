/**
 * FAQ Accordion - Custom JS (replaces Bootstrap collapse)
 */
(function() {
  'use strict';

  document.querySelectorAll('.faq-list .question').forEach(function(question) {
    question.addEventListener('click', function(e) {
      e.preventDefault();

      const answer = this.nextElementSibling;
      const isCollapsed = this.classList.contains('collapsed');

      // Close all others
      document.querySelectorAll('.faq-list .question').forEach(function(q) {
        q.classList.add('collapsed');
        q.nextElementSibling.classList.remove('open');
      });

      // Toggle current
      if (isCollapsed) {
        this.classList.remove('collapsed');
        answer.classList.add('open');
      }
    });
  });
})();
