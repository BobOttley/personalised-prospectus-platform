/**
 * Bloxham School Module Visibility
 * Shows/hides content based on user selections
 */

function showRelevantModules(data) {
  const boardingType = data.boarding_type;
  const sports = Array.isArray(data.sports) ? data.sports : (data.sports ? [data.sports] : []);
  const music = Array.isArray(data.music) ? data.music : (data.music ? [data.music] : []);
  const activities = Array.isArray(data.activities) ? data.activities : (data.activities ? [data.activities] : []);
  const dramaInterest = data.drama_interest;

  // Handle conditional modules
  document.querySelectorAll('[data-show-if]').forEach(module => {
    const condition = module.dataset.showIf;
    const [field, value] = condition.split(':');

    let show = false;

    switch(field) {
      case 'entry_type':
        if (value === 'boarding') {
          show = ['full_boarding', 'weekly_boarding', 'day_boarding'].includes(boardingType);
        } else if (value === 'day') {
          show = boardingType === 'day';
        }
        break;

      case 'interest':
        if (value === 'sport') {
          show = sports.length > 0;
        } else if (value === 'music') {
          show = music.length > 0;
        } else if (value === 'drama') {
          show = dramaInterest === 'yes';
        } else if (value === 'activities') {
          show = activities.length > 0;
        }
        break;

      case 'entry_year':
        show = checkYearCondition(data.entry_year, value);
        break;
    }

    module.style.display = show ? 'block' : 'none';
  });
}

function showRelevantSports(data) {
  const selectedSports = Array.isArray(data.sports) ? data.sports : (data.sports ? [data.sports] : []);

  // Hide all sport modules first
  document.querySelectorAll('.sport-module').forEach(module => {
    const sport = module.dataset.sport;
    if (sport) {
      module.style.display = selectedSports.includes(sport) ? 'block' : 'none';
    }
  });
}

function showRelevantEnsembles(data) {
  const selectedMusic = Array.isArray(data.music) ? data.music : (data.music ? [data.music] : []);

  // Show chapel choir ensemble if selected
  const chapelChoirSection = document.getElementById('ensemble-chapel-choir');
  if (chapelChoirSection) {
    chapelChoirSection.style.display = selectedMusic.includes('chapel_choir') ? 'block' : 'none';
  }
}

function checkYearCondition(entryYear, condition) {
  const yearMapping = {
    'year7': 7,
    'year8': 8,
    'year9': 9,
    'year10': 10,
    'year11': 11,
    'year12': 12,
    'year13': 13
  };

  const year = yearMapping[entryYear] || 9;

  switch(condition) {
    case 'lower-school':
      return year <= 8;
    case 'third-form':
      return year === 9;
    case 'gcse':
      return year >= 9 && year <= 11;
    case 'sixth-form':
      return year >= 12;
    case 'senior':
      return year >= 9;
    default:
      return true;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showRelevantModules, showRelevantSports, showRelevantEnsembles };
}
