"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function usePersonalizedPrompts() {
  const { user } = useAuth();
  const [currentPrompt, setCurrentPrompt] = useState("");

  const generateNewPrompt = async () => {
    if (!user) return;

    const response = await fetch(`/api/prompts/generate?userId=${user.id}`);
    const data = await response.json();
    setCurrentPrompt(data.prompt);
  };

  useEffect(() => {
    generateNewPrompt();
  }, [user]);

  return { currentPrompt, generateNewPrompt };
}
