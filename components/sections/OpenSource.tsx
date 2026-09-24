import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RepoCard } from "@/components/ui/RepoCard";
import { getOpenSource } from "@/lib/api/github";

/**
 * DRAFT COPY (tracked with the rest of D2). Claims nothing the cards do not
 * evidence: the numbers on them are GitHub's, and when GitHub is not
 * answering the cards carry no numbers at all.
 */
const HEADLINE = "Code you can read before you call.";

const SUBCOPY =
  "The repositories we maintain in public, with what each one does. Stars and push dates come straight from GitHub.";

/**
 * Open source (§6.1 item 9) — the section the GitHub integration exists for.
 *
 * An async server component that awaits the feed and composes; the cards
 * are `RepoCard`, the stagger is the one client leaf. There is deliberately
 * no `Suspense` boundary around the grid: the home page is prerendered and
 * revalidated hourly, so the read happens at build or regeneration time and
 * a skeleton would never paint for a visitor. Worse, a boundary that
 * suspends during prerender makes React emit the grid as an out-of-order
 * chunk — the skeleton inline, the cards appended at the end behind a swap
 * script — which doubles the markup and hides the cards from anything that
 * does not run JavaScript. Measured on the build output, 2026-09-24.
 *
 * Three states still exist, just not as a spinner: live cards, the typed
 * fallback from content/ when GitHub is unavailable (§7.2), and the empty
 * state below when the account answers with nothing public.
 *
 * Mobile first (§4.7): one column is the base, `md:` adds a second track and
 * `lg:` a third. Solid cards, not glass — the contact panel below already
 * spends this stretch of the page's blur budget (§4.2). No accent: the CTA
 * band owns it on this page.
 *
 * One orchestrated moment: the heading reveals, then the grid staggers.
 */
export async function OpenSource() {
  const { profileUrl, repos } = await getOpenSource();

  return (
    <section
      id="open-source"
      aria-labelledby="open-source-heading"
      className="py-16 md:py-24"
    >
      <Container>
        <Reveal>
          <Eyebrow>Open source</Eyebrow>
          <h2 id="open-source-heading" className="mt-6 max-w-[20ch]">
            {HEADLINE}
          </h2>
          <p className="mt-6 max-w-[58ch] text-muted">{SUBCOPY}</p>
        </Reveal>

        {repos.length === 0 ? (
          <RepoGridEmpty profileUrl={profileUrl} />
        ) : (
          <>
            <StaggerGroup
              as="ul"
              className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3"
            >
              {repos.map((repo) => (
                <StaggerItem key={repo.fullName} as="li" className="h-full">
                  <RepoCard repo={repo} />
                </StaggerItem>
              ))}
            </StaggerGroup>

            <div className="mt-10 flex justify-center">
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles("secondary", "md")}
              >
                All repositories
              </a>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

/**
 * The account answered and has nothing public. Says what would be here and
 * where to look instead — never "No data" (§7.4).
 */
function RepoGridEmpty({ profileUrl }: { profileUrl: string }) {
  return (
    <Card className="mt-12 p-6 md:mt-16 md:p-8">
      <p className="max-w-[60ch] text-muted">
        Public repositories appear here as they are published. Until then, the account
        itself is the place to look.
      </p>
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className={buttonStyles("secondary", "md", "mt-6")}
      >
        See the account on GitHub
      </a>
    </Card>
  );
}
