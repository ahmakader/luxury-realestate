"use client";

import { property } from "@/config/property";
import { useReveal } from "./useReveal";

export default function Amenities() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label="Amenities"
      className="border-y border-white/5 bg-ink-soft px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-4xl">
        <p className="reveal text-center text-[10px] uppercase tracking-luxe text-gold">
          Amenities
        </p>
        <h2 className="reveal mt-4 text-center font-serif text-3xl font-light text-bone md:text-5xl">
          Considered in every detail
        </h2>

        <ul className="mt-16 space-y-0">
          {property.amenities.map((amenity, i) => (
            <li
              key={amenity}
              className="reveal flex items-baseline gap-6 border-b border-white/5 py-6 first:border-t"
              style={{ "--reveal-delay": `${(i % 4) * 110}ms` } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="font-serif text-sm tabular-nums text-gold-dim"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-lg font-light text-bone md:text-xl">
                {amenity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
