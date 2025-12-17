/**
 * Strathallan School - Personalised Prospectus Engine
 * Handles personalisation, module visibility, video control, and reading progress
 */

// Prospectus data
let prospectusData = null;

// Video elements
let heroVideo = null;
let isMuted = true;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProspectusData();
    initializePersonalisation();
    initializeVideoHero();
    initializeProgressTracking();
    initializeScrollEffects();
});

/**
 * Load prospectus data from localStorage or URL
 */
function loadProspectusData() {
    // Try to get from localStorage first
    const storedData = localStorage.getItem('strath_prospectus_data');

    if (storedData) {
        try {
            prospectusData = JSON.parse(storedData);
        } catch (e) {
            console.error('Error parsing prospectus data:', e);
            loadDemoData();
        }
    } else {
        // Load demo data for preview
        loadDemoData();
    }
}

/**
 * Load demo data for preview/testing
 */
function loadDemoData() {
    prospectusData = {
        prospectus_id: 'demo-family-12345',
        generated_at: new Date().toISOString(),
        school_type: 'senior',
        child: {
            first_name: 'James',
            current_age: 14,
            gender: 'male',
            senior_entry_point: 'fourth_form',
            entry_year: '2025'
        },
        parent: {
            title: 'Mr',
            first_name: 'John',
            surname: 'Smith',
            email: 'john.smith@example.com'
        },
        interests: {
            academic: ['sciences', 'mathematics'],
            sports: ['rugby', 'tennis'],
            creative: ['piping'],
            other: ['outdoor']
        },
        practical: {
            accommodation_type: 'boarding',
            family_location: 'scotland',
            curriculum_preference: 'undecided'
        },
        personalisation: {
            modules_included: [
                'cover', 'welcome', 'why_strathallan', 'senior_school', 'curriculum',
                'fourth_form', 'gcse_subjects',
                'boarding_life', 'boarding_houses', 'sports', 'rugby',
                'piping_drumming', 'community', 'pastoral_care', 'campus', 'location',
                'next_steps'
            ],
            career_areas: ['medicine', 'science'],
            suggested_house: {
                name: 'Freeland',
                type: 'Senior Boys',
                description: 'A friendly house with a strong sense of community'
            },
            videos: {
                hero: 'X8lXe4RUDGM',
                community: 'cw80wuAig-w',
                piping: 'KT6cLnVnlRA',
                sports: 'Zegz9sFYbTM',
                rugby: '1iuJYFfQecM'
            }
        }
    };
}

/**
 * Initialize personalisation - populate data fields and show/hide modules
 */
function initializePersonalisation() {
    if (!prospectusData) return;

    // Populate data fields
    populateDataFields();

    // Show/hide modules based on personalisation
    applyModuleVisibility();

    // Update subject recommendations if Sixth Form
    if (prospectusData.personalisation?.subject_recommendations) {
        updateSubjectRecommendations();
        populateSubjectCards();
    }

    // Populate GCSE subject cards if Fourth Form
    if (prospectusData.personalisation?.modules_included?.includes('gcse_subjects')) {
        populateGCSESubjectCards();
    }

    // Update suggested house
    if (prospectusData.personalisation?.suggested_house) {
        updateSuggestedHouse();
    }

    // Filter boarding houses based on entry point and gender
    filterBoardingHouses();
    filterScholarships();

    // Update generated date
    const dateElement = document.getElementById('generatedDate');
    if (dateElement) {
        const date = new Date(prospectusData.generated_at);
        dateElement.textContent = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

/**
 * Populate all data fields throughout the document
 */
function populateDataFields() {
    const data = prospectusData;

    // Child name
    const childName = data.child?.first_name || 'your child';
    document.querySelectorAll('[data-field="child_name"]').forEach(el => {
        el.textContent = childName;
    });

    // Family name (parent surname)
    const familyName = data.parent?.surname || 'Family';
    document.querySelectorAll('[data-field="family_name"]').forEach(el => {
        el.textContent = familyName;
    });

    // Parent title
    const parentTitle = data.parent?.title || '';
    document.querySelectorAll('[data-field="parent_title"]').forEach(el => {
        el.textContent = parentTitle;
    });

    // School type text
    const schoolTypeText = getSchoolTypeText();
    document.querySelectorAll('[data-field="school_type_text"]').forEach(el => {
        el.textContent = schoolTypeText;
    });

    // Entry point text
    const entryPointText = getEntryPointText();
    document.querySelectorAll('[data-field="entry_point_text"]').forEach(el => {
        el.textContent = entryPointText;
    });

    // Pronouns based on child's gender
    const gender = data.child?.gender || 'other';
    const pronouns = getPronouns(gender);

    // He/She (subject)
    document.querySelectorAll('[data-field="pronoun_subject"]').forEach(el => {
        el.textContent = pronouns.subject;
    });

    // him/her (object)
    document.querySelectorAll('[data-field="pronoun_object"]').forEach(el => {
        el.textContent = pronouns.object;
    });

    // his/her (possessive)
    document.querySelectorAll('[data-field="pronoun_possessive"]').forEach(el => {
        el.textContent = pronouns.possessive;
    });

    // himself/herself (reflexive)
    document.querySelectorAll('[data-field="pronoun_reflexive"]').forEach(el => {
        el.textContent = pronouns.reflexive;
    });

    // He's/She's (subject + is contraction)
    document.querySelectorAll('[data-field="pronoun_subject_is"]').forEach(el => {
        el.textContent = pronouns.subject_is;
    });

    // he'll/she'll (subject + will contraction)
    document.querySelectorAll('[data-field="pronoun_subject_will"]').forEach(el => {
        el.textContent = pronouns.subject_will;
    });
}

/**
 * Get pronouns based on gender
 */
function getPronouns(gender) {
    if (gender === 'male') {
        return {
            subject: 'he',
            object: 'him',
            possessive: 'his',
            reflexive: 'himself',
            subject_is: "he's",
            subject_will: "he'll"
        };
    } else if (gender === 'female') {
        return {
            subject: 'she',
            object: 'her',
            possessive: 'her',
            reflexive: 'herself',
            subject_is: "she's",
            subject_will: "she'll"
        };
    } else {
        // Default to they/them for other/unknown
        return {
            subject: 'they',
            object: 'them',
            possessive: 'their',
            reflexive: 'themselves',
            subject_is: "they're",
            subject_will: "they'll"
        };
    }
}

/**
 * Get human-readable school type text
 */
function getSchoolTypeText() {
    const schoolType = prospectusData.school_type;
    const bothInterested = prospectusData.interested_both;

    if (bothInterested) {
        return 'Strathallan Prep & Senior School';
    }

    switch (schoolType) {
        case 'prep':
            return 'Strathallan Prep School';
        case 'senior':
            return 'Senior School';
        default:
            return 'Strathallan';
    }
}

/**
 * Get human-readable entry point text
 */
function getEntryPointText() {
    const prepEntry = prospectusData.child?.prep_entry_point;
    const seniorEntry = prospectusData.child?.senior_entry_point;

    if (prepEntry) {
        switch (prepEntry) {
            case 'reception': return 'Reception / Years 1-2';
            case 'junior': return 'Years 3-6';
            case 'form1': return 'Form 1 / Form 2';
        }
    }

    if (seniorEntry) {
        switch (seniorEntry) {
            case 'third_form': return 'Third Form entry';
            case 'fourth_form': return 'Fourth Form entry';
            case 'sixth_form': return 'Sixth Form entry';
            case 'other': return 'entry';
        }
    }

    return 'entry';
}

/**
 * Apply module visibility based on personalisation data
 */
function applyModuleVisibility() {
    const includedModules = prospectusData.personalisation?.modules_included || [];

    // Get all modules
    const allModules = document.querySelectorAll('[data-module]');

    allModules.forEach(module => {
        const moduleName = module.dataset.module;

        // Check if module should be shown
        const shouldShow = includedModules.includes(moduleName);

        if (!shouldShow) {
            module.classList.add('module--hidden');
        } else {
            module.classList.remove('module--hidden');
        }
    });

    // Handle video content visibility
    const videos = prospectusData.personalisation?.videos || {};
    document.querySelectorAll('[data-video]').forEach(el => {
        const videoKey = el.dataset.video;
        if (!videos[videoKey]) {
            el.style.display = 'none';
        }
    });
}

/**
 * Update subject recommendations for career pathway
 */
function updateSubjectRecommendations() {
    const recommendations = prospectusData.personalisation?.subject_recommendations;
    if (!recommendations) return;

    const essentialEl = document.getElementById('essentialSubjects');
    const recommendedEl = document.getElementById('recommendedSubjects');
    const optionalEl = document.getElementById('optionalSubjects');

    if (essentialEl && recommendations.essential) {
        essentialEl.textContent = recommendations.essential.length > 0
            ? recommendations.essential.join(', ')
            : 'No specific requirements';
    }

    if (recommendedEl && recommendations.recommended) {
        recommendedEl.textContent = recommendations.recommended.join(', ');
    }

    if (optionalEl && recommendations.optional) {
        optionalEl.textContent = recommendations.optional.join(', ');
    }
}

/**
 * Update suggested boarding house
 */
function updateSuggestedHouse() {
    const house = prospectusData.personalisation?.suggested_house;
    if (!house) return;

    const nameEl = document.getElementById('suggestedHouseName');
    const descEl = document.getElementById('suggestedHouseDescription');

    if (nameEl) {
        nameEl.textContent = house.name;
    }

    if (descEl) {
        descEl.innerHTML = `<strong>${house.type}</strong> - ${house.description}`;
    }
}

/**
 * Filter boarding houses based on entry point and gender
 * - Third Form: Show Riley House only
 * - Fourth Form / Sixth Form Boys: Show Senior Boys' Houses only
 * - Fourth Form / Sixth Form Girls: Show Senior Girls' Houses only
 */
function filterBoardingHouses() {
    if (!prospectusData) return;

    const entryPoint = prospectusData.child?.senior_entry_point || 'fourth_form';
    const gender = (prospectusData.child?.gender || 'male').toLowerCase();

    console.log('Filtering houses - Entry:', entryPoint, 'Gender:', gender);

    const rileySection = document.getElementById('riley-house-section');
    const boysSection = document.getElementById('boys-houses-section');
    const girlsSection = document.getElementById('girls-houses-section');

    // ALWAYS hide all first
    if (rileySection) rileySection.style.cssText = 'display: none !important';
    if (boysSection) boysSection.style.cssText = 'display: none !important';
    if (girlsSection) girlsSection.style.cssText = 'display: none !important';

    // Show based on entry point and gender
    if (entryPoint === 'third_form') {
        // Third Form goes to Riley House
        if (rileySection) {
            rileySection.style.cssText = 'display: block; margin-bottom: var(--space-2xl); background: linear-gradient(135deg, rgba(207,181,59,0.1) 0%, rgba(0,61,76,0.2) 100%);';
        }
        console.log('Showing Riley House');
    } else {
        // Fourth Form and Sixth Form go to senior houses based on gender
        if (gender === 'male' || gender === 'boy' || gender === 'm') {
            if (boysSection) boysSection.style.cssText = 'display: block';
            console.log('Showing Boys Houses');
        } else if (gender === 'female' || gender === 'girl' || gender === 'f') {
            if (girlsSection) girlsSection.style.cssText = 'display: block';
            console.log('Showing Girls Houses');
        } else {
            // Default to boys for 'other' or unknown
            if (boysSection) boysSection.style.cssText = 'display: block';
            console.log('Showing Boys Houses (default)');
        }
    }
}

/**
 * Filter scholarship sections based on entry point
 */
function filterScholarships() {
    if (!prospectusData) return;

    const entryPoint = prospectusData.child?.senior_entry_point || 'fourth_form';

    console.log('Filtering scholarships - Entry:', entryPoint);

    const thirdFormSchol = document.getElementById('third-form-scholarships');
    const fourthFormSchol = document.getElementById('fourth-form-scholarships');
    const sixthFormSchol = document.getElementById('sixth-form-scholarships');

    // Hide all first
    if (thirdFormSchol) thirdFormSchol.style.display = 'none';
    if (fourthFormSchol) fourthFormSchol.style.display = 'none';
    if (sixthFormSchol) sixthFormSchol.style.display = 'none';

    // Show based on entry point
    if (entryPoint === 'third_form') {
        if (thirdFormSchol) thirdFormSchol.style.display = 'block';
        console.log('Showing Third Form Scholarships');
    } else if (entryPoint === 'fourth_form') {
        if (fourthFormSchol) fourthFormSchol.style.display = 'block';
        console.log('Showing Fourth Form Scholarships');
    } else if (entryPoint === 'sixth_form') {
        if (sixthFormSchol) sixthFormSchol.style.display = 'block';
        console.log('Showing Sixth Form Scholarships');
    } else {
        // Default to fourth form
        if (fourthFormSchol) fourthFormSchol.style.display = 'block';
        console.log('Showing Fourth Form Scholarships (default)');
    }
}

/**
 * Initialize video hero functionality
 */
function initializeVideoHero() {
    heroVideo = document.getElementById('heroVideo');
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const welcomeMinimised = document.getElementById('welcomeMinimised');

    if (!heroVideo || !welcomeOverlay) return;

    // Auto-minimize welcome overlay after delay (9 seconds total)
    setTimeout(() => {
        welcomeOverlay.classList.add('minimising');

        setTimeout(() => {
            welcomeOverlay.classList.add('hidden');
            welcomeMinimised?.classList.add('visible');
        }, 1200);
    }, 9000);
}

/**
 * Toggle video sound
 */
function toggleSound() {
    const iframe = document.getElementById('heroVideo');
    const soundBtn = document.getElementById('soundBtn');
    const soundOff = soundBtn?.querySelector('.sound-off');
    const soundOn = soundBtn?.querySelector('.sound-on');
    const soundText = soundBtn?.querySelector('.sound-text');

    if (!iframe) return;

    isMuted = !isMuted;

    // Use postMessage to toggle mute without restarting video
    if (isMuted) {
        iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        soundOff.style.display = 'block';
        soundOn.style.display = 'none';
        soundText.textContent = 'Enable Sound';
        soundBtn.classList.remove('video-sound-btn--active');
    } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        soundOff.style.display = 'none';
        soundOn.style.display = 'block';
        soundText.textContent = 'Mute';
        soundBtn.classList.add('video-sound-btn--active');
    }
}

/**
 * Initialize reading progress tracking
 */
function initializeProgressTracking() {
    const nav = document.getElementById('prospectusNav');
    const progressText = nav?.querySelector('.prospectus-nav__progress-text');
    const progressFill = nav?.querySelector('.prospectus-nav__progress-fill');

    if (!nav) return;

    // Show nav on scroll
    let lastScrollTop = 0;
    let navVisible = false;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Show/hide nav based on scroll position
        if (scrollTop > windowHeight * 0.5) {
            if (!navVisible) {
                nav.classList.add('prospectus-nav--visible');
                navVisible = true;
            }
        } else {
            if (navVisible) {
                nav.classList.remove('prospectus-nav--visible');
                navVisible = false;
            }
        }

        // Calculate and update progress
        const maxScroll = documentHeight - windowHeight;
        const progress = Math.min(Math.round((scrollTop / maxScroll) * 100), 100);

        if (progressText) {
            progressText.textContent = `${progress}% read`;
        }

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        lastScrollTop = scrollTop;
    });
}

/**
 * Initialize scroll effects (module animations, etc.)
 */
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards, house cards, etc.
    const animatedElements = document.querySelectorAll('.feature-card, .house-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Toggle expandable subject card
 */
function toggleSubject(subjectId) {
    const card = document.querySelector(`[data-subject="${subjectId}"]`);
    if (card) {
        card.classList.toggle('expanded');
    }
}

/**
 * Toggle subject card expansion
 */
function toggleSubjectCard(element) {
    element.classList.toggle('expanded');
}

/**
 * Subject data for dynamic cards - comprehensive info from Sixth Form Course Guide
 */
const subjectData = {
    'Biology': {
        icon: 'BIO',
        board: 'OCR A',
        summary: 'Study of living organisms from molecules to ecosystems. Essential for medical and life science careers.',
        grade: 'Grade 7+ in GCSE Biology or 7-7 Combined Science. Grade 6 Maths recommended.',
        pathways: 'Medicine, Dentistry, Veterinary Science, Pharmacy, Nursing',
        content: [
            'Foundations in biology - cell structure, biological molecules, enzymes, membranes',
            'Exchange and transport - gas exchange, transport in animals and plants',
            'Biodiversity, evolution and disease - communicable diseases, classification',
            'Communication, homeostasis and energy - neuronal and hormonal systems',
            'Genetics, evolution and ecosystems - inheritance, biotechnology, ecosystems'
        ],
        assessment: 'Paper 1: Biological Processes (2hr 15min, 37%) | Paper 2: Biological Diversity (2hr 15min, 37%) | Paper 3: Unified Biology (1hr 30min, 26%) | Practical Endorsement reported separately',
        whyStudy: 'Biology opens doors to some of the most rewarding careers. Understanding life processes is essential for medicine, and the analytical skills developed are valued across many fields.'
    },
    'Chemistry': {
        icon: 'CHEM',
        board: 'OCR A',
        summary: 'The central science connecting physics and biology. Required for most medical and science degrees.',
        grade: 'Grade 7+ in GCSE Chemistry or 7-7 Combined Science. Grade 7 Maths strongly recommended.',
        pathways: 'Medicine, Pharmacy, Chemical Engineering, Biochemistry, Materials Science',
        content: [
            'Foundations - atoms, compounds, moles, acid-base reactions, redox, bonding',
            'Periodic table and energy - periodicity, Group 2, halogens, enthalpy, rates, equilibrium',
            'Core organic chemistry - alkanes, alkenes, alcohols, haloalkanes, analysis',
            'Physical chemistry - rates, equilibrium constants, acids/bases, buffers, electrochemistry',
            'Organic synthesis - aromatics, carbonyls, nitrogen compounds, polymers, NMR'
        ],
        assessment: 'Paper 1: Periodic Table & Physical Chemistry (2hr 15min, 37%) | Paper 2: Synthesis & Analytical Techniques (2hr 15min, 37%) | Paper 3: Unified Chemistry (1hr 30min, 26%)',
        whyStudy: 'Chemistry is essential for medicine, dentistry, and veterinary science. It develops logical thinking and problem-solving skills valued by all employers.'
    },
    'Physics': {
        icon: 'PHY',
        board: 'OCR A',
        summary: 'Fundamental understanding of matter, energy, space and time. Essential for all engineering disciplines.',
        grade: 'Grade 7+ in GCSE Physics or 7-7 Combined Science. Grade 7 Maths essential - A Level Maths strongly recommended.',
        pathways: 'Engineering (all types), Physics, Architecture, Aviation, Astronomy',
        content: [
            'Foundations - physical quantities, SI units, measurements',
            'Forces and motion - kinematics, forces in action, work/energy/power, materials',
            'Electrons, waves and photons - circuits, waves, quantum physics',
            'Newtonian world and astrophysics - thermal physics, circular motion, oscillations, gravity',
            'Particles and medical physics - capacitors, electric fields, nuclear physics, medical imaging'
        ],
        assessment: 'Paper 1: Modelling Physics (2hr 15min, 37%) | Paper 2: Exploring Physics (2hr 15min, 37%) | Paper 3: Unified Physics (1hr 30min, 26%)',
        whyStudy: 'Physics is essential for engineering and highly valued for medicine. It develops mathematical and analytical skills that are in high demand.'
    },
    'Mathematics': {
        icon: 'MATH',
        board: 'Edexcel',
        summary: 'Pure maths, statistics and mechanics. Gateway to STEM careers and highly valued across all fields.',
        grade: 'Grade 7+ in GCSE Mathematics. Strong algebra skills and enjoyment of problem-solving essential.',
        pathways: 'Engineering, Computer Science, Economics, Finance, Actuarial Science, Data Science',
        content: [
            'Pure Mathematics (67%) - proof, algebra, coordinate geometry, sequences, trigonometry, calculus, vectors',
            'Statistics (17%) - sampling, data presentation, probability, distributions, hypothesis testing',
            'Mechanics (17%) - kinematics, forces, Newton\'s laws, moments'
        ],
        assessment: 'Paper 1: Pure Mathematics 1 (2hr, 33.3%) | Paper 2: Pure Mathematics 2 (2hr, 33.3%) | Paper 3: Statistics and Mechanics (2hr, 33.3%)',
        whyStudy: 'Mathematics is essential for engineering, required for many economics courses at top universities, and demonstrates analytical ability valued in all careers.'
    },
    'Further Mathematics': {
        icon: 'FM',
        board: 'Edexcel',
        summary: 'Advanced mathematics extending A Level Maths. Expected for maths and engineering at top universities.',
        grade: 'Grade 8/9 in GCSE Mathematics. Must be taken alongside A Level Maths. Strong algebra essential.',
        pathways: 'Mathematics at Cambridge/Oxford/Warwick/Imperial, Engineering at top universities',
        content: [
            'Core Pure - complex numbers, matrices, further algebra, further calculus, polar coordinates, hyperbolic functions, differential equations',
            'Further Pure option - series, methods in differential equations',
            'Further Mechanics option - momentum, impulse, elastic collisions, work/energy'
        ],
        assessment: 'Paper 1: Core Pure 1 (1hr 30min, 25%) | Paper 2: Core Pure 2 (1hr 30min, 25%) | Paper 3: Further Pure (1hr 30min, 25%) | Paper 4: Further Mechanics (1hr 30min, 25%)',
        whyStudy: 'Further Maths is expected for mathematics at top universities and highly advantageous for engineering, physics, and computer science applications.'
    },
    'Economics': {
        icon: 'ECON',
        board: 'Edexcel A',
        summary: 'Understanding markets, government policy, and global economics. Develops strong analytical skills.',
        grade: 'Grade 6+ in GCSE Maths and English. No prior economics knowledge required.',
        pathways: 'Economics, Finance, Banking, Business, Politics, Law, Journalism',
        content: [
            'Theme 1 - Introduction to markets and market failure, how markets work, government intervention',
            'Theme 2 - The UK economy, aggregate demand/supply, national income, growth, policy',
            'Theme 3 - Business behaviour, growth, market structures, labour market',
            'Theme 4 - Global perspective, international economics, poverty, emerging economies'
        ],
        assessment: 'Paper 1: Markets and Business Behaviour (2hr, 35%) | Paper 2: National and Global Economy (2hr, 35%) | Paper 3: Micro and Macroeconomics (2hr, 30%)',
        whyStudy: 'Economics develops understanding of how the world works. Many top universities prefer A Level Maths alongside Economics for degree courses.'
    },
    'Business Studies': {
        icon: 'BUS',
        board: 'Edexcel',
        summary: 'Marketing, finance, strategy and management. Understanding how organisations succeed and grow.',
        grade: 'Grade 6+ in GCSE English and Mathematics. Numeracy and literacy skills heavily tested.',
        pathways: 'Business Management, Marketing, Human Resources, Entrepreneurship, Retail',
        content: [
            'Theme 1 - Marketing and people, meeting customer needs, marketing mix, managing people',
            'Theme 2 - Managing business activities, finance, resource management, external influences',
            'Theme 3 - Business decisions and strategy, growth, decision-making, competitiveness',
            'Theme 4 - Global business, globalisation, global markets, expansion strategies'
        ],
        assessment: 'Paper 1: Marketing, People and Global Businesses (2hr, 35%) | Paper 2: Business Activities, Decisions and Strategy (2hr, 35%) | Paper 3: Investigating Business (2hr, 30%)',
        whyStudy: 'Business develops practical understanding of how organisations operate. Useful for entrepreneurship and understanding any career in the commercial world.'
    },
    'History': {
        icon: 'HIST',
        board: 'Edexcel',
        summary: 'Critical analysis of evidence and extended writing. Britain, China, and warfare through the ages.',
        grade: 'Grade 6+ in GCSE History recommended. Strong essay writing skills essential.',
        pathways: 'History, Law, Politics, Journalism, Civil Service, Teaching, Heritage',
        content: [
            'Paper 1 - Britain 1885-1965: transformation of politics, social reform, votes for women, wars',
            'Paper 2 - Mao\'s China 1949-76: Communist rule, Great Leap Forward, Cultural Revolution',
            'Paper 3 - British Experience of Warfare 1790-1918: Napoleonic, Crimean, World War One',
            'Coursework - Independent study on chosen topic (e.g., American Civil War)'
        ],
        assessment: 'Paper 1: Britain Transformed (2hr 15min, 30%) | Paper 2: Mao\'s China (1hr 30min, 20%) | Paper 3: British Warfare (2hr 15min, 30%) | Coursework: 3,000-4,000 words (20%)',
        whyStudy: 'History is highly regarded by Russell Group universities as evidence of analytical ability. Essential for law and valued for any career requiring critical thinking.'
    },
    'English Literature': {
        icon: 'ENG',
        board: 'Edexcel',
        summary: 'Poetry, drama and prose. Develops sophisticated critical analysis and communication skills.',
        grade: 'Grade 6+ in GCSE English Literature. Genuine passion for reading essential.',
        pathways: 'English, Creative Writing, Law, Journalism, Publishing, Teaching, Marketing, PR',
        content: [
            'Drama - two plays including Shakespeare, examining theatrical techniques and themes',
            'Prose - two texts including one pre-1900, narrative techniques and context',
            'Poetry - anthology on a theme, close analysis of poetic techniques',
            'Coursework - comparative study of two texts from different periods and genres'
        ],
        assessment: 'Paper 1: Drama (2hr 15min, 30%) | Paper 2: Prose (1hr 15min, 20%) | Paper 3: Poetry (2hr 15min, 30%) | Coursework: 2,500-3,000 words (20%)',
        whyStudy: 'English Literature develops critical thinking and communication skills valued in every career. Excellent preparation for any degree requiring essay writing.'
    },
    'Psychology': {
        icon: 'PSY',
        board: 'AQA',
        summary: 'Scientific study of mind and behaviour. Combines scientific method with understanding of people.',
        grade: 'Grade 6+ in GCSE English and Mathematics. Science background helpful but not essential.',
        pathways: 'Psychology, Criminology, Nursing, Social Work, Human Resources, Marketing',
        content: [
            'Introductory topics - social influence, memory, attachment, psychopathology',
            'Psychology in context - approaches (biological, cognitive, behaviourist), biopsychology, research methods',
            'Issues and options - plus three from: relationships, gender, schizophrenia, eating behaviour, stress, aggression, forensic psychology, addiction'
        ],
        assessment: 'Paper 1: Introductory Topics (2hr, 33.3%) | Paper 2: Psychology in Context (2hr, 33.3%) | Paper 3: Issues and Options (2hr, 33.3%)',
        whyStudy: 'Psychology provides insight into human behaviour valuable in any people-focused career. Note: clinical psychology requires 3+ years postgraduate training after degree.'
    },
    'Geography': {
        icon: 'GEO',
        board: 'AQA',
        summary: 'Physical and human geography with fieldwork. Contemporary environmental and social issues.',
        grade: 'Grade 6+ in GCSE Geography recommended. Good written and numerical skills essential.',
        pathways: 'Geography, Environmental Science, Urban Planning, Sustainability, Conservation, GIS',
        content: [
            'Physical Geography - water and carbon cycles, coastal systems, hazards (tectonic and atmospheric)',
            'Human Geography - global systems and governance, changing places, urban environments',
            'Geographical Investigation - independent fieldwork (3,000-4,000 words) on chosen issue'
        ],
        assessment: 'Paper 1: Physical Geography (2hr 30min, 40%) | Paper 2: Human Geography (2hr 30min, 40%) | NEA: Independent Investigation (20%)',
        whyStudy: 'Geography is increasingly relevant with climate change and urbanisation. Fieldwork residential trips provide memorable learning experiences.'
    },
    'Computer Science': {
        icon: 'CS',
        board: 'OCR',
        summary: 'Programming, algorithms and computational thinking. Highly valued in the digital economy.',
        grade: 'Grade 7+ in GCSE Mathematics essential. Prior programming helpful but not required.',
        pathways: 'Computer Science, Software Engineering, Data Science, AI, Cybersecurity, Games',
        content: [
            'Computer Systems - architecture, software, data exchange, data types, legal/ethical issues',
            'Algorithms and Programming - problem-solving, data structures, OOP, computational methods',
            'Programming Project - substantial project demonstrating analysis, design, implementation, testing'
        ],
        assessment: 'Paper 1: Computer Systems (2hr 30min, 40%) | Paper 2: Algorithms and Programming (2hr 30min, 40%) | NEA: Programming Project (20%)',
        whyStudy: 'Computer Science is one of the most in-demand skills globally. A Level Maths strongly recommended alongside for university applications.'
    },
    'Art': {
        icon: 'ART',
        board: 'Edexcel',
        summary: 'Drawing, painting, printmaking and mixed media. Portfolio-based assessment develops creativity.',
        grade: 'Grade 6+ in GCSE Art or strong portfolio. Genuine passion for art essential.',
        pathways: 'Fine Art, Illustration, Animation, Architecture, Fashion, Interior Design, Art Therapy',
        content: [
            'Drawing and painting - observational work, mark-making, colour theory, composition',
            'Printmaking - relief, intaglio, screen printing techniques',
            'Mixed media - collage, assemblage, installation',
            'Contextual studies - historical and contemporary art movements',
            'Personal Investigation - extended project on theme of personal interest'
        ],
        assessment: 'Component 1: Personal Investigation with written element (60%) | Component 2: Externally Set Assignment with 15-hour exam (40%)',
        whyStudy: 'Art develops creative thinking and visual communication skills. Assessment based on four objectives: developing ideas, exploring media, recording, presenting.'
    },
    'Design Technology': {
        icon: 'DT',
        board: 'Edexcel',
        summary: 'Product design, architecture and 3D materials. Combines creativity with practical skills.',
        grade: 'Grade 6+ in GCSE Art or Design Technology. Interest in 3D design essential.',
        pathways: 'Architecture, Product Design, Interior Design, Industrial Design, Set Design',
        content: [
            '3D Studies - working with resistant materials, ceramics, glass, plastics, metal',
            'Product Design - design process, prototyping, manufacturing methods',
            'Architecture - space, form, structure, environmental considerations',
            'Contextual Studies - design movements, contemporary designers, sustainability'
        ],
        assessment: 'Component 1: Personal Investigation with written element (60%) | Component 2: Externally Set Assignment with 15-hour exam (40%)',
        whyStudy: 'DT 3D develops practical design skills valued in architecture and product design. Great for students who like making things.'
    },
    'Drama': {
        icon: 'DRA',
        board: 'Edexcel',
        summary: 'Performance, directing and theatre analysis. Builds confidence, creativity and collaboration.',
        grade: 'Grade 6+ in GCSE Drama preferred. Passion for theatre and willingness to perform essential.',
        pathways: 'Drama, Acting, Directing, Stage Management, Arts Administration, Teaching, Media',
        content: [
            'Theatre Makers in Practice - study of two set plays, practitioners\' techniques',
            'Devised Theatre - creating original performance work',
            'Text in Performance - monologue/duologue or group performance',
            'Live Theatre Evaluation - analysis of professional productions'
        ],
        assessment: 'Component 1: Devising with portfolio (40%) | Component 2: Text in Performance (20%) | Component 3: Theatre Makers in Practice exam (40%)',
        whyStudy: 'Drama develops confidence, communication and teamwork skills valued in all careers. Excellent for law, teaching, and any public-facing role.'
    },
    'Music': {
        icon: 'MUS',
        board: 'Edexcel',
        summary: 'Performance, composition and musical analysis. For committed musicians.',
        grade: 'Grade 5 Theory AND Grade 5+ Performance essential. Working towards Grade 7 by Year 12.',
        pathways: 'Music Performance, Composition, Music Production, Music Technology, Teaching',
        content: [
            'Performing - solo performance at Grade 7+ standard (minimum 8 minutes)',
            'Composing - one to a brief, one free composition (total 4-6 minutes)',
            'Appraising - set works from six areas: Vocal, Instrumental, Film, Popular/Jazz, Fusions, New Directions'
        ],
        assessment: 'Component 1: Performing recorded recital (30%) | Component 2: Two compositions (30%) | Component 3: Appraising exam 2hr 30min (40%)',
        whyStudy: 'Music develops discipline, creativity, and academic rigour. Students should be committed to regular practice and performance.'
    },
    'French': {
        icon: 'FR',
        board: 'AQA',
        summary: 'Language, literature and contemporary French society. Develops fluency and cultural understanding.',
        grade: 'Grade 7+ in GCSE French. Genuine enthusiasm for the language and culture essential.',
        pathways: 'Modern Languages, Translation, International Business, Diplomacy, Journalism, Teaching',
        content: [
            'Social Issues and Trends - family, cyber society, voluntary work, cultural heritage',
            'Political and Artistic Culture - music, media, festivals, immigration, terrorism',
            'Literature/Film - critical analysis of one book and one film',
            'Independent Research - project on topic related to French-speaking country'
        ],
        assessment: 'Paper 1: Listening, Reading, Translation (2hr 30min, 50%) | Paper 2: Writing on book and film (2hr, 20%) | Paper 3: Speaking (21-23min, 30%)',
        whyStudy: 'French opens doors to careers in international business, diplomacy, and translation. Languages demonstrate commitment and cultural awareness.'
    },
    'Spanish': {
        icon: 'ES',
        board: 'AQA',
        summary: 'The world\'s second most spoken language. Opens opportunities across 20+ countries.',
        grade: 'Grade 7+ in GCSE Spanish. Commitment to independent study and immersion essential.',
        pathways: 'Modern Languages, International Business, NGO work in Latin America, Journalism, Law',
        content: [
            'Social Issues and Trends - modern and traditional values, cyberspace, equal rights',
            'Political and Artistic Culture - Hispanic culture, Civil War, modern Spain, immigration',
            'Literature/Film - one book and one film from Spanish-speaking world',
            'Independent Research - project on topic related to Spanish-speaking country'
        ],
        assessment: 'Paper 1: Listening, Reading, Translation (2hr 30min, 50%) | Paper 2: Writing (2hr, 20%) | Paper 3: Speaking (21-23min, 30%)',
        whyStudy: 'Spanish is spoken by 500 million people. Opens doors to careers across Latin America and Spain, in business, development, and international organisations.'
    },
    'Religious Studies': {
        icon: 'RS',
        board: 'OCR',
        summary: 'Philosophy of religion and ethics. Develops critical thinking and ethical reasoning.',
        grade: 'Grade 6+ in GCSE Religious Studies or equivalent essay subject. Open mind essential.',
        pathways: 'Philosophy, Theology, Law, Politics, Social Work, Teaching, Ministry, Charity',
        content: [
            'Philosophy of Religion - arguments for God\'s existence, problem of evil, religious language, miracles',
            'Ethics - Natural Law, Situation Ethics, Kantian Ethics, Utilitarianism, applied ethics',
            'Developments in Religious Thought - Christianity and ethics, gender, secularisation, pluralism'
        ],
        assessment: 'Paper 1: Philosophy of Religion (2hr, 33.3%) | Paper 2: Ethics (2hr, 33.3%) | Paper 3: Developments in Religious Thought (2hr, 33.3%)',
        whyStudy: 'RS develops ability to analyse arguments and construct reasoned cases - skills essential for law and valued in any career requiring critical thinking.'
    },
    'Classical Civilisation': {
        icon: 'CLAS',
        board: 'OCR',
        summary: 'Greek and Roman literature, history and philosophy. All texts studied in English translation.',
        grade: 'Grade 6+ in GCSE English Literature or History. Interest in ancient world essential.',
        pathways: 'Classics, Ancient History, Archaeology, Law, Politics, Philosophy, Heritage',
        content: [
            'The World of the Hero - Homer\'s Odyssey and Virgil\'s Aeneid, epic poetry, heroism, fate',
            'Culture and the Arts - Greek Theatre, tragedy and comedy, theatrical conventions',
            'Beliefs and Ideas - Love and Relationships, poetry of Sappho, Ovid'
        ],
        assessment: 'Paper 1: World of the Hero (2hr 20min, 40%) | Paper 2: Culture and the Arts (1hr 45min, 30%) | Paper 3: Beliefs and Ideas (1hr 45min, 30%)',
        whyStudy: 'Classical Civilisation provides insight into the foundations of Western culture. No knowledge of Latin or Greek required - all texts in English.'
    },
    'Latin': {
        icon: 'LAT',
        board: 'OCR',
        summary: 'Language, literature and Roman civilisation. Develops rigorous analytical skills.',
        grade: 'Grade 7+ in GCSE Latin. Strong grammatical understanding essential.',
        pathways: 'Classics, Ancient History, Law, Medicine, Linguistics, Teaching, Academia',
        content: [
            'Language - unseen translation Latin to English, comprehension, English to Latin',
            'Prose Literature - set texts e.g., Tacitus, Cicero',
            'Verse Literature - set texts e.g., Virgil\'s Aeneid, Ovid\'s Metamorphoses'
        ],
        assessment: 'Paper 1: Unseen Translation (1hr 45min, 33%) | Paper 2: Prose Literature (2hr, 33%) | Paper 3: Verse Literature (2hr, 33%)',
        whyStudy: 'Latin is highly valued by Oxford and Cambridge for all courses. Demonstrates rigorous analytical thinking and linguistic precision.'
    },
    'PE': {
        icon: 'PE',
        board: 'AQA',
        summary: 'Sports science, anatomy and practical performance. Theory and practical combined.',
        grade: 'Grade 6+ in GCSE Science. Active participation in sport essential.',
        pathways: 'Sports Science, Physiotherapy, Coaching, Teaching PE, Sports Management',
        content: [
            'Applied anatomy and physiology - skeletal, muscular, cardiovascular systems',
            'Skill acquisition - learning, memory, feedback',
            'Sport and society - development of sport, ethics',
            'Exercise physiology and biomechanics',
            'Practical performance in chosen sport'
        ],
        assessment: 'Paper 1: Factors affecting participation (2hr, 35%) | Paper 2: Factors affecting optimal performance (2hr, 35%) | NEA: Practical performance and analysis (30%)',
        whyStudy: 'PE combines academic study with practical sport. Good for students who want to understand the science behind athletic performance.'
    },
    'Politics': {
        icon: 'POL',
        board: 'Edexcel',
        summary: 'UK and global politics, political ideologies and theories. Understanding how power works.',
        grade: 'Grade 6+ in essay-based subject. Interest in current affairs essential.',
        pathways: 'Politics, PPE, Law, Journalism, Civil Service, International Relations, NGOs',
        content: [
            'UK Politics - democracy, political parties, electoral systems, voting behaviour',
            'UK Government - constitution, parliament, PM and executive, judiciary',
            'Political Ideas - liberalism, conservatism, socialism',
            'Global Politics - sovereignty, globalisation, human rights, power, conflict'
        ],
        assessment: 'Paper 1: UK Politics (2hr, 33.3%) | Paper 2: UK Government and core political ideas (2hr, 33.3%) | Paper 3: Comparative Politics (2hr, 33.3%)',
        whyStudy: 'Politics provides understanding of how decisions are made that affect everyone. Excellent preparation for law, journalism, and public service.'
    },
    'Sciences': {
        icon: 'SCI',
        board: 'Various',
        summary: 'Biology, Chemistry or Physics - foundational for many careers in science and medicine.',
        grade: 'Grade 7+ in relevant GCSE Science',
        pathways: 'Medicine, Engineering, Research, Science careers',
        content: ['See individual subject entries for Biology, Chemistry, and Physics'],
        assessment: 'See individual subject entries',
        whyStudy: 'Sciences are essential for medical and engineering careers. See individual subject entries for full details.'
    },
    'Languages': {
        icon: 'LANG',
        board: 'AQA',
        summary: 'French, Spanish or other modern languages for global careers and cultural understanding.',
        grade: 'Grade 7+ in GCSE language',
        pathways: 'International Business, Diplomacy, Translation, Journalism',
        content: ['See individual subject entries for French and Spanish'],
        assessment: 'See individual subject entries',
        whyStudy: 'Languages open international career opportunities. See individual subject entries for full details.'
    }
};

/**
 * GCSE Subject data - comprehensive info from GCSE Course Guide 2025
 */
const gcseSubjectData = {
    'English Language': {
        icon: 'ENG',
        board: 'AQA (8700)',
        summary: 'Develop reading, writing, speaking and listening skills through literature, non-fiction and media texts.',
        grade: 'Core subject - all pupils',
        pathways: 'All careers - essential qualification',
        content: [
            'Reading comprehension and analysis of literary and non-fiction texts',
            'Creative and transactional writing',
            'Spoken language endorsement',
            'Critical reading and comparison',
            'Writing for different purposes and audiences'
        ],
        assessment: 'Paper 1: Explorations in Creative Reading & Writing (1hr 45min, 50%) | Paper 2: Writers\' Viewpoints & Perspectives (1hr 45min, 50%) | Spoken Language separately endorsed',
        whyStudy: 'English Language is essential for all future pathways. Strong communication skills are valued by every employer and required for all university courses.'
    },
    'English Literature': {
        icon: 'LIT',
        board: 'AQA (8702)',
        summary: 'Study poetry, prose and drama to develop analytical skills and appreciation of literary heritage.',
        grade: 'Core subject - all pupils',
        pathways: 'All careers - develops critical thinking',
        content: [
            'Shakespeare play study',
            '19th-century novel',
            'Modern prose or drama text',
            'Poetry anthology',
            'Unseen poetry analysis'
        ],
        assessment: 'Paper 1: Shakespeare & 19th-century Novel (1hr 45min, 40%) | Paper 2: Modern Texts & Poetry (2hr 15min, 60%)',
        whyStudy: 'Literature develops sophisticated analytical skills. Understanding human nature through texts is invaluable preparation for life and many careers.'
    },
    'Mathematics': {
        icon: 'MATH',
        board: 'Edexcel (1MA1)',
        summary: 'Build strong foundations in number, algebra, geometry, probability and statistics.',
        grade: 'Core subject - all pupils. Higher tier: grades 9-4. Foundation tier: grades 5-1.',
        pathways: 'All STEM careers, Finance, Business, any analytical field',
        content: [
            'Number - fractions, percentages, ratio, proportion',
            'Algebra - equations, graphs, sequences, functions',
            'Geometry - shapes, angles, area, volume, trigonometry',
            'Probability and Statistics - data handling, averages, probability',
            'Ratio, proportion and rates of change'
        ],
        assessment: 'Three papers each 1hr 30min: Paper 1 (non-calculator), Papers 2&3 (calculator). Each 33.3%.',
        whyStudy: 'Mathematics is essential for science, engineering, medicine and business. Problem-solving and logical reasoning skills are valued across all professions.'
    },
    'Biology': {
        icon: 'BIO',
        board: 'AQA (8461)',
        summary: 'Explore living organisms from cells to ecosystems. Essential foundation for A Level Biology and medicine.',
        grade: 'Recommended for science/medicine pathway. Required for A Level Biology.',
        pathways: 'Medicine, Veterinary, Biology, Environmental Science, Healthcare',
        content: [
            'Cell biology - structure, division, transport',
            'Organisation - cells, tissues, organs, systems',
            'Infection and response - pathogens, immune system',
            'Bioenergetics - photosynthesis, respiration',
            'Homeostasis and response - nervous and hormonal systems',
            'Inheritance, variation and evolution',
            'Ecology - ecosystems, biodiversity'
        ],
        assessment: 'Paper 1: Topics 1-4 (1hr 45min, 50%) | Paper 2: Topics 5-7 (1hr 45min, 50%) | 10 required practicals',
        whyStudy: 'Biology provides essential understanding of life for medicine and healthcare careers. Taking all three sciences at GCSE is strongly recommended for Sixth Form science.'
    },
    'Chemistry': {
        icon: 'CHEM',
        board: 'AQA (8462)',
        summary: 'The central science bridging physics and biology. Essential for medicine, pharmacy and engineering.',
        grade: 'Recommended for science pathway. Required for A Level Biology in Sixth Form.',
        pathways: 'Medicine, Pharmacy, Engineering, Materials Science, Environmental Science',
        content: [
            'Atomic structure and the periodic table',
            'Bonding, structure and properties of matter',
            'Quantitative chemistry - moles, calculations',
            'Chemical changes - reactions, acids, electrolysis',
            'Energy changes',
            'Rate and extent of chemical change',
            'Organic chemistry',
            'Chemical analysis',
            'Chemistry of the atmosphere',
            'Using resources'
        ],
        assessment: 'Paper 1: Topics 1-5 (1hr 45min, 50%) | Paper 2: Topics 6-10 (1hr 45min, 50%)',
        whyStudy: 'Chemistry is essential for medicine, dentistry and veterinary science. Understanding chemical principles develops logical thinking valued across all fields.'
    },
    'Physics': {
        icon: 'PHY',
        board: 'AQA (8463)',
        summary: 'Fundamental understanding of forces, energy, waves and the universe. Foundation for engineering.',
        grade: 'Recommended for engineering/science pathway. Beneficial for A Level Biology.',
        pathways: 'Engineering, Physics, Architecture, Aviation, Technology',
        content: [
            'Forces - motion, pressure, moments',
            'Energy - conservation, transfer, efficiency',
            'Waves - properties, light, sound',
            'Electricity - circuits, resistance, power',
            'Magnetism and electromagnetism',
            'Particle model of matter',
            'Atomic structure and space physics'
        ],
        assessment: 'Paper 1: Topics 1-4 (1hr 45min, 50%) | Paper 2: Topics 5-7 (1hr 45min, 50%) | 10 required practicals',
        whyStudy: 'Physics provides fundamental understanding of how the universe works. Essential for all engineering disciplines and highly valued by universities.'
    },
    'French': {
        icon: 'FRE',
        board: 'AQA (8658)',
        summary: 'Develop practical communication skills in speaking, listening, reading and writing.',
        grade: 'Modern language required. Foundation or Higher tier available.',
        pathways: 'International Business, Diplomacy, Translation, Tourism, Global Careers',
        content: [
            'Me, My Family and Friends',
            'Technology in Everyday Life',
            'Free Time',
            'Home and Local Area, Environment and Social Issues',
            'School and Future Plans'
        ],
        assessment: 'Paper 1: Listening (25%) | Paper 2: Speaking (25%) | Paper 3: Reading (25%) | Paper 4: Writing (25%)',
        whyStudy: 'French opens doors to further studies at A Level or SQA Higher Grade. Even if not continued beyond GCSE, the skills learned are invaluable for life.'
    },
    'Spanish': {
        icon: 'SPA',
        board: 'AQA (8698)',
        summary: 'Learn one of the world\'s most spoken languages through practical communication skills.',
        grade: 'Modern language option. Foundation or Higher tier available.',
        pathways: 'International Business, Global Trade, Tourism, Translation, Diplomacy',
        content: [
            'Holidays, home town, leisure, school',
            'Family and friends',
            'Future plans and work',
            'Social issues and environment',
            'Grammar and vocabulary development'
        ],
        assessment: 'Paper 1: Listening (25%) | Paper 2: Speaking (25%) | Paper 3: Reading (25%) | Paper 4: Writing (25%)',
        whyStudy: 'Spanish is spoken by over 500 million people worldwide. An excellent foundation for A Level or SQA Higher and increasingly important in global business.'
    },
    'History': {
        icon: 'HIST',
        board: 'Edexcel (1HI0)',
        summary: 'Engage with Britain and wider world history, developing analytical and evaluation skills.',
        grade: 'Humanities option. Open to all pupils.',
        pathways: 'Law, Politics, Journalism, Teaching, Research, Public Service',
        content: [
            'Crime and Punishment in Britain c1000-present & Whitechapel c1870-1900',
            'Superpower Relations and the Cold War 1941-91',
            'Early Elizabethan England 1558-88',
            'Weimar and Nazi Germany 1918-39'
        ],
        assessment: 'Paper 1: Thematic Study (30%) | Paper 2: Period & Depth Study (40%) | Paper 3: Modern Depth Study (30%)',
        whyStudy: 'History develops skills in analysis, evaluation and constructing arguments. These are essential for law, journalism and many other careers.'
    },
    'Geography': {
        icon: 'GEO',
        board: 'AQA (8035)',
        summary: 'Study physical and human geography with emphasis on contemporary global issues.',
        grade: 'Humanities option. Open to all pupils.',
        pathways: 'Environmental Science, Urban Planning, International Development, Business',
        content: [
            'Natural hazards - tectonics, weather, climate change',
            'Living world - ecosystems, rainforests, deserts',
            'Physical landscapes - coasts, rivers, glacial',
            'Urban issues and challenges',
            'Changing economic world - development, UK economy',
            'Resource management - food, water, energy',
            'Fieldwork enquiries'
        ],
        assessment: 'Paper 1: Physical (35%) | Paper 2: Human (35%) | Paper 3: Geographical Applications (30%)',
        whyStudy: 'Geography develops understanding of our changing world. Fieldwork skills and awareness of global issues are valued across many career paths.'
    },
    'Art': {
        icon: 'ART',
        board: 'Edexcel (1AD0)',
        summary: 'Develop technical skills and visual literacy through drawing, painting, textiles and 3D work.',
        grade: 'Creative option. Strong portfolio of work required for A Level.',
        pathways: 'Architecture, Fine Art, Graphic Design, Fashion, Animation, Interior Design',
        content: [
            'Drawing, printing, painting, textiles and 3D work',
            'Coursework portfolio - 60% of GCSE',
            'Externally set examination - 40% of GCSE',
            'Contextual study of other artists',
            'Development of personal creative response'
        ],
        assessment: 'Component 1: Portfolio (60%, 45 marks) | Component 2: Externally Set Assignment (40%, 10hr exam)',
        whyStudy: 'Art is pre-requisite for A Level Art & Design. Most creative arts degrees and architecture courses require Art A Level or a strong portfolio.'
    },
    'Business Studies': {
        icon: 'BUS',
        board: 'Edexcel (1BS0)',
        summary: 'Understand how businesses start, grow and make decisions in a competitive marketplace.',
        grade: 'Optional subject. Good level of written English and numeracy required.',
        pathways: 'Business, Entrepreneurship, Marketing, Finance, Management',
        content: [
            'Theme 1: Enterprise and entrepreneurship',
            'Spotting business opportunities',
            'Making the business effective',
            'External influences on business',
            'Theme 2: Growing the business',
            'Marketing, operations, finance and HR decisions'
        ],
        assessment: 'Paper 1: Theme 1 (1hr 30min, 50%) | Paper 2: Theme 2 (1hr 30min, 50%)',
        whyStudy: 'Business Studies provides understanding of how organisations work. Valuable for any career and essential for aspiring entrepreneurs.'
    },
    'Computer Science': {
        icon: 'CS',
        board: 'OCR (J277)',
        summary: 'Understand how computers work and develop programming skills through problem-solving.',
        grade: 'Optional subject. Good logical thinking and maths skills helpful.',
        pathways: 'Software Development, Cybersecurity, Data Science, Game Development, AI',
        content: [
            'Computer systems - hardware, software, networks',
            'Computational thinking, algorithms and programming',
            'Programming project - develop a software solution',
            'Systems architecture',
            'Data representation and storage'
        ],
        assessment: 'Paper 1: Computer Systems (1hr 30min, 50%) | Paper 2: Computational Thinking (1hr 30min, 50%) | Programming project (mandatory but unassessed)',
        whyStudy: 'Computer Science is highly valued on a CV. Develops critical thinking and problem-solving skills essential for the digital age.'
    },
    'Design Technology': {
        icon: 'DT',
        board: 'Cambridge IGCSE (0979)',
        summary: 'Design and make products using specialist equipment including CAD/CAM, CNC and 3D printing.',
        grade: 'Optional subject. Practical skills and creative thinking valued.',
        pathways: 'Product Design, Engineering, Architecture, Manufacturing',
        content: [
            'Product design principles and evaluation',
            'Resistant materials and manufacturing techniques',
            'CAD/CAM, CNC machining and 3D printing',
            'Non-Examined Assessment (NEA) project - 50%',
            'Design papers covering theory and practice'
        ],
        assessment: 'Paper 1: Product Design (25%) | Paper 2: Resistant Materials (25%) | NEA Project (50%, 30-35hrs)',
        whyStudy: 'Design Technology provides excellent preparation for A Level and university. Develops creative problem-solving and practical skills valued in engineering.'
    },
    'Drama': {
        icon: 'DRA',
        board: 'AQA',
        summary: 'Develop performance and design skills through practical and theoretical study of theatre.',
        grade: 'Optional subject. Confidence and teamwork important.',
        pathways: 'Theatre, Film, Media, Teaching, Law, Public Speaking',
        content: [
            'Understanding drama - study of The Crucible by Arthur Miller',
            'Analysis and evaluation of live theatre',
            'Devising theatre - create original performance (40%)',
            'Performing from a published text (20%)',
            'Written examination (40%)'
        ],
        assessment: 'Component 1: Understanding Drama (40%) | Component 2: Devised Performance (40%) | Component 3: Text in Practice (20%)',
        whyStudy: 'Drama develops creativity, confidence and communication skills increasingly valued in a world where AI emphasises human connection.'
    },
    'Latin': {
        icon: 'LAT',
        board: 'OCR (J282)',
        summary: 'Study the language and literature of ancient Rome, developing analytical skills.',
        grade: 'Optional subject. Previous study in Third Form required.',
        pathways: 'Law, Medicine, Classics, Languages, Academia',
        content: [
            'Latin language - grammar, translation, comprehension',
            'Set text study - prose and verse from Roman authors',
            'Roman civilisation and historical context',
            'Three papers, no coursework'
        ],
        assessment: 'Paper 1: Language (33%) | Paper 2: Prose Literature (33%) | Paper 3: Verse Literature (33%)',
        whyStudy: 'Latin aids understanding of complex language in other subjects, especially in Sixth Form. Develops rigorous analytical skills valued by top universities.'
    },
    'Music': {
        icon: 'MUS',
        board: 'WJEC Eduqas',
        summary: 'Develop performing, composing and appraising skills across different musical styles.',
        grade: 'Optional subject. Grade 3+ instrumental/vocal standard recommended.',
        pathways: 'Music, Music Production, Composition, Teaching, Music Therapy',
        content: [
            'Performing - minimum 4-6 minutes of performance',
            'Composing - two compositions (3-6 minutes total)',
            'Appraising - listening examination',
            'Areas of study: Musical forms, Ensembles, Film music, Popular music'
        ],
        assessment: 'Component 1: Performing (30%) | Component 2: Composing (30%) | Component 3: Appraising (40%)',
        whyStudy: 'Music demonstrates dedication and communication skills. A valuable qualification that can support applications to study a range of subjects.'
    },
    'Physical Education': {
        icon: 'PE',
        board: 'AQA (8582)',
        summary: 'Study sport science theory combined with practical performance assessment.',
        grade: 'Optional subject. Active participation in sport required.',
        pathways: 'Sports Science, Physiotherapy, Coaching, Sports Management, Healthcare',
        content: [
            'Applied anatomy and physiology',
            'Movement analysis',
            'Physical training',
            'Sports psychology',
            'Socio-cultural influences',
            'Health, fitness and well-being',
            'Practical performance in three activities'
        ],
        assessment: 'Paper 1: Human Body in Sport (30%) | Paper 2: Socio-cultural Influences (30%) | NEA: Practical Performance (40%)',
        whyStudy: 'GCSE PE develops understanding of how the body works. Practical participation is compulsory and essential to pass the course.'
    },
    'Religious Studies': {
        icon: 'RS',
        board: 'Edexcel (1RB0 WM)',
        summary: 'Explore ethical issues and religious beliefs through study of Judaism and Christianity.',
        grade: 'Optional subject. Open to pupils of all faiths and none.',
        pathways: 'Law, Philosophy, Ethics, Social Work, Journalism, Teaching',
        content: [
            'Judaism and Ethics - marriage, family, life and death',
            'Jewish beliefs and practices',
            'Christianity, Peace and Conflict',
            'Crime and punishment, justice, forgiveness',
            'Visits to synagogues in Glasgow'
        ],
        assessment: 'Paper 1: Judaism and Ethics (50%) | Paper 2: Christianity, Peace and Conflict (50%)',
        whyStudy: 'Religious Studies develops understanding of different viewpoints and ethical reasoning. Gateway to studying ethics and philosophy at higher levels.'
    },
    'ESL': {
        icon: 'ESL',
        board: 'Cambridge IGCSE (0991)',
        summary: 'For pupils whose native language is not English - internationally recognised qualification.',
        grade: 'For EAL pupils. Does not expire like IELTS.',
        pathways: 'All careers - English proficiency required',
        content: [
            'Reading and writing skills',
            'Listening comprehension',
            'Speaking assessment',
            'Focus on practical/everyday English',
            'Academic vocabulary development'
        ],
        assessment: 'Reading & Writing (50%, 2hr) | Listening (25%, 50min) | Speaking (25%, 15min)',
        whyStudy: 'An IGCSE ESL grade is equivalent to one grade lower than native-English GCSE for university purposes. Builds on skills for success in all subjects.'
    }
};

/**
 * Populate dynamic subject cards based on career pathway
 */
function populateSubjectCards() {
    const recommendations = prospectusData?.personalisation?.subject_recommendations;
    if (!recommendations) return;

    const essentialSection = document.getElementById('essentialSubjectsSection');
    const recommendedSection = document.getElementById('recommendedSubjectsSection');
    const optionalSection = document.getElementById('optionalSubjectsSection');

    const essentialCards = document.getElementById('essentialSubjectsCards');
    const recommendedCards = document.getElementById('recommendedSubjectsCards');
    const optionalCards = document.getElementById('optionalSubjectsCards');

    if (!essentialCards || !recommendedCards || !optionalCards) return;

    // Clear existing cards
    essentialCards.innerHTML = '';
    recommendedCards.innerHTML = '';
    optionalCards.innerHTML = '';

    // Populate essential subjects
    if (recommendations.essential && recommendations.essential.length > 0) {
        essentialSection.style.display = 'block';
        recommendations.essential.forEach(subject => {
            essentialCards.appendChild(createSubjectCard(subject));
        });
    }

    // Populate recommended subjects
    if (recommendations.recommended && recommendations.recommended.length > 0) {
        recommendedSection.style.display = 'block';
        recommendations.recommended.forEach(subject => {
            recommendedCards.appendChild(createSubjectCard(subject));
        });
    }

    // Populate optional subjects
    if (recommendations.optional && recommendations.optional.length > 0) {
        optionalSection.style.display = 'block';
        recommendations.optional.forEach(subject => {
            optionalCards.appendChild(createSubjectCard(subject));
        });
    }
}

/**
 * Create a subject card element with full details
 */
function createSubjectCard(subjectName) {
    const data = subjectData[subjectName] || {
        icon: subjectName.substring(0, 3).toUpperCase(),
        board: 'Various',
        summary: 'A valuable A Level subject for this pathway.',
        grade: 'See course guide',
        pathways: 'Various careers',
        content: [],
        assessment: 'See course guide',
        whyStudy: ''
    };

    // Build content list HTML
    let contentHtml = '';
    if (data.content && data.content.length > 0) {
        contentHtml = '<ul>' + data.content.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.onclick = function() { toggleSubjectCard(this); };

    card.innerHTML = `
        <div class="subject-card__header">
            <div class="subject-card__icon">${data.icon}</div>
            <div>
                <h4 class="subject-card__title">${subjectName}</h4>
                <p class="subject-card__board">${data.board}</p>
            </div>
        </div>
        <p class="subject-card__summary">${data.summary}</p>
        <div class="subject-card__footer">
            <span class="subject-card__grade">${data.grade}</span>
            <span class="subject-card__expand">+ Click to expand</span>
        </div>
        <div class="subject-card__details">
            ${data.whyStudy ? `<div class="subject-card__why"><strong>Why study ${subjectName}?</strong><p>${data.whyStudy}</p></div>` : ''}

            ${contentHtml ? `<div class="subject-card__content"><h5>Course Content</h5>${contentHtml}</div>` : ''}

            ${data.assessment ? `<div class="subject-card__assessment"><h5>Assessment</h5><p>${data.assessment}</p></div>` : ''}

            <div class="subject-card__pathways"><h5>Career Pathways</h5><p>${data.pathways}</p></div>
        </div>
    `;

    return card;
}

/**
 * Populate GCSE subject cards based on interests
 */
function populateGCSESubjectCards() {
    // Core subjects everyone takes
    const coreSubjects = ['English Language', 'English Literature', 'Mathematics'];

    // Get career areas from personalisation data to determine recommended subjects
    const careerAreas = prospectusData?.personalisation?.career_areas || [];
    const interests = prospectusData?.personalisation?.interests || [];

    // Build recommended subjects based on career areas
    let recommendedSubjects = [];
    let optionalSubjects = [];

    // Map career areas to recommended GCSE subjects
    const careerSubjectMap = {
        'medicine': ['Biology', 'Chemistry', 'Physics'],
        'engineering': ['Physics', 'Chemistry', 'Design Technology', 'Computer Science'],
        'science': ['Biology', 'Chemistry', 'Physics', 'Computer Science'],
        'business': ['Business Studies', 'Geography', 'Computer Science'],
        'law': ['History', 'Latin', 'Religious Studies'],
        'arts': ['Art', 'Drama', 'Music'],
        'humanities': ['History', 'Geography', 'Religious Studies'],
        'technology': ['Computer Science', 'Design Technology', 'Physics'],
        'languages': ['French', 'Spanish', 'Latin'],
        'sports': ['Physical Education', 'Biology']
    };

    // Build recommended list from career areas
    careerAreas.forEach(career => {
        const subjects = careerSubjectMap[career.toLowerCase()] || [];
        subjects.forEach(subject => {
            if (!recommendedSubjects.includes(subject) && !coreSubjects.includes(subject)) {
                recommendedSubjects.push(subject);
            }
        });
    });

    // If no career areas selected, recommend sciences and humanities
    if (recommendedSubjects.length === 0) {
        recommendedSubjects = ['Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'French'];
    }

    // All other GCSE subjects go to optional
    const allGCSESubjects = Object.keys(gcseSubjectData);
    allGCSESubjects.forEach(subject => {
        if (!coreSubjects.includes(subject) &&
            !recommendedSubjects.includes(subject) &&
            subject !== 'ESL') {
            optionalSubjects.push(subject);
        }
    });

    // Get DOM elements
    const coreSection = document.getElementById('gcseCoreSectionSubjects');
    const recommendedSection = document.getElementById('gcseRecommendedSubjectsSection');
    const optionalSection = document.getElementById('gcseOptionalSubjectsSection');

    const coreCards = document.getElementById('gcseCoreSubjectsCards');
    const recommendedCards = document.getElementById('gcseRecommendedSubjectsCards');
    const optionalCards = document.getElementById('gcseOptionalSubjectsCards');

    if (!coreCards || !recommendedCards || !optionalCards) return;

    // Clear existing cards
    coreCards.innerHTML = '';
    recommendedCards.innerHTML = '';
    optionalCards.innerHTML = '';

    // Populate core subjects
    if (coreSubjects.length > 0) {
        coreSection.style.display = 'block';
        coreSubjects.forEach(subject => {
            coreCards.appendChild(createGCSESubjectCard(subject));
        });
    }

    // Populate recommended subjects
    if (recommendedSubjects.length > 0) {
        recommendedSection.style.display = 'block';
        recommendedSubjects.forEach(subject => {
            recommendedCards.appendChild(createGCSESubjectCard(subject));
        });
    }

    // Populate optional subjects
    if (optionalSubjects.length > 0) {
        optionalSection.style.display = 'block';
        optionalSubjects.forEach(subject => {
            optionalCards.appendChild(createGCSESubjectCard(subject));
        });
    }
}

/**
 * Create a GCSE subject card element with full details
 */
function createGCSESubjectCard(subjectName) {
    const data = gcseSubjectData[subjectName] || {
        icon: subjectName.substring(0, 3).toUpperCase(),
        board: 'Various',
        summary: 'A valuable GCSE subject.',
        grade: 'See course guide',
        pathways: 'Various careers',
        content: [],
        assessment: 'See course guide',
        whyStudy: ''
    };

    // Build content list HTML
    let contentHtml = '';
    if (data.content && data.content.length > 0) {
        contentHtml = '<ul>' + data.content.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.onclick = function() { toggleSubjectCard(this); };

    card.innerHTML = `
        <div class="subject-card__header">
            <div class="subject-card__icon">${data.icon}</div>
            <div>
                <h4 class="subject-card__title">${subjectName}</h4>
                <p class="subject-card__board">${data.board}</p>
            </div>
        </div>
        <p class="subject-card__summary">${data.summary}</p>
        <div class="subject-card__footer">
            <span class="subject-card__grade">${data.grade}</span>
            <span class="subject-card__expand">+ Click to expand</span>
        </div>
        <div class="subject-card__details">
            ${data.whyStudy ? `<div class="subject-card__why"><strong>Why study ${subjectName}?</strong><p>${data.whyStudy}</p></div>` : ''}

            ${contentHtml ? `<div class="subject-card__content"><h5>Course Content</h5>${contentHtml}</div>` : ''}

            ${data.assessment ? `<div class="subject-card__assessment"><h5>Assessment</h5><p>${data.assessment}</p></div>` : ''}

            <div class="subject-card__pathways"><h5>Career Pathways</h5><p>${data.pathways}</p></div>
        </div>
    `;

    return card;
}

// ==========================================================================
// PROSPECTUS NAVIGATION & COLLAPSIBLE SECTIONS
// ==========================================================================

/**
 * Initialize the prospectus navigation system
 */
function initializeProspectusNav() {
    const nav = document.getElementById('prospectusNav');
    const navList = document.getElementById('navList');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const toggleAllBtn = document.getElementById('toggleAllSections');
    const progressBar = document.getElementById('readingProgress');
    const welcomeSection = document.getElementById('welcome');

    if (!nav || !navList) return;

    // Create overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'navOverlay';
    document.body.appendChild(overlay);

    // Get all collapsible sections
    const sections = document.querySelectorAll('.collapsible-section[data-nav-title]');

    // Set up all collapsible sections
    sections.forEach((section, index) => {
        // Wrap section content for collapsible functionality
        wrapSectionContent(section);

        // Start all sections collapsed by default
        section.classList.add('collapsed');
    });

    // Populate navigation after a short delay to let modules hide/show
    setTimeout(() => {
        repopulateNav();
    }, 200);

    // Reading progress bar elements
    const readingProgressBar = document.getElementById('readingProgressBar');
    const readingProgressFill = document.getElementById('readingProgressFill');
    const readingPercentText = document.getElementById('readingPercentText');

    // Show/hide nav based on scroll position
    let lastScrollY = 0;
    const welcomeBottom = welcomeSection ? welcomeSection.offsetTop + welcomeSection.offsetHeight : 600;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Show side nav after scrolling past welcome section
        if (scrollY > welcomeBottom - 100) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }

        // Show reading progress bar after scrolling a bit
        if (readingProgressBar) {
            if (scrollY > 200) {
                readingProgressBar.classList.add('visible');
            } else {
                readingProgressBar.classList.remove('visible');
            }
        }

        // Update progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        const progressPercent = Math.min(Math.round(progress), 100);

        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }

        if (readingProgressFill) {
            readingProgressFill.style.width = `${progressPercent}%`;
        }

        if (readingPercentText) {
            readingPercentText.textContent = `${progressPercent}% read`;
        }

        // Highlight current section
        highlightCurrentSection();

        lastScrollY = scrollY;
    }

    // Highlight current section in nav
    function highlightCurrentSection() {
        const scrollY = window.scrollY + 200;
        let currentSection = null;

        sections.forEach(section => {
            if (section.style.display !== 'none') {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;

                if (scrollY >= top && scrollY < bottom) {
                    currentSection = section.id;
                }
            }
        });

        // Update nav links
        document.querySelectorAll('.prospectus-nav__link').forEach(link => {
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Smooth scroll to section when clicking nav link
    navList.addEventListener('click', (e) => {
        const link = e.target.closest('.prospectus-nav__link');
        if (link) {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);

            if (section) {
                const wasCollapsed = section.classList.contains('collapsed');

                // Toggle section open/closed
                toggleSection(section);

                // Only scroll to section if we're opening it
                if (wasCollapsed) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Close mobile nav
                closeMobileNav();
            }
        }
    });

    // Mobile nav toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');
            overlay.classList.toggle('visible');
        });
    }

    // Close mobile nav when clicking overlay
    overlay.addEventListener('click', closeMobileNav);

    function closeMobileNav() {
        nav.classList.remove('mobile-open');
        overlay.classList.remove('visible');
    }

    // Toggle all sections - start collapsed
    let allCollapsed = true;
    if (toggleAllBtn) {
        // Update button appearance based on state
        function updateToggleButton() {
            if (allCollapsed) {
                toggleAllBtn.title = 'Expand All Sections';
                toggleAllBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="7 13 12 18 17 13"/>
                    <polyline points="7 6 12 11 17 6"/>
                </svg>`;
            } else {
                toggleAllBtn.title = 'Collapse All Sections';
                toggleAllBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="17 11 12 6 7 11"/>
                    <polyline points="17 18 12 13 7 18"/>
                </svg>`;
            }
        }

        toggleAllBtn.addEventListener('click', () => {
            allCollapsed = !allCollapsed;
            sections.forEach(section => {
                if (allCollapsed) {
                    section.classList.add('collapsed');
                } else {
                    section.classList.remove('collapsed');
                }
            });
            updateToggleButton();
        });

        // Set initial state
        updateToggleButton();
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Re-populate nav when modules change visibility
    setTimeout(repopulateNav, 500);
}

/**
 * Wrap section content for collapsible functionality
 */
function wrapSectionContent(section) {
    const header = section.querySelector('.section-header');
    if (!header) return;

    // Get all content after the section-header
    const container = section.querySelector('.container');
    if (!container) return;

    const children = Array.from(container.children);
    const headerIndex = children.indexOf(header);

    if (headerIndex === -1) return;

    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'collapsible-section__content';

    // Move all elements after header into wrapper
    for (let i = headerIndex + 1; i < children.length; i++) {
        contentWrapper.appendChild(children[i]);
    }

    container.appendChild(contentWrapper);

    // Add click handler to header
    header.addEventListener('click', () => {
        toggleSection(section);
    });
}

/**
 * Toggle section collapsed state
 */
function toggleSection(section) {
    section.classList.toggle('collapsed');
}

/**
 * Update nav visibility based on visible sections
 */
function repopulateNav() {
    const navList = document.getElementById('navList');
    if (!navList) return;

    // Get all nav items
    const navItems = navList.querySelectorAll('.prospectus-nav__item');

    navItems.forEach(item => {
        const link = item.querySelector('.prospectus-nav__link');
        if (!link) return;

        const sectionId = link.getAttribute('data-section');
        const section = document.getElementById(sectionId);

        if (section) {
            // Check if section is hidden by module system or inline style
            const isHidden = section.classList.contains('module--hidden') ||
                           section.style.display === 'none' ||
                           window.getComputedStyle(section).display === 'none';

            item.style.display = isHidden ? 'none' : '';
        }
    });
}

// Initialize navigation after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing nav...');
    // Delay to ensure personalisation has been applied
    setTimeout(function() {
        console.log('Running initializeProspectusNav');
        initializeProspectusNav();
    }, 100);

    // Also run repopulateNav after longer delay as backup
    setTimeout(function() {
        console.log('Running backup repopulateNav');
        repopulateNav();
    }, 1000);
});

// Make functions available globally
window.toggleSound = toggleSound;
window.scrollToSection = scrollToSection;
window.toggleSubject = toggleSubject;
window.toggleSection = toggleSection;
window.repopulateNav = repopulateNav;
