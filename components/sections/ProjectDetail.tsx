import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { adjacentProjects, type Project } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The cover's rendered width. Full page: the 65ch–1160px column. Modal: a
 * 48rem panel from md, full width below.
 */
const COVER_SIZES = "(min-width: 1280px) 1160px, 100vw";

interface ProjectDetailProps {
  project: Project;
  /**
   * The level of the three narrative headings. `h2` on the full page, where
   * the client name is the `h1`; `h3` inside the modal, where Radix renders
   * the title as an `h2`.
   */
  headingLevel: "h2" | "h3";
  className?: string;
}

/**
 * The case study body, shared by `/work/[slug]` and its intercepted modal
 * (§6.2) so the two presentations can never tell a different story. The
 * page or modal supplies the client name and the outcome line above this;
 * everything from the cover down lives here.
 *
 * Structure follows the recipe — problem → what we built → outcome — with
 * the metadata row in plain sans, not mono. Fields the content does not have
 * (team size, a client quote, a "how" narrative) are not invented; the
 * schema is the honest limit of what the page may claim.
 *
 * A server component: `next/image`, `next/link` and content only.
 */
export function ProjectDetail({
  project,
  headingLevel: Heading,
  className,
}: ProjectDetailProps) {
  const { slug, client, cover, category, problem, built, outcome, stack, year, weeks } =
    project;
  const { previous, next } = adjacentProjects(slug);

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {/* The one real artifact the content has. Fixed aspect so nothing
          shifts while the remote placeholder loads. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-line bg-inset">
        <Image
          src={cover}
          alt={`Placeholder cover photograph for the ${client} project`}
          fill
          sizes={COVER_SIZES}
          className="object-cover"
        />
      </div>

      <dl className="flex flex-wrap gap-x-8 gap-y-3 text-small">
        <div>
          <dt className="text-muted">Stack</dt>
          <dd className="mt-0.5 text-fg">{stack.join(" · ")}</dd>
        </div>
        {weeks !== undefined && (
          <div>
            <dt className="text-muted">Duration</dt>
            <dd className="mt-0.5 text-fg">{weeks} weeks</dd>
          </div>
        )}
        <div>
          <dt className="text-muted">Year</dt>
          <dd className="mt-0.5 text-fg">{year}</dd>
        </div>
        <div>
          <dt className="text-muted">Sector</dt>
          <dd className="mt-0.5 text-fg">{category}</dd>
        </div>
      </dl>

      <div className="flex max-w-[65ch] flex-col gap-8">
        <div>
          <Heading className="text-h3">The problem</Heading>
          <p className="mt-3 text-muted">{problem}</p>
        </div>
        <div>
          <Heading className="text-h3">What we built</Heading>
          <p className="mt-3 text-muted">{built}</p>
        </div>
        <div>
          <Heading className="text-h3">What it measured</Heading>
          {/* The schema refuses an outcome with no digit in it (§8). */}
          <p className="mt-3 text-muted">{outcome}</p>
        </div>
      </div>

      {(previous || next) && (
        <nav
          aria-label="More projects"
          className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between"
        >
          {previous && (
            <Link
              href={`/work/${previous.slug}`}
              className="inline-flex min-h-11 items-center gap-2 text-small text-muted transition-colors duration-(--d-micro) hover:text-fg active:text-fg"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>
                <span className="sr-only">Previous project: </span>
                {previous.client}
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="inline-flex min-h-11 items-center gap-2 text-small text-muted transition-colors duration-(--d-micro) hover:text-fg active:text-fg sm:ml-auto"
            >
              <span>
                <span className="sr-only">Next project: </span>
                {next.client}
              </span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
