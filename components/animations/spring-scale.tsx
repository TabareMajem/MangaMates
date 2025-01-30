"use client";

import { useSpring, animated } from "@react-spring/web";
import { cn } from "@/lib/utils";

interface SpringScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function SpringScale({ 
  children, 
  scale = 1.05, 
  className 
}: SpringScaleProps) {
  const [springs, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 20 }
  }));

  return (
    <animated.div
      style={springs}
      onMouseEnter={() => api.start({ scale })}
      onMouseLeave={() => api.start({ scale: 1 })}
      className={cn("transition-transform", className)}
    >
      {children}
    </animated.div>
  );
}
