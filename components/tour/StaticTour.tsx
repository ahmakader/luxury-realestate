import { property } from "@/config/property";

/**
 * Reduced-motion (and SSR/no-JS) tour: the four spaces as full static images
 * with normal scroll. No canvas, no scrubbing, no animation.
 */
export default function StaticTour() {
  const { spaces } = property.media.tour;

  return (
    <section aria-label="Tour" className="py-24">
      <div className="px-6 text-center">
        <p className="text-[10px] uppercase tracking-luxe text-gold">The Tour</p>
        <h2 className="mt-4 font-serif text-3xl font-light text-bone md:text-5xl">
          One continuous gesture
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-6xl space-y-20 px-6">
        {spaces.map((space, i) => (
          <figure key={space.id}>
            <img
              src={space.still}
              alt={`${space.name}. ${space.caption}`}
              width={1600}
              height={900}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full"
            />
            <figcaption className="mt-5">
              <p className="text-[10px] uppercase tracking-luxe text-gold">
                {String(i + 1).padStart(2, "0")} — {space.name}
              </p>
              <p className="mt-2 font-serif text-lg font-light italic text-bone-dim">
                {space.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
