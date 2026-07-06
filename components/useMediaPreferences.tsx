"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** null until known (avoids hydration mismatch), then live-updating. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Mobile breakpoint: the canvas tour is a ≥768px experience. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}
