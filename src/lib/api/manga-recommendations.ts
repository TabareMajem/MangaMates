export async function getMangaRecommendations(profile: any) {
  const response = await fetch('/api/recommendations/manga', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });
  return response.json();
}
