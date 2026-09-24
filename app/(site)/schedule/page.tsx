import type { Metadata } from "next";

import { Schedule } from "@/components/sections/Schedule";
import { primaryCta } from "@/lib/nav";

const TITLE = primaryCta.label;
const DESCRIPTION =
  "Pick a time for a call with one of the engineers who would do the work. The invite carries the video link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/schedule" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/schedule" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/**
 * `/schedule` (§6.0). No CTA band: the band's one action is "Book a call",
 * and this is the page it books on — a button that reloads the page the
 * reader is on is the opposite of a call to action. The footer follows the
 * section directly.
 */
export default function SchedulePage() {
  return (
    <main className="relative">
      <Schedule />
    </main>
  );
}
