/**
 * Brighton College Prep Kensington - Personalisation Engine
 * Handles all personalisation logic for the prospectus
 */

class BCPKPersonalisationEngine {
  constructor() {
    this.data = this.loadData();
    this.pronouns = this.getPronouns(this.data.child?.gender);
  }

  loadData() {
    const stored = localStorage.getItem('bcpk_prospectus_data');
    if (stored) {
      return JSON.parse(stored);
    }

    // Demo data if nothing stored
    return {
      child: {
        first_name: 'Oliver',
        surname: 'Thompson',
        gender: 'boy',
        date_of_birth: '2020-03-15',
        current_school: ''
      },
      entry: {
        entry_point: 'Reception',
        entry_year: 'September 2025',
        prospectus_type: 'prep'
      },
      academics: {
        favourite_subjects: ['Science', 'Art', 'PE'],
        learning_style: ['Hands-on', 'Outdoor']
      },
      interests: {
        sports: ['Football', 'Swimming'],
        arts: ['Music', 'Art'],
        instrument: 'Piano',
        other: ['Nature', 'Science']
      },
      priorities: ['Secret Garden', 'Culture of Kindness', 'Academic Excellence'],
      parents: {
        parent1: {
          title: 'Mr',
          first_name: 'James',
          surname: 'Thompson',
          email: 'james@example.com',
          phone: '+44 7700 900123',
          relationship: 'Father'
        },
        parent2: {
          title: 'Mrs',
          first_name: 'Sarah',
          surname: 'Thompson',
          email: 'sarah@example.com',
          phone: '+44 7700 900456',
          relationship: 'Mother'
        }
      }
    };
  }

  getPronouns(gender) {
    switch (gender) {
      case 'boy':
      case 'male':
        return { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' };
      case 'girl':
      case 'female':
        return { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' };
      default:
        return { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' };
    }
  }

  getChildName() {
    return this.data.child?.first_name || 'Your child';
  }

  getFamilyName() {
    return this.data.child?.surname || this.data.parents?.parent1?.surname || 'Family';
  }

  getParentSalutation() {
    const p1 = this.data.parents?.parent1;
    const p2 = this.data.parents?.parent2;

    if (p1 && p2) {
      if (p1.surname === p2.surname) {
        return `${p1.title} and ${p2.title} ${p1.surname}`;
      }
      return `${p1.title} ${p1.surname} and ${p2.title} ${p2.surname}`;
    }

    if (p1) {
      return `${p1.title} ${p1.surname}`;
    }

    return 'Dear Parent/Guardian';
  }

  getEntryPointText() {
    const point = this.data.entry?.entry_point;
    const year = this.data.entry?.entry_year;
    if (point && year) {
      return `${point} in ${year}`;
    }
    return point || 'joining us';
  }

  getAge() {
    if (!this.data.child?.date_of_birth) return null;
    const dob = new Date(this.data.child.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  applyPersonalisation() {
    let nameCount = 0;

    // Apply child name
    document.querySelectorAll('[data-field="child_name"]').forEach(el => {
      el.textContent = this.getChildName();
      nameCount++;
    });

    // Apply family name
    document.querySelectorAll('[data-field="family_name"]').forEach(el => {
      el.textContent = this.getFamilyName();
    });

    // Apply parent salutation
    document.querySelectorAll('[data-field="parent_salutation"]').forEach(el => {
      el.textContent = this.getParentSalutation();
    });

    // Apply entry point text
    document.querySelectorAll('[data-field="entry_point_text"]').forEach(el => {
      el.textContent = this.getEntryPointText();
    });

    // Apply pronouns
    document.querySelectorAll('[data-field="pronoun_subject"]').forEach(el => {
      el.textContent = this.pronouns.subject;
    });

    document.querySelectorAll('[data-field="pronoun_object"]').forEach(el => {
      el.textContent = this.pronouns.object;
    });

    document.querySelectorAll('[data-field="pronoun_possessive"]').forEach(el => {
      el.textContent = this.pronouns.possessive;
    });

    document.querySelectorAll('[data-field="pronoun_reflexive"]').forEach(el => {
      el.textContent = this.pronouns.reflexive;
    });

    // Capitalise pronouns at start of sentences
    document.querySelectorAll('[data-field="pronoun_subject_cap"]').forEach(el => {
      el.textContent = this.pronouns.subject.charAt(0).toUpperCase() + this.pronouns.subject.slice(1);
    });

    document.querySelectorAll('[data-field="pronoun_possessive_cap"]').forEach(el => {
      el.textContent = this.pronouns.possessive.charAt(0).toUpperCase() + this.pronouns.possessive.slice(1);
    });

    return nameCount;
  }

  // Check if a specific interest/priority was selected
  hasInterest(category, value) {
    if (!this.data.interests) return false;
    const items = this.data.interests[category];
    return Array.isArray(items) && items.includes(value);
  }

  hasPriority(value) {
    return Array.isArray(this.data.priorities) && this.data.priorities.includes(value);
  }

  // Get all interests as a flat array
  getAllInterests() {
    const interests = [];
    if (this.data.interests) {
      if (Array.isArray(this.data.interests.sports)) {
        interests.push(...this.data.interests.sports);
      }
      if (Array.isArray(this.data.interests.arts)) {
        interests.push(...this.data.interests.arts);
      }
      if (Array.isArray(this.data.interests.other)) {
        interests.push(...this.data.interests.other);
      }
    }
    return interests;
  }
}

// Module Visibility Controller
class BCPKModuleVisibility {
  constructor(engine) {
    this.engine = engine;
    this.applyVisibility();
  }

  applyVisibility() {
    const data = this.engine.data;

    // Show/hide Secret Garden section based on priority
    this.toggleModule('secret-garden', this.engine.hasPriority('Secret Garden'));

    // Show/hide Music section based on interest
    this.toggleModule('music', this.engine.hasInterest('arts', 'Music'));

    // Show/hide Sport section based on any sports interest
    const hasSports = this.engine.data.interests?.sports?.length > 0;
    this.toggleModule('sport', hasSports);

    // Show senior schools section only for older entry points
    const seniorYears = ['Year 5', 'Year 6', 'Year 7', 'Year 8'];
    const showSenior = seniorYears.includes(data.entry?.entry_point);
    this.toggleModule('senior-schools', showSenior);

    // Filter gender-specific content
    this.filterGenderContent(data.child?.gender);
  }

  toggleModule(moduleId, show) {
    const module = document.getElementById(moduleId);
    if (module) {
      module.classList.toggle('module-hidden', !show);
    }
  }

  filterGenderContent(gender) {
    if (!gender) return;

    const isboy = gender === 'boy' || gender === 'male';
    const isgirl = gender === 'girl' || gender === 'female';

    // Hide opposite gender content
    document.querySelectorAll('[data-gender="boys"]').forEach(el => {
      el.style.display = isboy ? '' : 'none';
    });

    document.querySelectorAll('[data-gender="girls"]').forEach(el => {
      el.style.display = isgirl ? '' : 'none';
    });
  }
}

// Progress Tracker
class BCPKProgressTracker {
  constructor() {
    this.sections = document.querySelectorAll('.prospectus-section');
    this.progressFill = document.querySelector('.progress-fill');
    this.progressText = document.querySelector('.progress-text');

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateProgress());
    this.updateProgress();
  }

  updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100));

    if (this.progressFill) {
      this.progressFill.style.width = `${progress}%`;
    }

    if (this.progressText) {
      this.progressText.textContent = `${progress}% read`;
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BCPKPersonalisationEngine, BCPKModuleVisibility, BCPKProgressTracker };
}
