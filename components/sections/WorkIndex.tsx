import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { projects } from "@/lib/content";
import { FilteredProjects } from "./FilteredProjects";

/**
 * DRAFT COPY (D2). The same claim the home grid makes, because it is the
 * same set of cards; the count stays out of the headline so it survives a
 * project being added or pulled.
 */
const HEADLINE = "Every system, and the number that moved.";

const SUBCOPY =
  "Each one opens the same three lines: the problem, what we built, and what it measured afterwards.";

/**
 * Fewer projects than this and a filter bar is furniture: every chip would
 * narrow to one or two cards. The recipe's threshold.
 */
const MIN_PROJECTS_FOR_FILTERS = 6;

/**
 * Stack tags that actually narrow the grid: shared by at least two projects
 * and not by all of them. A chip that matches one card, or every card, is
 * a label pretending to be a control.
 */
function usefulFilters(): string[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.stack) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2 && n < projects.length)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/**
 * `/work` (§6.0). A server component that composes the heading and hands
 * the projects and the filter list to one client leaf. The grid reuses
 * `ProjectCard`, so the index, the home grid and the modal all render the
 * same card (§10).
 */
export function WorkIndex() {
  const filters = projects.length >= MIN_PROJECTS_FOR_FILTERS ? usefulFilters() : [];

  return (
    <section id="work" aria-labelledby="work-heading" className="py-16 md:py-24">
      <Container>
        <Reveal>
          <Eyebrow>Work</Eyebrow>
          <h1 id="work-heading" className="mt-6 max-w-[18ch]">
            {HEADLINE}
          </h1>
          <p className="mt-6 max-w-[58ch] text-muted">{SUBCOPY}</p>
        </Reveal>

        <FilteredProjects projects={projects} filters={filters} />
      </Container>
    </section>
  );
}
