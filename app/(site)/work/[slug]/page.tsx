import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { projectBySlug, projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const title = project.client;
  // The outcome is the one specific sentence the recipe asks a description
  // to be, and it carries a real number by schema.
  const description = project.outcome;
  const url = `/work/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}

/**
 * `/work/[slug]` as a full page (§6.2): a direct load, a refresh, or a shared
 * link. Static for every slug in content; an unknown slug is the site 404.
 *
 * The hero is the client name and the outcome line — the page a CTO reads
 * before booking opens with the number, not with a title. The body is the
 * same `ProjectDetail` the modal renders.
 */
export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="relative">
      <article>
        <section aria-labelledby="project-heading" className="py-16 md:py-24">
          <Container>
            <Eyebrow>
              {project.category}
              <span aria-hidden="true"> · </span>
              {project.year}
            </Eyebrow>
            <h1 id="project-heading" className="mt-6 max-w-[16ch]">
              {project.client}
            </h1>
            <p className="mt-6 max-w-[48ch] text-h3 leading-snug text-muted">
              {project.outcome}
            </p>

            <ProjectDetail
              project={project}
              headingLevel="h2"
              className="mt-12 md:mt-16"
            />
          </Container>
        </section>
      </article>
      <CtaBand />
    </main>
  );
}
