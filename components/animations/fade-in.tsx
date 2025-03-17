"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface FadeInProps extends PropsWithChildren {
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  distance?: number;
}

const directionVariants = {
  up: (distance: number) => ({ y: distance }),
  down: (distance: number) => ({ y: -distance }),
  left: (distance: number) => ({ x: distance }),
  right: (distance: number) => ({ x: -distance })
};

export function FadeIn({ 
  children, 
  delay = 0, 
  className = "",
  direction = 'up',
  duration = 0.5,
  distance = 20
}: FadeInProps) {
  const directionOffset = directionVariants[direction](distance);

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directionOffset
      }}
      animate={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Higher-order component for applying fade-in animation
export function withFadeIn<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fadeProps?: Omit<FadeInProps, 'children'>
) {
  return function WithFadeIn(props: P) {
    return (
      <FadeIn {...fadeProps}>
        <WrappedComponent {...props} />
      </FadeIn>
    );
  };
}

// Stagger children with fade-in animation
export function FadeInStagger({ 
  children, 
  staggerDelay = 0.1,
  containerProps,
  ...fadeProps
}: PropsWithChildren<{
  staggerDelay?: number;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
} & Omit<FadeInProps, 'delay'>>) {
  return (
    <div {...containerProps}>
      {React.Children.map(children, (child, index) => (
        <FadeIn
          key={index}
          delay={index * staggerDelay}
          {...fadeProps}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// Fade in on scroll
export function FadeInOnScroll({
  children,
  threshold = 0.1,
  ...fadeProps
}: PropsWithChildren<{
  threshold?: number;
} & Omit<FadeInProps, 'delay'>>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold }}
      variants={{
        hidden: { 
          opacity: 0,
          y: fadeProps.direction === 'down' ? -20 : 20
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: fadeProps.duration || 0.5,
            ease: "easeOut"
          }
        }
      }}
      className={fadeProps.className}
    >
      {children}
    </motion.div>
  );
}
