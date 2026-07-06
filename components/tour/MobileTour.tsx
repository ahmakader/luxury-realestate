"use client";

import { property } from "@/config/property";
import { useReveal } from "../useReveal";

/**
 * Mobile (<768px) tour: a lightweight autoplay-muted-loop film followed by a
 * stacked still per space. Cinematic, but no scroll hijacking and no heavy
 * frame sequence.
 */
export default function MobileTour() {
  const ref = useReveal<HTMLElement>();
  const { tour, mobileTourVideo, mobileTourPoster } = property.media;

  return (
    <section ref={ref} aria-label="Cinematic tour" className="py-20">
      <div className="px-6 text-center">
        <p className="reveal text-[10px] uppercase tracking-luxe text-gold">The Tour</p>
        <h2 className="reveal mt-4 font-serif text-3xl font-light text-bone">
          One continuous gesture
        </h2>
      </div>

      <video
        className="mt-10 w-full"
        src={mobileTourVideo}
        poster={mobileTourPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Continuous cinematic tour through the residence"
      />

      <div className="mt-4 space-y-12 px-6 pt-8">
        {tour.spaces.map((space, i) => (
          <figure key={space.id} className="reveal">
            <img
              src={space.still}
              alt={`${space.name}. ${space.caption}`}
              width={1600}
              height={900}
              loading="lazy"
              className="w-full"
            />
            <figcaption className="mt-4">
              <p className="text-[10px] uppercase tracking-luxe text-gold">
                {String(i + 1).padStart(2, "0")} — {space.name}
              </p>
              <p className="mt-1 font-serif text-base font-light italic text-bone-dim">
                {space.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
