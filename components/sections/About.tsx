import { Container } from "@/components/layout/Container";
import { MaskedText } from "@/components/motion/MaskedText";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * DRAFT COPY — NEEDS THE OWNER'S OWN STORY (D2).
 *
 * Written to §8: plain, specific in kind, no hype vocabulary, and no number
 * or proper noun that has not been supplied. The origin paragraph says what
 * kind of team this is without claiming a founding year, a headcount or a
 * client; those go in when they are real. Everything below is the shape of
 * the page, waiting for the facts.
 */
const HEADLINE = ["Small on purpose.", "Senior by default."];

const ORIGIN = [
  "CraneDev exists because of the systems we kept inheriting: built quickly by a team that had since moved on, documented by the commit log, and kept alive by the one person who still remembered why. We wanted to be the team that stays.",
  "So the shape is deliberate. No account managers between you and the engineers, no bench of juniors learning on your budget, and no handover at the end to people who have never seen the code. The people who scope the work build it, and the people who build it run it.",
];

const PRINCIPLES = [
  {
    title: "The people who scope it build it.",
    detail:
      "Estimates come from the engineers who will do the work, and they carry them through to production. Nobody sells a plan they will not have to keep.",
  },
  {
    title: "Working software over decks.",
    detail:
      "The first thing you see is a release, not a roadmap. If a question can be answered by shipping a slice, that is how we answer it.",
  },
  {
    title: "We say no early.",
    detail:
      "If the work is not a fit, or the plan will not survive contact with your data, we say so in the first call and point you somewhere better.",
  },
  {
    title: "We stay on it.",
    detail:
      "Maintenance is part of the offer, not an afterthought. The system keeps its authors, and the authors keep their pagers.",
  },
];

const DECLINED = [
  "Fixed-price rewrites of systems we have not read yet.",
  "Staff augmentation — engineers dropped into a team we do not run.",
  "Projects where nobody on your side can say what done looks like.",
  "Work that depends on a technology choice we would not make ourselves.",
];

/**
 * `/about` (§6.0): the origin, the operating principles, and what we decline
 * to do. Saying what you do not take on is the most credible thing on the
 * page, so it gets the same weight as the principles.
 *
 * This page's one masked headline. Prose stays inside 65ch. No photography:
 * a stock office shot would be the one dishonest element on an honest page.
 *
 * A server component; the reveal and the stagger are the client leaves.
 */
export function About() {
  return (
    <>
      <section id="about" aria-labelledby="about-heading" className="py-16 md:py-24">
        <Container>
          <Eyebrow>About</Eyebrow>
          <MaskedText as="h1" id="about-heading" lines={HEADLINE} className="mt-6" />
          <Reveal>
            <div className="mt-10 flex max-w-[65ch] flex-col gap-5 text-muted">
              {ORIGIN.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section
        id="principles"
        aria-labelledby="principles-heading"
        className="py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
            <h2 id="principles-heading" className="mt-6 max-w-[20ch]">
              Four rules that decide most things.
            </h2>
          </Reveal>

          <StaggerGroup
            as="ol"
            className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2"
          >
            {PRINCIPLES.map((principle) => (
              <StaggerItem key={principle.title} as="li" className="h-full">
                <Card className="h-full p-6 md:p-8">
                  <h3>{principle.title}</h3>
                  <p className="mt-3 text-muted">{principle.detail}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <section
        id="declined"
        aria-labelledby="declined-heading"
        className="py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <Eyebrow>What we decline</Eyebrow>
            <h2 id="declined-heading" className="mt-6 max-w-[20ch]">
              Work we turn down, so the rest gets our full attention.
            </h2>
            <ul className="mt-10 flex max-w-[65ch] flex-col divide-y divide-line">
              {DECLINED.map((item) => (
                <li key={item} className="py-4 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
