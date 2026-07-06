"use client";

import type { TourSpace } from "@/config/property";

interface ProgressRailProps {
  spaces: TourSpace[];
  activeIndex: number;
  visible: boolean;
  onSelect: (index: number) => void;
}

/**
 * Fixed vertical indicator on the right edge of the viewport, present only
 * while the tour section is in view. Names the current space; each dot is a
 * real button, so the rail is keyboard-navigable.
 */
export default function ProgressRail({
  spaces,
  activeIndex,
  visible,
  onSelect,
}: ProgressRailProps) {
  return (
    <nav
      aria-label="Tour progress"
      aria-hidden={!visible}
      className={`fixed right-5 top-1/2 z-20 -translate-y-1/2 transition-opacity duration-1000 ease-luxe md:right-8 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ol className="flex flex-col items-end gap-7">
        {spaces.map((space, i) => {
          const active = i === activeIndex;
          return (
            <li key={space.id} className="flex items-center gap-3">
              <span
                className={`text-right text-[10px] uppercase tracking-luxe transition-all duration-700 ease-luxe ${
                  active ? "translate-x-0 text-gold opacity-100" : "translate-x-2 text-bone-dim opacity-0"
                }`}
                aria-hidden="true"
              >
                {space.name}
              </span>
              <button
                type="button"
                tabIndex={visible ? 0 : -1}
                onClick={() => onSelect(i)}
                aria-label={`Go to ${space.name}`}
                aria-current={active ? "step" : undefined}
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-700 ease-luxe ${
                    active
                      ? "h-2 w-2 bg-gold"
                      : "h-1.5 w-1.5 bg-bone-dim/50 group-hover:bg-bone-dim"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
