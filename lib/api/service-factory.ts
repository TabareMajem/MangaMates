export const createServices = () => {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key missing');
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('Anthropic API key missing');
  // ... validate other keys
};
