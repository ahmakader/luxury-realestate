"use client";

import { useEffect, useRef } from "react";
import { property } from "@/config/property";
import AmenityIcon from "./AmenityIcon";
import { useReveal } from "./useReveal";

/** How far (px) the background drifts across the section's full scroll pass. */
const PARALLAX_RANGE = 44;

export default function Amenities() {
  const ref = useReveal<HTMLElement>();
  const bgRef = useRef<HTMLDivElement>(null);

  // Ambient background: the final tour space's still (the terrace here) —
  // blurred and buried under a heavy ink overlay, drifting slightly slower
  // than the content for depth. Disabled under prefers-reduced-motion.
  const { spaces } = property.media.tour;
  const ambientStill = spaces[spaces.length - 1].still;

  useEffect(() => {
    const section = ref.current;
    const bg = bgRef.current;
    if (!section || !bg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the section enters from below, +1 as it leaves above.
      const progress = Math.max(
        -1,
        Math.min(1, (rect.top + rect.height / 2 - vh / 2) / ((vh + rect.height) / 2)),
      );
      bg.style.transform = `translate3d(0, ${(-progress * PARALLAX_RANGE).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Amenities"
      className="relative overflow-hidden border-y border-white/5 bg-ink-soft px-6 py-24 md:py-36"
    >
      {/* Ambient backdrop — oversized so the blur and parallax never expose edges */}
      <div ref={bgRef} className="absolute -inset-x-4 -inset-y-16 will-change-transform" aria-hidden="true">
        <img
          src={ambientStill}
          alt=""
          loading="lazy"
          className="h-full w-full scale-105 object-cover blur-[6px]"
        />
        <div className="absolute inset-0 bg-[rgba(10,10,10,0.87)]" />
        {/* Soften the top/bottom seams into the neighbouring sections */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <p className="reveal text-center text-[10px] uppercase tracking-luxe text-gold">
          Amenities
        </p>
        <h2 className="reveal mt-4 text-center font-serif text-3xl font-light text-bone md:text-5xl">
          Considered in every detail
        </h2>

        <ul className="mt-16">
          {property.amenities.map((amenity, i) => (
            <li
              key={amenity}
              tabIndex={0}
              className="reveal group relative flex items-center gap-5 border-b border-white/5 py-6 outline-none first:border-t md:gap-6"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              {/* Thin-line icon — desktop only, fades in from the left on hover */}
              <span
                aria-hidden="true"
                className="hidden w-6 shrink-0 -translate-x-1.5 justify-center text-gold opacity-0 transition-all duration-[350ms] ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 md:flex"
              >
                <AmenityIcon amenity={amenity} />
              </span>

              <span
                aria-hidden="true"
                className="w-7 shrink-0 font-serif text-sm tabular-nums text-gold-dim transition-all duration-[350ms] ease-out group-hover:scale-110 group-hover:text-gold group-focus-within:scale-110 group-focus-within:text-gold group-active:scale-110 group-active:text-gold"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="font-serif text-lg font-light text-bone transition-transform duration-[350ms] ease-out group-hover:translate-x-1.5 group-focus-within:translate-x-1.5 group-active:translate-x-1.5 md:text-xl">
                {amenity}
              </span>

              {/* Underline that draws in left → right */}
              <span
                aria-hidden="true"
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold/70 via-gold/40 to-transparent transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 group-active:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
