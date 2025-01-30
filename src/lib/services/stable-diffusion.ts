export class StableDiffusionService {
  private readonly API_KEY = process.env.VITE_STABLE_DIFFUSION_API_KEY;
  private readonly API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      return result.artifacts[0].base64; // Base64 image data
    } catch (error) {
      console.error('Image generation failed:', error);
      throw error;
    }
  }
}

export const stableDiffusionService = new StableDiffusionService();
