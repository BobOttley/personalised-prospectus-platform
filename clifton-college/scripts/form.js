/**
 * Clifton College Personalised Prospectus - Enquiry Form
 * Handles multi-step form navigation, validation, and submission
 * Supports Pre-Prep, Prep, and Upper School entry points
 */

// Form state
let currentStep = 1;
let totalSteps = 5;
let formData = {};
let selectedSchool = null;
let isSixthFormEntry = false;

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
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // School selection change
    document.querySelectorAll('input[name="school_selection"]').forEach(radio => {
        radio.addEventListener('change', handleSchoolChange);
    });

    // Year group changes for Sixth Form detection
    const upperYearSelect = document.getElementById('current_year_upper');
    if (upperYearSelect) {
        upperYearSelect.addEventListener('change', function() {
            isSixthFormEntry = (this.value === 'year11');
            updateSixthFormStep();
        });
    }

    // Child name updates throughout form
    const childNameInput = document.getElementById('child_first_name');
    if (childNameInput) {
        childNameInput.addEventListener('input', updateChildNamePreviews);
    }

    // Second contact toggle
    const secondContactCheckbox = document.getElementById('add_second_contact');
    if (secondContactCheckbox) {
        secondContactCheckbox.addEventListener('change', function() {
            const fields = document.getElementById('secondContactFields');
            if (this.checked) {
                fields.classList.add('visible');
            } else {
                fields.classList.remove('visible');
            }
        });
    }

    // Sibling connection toggle
    document.querySelectorAll('input[name="connection"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const siblingField = document.getElementById('siblingNameField');
            if (this.value === 'sibling') {
                siblingField.classList.add('visible');
            } else {
                siblingField.classList.remove('visible');
            }
        });
    });

    // Scholarship interest toggle
    const scholarshipCheckbox = document.getElementById('scholarship_interest');
    if (scholarshipCheckbox) {
        scholarshipCheckbox.addEventListener('change', function() {
            const typesField = document.getElementById('scholarshipTypesField');
            if (this.checked) {
                typesField.classList.add('visible');
            } else {
                typesField.classList.remove('visible');
            }
        });
    }

    // Priority checkbox limits (max 3)
    ['preprep_priorities', 'prep_priorities', 'upper_priorities'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                limitCheckboxSelection(name, 3);
            });
        });
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Auto-save on input change
    form.addEventListener('change', saveProgress);
    form.addEventListener('input', debounce(saveProgress, 1000));
}

/**
 * Handle school selection change
 */
function handleSchoolChange(e) {
    selectedSchool = e.target.value;

    // Show/hide conditional year group fields
    document.getElementById('preprepYearField').classList.remove('visible');
    document.getElementById('prepYearField').classList.remove('visible');
    document.getElementById('upperYearField').classList.remove('visible');

    // Show/hide conditional interest sections
    document.getElementById('preprepInterests').classList.remove('visible');
    document.getElementById('prepInterests').classList.remove('visible');
    document.getElementById('upperInterests').classList.remove('visible');

    switch (selectedSchool) {
        case 'preprep':
            document.getElementById('preprepYearField').classList.add('visible');
            document.getElementById('preprepInterests').classList.add('visible');
            isSixthFormEntry = false;
            break;
        case 'prep':
            document.getElementById('prepYearField').classList.add('visible');
            document.getElementById('prepInterests').classList.add('visible');
            isSixthFormEntry = false;
            break;
        case 'upper':
            document.getElementById('upperYearField').classList.add('visible');
            document.getElementById('upperInterests').classList.add('visible');
            // Check if Sixth Form entry
            const upperYear = document.getElementById('current_year_upper').value;
            isSixthFormEntry = (upperYear === 'year11');
            break;
    }

    updateSixthFormStep();
}

/**
 * Update Sixth Form step visibility
 */
function updateSixthFormStep() {
    const sixthFormStep = document.querySelector('.progress-step--sixthform');
    const sixthFormLine = document.querySelector('.progress-step__line--sixthform');

    if (isSixthFormEntry) {
        totalSteps = 6;
        sixthFormStep?.classList.remove('hidden');
        sixthFormLine?.classList.remove('hidden');
        document.getElementById('step5Continue')?.classList.remove('hidden');
        document.getElementById('step5Submit')?.classList.add('hidden');
    } else {
        totalSteps = 5;
        sixthFormStep?.classList.add('hidden');
        sixthFormLine?.classList.add('hidden');
        document.getElementById('step5Continue')?.classList.add('hidden');
        document.getElementById('step5Submit')?.classList.remove('hidden');
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
        if (parseInt(formStep.dataset.step) === step || formStep.dataset.step === String(step)) {
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
        // Skip hidden fields
        const isVisible = field.offsetParent !== null;
        if (!isVisible) return;

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
                cb.closest('.checkbox-item')?.classList.add('disabled');
            }
        });
    } else {
        checkboxes.forEach(cb => {
            cb.disabled = false;
            cb.closest('.checkbox-item')?.classList.remove('disabled');
        });
    }
}

/**
 * Update child name previews throughout form
 */
function updateChildNamePreviews() {
    const childName = document.getElementById('child_first_name').value || 'your child';

    // Update all placeholder elements
    document.querySelectorAll('.childNamePlaceholder').forEach(el => {
        el.textContent = childName;
    });

    // Update specific elements
    const elements = ['childNameInterests', 'childNameSuccess', 'childNameBtn'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = childName;
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
        localStorage.setItem('clifton_prospectus_data', JSON.stringify(prospectusData));
        localStorage.removeItem('clifton_form_progress');

        // Update success page
        document.getElementById('parentNameSuccess').textContent =
            `${formData.parent_title} ${formData.parent_surname}`;
        document.getElementById('childNameSuccess').textContent = formData.child_first_name;
        document.getElementById('childNameBtn').textContent = formData.child_first_name;
        document.getElementById('emailConfirmation').textContent = formData.parent_email;

        // Set prospectus link based on school type
        let prospectusUrl;
        switch (formData.school_selection) {
            case 'preprep':
                prospectusUrl = `../prospectus/preprep-prospectus.html?id=${prospectusData.prospectus_id}`;
                break;
            case 'prep':
                prospectusUrl = `../prospectus/prep-prospectus.html?id=${prospectusData.prospectus_id}`;
                break;
            case 'upper':
                prospectusUrl = `../prospectus/upper-prospectus.html?id=${prospectusData.prospectus_id}`;
                break;
        }
        document.getElementById('viewProspectusBtn').href = prospectusUrl;

        // Show success step
        formSteps.forEach(step => step.classList.remove('form-step--active'));
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
 * Generate prospectus data from form data
 */
function generateProspectusData(data) {
    // Generate unique ID
    const prospectusId = 'CLIFTON-' + Date.now().toString(36).toUpperCase();

    // Determine pronouns
    const pronouns = data.child_gender === 'boy'
        ? { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself', child: 'son', term: 'boy' }
        : { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself', child: 'daughter', term: 'girl' };

    // Build interests array based on school type
    let interests = {
        academic: [],
        creative: [],
        sport: [],
        other: []
    };

    let priorities = [];
    let boardingPreference = 'day';

    switch (data.school_selection) {
        case 'preprep':
            interests.creative = data.preprep_activities?.filter(a => ['art', 'music', 'drama', 'dancing'].includes(a)) || [];
            interests.sport = data.preprep_activities?.filter(a => ['swimming', 'outdoor'].includes(a)) || [];
            interests.academic = data.preprep_activities?.filter(a => ['reading', 'nature'].includes(a)) || [];
            priorities = data.preprep_priorities || [];
            break;
        case 'prep':
            interests.academic = data.prep_subjects || [];
            interests.sport = data.prep_sports || [];
            priorities = data.prep_priorities || [];
            boardingPreference = data.prep_boarding_interest || 'day';
            break;
        case 'upper':
            interests.academic = data.upper_subjects || [];
            interests.sport = data.upper_cocurricular?.filter(a => ['rugby', 'hockey', 'cricket'].includes(a)) || [];
            interests.creative = data.upper_cocurricular?.filter(a => ['theatre', 'music'].includes(a)) || [];
            interests.other = data.upper_cocurricular?.filter(a => ['ccf', 'dofe', 'debating'].includes(a)) || [];
            priorities = data.upper_priorities || [];
            boardingPreference = data.upper_boarding || 'day';
            break;
    }

    return {
        prospectus_id: prospectusId,
        school_selection: data.school_selection,
        child: {
            first_name: data.child_first_name,
            surname: data.child_surname,
            date_of_birth: data.child_dob,
            gender: data.child_gender,
            current_year: data.current_year || data.current_year_prep || data.current_year_upper,
            entry_date: data.entry_date
        },
        pronouns: pronouns,
        interests: interests,
        important_factors: priorities,
        boarding_preference: boardingPreference,
        primary_contact: {
            title: data.parent_title,
            first_name: data.parent_first_name,
            surname: data.parent_surname,
            relationship: data.parent_relationship,
            email: data.parent_email,
            phone: data.parent_phone
        },
        address: {
            line1: data.address_line1,
            line2: data.address_line2,
            city: data.city,
            postcode: data.postcode,
            country: data.country
        },
        source: data.source,
        connection: data.connection,
        scholarship_interest: data.scholarship_interest === 'yes',
        scholarship_types: data.scholarship_types || [],
        bursary_interest: data.bursary_interest === 'yes',
        next_steps: data.next_steps || [],
        special_requirements: data.special_requirements,
        marketing_consent: data.marketing_consent === 'yes',
        career_areas: data.career_areas || [],
        university_aspiration: data.university_aspiration,
        submission_date: new Date().toISOString(),
        family_name: data.parent_surname || data.child_surname
    };
}

/**
 * Save form progress to localStorage
 */
function saveProgress() {
    const savedData = {};
    const formElements = form.elements;

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (!element.name) continue;

        if (element.type === 'checkbox' || element.type === 'radio') {
            if (element.checked) {
                if (element.type === 'checkbox') {
                    if (!savedData[element.name]) savedData[element.name] = [];
                    savedData[element.name].push(element.value);
                } else {
                    savedData[element.name] = element.value;
                }
            }
        } else {
            savedData[element.name] = element.value;
        }
    }

    savedData._currentStep = currentStep;
    savedData._selectedSchool = selectedSchool;
    localStorage.setItem('clifton_form_progress', JSON.stringify(savedData));
}

/**
 * Load saved progress from localStorage
 */
function loadSavedProgress() {
    const saved = localStorage.getItem('clifton_form_progress');
    if (!saved) return;

    try {
        const savedData = JSON.parse(saved);

        // Restore form values
        Object.keys(savedData).forEach(key => {
            if (key.startsWith('_')) return;

            const elements = form.querySelectorAll(`[name="${key}"]`);
            elements.forEach(element => {
                if (element.type === 'checkbox') {
                    element.checked = savedData[key]?.includes(element.value);
                } else if (element.type === 'radio') {
                    element.checked = (element.value === savedData[key]);
                } else {
                    element.value = savedData[key] || '';
                }
            });
        });

        // Restore step and school selection
        if (savedData._selectedSchool) {
            selectedSchool = savedData._selectedSchool;
            const schoolRadio = document.querySelector(`input[name="school_selection"][value="${selectedSchool}"]`);
            if (schoolRadio) {
                schoolRadio.checked = true;
                handleSchoolChange({ target: schoolRadio });
            }
        }

        if (savedData._currentStep) {
            currentStep = savedData._currentStep;
            showStep(currentStep);
            updateProgressIndicator();
        }

        updateChildNamePreviews();

    } catch (e) {
        console.error('Error loading saved progress:', e);
    }
}

/**
 * Scroll to top of form
 */
function scrollToTop() {
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Debounce function
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

// Make navigation functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;
