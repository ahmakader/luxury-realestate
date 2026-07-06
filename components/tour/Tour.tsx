"use client";

import { useIsMobile, usePrefersReducedMotion } from "../useMediaPreferences";
import CanvasTour from "./CanvasTour";
import MobileTour from "./MobileTour";
import StaticTour from "./StaticTour";

/**
 * Picks the right tour experience:
 *  - desktop/tablet + motion OK  → scroll-scrubbed canvas frame sequence
 *  - reduced motion              → static stills, normal scroll
 *  - mobile (<768px)             → stacked stills + autoplay muted loop video
 *
 * StaticTour is the SSR default, so no-JS clients and crawlers always get a
 * complete, semantic tour section; the canvas experience is an enhancement.
 */
export default function Tour() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (reducedMotion === null || isMobile === null) return <StaticTour />;
  if (reducedMotion) return <StaticTour />;
  if (isMobile) return <MobileTour />;
  return <CanvasTour />;
}
