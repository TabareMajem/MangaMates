export async function getCharacterRecommendations(profile: any) {
  const response = await fetch('/api/recommendations/characters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });
  return response.json();
}
