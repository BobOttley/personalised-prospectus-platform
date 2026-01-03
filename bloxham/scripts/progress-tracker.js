/**
 * Bloxham School Progress Tracker
 * Tracks scroll progress through the prospectus
 */

document.addEventListener('DOMContentLoaded', function() {
  const progressPercent = document.getElementById('progress-percent');
  const progressFill = document.getElementById('progress-fill');

  if (!progressPercent || !progressFill) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    progressPercent.textContent = Math.min(scrollPercent, 100);
    progressFill.style.width = Math.min(scrollPercent, 100) + '%';
  }

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial update
  updateProgress();
});
