import Image from "next/image";

import { Card } from "@/components/ui/Card";
import type { TeamMember } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The photo's rendered width per breakpoint — one column base, two at md,
 * three at lg. Mandatory on a `fill` image, or a phone fetches the widest
 * asset (§4.7).
 */
const PHOTO_SIZES = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

/**
 * One person. Photo, name, role, one line of what they have shipped, and the
 * stack as a quiet sans line — never mono, which is for shas and figures.
 *
 * Not a link: there is no per-person page, and a card that looks clickable
 * and is not costs more trust than it earns. So no arrow, no hover border
 * change beyond what `Card` does for every surface.
 *
 * `photo` is a remote URL today (§7.0 known gap); `fill` in a fixed 4:5 box
 * means no layout shift while it loads, and the aspect is the same on every
 * size so nothing at a breakpoint undoes the base.
 */
export function TeamCard({ member, className }: TeamCardProps) {
  const { photo, name, role, bio, stack } = member;

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-line bg-inset">
        <Image
          src={photo}
          alt={`${name}, ${role}`}
          fill
          sizes={PHOTO_SIZES}
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        {/* h2, not h3: on /team the cards follow the page's h1 directly, and a
            skipped level is an a11y defect. Sized as an h3 because it is one
            visually — the utility beats the base style by design. */}
        <h2 className="text-h3 leading-tight">{name}</h2>
        <p className="text-small text-muted">{role}</p>
        <p className="mt-1 text-muted">{bio}</p>
        {stack.length > 0 && (
          <p className="mt-auto pt-3 text-small text-muted">{stack.join(" · ")}</p>
        )}
      </div>
    </Card>
  );
}
