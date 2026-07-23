"use client";

import { useEffect, useRef, useState } from "react";
import { property } from "@/config/property";
import { useReveal } from "./useReveal";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Thin-line stat icons, matching the amenity icon style. */
const FACT_ICONS: Record<string, React.ReactNode> = {
  bed: (
    <>
      <path d="M3 6.5v12M3 14.5h18v4M9.5 10.5H19a2 2 0 0 1 2 2v2" />
      <circle cx="6.25" cy="11" r="1.25" />
    </>
  ),
  bath: (
    <>
      <path d="M4 12.5h16v2.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M4 12.5V6a2 2 0 0 1 4 0v.5M6.5 19.5 5.5 21M17.5 19.5l1 1.5" />
    </>
  ),
  area: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" />
      <path d="m8.5 15.5 7-7M15.5 12.5v-4h-4" />
    </>
  ),
  elevator: (
    <>
      <rect x="5.5" y="3.5" width="13" height="17" rx="1" />
      <path d="M9.5 9.5 12 7l2.5 2.5M9.5 14.5 12 17l2.5-2.5" />
    </>
  ),
};

/** rAF count-up from 0 once started; jumps straight to the target under
 *  prefers-reduced-motion. */
function useCountUp(target: number, decimals: number, started: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const duration = 800;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setValue(target * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, started]);

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface Fact {
  icon: keyof typeof FACT_ICONS;
  label: string;
  value?: number;
  decimals?: number;
}

function FactCell({ fact, index, started }: { fact: Fact; index: number; started: boolean }) {
  const display = useCountUp(fact.value ?? 0, fact.decimals ?? 0, started);

  return (
    <div
      className="reveal flex flex-col items-center gap-3 px-4 py-12 text-center md:py-16"
      style={{ "--reveal-delay": `${index * 120}ms` } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        className="text-gold-dim"
        {...strokeProps}
      >
        {FACT_ICONS[fact.icon]}
      </svg>
      <dd className="flex h-10 items-center font-serif text-4xl font-light tabular-nums text-bone md:h-12 md:text-5xl">
        {fact.value !== undefined ? (
          display
        ) : (
          <span aria-hidden="true" className="text-lg text-gold/80">
            ◆
          </span>
        )}
      </dd>
      <span
        aria-hidden="true"
        className="draw-line h-px w-12 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        style={{ "--reveal-delay": `${index * 150 + 250}ms` } as React.CSSProperties}
      />
      <dt className="text-[10px] uppercase tracking-luxe text-bone-dim">{fact.label}</dt>
    </div>
  );
}

export default function FactsStrip() {
  const ref = useReveal<HTMLElement>();
  const [started, setStarted] = useState(false);

  // Kick the count-up once the strip is meaningfully in view.
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facts: Fact[] = [
    { icon: "bed", label: "Bedrooms", value: property.bedrooms },
    { icon: "bath", label: "Bathrooms", value: property.bathrooms, decimals: property.bathrooms % 1 ? 1 : 0 },
    { icon: "area", label: "Square Feet", value: property.sqft },
    { icon: "elevator", label: property.signatureFact },
  ];

  return (
    <section
      id="residence"
      ref={ref}
      aria-label="Residence facts"
      className="border-y border-white/5 bg-ink-soft"
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 md:divide-x md:divide-white/10">
        {facts.map((fact, i) => (
          <FactCell key={fact.label} fact={fact} index={i} started={started} />
        ))}
      </dl>
    </section>
  );
}
