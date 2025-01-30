import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.0.0';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  })
);

serve(async (req) => {
  try {
    const { content } = await req.json();

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze the following journal entry for sentiment, emotions, and themes. Return a JSON object with sentiment (0-1), emotions object with values for joy, sadness, anger, fear, surprise, and trust (0-1), and an array of identified themes."
        },
        {
          role: "user",
          content
        }
      ]
    });

    const analysis = JSON.parse(completion.data.choices[0].message?.content || '{}');

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
