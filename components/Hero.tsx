import { property } from "@/config/property";

export default function Hero() {
  const { media, propertyName, tagline, city, floor } = property;

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <img
        src={media.heroImage}
        alt={media.heroImageAlt}
        width={2560}
        height={1440}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Legibility gradients — keep the image dominant */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-10 text-center">
        <p className="text-[11px] uppercase tracking-luxe text-bone-dim">
          {city} · {floor}
        </p>

        <div>
          <h1 className="font-serif text-5xl font-light tracking-[0.18em] text-bone sm:text-7xl md:text-8xl">
            {propertyName}
          </h1>
          <p className="mt-6 font-serif text-xl font-light italic tracking-wide text-gold sm:text-2xl">
            {tagline}
          </p>
        </div>

        <a
          href="#residence"
          className="scroll-cue flex flex-col items-center gap-3 text-bone-dim transition-colors duration-700 hover:text-gold"
          aria-label="Scroll to explore the residence"
        >
          <span className="text-[10px] uppercase tracking-luxe">Explore</span>
          <span aria-hidden="true" className="block h-10 w-px bg-current" />
        </a>
      </div>
    </section>
  );
}
