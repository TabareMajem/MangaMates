export function calculateAssessmentScore(answers: Record<string, string>, type: string) {
  switch (type) {
    case 'values':
      return calculateValuesScore(answers);
    case 'bartle':
      return calculateBartleScore(answers);
    case 'big-five':
      return calculateBigFiveScore(answers);
    case 'mental-health':
      return calculateMentalHealthScore(answers);
    default:
      throw new Error(`Unknown assessment type: ${type}`);
  }
}

function calculateValuesScore(answers: Record<string, string>) {
  const scores: Record<string, number> = {
    Leadership: 0,
    Collaboration: 0,
    Independence: 0,
    Wisdom: 0,
    Strategic: 0,
    Creativity: 0
  };

  // Calculate raw scores
  Object.values(answers).forEach(answer => {
    const [trait, score] = answer.split('-');
    scores[trait] = (scores[trait] || 0) + parseInt(score);
  });

  // Normalize scores to percentages
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    Object.entries(scores).map(([trait, score]) => [
      trait,
      (score / total) * 100
    ])
  );
}

function calculateBartleScore(answers: Record<string, string>) {
  const scores = {
    Achiever: 0,
    Explorer: 0,
    Socializer: 0,
    Killer: 0
  };

  Object.values(answers).forEach(answer => {
    scores[answer as keyof typeof scores] += 1;
  });

  // Convert to percentages
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    Object.entries(scores).map(([type, score]) => [
      type,
      (score / total) * 100
    ])
  );
}

// Add other scoring functions...
