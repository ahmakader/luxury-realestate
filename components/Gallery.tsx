"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { property } from "@/config/property";
import { useReveal } from "./useReveal";

export default function Gallery() {
  const ref = useReveal<HTMLElement>();
  const { gallery } = property.media;
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) =>
        current === null ? current : (current + delta + gallery.length) % gallery.length,
      );
    },
    [gallery.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Tab") {
        // Focus trap: cycle within the dialog's controls while open.
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!controls || controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open !== null, close, step]); // eslint-disable-line react-hooks/exhaustive-deps

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
              className="reveal"
              style={{ "--reveal-delay": `${(i % 3) * 130}ms` } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={(event) => {
                  lastTrigger.current = event.currentTarget;
                  setOpen(i);
                }}
                aria-label={`View larger: ${image.alt}`}
                className="group block w-full cursor-zoom-in overflow-hidden"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={1600}
                  height={900}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition-transform duration-[2000ms] ease-luxe group-hover:scale-[1.03]"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={gallery[open].alt}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-10"
          onClick={close}
        >
          <img
            key={gallery[open].src}
            src={gallery[open].src}
            alt={gallery[open].alt}
            className="max-h-[80vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <p className="mt-5 max-w-xl text-center font-serif text-base font-light italic text-bone-dim">
            {gallery[open].alt}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-luxe text-bone-dim/70">
            {String(open + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close gallery view"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-2xl font-light text-bone-dim transition-colors duration-500 hover:text-gold"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-xl text-bone-dim transition-colors duration-500 hover:text-gold md:left-6"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-xl text-bone-dim transition-colors duration-500 hover:text-gold md:right-6"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
