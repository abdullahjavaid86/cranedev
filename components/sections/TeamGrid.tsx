import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TeamCard } from "@/components/ui/TeamCard";
import { team } from "@/lib/content";

/**
 * DRAFT COPY (D2). Claims nothing about headcount or seniority — the grid
 * shows whoever is in `content/team.json`, and the headline survives a team
 * of three or thirteen.
 */
const HEADLINE = "The people who would do the work.";

const SUBCOPY =
  "No account managers, no bench. The person you talk to on the first call is the person whose name is on the commits.";

/**
 * The team grid (§6.0 `/team`). A server component; the stagger is the one
 * client leaf. One column base, two at `md`, three at `lg`. Solid cards —
 * this is the top of its page and nothing else here needs the blur budget,
 * but a page of photographs over glass reads as a gallery, not a team.
 *
 * Real people only. `content/team.json` is empty until they are supplied, so
 * the empty state below is what ships — it says so, and points at the work,
 * which is the evidence the page would otherwise be carrying. Padding the
 * grid with placeholder members is the one thing this page must never do:
 * a fake eight-person agency does not survive the first call.
 */
export function TeamGrid() {
  return (
    <section id="team" aria-labelledby="team-heading" className="py-16 md:py-24">
      <Container>
        <Reveal>
          <Eyebrow>Team</Eyebrow>
          <h1 id="team-heading" className="mt-6 max-w-[16ch]">
            {HEADLINE}
          </h1>
          <p className="mt-6 max-w-[58ch] text-muted">{SUBCOPY}</p>
        </Reveal>

        {team.length === 0 ? (
          <Reveal delay={0.1}>
            <Card className="mt-12 p-6 md:mt-16 md:p-8">
              <p className="max-w-[60ch] text-muted">
                Profiles are being written and will appear here with a photo, a role,
                and one line on what each person has shipped. Until then the work is the
                better introduction.
              </p>
              <Link href="/work" className={buttonStyles("secondary", "md", "mt-6")}>
                See the work
              </Link>
            </Card>
          </Reveal>
        ) : (
          <StaggerGroup
            as="ul"
            className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3"
          >
            {team.map((member) => (
              <StaggerItem key={member.slug} as="li" className="h-full">
                <TeamCard member={member} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </Container>
    </section>
  );
}
