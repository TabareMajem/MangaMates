"use client";

import { useSpring, animated } from "@react-spring/web";

interface AnimatedValueProps {
  value: number;
  format?: (value: number) => string;
}

export function AnimatedValue({ value, format = (v) => v.toFixed(1) }: AnimatedValueProps) {
  const spring = useSpring({
    from: { value: 0 },
    to: { value },
    config: { tension: 300, friction: 20 }
  });

  return (
    <animated.span>
      {spring.value.to(v => format(v))}
    </animated.span>
  );
}
