/**
 * Strathallan School - Smart Enquiry Form
 * Handles multi-step form navigation, validation, conditional logic, and prospectus generation
 */

// Form state
let currentStep = 1;
let totalSteps = 5; // Changes to 6 for Sixth Form
let formData = {};
let schoolType = null; // 'prep' or 'senior'
let isSixthForm = false;

// DOM Elements
const form = document.getElementById('enquiryForm');
const progressSteps = document.querySelectorAll('.progress-step');
const formSteps = document.querySelectorAll('.form-step');

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    loadSavedProgress();
});

/**
 * Initialize form state
 */
function initializeForm() {
    updateProgressIndicator();
    updateChildNamePreviews();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // School type selection (Prep vs Senior)
    document.querySelectorAll('input[name="school_type"]').forEach(radio => {
        radio.addEventListener('change', handleSchoolTypeChange);
    });

    // Both schools checkbox
    document.getElementById('interested_both').addEventListener('change', function() {
        if (this.checked) {
            // Show both entry fields
            document.getElementById('prepEntryField').classList.add('visible');
            document.getElementById('seniorEntryField').classList.add('visible');
        } else {
            handleSchoolTypeChange();
        }
    });

    // Senior entry point selection - show/hide Sixth Form step and curriculum field
    document.querySelectorAll('input[name="senior_entry_point"]').forEach(radio => {
        radio.addEventListener('change', handleSeniorEntryPointChange);
    });

    // Accommodation type - show flexi nights field
    document.querySelectorAll('input[name="accommodation_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const flexiNightsField = document.getElementById('flexiNightsField');
            if (this.value === 'flexi') {
                flexiNightsField.classList.add('visible');
            } else {
                flexiNightsField.classList.remove('visible');
            }
        });
    });

    // Scholarship interest - show scholarship types
    document.getElementById('scholarship_interest').addEventListener('change', function() {
        const scholarshipTypesField = document.getElementById('scholarshipTypesField');
        if (this.checked) {
            scholarshipTypesField.classList.add('visible');
        } else {
            scholarshipTypesField.classList.remove('visible');
        }
    });

    // Elite sports - show info box
    document.getElementById('elite_sports').addEventListener('change', function() {
        const eliteSportsInfo = document.getElementById('eliteSportsInfo');
        if (this.checked) {
            eliteSportsInfo.classList.add('visible');
        } else {
            eliteSportsInfo.classList.remove('visible');
        }
    });

    // Second parent toggle
    document.getElementById('include_second_parent').addEventListener('change', function() {
        const secondParentFields = document.getElementById('secondParentFields');
        if (this.checked) {
            secondParentFields.classList.add('visible');
        } else {
            secondParentFields.classList.remove('visible');
        }
    });

    // Child name preview updates
    document.getElementById('child_first_name').addEventListener('input', updateChildNamePreviews);

    // Academic interests limit (max 3)
    document.querySelectorAll('input[name="academic_interests"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // If "all" is selected, uncheck others
            if (this.value === 'all' && this.checked) {
                document.querySelectorAll('input[name="academic_interests"]').forEach(cb => {
                    if (cb.value !== 'all') {
                        cb.checked = false;
                        cb.disabled = true;
                        cb.closest('.checkbox-item')?.classList.add('disabled');
                    }
                });
            } else if (this.value !== 'all') {
                // Uncheck "all" if another option is selected
                const allCheckbox = document.getElementById('int_all');
                if (allCheckbox.checked) {
                    allCheckbox.checked = false;
                    // Re-enable other checkboxes
                    document.querySelectorAll('input[name="academic_interests"]').forEach(cb => {
                        cb.disabled = false;
                        cb.closest('.checkbox-item')?.classList.remove('disabled');
                    });
                }
                limitCheckboxSelection('academic_interests', 3);
            }
        });
    });

    // Career areas limit (max 2)
    document.querySelectorAll('input[name="career_areas"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            limitCheckboxSelection('career_areas', 2);
        });
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Auto-save on input change
    form.addEventListener('change', saveProgress);
    form.addEventListener('input', debounce(saveProgress, 1000));
}

/**
 * Handle school type selection (Prep vs Senior)
 */
function handleSchoolTypeChange(e) {
    const bothChecked = document.getElementById('interested_both').checked;
    if (bothChecked) return;

    schoolType = document.querySelector('input[name="school_type"]:checked')?.value;

    const prepEntryField = document.getElementById('prepEntryField');
    const seniorEntryField = document.getElementById('seniorEntryField');
    const academicInterestsField = document.getElementById('academicInterestsField');
    const curriculumField = document.getElementById('curriculumField');

    if (schoolType === 'prep') {
        prepEntryField.classList.add('visible');
        seniorEntryField.classList.remove('visible');
        academicInterestsField.classList.remove('visible'); // Simpler for prep
        curriculumField.classList.remove('visible');

        // Reset Sixth Form state
        isSixthForm = false;
        totalSteps = 5;
        updateFuturesStepVisibility();
    } else if (schoolType === 'senior') {
        prepEntryField.classList.remove('visible');
        seniorEntryField.classList.add('visible');
        academicInterestsField.classList.add('visible');
        curriculumField.classList.add('visible');
    }
}

/**
 * Handle senior entry point change - toggle Sixth Form step
 */
function handleSeniorEntryPointChange(e) {
    isSixthForm = (e.target.value === 'sixth_form');

    if (isSixthForm) {
        totalSteps = 6;
        // Show step 5 continue, hide submit
        document.getElementById('step5Continue').classList.remove('hidden');
        document.getElementById('step5Submit').classList.add('hidden');
    } else {
        totalSteps = 5;
        // Show step 5 submit, hide continue
        document.getElementById('step5Continue').classList.add('hidden');
        document.getElementById('step5Submit').classList.remove('hidden');
    }

    updateFuturesStepVisibility();
    updateProgressIndicator();
}

/**
 * Update visibility of Futures step in progress bar
 */
function updateFuturesStepVisibility() {
    const futuresStep = document.querySelector('.progress-step--futures');
    const futuresLine = document.querySelector('.progress-step__line--futures');

    if (futuresStep) {
        if (isSixthForm) {
            futuresStep.classList.remove('hidden');
            futuresLine?.classList.remove('hidden');
        } else {
            futuresStep.classList.add('hidden');
            futuresLine?.classList.add('hidden');
        }
    }
}

/**
 * Navigate to next step
 */
function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgressIndicator();
        saveProgress();
        scrollToTop();
    }
}

/**
 * Navigate to previous step
 */
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressIndicator();
        scrollToTop();
    }
}

/**
 * Show specific step
 */
function showStep(step) {
    formSteps.forEach(formStep => {
        formStep.classList.remove('form-step--active');
        const stepVal = formStep.dataset.step;
        if (stepVal === String(step) || stepVal === step) {
            formStep.classList.add('form-step--active');
        }
    });
}

/**
 * Update progress indicator
 */
function updateProgressIndicator() {
    progressSteps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('progress-step--active', 'progress-step--completed');

        if (stepNum === currentStep) {
            step.classList.add('progress-step--active');
        } else if (stepNum < currentStep) {
            step.classList.add('progress-step--completed');
        }
    });
}

/**
 * Validate current step
 */
function validateCurrentStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentFormStep) return true;

    let isValid = true;

    // Clear previous errors
    currentFormStep.querySelectorAll('.error-message').forEach(el => el.remove());
    currentFormStep.querySelectorAll('.form-input--error').forEach(el => {
        el.classList.remove('form-input--error');
    });

    // Step 1: School type validation
    if (currentStep === 1) {
        const schoolTypeSelected = document.querySelector('input[name="school_type"]:checked');
        if (!schoolTypeSelected) {
            showStepError(currentFormStep, 'Please select which school you are interested in');
            isValid = false;
        }
    }

    // Step 2: Entry point and child details
    if (currentStep === 2) {
        const bothChecked = document.getElementById('interested_both').checked;

        // Check prep entry point if prep selected
        if ((schoolType === 'prep' || bothChecked) && document.getElementById('prepEntryField').classList.contains('visible')) {
            if (!document.querySelector('input[name="prep_entry_point"]:checked')) {
                showFieldError(document.querySelector('input[name="prep_entry_point"]'), 'Please select an entry point');
                isValid = false;
            }
        }

        // Check senior entry point if senior selected
        if ((schoolType === 'senior' || bothChecked) && document.getElementById('seniorEntryField').classList.contains('visible')) {
            if (!document.querySelector('input[name="senior_entry_point"]:checked')) {
                showFieldError(document.querySelector('input[name="senior_entry_point"]'), 'Please select an entry point');
                isValid = false;
            }
        }

        // Required fields
        const requiredFields = ['entry_year', 'child_first_name', 'child_age', 'child_gender'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
    }

    // Step 4: Practical details
    if (currentStep === 4) {
        if (!document.querySelector('input[name="accommodation_type"]:checked')) {
            showFieldError(document.querySelector('input[name="accommodation_type"]'), 'Please select an option');
            isValid = false;
        }
        if (!document.querySelector('input[name="family_location"]:checked')) {
            showFieldError(document.querySelector('input[name="family_location"]'), 'Please select your location');
            isValid = false;
        }
    }

    // Step 5: Contact details
    if (currentStep === 5) {
        const requiredFields = ['parent_title', 'parent_first_name', 'parent_surname', 'parent_email'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Email validation
        const emailField = document.getElementById('parent_email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Show step-level error
 */
function showStepError(stepElement, message) {
    const header = stepElement.querySelector('.form-card__header');
    if (header && !header.querySelector('.error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.marginTop = 'var(--space-md)';
        errorDiv.textContent = message;
        header.appendChild(errorDiv);
    }
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    if (!field) return;

    field.classList.add('form-input--error');

    // For radio groups, find the parent
    let targetElement = field;
    if (field.type === 'radio') {
        targetElement = field.closest('.form-group') || field.closest('.radio-cards');
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const parent = targetElement?.closest('.form-group');
    if (parent && !parent.querySelector('.error-message')) {
        parent.appendChild(errorDiv);
    }
}

/**
 * Email validation
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Limit checkbox selection
 */
function limitCheckboxSelection(name, max) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    const checked = document.querySelectorAll(`input[name="${name}"]:checked`);

    if (checked.length >= max) {
        checkboxes.forEach(cb => {
            if (!cb.checked) {
                cb.disabled = true;
                cb.closest('.checkbox-item, .career-card')?.classList.add('disabled');
            }
        });
    } else {
        checkboxes.forEach(cb => {
            cb.disabled = false;
            cb.closest('.checkbox-item, .career-card')?.classList.remove('disabled');
        });
    }
}

/**
 * Update child name previews throughout form
 */
function updateChildNamePreviews() {
    const childName = document.getElementById('child_first_name').value || 'your child';

    const previewIds = [
        'childNameInterests',
        'childNameSports',
        'childNameDetails',
        'childNameContact',
        'childNameFutures',
        'childNameSuccess',
        'childNameBtn'
    ];

    previewIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = childName;
        }
    });
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();

    if (!validateCurrentStep()) {
        return;
    }

    // Collect all form data
    collectFormData();

    // Show loading state
    const submitBtn = e.submitter;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Creating your prospectus...';
    submitBtn.disabled = true;

    try {
        // Generate personalised prospectus
        const prospectusData = generateProspectusData(formData);

        // Save to localStorage for the prospectus page
        localStorage.setItem('strath_prospectus_data', JSON.stringify(prospectusData));
        localStorage.removeItem('strath_form_progress'); // Clear saved progress

        // Update success page
        document.getElementById('parentNameSuccess').textContent =
            `${formData.parent_title} ${formData.parent_surname}`;
        document.getElementById('childNameSuccess').textContent = formData.child_first_name;
        document.getElementById('childNameBtn').textContent = formData.child_first_name;
        document.getElementById('emailConfirmation').textContent = formData.parent_email;

        // Set prospectus link
        const prospectusUrl = `prospectus.html?id=${prospectusData.prospectus_id}`;
        document.getElementById('viewProspectusBtn').href = prospectusUrl;

        // Show success step
        currentStep = 'success';
        showStep('success');

        // Hide progress bar
        document.querySelector('.progress-bar').style.display = 'none';

        // Scroll to top
        scrollToTop();

    } catch (error) {
        console.error('Submission error:', error);
        alert('There was an error creating your prospectus. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Collect all form data
 */
function collectFormData() {
    const formElements = form.elements;

    // Reset formData
    formData = {};

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (!element.name) continue;

        if (element.type === 'checkbox') {
            if (!formData[element.name]) {
                formData[element.name] = [];
            }
            if (element.checked) {
                formData[element.name].push(element.value);
            }
        } else if (element.type === 'radio') {
            if (element.checked) {
                formData[element.name] = element.value;
            }
        } else {
            formData[element.name] = element.value;
        }
    }
}

/**
 * Generate prospectus data structure
 */
function generateProspectusData(data) {
    const prospectusId = generateProspectusId(data);

    // Determine which modules to include
    const modules = determineModules(data);

    // Determine which boarding house might suit them
    const suggestedHouse = determineSuggestedHouse(data);

    // Generate subject recommendations for Sixth Form
    let careerPathway = null;
    let subjectRecommendations = null;

    if (data.senior_entry_point === 'sixth_form' && data.career_areas?.length > 0) {
        careerPathway = data.career_areas[0];
        subjectRecommendations = generateSubjectRecommendations(data);
    }

    return {
        prospectus_id: prospectusId,
        generated_at: new Date().toISOString(),

        school_type: data.school_type,
        interested_both: data.interested_both?.includes('yes'),

        child: {
            first_name: data.child_first_name,
            current_age: parseInt(data.child_age),
            gender: data.child_gender,
            current_school: data.current_school || null,
            prep_entry_point: data.prep_entry_point || null,
            senior_entry_point: data.senior_entry_point || null,
            entry_year: data.entry_year
        },

        parent: {
            title: data.parent_title,
            first_name: data.parent_first_name,
            surname: data.parent_surname,
            email: data.parent_email,
            phone: data.parent_phone || null
        },

        second_parent: data.include_second_parent?.includes('yes') ? {
            title: data.second_parent_title,
            first_name: data.second_parent_first_name,
            surname: data.second_parent_surname,
            email: data.second_parent_email
        } : null,

        interests: {
            academic: data.academic_interests || [],
            sports: data.sports_interests || [],
            creative: data.creative_interests || [],
            other: data.other_interests || [],
            elite_sports: data.elite_sports?.includes('yes'),
            details: data.interest_details || null
        },

        practical: {
            accommodation_type: data.accommodation_type,
            flexi_nights: data.flexi_nights || null,
            family_location: data.family_location,
            curriculum_preference: data.curriculum_preference || null,
            scholarship_interest: data.scholarship_interest?.includes('yes'),
            scholarship_types: data.scholarship_types || [],
            bursary_interest: data.bursary_interest?.includes('yes')
        },

        futures: data.senior_entry_point === 'sixth_form' ? {
            career_areas: data.career_areas || [],
            career_details: data.career_details || null,
            university_aspiration: data.university_aspiration
        } : null,

        personalisation: {
            modules_included: modules,
            suggested_house: suggestedHouse,
            career_pathway: careerPathway,
            career_areas: data.career_areas || [],
            interests: data.academic_interests || [],
            subject_recommendations: subjectRecommendations,
            videos: determineVideos(data)
        },

        preferences: {
            events: data.pref_events?.includes('yes'),
            personalised: data.pref_personalised?.includes('yes'),
            phone: data.pref_phone?.includes('yes')
        },

        source: data.source || null
    };
}

/**
 * Generate unique prospectus ID
 */
function generateProspectusId(data) {
    const surname = (data.parent_surname || 'family').toLowerCase().replace(/[^a-z]/g, '');
    const childName = (data.child_first_name || 'child').toLowerCase().replace(/[^a-z]/g, '');
    const timestamp = Date.now().toString(36);
    return `strath-${surname}-${childName}-${timestamp}`;
}

/**
 * Determine which modules to include based on form data
 */
function determineModules(data) {
    const modules = [
        'cover',
        'welcome',
        'why_strathallan'
    ];

    // School-specific modules
    if (data.school_type === 'prep' || data.interested_both?.includes('yes')) {
        modules.push('strathallan_prep');
        modules.push('riley_house');
        modules.push('younger_years');

        // Entry point specific
        if (data.prep_entry_point === 'reception') {
            modules.push('early_years');
        }
    }

    if (data.school_type === 'senior' || data.interested_both?.includes('yes')) {
        modules.push('senior_school');
        modules.push('curriculum');

        // Entry point specific
        switch (data.senior_entry_point) {
            case 'third_form':
                modules.push('third_form');
                modules.push('bigger_picture');
                break;
            case 'fourth_form':
                modules.push('fourth_form');
                modules.push('gcse_subjects');
                break;
            case 'sixth_form':
                modules.push('sixth_form');
                modules.push('a_level_subjects');
                modules.push('curriculum_comparison');
                modules.push('epq');
                modules.push('university_prep');
                break;
        }

        // Curriculum pathway
        if (data.curriculum_preference === 'scottish' || data.curriculum_preference === 'undecided') {
            modules.push('scottish_curriculum');
        }
        if (data.curriculum_preference === 'english' || data.curriculum_preference === 'undecided') {
            modules.push('english_curriculum');
        }
    }

    // Accommodation modules
    if (data.accommodation_type === 'boarding' || data.accommodation_type === 'unsure') {
        modules.push('boarding_life');
        modules.push('boarding_houses');
    }
    if (data.accommodation_type === 'day' || data.accommodation_type === 'unsure') {
        modules.push('day_pupil_experience');
    }
    if (data.accommodation_type === 'flexi') {
        modules.push('flexi_boarding');
        modules.push('boarding_houses');
    }

    // Always include pastoral
    modules.push('pastoral_care');
    modules.push('health_wellbeing');

    // Interest-based modules
    const sportsInterests = data.sports_interests || [];
    const creativeInterests = data.creative_interests || [];
    const otherInterests = data.other_interests || [];

    if (sportsInterests.length > 0) {
        modules.push('sports');

        // Specific sport modules if strong interest - Academy sports first
        if (sportsInterests.includes('rugby')) modules.push('rugby');
        if (sportsInterests.includes('shooting')) modules.push('shooting');
        if (sportsInterests.includes('tennis')) modules.push('tennis');
        if (sportsInterests.includes('swimming')) modules.push('swimming');
        // Other sports
        if (sportsInterests.includes('equestrian')) modules.push('equestrian');
        if (sportsInterests.includes('golf')) modules.push('golf');
    }

    if (data.elite_sports?.includes('yes')) {
        modules.push('strath_worldwide');
        modules.push('athletic_development');
    }

    // Music & Creative
    if (creativeInterests.includes('piping') || creativeInterests.includes('folk')) {
        modules.push('piping_drumming');
    }
    if (creativeInterests.includes('orchestra') || creativeInterests.includes('singing')) {
        modules.push('music');
    }
    if (creativeInterests.includes('drama') || creativeInterests.includes('dance')) {
        modules.push('drama');
    }
    if (creativeInterests.includes('art') || creativeInterests.includes('design_tech')) {
        modules.push('art');
        modules.push('art_cafe');
    }

    // Other activities
    if (otherInterests.includes('outdoor') || otherInterests.includes('ccf')) {
        modules.push('outdoor_education');
    }
    if (otherInterests.includes('esports')) {
        modules.push('esports');
    }

    // Beyond the classroom
    modules.push('beyond_classroom');

    // Location-specific
    if (data.family_location === 'international') {
        modules.push('international_families');
    }

    // Scholarships & Bursaries
    if (data.scholarship_interest?.includes('yes')) {
        modules.push('scholarships');
    }
    if (data.bursary_interest?.includes('yes')) {
        modules.push('bursaries');
    }

    // Military Families
    if (data.military_family?.includes('yes')) {
        modules.push('military_families');
    }

    // Always include these
    modules.push('campus');
    modules.push('location');
    modules.push('admissions');
    modules.push('visit_us');
    modules.push('next_steps');

    return modules;
}

/**
 * Determine suggested boarding house based on child details
 */
function determineSuggestedHouse(data) {
    // Prep school - Riley House
    if (data.school_type === 'prep') {
        return {
            name: 'Riley House',
            type: 'Prep Boarding & Day',
            description: 'Our home-from-home for Prep pupils, whether boarding or day.'
        };
    }

    // Senior school - based on gender and year
    const gender = data.child_gender;
    const age = parseInt(data.child_age) || 13;

    // Boys' houses
    const boysHouses = [
        { name: 'Freeland', type: 'Senior Boys', description: 'A friendly house with a strong sense of community.' },
        { name: 'Nicol', type: 'Senior Boys', description: 'Named after the school founder, with excellent facilities.' },
        { name: 'Ruthven', type: 'Senior Boys', description: 'A welcoming environment with outstanding pastoral care.' },
        { name: 'Simpson', type: 'Senior Boys', description: 'A warm and supportive house community.' }
    ];

    // Girls' houses
    const girlsHouses = [
        { name: 'Glenbrae', type: 'Senior Girls', description: 'A supportive and vibrant community for girls.' },
        { name: 'Thornbank', type: 'Senior Girls', description: 'A warm welcome in our girls\' house.' },
        { name: 'Woodlands', type: 'Senior Girls', description: 'A nurturing environment with excellent facilities.' }
    ];

    if (gender === 'female') {
        // Return a random girls' house suggestion
        return girlsHouses[Math.floor(Math.random() * girlsHouses.length)];
    } else {
        // Return a random boys' house suggestion
        return boysHouses[Math.floor(Math.random() * boysHouses.length)];
    }
}

/**
 * Determine which videos to include based on interests
 */
function determineVideos(data) {
    const videos = {
        hero: 'X8lXe4RUDGM', // Dear Younger Me
        community: 'cw80wuAig-w' // Take My Hand - whole school
    };

    const creativeInterests = data.creative_interests || [];
    const sportsInterests = data.sports_interests || [];

    // Piping interest
    if (creativeInterests.includes('piping') || creativeInterests.includes('folk')) {
        videos.piping = 'KT6cLnVnlRA'; // The Rise - Skerryvore
    }

    // Sports
    if (sportsInterests.length > 0) {
        videos.sports = 'Zegz9sFYbTM'; // Sport at Strathallan
    }

    if (sportsInterests.includes('rugby')) {
        videos.rugby = '1iuJYFfQecM'; // Rugby Academy
    }

    if (sportsInterests.includes('swimming')) {
        videos.swimming = 'dSdjZoCTY-k'; // Performance Swim
    }

    // Prep school
    if (data.school_type === 'prep') {
        videos.prep = '0Rp9ID0ug90'; // Introducing Strathallan Prep
        videos.riley = 'HzIEFcmqbI4'; // Riley House film
    }

    // Sixth Form
    if (data.senior_entry_point === 'sixth_form') {
        videos.sixth_form = '2NdTxmnS-4A'; // Best couple years - Sixth Form
    }

    // Art
    if (creativeInterests.includes('art')) {
        videos.art = '8gH8BLG40HQ'; // Art Cafe
    }

    // Music
    if (creativeInterests.includes('orchestra') || creativeInterests.includes('singing')) {
        videos.music = 'gud8lIsrtis'; // House Music
    }

    return videos;
}

/**
 * Generate subject recommendations for Sixth Form
 */
function generateSubjectRecommendations(data) {
    const pathway = data.career_areas?.[0];
    if (!pathway) return null;

    const recommendations = {
        medicine_health: {
            essential: ['Biology', 'Chemistry'],
            recommended: ['Mathematics'],
            optional: ['Physics', 'Psychology']
        },
        law: {
            essential: [],
            recommended: ['English Literature', 'History'],
            optional: ['Politics', 'Philosophy', 'Economics']
        },
        business_finance: {
            essential: ['Mathematics'],
            recommended: ['Economics'],
            optional: ['Further Mathematics', 'Business Studies']
        },
        science_research: {
            essential: ['Mathematics'],
            recommended: ['Physics', 'Chemistry', 'Biology'],
            optional: ['Further Mathematics']
        },
        technology_computing: {
            essential: ['Mathematics'],
            recommended: ['Computer Science'],
            optional: ['Further Mathematics', 'Physics']
        },
        engineering: {
            essential: ['Mathematics', 'Physics'],
            recommended: ['Further Mathematics'],
            optional: ['Chemistry', 'Design Technology']
        },
        creative_arts: {
            essential: [],
            recommended: ['Art', 'Design Technology'],
            optional: ['English Literature', 'Art History']
        },
        professional_sport: {
            essential: [],
            recommended: ['Biology', 'PE'],
            optional: ['Psychology', 'Business Studies']
        },
        journalism_media: {
            essential: [],
            recommended: ['English Literature'],
            optional: ['Politics', 'History', 'Drama']
        },
        military: {
            essential: [],
            recommended: ['History', 'Geography'],
            optional: ['Physics', 'Mathematics', 'Languages']
        },
        exploring: {
            essential: [],
            recommended: ['Mathematics', 'English Literature', 'Sciences'],
            optional: ['History', 'Languages']
        }
    };

    return recommendations[pathway] || recommendations.exploring;
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
    collectFormData();
    const progress = {
        step: currentStep,
        data: formData,
        schoolType: schoolType,
        isSixthForm: isSixthForm,
        timestamp: Date.now()
    };
    localStorage.setItem('strath_form_progress', JSON.stringify(progress));
}

/**
 * Load saved progress
 */
function loadSavedProgress() {
    const saved = localStorage.getItem('strath_form_progress');
    if (!saved) return;

    try {
        const progress = JSON.parse(saved);

        // Only restore if less than 24 hours old
        if (Date.now() - progress.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('strath_form_progress');
            return;
        }

        // Restore form state
        formData = progress.data;
        schoolType = progress.schoolType;
        isSixthForm = progress.isSixthForm;

        // Restore total steps based on Sixth Form state
        if (isSixthForm) {
            totalSteps = 6;
            updateFuturesStepVisibility();
        }

        // Populate form fields
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            const element = form.elements[key];

            if (!element) return;

            if (Array.isArray(value)) {
                // Checkboxes
                value.forEach(v => {
                    const checkbox = document.querySelector(`input[name="${key}"][value="${v}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else if (element.type === 'radio') {
                const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else {
                element.value = value;
            }
        });

        // Trigger change events to update conditional fields
        if (formData.school_type) {
            const schoolRadio = document.querySelector(`input[name="school_type"][value="${formData.school_type}"]`);
            if (schoolRadio) {
                schoolRadio.dispatchEvent(new Event('change'));
            }
        }

        if (formData.senior_entry_point) {
            const entryRadio = document.querySelector(`input[name="senior_entry_point"][value="${formData.senior_entry_point}"]`);
            if (entryRadio) {
                entryRadio.dispatchEvent(new Event('change'));
            }
        }

        if (formData.accommodation_type) {
            const accRadio = document.querySelector(`input[name="accommodation_type"][value="${formData.accommodation_type}"]`);
            if (accRadio) {
                accRadio.dispatchEvent(new Event('change'));
            }
        }

        // Update UI
        updateChildNamePreviews();

    } catch (e) {
        console.error('Error loading saved progress:', e);
        localStorage.removeItem('strath_form_progress');
    }
}

/**
 * Scroll to top of form
 */
function scrollToTop() {
    window.scrollTo({
        top: document.querySelector('.form-card').offsetTop - 100,
        behavior: 'smooth'
    });
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
