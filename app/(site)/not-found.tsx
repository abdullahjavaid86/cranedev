import { Eyebrow } from "@/components/ui/Eyebrow";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found — CraneDev",
  description: "That page doesn't exist.",
};

/**
 * The site 404.
 *
 * It lives inside `(site)` because that is where every unmatched URL ends up:
 * the `@modal/[...catchAll]` slot matches any path, so the group's layout
 * renders and `children` has no page — Next then renders the nearest
 * `not-found` boundary, which is this file, inside the layout. The layout
 * already draws Scene, Header, Footer and Grain, so this file must not; when
 * it sat at `app/not-found.tsx` and carried its own chrome, the 404 rendered
 * every piece of it twice.
 *
 * Before the catch-all existed an unmatched URL matched no group at all and
 * a `(site)/not-found.tsx` was never used — that is why it was at the root.
 * The catch-all changed which boundary is nearest; this file follows it.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto w-full max-w-[1240px]">
        <Eyebrow>404</Eyebrow>

        <h1 className="mt-6 max-w-[18ch]">This page doesn&rsquo;t exist.</h1>

        <p className="mt-6 max-w-[65ch] text-muted">
          The link may be out of date, or the page may have moved. Nothing is broken on
          our end.
        </p>

        <nav aria-label="Suggested pages" className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md border border-line bg-raised px-5 py-3 text-fg transition-colors duration-(--d-micro) hover:bg-inset"
          >
            Home
          </Link>
          <Link
            href="/work"
            className="rounded-md border border-line bg-raised px-5 py-3 text-fg transition-colors duration-(--d-micro) hover:bg-inset"
          >
            Selected work
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-line bg-raised px-5 py-3 text-fg transition-colors duration-(--d-micro) hover:bg-inset"
          >
            Contact
          </Link>
        </nav>
      </div>
    </main>
  );
}
