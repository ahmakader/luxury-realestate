# THE MERIDIAN — cinematic single-property template

A reusable, award-style single-property real estate site. Next.js 14
(App Router) · TypeScript · Tailwind CSS. Deploys to Vercel as-is.

## Re-skinning for a new listing

Edit **`config/property.ts`** — nothing else. Every property-specific value
(name, tagline, price, city, specs, amenities, agent, Formspree endpoint,
and all media paths) lives there. Components read exclusively from that file.

Drop the new listing's media into `public/media/` following the same layout:

```
public/media/
  hero.webp                 full-bleed hero
  tour/webp/0000..0139.webp scroll-scrub frame sequence (1280px wide)
  tour/jpg/0000..0139.jpg   JPEG fallback for the sequence
  tour/placeholder.jpg      tiny blurred placeholder
  tour/stills/*.webp        one still per tour space
  tour/mobile-tour.mp4      lightweight loop for mobile
  gallery/01..06.webp       gallery stills
```

## The tour

The tour section uses the canvas frame-sequence technique (as on Apple
product pages): ~140 preloaded WebP frames drawn to a sticky `<canvas>`,
scroll progress mapped to frame index. No `<video>` seeking.

- `prefers-reduced-motion` → static stills, normal scroll.
- Viewport < 768px → stacked stills + an autoplay-muted-loop video.
- Frames preload progressively (coarse pass first) behind a non-blocking
  loading state.

## Form

The contact form posts to the Formspree endpoint in `config/property.ts`
(`formspreeEndpoint`). Replace `YOUR_FORM_ID` with the live form id.

## Development

```bash
npm install
npm run dev
```

## Media pipeline

Generated media was produced with Seedance 2.0 / Nano Banana via the
Higgsfield MCP and processed by `.github/workflows/media-relay.yml`
(stitching, frame extraction, compression). The workflow is only needed to
regenerate assets — the site itself is fully static about its media.
