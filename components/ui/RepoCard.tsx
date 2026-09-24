import { ArrowUpRight, Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { cn, formatRelative } from "@/lib/utils";
import type { Repo } from "@/types";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface RepoCardProps {
  repo: Repo;
  className?: string;
}

/**
 * One public repository, as a card. Same contract as `ProjectCard`: the whole
 * card is the one link, nothing inside it is interactive, and the arrow is
 * the rest-state affordance a phone needs because it gets no hover.
 *
 * A plain anchor, not `next/link`, because the destination is GitHub. Solid
 * surface rather than glass: the section sits between Process and Contact,
 * where the contact form's panel already spends this stretch's blur budget
 * (§4.2).
 *
 * Every fact that is not live is left out rather than invented. The fallback
 * content carries no star count and no push date, so a fallback card simply
 * has a shorter footer — nobody can tell a made-up number from a real one,
 * which is exactly why there is no made-up number (§8).
 */
export function RepoCard({ repo, className }: RepoCardProps) {
  const slash = repo.fullName.indexOf("/");
  const owner = repo.fullName.slice(0, slash);
  const name = repo.fullName.slice(slash + 1);

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className={cn("group block h-full", className)}
    >
      <Card className="flex h-full flex-col p-5 group-active:border-line-strong md:p-6">
        <div className="flex items-start gap-4">
          <div className="min-w-0">
            <p className="text-small text-muted">{owner}</p>
            <h3 className="break-words">{name}</h3>
          </div>

          <span
            aria-hidden="true"
            className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors duration-(--d-micro) group-hover:text-fg group-active:text-fg"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        {repo.description && <p className="mt-3 text-muted">{repo.description}</p>}

        <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-small text-muted">
          {repo.language && <span>{repo.language}</span>}
          {/* Zero is a number, but not information: a "0 stars" badge tells
              the reader nothing about the code and reads as a warning. */}
          {repo.stars !== null && repo.stars > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Star aria-hidden="true" className="size-3.5" />
              {compact.format(repo.stars)}
              <span className="sr-only"> stars</span>
            </span>
          )}
          {repo.pushedAt && <span>Pushed {formatRelative(repo.pushedAt)}</span>}
        </p>
      </Card>
    </a>
  );
}
