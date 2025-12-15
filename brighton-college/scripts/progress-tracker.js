/**
 * Brighton College Progress Tracker
 * Tracks scroll progress and updates the sticky navigation bar
 */

class ProgressTracker {
  constructor() {
    this.progressBar = null;
    this.progressText = null;
    this.sections = [];
    this.lastProgress = 0;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.progressBar = document.querySelector('.progress-fill');
    this.progressText = document.querySelector('.progress-text');

    if (!this.progressBar || !this.progressText) {
      console.warn('Progress tracker elements not found');
      return;
    }

    // Get all sections
    this.sections = Array.from(document.querySelectorAll('.prospectus-section, .prospectus-cover'));

    // Add scroll listener with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial update
    this.updateProgress();
  }

  updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

    // Clamp between 0 and 100
    const progress = Math.min(Math.max(Math.round(scrollPercent), 0), 100);

    // Only update if progress changed
    if (progress !== this.lastProgress) {
      this.lastProgress = progress;

      // Update progress bar
      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }

      // Update text
      if (this.progressText) {
        this.progressText.textContent = `${progress}% read`;
      }

      // Add completion class at 100%
      if (progress === 100) {
        this.onComplete();
      }
    }
  }

  onComplete() {
    // Optional: trigger event or visual feedback when complete
    const nav = document.querySelector('.prospectus-nav');
    if (nav && !nav.classList.contains('complete')) {
      nav.classList.add('complete');

      // Optional: show completion message
      if (this.progressText) {
        this.progressText.innerHTML = '<span style="color: var(--bc-gold);">Complete!</span>';
      }
    }
  }

  /**
   * Get current section in view
   */
  getCurrentSection() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (section.offsetTop <= scrollPos) {
        return section;
      }
    }
    return this.sections[0];
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 60;
      const targetPosition = section.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Get reading time estimate
   */
  getReadingTime() {
    const text = document.body.innerText;
    const wordCount = text.split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  }
}

// Export for use
window.ProgressTracker = ProgressTracker;

// Auto-initialise
document.addEventListener('DOMContentLoaded', () => {
  window.progressTracker = new ProgressTracker();
});
