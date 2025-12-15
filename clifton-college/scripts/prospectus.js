/**
 * Clifton College Personalised Prospectus - Core JavaScript
 * Handles personalisation, reading progress, and video integration
 */

// Prospectus data
let prospectusData = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    loadProspectusData();
    initializeProgressBar();
    initializePersonalisation();
    initializeConditionalModules();
    initializeVideoPlayers();
    initializeScrollAnimations();
});

/**
 * Load prospectus data from localStorage or URL parameter
 */
function loadProspectusData() {
    // Check for data in localStorage
    const savedData = localStorage.getItem('clifton_prospectus_data');

    if (savedData) {
        try {
            prospectusData = JSON.parse(savedData);
            console.log('Loaded prospectus data:', prospectusData.prospectus_id);
        } catch (e) {
            console.error('Error parsing prospectus data:', e);
            loadDemoData();
        }
    } else {
        // Load demo data if no saved data
        loadDemoData();
    }

    // Set prospectus metadata
    if (prospectusData) {
        const idElement = document.getElementById('prospectusId');
        const dateElement = document.getElementById('prospectusDate');

        if (idElement) {
            idElement.textContent = prospectusData.prospectus_id || 'DEMO';
        }
        if (dateElement) {
            const date = new Date(prospectusData.submission_date || Date.now());
            dateElement.textContent = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
}

/**
 * Load demo data for preview purposes
 */
function loadDemoData() {
    prospectusData = {
        prospectus_id: 'CLIFTON-DEMO',
        school_selection: 'upper',
        child: {
            first_name: 'Oliver',
            surname: 'Thompson',
            gender: 'boy',
            entry_date: 'september_2025'
        },
        pronouns: {
            subject: 'he',
            object: 'him',
            possessive: 'his',
            reflexive: 'himself',
            child: 'son',
            term: 'boy'
        },
        interests: {
            academic: ['sciences', 'maths'],
            creative: ['drama'],
            sport: ['rugby', 'cricket'],
            other: ['ccf']
        },
        important_factors: ['sport', 'academic', 'boarding'],
        boarding_preference: 'full',
        primary_contact: {
            title: 'Mr',
            first_name: 'James',
            surname: 'Thompson'
        },
        family_name: 'Thompson',
        scholarship_interest: true,
        scholarship_types: ['sport', 'academic'],
        career_areas: ['medicine', 'science'],
        university_aspiration: 'oxbridge',
        submission_date: new Date().toISOString()
    };

    console.log('Loaded demo data');
}

/**
 * Initialize reading progress bar
 */
function initializeProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');

    if (!progressBar || !progressPercent) return;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollTop / docHeight) * 100, 100);

        progressBar.style.width = progress + '%';
        progressPercent.textContent = Math.round(progress) + '% read';
    }

    window.addEventListener('scroll', throttle(updateProgress, 50));
    updateProgress();
}

/**
 * Initialize personalisation throughout the prospectus
 */
function initializePersonalisation() {
    if (!prospectusData) return;

    // Update family badge
    const familyBadge = document.getElementById('familyBadge');
    if (familyBadge) {
        familyBadge.textContent = `Prepared for the ${prospectusData.family_name || 'Family'} Family`;
    }

    // Replace all personalised placeholders
    const personalisedElements = document.querySelectorAll('[data-field]');
    personalisedElements.forEach(element => {
        const field = element.dataset.field;
        let value = '';

        switch (field) {
            case 'child_name':
                value = prospectusData.child?.first_name || 'Your child';
                break;
            case 'family_name':
                value = prospectusData.family_name || 'Family';
                break;
            case 'pronoun_subject':
                value = prospectusData.pronouns?.subject || 'they';
                break;
            case 'pronoun_object':
                value = prospectusData.pronouns?.object || 'them';
                break;
            case 'pronoun_possessive':
                value = prospectusData.pronouns?.possessive || 'their';
                break;
            case 'pronoun_reflexive':
                value = prospectusData.pronouns?.reflexive || 'themselves';
                break;
            case 'child_term':
                value = prospectusData.pronouns?.child || 'child';
                break;
            case 'entry_date':
                value = formatEntryDate(prospectusData.child?.entry_date);
                break;
            default:
                value = element.textContent;
        }

        element.textContent = value;
    });

    // Also update any .personalised elements without data-field
    document.querySelectorAll('.personalised:not([data-field])').forEach(element => {
        // These might be inline replacements
        const text = element.textContent;
        if (text.includes('your child')) {
            element.textContent = text.replace('your child', prospectusData.child?.first_name || 'your child');
        }
    });
}

/**
 * Format entry date for display
 */
function formatEntryDate(entryDate) {
    if (!entryDate) return 'September 2025';

    const mapping = {
        'september_2025': 'September 2025',
        'january_2026': 'January 2026',
        'september_2026': 'September 2026',
        'september_2027': 'September 2027',
        'later': 'a future date'
    };

    return mapping[entryDate] || entryDate;
}

/**
 * Initialize conditional modules based on interests
 */
function initializeConditionalModules() {
    if (!prospectusData) return;

    const conditionalModules = document.querySelectorAll('.conditional-module');

    conditionalModules.forEach(module => {
        const showIf = module.dataset.showIf;

        if (!showIf) return;

        let shouldShow = false;

        // Check interests and priorities
        const allInterests = [
            ...(prospectusData.interests?.academic || []),
            ...(prospectusData.interests?.creative || []),
            ...(prospectusData.interests?.sport || []),
            ...(prospectusData.interests?.other || []),
            ...(prospectusData.important_factors || [])
        ];

        // Handle multiple conditions (comma-separated)
        const conditions = showIf.split(',').map(c => c.trim());
        shouldShow = conditions.some(condition => allInterests.includes(condition));

        if (shouldShow) {
            module.classList.add('visible');
        }
    });
}

/**
 * Initialize video players with lazy loading
 */
function initializeVideoPlayers() {
    const videoEmbeds = document.querySelectorAll('.video-embed');

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '200px'
    });

    videoEmbeds.forEach(embed => {
        const iframe = embed.querySelector('iframe');
        if (iframe && !iframe.src.includes('youtube.com')) {
            // Move src to data-src for lazy loading
            iframe.dataset.src = iframe.src;
            iframe.removeAttribute('src');
            observer.observe(embed);
        } else if (iframe) {
            // Already has YouTube src - don't lazy load
            observer.observe(embed);
        }
    });
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.module');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('module--visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Track engagement (placeholder for analytics)
 */
function trackEngagement(action, label) {
    console.log('Engagement:', action, label);
    // In production, this would send to analytics
}

/**
 * Interactive video branching for "The Spirit Within"
 */
class InteractiveVideo {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.currentChapter = 'intro';
        this.init();
    }

    init() {
        if (!this.container) return;
        this.render();
    }

    render() {
        const currentConfig = this.config.chapters[this.currentChapter];
        if (!currentConfig) return;

        let html = `
            <div class="interactive-video">
                <div class="video-embed">
                    <iframe
                        src="https://www.youtube.com/embed/${currentConfig.videoId}?rel=0&modestbranding=1"
                        title="${currentConfig.title}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <h3>${currentConfig.title}</h3>
                <p>${currentConfig.description}</p>
        `;

        if (currentConfig.choices && currentConfig.choices.length > 0) {
            html += `<div class="video-choices">`;
            currentConfig.choices.forEach(choice => {
                html += `
                    <button class="video-choice btn btn--secondary" data-next="${choice.next}">
                        ${choice.label}
                    </button>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;

        this.container.innerHTML = html;

        // Add click handlers for choices
        this.container.querySelectorAll('.video-choice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentChapter = e.target.dataset.next;
                this.render();
                trackEngagement('interactive_video', this.currentChapter);
            });
        });
    }
}

// Export for use in HTML
window.InteractiveVideo = InteractiveVideo;

// Spirit Within configuration
window.spiritWithinConfig = {
    chapters: {
        intro: {
            videoId: 'txqf5lTDbZU',
            title: 'The Spirit Within',
            description: 'Discover what makes Clifton College special',
            choices: [
                { label: 'Explore Academics', next: 'academics' },
                { label: 'Discover Sport', next: 'sport' },
                { label: 'Experience Performing Arts', next: 'drama' }
            ]
        },
        academics: {
            videoId: 'wefWSwAIf0g',
            title: 'Life at Clifton',
            description: 'Academic excellence meets individual potential',
            choices: [
                { label: 'Continue to Sport', next: 'sport' },
                { label: 'Explore Drama', next: 'drama' },
                { label: 'Back to Start', next: 'intro' }
            ]
        },
        sport: {
            videoId: 'l8G8FpkVxLg',
            title: 'Sport at Clifton',
            description: 'From grassroots to international level',
            choices: [
                { label: 'Continue to Drama', next: 'drama' },
                { label: 'Explore Pastoral Care', next: 'pastoral' },
                { label: 'Back to Start', next: 'intro' }
            ]
        },
        drama: {
            videoId: 'zy7SyG3oAEA',
            title: 'Drama at Clifton',
            description: 'The Redgrave Theatre and beyond',
            choices: [
                { label: 'Explore Pastoral Care', next: 'pastoral' },
                { label: 'Back to Start', next: 'intro' }
            ]
        },
        pastoral: {
            videoId: 'g3VEVl7qb5M',
            title: 'Pastoral Care',
            description: 'The house system and support for every student',
            choices: [
                { label: 'Start Over', next: 'intro' }
            ]
        }
    }
};
