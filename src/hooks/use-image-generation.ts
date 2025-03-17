import { useState } from 'react';
import { stableDiffusionService } from '@/lib/services/stable-diffusion';
import { supabase } from '@/lib/supabase/client';

export function useImageGeneration() {
  const [loading, setLoading] = useState(false);

  const generateAndSaveImage = async (prompt: string, questionId: string) => {
    try {
      setLoading(true);
      
      // Generate image using Stable Diffusion
      const imageData = await stableDiffusionService.generateImage(prompt);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('question-images')
        .upload(`${questionId}.png`, imageData, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(`${questionId}.png`);

      return publicUrl;
    } catch (error) {
      console.error('Failed to generate/save image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateAndSaveImage,
    loading
  };
}
