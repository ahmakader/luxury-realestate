/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROPERTY CONFIG — the single source of truth for this site.
 *
 * To re-skin this template for a new listing, edit ONLY this file:
 * swap the copy, numbers, agent details, Formspree endpoint, and media paths.
 * No component hardcodes property data.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface TourSpace {
  /** Machine id, used for anchors and keys. */
  id: string;
  /** Display name shown in the fixed progress indicator. */
  name: string;
  /** One-line caption shown during this leg of the tour. */
  caption: string;
  /** Still image representing this space (reduced-motion + mobile fallback). */
  still: string;
}

export interface PropertyConfig {
  propertyName: string;
  tagline: string;
  /** Formatted price string, rendered as the large serif numeral. */
  price: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  /** Extra headline fact for the facts strip (e.g. "Private Elevator"). */
  signatureFact: string;
  floor: string;
  amenities: string[];
  agent: {
    name: string;
    title: string;
    photo: string;
    phone: string;
    email: string;
  };
  /** Formspree form endpoint, e.g. https://formspree.io/f/xxxxxxx */
  formspreeEndpoint: string;
  media: {
    /** Full-bleed hero image (tower at dusk). */
    heroImage: string;
    heroImageAlt: string;
    /** Scroll-scrubbed tour frame sequence. */
    tour: {
      frameCount: number;
      /** Returns the URL of frame i (0-based). */
      framePath: (i: number, format: "webp" | "jpg") => string;
      /** Tiny blurred placeholder shown while frames preload. */
      placeholder: string;
      /** Frame aspect ratio (w/h) used to letterbox the canvas correctly. */
      frameAspect: number;
      /** The named spaces of the tour, in scroll order. Boundaries are equal
       *  fractions of the sequence (4 spaces → quarters). */
      spaces: TourSpace[];
    };
    /** Mobile fallback: lightweight autoplay-muted-loop video of the tour. */
    mobileTourVideo: string;
    mobileTourPoster: string;
    /** Supporting stills for the gallery section. */
    gallery: { src: string; alt: string }[];
  };
}

export const property: PropertyConfig = {
  propertyName: "THE MERIDIAN",
  tagline: "Sixty floors above everything",
  price: "$12,500,000",
  city: "Dubai",
  bedrooms: 4,
  bathrooms: 5.5,
  sqft: 7200,
  signatureFact: "Private Elevator",
  floor: "60th Floor",

  amenities: [
    "Private elevator entrance with biometric access",
    "Wraparound terrace with infinity-edge pool",
    "Floor-to-ceiling low-iron glass on all elevations",
    "Calacatta marble chef's kitchen with Gaggenau suite",
    "Primary suite with dual dressing rooms and skyline bath",
    "Fully integrated home automation and climate control",
    "Temperature-controlled wine gallery for 600 bottles",
    "Dedicated five-car garage with valet service",
    "24-hour concierge, residents' spa and private cinema",
  ],

  agent: {
    name: "Elena Marchetti",
    title: "Director, Private Office",
    photo: "/media/agent/agent.jpg",
    phone: "+971 4 555 0160",
    email: "elena.marchetti@example.com",
  },

  // Drop in the live Formspree endpoint here.
  formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID",

  media: {
    heroImage: "/media/hero.webp",
    heroImageAlt:
      "The Meridian tower at dusk, its glass facade glowing above the Dubai skyline",
    tour: {
      frameCount: 140,
      framePath: (i, format) =>
        `/media/tour/${format}/${String(i).padStart(4, "0")}.${format}`,
      placeholder: "/media/tour/placeholder.jpg",
      frameAspect: 16 / 9,
      spaces: [
        {
          id: "approach",
          name: "The Approach",
          caption: "Curving through the dusk, sixty floors up.",
          still: "/media/tour/stills/approach.webp",
        },
        {
          id: "arrival",
          name: "The Arrival",
          caption: "A private elevator opens onto seven thousand square feet of sky.",
          still: "/media/tour/stills/arrival.webp",
        },
        {
          id: "flow",
          name: "The Flow",
          caption: "Marble, fire and glass — one continuous gesture.",
          still: "/media/tour/stills/flow.webp",
        },
        {
          id: "terrace",
          name: "The Terrace",
          caption: "An infinity pool holding the entire skyline.",
          still: "/media/tour/stills/terrace.webp",
        },
      ],
    },
    mobileTourVideo: "/media/tour/mobile-tour.mp4",
    mobileTourPoster: "/media/tour/stills/approach.webp",
    gallery: [
      { src: "/media/gallery/01.webp", alt: "The tower's glass crown at blue hour" },
      { src: "/media/gallery/02.webp", alt: "Living room with floor-to-ceiling windows over the skyline" },
      { src: "/media/gallery/03.webp", alt: "Italian marble detail beside the fireplace" },
      { src: "/media/gallery/04.webp", alt: "Chef's kitchen in Calacatta marble" },
      { src: "/media/gallery/05.webp", alt: "Primary suite facing the glowing terrace doors" },
      { src: "/media/gallery/06.webp", alt: "Infinity pool reflecting the Dubai skyline at night" },
    ],
  },
};
