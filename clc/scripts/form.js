/**
 * CLC Smart Enquiry Form
 * Handles multi-step form navigation, validation, and submission
 */

// Form state
let currentStep = 1;
let totalSteps = 4; // Changes to 5 for Sixth Form
let formData = {};
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
    // Entry point selection - show/hide Sixth Form step
    document.querySelectorAll('input[name="entry_point"]').forEach(radio => {
        radio.addEventListener('change', handleEntryPointChange);
    });

    // Other year field conditional
    document.querySelectorAll('input[name="entry_point"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherYearField = document.getElementById('otherYearField');
            if (this.value === 'other') {
                otherYearField.classList.add('visible');
            } else {
                otherYearField.classList.remove('visible');
            }
        });
    });

    // Scholarship interest conditional
    document.getElementById('scholarship_interest').addEventListener('change', function() {
        const scholarshipTypesField = document.getElementById('scholarshipTypesField');
        if (this.checked) {
            scholarshipTypesField.classList.add('visible');
        } else {
            scholarshipTypesField.classList.remove('visible');
        }
    });

    // Bursary field - show only for UK families
    // Native language field - show only for international families
    document.querySelectorAll('input[name="family_location"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const bursaryField = document.getElementById('bursaryField');
            const nativeLanguageField = document.getElementById('nativeLanguageField');

            if (this.value === 'local' || this.value === 'uk') {
                bursaryField.classList.add('visible');
                nativeLanguageField.classList.remove('visible');
            } else if (this.value === 'international') {
                bursaryField.classList.remove('visible');
                nativeLanguageField.classList.add('visible');
            } else {
                bursaryField.classList.remove('visible');
                nativeLanguageField.classList.remove('visible');
            }
        });
    });

    // Second parent conditional
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

    // Academic interest limit (max 3)
    document.querySelectorAll('input[name="academic_interests"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            limitCheckboxSelection('academic_interests', 3);
        });
    });

    // Career area limit (max 2)
    document.querySelectorAll('input[name="career_areas"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            limitCheckboxSelection('career_areas', 2);
        });
    });

    // Sport interest - show sport selection field
    document.getElementById('extra_sport').addEventListener('change', function() {
        const sportSelectionField = document.getElementById('sportSelectionField');
        if (this.checked) {
            sportSelectionField.classList.add('visible');
        } else {
            sportSelectionField.classList.remove('visible');
            // Clear sport selections
            document.querySelectorAll('input[name="selected_sports"]').forEach(cb => {
                cb.checked = false;
                cb.disabled = false;
            });
        }
    });

    // Sport selection limit (max 3)
    document.querySelectorAll('input[name="selected_sports"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            limitCheckboxSelection('selected_sports', 3);
        });
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Auto-save on input change
    form.addEventListener('change', saveProgress);
    form.addEventListener('input', debounce(saveProgress, 1000));
}

/**
 * Handle entry point change - toggle Sixth Form step
 */
function handleEntryPointChange(e) {
    isSixthForm = (e.target.value === 'sixth_form');

    // Show/hide Step 5 progress indicator
    const futuresStep = document.querySelector('.progress-step--futures');
    const futuresLine = document.querySelector('.progress-step__line--futures');

    if (isSixthForm) {
        totalSteps = 5;
        futuresStep.classList.remove('hidden');
        futuresLine.classList.remove('hidden');
        // Update step 4 buttons
        document.getElementById('step4Continue').classList.remove('hidden');
        document.getElementById('step4Submit').classList.add('hidden');
    } else {
        totalSteps = 4;
        futuresStep.classList.add('hidden');
        futuresLine.classList.add('hidden');
        // Update step 4 buttons
        document.getElementById('step4Continue').classList.add('hidden');
        document.getElementById('step4Submit').classList.remove('hidden');
    }

    updateProgressIndicator();
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
        if (parseInt(formStep.dataset.step) === step) {
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
    const requiredFields = currentFormStep.querySelectorAll('[required]');
    let isValid = true;

    // Clear previous errors
    currentFormStep.querySelectorAll('.error-message').forEach(el => el.remove());
    currentFormStep.querySelectorAll('.form-input--error').forEach(el => {
        el.classList.remove('form-input--error');
    });

    requiredFields.forEach(field => {
        if (!field.value || (field.type === 'radio' && !document.querySelector(`input[name="${field.name}"]:checked`))) {
            isValid = false;
            showFieldError(field, 'This field is required');
        }
    });

    // Email validation
    const emailField = currentFormStep.querySelector('input[type="email"][required]');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        isValid = false;
        showFieldError(emailField, 'Please enter a valid email address');
    }

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    field.classList.add('form-input--error');

    // For radio groups, find the parent
    let targetElement = field;
    if (field.type === 'radio') {
        targetElement = field.closest('.form-group') || field.closest('.radio-cards');
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const parent = targetElement.closest('.form-group');
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
    const childName = document.getElementById('child_first_name').value || 'your daughter';

    document.getElementById('childNamePreview').textContent = childName;
    document.getElementById('childNameFutures').textContent = childName;

    const childNameSports = document.getElementById('childNameSports');
    if (childNameSports) {
        childNameSports.textContent = childName;
    }
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
        localStorage.setItem('clc_prospectus_data', JSON.stringify(prospectusData));
        localStorage.removeItem('clc_form_progress'); // Clear saved progress

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
        showStep('success');
        document.querySelector('.form-step[data-step="success"]').classList.add('form-step--active');

        // Hide progress bar
        document.querySelector('.progress-bar').style.display = 'none';

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

    // Generate subject recommendations for Sixth Form
    let careerPathway = null;
    let subjectRecommendations = null;

    if (data.entry_point === 'sixth_form' && data.career_areas?.length > 0) {
        careerPathway = data.career_areas[0];
        subjectRecommendations = generateSubjectRecommendations(data);
    }

    return {
        prospectus_id: prospectusId,
        generated_at: new Date().toISOString(),

        child: {
            first_name: data.child_first_name,
            current_age: parseInt(data.child_age),
            current_school: data.current_school || null,
            entry_point: data.entry_point,
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
            extracurricular: data.extracurricular_interests || [],
            selected_sports: data.selected_sports || [],
            details: data.interest_details || null
        },

        practical: {
            accommodation_type: data.accommodation_type,
            family_location: data.family_location,
            native_language: data.native_language || 'en',
            scholarship_interest: data.scholarship_interest?.includes('yes'),
            scholarship_types: data.scholarship_types || [],
            bursary_interest: data.bursary_interest?.includes('yes')
        },

        futures: data.entry_point === 'sixth_form' ? {
            career_areas: data.career_areas || [],
            career_details: data.career_details || null,
            qualification_preference: data.qualification_preference,
            university_aspiration: data.university_aspiration
        } : null,

        personalisation: {
            modules_included: modules,
            career_pathway: careerPathway,
            subject_recommendations: subjectRecommendations
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
    return `${surname}-${childName}-${timestamp}`;
}

/**
 * Determine which modules to include based on form data
 */
function determineModules(data) {
    const modules = [
        'cover',
        'welcome',
        'why_clc',
        'academic_excellence'
    ];

    // Entry point specific modules
    switch (data.entry_point) {
        case 'year7':
        case 'year9':
            modules.push('lower_college');
            break;
        case 'sixth_form':
            modules.push('sixth_form');
            if (data.qualification_preference === 'ib' || data.qualification_preference === 'undecided') {
                modules.push('ib_programme');
            }
            if (data.career_areas?.length > 0) {
                modules.push('career_pathway');
            }
            break;
    }

    // Show Upper College for Year 9 and Year 10 only (NOT sixth form - they're past GCSEs)
    if (['year9', 'year10'].includes(data.entry_point) || data.other_year === 'year10') {
        modules.push('upper_college');
    }

    // Accommodation modules
    if (data.accommodation_type === 'boarding' || data.accommodation_type === 'unsure') {
        modules.push('boarding_life');
    }
    if (data.accommodation_type === 'day' || data.accommodation_type === 'unsure') {
        modules.push('day_girl_experience');
    }

    // Always include pastoral
    modules.push('pastoral_care');

    // Interest-based modules
    const interests = [...(data.academic_interests || []), ...(data.extracurricular_interests || [])];

    if (interests.includes('sport')) {
        modules.push('sport');
    }
    if (interests.includes('music')) {
        modules.push('music');
    }
    if (interests.includes('drama') || interests.includes('dance')) {
        modules.push('drama_dance');
    }
    if (interests.includes('art')) {
        modules.push('art');
    }

    // Clubs (always light mention, more if specific interests)
    modules.push('clubs_enrichment');

    // Scholarships
    if (data.scholarship_interest?.includes('yes')) {
        modules.push('scholarships');
    }

    // Bursaries
    if (data.bursary_interest?.includes('yes')) {
        modules.push('bursaries');
    }

    // Always include these
    modules.push('how_to_apply');
    modules.push('visit_us');
    modules.push('location');
    modules.push('next_steps');

    return modules;
}

/**
 * Generate subject recommendations for Sixth Form
 */
function generateSubjectRecommendations(data) {
    // This would normally call the career pathways engine
    // For now, return a basic structure that will be enhanced by the full engine
    const pathway = data.career_areas?.[0];

    if (!pathway) return null;

    // Basic recommendations based on pathway
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
        journalism_media: {
            essential: [],
            recommended: ['English Literature'],
            optional: ['Politics', 'History', 'Drama']
        },
        politics_public: {
            essential: [],
            recommended: ['Politics', 'History'],
            optional: ['Economics', 'Philosophy']
        },
        global_ngo: {
            essential: [],
            recommended: ['Geography', 'Languages'],
            optional: ['Economics', 'Politics']
        },
        humanities_social: {
            essential: [],
            recommended: ['English Literature', 'History'],
            optional: ['Languages', 'Philosophy', 'Psychology']
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
        timestamp: Date.now()
    };
    localStorage.setItem('clc_form_progress', JSON.stringify(progress));
}

/**
 * Load saved progress
 */
function loadSavedProgress() {
    const saved = localStorage.getItem('clc_form_progress');
    if (!saved) return;

    try {
        const progress = JSON.parse(saved);

        // Only restore if less than 24 hours old
        if (Date.now() - progress.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('clc_form_progress');
            return;
        }

        // Restore form data
        formData = progress.data;

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

        // Trigger change events
        if (formData.entry_point) {
            const entryRadio = document.querySelector(`input[name="entry_point"][value="${formData.entry_point}"]`);
            if (entryRadio) {
                entryRadio.dispatchEvent(new Event('change'));
            }
        }

        // Update UI
        updateChildNamePreviews();

    } catch (e) {
        console.error('Error loading saved progress:', e);
        localStorage.removeItem('clc_form_progress');
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
