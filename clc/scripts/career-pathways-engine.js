/**
 * CLC Career Pathways Engine
 * Advanced subject recommendation and career pathway system for Sixth Form
 */

class CareerPathwaysEngine {
    constructor() {
        this.pathways = null;
        this.loadPathways();
    }

    /**
     * Load pathway definitions from JSON
     */
    async loadPathways() {
        try {
            const response = await fetch('data/career-pathways.json');
            const data = await response.json();
            this.pathways = data.pathways;
        } catch (e) {
            console.error('Error loading pathways:', e);
            this.pathways = this.getDefaultPathways();
        }
    }

    /**
     * Default pathways if JSON fails to load
     */
    getDefaultPathways() {
        return [
            {
                id: 'medicine_health',
                name: 'Medicine & Healthcare',
                subPathways: [
                    {
                        id: 'medicine_doctor',
                        name: 'Medicine (Doctor)',
                        requiredSubjects: ['Biology', 'Chemistry'],
                        recommendedSubjects: ['Mathematics', 'Physics'],
                        alternativeSubjects: ['Psychology']
                    }
                ]
            },
            {
                id: 'exploring',
                name: 'Keeping Options Open',
                approach: {
                    facilitatingSubjects: ['Mathematics', 'English Literature', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Languages']
                }
            }
        ];
    }

    /**
     * Generate subject recommendations based on input
     */
    generateRecommendation(input) {
        const {
            careerAreas,
            careerDetails,
            currentSubjects,
            preferredSubjects,
            qualificationPreference,
            universityAspiration
        } = input;

        // Get primary pathway
        const primaryPathwayId = careerAreas?.[0] || 'exploring';
        const pathway = this.pathways?.find(p => p.id === primaryPathwayId);

        if (!pathway) {
            return this.getExploringRecommendation(qualificationPreference);
        }

        // Handle exploring/undecided
        if (primaryPathwayId === 'exploring') {
            return this.getExploringRecommendation(qualificationPreference);
        }

        // Get most relevant sub-pathway
        const subPathway = this.findBestSubPathway(pathway, careerDetails);

        // Generate recommendation
        const recommendation = {
            pathway: pathway.name,
            subPathway: subPathway?.name || pathway.name,
            qualification: qualificationPreference,
            subjects: [],
            reasoning: [],
            warnings: [],
            clcStrengths: [],
            alternatives: []
        };

        // Add required subjects
        const required = subPathway?.requiredSubjects || [];
        required.forEach(subject => {
            recommendation.subjects.push({
                subject: subject,
                priority: 'essential',
                reason: `Required for ${subPathway?.name || pathway.name}`
            });
        });

        // Add recommended subjects
        const recommended = subPathway?.recommendedSubjects || [];
        recommended.forEach(subject => {
            if (!this.subjectInList(subject, recommendation.subjects)) {
                recommendation.subjects.push({
                    subject: subject,
                    priority: 'recommended',
                    reason: `Highly recommended for ${subPathway?.name || pathway.name}`
                });
            }
        });

        // Add preferred subjects if they don't conflict
        preferredSubjects?.forEach(subject => {
            if (!this.subjectInList(subject, recommendation.subjects)) {
                recommendation.subjects.push({
                    subject: subject,
                    priority: 'preferred',
                    reason: 'Based on her stated interest'
                });
            }
        });

        // Limit to appropriate number
        const targetCount = qualificationPreference === 'ib' ? 6 : 4;
        recommendation.subjects = recommendation.subjects.slice(0, targetCount);

        // Check for warnings
        required.forEach(req => {
            if (preferredSubjects?.length > 0 && !preferredSubjects.includes(req)) {
                recommendation.warnings.push({
                    type: 'missing_required',
                    subject: req,
                    message: `${req} is usually required for ${subPathway?.name || pathway.name}. She may want to consider adding it.`
                });
            }
        });

        // Add CLC strengths
        recommendation.clcStrengths = subPathway?.clcStrengths || pathway.clcStrengths || [];

        // Generate IB/A-Level specific combinations
        if (qualificationPreference === 'ib') {
            recommendation.ibCombination = this.generateIBCombination(pathway, subPathway, preferredSubjects);
        } else {
            recommendation.aLevelCombination = this.generateALevelCombination(pathway, subPathway, preferredSubjects);
        }

        // Add enrichment suggestions
        recommendation.enrichment = this.getEnrichmentSuggestions(primaryPathwayId);

        // Add university info if Oxbridge aspirations
        if (universityAspiration === 'oxbridge') {
            recommendation.oxbridgeNotes = this.getOxbridgeNotes(primaryPathwayId);
        }

        return recommendation;
    }

    /**
     * Find the best sub-pathway based on career details
     */
    findBestSubPathway(pathway, careerDetails) {
        if (!pathway.subPathways || pathway.subPathways.length === 0) {
            return null;
        }

        if (!careerDetails) {
            return pathway.subPathways[0];
        }

        // Simple keyword matching
        const details = careerDetails.toLowerCase();
        for (const subPath of pathway.subPathways) {
            const name = subPath.name.toLowerCase();
            if (details.includes(name) || name.split(' ').some(word => details.includes(word))) {
                return subPath;
            }
        }

        // Check for specific keywords
        const keywordMap = {
            'research': 'research',
            'surgery': 'doctor',
            'surgeon': 'doctor',
            'gp': 'doctor',
            'nursing': 'nursing',
            'dentist': 'dentistry',
            'vet': 'vet',
            'psychology': 'psychology',
            'barrister': 'barrister',
            'solicitor': 'solicitor',
            'corporate': 'corporate',
            'investment': 'banking',
            'banking': 'banking',
            'software': 'software',
            'ai': 'ai',
            'architect': 'architecture'
        };

        for (const [keyword, subPathId] of Object.entries(keywordMap)) {
            if (details.includes(keyword)) {
                const match = pathway.subPathways.find(sp => sp.id.includes(subPathId));
                if (match) return match;
            }
        }

        return pathway.subPathways[0];
    }

    /**
     * Check if subject is already in list
     */
    subjectInList(subject, list) {
        return list.some(item => item.subject.toLowerCase() === subject.toLowerCase());
    }

    /**
     * Generate recommendation for undecided students
     */
    getExploringRecommendation(qualificationPreference) {
        const facilitating = ['Mathematics', 'English Literature', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'French'];

        const recommendation = {
            pathway: 'Keeping Options Open',
            subPathway: 'Exploratory',
            qualification: qualificationPreference,
            subjects: [],
            reasoning: [
                'When keeping options open, choose facilitating subjects that demonstrate academic rigour',
                'The IB is particularly good for undecided students due to its breadth'
            ],
            warnings: [],
            clcStrengths: [
                'Excellent careers guidance',
                'Wide subject choice',
                'Opportunity to try new things',
                'Supportive environment for exploration',
                'Strong results across all disciplines'
            ],
            alternatives: []
        };

        // Recommend IB if undecided
        if (qualificationPreference === 'undecided' || qualificationPreference === 'ib') {
            recommendation.reasoning.push('We recommend the IB for students who want to keep their options open - it provides breadth across all disciplines');
        }

        // Add facilitating subjects
        facilitating.slice(0, 4).forEach((subject, i) => {
            recommendation.subjects.push({
                subject: subject,
                priority: i < 2 ? 'recommended' : 'optional',
                reason: 'Facilitating subject - keeps university options open'
            });
        });

        return recommendation;
    }

    /**
     * Generate IB combination
     */
    generateIBCombination(pathway, subPathway, preferred) {
        const ib = pathway.ibCombination || {};

        return {
            higherLevel: ib.higherLevel || ['To be determined based on interests'],
            standardLevel: ib.standardLevel || ['To be determined based on interests'],
            notes: ib.notes || 'IB provides excellent preparation with its breadth and depth'
        };
    }

    /**
     * Generate A-Level combination
     */
    generateALevelCombination(pathway, subPathway, preferred) {
        const aLevel = pathway.aLevelCombination || {};

        return {
            core: aLevel.required || aLevel.core || aLevel.essential || [],
            recommended: aLevel.recommended || aLevel.thirdSubject || [],
            alternatives: aLevel.alternatives || aLevel.fourthSubject || []
        };
    }

    /**
     * Get enrichment suggestions for pathway
     */
    getEnrichmentSuggestions(pathwayId) {
        const enrichment = {
            'medicine_health': [
                'Join Medicine Society',
                'Arrange work experience shadowing',
                'Start UCAT/BMAT preparation in Year 12',
                'Participate in Biology/Chemistry Olympiads',
                'Consider an EPQ on a medical topic'
            ],
            'law': [
                'Join Debating Society',
                'Participate in Model United Nations',
                'Enter mooting competitions',
                'Read widely on current affairs',
                'Consider an EPQ on a legal topic'
            ],
            'business_finance': [
                'Enter Enterprise 10 Challenge',
                'Join Economics/Business clubs',
                'Follow financial news',
                'Consider work experience in business',
                'Develop Excel and data skills'
            ],
            'science_research': [
                'Enter Science Olympiads',
                'Conduct independent research (EPQ)',
                'Join relevant subject societies',
                'Attend STEM lectures and events',
                'Consider summer research programmes'
            ],
            'technology_computing': [
                'Join Coding Club',
                'Work on personal coding projects',
                'Enter computing competitions',
                'Consider hackathons',
                'Build a portfolio of work'
            ],
            'engineering': [
                'Join Engineering Club',
                'Enter engineering competitions',
                'Work on practical projects',
                'Consider Engineering EPQ',
                'Apply for engineering summer schools'
            ],
            'creative_arts': [
                'Build a strong portfolio',
                'Enter art competitions',
                'Visit galleries and exhibitions',
                'Explore different media and techniques',
                'Document your creative development'
            ]
        };

        return enrichment[pathwayId] || [
            'Join relevant subject societies',
            'Pursue enrichment in your areas of interest',
            'Consider the Extended Project Qualification',
            'Attend lectures and speaker events',
            'Explore careers guidance resources'
        ];
    }

    /**
     * Get Oxbridge-specific notes
     */
    getOxbridgeNotes(pathwayId) {
        const notes = {
            'medicine_health': {
                requirements: 'A*AA typically required (A* in Chemistry or Biology)',
                additionalTests: 'BMAT for Cambridge, most Oxford colleges use UCAT',
                interviewNotes: 'Multiple Mini Interviews (MMIs) - practice essential',
                clcSupport: 'Dedicated Oxbridge preparation programme, mock interviews with medical professionals'
            },
            'law': {
                requirements: 'A*AA typically required',
                additionalTests: 'LNAT for many colleges',
                interviewNotes: 'Problem-solving and legal reasoning assessed',
                clcSupport: 'Strong debating programme, mooting experience'
            },
            'science_research': {
                requirements: 'A*A*A for Natural Sciences/Physics',
                additionalTests: 'Some colleges use NSAA/PAT',
                interviewNotes: 'Problem-solving at the board common',
                clcSupport: 'Olympiad preparation, EPQ research opportunities'
            }
        };

        return notes[pathwayId] || {
            requirements: 'Typically A*AA or higher',
            additionalTests: 'Check specific college requirements',
            interviewNotes: 'Subject-specific interviews focus on thinking skills',
            clcSupport: 'Dedicated Oxbridge preparation programme'
        };
    }

    /**
     * Format recommendation for display
     */
    formatForDisplay(recommendation) {
        let html = '';

        // Subjects
        html += '<div class="subject-recommendations">';
        html += '<h4>Recommended Subjects</h4>';

        const essential = recommendation.subjects.filter(s => s.priority === 'essential');
        const recommended = recommendation.subjects.filter(s => s.priority === 'recommended');
        const optional = recommendation.subjects.filter(s => s.priority === 'preferred' || s.priority === 'optional');

        if (essential.length) {
            html += '<div class="subject-group"><h5>Essential</h5>';
            essential.forEach(s => {
                html += `<span class="subject-tag subject-tag--essential">${s.subject}</span>`;
            });
            html += '</div>';
        }

        if (recommended.length) {
            html += '<div class="subject-group"><h5>Recommended</h5>';
            recommended.forEach(s => {
                html += `<span class="subject-tag subject-tag--recommended">${s.subject}</span>`;
            });
            html += '</div>';
        }

        if (optional.length) {
            html += '<div class="subject-group"><h5>Good Options</h5>';
            optional.forEach(s => {
                html += `<span class="subject-tag">${s.subject}</span>`;
            });
            html += '</div>';
        }

        html += '</div>';

        // Warnings
        if (recommendation.warnings.length) {
            html += '<div class="recommendation-warnings">';
            recommendation.warnings.forEach(w => {
                html += `<p class="warning">${w.message}</p>`;
            });
            html += '</div>';
        }

        // CLC Strengths
        if (recommendation.clcStrengths.length) {
            html += '<div class="clc-strengths"><h4>CLC Advantages</h4><ul>';
            recommendation.clcStrengths.forEach(s => {
                html += `<li>${s}</li>`;
            });
            html += '</ul></div>';
        }

        // Enrichment
        if (recommendation.enrichment?.length) {
            html += '<div class="enrichment"><h4>Enrichment Opportunities</h4><ul>';
            recommendation.enrichment.forEach(e => {
                html += `<li>${e}</li>`;
            });
            html += '</ul></div>';
        }

        return html;
    }
}

// Create global instance
window.careerPathwaysEngine = new CareerPathwaysEngine();

// Export class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CareerPathwaysEngine;
}
