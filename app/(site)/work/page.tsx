import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/CtaBand";
import { WorkIndex } from "@/components/sections/WorkIndex";

const TITLE = "Work";
const DESCRIPTION =
  "Every system we have shipped, with the problem it solved, what we built, and the number that moved.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/work" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/**
 * `/work` (§6.0): every project, filterable by stack. Each card opens
 * `/work/[slug]` — as a modal over this page on a click, as a full page on a
 * direct load (§6.2).
 */
export default function WorkPage() {
  return (
    <main className="relative">
      <WorkIndex />
      <CtaBand />
    </main>
  );
}
