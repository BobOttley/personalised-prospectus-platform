/**
 * CLC Personalisation Engine
 * Handles all personalisation logic for the prospectus
 */

// Global personalisation data
let prospectusData = null;

/**
 * Initialize personalisation on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    loadProspectusData();
    if (prospectusData) {
        applyPersonalisation();
        showRelevantModules();
        populateDynamicContent();
        setupScrollTracking();
    }
});

/**
 * Load prospectus data from localStorage or URL
 */
function loadProspectusData() {
    // Try to load from localStorage first
    const savedData = localStorage.getItem('clc_prospectus_data');

    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            // Validate data has required fields
            if (parsed && parsed.personalisation && Array.isArray(parsed.personalisation.modules_included)) {
                prospectusData = parsed;
                console.log('Loaded prospectus data:', prospectusData);
            } else {
                console.warn('Invalid prospectus data in localStorage, using demo');
                localStorage.removeItem('clc_prospectus_data');
                loadDemoData();
            }
        } catch (e) {
            console.error('Error parsing prospectus data:', e);
            localStorage.removeItem('clc_prospectus_data');
            loadDemoData();
        }
    } else {
        // Load demo data for testing
        loadDemoData();
    }
}

/**
 * Load demo data (Victoria Hamilton scenario)
 */
function loadDemoData() {
    prospectusData = {
        prospectus_id: 'hamilton-sophia-demo',
        generated_at: new Date().toISOString(),

        child: {
            first_name: 'Sophia',
            current_age: 15,
            current_school: "St Mary's School, London",
            entry_point: 'sixth_form',
            entry_year: '2025'
        },

        parent: {
            title: 'Mrs',
            first_name: 'Victoria',
            surname: 'Hamilton',
            email: 'victoria.hamilton@email.com',
            phone: '+852 1234 5678'
        },

        second_parent: null,

        interests: {
            academic: ['sciences', 'mathematics'],
            extracurricular: ['music', 'debating', 'sport'],
            selected_sports: ['netball', 'swimming', 'tennis'],
            details: 'She plays Grade 5 piano and is passionate about netball. She\'s also involved in the debating society.'
        },

        practical: {
            accommodation_type: 'boarding',
            family_location: 'international',
            scholarship_interest: true,
            scholarship_types: ['academic', 'music'],
            bursary_interest: false
        },

        futures: {
            career_areas: ['medicine_health'],
            career_details: 'Interested in medical research, particularly oncology',
            qualification_preference: 'undecided',
            university_aspiration: 'oxbridge'
        },

        personalisation: {
            modules_included: [
                'cover', 'welcome', 'why_clc', 'academic_excellence',
                'sixth_form', 'ib_programme', 'career_pathway',
                'boarding_life', 'pastoral_care', 'sport', 'music',
                'clubs_enrichment', 'scholarships', 'how_to_apply',
                'visit_us', 'location', 'next_steps'
            ],
            career_pathway: 'medicine_health',
            subject_recommendations: {
                essential: ['Biology', 'Chemistry'],
                recommended: ['Mathematics'],
                optional: ['Physics', 'Psychology']
            }
        },

        preferences: {
            events: true,
            personalised: true,
            phone: false
        },

        source: 'recommendation'
    };

    console.log('Loaded demo data');
}

/**
 * Apply personalisation to all data fields
 */
function applyPersonalisation() {
    // Child name
    document.querySelectorAll('[data-field="child_name"]').forEach(el => {
        el.textContent = prospectusData.child.first_name;
    });

    // Family name (surname)
    document.querySelectorAll('[data-field="family_name"]').forEach(el => {
        el.textContent = prospectusData.parent.surname;
    });

    // Parent title + surname
    document.querySelectorAll('[data-field="parent_title_surname"]').forEach(el => {
        el.textContent = `${prospectusData.parent.title} ${prospectusData.parent.surname}`;
    });

    // Entry point text
    const entryPointText = getEntryPointText(prospectusData.child.entry_point);
    document.querySelectorAll('[data-field="entry_point_text"]').forEach(el => {
        el.textContent = entryPointText;
    });

    // Date
    const dateText = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    document.querySelectorAll('[data-field="date"]').forEach(el => {
        el.textContent = dateText;
    });

    // Update page title
    document.title = `Prospectus for ${prospectusData.child.first_name} | Cheltenham Ladies' College`;
}

/**
 * Get human-readable entry point text
 */
function getEntryPointText(entryPoint) {
    const texts = {
        'year7': 'Year 7 Entry',
        'year9': 'Year 9 Entry',
        'sixth_form': 'Sixth Form',
        'other': 'Entry'
    };
    return texts[entryPoint] || 'Entry';
}

/**
 * Show/hide modules based on personalisation
 */
function showRelevantModules() {
    const includedModules = prospectusData.personalisation.modules_included;

    document.querySelectorAll('[data-module]').forEach(module => {
        const moduleName = module.dataset.module;
        if (includedModules.includes(moduleName)) {
            module.classList.remove('module--hidden');
            module.classList.add('module--visible');
        } else {
            module.classList.add('module--hidden');
            module.classList.remove('module--visible');
        }
    });
}

/**
 * Populate dynamic content based on data
 */
function populateDynamicContent() {
    populateWelcomeText();
    populateAdmissionsContent();
    populateCareerPathway();
    populateNextSteps();
    populatePersonalisedClubs();
    populateSelectedSports();
    populatePersonalisedVideos();
    filterBoardingHouses();
    filterAccommodationSections();
    filterScholarships();
    filterEntryPointContent();
}

/**
 * Filter boarding houses based on entry point
 */
function filterBoardingHouses() {
    const entryPoint = prospectusData.child?.entry_point;
    const housesGrid = document.getElementById('boardingHousesGrid');
    if (!housesGrid) return;

    const houseCards = housesGrid.querySelectorAll('.house-card');

    houseCards.forEach(card => {
        const houseType = card.dataset.houseType;

        if (entryPoint === 'sixth_form') {
            // Only show sixth form houses
            card.style.display = houseType === 'sixth_form' ? 'block' : 'none';
        } else if (entryPoint === 'year7' || entryPoint === 'year9') {
            // Only show junior houses
            card.style.display = houseType === 'junior' ? 'block' : 'none';
        }
        // If other/exploring, show all houses
    });
}

/**
 * Filter accommodation sections - show boarding OR day girl, not both
 */
function filterAccommodationSections() {
    const accommodation = prospectusData.practical?.accommodation_type;
    const boardingSection = document.querySelector('[data-module="boarding_life"]');
    const dayGirlSection = document.querySelector('[data-module="day_girl_experience"]');

    if (accommodation === 'boarding') {
        // Show boarding, hide day girl
        if (boardingSection) {
            boardingSection.classList.remove('module--hidden');
            boardingSection.classList.add('module--visible');
        }
        if (dayGirlSection) {
            dayGirlSection.classList.add('module--hidden');
            dayGirlSection.classList.remove('module--visible');
        }
    } else if (accommodation === 'day') {
        // Show day girl, hide boarding
        if (dayGirlSection) {
            dayGirlSection.classList.remove('module--hidden');
            dayGirlSection.classList.add('module--visible');
        }
        if (boardingSection) {
            boardingSection.classList.add('module--hidden');
            boardingSection.classList.remove('module--visible');
        }
    }
    // If 'unsure', show both (handled by modules_included)
}

/**
 * Filter scholarships to only show relevant types and entry points
 */
function filterScholarships() {
    const entryPoint = prospectusData.child?.entry_point;
    const scholarshipTypes = prospectusData.practical?.scholarship_types || [];
    const scholarshipInterest = prospectusData.practical?.scholarship_interest;

    // If no scholarship interest, hide the whole section
    if (!scholarshipInterest) {
        const scholarshipSection = document.querySelector('[data-module="scholarships"]');
        if (scholarshipSection) {
            scholarshipSection.classList.add('module--hidden');
            scholarshipSection.classList.remove('module--visible');
        }
        return;
    }

    // Get entry point text for filtering
    const entryPointFilter = {
        'sixth_form': '16+',
        'year9': '13+',
        'year7': '11+'
    };
    const relevantEntry = entryPointFilter[entryPoint] || '';

    // Filter scholarship list items
    const scholarshipList = document.getElementById('scholarshipTypes');
    if (scholarshipList) {
        const items = scholarshipList.querySelectorAll('.feature-list__item');
        items.forEach(item => {
            const title = item.querySelector('.feature-list__title')?.textContent?.toLowerCase() || '';
            const text = item.querySelector('.feature-list__text');

            // Check if this scholarship type was selected
            const typeMap = {
                'academic': 'academic',
                'music': 'music',
                'sport': 'sport',
                'art': 'art',
                'drama': 'drama'
            };

            let shouldShow = false;
            for (const [key, value] of Object.entries(typeMap)) {
                if (title.includes(key) && scholarshipTypes.includes(value)) {
                    shouldShow = true;
                    break;
                }
            }

            if (shouldShow) {
                item.style.display = 'flex';
                // Update text to only show relevant entry point
                if (text && relevantEntry) {
                    let newText = text.textContent;
                    if (entryPoint === 'sixth_form') {
                        newText = newText.replace(/11\+,?\s*/g, '').replace(/13\+,?\s*/g, '');
                        newText = newText.replace('Available at  16+', 'Available at 16+');
                        newText = newText.replace('Available at , 16+', 'Available at 16+');
                        newText = newText.replace('Available at  -', 'Available at 16+ -');
                    } else if (entryPoint === 'year9') {
                        newText = newText.replace(/11\+,?\s*/g, '');
                    }
                    text.textContent = newText.trim();
                }
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Also filter scholarship notes in other sections (music, sport, art, drama)
    filterScholarshipNotes(entryPoint);
}

/**
 * Filter scholarship notes in subject sections
 */
function filterScholarshipNotes(entryPoint) {
    const notes = ['musicScholarshipNote', 'sportScholarshipNote', 'artScholarshipNote', 'dramaScholarshipNote'];

    notes.forEach(noteId => {
        const note = document.getElementById(noteId);
        if (note) {
            const entrySpan = note.querySelector('.entry-points');
            if (entrySpan) {
                if (entryPoint === 'sixth_form') {
                    entrySpan.textContent = '16+';
                } else if (entryPoint === 'year9') {
                    entrySpan.textContent = '13+ and 16+';
                }
                // year7 keeps the full list
            }
        }
    });
}

/**
 * Filter content based on entry point - remove GCSE refs for 6th form, etc.
 */
function filterEntryPointContent() {
    const entryPoint = prospectusData.child?.entry_point;

    // Filter bursary entry points
    const bursaryEntrySpan = document.querySelector('#bursaryEntryPoints .entry-points');
    if (bursaryEntrySpan) {
        if (entryPoint === 'sixth_form') {
            bursaryEntrySpan.textContent = '16+';
        } else if (entryPoint === 'year9') {
            bursaryEntrySpan.textContent = '13+ and 16+';
        }
    }

    if (entryPoint === 'sixth_form') {
        // Hide elements marked as not for sixth form
        document.querySelectorAll('[data-not-for="sixth_form"]').forEach(el => {
            el.style.display = 'none';
        });

        // Hide any GCSE references
        document.querySelectorAll('.gcse-content').forEach(el => {
            el.style.display = 'none';
        });
    }
}

/**
 * Generate personalised welcome text
 */
function populateWelcomeText() {
    const welcomeDiv = document.getElementById('welcomePersonalised');
    if (!welcomeDiv) return;

    const child = prospectusData.child;
    const interests = prospectusData.interests;
    const practical = prospectusData.practical;

    let html = `<p>From what you've shared with us, ${child.first_name} sounds like exactly the kind of curious, talented girl who thrives at CLC.</p>`;

    // Add interest-specific content
    if (interests.extracurricular.includes('music')) {
        html += `<p>Her musical talents would find a wonderful home here, with our chamber groups, orchestra, and opportunities to perform throughout the year. Our recording studio means she could even professionally record her performances.</p>`;
    }

    if (interests.extracurricular.includes('sport')) {
        html += `<p>With our outstanding sports facilities - including a 25-metre pool and comprehensive Health and Fitness Centre - she'd be able to continue developing as an athlete.</p>`;
    }

    if (interests.extracurricular.includes('debating')) {
        html += `<p>Her interest in debating would thrive here - our Model United Nations, debating competitions, and public speaking opportunities would challenge and develop her skills.</p>`;
    }

    if (practical.family_location === 'international') {
        html += `<p>As an international family, you'd be joining a truly global community - over 40 nationalities are represented at CLC, creating a rich, diverse environment that prepares girls for a connected world.</p>`;
    }

    welcomeDiv.innerHTML = html;
}

/**
 * Populate admissions content based on entry point
 */
function populateAdmissionsContent() {
    const contentDiv = document.getElementById('admissionsContent');
    const timelineDiv = document.getElementById('admissionsTimeline');
    if (!contentDiv || !timelineDiv) return;

    const entryPoint = prospectusData.child.entry_point;
    const entryYear = prospectusData.child.entry_year;
    const childName = prospectusData.child.first_name;

    let processHtml = '';
    let timelineHtml = '';

    if (entryPoint === 'year7') {
        processHtml = `
            <h3>11+ Entry Process</h3>
            <div class="timeline">
                <div class="timeline__item">
                    <div class="timeline__title">1. Register Online</div>
                    <div class="timeline__text">Complete your application via our Admissions Portal</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">2. ISEB Common Pre-Test</div>
                    <div class="timeline__text">English, Maths, Verbal and Non-verbal reasoning (Autumn term of Year 6)</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">3. Interviews</div>
                    <div class="timeline__text">Individual interview (~20 minutes) plus group activities</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">4. Decision</div>
                    <div class="timeline__text">Offer, waitlist, or feedback</div>
                </div>
            </div>
        `;
    } else if (entryPoint === 'year9') {
        processHtml = `
            <h3>13+ Entry Process</h3>
            <div class="timeline">
                <div class="timeline__item">
                    <div class="timeline__title">1. Register Online</div>
                    <div class="timeline__text">Complete your application via our Admissions Portal</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">2. Entrance Assessment</div>
                    <div class="timeline__text">Common Entrance OR College's own entrance examination</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">3. Interviews</div>
                    <div class="timeline__text">Individual and group interviews</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">4. Decision</div>
                    <div class="timeline__text">Offer, waitlist, or feedback</div>
                </div>
            </div>
        `;
    } else if (entryPoint === 'sixth_form') {
        processHtml = `
            <h3>16+ Entry Process</h3>
            <p class="lead">Sixth Form entry is highly competitive, with students assessed on their academic potential and readiness for advanced study.</p>
            <div class="timeline">
                <div class="timeline__item">
                    <div class="timeline__title">1. Register Online</div>
                    <div class="timeline__text">Complete your application via our Admissions Portal</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">2. Subject Assessments</div>
                    <div class="timeline__text">Written assessments in ${childName}'s chosen A-Level or IB subjects</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">3. Subject Interviews</div>
                    <div class="timeline__text">Interviews with Heads of Department in her chosen subjects</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">4. Decision</div>
                    <div class="timeline__text">Offer, waitlist, or feedback</div>
                </div>
            </div>
        `;
    }

    contentDiv.innerHTML = processHtml;

    // Timeline based on entry year
    if (entryYear && entryYear !== 'exploring') {
        const year = parseInt(entryYear);
        timelineHtml = `
            <div class="timeline">
                <div class="timeline__item">
                    <div class="timeline__title">Application Deadline</div>
                    <div class="timeline__text">1st October ${year - 1}</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">Assessments & Interviews</div>
                    <div class="timeline__text">Autumn/Winter ${year - 1}</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">Offers</div>
                    <div class="timeline__text">Early ${year}</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title">${childName} Joins CLC</div>
                    <div class="timeline__text">September ${year}</div>
                </div>
            </div>
        `;
    } else {
        timelineHtml = `<p>Contact our Admissions team to discuss the best timeline for ${childName}.</p>`;
    }

    timelineDiv.innerHTML = timelineHtml;
}

/**
 * Populate career pathway content (6th Form only)
 */
function populateCareerPathway() {
    // Support both old and new data structures
    const pathway = prospectusData.futures?.career_areas?.[0] || prospectusData.personalisation?.career_pathway;
    const careerSection = document.getElementById('career-pathway');

    // Hide section if no pathway set
    if (!pathway || pathway === 'exploring') {
        if (careerSection) careerSection.style.display = 'none';
        return;
    }

    const pathwayTitle = document.getElementById('careerPathwayTitle');
    const pathwayIntro = document.getElementById('pathwayIntro');
    const pathwayContent = document.getElementById('pathwayContent');
    const subjectRecs = document.getElementById('subjectRecommendations');
    const clcAdvantages = document.getElementById('clcAdvantages');
    const uniDestinations = document.getElementById('universityDestinations');
    const childName = prospectusData.child.first_name;

    // Default subject recommendations by pathway
    const defaultSubjects = {
        'medicine_health': { essential: ['Biology', 'Chemistry'], recommended: ['Mathematics'], optional: ['Physics', 'Psychology'] },
        'law': { essential: ['English Literature'], recommended: ['History', 'Politics'], optional: ['Philosophy', 'Languages'] },
        'business_finance': { essential: ['Mathematics'], recommended: ['Economics'], optional: ['Business Studies', 'Further Maths'] },
        'science_research': { essential: ['Mathematics'], recommended: ['Physics', 'Chemistry'], optional: ['Biology', 'Further Maths'] },
        'technology_computing': { essential: ['Mathematics'], recommended: ['Computer Science', 'Physics'], optional: ['Further Maths'] },
        'engineering': { essential: ['Mathematics', 'Physics'], recommended: ['Further Maths'], optional: ['Chemistry', 'Design'] },
        'creative_arts': { essential: ['Art', 'Design'], recommended: ['English Literature'], optional: ['Photography', 'Drama'] },
        'journalism_media': { essential: ['English Literature'], recommended: ['Politics', 'History'], optional: ['Media Studies', 'Languages'] },
        'politics_public': { essential: ['Politics', 'History'], recommended: ['Economics'], optional: ['Philosophy', 'Languages'] },
        'global_ngo': { essential: ['Languages'], recommended: ['Politics', 'Geography'], optional: ['Economics', 'Sociology'] },
        'humanities_social': { essential: ['History', 'English Literature'], recommended: ['Philosophy'], optional: ['Politics', 'Sociology'] },
        'exploring': { essential: [], recommended: [], optional: [] }
    };

    const recs = prospectusData.personalisation?.subject_recommendations || defaultSubjects[pathway] || {};

    // Pathway titles
    const pathwayNames = {
        'medicine_health': 'Medicine',
        'law': 'Law',
        'business_finance': 'Business & Finance',
        'science_research': 'Science & Research',
        'technology_computing': 'Technology',
        'engineering': 'Engineering',
        'creative_arts': 'Creative Arts',
        'journalism_media': 'Media & Journalism',
        'politics_public': 'Politics & Public Service',
        'global_ngo': 'International Work',
        'humanities_social': 'Humanities',
        'exploring': 'Her Goals'
    };

    if (pathwayTitle) {
        pathwayTitle.textContent = pathwayNames[pathway] || 'Her Goals';
    }

    if (pathwayIntro) {
        pathwayIntro.textContent = `${childName} is interested in ${(pathwayNames[pathway] || 'exploring her options').toLowerCase()}. Here's how CLC can help her achieve her goals.`;
    }

    // Subject recommendations
    if (subjectRecs && recs) {
        let html = '';

        if (recs.essential?.length) {
            html += '<h4>Essential Subjects</h4><div style="margin-bottom: var(--space-md);">';
            recs.essential.forEach(s => {
                html += `<span class="subject-tag subject-tag--essential">${s}</span>`;
            });
            html += '</div>';
        }

        if (recs.recommended?.length) {
            html += '<h4>Recommended</h4><div style="margin-bottom: var(--space-md);">';
            recs.recommended.forEach(s => {
                html += `<span class="subject-tag subject-tag--recommended">${s}</span>`;
            });
            html += '</div>';
        }

        if (recs.optional?.length) {
            html += '<h4>Good Options</h4><div>';
            recs.optional.forEach(s => {
                html += `<span class="subject-tag">${s}</span>`;
            });
            html += '</div>';
        }

        subjectRecs.innerHTML = html;
    }

    // CLC advantages
    if (clcAdvantages) {
        const advantages = {
            'medicine_health': [
                'Outstanding Biology and Chemistry departments',
                'Medicine Society with visiting speakers',
                'Interview preparation programme (MMI practice)',
                'UCAT/BMAT preparation support',
                'Work experience coordination with NHS trusts',
                'Strong track record to medical schools'
            ],
            'law': [
                'Outstanding debating programme',
                'Model United Nations',
                'Mooting competitions',
                'Critical thinking emphasis across subjects',
                'Strong Oxbridge law track record'
            ],
            'business_finance': [
                'Strong Mathematics department',
                'Economics A-Level and IB',
                'Enterprise 10 Challenge',
                'Business Studies option',
                'Financial literacy programme'
            ],
            'science_research': [
                'Outstanding science departments',
                'Physics Olympiad participation',
                'Chemistry competitions',
                'EPQ opportunities for research projects',
                'STEM enrichment programme'
            ],
            'engineering': [
                'Engineering, Enterprise & Technology department',
                'Strong Mathematics and Physics',
                'Engineering competitions',
                'Practical design projects',
                'STEM enrichment'
            ]
        };

        const pathwayAdvantages = advantages[pathway] || [
            'Outstanding academic departments',
            'Small class sizes (average 8 in Sixth Form)',
            'University preparation programme',
            'Excellent careers guidance',
            'Wide range of enrichment opportunities'
        ];

        let html = '<ul class="feature-list">';
        pathwayAdvantages.forEach(adv => {
            html += `
                <li class="feature-list__item">
                    <span class="feature-list__icon">✓</span>
                    <div class="feature-list__content">
                        <div class="feature-list__text">${adv}</div>
                    </div>
                </li>
            `;
        });
        html += '</ul>';
        clcAdvantages.innerHTML = html;
    }

    // University destinations
    if (uniDestinations) {
        let html = '<h3>Where Our Students Go</h3><p>Recent CLC students have gone on to study at:</p><div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-top: var(--space-md);">';

        const unis = ['Cambridge', 'Oxford', 'Imperial', 'UCL', 'Bristol', 'Edinburgh', 'Durham', 'Exeter'];
        unis.forEach(uni => {
            html += `<span style="background: var(--clc-teal-pale); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-full); font-size: 0.9rem;">${uni}</span>`;
        });

        html += '</div>';
        uniDestinations.innerHTML = html;
    }
}

/**
 * Populate next steps section
 */
function populateNextSteps() {
    const timelineDiv = document.getElementById('nextStepsTimeline');
    if (!timelineDiv) return;

    const childName = prospectusData.child.first_name;
    const entryYear = prospectusData.child.entry_year;

    let html = '';

    if (entryYear && entryYear !== 'exploring') {
        const year = parseInt(entryYear);
        html = `
            <p class="lead" style="color: #ffffff;">Based on ${childName}'s age, she would be applying for <strong>September ${year}</strong> entry.</p>
            <h3 style="color: #ffffff;">Key Dates</h3>
            <div class="timeline">
                <div class="timeline__item">
                    <div class="timeline__title" style="color: var(--clc-gold);">Application Deadline</div>
                    <div class="timeline__text" style="color: #ffffff;">1st October ${year - 1}</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title" style="color: var(--clc-gold);">Assessments</div>
                    <div class="timeline__text" style="color: #ffffff;">Autumn ${year - 1}</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title" style="color: var(--clc-gold);">Interviews</div>
                    <div class="timeline__text" style="color: #ffffff;">Winter ${year - 1}</div>
                </div>
                <div class="timeline__item">
                    <div class="timeline__title" style="color: var(--clc-gold);">Offers</div>
                    <div class="timeline__text" style="color: #ffffff;">Early ${year}</div>
                </div>
            </div>
        `;
    } else {
        html = `<p class="lead" style="color: #ffffff;">Contact our Admissions team to discuss the best timeline for ${childName}.</p>`;
    }

    timelineDiv.innerHTML = html;
}

/**
 * Populate personalised club suggestions
 */
function populatePersonalisedClubs() {
    const clubsDiv = document.getElementById('clubsPersonalised');
    if (!clubsDiv) return;

    const interests = prospectusData.interests.extracurricular || [];
    const childName = prospectusData.child.first_name;

    if (interests.length === 0) return;

    let html = `<h3>Clubs ${childName} Might Enjoy</h3><p>Based on her interests, here are some of our 140+ clubs and societies she might love:</p><ul class="feature-list">`;

    const clubSuggestions = {
        'music': ['Orchestra', 'Chamber Music', 'Choir', 'Gospel Choir', 'Music Technology'],
        'sport': ['Netball Club', 'Swimming Squad', 'Tennis', 'Rowing', 'Dance'],
        'debating': ['Debating Society', 'Model United Nations', 'Public Speaking'],
        'drama': ['Drama Club', 'LAMDA', 'Musical Theatre', 'Technical Theatre'],
        'art': ['Art Club', 'Life Drawing', 'Photography', 'Textiles'],
        'stem': ['Engineering Club', 'Coding Club', 'Robotics', 'Science Society'],
        'reading': ['Book Club', 'Creative Writing', 'School Magazine'],
        'volunteering': ['Community Action', 'Charity Committee', 'Environmental Club'],
        'outdoor': ['Duke of Edinburgh', 'Adventure Club', 'Climbing', 'Kayaking']
    };

    let suggestedClubs = [];
    interests.forEach(interest => {
        if (clubSuggestions[interest]) {
            suggestedClubs = suggestedClubs.concat(clubSuggestions[interest].slice(0, 2));
        }
    });

    // Remove duplicates and limit
    suggestedClubs = [...new Set(suggestedClubs)].slice(0, 6);

    suggestedClubs.forEach(club => {
        html += `
            <li class="feature-list__item">
                <span class="feature-list__icon">★</span>
                <div class="feature-list__content">
                    <div class="feature-list__title">${club}</div>
                </div>
            </li>
        `;
    });

    html += '</ul>';
    clubsDiv.innerHTML = html;
}

/**
 * Populate selected sports section with detailed cards
 */
async function populateSelectedSports() {
    const sportsSection = document.getElementById('selectedSportsSection');
    const sportsGrid = document.getElementById('selectedSportsGrid');

    if (!sportsSection || !sportsGrid) return;

    // Remove duplicates from selected sports
    const selectedSports = [...new Set(prospectusData.interests?.selected_sports || [])];

    if (selectedSports.length === 0) return;

    // Load sports data
    let sportsData = null;
    try {
        const response = await fetch('data/sports-data.json');
        sportsData = await response.json();
    } catch (e) {
        console.error('Error loading sports data:', e);
        return;
    }

    // Show the section
    sportsSection.style.display = 'block';

    // Generate cards for selected sports
    let html = '';

    selectedSports.forEach(sportId => {
        const sport = sportsData.sports.find(s => s.id === sportId);
        if (!sport) return;

        html += `
            <div class="sport-detail-card">
                <div class="sport-detail-card__header">
                    <span class="sport-detail-card__icon">${sport.icon}</span>
                    <div>
                        <h3 class="sport-detail-card__title">${sport.name}</h3>
                        <span class="sport-detail-card__season">${sport.season}</span>
                    </div>
                </div>
                <p class="sport-detail-card__description">${sport.description}</p>
                <div class="sport-detail-card__highlights">
                    <h4>Highlights</h4>
                    <ul>
                        ${sport.highlights.slice(0, 4).map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>
                ${sport.achievements ? `
                <div class="sport-detail-card__achievements">
                    <h4>Achievements</h4>
                    <p>${sport.achievements.slice(0, 2).join(' • ')}</p>
                </div>
                ` : ''}
            </div>
        `;
    });

    sportsGrid.innerHTML = html;
}

/**
 * Get subtitle parameters for YouTube URLs based on native language
 */
function getSubtitleParams() {
    const nativeLanguage = prospectusData.practical?.native_language || 'en';

    // Only add subtitle params if not English
    if (nativeLanguage && nativeLanguage !== 'en' && nativeLanguage !== 'other') {
        return `&cc_load_policy=1&cc_lang_pref=${nativeLanguage}`;
    }
    return '';
}

/**
 * Populate personalised videos based on interests and entry point
 */
async function populatePersonalisedVideos() {
    // Load video library
    let videoLibrary = null;
    try {
        const response = await fetch('data/video-library.json');
        videoLibrary = await response.json();
    } catch (e) {
        console.error('Error loading video library:', e);
        return;
    }

    const entryPoint = prospectusData.child?.entry_point;
    const accommodation = prospectusData.practical?.accommodation_type;
    const interests = prospectusData.interests?.extracurricular || [];
    const childAge = prospectusData.child?.current_age || 11;
    const subtitleParams = getSubtitleParams();

    // Update hero video based on entry point
    const heroIframe = document.getElementById('heroVideo');
    if (heroIframe && videoLibrary.personalisation_mapping?.entry_point) {
        const entryVideo = videoLibrary.personalisation_mapping.entry_point[entryPoint];
        if (entryVideo) {
            const newSrc = `https://www.youtube.com/embed/${entryVideo}?autoplay=1&mute=1&loop=1&playlist=${entryVideo}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${subtitleParams}`;
            heroIframe.src = newSrc;
            heroIframe.dataset.src = newSrc;
        }
    }

    // Also update all existing video iframes with subtitle params
    if (subtitleParams) {
        document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(iframe => {
            if (!iframe.src.includes('cc_load_policy')) {
                iframe.src = iframe.src + subtitleParams;
                if (iframe.dataset.src) {
                    iframe.dataset.src = iframe.dataset.src + subtitleParams;
                }
            }
        });
    }

    // Add boarding video if boarding selected
    if (accommodation === 'boarding' || accommodation === 'unsure') {
        const boardingSection = document.getElementById('boarding-life');
        if (boardingSection && videoLibrary.videos?.boarding) {
            // Choose junior or sixth form based on entry point
            // boarding[0] = Sixth Form, boarding[1] = Junior
            const boardingVideo = entryPoint === 'sixth_form' ? videoLibrary.videos.boarding[0] : videoLibrary.videos.boarding[1];
            const videoTitle = entryPoint === 'sixth_form' ? 'Sixth Form Boarding' : 'Discover Our Boarding Houses';
            if (boardingVideo) {
                addVideoToSection(boardingSection, boardingVideo, videoTitle);
            }
        }
    }

    // Add music video if music interest
    if (interests.includes('music')) {
        const musicSection = document.getElementById('music');
        if (musicSection && videoLibrary.videos?.music?.[0]) {
            addVideoToSection(musicSection, videoLibrary.videos.music[0], 'Music Performance');
        }
    }

    // Add sixth form video if sixth form entry
    if (entryPoint === 'sixth_form') {
        const sixthFormSection = document.getElementById('sixth-form');
        if (sixthFormSection && videoLibrary.videos?.sixth_form?.[0]) {
            addVideoToSection(sixthFormSection, videoLibrary.videos.sixth_form[0], 'Sixth Form Life');
        }
    }
}

/**
 * Helper to add a FULL WIDTH video section after a module with autoplay on scroll
 */
function addVideoToSection(section, video, title) {
    const videoId = `video_${video.id}`;
    const subtitleParams = getSubtitleParams();

    const videoHtml = `
        <section class="video-fullwidth" data-video-section>
            <h3 class="video-fullwidth__title">${title}</h3>
            <div class="video-fullwidth__container">
                <iframe
                    id="${videoId}"
                    src="https://www.youtube.com/embed/${video.id}?mute=1&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${subtitleParams}"
                    data-src="https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${subtitleParams}"
                    title="${video.title}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
            <button class="video-sound-btn" onclick="enableSound('${videoId}', this)">
                <span class="sound-icon">🔇</span> Enable Sound
            </button>
        </section>
    `;

    // Insert after the section
    section.insertAdjacentHTML('afterend', videoHtml);

    // Setup autoplay observer for this new video
    setTimeout(() => {
        const newSection = document.querySelector(`#${videoId}`)?.closest('.video-fullwidth');
        if (newSection && window.setupVideoAutoplayForSection) {
            window.setupVideoAutoplayForSection(newSection);
        }
    }, 100);
}

/**
 * Setup scroll tracking for progress indicator
 */
function setupScrollTracking() {
    const nav = document.getElementById('prospectusNav');
    const progressFill = document.getElementById('progressFill');
    const scrollPercent = document.getElementById('scrollPercent');

    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = Math.round((scrollTop / docHeight) * 100);

        // Update progress
        if (progressFill) progressFill.style.width = percent + '%';
        if (scrollPercent) scrollPercent.textContent = percent;

        // Show/hide nav based on scroll position
        if (scrollTop > 500) {
            nav.classList.add('prospectus-nav--visible');
        } else {
            nav.classList.remove('prospectus-nav--visible');
        }

        lastScrollTop = scrollTop;
    });
}

// Export for use in other scripts
window.prospectusData = prospectusData;
window.loadProspectusData = loadProspectusData;
