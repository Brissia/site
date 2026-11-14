"use client";

import { LazyMotion, MotionConfig, domAnimation, useScroll } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

/** Loads only the animation features in use and honors "reduce motion". */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/**
 * The one entrance in the system: a short fade with a few pixels of travel.
 * 350ms, ease-out. Nothing bounces, nothing overshoots.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}

/** Reading progress for long-form pages. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-foreground"
    />
  );
}
