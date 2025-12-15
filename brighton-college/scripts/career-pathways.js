/**
 * Brighton College Career Pathway Engine
 * Generates personalised career recommendations for Sixth Form prospectus
 */

class CareerPathwayEngine {
  constructor() {
    this.pathways = this.definePathways();
  }

  /**
   * Define all career pathways with recommendations
   */
  definePathways() {
    return {
      'Medicine': {
        title: 'Medicine',
        icon: '🩺',
        essential: ['Biology', 'Chemistry'],
        recommended: ['Mathematics', 'Psychology', 'Physics'],
        activities: [
          'Medical Society',
          'Hospital Volunteering',
          'Extended Project Qualification (EPQ)',
          'UCAT/BMAT Preparation',
          'First Aid Training'
        ],
        universities: [
          { name: 'Cambridge', note: 'Top destination for BC medics' },
          { name: 'Oxford', note: 'Strong tradition' },
          { name: 'Imperial College London', note: 'Excellent medical programme' },
          { name: 'UCL', note: 'Research-led teaching' },
          { name: 'Edinburgh', note: 'Scottish excellence' }
        ],
        bcAdvantages: [
          'Head of Medical Applications - dedicated support',
          '22 medical school places in 2024',
          'UCAT and BMAT preparation classes',
          'Hospital work experience partnerships',
          'Mock interviews with medical professionals'
        ],
        stats: {
          places2024: 22,
          successRate: '85%'
        },
        quote: '"Brighton\'s medical preparation was exceptional. The mock interviews and BMAT tutoring made all the difference."'
      },

      'Law': {
        title: 'Law',
        icon: '⚖️',
        essential: [],
        recommended: ['English Literature', 'History', 'Politics', 'Philosophy', 'Economics'],
        activities: [
          'Debating Society',
          'Model United Nations',
          'Law Society',
          'Mooting Competitions',
          'Essay Competitions'
        ],
        universities: [
          { name: 'Oxford', note: 'World-leading law faculty' },
          { name: 'Cambridge', note: 'Exceptional jurisprudence' },
          { name: 'LSE', note: 'London legal hub' },
          { name: 'UCL', note: 'Strong research focus' },
          { name: 'Durham', note: 'Traditional excellence' }
        ],
        bcAdvantages: [
          '43 Oxbridge offers in 2024',
          'Strong humanities tradition',
          'Award-winning debating team',
          'Work experience at leading chambers',
          'LNAT preparation support'
        ],
        stats: {
          oxbridgeOffers: 43,
          successRate: '33% Oxbridge'
        },
        quote: '"The critical thinking skills I developed at Brighton were exactly what Oxford Law was looking for."'
      },

      'Engineering': {
        title: 'Engineering',
        icon: '⚙️',
        essential: ['Mathematics', 'Physics'],
        recommended: ['Further Mathematics', 'Chemistry', 'Design & Technology', 'Computer Science'],
        activities: [
          'Robotics Club',
          'Engineering Society',
          'STEM Olympiads',
          'F1 in Schools',
          'Design Projects'
        ],
        universities: [
          { name: 'Cambridge', note: 'World-class engineering' },
          { name: 'Imperial College London', note: 'Industry connections' },
          { name: 'Oxford', note: 'Engineering Science' },
          { name: 'Bristol', note: 'Aerospace excellence' },
          { name: 'Manchester', note: 'Research powerhouse' }
        ],
        bcAdvantages: [
          'Head of Engineering Applications',
          'Top School for STEM 2024 (The Week)',
          'School of Science and Sport facilities',
          'Industry mentorship programme',
          'Engineering Olympiad success'
        ],
        stats: {
          stemAward: 2024,
          successRate: 'Top STEM results'
        },
        quote: '"The Engineering Society projects gave me incredible practical experience to discuss at interview."'
      },

      'Business & Finance': {
        title: 'Business & Finance',
        icon: '📈',
        essential: ['Mathematics'],
        recommended: ['Economics', 'Further Mathematics', 'Politics', 'History'],
        activities: [
          'Enterprise Society',
          'Economics Club',
          'Young Enterprise',
          'Investment Challenge',
          'Business Competitions'
        ],
        universities: [
          { name: 'LSE', note: 'Global finance hub' },
          { name: 'Warwick', note: 'Business excellence' },
          { name: 'Cambridge', note: 'Economics powerhouse' },
          { name: 'Oxford', note: 'PPE and Economics' },
          { name: 'Imperial', note: 'Business School' }
        ],
        bcAdvantages: [
          'Global outlook - 13 schools worldwide',
          'Strong networking opportunities',
          'Alumni in leading financial institutions',
          'Economics Olympiad success',
          'Real-world business projects'
        ],
        stats: {
          globalSchools: 13,
          topResults: '98% A*-B'
        },
        quote: '"Brighton\'s international perspective and economics teaching prepared me perfectly for LSE."'
      },

      'Sciences & Research': {
        title: 'Sciences & Research',
        icon: '🔬',
        essential: ['Mathematics', 'Relevant Science (Biology/Chemistry/Physics)'],
        recommended: ['Further Mathematics', 'Second Science', 'Computer Science'],
        activities: [
          'Science Society',
          'Research Projects',
          'Science Olympiads',
          'Extended Project Qualification',
          'Lab Research Placements'
        ],
        universities: [
          { name: 'Cambridge', note: 'Natural Sciences' },
          { name: 'Oxford', note: 'Research excellence' },
          { name: 'Imperial', note: 'STEM focus' },
          { name: 'UCL', note: 'Research-intensive' },
          { name: 'Edinburgh', note: 'Scottish powerhouse' }
        ],
        bcAdvantages: [
          'Top School for STEM 2024',
          'School of Science and Sport (2021)',
          'Research project opportunities',
          'Olympiad preparation and success',
          'University lab visit programme'
        ],
        stats: {
          stemRanking: 'Top 1%',
          facilities: '2021 new build'
        },
        quote: '"The research project I completed at Brighton became the core of my Cambridge application."'
      },

      'Creative Arts': {
        title: 'Creative Arts',
        icon: '🎨',
        essential: ['Art', 'Design & Technology'],
        recommended: ['English Literature', 'History of Art', 'Photography'],
        activities: [
          'Art exhibitions',
          'Portfolio development',
          'Gallery visits',
          'Design competitions',
          'Artist residencies'
        ],
        universities: [
          { name: 'UAL (Central Saint Martins)', note: 'World-leading art school' },
          { name: 'Goldsmiths', note: 'Contemporary art focus' },
          { name: 'Royal College of Art', note: 'Postgraduate excellence' },
          { name: 'Slade School of Fine Art', note: 'UCL\'s art school' },
          { name: 'Oxford (Ruskin)', note: 'Fine Art programme' }
        ],
        bcAdvantages: [
          'Richard Cairns Building (2024)',
          'Dedicated art studios',
          'Professional portfolio support',
          'Exhibition opportunities',
          'Artist-in-residence programme'
        ],
        stats: {
          newBuilding: 2024,
          exhibitions: 'Termly showcases'
        },
        quote: '"Brighton understood that art is as rigorous as any academic subject. My portfolio flourished here."'
      },

      'Performing Arts': {
        title: 'Performing Arts',
        icon: '🎭',
        essential: ['Drama & Theatre', 'Music', 'Dance'],
        recommended: ['English Literature', 'Film Studies'],
        activities: [
          '15 productions annually',
          'Edinburgh Fringe participation',
          'Brighton Fringe Festival',
          'LAMDA examinations',
          'Masterclasses with professionals'
        ],
        universities: [
          { name: 'RADA', note: 'Elite drama training' },
          { name: 'Mountview', note: 'Industry connections' },
          { name: 'Royal Academy of Music', note: 'Music conservatoire' },
          { name: 'Bristol Old Vic', note: 'Theatre school' },
          { name: 'Oxford/Cambridge', note: 'Music and Drama' }
        ],
        bcAdvantages: [
          '400-seat professional theatre (2024)',
          'Edinburgh Fringe participation',
          'LAMDA success at highest grades',
          'Dance School with sprung floor',
          'Professional production values'
        ],
        stats: {
          productions: 15,
          theatreSeats: 400
        },
        quote: '"Performing at Edinburgh Fringe while still at school was transformative. RADA was the natural next step."'
      },

      'Humanities & Social Sciences': {
        title: 'Humanities & Social Sciences',
        icon: '📚',
        essential: [],
        recommended: ['History', 'Politics', 'Economics', 'Philosophy', 'Geography', 'English Literature'],
        activities: [
          'Debating Society',
          'Model United Nations',
          'History Society',
          'Politics Society',
          'Essay competitions'
        ],
        universities: [
          { name: 'Oxford', note: 'PPE and humanities' },
          { name: 'Cambridge', note: 'HSPS and History' },
          { name: 'LSE', note: 'Social sciences' },
          { name: 'Durham', note: 'Humanities tradition' },
          { name: 'UCL', note: 'Research excellence' }
        ],
        bcAdvantages: [
          '43 Oxbridge offers 2024',
          'Strong humanities tradition',
          'Academic enrichment programme',
          'University-style tutorial system',
          'Visiting speaker programme'
        ],
        stats: {
          oxbridgeOffers: 43,
          humanities: 'Strong tradition'
        },
        quote: '"Brighton\'s tutorial approach prepared me perfectly for the Oxford supervisions system."'
      },

      'Technology & Computing': {
        title: 'Technology & Computing',
        icon: '💻',
        essential: ['Mathematics', 'Computer Science'],
        recommended: ['Further Mathematics', 'Physics', 'Design & Technology'],
        activities: [
          'Coding Club',
          'Hackathons',
          'Robotics',
          'App Development',
          'AI and Machine Learning projects'
        ],
        universities: [
          { name: 'Cambridge', note: 'Computer Science excellence' },
          { name: 'Imperial', note: 'Tech industry links' },
          { name: 'Oxford', note: 'Computer Science' },
          { name: 'UCL', note: 'AI research' },
          { name: 'Edinburgh', note: 'Informatics' }
        ],
        bcAdvantages: [
          'Top School for STEM 2024',
          'Advanced computing facilities',
          'Industry partnerships',
          'Hackathon success',
          'Startup incubator programme'
        ],
        stats: {
          stemAward: 2024,
          techFocus: 'Growing programme'
        },
        quote: '"The coding projects and hackathons at Brighton gave me real-world experience that set me apart."'
      },

      'Architecture': {
        title: 'Architecture',
        icon: '🏛️',
        essential: ['Mathematics', 'Art'],
        recommended: ['Physics', 'Design & Technology', 'History of Art'],
        activities: [
          'Design projects',
          'Portfolio development',
          'Architecture visits',
          'Model making',
          'CAD training'
        ],
        universities: [
          { name: 'Cambridge', note: 'Architecture programme' },
          { name: 'UCL Bartlett', note: 'World-leading school' },
          { name: 'Manchester', note: 'Strong programme' },
          { name: 'Bath', note: 'Excellent facilities' },
          { name: 'Sheffield', note: 'Design focus' }
        ],
        bcAdvantages: [
          'Combination of STEM and creative excellence',
          'Portfolio development support',
          'Architectural heritage on campus',
          'Design & Technology facilities',
          'University preparation programme'
        ],
        stats: {
          combination: 'Art + STEM',
          portfolio: 'Expert support'
        },
        quote: '"Brighton\'s blend of creative and technical education was perfect preparation for architecture."'
      },

      'Education': {
        title: 'Education',
        icon: '📖',
        essential: [],
        recommended: ['Psychology', 'English', 'Relevant subject specialism'],
        activities: [
          'Peer tutoring',
          'Community volunteering',
          'Teaching placements',
          'Educational research',
          'Working with younger pupils'
        ],
        universities: [
          { name: 'Cambridge', note: 'Education studies' },
          { name: 'Oxford', note: 'Education department' },
          { name: 'UCL IoE', note: 'Institute of Education' },
          { name: 'Durham', note: 'Education programmes' },
          { name: 'Edinburgh', note: 'Moray House' }
        ],
        bcAdvantages: [
          'Peer mentoring opportunities',
          'Community service programme',
          'Teaching experience with prep school',
          'Educational research projects',
          'Psychology department support'
        ],
        stats: {
          community: 'Compulsory service',
          mentoring: 'Strong programme'
        },
        quote: '"Teaching younger pupils at Brighton\'s prep school confirmed my passion for education."'
      },

      'Undecided': {
        title: 'Exploring Your Options',
        icon: '🔍',
        essential: [],
        recommended: ['Keep options open', 'Balance of sciences and humanities', 'Follow your passions'],
        activities: [
          'Try different societies',
          'Extended Project on an area of interest',
          'Work experience in various fields',
          'University visits',
          'Careers guidance sessions'
        ],
        universities: [
          { name: 'Keep options open', note: 'Many subjects don\'t require specific A-Levels' },
          { name: 'Consider your strengths', note: 'What do you enjoy and excel at?' },
          { name: 'Talk to us', note: 'Our Directors of Global Futures can help' }
        ],
        bcAdvantages: [
          'Two Directors of Global Futures',
          'Comprehensive careers guidance',
          'Work experience programme',
          'University visits programme',
          'Gap year planning support'
        ],
        stats: {
          guidance: 'Dedicated support',
          options: '26 A-Level subjects'
        },
        quote: '"Brighton helped me discover what I truly wanted to do. The guidance was invaluable."'
      }
    };
  }

  /**
   * Get pathway data for a specific career interest
   */
  getPathway(careerInterest) {
    return this.pathways[careerInterest] || this.pathways['Undecided'];
  }

  /**
   * Generate HTML for the pathway card
   */
  generatePathwayCard(childName, pronouns, careerInterest) {
    const pathway = this.getPathway(careerInterest);
    const childPossessive = pronouns.possessive;

    let html = `
      <div class="pathway-card">
        <h2 class="pathway-card__title">
          ${pathway.icon} ${childName}'s Pathway to ${pathway.title}
        </h2>

        <div class="pathway-subjects">
          ${pathway.essential.length > 0 ? `
          <div class="pathway-subjects__group">
            <h4>Essential A-Levels for ${childName}</h4>
            <ul class="pathway-subjects__list">
              ${pathway.essential.map(subj => `<li>${subj}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="pathway-subjects__group">
            <h4>Recommended A-Levels</h4>
            <ul class="pathway-subjects__list">
              ${pathway.recommended.slice(0, 4).map(subj => `<li>${subj}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="pathway-activities">
          <h4 style="color: var(--bc-gold); font-size: var(--fs-sm); text-transform: uppercase; margin-bottom: var(--space-sm);">
            Enrichment for ${childName}
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
            ${pathway.activities.slice(0, 5).map(act =>
              `<span style="background: rgba(255,255,255,0.15); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-full); font-size: var(--fs-sm);">${act}</span>`
            ).join('')}
          </div>
        </div>

        <div class="pathway-advantages" style="margin-top: var(--space-xl); background: rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: var(--space-lg);">
          <h4 style="color: var(--bc-gold); font-size: var(--fs-sm); text-transform: uppercase; margin-bottom: var(--space-sm);">
            How Brighton Prepares ${childName}
          </h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${pathway.bcAdvantages.slice(0, 4).map(adv =>
              `<li style="padding: var(--space-xs) 0; display: flex; align-items: flex-start; gap: var(--space-sm);">
                <span style="color: var(--bc-gold);">•</span> ${adv}
              </li>`
            ).join('')}
          </ul>
        </div>

        <div class="pathway-universities">
          <h4 class="pathway-universities__title">Where ${childName} Could Go</h4>
          <div class="pathway-universities__list">
            ${pathway.universities.slice(0, 5).map(uni =>
              `<span class="pathway-universities__item" title="${uni.note}">${uni.name}</span>`
            ).join('')}
          </div>
        </div>

        ${pathway.quote ? `
        <div style="margin-top: var(--space-xl); font-style: italic; opacity: 0.9; text-align: center;">
          ${pathway.quote}
        </div>
        ` : ''}
      </div>
    `;

    return html;
  }

  /**
   * Get matching subjects from selected and recommended
   */
  getSubjectMatch(selectedSubjects, careerInterest) {
    const pathway = this.getPathway(careerInterest);
    const allRecommended = [...pathway.essential, ...pathway.recommended];

    return selectedSubjects.filter(subj =>
      allRecommended.some(rec => rec.toLowerCase().includes(subj.toLowerCase()) ||
                                subj.toLowerCase().includes(rec.toLowerCase()))
    );
  }
}

// Export for use
window.CareerPathwayEngine = CareerPathwayEngine;
