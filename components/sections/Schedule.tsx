import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { CalendlyEmbed } from "@/components/ui/CalendlyEmbed";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { primaryCta, siteLinks } from "@/lib/nav";

/**
 * DRAFT COPY (D2). No duration or agenda is claimed here — both belong to
 * the Calendly event the frame shows, and stating them twice is how they
 * disagree.
 */
const SUBCOPY =
  "A call with one of the people who would do the work, not a sales step. Pick a time; the invite carries the video link.";

/**
 * `/schedule` (§6.0), the destination of every "Book a call" on the site.
 * The heading is the CTA's own label, so the button, the page title and this
 * `h1` say the same words (§8).
 *
 * The booking itself is Calendly (D1, resolved 2026-09-24): an embedded
 * frame, themed from our tokens, with a plain link to the same page for
 * anyone whose browser blocks third-party frames. With no link configured
 * the page still does its job through the direct channels, and says so in
 * one sentence rather than showing an empty frame.
 *
 * A server component; the embed is the client leaf.
 */
export function Schedule() {
  const url = siteLinks.calendly;

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className="py-16 md:py-24"
    >
      <Container>
        <Reveal>
          <Eyebrow>Schedule</Eyebrow>
          <h1 id="schedule-heading" className="mt-6 max-w-[16ch]">
            {primaryCta.label}.
          </h1>
          <p className="mt-6 max-w-[58ch] text-muted">{SUBCOPY}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 md:mt-16">
          {url ? (
            <>
              <CalendlyEmbed url={url} />
              <p className="mt-4 text-small text-muted">
                If the calendar does not load,{" "}
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-fg underline-offset-4 hover:underline"
                >
                  open it on Calendly
                </a>
                .
              </p>
            </>
          ) : (
            <Card className="p-6 md:p-8">
              <p className="max-w-[60ch] text-muted">
                The calendar is not connected yet. Write to{" "}
                <a
                  href={`mailto:${siteLinks.email}`}
                  className="font-medium text-fg underline-offset-4 hover:underline"
                >
                  {siteLinks.email}
                </a>{" "}
                with two or three times that suit you, or send the details through the
                contact form, and you will have a confirmed slot within one business
                day.
              </p>
              <Link href="/contact" className={buttonStyles("secondary", "md", "mt-6")}>
                Go to the contact form
              </Link>
            </Card>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
