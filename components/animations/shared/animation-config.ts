export const springConfig = {
  default: { tension: 300, friction: 20 },
  gentle: { tension: 200, friction: 15 },
  bouncy: { tension: 400, friction: 10 },
  slow: { tension: 150, friction: 25 }
} as const;

export const fadeConfig = {
  default: { y: 20, duration: 300 },
  slide: { x: 20, duration: 300 },
  scale: { scale: 0.95, duration: 300 }
} as const;
