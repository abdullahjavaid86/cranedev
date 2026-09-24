import type { Metadata } from "next";

import { About } from "@/components/sections/About";
import { CtaBand } from "@/components/sections/CtaBand";

const TITLE = "About";
const DESCRIPTION =
  "Why CraneDev exists, the four rules that decide how we work, and the kinds of work we turn down.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/about" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/** `/about` (§6.0). Three sections in one component, then the CTA band. */
export default function AboutPage() {
  return (
    <main className="relative">
      <About />
      <CtaBand />
    </main>
  );
}
