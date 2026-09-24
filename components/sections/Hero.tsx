import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MaskedText } from "@/components/motion/MaskedText";
import { RiseIn } from "@/components/motion/RiseIn";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getRecentCommits } from "@/lib/api/github";
import { primaryCta } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ShippedPanel } from "./ShippedPanel";

/**
 * DRAFT COPY — NEEDS REWRITING BEFORE LAUNCH (tracked as D2).
 *
 * Written to the §8 rules — plain, specific, no hype vocabulary — and
 * deliberately containing no numeric claim, because every number on this site
 * has to be real and none have been supplied yet. Say what the team actually
 * does and this gets replaced in one edit.
 */
const HEADLINE = ["Built to ship.", "Built to last."];

const SUBCOPY =
  "A senior team that takes systems from architecture to production, then stays on them. No handover to people who have never seen the code.";

/**
 * The thesis. One masked headline, one line of subcopy, two CTAs — the
 * primary is the page's single accent element (§4.1) — beside a static
 * "Recently shipped" panel carrying the proof.
 *
 * The panel used to rotate on a timer; it is a plain list now. Nothing about
 * a hero's job needs a clock, a rotating list is one more thing that can jank
 * on a slow device, and a static one reads calmer without losing any
 * information — every commit it held is still there, just all at once.
 *
 * The commits are live (lib/api/github.ts, cached an hour) and the hero
 * awaits them itself rather than streaming the panel through `Suspense`:
 * the layout depends on whether there is anything to show. With no commits
 * — no owner configured, or GitHub not answering — the copy takes the full
 * width instead of sitting beside an empty column. The page is prerendered
 * and revalidated hourly, so nobody waits on this read; a skeleton here
 * would only ever paint in development, and would put a boundary in the
 * LCP path for nothing.
 *
 * Nothing ambient here: the site-wide Scene (§4.6) owns the background, and a
 * second moving layer in the hero would compete with it for no visible gain.
 *
 * A server component. Every moving part below is a client leaf.
 */
export async function Hero() {
  const commits = await getRecentCommits();
  const hasPanel = commits.length > 0;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative py-20 md:flex md:min-h-[calc(100dvh-4rem)] md:items-center md:py-28"
    >
      <Container className="md:grid md:grid-cols-12 md:items-center md:gap-10">
        <div
          className={cn(hasPanel ? "md:col-span-7 lg:col-span-8" : "md:col-span-10")}
        >
          <RiseIn>
            <Eyebrow>Senior software agency</Eyebrow>
          </RiseIn>

          <MaskedText as="h1" id="hero-heading" lines={HEADLINE} className="mt-5" />

          {/* The LCP element on this page. It must paint without waiting for
              hydration — see RiseIn. */}
          <RiseIn delay={0.15}>
            <p className="mt-6 max-w-[48ch] text-muted">{SUBCOPY}</p>
          </RiseIn>

          <RiseIn delay={0.25}>
            <div className="mt-10 flex flex-wrap gap-3">
              {/* The one accent element on this viewport-height of scroll. */}
              <Link href={primaryCta.href} className={buttonStyles("primary", "md")}>
                {primaryCta.label}
              </Link>
              <Link href="/work" className={buttonStyles("secondary", "md")}>
                See the work
              </Link>
            </div>
          </RiseIn>
        </div>

        {hasPanel && (
          <RiseIn delay={0.35} className="mt-14 md:col-span-5 md:mt-0 lg:col-span-4">
            <ShippedPanel commits={commits} />
          </RiseIn>
        )}
      </Container>
    </section>
  );
}
