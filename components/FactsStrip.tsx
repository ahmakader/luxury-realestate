"use client";

import { property } from "@/config/property";
import { useReveal } from "./useReveal";

export default function FactsStrip() {
  const ref = useReveal<HTMLElement>();
  const facts: { value: string; label: string }[] = [
    { value: String(property.bedrooms), label: "Bedrooms" },
    { value: String(property.bathrooms), label: "Bathrooms" },
    { value: property.sqft.toLocaleString("en-US"), label: "Square Feet" },
    { value: "—", label: property.signatureFact },
  ];

  return (
    <section
      id="residence"
      ref={ref}
      aria-label="Residence facts"
      className="border-y border-white/5 bg-ink-soft"
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {facts.map((f, i) => (
          <div
            key={f.label}
            className="reveal flex flex-col items-center gap-2 px-4 py-12 text-center md:py-16"
            style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
          >
            <dd className="font-serif text-4xl font-light text-bone md:text-5xl">
              {f.value === "—" ? (
                <span aria-hidden="true" className="text-gold">
                  ◆
                </span>
              ) : (
                f.value
              )}
            </dd>
            <dt className="text-[10px] uppercase tracking-luxe text-bone-dim">
              {f.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
