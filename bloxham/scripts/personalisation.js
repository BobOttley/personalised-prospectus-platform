/**
 * Bloxham School Personalisation Engine
 * Handles all name replacements and pronoun adjustments
 */

function getPronouns(gender) {
  const pronouns = {
    boy: { subject: 'he', object: 'him', possessive: 'his', child: 'son' },
    girl: { subject: 'she', object: 'her', possessive: 'her', child: 'daughter' },
    neutral: { subject: 'they', object: 'them', possessive: 'their', child: 'child' }
  };
  return pronouns[gender] || pronouns.neutral;
}

function personalise(data) {
  const childName = data.child_first_name || data.child_name || 'your child';
  const familyName = data.parent_surname || data.child_surname || data.family_name || 'your family';
  const parentTitle = data.parent_title || `The ${familyName} Family`;
  const pronouns = getPronouns(data.child_gender);

  // Replace all data-field spans
  document.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;

    switch(field) {
      case 'child_name':
        el.textContent = childName;
        break;
      case 'family_name':
        el.textContent = familyName;
        break;
      case 'parent_title':
        el.textContent = parentTitle;
        break;
      case 'pronoun_subject':
        el.textContent = pronouns.subject;
        break;
      case 'pronoun_object':
        el.textContent = pronouns.object;
        break;
      case 'pronoun_possessive':
        el.textContent = pronouns.possessive;
        break;
      case 'child_word':
        el.textContent = pronouns.child;
        break;
      case 'entry_year':
        el.textContent = formatEntryYear(data.entry_year);
        break;
      case 'entry_date':
        el.textContent = formatEntryDate(data.entry_date);
        break;
    }
  });

  // Update page title
  document.title = `${childName}'s Personalised Prospectus | Bloxham School`;

  // Count name uses for validation
  const nameCount = document.querySelectorAll('[data-field="child_name"]').length;
  console.log(`Child's name appears ${nameCount} times in the prospectus`);
}

function formatEntryYear(year) {
  const years = {
    'year7': 'Year 7 (First Form)',
    'year8': 'Year 8 (Second Form)',
    'year9': 'Year 9 (Third Form)',
    'year10': 'Year 10 (Fourth Form)',
    'year11': 'Year 11 (Fifth Form)',
    'year12': 'Year 12 (Lower Sixth)',
    'year13': 'Year 13 (Upper Sixth)'
  };
  return years[year] || year;
}

function formatEntryDate(date) {
  const dates = {
    'september2025': 'September 2025',
    'january2026': 'January 2026',
    'september2026': 'September 2026',
    'september2027': 'September 2027',
    'september2028': 'September 2028'
  };
  return dates[date] || date;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { personalise, getPronouns };
}
