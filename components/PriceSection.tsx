"use client";

import { property } from "@/config/property";
import { useReveal } from "./useReveal";

export default function PriceSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-label="Price"
      className="relative overflow-hidden px-6 py-32 md:py-48"
    >
      {/* Faint radial gold glow centred behind the numeral */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[64rem] max-w-[160vw] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,168,106,0.13), rgba(201,168,106,0.05) 45%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="reveal flex items-center justify-center gap-5">
          <span aria-hidden="true" className="draw-line h-px w-12 bg-gold/40" />
          <p className="text-[10px] uppercase tracking-luxe text-bone-dim">Offered at</p>
          <span aria-hidden="true" className="draw-line h-px w-12 bg-gold/40" />
        </div>
        <p
          className="reveal reveal-zoom mt-8 font-serif text-6xl font-light tracking-tight text-bone sm:text-7xl md:text-8xl"
          style={{
            "--reveal-delay": "150ms",
            textShadow: "0 0 60px rgba(201, 168, 106, 0.22)",
          } as React.CSSProperties}
        >
          {property.price}
        </p>
        <div
          className="reveal mx-auto mt-12 w-40"
          style={{ "--reveal-delay": "350ms" } as React.CSSProperties}
        >
          <div
            className="draw-line gold-rule"
            style={{ "--reveal-delay": "450ms" } as React.CSSProperties}
          />
        </div>
        <a
          href="#contact"
          className="reveal mt-12 inline-block border border-gold/40 px-10 py-4 text-[11px] uppercase tracking-luxe text-gold transition-colors duration-700 ease-luxe hover:border-gold hover:bg-gold/5"
          style={{ "--reveal-delay": "500ms" } as React.CSSProperties}
        >
          Request a Private Showing
        </a>
      </div>
    </section>
  );
}
