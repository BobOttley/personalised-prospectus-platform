/**
 * School Configurations for Emily Multi-School Platform
 * Each school has its own theme, contact details, and prospectus modules
 */

const schools = {
  'clc': {
    id: 'clc',
    name: "Cheltenham Ladies' College",
    shortName: 'CLC',
    type: 'girls',
    prospectusPath: '../clc',
    knowledgeBase: 'clc.md',
    theme: {
      primary: '#1A5F5A',      // CLC teal
      secondary: '#C9A962',    // CLC gold
      accent: '#1A5F5A',
      background: '#FAFAFA',
      text: '#2D3748'
    },
    contact: {
      email: 'admissions@cheltladiescollege.org',
      phone: '+44 (0)1242 520691',
      website: 'www.cheltladiescollege.org',
      address: 'Bayshill Road, Cheltenham, GL50 3EP'
    },
    principal: 'Eve Jardine-Young',
    emilyPersonality: {
      voice: 'coral', // Female British voice
      accent: 'British',
      tone: 'warm, professional, knowledgeable',
      greeting: "Hello! I'm Emily, your guide to Cheltenham Ladies' College."
    },
    quickReplies: [
      { label: 'Sixth Form', query: 'Tell me about sixth form' },
      { label: 'Fees', query: 'What are the fees?' },
      { label: 'Boarding', query: 'Tell me about boarding' },
      { label: 'Apply', query: 'How do I apply?' },
      { label: 'Visit', query: 'Can I book a visit?' }
    ],
    openDaysUrl: 'https://www.cheltladiescollege.org/apply/visits',
    // AUDIO TOUR JOURNEY - the exact order Emily follows through the prospectus
    tourJourney: [
      'welcome',              // Principal's welcome
      'why_clc',              // Why CLC is special
      'academic_excellence',  // Academic programme
      'sixth_form',           // Sixth Form focus
      'career_pathway',       // Career guidance
      'boarding_life',        // Boarding experience
      'pastoral_care',        // Wellbeing
      'sport',                // Sports
      'music',                // Music
      'clubs_enrichment',     // Extra-curricular
      'scholarships',         // Scholarships & bursaries
      'how_to_apply',         // Application process
      'next_steps'            // Final CTA
    ],
    prospectusModules: [
      'welcome', 'why_clc', 'academic_excellence', 'lower_college',
      'upper_college', 'sixth_form', 'ib_programme', 'career_pathway',
      'boarding_life', 'day_girl_experience', 'pastoral_care', 'sport',
      'music', 'drama_dance', 'art', 'clubs_enrichment', 'scholarships',
      'bursaries', 'how_to_apply', 'visit_us', 'location', 'next_steps'
    ],
    sectionMeta: {
      welcome: {
        title: 'Welcome',
        intro: "Let me share our Principal's welcome message with you",
        followUp: ['why_clc', 'academic_excellence']
      },
      why_clc: {
        title: 'Why CLC',
        intro: "Here's what makes Cheltenham Ladies' College special",
        followUp: ['academic_excellence', 'pastoral_care']
      },
      academic_excellence: {
        title: 'Academic Excellence',
        intro: "Let me tell you about our academic programme",
        followUp: ['sixth_form', 'ib_programme', 'career_pathway']
      },
      sixth_form: {
        title: 'Sixth Form',
        intro: "Our Sixth Form is where students really come into their own",
        followUp: ['ib_programme', 'academic_excellence', 'boarding_life']
      },
      ib_programme: {
        title: 'IB Diploma Programme',
        intro: "We offer the International Baccalaureate as an alternative to A-Levels",
        followUp: ['sixth_form', 'academic_excellence']
      },
      lower_college: {
        title: 'Lower College',
        intro: "Lower College is for girls in Years 7 to 9",
        followUp: ['upper_college', 'pastoral_care']
      },
      upper_college: {
        title: 'Upper College',
        intro: "Upper College covers the GCSE years",
        followUp: ['sixth_form', 'academic_excellence']
      },
      career_pathway: {
        title: 'Career Pathways',
        intro: "Let me explain how we help girls plan their futures",
        followUp: ['sixth_form', 'academic_excellence']
      },
      boarding_life: {
        title: 'Boarding Life',
        intro: "Boarding at CLC is like joining an extended family",
        followUp: ['day_girl_experience', 'pastoral_care']
      },
      day_girl_experience: {
        title: 'Day Girl Experience',
        intro: "Many of our girls are day pupils",
        followUp: ['boarding_life', 'pastoral_care', 'location']
      },
      pastoral_care: {
        title: 'Pastoral Care',
        intro: "The wellbeing of every girl is our priority",
        followUp: ['boarding_life', 'clubs_enrichment']
      },
      sport: {
        title: 'Sport',
        intro: "Sport is a huge part of life at CLC",
        followUp: ['clubs_enrichment']
      },
      music: {
        title: 'Music',
        intro: "Music thrives here at CLC",
        followUp: ['drama_dance', 'art', 'clubs_enrichment']
      },
      drama_dance: {
        title: 'Drama & Dance',
        intro: "Our drama and dance programmes are exceptional",
        followUp: ['music', 'art', 'clubs_enrichment']
      },
      art: {
        title: 'Art',
        intro: "Creativity flourishes in our art department",
        followUp: ['music', 'drama_dance', 'clubs_enrichment']
      },
      clubs_enrichment: {
        title: 'Clubs & Enrichment',
        intro: "Beyond the classroom, there are over 100 clubs and activities",
        followUp: ['sport', 'music', 'drama_dance']
      },
      scholarships: {
        title: 'Scholarships',
        intro: "We offer scholarships to recognise exceptional talent",
        followUp: ['bursaries', 'how_to_apply']
      },
      bursaries: {
        title: 'Bursaries',
        intro: "Bursaries help make CLC accessible to talented girls regardless of financial circumstances",
        followUp: ['scholarships', 'how_to_apply']
      },
      how_to_apply: {
        title: 'How to Apply',
        intro: "Let me walk you through the application process",
        followUp: ['visit_us', 'next_steps']
      },
      visit_us: {
        title: 'Visit Us',
        intro: "Nothing compares to seeing CLC in person",
        followUp: ['how_to_apply', 'next_steps', 'location']
      },
      location: {
        title: 'Location',
        intro: "Let me tell you about Cheltenham and our campus",
        followUp: ['visit_us', 'boarding_life']
      },
      next_steps: {
        title: 'Next Steps',
        intro: "Here's what to do next",
        followUp: ['how_to_apply', 'visit_us']
      }
    }
  },

  'brighton-college': {
    id: 'brighton-college',
    name: 'Brighton College',
    shortName: 'Brighton',
    type: 'co-ed',
    prospectusPath: '../brighton-college',
    prospectusFile: 'prospectus/college-entry.html',  // Actual location of prospectus HTML
    knowledgeBase: 'brighton-college.md',
    theme: {
      primary: '#C4A747',      // Brighton gold (Emily widget color)
      secondary: '#003366',    // Brighton blue
      accent: '#C4A747',       // Gold accent
      background: '#FAFAFA',
      text: '#2D3748'
    },
    contact: {
      email: 'admissions@brightoncollege.org.uk',
      phone: '+44 (0)1273 704200',
      website: 'www.brightoncollege.org.uk',
      address: 'Eastern Road, Brighton, BN2 0AL'
    },
    principal: 'Richard Cairns',
    emilyPersonality: {
      voice: 'coral',
      accent: 'British',
      tone: 'warm, inspiring, progressive',
      greeting: "Hello! I'm Emily, your guide to Brighton College."
    },
    quickReplies: [
      { label: 'Sixth Form', query: 'Tell me about sixth form' },
      { label: 'Fees', query: 'What are the fees?' },
      { label: 'Boarding', query: 'Tell me about boarding' },
      { label: 'Apply', query: 'How do I apply?' },
      { label: 'Visit', query: 'Can I book a visit?' }
    ],
    openDaysUrl: 'https://www.brightoncollege.org.uk/admissions/visit-us/',
    // AUDIO TOUR JOURNEY - the exact order Emily follows through the prospectus
    // Section names MUST match data-module attributes in prospectus HTML
    tourJourney: [
      'welcome',        // Head's welcome
      'why_brighton',   // Why Brighton College - UK School of the Decade
      'academics',      // Academic excellence (NOTE: 'academics' not 'academic')
      'boarding',       // Boarding life and houses
      'day',            // Day pupil experience (NOTE: 'day' not 'day_pupil')
      'kindness',       // Kindness ethos
      'sport',          // Sports programme
      'music',          // Music
      'drama',          // Drama & Theatre
      'activities',     // 100+ clubs & activities
      'scholarships',   // Scholarships
      'spaces',         // Facilities tour
      'brighton',       // Brighton & the beach
      'apply',          // How to apply
      'visit',          // Visit us
      'next_steps'      // Final CTA
    ],
    prospectusModules: [
      'welcome', 'why_brighton', 'academics', 'lower_school', 'middle_school',
      'boarding', 'day', 'kindness', 'sport', 'music', 'drama', 'dance', 'art',
      'activities', 'scholarships', 'bursaries', 'spaces', 'brighton', 'apply', 'visit', 'next_steps'
    ],
    sectionMeta: {
      welcome: {
        title: 'Welcome to Brighton College',
        intro: "Let me share a welcome from Brighton College, the UK's School of the Decade",
        nextSection: 'why_brighton',
        followUp: ['why_brighton', 'academics']
      },
      why_brighton: {
        title: 'Why Brighton College',
        intro: "Here's what makes Brighton College the UK's School of the Decade",
        nextSection: 'academics',
        followUp: ['academics', 'boarding']
      },
      academics: {
        title: 'Academic Excellence',
        intro: "Let me tell you about our academic programme and exceptional results",
        nextSection: 'boarding',
        followUp: ['boarding', 'sport']
      },
      lower_school: {
        title: 'Lower School',
        intro: "Our Lower School provides an exceptional foundation",
        nextSection: 'middle_school',
        followUp: ['middle_school', 'academics']
      },
      middle_school: {
        title: 'Middle School',
        intro: "The Middle School years are transformative",
        nextSection: 'boarding',
        followUp: ['boarding', 'academics']
      },
      boarding: {
        title: 'Boarding Life',
        intro: "Boarding at Brighton is like joining an extended family",
        nextSection: 'day',
        followUp: ['day', 'spaces']
      },
      day: {
        title: 'Day Pupil Experience',
        intro: "Day pupils are fully part of our community",
        nextSection: 'kindness',
        followUp: ['kindness', 'boarding']
      },
      kindness: {
        title: 'Kindness at Brighton',
        intro: "Kindness is at the heart of everything we do",
        nextSection: 'sport',
        followUp: ['sport', 'activities']
      },
      sport: {
        title: 'Sport at Brighton',
        intro: "Sport is central to life at Brighton - with world-class facilities",
        nextSection: 'music',
        followUp: ['music', 'activities']
      },
      music: {
        title: 'Music',
        intro: "Music flourishes here with 25+ ensembles and 70+ events per year",
        nextSection: 'drama',
        followUp: ['drama', 'activities']
      },
      drama: {
        title: 'Drama & Theatre',
        intro: "Our new 400-seat theatre and Edinburgh Fringe programme",
        nextSection: 'activities',
        followUp: ['activities', 'music']
      },
      dance: {
        title: 'Dance',
        intro: "Dance for boys AND girls - breaking stereotypes",
        nextSection: 'art',
        followUp: ['art', 'activities']
      },
      art: {
        title: 'Art & Design',
        intro: "Where creativity thrives",
        nextSection: 'activities',
        followUp: ['activities', 'drama']
      },
      activities: {
        title: '100+ Clubs & Activities',
        intro: "Beyond lessons, there's so much to explore - 10 activity slots every week",
        nextSection: 'scholarships',
        followUp: ['scholarships', 'sport']
      },
      scholarships: {
        title: 'Scholarships',
        intro: "We offer scholarships for exceptional talent in many areas",
        nextSection: 'spaces',
        followUp: ['bursaries', 'apply']
      },
      bursaries: {
        title: 'Bursaries',
        intro: "Bursaries make Brighton accessible - up to 100% fee support",
        nextSection: 'spaces',
        followUp: ['scholarships', 'apply']
      },
      spaces: {
        title: 'Our Spaces',
        intro: "A tour of our stunning facilities including the new Richard Cairns Building",
        nextSection: 'brighton',
        followUp: ['brighton', 'boarding']
      },
      brighton: {
        title: 'Brighton & The Beach',
        intro: "No other top school offers what Brighton does - the beach on our doorstep",
        nextSection: 'apply',
        followUp: ['apply', 'visit']
      },
      apply: {
        title: 'How to Apply',
        intro: "Let me walk you through the application process",
        nextSection: 'visit',
        followUp: ['visit', 'next_steps']
      },
      visit: {
        title: 'Visit Us',
        intro: "Come and see Brighton College for yourselves",
        nextSection: 'next_steps',
        followUp: ['next_steps', 'apply']
      },
      next_steps: {
        title: 'Next Steps',
        intro: "Here's what to do next to begin your journey with us",
        nextSection: null,
        followUp: ['apply', 'visit']
      }
    }
  },

  'bcpk': {
    id: 'bcpk',
    name: 'Brighton College Prep Kensington',
    shortName: 'BCPK',
    type: 'co-ed',
    ageRange: '2-13',
    prospectusPath: '../bcpk',
    knowledgeBase: 'bcpk.md',
    theme: {
      primary: '#003366',      // Brighton family blue
      secondary: '#C4A747',    // Brighton gold
      accent: '#003366',
      background: '#FAFAFA',
      text: '#2D3748'
    },
    contact: {
      email: 'admissions@brightoncollegeprepkensington.co.uk',
      phone: '+44 (0)207 591 4622',
      website: 'www.brightoncollegeprepkensington.co.uk',
      address: '10-13 Prince\'s Gardens, London SW7 1ND'
    },
    principal: 'Mrs Lois Gaffney',
    emilyPersonality: {
      voice: 'coral',
      accent: 'British',
      tone: 'warm, nurturing, enthusiastic',
      greeting: "Hello! I'm Emily, your guide to Brighton College Prep Kensington."
    },
    quickReplies: [
      { label: 'Secret Garden', query: 'Tell me about the Secret Garden' },
      { label: 'Fees', query: 'What are the fees?' },
      { label: 'Curriculum', query: 'Tell me about the curriculum' },
      { label: 'Apply', query: 'How do I apply?' },
      { label: 'Visit', query: 'Can I book a visit?' }
    ],
    openDaysUrl: 'https://www.brightoncollegeprepkensington.co.uk/open-mornings/',
    // AUDIO TOUR JOURNEY - the exact order Emily follows through the prospectus
    tourJourney: [
      'welcome',        // Mrs Gaffney's welcome letter
      'why_bcpk',       // Three pillars: curiosity, confidence, kindness
      'secret_garden',  // The Secret Garden & Forest School
      'london',         // London as classroom (museums)
      'academics',      // Academic excellence, languages, Makerspace
      'beyond',         // Sports, music, drama, clubs
      'senior_schools', // Brighton College & senior school destinations
      'facilities',     // Victorian townhouses, Imperial College
      'admissions',     // How to apply
      'visit',          // Open Mornings & visits
      'next_steps'      // Final CTA
    ],
    prospectusModules: [
      'welcome', 'why_bcpk', 'secret_garden', 'london', 'academics',
      'beyond', 'senior_schools', 'facilities', 'admissions', 'visit', 'next_steps'
    ],
    sectionMeta: {
      welcome: {
        title: 'Welcome from Mrs Gaffney',
        intro: "Let me share Mrs Gaffney's personal welcome message with you",
        nextSection: 'why_bcpk',
        followUp: ['why_bcpk', 'secret_garden']
      },
      why_bcpk: {
        title: 'Why Brighton College Prep Kensington',
        intro: "Now let me tell you about our three core values - curiosity, confidence, and kindness",
        nextSection: 'secret_garden',
        followUp: ['secret_garden', 'academics']
      },
      secret_garden: {
        title: 'The Secret Garden',
        intro: "One of our most magical features - our two-acre Secret Garden with Forest School",
        nextSection: 'london',
        followUp: ['london', 'beyond']
      },
      london: {
        title: 'London as Our Classroom',
        intro: "We're steps from world-class museums - the Natural History Museum, V&A, and Science Museum",
        nextSection: 'academics',
        followUp: ['academics', 'facilities']
      },
      academics: {
        title: 'Academic Excellence',
        intro: "Let me tell you about our specialist teaching, languages, and innovative Makerspace",
        nextSection: 'beyond',
        followUp: ['beyond', 'senior_schools']
      },
      beyond: {
        title: 'Beyond the Classroom',
        intro: "Sport, music, drama, and our wonderful clubs and activities",
        nextSection: 'senior_schools',
        followUp: ['senior_schools', 'facilities']
      },
      senior_schools: {
        title: 'Senior School Destinations',
        intro: "Where our pupils go next - Brighton College and top London day schools",
        nextSection: 'facilities',
        followUp: ['facilities', 'admissions']
      },
      facilities: {
        title: 'Our Facilities',
        intro: "Four beautiful Victorian townhouses, our Makerspace, and partnership with Imperial College",
        nextSection: 'admissions',
        followUp: ['admissions', 'visit']
      },
      admissions: {
        title: 'How to Apply',
        intro: "Let me walk you through the application process",
        nextSection: 'visit',
        followUp: ['visit', 'next_steps']
      },
      visit: {
        title: 'Visit Us',
        intro: "Come and see Brighton College Prep Kensington for yourselves",
        nextSection: 'next_steps',
        followUp: ['next_steps', 'admissions']
      },
      next_steps: {
        title: 'Next Steps',
        intro: "Here's what to do next to begin your journey with us",
        nextSection: null,
        followUp: ['admissions', 'visit']
      }
    }
  },

  'clifton-college': {
    id: 'clifton-college',
    name: 'Clifton College',
    shortName: 'Clifton',
    type: 'co-ed',
    prospectusPath: '../clifton-college',
    knowledgeBase: 'clifton-college.md',
    theme: {
      primary: '#1E3A5F',      // Clifton blue
      secondary: '#D4AF37',    // Clifton gold
      accent: '#1E3A5F',
      background: '#FAFAFA',
      text: '#2D3748'
    },
    contact: {
      email: 'admissions@cliftoncollege.com',
      phone: '+44 (0)117 315 7000',
      website: 'www.cliftoncollege.com',
      address: '32 College Road, Clifton, Bristol, BS8 3JH'
    },
    principal: 'Dr Tim Greene',
    emilyPersonality: {
      voice: 'shimmer',
      accent: 'British',
      tone: 'warm, confident, traditional yet progressive',
      greeting: "Hello! I'm Emily, your guide to Clifton College."
    },
    prospectusModules: [
      'welcome', 'why_clifton', 'academic_excellence', 'upper_school',
      'sixth_form', 'boarding', 'day_pupil', 'pastoral_care', 'sport',
      'music', 'drama', 'art', 'co_curricular', 'scholarships',
      'bursaries', 'how_to_apply', 'visit_us', 'location', 'next_steps'
    ],
    sectionMeta: {
      welcome: {
        title: 'Welcome',
        intro: "Welcome to Clifton College",
        followUp: ['why_clifton', 'academic_excellence']
      },
      why_clifton: {
        title: 'Why Clifton',
        intro: "Here's what makes Clifton College special",
        followUp: ['academic_excellence', 'pastoral_care']
      },
      academic_excellence: {
        title: 'Academic Excellence',
        intro: "Let me tell you about our academic approach",
        followUp: ['sixth_form', 'upper_school']
      },
      sixth_form: {
        title: 'Sixth Form',
        intro: "Our Sixth Form is truly exceptional",
        followUp: ['academic_excellence', 'boarding']
      },
      boarding: {
        title: 'Boarding',
        intro: "Boarding at Clifton is a home from home",
        followUp: ['day_pupil', 'pastoral_care']
      },
      day_pupil: {
        title: 'Day Pupils',
        intro: "Day pupils are fully part of our community",
        followUp: ['boarding', 'location']
      },
      pastoral_care: {
        title: 'Pastoral Care',
        intro: "We care deeply about every student",
        followUp: ['boarding', 'co_curricular']
      },
      sport: {
        title: 'Sport',
        intro: "Sport is in Clifton's DNA",
        followUp: ['co_curricular']
      },
      music: {
        title: 'Music',
        intro: "Music is exceptional here",
        followUp: ['drama', 'art']
      },
      drama: {
        title: 'Drama',
        intro: "Drama flourishes at Clifton",
        followUp: ['music', 'art']
      },
      art: {
        title: 'Art',
        intro: "Art and creativity thrive here",
        followUp: ['music', 'drama']
      },
      co_curricular: {
        title: 'Co-curricular',
        intro: "There's so much beyond the classroom",
        followUp: ['sport', 'music']
      },
      scholarships: {
        title: 'Scholarships',
        intro: "We award scholarships for excellence",
        followUp: ['bursaries', 'how_to_apply']
      },
      bursaries: {
        title: 'Bursaries',
        intro: "Bursaries help talented students join us",
        followUp: ['scholarships', 'how_to_apply']
      },
      how_to_apply: {
        title: 'How to Apply',
        intro: "Here's how to apply to Clifton",
        followUp: ['visit_us', 'next_steps']
      },
      visit_us: {
        title: 'Visit Us',
        intro: "Come and experience Clifton",
        followUp: ['how_to_apply', 'location']
      },
      location: {
        title: 'Location',
        intro: "We're in beautiful Clifton, Bristol",
        followUp: ['visit_us', 'boarding']
      },
      next_steps: {
        title: 'Next Steps',
        intro: "Here's what to do next",
        followUp: ['how_to_apply', 'visit_us']
      }
    }
  }
};

/**
 * Get school configuration by ID
 * @param {string} schoolId - The school identifier (e.g., 'clc', 'brighton-college')
 * @returns {Object|null} School configuration or null if not found
 */
function getSchool(schoolId) {
  return schools[schoolId] || null;
}

/**
 * Get all school IDs
 * @returns {string[]} Array of school IDs
 */
function getSchoolIds() {
  return Object.keys(schools);
}

/**
 * Detect school from URL path or hostname
 * @param {string} url - The URL to parse
 * @returns {string|null} School ID or null
 */
function detectSchoolFromUrl(url) {
  const urlLower = url.toLowerCase();

  // Check for school identifiers in path
  for (const schoolId of Object.keys(schools)) {
    if (urlLower.includes(`/${schoolId}/`) || urlLower.includes(`/${schoolId}`)) {
      return schoolId;
    }
  }

  // Check for school names in hostname
  if (urlLower.includes('cheltladiescollege') || urlLower.includes('clc')) return 'clc';
  if (urlLower.includes('brightoncollegeprepkensington') || urlLower.includes('bcpk')) return 'bcpk';
  if (urlLower.includes('brightoncollege')) return 'brighton-college';
  if (urlLower.includes('cliftoncollege')) return 'clifton-college';

  return null;
}

module.exports = {
  schools,
  getSchool,
  getSchoolIds,
  detectSchoolFromUrl
};
