/**
 * CLC Prospectus - Additional Functionality
 * Handles smooth scrolling, animations, and analytics
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeProspectus();
});

/**
 * Initialize all prospectus functionality
 */
function initializeProspectus() {
    setupSmoothScrolling();
    setupIntersectionObserver();
    setupImageLazyLoading();
    setupTableOfContents();
    setupVideoAutoplay();
    trackPageView();
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Setup intersection observer for scroll animations
 */
function setupIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Track module views
                const moduleName = entry.target.dataset.module;
                if (moduleName) {
                    trackModuleView(moduleName);
                }
            }
        });
    }, options);

    // Observe all modules
    document.querySelectorAll('.module').forEach(module => {
        module.style.opacity = '0';
        module.style.transform = 'translateY(20px)';
        module.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(module);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .module.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Setup video autoplay on scroll into view
 */
function setupVideoAutoplay() {
    const videoSections = document.querySelectorAll('[data-video-section]');
    videoSections.forEach(section => setupVideoAutoplayForSection(section));
}

/**
 * Setup autoplay for a single video section
 */
function setupVideoAutoplayForSection(section) {
    if (!('IntersectionObserver' in window)) return;

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (!iframe) return;

            if (entry.isIntersecting) {
                // Swap to autoplay URL when in view - but only ONCE
                const autoplaySrc = iframe.dataset.src;
                if (autoplaySrc && !iframe.dataset.activated) {
                    iframe.dataset.activated = 'true';
                    iframe.src = autoplaySrc;
                }
            }
            // Don't mute or reset when scrolling away - let user control the video
        });
    }, {
        threshold: 0.3
    });

    videoObserver.observe(section);
}

/**
 * Mute a YouTube iframe video
 */
function muteVideo(iframe) {
    if (!iframe || !iframe.src) return;

    let src = iframe.src;
    // Replace mute=0 with mute=1
    if (src.includes('mute=0')) {
        src = src.replace('mute=0', 'mute=1');
        iframe.src = src;
    }
}

// Expose for dynamic videos
window.setupVideoAutoplayForSection = setupVideoAutoplayForSection;

/**
 * Setup lazy loading for images
 */
function setupImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Generate and insert table of contents
 */
function setupTableOfContents() {
    const tocContainer = document.getElementById('tableOfContents');
    if (!tocContainer) return;

    const modules = document.querySelectorAll('.module.module--visible');
    let tocHtml = '<nav class="toc"><h3>Contents</h3><ol class="toc__list">';

    let num = 1;
    modules.forEach(module => {
        const id = module.id;
        const title = module.querySelector('.module__title');
        if (title && id) {
            tocHtml += `
                <li class="toc__item">
                    <a href="#${id}" class="toc__link">
                        <span class="toc__number">${num}.</span>
                        ${title.textContent}
                    </a>
                </li>
            `;
            num++;
        }
    });

    tocHtml += '</ol></nav>';
    tocContainer.innerHTML = tocHtml;
}

/**
 * Analytics - Track page view
 */
function trackPageView() {
    const data = {
        event: 'prospectus_view',
        prospectus_id: window.prospectusData?.prospectus_id || 'unknown',
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent
    };

    // Store in localStorage for now (would normally send to analytics server)
    const analytics = JSON.parse(localStorage.getItem('clc_analytics') || '[]');
    analytics.push(data);
    localStorage.setItem('clc_analytics', JSON.stringify(analytics));

    console.log('Tracked page view:', data);
}

/**
 * Analytics - Track module view
 */
function trackModuleView(moduleName) {
    const data = {
        event: 'module_view',
        prospectus_id: window.prospectusData?.prospectus_id || 'unknown',
        module: moduleName,
        timestamp: new Date().toISOString()
    };

    // Store in localStorage
    const analytics = JSON.parse(localStorage.getItem('clc_analytics') || '[]');
    analytics.push(data);
    localStorage.setItem('clc_analytics', JSON.stringify(analytics));
}

/**
 * Analytics - Track time on module
 */
let moduleStartTimes = {};

function startModuleTimer(moduleName) {
    moduleStartTimes[moduleName] = Date.now();
}

function endModuleTimer(moduleName) {
    if (moduleStartTimes[moduleName]) {
        const duration = Date.now() - moduleStartTimes[moduleName];
        const data = {
            event: 'module_duration',
            prospectus_id: window.prospectusData?.prospectus_id || 'unknown',
            module: moduleName,
            duration_ms: duration,
            timestamp: new Date().toISOString()
        };

        const analytics = JSON.parse(localStorage.getItem('clc_analytics') || '[]');
        analytics.push(data);
        localStorage.setItem('clc_analytics', JSON.stringify(analytics));

        delete moduleStartTimes[moduleName];
    }
}

/**
 * Share functionality
 */
function shareProspectus(method) {
    const url = window.location.href;
    const title = document.title;
    const text = `Check out this personalised prospectus from Cheltenham Ladies' College`;

    switch (method) {
        case 'email':
            window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            });
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            break;
    }

    // Track share
    const data = {
        event: 'share',
        prospectus_id: window.prospectusData?.prospectus_id || 'unknown',
        method: method,
        timestamp: new Date().toISOString()
    };

    const analytics = JSON.parse(localStorage.getItem('clc_analytics') || '[]');
    analytics.push(data);
    localStorage.setItem('clc_analytics', JSON.stringify(analytics));
}

/**
 * Download PDF (print)
 */
function downloadPDF() {
    // Track download intent
    const data = {
        event: 'download_pdf',
        prospectus_id: window.prospectusData?.prospectus_id || 'unknown',
        timestamp: new Date().toISOString()
    };

    const analytics = JSON.parse(localStorage.getItem('clc_analytics') || '[]');
    analytics.push(data);
    localStorage.setItem('clc_analytics', JSON.stringify(analytics));

    window.print();
}

/**
 * Get analytics summary
 */
function getAnalyticsSummary() {
    const analytics = JSON.parse(localStorage.getItem('clc_analytics') || '[]');

    const summary = {
        totalViews: analytics.filter(a => a.event === 'prospectus_view').length,
        moduleViews: {},
        moduleDurations: {},
        shares: analytics.filter(a => a.event === 'share').length,
        downloads: analytics.filter(a => a.event === 'download_pdf').length
    };

    analytics.filter(a => a.event === 'module_view').forEach(a => {
        summary.moduleViews[a.module] = (summary.moduleViews[a.module] || 0) + 1;
    });

    analytics.filter(a => a.event === 'module_duration').forEach(a => {
        if (!summary.moduleDurations[a.module]) {
            summary.moduleDurations[a.module] = [];
        }
        summary.moduleDurations[a.module].push(a.duration_ms);
    });

    return summary;
}

/**
 * Toggle sound on video by reloading iframe with muted/unmuted URL
 */
function enableSound(iframeId, button) {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;

    let src = iframe.src;
    const isMuted = src.includes('mute=1');

    if (isMuted) {
        // Turn sound ON
        src = src.replace('mute=1', 'mute=0');
        if (!src.includes('autoplay=1')) {
            src += '&autoplay=1';
        }
        iframe.src = src;
        button.innerHTML = '<span class="sound-icon">🔊</span> Sound On';
        button.classList.add('video-sound-btn--active');
    } else {
        // Turn sound OFF
        src = src.replace('mute=0', 'mute=1');
        iframe.src = src;
        button.innerHTML = '<span class="sound-icon">🔇</span> Enable Sound';
        button.classList.remove('video-sound-btn--active');
    }
}

// Expose functions globally
window.shareProspectus = shareProspectus;
window.downloadPDF = downloadPDF;
window.getAnalyticsSummary = getAnalyticsSummary;
window.enableSound = enableSound;
