"use client";

import { useEffect, useRef, useState } from "react";
import { property } from "@/config/property";

export type FrameFormat = "webp" | "jpg";

/**
 * Progressive frame preloader for the scroll-scrub tour.
 *
 * Strategy: detect WebP support, then load a coarse pass first (every 7th
 * frame) so scrubbing works almost immediately at low temporal resolution,
 * then fill in the remaining frames. `ready` flips after the coarse pass.
 * Never blocks the page — callers draw the nearest loaded frame.
 */
export function useFramePreloader() {
  const { frameCount, framePath } = property.media.tour;
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const images: (HTMLImageElement | undefined)[] = new Array(frameCount);
    imagesRef.current = images;

    const detectWebP = () =>
      new Promise<FrameFormat>((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve(probe.width > 0 ? "webp" : "jpg");
        probe.onerror = () => resolve("jpg");
        probe.src =
          "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
      });

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            images[i] = img;
            setLoadedCount((c) => c + 1);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = framePath(i, formatRef.current);
      });

    const formatRef = { current: "webp" as FrameFormat };

    const loadBatch = async (indices: number[], concurrency: number) => {
      let cursor = 0;
      const workers = new Array(Math.min(concurrency, indices.length))
        .fill(0)
        .map(async () => {
          while (cursor < indices.length && !cancelled) {
            const i = indices[cursor++];
            await loadFrame(i);
          }
        });
      await Promise.all(workers);
    };

    (async () => {
      formatRef.current = await detectWebP();

      const coarse: number[] = [];
      for (let i = 0; i < frameCount; i += 7) coarse.push(i);
      if (!coarse.includes(frameCount - 1)) coarse.push(frameCount - 1);
      await loadBatch(coarse, 6);
      if (!cancelled) setReady(true);

      const rest: number[] = [];
      for (let i = 0; i < frameCount; i++) if (!images[i]) rest.push(i);
      await loadBatch(rest, 6);
    })();

    return () => {
      cancelled = true;
    };
  }, [frameCount, framePath]);

  /** Nearest loaded frame to `target` (exact if available). */
  const nearestFrame = (target: number): HTMLImageElement | undefined => {
    const images = imagesRef.current;
    const t = Math.max(0, Math.min(frameCount - 1, Math.round(target)));
    if (images[t]) return images[t];
    for (let d = 1; d < frameCount; d++) {
      if (t - d >= 0 && images[t - d]) return images[t - d];
      if (t + d < frameCount && images[t + d]) return images[t + d];
    }
    return undefined;
  };

  return { nearestFrame, loadedCount, ready, frameCount };
}
