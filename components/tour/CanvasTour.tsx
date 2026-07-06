"use client";

import { useEffect, useRef, useState } from "react";
import { property } from "@/config/property";
import ProgressRail from "./ProgressRail";
import { useFramePreloader } from "./useFramePreloader";

/** Total scroll distance of the tour, in viewport heights. */
const SCROLL_VH = 500;

/**
 * The Apple-product-page technique: a sticky <canvas> pinned for the length
 * of a tall section; scroll progress (0-1) maps to a frame index in a
 * preloaded image sequence. No <video> seeking, no decode jank.
 */
export default function CanvasTour() {
  const { spaces, placeholder, frameAspect } = property.media.tour;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { nearestFrame, loadedCount, ready, frameCount } = useFramePreloader();

  const [activeSpace, setActiveSpace] = useState(0);
  const [inView, setInView] = useState(false);
  const readyRef = useRef(false);
  readyRef.current = ready;

  // Rendering state kept in refs — the rAF loop must not re-render React.
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const placeholderRef = useRef<HTMLImageElement | null>(null);
  const lastDrawnRef = useRef<{ img: HTMLImageElement | null; w: number; h: number }>({
    img: null,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const img = new Image();
    img.src = placeholder;
    img.onload = () => {
      placeholderRef.current = img;
    };
  }, [placeholder]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawnRef.current = { img: null, w: 0, h: 0 }; // force redraw
    };

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      targetFrameRef.current = progress * (frameCount - 1);

      const spaceIndex = Math.min(
        spaces.length - 1,
        Math.floor(progress * spaces.length),
      );
      setActiveSpace(spaceIndex);
      setInView(rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4);
    };

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight || frameAspect;
      const cr = cw / ch;
      let dw = cw;
      let dh = ch;
      if (ir > cr) {
        dw = ch * ir;
      } else {
        dh = cw / ir;
      }
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const tick = () => {
      if (!running) return;
      // Ease the displayed frame toward the scroll target: soft, no snap.
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const next = Math.abs(target - current) < 0.02 ? target : current + (target - current) * 0.22;
      currentFrameRef.current = next;

      const img = readyRef.current ? nearestFrame(next) : undefined;
      const fallback = placeholderRef.current;
      const toDraw = img ?? fallback;
      const last = lastDrawnRef.current;
      if (toDraw && (last.img !== toDraw || last.w !== canvas.width || last.h !== canvas.height)) {
        drawCover(toDraw);
        lastDrawnRef.current = { img: toDraw, w: canvas.width, h: canvas.height };
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    readScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", readScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, frameAspect, spaces.length]);

  const scrollToSpace = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const total = section.offsetHeight - window.innerHeight;
    const top =
      section.getBoundingClientRect().top +
      window.scrollY +
      total * ((index + 0.5) / spaces.length);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const loadPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic tour"
      style={{ height: `${SCROLL_VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          role="img"
          aria-label={`${spaces[activeSpace].name}. ${spaces[activeSpace].caption}`}
        />

        {/* Loading state — non-blocking, fades away once the coarse pass lands */}
        <div
          aria-hidden={ready}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/70 backdrop-blur-sm transition-opacity duration-1000 ease-luxe ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-[10px] uppercase tracking-luxe text-bone-dim">
            Preparing the tour
          </p>
          <div className="h-px w-40 overflow-hidden bg-white/10">
            <div
              className="h-full bg-gold transition-[width] duration-500 ease-luxe"
              style={{ width: `${loadPct}%` }}
            />
          </div>
        </div>

        {/* Space caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-8 pb-12 pt-32 md:px-16">
          <div aria-live="polite">
            <p className="text-[10px] uppercase tracking-luxe text-gold">
              {String(activeSpace + 1).padStart(2, "0")} / {String(spaces.length).padStart(2, "0")}
            </p>
            <h3
              key={spaces[activeSpace].id}
              className="mt-3 font-serif text-3xl font-light text-bone md:text-5xl"
            >
              {spaces[activeSpace].name}
            </h3>
            <p className="mt-2 max-w-md font-serif text-base font-light italic text-bone-dim md:text-lg">
              {spaces[activeSpace].caption}
            </p>
          </div>
        </div>
      </div>

      <ProgressRail
        spaces={spaces}
        activeIndex={activeSpace}
        visible={inView}
        onSelect={scrollToSpace}
      />
    </section>
  );
}
