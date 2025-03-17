"use client";

import { Card } from '@/components/ui/card';
import { useImageGeneration } from '@/hooks/use-image-generation';
import { useCallback, useEffect, useState } from 'react';

interface QuestionImageProps {
  questionId: string;
  prompt: string;
}

export function QuestionImage({ questionId, prompt }: QuestionImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { generateAndSaveImage, loading } = useImageGeneration();

  const generateAndSaveImage = useCallback(async () => {
    try {
      const url = await generateAndSaveImage(prompt, questionId);
      setImageUrl(url);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!imageUrl) {
      generateAndSaveImage();
    }
  }, [imageUrl, generateAndSaveImage]);

  return (
    <Card className="w-full aspect-video overflow-hidden bg-secondary/20">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Generating image...</span>
        </div>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Question illustration" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Image unavailable</span>
        </div>
      )}
    </Card>
  );
}
