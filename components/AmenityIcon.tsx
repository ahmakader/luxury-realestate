/**
 * Thin-line decorative icons for amenity rows. The icon is inferred from the
 * amenity's wording so `config/property.ts` can stay a plain string list —
 * unmatched amenities fall back to a diamond mark. Order matters: more
 * specific patterns are tested first (e.g. "chef's kitchen … Gaggenau suite"
 * must match the kitchen, not the suite).
 */

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS: { pattern: RegExp; path: React.ReactNode }[] = [
  {
    pattern: /elevator|lift/i,
    path: (
      <>
        <rect x="5.5" y="3.5" width="13" height="17" rx="1" />
        <path d="M9.5 9.5 12 7l2.5 2.5M9.5 14.5 12 17l2.5-2.5" />
      </>
    ),
  },
  {
    pattern: /kitchen|chef|culinary/i,
    path: (
      <>
        <path d="M5 10.5h14v4.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
        <path d="M3 10.5h18M9 7.5c0-1 .8-1.5 1.5-2M13.5 7.5c0-1 .8-1.5 1.5-2" />
      </>
    ),
  },
  {
    pattern: /wine|cellar|sommelier/i,
    path: (
      <>
        <path d="M8 3.5h8c0 4.5-1.8 7-4 7s-4-2.5-4-7z" />
        <path d="M12 10.5v8M9 20.5h6M8.6 6.5h6.8" />
      </>
    ),
  },
  {
    pattern: /pool|infinity|swim|terrace/i,
    path: (
      <>
        <path d="M3 10.5c1.5 0 1.5-1.3 3-1.3s1.5 1.3 3 1.3 1.5-1.3 3-1.3 1.5 1.3 3 1.3 1.5-1.3 3-1.3 1.5 1.3 3 1.3" />
        <path d="M3 15.5c1.5 0 1.5-1.3 3-1.3s1.5 1.3 3 1.3 1.5-1.3 3-1.3 1.5 1.3 3 1.3 1.5-1.3 3-1.3 1.5 1.3 3 1.3" />
      </>
    ),
  },
  {
    pattern: /glass|window|floor-to-ceiling/i,
    path: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" />
        <path d="M12 4.5v15M4.5 12h15" />
      </>
    ),
  },
  {
    pattern: /suite|bed|dressing|sleep/i,
    path: (
      <>
        <path d="M3 6.5v12M3 14.5h18v4M9.5 10.5H19a2 2 0 0 1 2 2v2" />
        <circle cx="6.25" cy="11" r="1.25" />
      </>
    ),
  },
  {
    pattern: /automation|climate|smart|technology/i,
    path: (
      <>
        <path d="M4 8h9M19 8h1M4 16h1M11 16h9" />
        <circle cx="16" cy="8" r="2" />
        <circle cx="8" cy="16" r="2" />
      </>
    ),
  },
  {
    pattern: /car|garage|valet|parking/i,
    path: (
      <>
        <path d="M4.5 16 6 11a2 2 0 0 1 1.9-1.5h8.2A2 2 0 0 1 18 11l1.5 5" />
        <rect x="3.5" y="16" width="17" height="3.5" rx="1" />
        <path d="M7 19.5V21M17 19.5V21" />
      </>
    ),
  },
  {
    pattern: /concierge|spa|cinema|gym|residents/i,
    path: (
      <>
        <path d="M4.5 16a7.5 7.5 0 0 1 15 0" />
        <path d="M3 16h18M12 8.5V6.5M10.5 6.5h3" />
      </>
    ),
  },
];

const FALLBACK = (
  <>
    <path d="M12 3.5 19 10.5 12 20.5 5 10.5z" />
    <path d="M5 10.5h14" />
  </>
);

export default function AmenityIcon({ amenity }: { amenity: string }) {
  const icon = ICONS.find(({ pattern }) => pattern.test(amenity))?.path ?? FALLBACK;
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...strokeProps}>
      {icon}
    </svg>
  );
}
