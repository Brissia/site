"use client";

import { useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";

export interface TimelineItem {
  key: string;
  dates: string;
  title: string;
  organization: string;
  place?: string;
  note?: string;
}

/**
 * A line that draws itself as the page scrolls, with each role arriving as the line reaches it.
 * With "reduce motion" on, everything is simply there.
 */
export function TimelineTrack({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative ml-[5px] border-l border-border">
      <m.span aria-hidden style={{ scaleY: progress }} className="absolute -left-px top-0 h-full w-px origin-top bg-foreground" />
      {items.map((item) => (
        <li key={item.key} className="relative pb-10 pl-8 last:pb-0 md:pb-14 md:pl-12">
          <m.span
            aria-hidden
            initial={{ scale: 0.4, backgroundColor: "var(--background)" }}
            whileInView={{ scale: 1, backgroundColor: "var(--foreground)" }}
            viewport={{ once: true, margin: "0px 0px -30% 0px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute -left-[5px] top-1 size-[9px] rounded-full border border-foreground"
          />
          <m.div
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -22% 0px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="meta">{item.dates}</p>
            <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight md:text-4xl">{item.title}</h3>
            <p className="mt-1 text-[15px] text-muted md:text-base">
              {item.organization}
              {item.place && <> · {item.place}</>}
            </p>
            {item.note && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{item.note}</p>}
          </m.div>
        </li>
      ))}
    </ol>
  );
}
