import { Card } from "@/components/ui/Card";
import { cn, formatRelative } from "@/lib/utils";
import type { Commit } from "@/types";

interface ShippedPanelProps {
  commits: readonly Commit[];
  className?: string;
}

/**
 * The hero's proof, as a static list rather than a rotating ticker: the last
 * three commits pushed under the configured GitHub account, in one glass
 * card. The data arrives as a prop from the hero, which reads it through
 * lib/api/github.ts; this component only lays it out.
 *
 * Renders nothing when there is nothing real to show. There is no placeholder
 * list to fall back to on purpose — this panel's entire job is being real,
 * so an empty account or an unreachable API means no panel, never an
 * invented one (§4.5).
 *
 * A server component with no motion of its own — it rises in as one unit via
 * the `RiseIn` wrapper the hero already applies, and nothing inside it moves
 * on a timer. A sha is the one place the mono utility face belongs here: it
 * is machine output, not a stylistic flourish, and the rest of the panel is
 * content, not chrome.
 */
export function ShippedPanel({ commits, className }: ShippedPanelProps) {
  if (commits.length === 0) return null;

  return (
    <Card glass className={cn("p-5 md:p-6", className)}>
      <div className="flex items-center">
        <p className="text-small font-medium text-fg">Recently shipped</p>
        <span className="ml-auto text-small text-muted">GitHub</span>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {commits.map((commit) => (
          <li key={commit.sha} className="py-3 first:pt-0 last:pb-0">
            <p className="line-clamp-2 text-small text-fg">{commit.message}</p>
            <p className="mt-1 flex flex-wrap gap-x-2 text-small text-muted">
              <span>{commit.repo}</span>
              <span aria-hidden="true">·</span>
              <span>{formatRelative(commit.pushedAt)}</span>
              <span className="font-mono text-xs">{commit.sha}</span>
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
