/**
 * Brighton College Personalisation Engine
 * Handles name replacement, pronoun adaptation, and data binding
 */

class PersonalisationEngine {
  constructor(formData = null) {
    this.data = formData || this.loadFromStorage();
    this.pronouns = this.getPronouns();
    this.nameCount = 0;
  }

  /**
   * Load form data from localStorage
   */
  loadFromStorage() {
    const stored = localStorage.getItem('bc_prospectus_data');
    if (stored) {
      return JSON.parse(stored);
    }
    // Return demo data if nothing stored
    return this.getDemoData();
  }

  /**
   * Save form data to localStorage
   */
  saveToStorage(data) {
    this.data = data;
    localStorage.setItem('bc_prospectus_data', JSON.stringify(data));
  }

  /**
   * Get demo data for College Entry
   */
  getDemoData() {
    return {
      child: {
        first_name: "Oliver",
        surname: "Thompson",
        gender: "boy",
        date_of_birth: "2013-05-15",
        current_school: "St Mary's Prep",
        current_year: "Year 6"
      },
      entry: {
        entry_point: "Year 7",
        entry_year: "September 2025",
        prospectus_type: "college"
      },
      boarding: {
        interest: "weekly_boarding",
        house_info: true
      },
      academics: {
        favourite_subjects: ["Mathematics", "Sciences", "Sport"],
        strengths: ["Problem solving", "Science experiments"]
      },
      interests: {
        sports: ["Rugby", "Cricket", "Swimming"],
        performing_arts: ["Music (instrument)"],
        instrument: "Piano",
        creative_arts: [],
        other: "Chess"
      },
      scholarships: {
        types: ["Academic", "Music", "Sport"],
        bursary_interest: false
      },
      parents: {
        parent1: {
          title: "Mr",
          first_name: "James",
          surname: "Thompson",
          email: "james.thompson@email.com",
          phone: "+44 7700 900123",
          relationship: "Father"
        },
        parent2: {
          title: "Mrs",
          first_name: "Sarah",
          surname: "Thompson",
          email: "sarah.thompson@email.com",
          phone: "+44 7700 900456",
          relationship: "Mother"
        }
      },
      location: {
        country: "United Kingdom",
        postcode: "SW1A 1AA"
      }
    };
  }

  /**
   * Get Sixth Form demo data
   */
  getSixthFormDemoData() {
    return {
      child: {
        first_name: "Sophia",
        surname: "Hamilton",
        gender: "girl",
        date_of_birth: "2009-03-20",
        current_school: "St Catherine's",
        current_year: "Year 11",
        predicted_gcses: "9 x Grade 9, 2 x Grade 8"
      },
      entry: {
        entry_point: "Sixth Form",
        entry_year: "September 2025",
        prospectus_type: "sixth_form"
      },
      boarding: {
        interest: "full_boarding"
      },
      career: {
        interest: "Medicine",
        specific: "Surgeon"
      },
      subjects: {
        interests: ["Biology", "Chemistry", "Mathematics", "Psychology"],
        strongest: "Biology"
      },
      university: {
        aspirations: ["Oxbridge", "Russell Group (UK)"],
        specific: "Cambridge, Imperial"
      },
      interests: {
        sports: ["Hockey", "Tennis"],
        performing_arts: ["Music"],
        instrument: "Violin",
        leadership: ["House Captain", "Prefect"],
        other: "Debating"
      },
      scholarships: {
        types: ["Academic", "Music"],
        bursary_interest: false
      },
      parents: {
        parent1: {
          title: "Dr",
          first_name: "Michael",
          surname: "Hamilton",
          email: "m.hamilton@email.com",
          phone: "+44 7700 900789"
        },
        parent2: {
          title: "Mrs",
          first_name: "Elizabeth",
          surname: "Hamilton",
          email: "e.hamilton@email.com",
          phone: "+44 7700 900012"
        }
      },
      location: {
        country: "United Kingdom",
        postcode: "KT1 2EE"
      }
    };
  }

  /**
   * Get pronouns based on gender
   */
  getPronouns() {
    const gender = this.data?.child?.gender?.toLowerCase();

    if (gender === "boy" || gender === "male") {
      return {
        subject: "he",
        object: "him",
        possessive: "his",
        possessivePronoun: "his",
        reflexive: "himself",
        child: "son",
        childCapital: "Son",
        subjectCapital: "He",
        objectCapital: "Him",
        possessiveCapital: "His"
      };
    } else if (gender === "girl" || gender === "female") {
      return {
        subject: "she",
        object: "her",
        possessive: "her",
        possessivePronoun: "hers",
        reflexive: "herself",
        child: "daughter",
        childCapital: "Daughter",
        subjectCapital: "She",
        objectCapital: "Her",
        possessiveCapital: "Her"
      };
    } else {
      return {
        subject: "they",
        object: "them",
        possessive: "their",
        possessivePronoun: "theirs",
        reflexive: "themselves",
        child: "child",
        childCapital: "Child",
        subjectCapital: "They",
        objectCapital: "Them",
        possessiveCapital: "Their"
      };
    }
  }

  /**
   * Get computed fields
   */
  getComputedFields() {
    const data = this.data;
    const parents = data.parents;

    // Build parent salutation
    let parentSalutation = "";
    if (parents.parent1 && parents.parent2) {
      if (parents.parent1.surname === parents.parent2.surname) {
        parentSalutation = `${parents.parent1.title} and ${parents.parent2.title} ${parents.parent1.surname}`;
      } else {
        parentSalutation = `${parents.parent1.title} ${parents.parent1.surname} and ${parents.parent2.title} ${parents.parent2.surname}`;
      }
    } else if (parents.parent1) {
      parentSalutation = `${parents.parent1.title} ${parents.parent1.surname}`;
    }

    return {
      child_name: data.child.first_name,
      child_full_name: `${data.child.first_name} ${data.child.surname}`,
      family_name: data.child.surname,
      parent_salutation: parentSalutation,
      entry_point_text: data.entry.entry_point,
      entry_year: data.entry.entry_year,
      boarding_type: this.formatBoardingType(data.boarding.interest),
      ...this.pronouns
    };
  }

  /**
   * Format boarding type for display
   */
  formatBoardingType(type) {
    const types = {
      'day_pupil': 'Day Pupil',
      'day': 'Day Pupil',
      'weekly_boarding': 'Weekly Boarding',
      'weekly': 'Weekly Boarding',
      'full_boarding': 'Full Boarding',
      'full': 'Full Boarding',
      'undecided': 'Undecided'
    };
    return types[type] || type;
  }

  /**
   * Apply personalisation to the document
   */
  applyPersonalisation() {
    const fields = this.getComputedFields();
    this.nameCount = 0;

    // Replace all data-field elements
    document.querySelectorAll('[data-field]').forEach(element => {
      const fieldName = element.dataset.field;

      // Check if it's a pronoun field
      if (fieldName.startsWith('pronoun_')) {
        const pronounType = fieldName.replace('pronoun_', '');
        if (this.pronouns[pronounType]) {
          element.textContent = this.pronouns[pronounType];
        }
      }
      // Check if it's a standard field
      else if (fields[fieldName] !== undefined) {
        element.textContent = fields[fieldName];

        // Count name instances
        if (fieldName === 'child_name') {
          this.nameCount++;
        }
      }
    });

    // Update family name in nav
    const navFamily = document.querySelector('.prospectus-nav__family strong');
    if (navFamily) {
      navFamily.textContent = fields.family_name;
    }

    // Log name count for verification
    console.log(`Child's name used ${this.nameCount} times in the prospectus`);

    return this.nameCount;
  }

  /**
   * Get interests for display
   */
  getInterestsList() {
    const interests = this.data.interests || {};
    const allInterests = [];

    if (interests.sports) {
      allInterests.push(...interests.sports);
    }
    if (interests.performing_arts) {
      allInterests.push(...interests.performing_arts);
    }
    if (interests.creative_arts) {
      allInterests.push(...interests.creative_arts);
    }
    if (interests.instrument) {
      allInterests.push(`${interests.instrument} (Music)`);
    }
    if (interests.other) {
      allInterests.push(interests.other);
    }

    return allInterests;
  }

  /**
   * Generate interest tags HTML
   */
  generateInterestTags() {
    const interests = this.getInterestsList();
    return interests.map(interest =>
      `<span class="interest-tag">${interest}</span>`
    ).join('');
  }

  /**
   * Check if module should be visible
   */
  shouldShowModule(moduleName) {
    const data = this.data;
    const interests = data.interests || {};
    const scholarships = data.scholarships || {};
    const boarding = data.boarding || {};

    switch (moduleName) {
      case 'boarding':
        return boarding.interest !== 'day_pupil' && boarding.interest !== 'day';

      case 'day':
        return boarding.interest === 'day_pupil' || boarding.interest === 'day';

      case 'music':
        return interests.performing_arts?.includes('Music (instrument)') ||
               interests.performing_arts?.includes('Music') ||
               interests.instrument;

      case 'drama':
        return interests.performing_arts?.includes('Drama/Theatre') ||
               interests.performing_arts?.includes('Drama');

      case 'dance':
        return interests.performing_arts?.includes('Dance');

      case 'art':
        return interests.creative_arts?.length > 0;

      case 'scholarships':
        return scholarships.types?.length > 0;

      case 'bursaries':
        return scholarships.bursary_interest === true;

      case 'lower_school':
        return data.entry?.entry_point === 'Year 7';

      case 'middle_school':
        return data.entry?.entry_point === 'Year 7' ||
               data.entry?.entry_point === 'Year 9';

      case 'career_pathway':
        return data.entry?.prospectus_type === 'sixth_form' ||
               data.entry?.entry_point === 'Sixth Form';

      default:
        return true;
    }
  }

  /**
   * Get career pathway data for Sixth Form
   */
  getCareerPathway() {
    if (!this.data.career) return null;

    const pathways = {
      'Medicine': {
        essential: ['Biology', 'Chemistry'],
        recommended: ['Mathematics', 'Psychology'],
        activities: ['Medical Society', 'Hospital Volunteering', 'EPQ'],
        universities: ['Cambridge', 'Oxford', 'Imperial', 'UCL', 'Edinburgh'],
        bcAdvantage: 'Head of Medical Applications, 22 medical school places in 2024'
      },
      'Law': {
        essential: [],
        recommended: ['English Literature', 'History', 'Politics', 'Philosophy'],
        activities: ['Debating', 'Model UN', 'Law Society', 'Mooting'],
        universities: ['Oxford', 'Cambridge', 'LSE', 'UCL', 'Durham'],
        bcAdvantage: '43 Oxbridge offers, exceptional humanities teaching'
      },
      'Engineering': {
        essential: ['Mathematics', 'Physics'],
        recommended: ['Further Mathematics', 'Chemistry', 'Design & Technology'],
        activities: ['Robotics Club', 'Engineering Society', 'STEM Olympiads'],
        universities: ['Cambridge', 'Imperial', 'Oxford', 'Bristol', 'Manchester'],
        bcAdvantage: 'Head of Engineering Applications, Top School for STEM 2024'
      },
      'Business & Finance': {
        essential: ['Mathematics'],
        recommended: ['Economics', 'Further Mathematics', 'Politics'],
        activities: ['Enterprise Society', 'Economics Club', 'Investment Challenge'],
        universities: ['LSE', 'Warwick', 'Cambridge', 'Oxford', 'Imperial'],
        bcAdvantage: 'Global outlook, 13 schools worldwide, strong networking'
      },
      'Sciences & Research': {
        essential: ['Mathematics', 'Relevant Science'],
        recommended: ['Further Mathematics', 'EPQ'],
        activities: ['Science Society', 'Research Projects', 'Olympiads'],
        universities: ['Cambridge', 'Oxford', 'Imperial', 'UCL', 'Edinburgh'],
        bcAdvantage: 'School of Science and Sport, Top STEM School'
      },
      'Creative Arts': {
        essential: ['Art', 'Design & Technology'],
        recommended: ['English Literature', 'Art History'],
        activities: ['Art exhibitions', 'Portfolio development', 'Gallery visits'],
        universities: ['UAL', 'Goldsmiths', 'Royal College of Art', 'Slade'],
        bcAdvantage: 'Richard Cairns Building, dedicated art studios'
      },
      'Performing Arts': {
        essential: ['Drama & Theatre', 'Music', 'Dance'],
        recommended: ['English Literature'],
        activities: ['15 productions annually', 'Edinburgh Fringe', 'LAMDA'],
        universities: ['RADA', 'Mountview', 'Royal Academy of Music', 'Bristol Old Vic'],
        bcAdvantage: '400-seat professional theatre, Brighton Fringe participation'
      },
      'Humanities & Social Sciences': {
        essential: [],
        recommended: ['History', 'Politics', 'Economics', 'Philosophy', 'Geography'],
        activities: ['Debating', 'Model UN', 'History Society'],
        universities: ['Oxford', 'Cambridge', 'LSE', 'Durham', 'UCL'],
        bcAdvantage: 'Strong humanities tradition, 43 Oxbridge offers'
      },
      'Technology & Computing': {
        essential: ['Mathematics', 'Computer Science'],
        recommended: ['Further Mathematics', 'Physics'],
        activities: ['Coding clubs', 'Hackathons', 'Robotics'],
        universities: ['Cambridge', 'Imperial', 'Oxford', 'UCL', 'Edinburgh'],
        bcAdvantage: 'Top STEM School, excellent tech facilities'
      },
      'Architecture': {
        essential: ['Mathematics', 'Art'],
        recommended: ['Physics', 'Design & Technology'],
        activities: ['Design projects', 'Portfolio development'],
        universities: ['Cambridge', 'UCL Bartlett', 'Manchester', 'Bath', 'Sheffield'],
        bcAdvantage: 'Combination of STEM and creative excellence'
      }
    };

    const careerInterest = this.data.career.interest;
    return pathways[careerInterest] || pathways['Humanities & Social Sciences'];
  }
}

// Export for use
window.PersonalisationEngine = PersonalisationEngine;

// Auto-initialise on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.personalisationEngine = new PersonalisationEngine();
});
