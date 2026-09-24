import type { Metadata } from "next";

import { Contact } from "@/components/sections/Contact";
import { CtaBand } from "@/components/sections/CtaBand";

const TITLE = "Contact";
const DESCRIPTION =
  "Tell us what you are building. A reply from someone who would work on it, within one business day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/contact" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/**
 * `/contact` (§6.0). The same section the home page ends with, promoted to
 * the page's `h1` — one form, one reply-time promise, so the two routes
 * cannot drift. The direct channels (email) sit with the pitch inside the
 * section; location and timezone are not shown because neither is known
 * yet (D2), and a placeholder city is a lie the reader can check.
 */
export default function ContactPage() {
  return (
    <main className="relative">
      <Contact heading="h1" />
      <CtaBand />
    </main>
  );
}
