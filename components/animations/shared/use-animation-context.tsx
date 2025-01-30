"use client";

import { createContext, useContext, useState } from "react";

interface AnimationContextType {
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
}

export const AnimationContext = createContext<AnimationContextType>({
  isReducedMotion: false,
  toggleReducedMotion: () => {
    const current = localStorage.getItem('reducedMotion') === 'true';
    localStorage.setItem('reducedMotion', (!current).toString());
    window.dispatchEvent(new Event('motion-preference-change'));
  }
});

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const toggleReducedMotion = () => setIsReducedMotion(prev => !prev);

  return (
    <AnimationContext.Provider value={{ isReducedMotion, toggleReducedMotion }}>
      {children}
    </AnimationContext.Provider>
  );
}

export const useAnimationContext = () => useContext(AnimationContext);
