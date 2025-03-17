"use client";

import { useState, useEffect } from 'react';

const prompts = [
  "What made you feel grateful today?",
  "What's a challenge you overcame recently?",
  "Describe a moment that made you smile today.",
  "What's something new you learned?",
  "What are your goals for tomorrow?"
];

export function useDailyPrompt() {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const today = new Date();
    const index = today.getDate() % prompts.length;
    setPrompt(prompts[index]);
  }, []);

  return { prompt };
}
