export async function sendCharacterMessage(characterId: string, message: string) {
  const response = await fetch('/api/character-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, message })
  });
  return response.json();
}
