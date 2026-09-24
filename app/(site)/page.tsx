import { StructuredData } from "@/components/layout/StructuredData";
import { Brands } from "@/components/sections/Brands";
import { Contact } from "@/components/sections/Contact";
import { CtaBand } from "@/components/sections/CtaBand";
import { Hero } from "@/components/sections/Hero";
import { OpenSource } from "@/components/sections/OpenSource";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

/**
 * Home. Composes sections and nothing else — it declares no markup of its own
 * (§3).
 *
 * The CTA band is the repeated page ending rather than a part of the
 * argument, which is why it comes after the last section rather than being
 * one of them.
 *
 * lib/content needs no side-effect import here — Proof, Services, Work,
 * Testimonials, Brands and Process all import it directly, so the zod schemas
 * run at build regardless.
 *
 * Prerendered, and regenerated in the background at most once an hour: the
 * hero's commits and the open-source grid are read from GitHub through
 * lib/api/github.ts, and this is what lets a static page show this week's
 * pushes instead of the ones from the last deploy. Everything else on the
 * page is build-time JSON and does not care.
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="relative">
      {/* Machine-readable identity for search results. Server-rendered, no
          client cost, and holds only claims that are true today. */}
      <StructuredData />

      <Hero />
      <Proof />
      <Services />
      <Work />
      <Testimonials />
      <Brands />
      <Process />
      <OpenSource />
      <Contact />
      <CtaBand />
    </main>
  );
}
