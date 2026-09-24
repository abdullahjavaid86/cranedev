import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/CtaBand";
import { Process } from "@/components/sections/Process";
import { TeamGrid } from "@/components/sections/TeamGrid";

const TITLE = "Team";
const DESCRIPTION =
  "The engineers who would do the work: who they are, what they have shipped, and how a project with them runs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/team" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/**
 * `/team` (§6.0). The grid carries the page's `h1`; the "how we work" block
 * the recipe asks for is the same Process section the home page uses — the
 * four steps are how a project with these people runs, and a second version
 * written for this page would only drift from the first.
 */
export default function TeamPage() {
  return (
    <main className="relative">
      <TeamGrid />
      <Process />
      <CtaBand />
    </main>
  );
}
