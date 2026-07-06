"use client";

import { property } from "@/config/property";
import { useReveal } from "./useReveal";

export default function Gallery() {
  const ref = useReveal<HTMLElement>();
  const { gallery } = property.media;

  return (
    <section ref={ref} aria-label="Gallery" className="px-6 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="reveal text-center text-[10px] uppercase tracking-luxe text-gold">
          Gallery
        </p>
        <h2 className="reveal mt-4 text-center font-serif text-3xl font-light text-bone md:text-5xl">
          Composed in glass and light
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((image, i) => (
            <figure
              key={image.src}
              className={`reveal overflow-hidden ${i % 3 === 1 ? "lg:mt-12" : ""}`}
              style={{ "--reveal-delay": `${(i % 3) * 130}ms` } as React.CSSProperties}
            >
              <img
                src={image.src}
                alt={image.alt}
                width={1600}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[2000ms] ease-luxe hover:scale-[1.03]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
