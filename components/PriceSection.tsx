"use client";

import { property } from "@/config/property";
import { useReveal } from "./useReveal";

export default function PriceSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} aria-label="Price" className="px-6 py-32 md:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <p className="reveal text-[10px] uppercase tracking-luxe text-bone-dim">
          Offered at
        </p>
        <p
          className="reveal mt-8 font-serif text-6xl font-light tracking-tight text-bone sm:text-7xl md:text-8xl"
          style={{ "--reveal-delay": "150ms" } as React.CSSProperties}
        >
          {property.price}
        </p>
        <div
          className="reveal gold-rule mx-auto mt-12 w-40"
          style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
        />
        <a
          href="#contact"
          className="reveal mt-12 inline-block border border-gold/40 px-10 py-4 text-[11px] uppercase tracking-luxe text-gold transition-colors duration-700 ease-luxe hover:border-gold hover:bg-gold/5"
          style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
        >
          Request a Private Showing
        </a>
      </div>
    </section>
  );
}
