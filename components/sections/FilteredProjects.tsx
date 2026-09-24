"use client";

import { useState } from "react";

import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

interface FilteredProjectsProps {
  projects: Project[];
  /** Stack tags worth filtering by. Empty means no filter bar. */
  filters: string[];
}

const chipStyles = cn(
  "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-small",
  "transition-colors duration-(--d-micro)",
  "hover:border-line-strong active:border-line-strong",
);

/**
 * The `/work` grid with its filter chips. One client leaf holding one piece
 * of state — the active tag — so the section above it stays a server
 * component and `lib/content` never ships to the browser: the projects
 * arrive as props.
 *
 * Filtering never remounts the grid. `StaggerGroup` stays mounted and only
 * its children change, so the reveal fires once (§5.1); a card coming back
 * into the set animates in from the shared `item` variant, which is the
 * right amount of motion for a filter.
 *
 * Chips are toggle buttons, not links: the filter is view state, not a
 * route. `aria-pressed` carries the state, a polite live region announces
 * the count, and the row scrolls inside itself on a phone without ever
 * scrolling the page sideways (§4.7). The active chip takes the strong line,
 * not the accent — this page's accent is the CTA band.
 */
export function FilteredProjects({ projects, filters }: FilteredProjectsProps) {
  const [active, setActive] = useState<string | null>(null);

  const visible = active ? projects.filter((p) => p.stack.includes(active)) : projects;

  return (
    <>
      {filters.length > 0 && (
        <div
          role="group"
          aria-label="Filter by stack"
          className="-mx-6 mt-10 flex gap-2 overflow-x-auto [overscroll-behavior-x:contain] px-6 pb-2 md:mx-0 md:mt-12 md:flex-wrap md:px-0"
        >
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setActive(null)}
            className={cn(
              chipStyles,
              active === null
                ? "border-line-strong bg-inset text-fg"
                : "border-line text-muted",
            )}
          >
            All
          </button>
          {filters.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={active === tag}
              onClick={() => setActive(active === tag ? null : tag)}
              className={cn(
                chipStyles,
                active === tag
                  ? "border-line-strong bg-inset text-fg"
                  : "border-line text-muted",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {active
          ? `${visible.length} of ${projects.length} projects use ${active}.`
          : `All ${projects.length} projects.`}
      </p>

      <StaggerGroup
        as="ul"
        className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2"
      >
        {visible.map((project) => (
          <StaggerItem key={project.slug} as="li" className="h-full">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </>
  );
}
