/**
 * Brighton College Module Visibility Controller
 * Shows/hides prospectus modules based on form data
 */

class ModuleVisibility {
  constructor(personalisationEngine) {
    this.engine = personalisationEngine || window.personalisationEngine;
    this.modules = new Map();

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Find all modules with data-module attribute
    document.querySelectorAll('[data-module]').forEach(element => {
      const moduleName = element.dataset.module;
      this.modules.set(moduleName, element);
    });

    // Apply visibility rules
    this.applyVisibility();
  }

  /**
   * Apply visibility rules to all modules
   */
  applyVisibility() {
    if (!this.engine) {
      console.warn('Personalisation engine not available');
      return;
    }

    this.modules.forEach((element, moduleName) => {
      const shouldShow = this.engine.shouldShowModule(moduleName);

      if (shouldShow) {
        element.classList.remove('module-hidden');
        element.setAttribute('aria-hidden', 'false');
      } else {
        element.classList.add('module-hidden');
        element.setAttribute('aria-hidden', 'true');
      }
    });

    // Update module count display if present
    this.updateModuleCount();
  }

  /**
   * Update the count of visible modules
   */
  updateModuleCount() {
    const countElement = document.querySelector('[data-module-count]');
    if (countElement) {
      let visibleCount = 0;
      this.modules.forEach((element) => {
        if (!element.classList.contains('module-hidden')) {
          visibleCount++;
        }
      });
      countElement.textContent = visibleCount;
    }
  }

  /**
   * Manually show a module
   */
  showModule(moduleName) {
    const element = this.modules.get(moduleName);
    if (element) {
      element.classList.remove('module-hidden');
      element.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Manually hide a module
   */
  hideModule(moduleName) {
    const element = this.modules.get(moduleName);
    if (element) {
      element.classList.add('module-hidden');
      element.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Toggle a module's visibility
   */
  toggleModule(moduleName) {
    const element = this.modules.get(moduleName);
    if (element) {
      if (element.classList.contains('module-hidden')) {
        this.showModule(moduleName);
      } else {
        this.hideModule(moduleName);
      }
    }
  }

  /**
   * Get list of visible modules
   */
  getVisibleModules() {
    const visible = [];
    this.modules.forEach((element, name) => {
      if (!element.classList.contains('module-hidden')) {
        visible.push(name);
      }
    });
    return visible;
  }

  /**
   * Refresh visibility (call after data changes)
   */
  refresh() {
    this.engine = window.personalisationEngine;
    this.applyVisibility();
  }
}

// Export for use
window.ModuleVisibility = ModuleVisibility;

// Auto-initialise after personalisation engine
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tick for personalisation engine to initialise
  setTimeout(() => {
    window.moduleVisibility = new ModuleVisibility();
  }, 100);
});
