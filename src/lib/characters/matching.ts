import type { PersonalityProfile } from "@/types/profile";
import type { MangaCharacter, CharacterMatch } from "@/types/agent";
import { PRESET_CHARACTERS } from "@/data/preset-characters";

export function findMatchingCharacters(
  profile: PersonalityProfile,
  limit = 3
): CharacterMatch[] {
  const matches = PRESET_CHARACTERS.map(character => {
    const matchScore = calculateMatchScore(profile, character);
    const matchReasons = getMatchReasons(profile, character);

    return {
      character,
      matchScore,
      matchReasons
    };
  });

  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function calculateMatchScore(
  profile: PersonalityProfile,
  character: MangaCharacter
): number {
  let score = 0;

  // Match values
  const valueMatch = character.matchCriteria.values.filter(value =>
    profile.topValues.includes(value)
  ).length;
  score += valueMatch * 0.3;

  // Match strengths
  const strengthMatch = character.matchCriteria.strengths.filter(strength =>
    profile.dominantStrengths.includes(strength)
  ).length;
  score += strengthMatch * 0.3;

  // Match Big Five
  const bigFiveMatch = calculateBigFiveMatch(profile, character);
  score += bigFiveMatch * 0.4;

  return score;
}

function calculateBigFiveMatch(
  profile: PersonalityProfile,
  character: MangaCharacter
): number {
  // Implementation details...
  return 0.5; // Placeholder
}

function getMatchReasons(
  profile: PersonalityProfile,
  character: MangaCharacter
): string[] {
  const reasons: string[] = [];

  // Add matching values
  character.matchCriteria.values.forEach(value => {
    if (profile.topValues.includes(value)) {
      reasons.push(`Shares your value of ${value}`);
    }
  });

  // Add matching strengths
  character.matchCriteria.strengths.forEach(strength => {
    if (profile.dominantStrengths.includes(strength)) {
      reasons.push(`Matches your strength in ${strength}`);
    }
  });

  return reasons;
}
