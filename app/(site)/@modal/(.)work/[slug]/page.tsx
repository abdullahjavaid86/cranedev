import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { projectBySlug } from "@/lib/content";

/**
 * `/work/[slug]` intercepted from a client-side navigation (§6.2): the same
 * case study, over the page the visitor is on, closing back to it. A direct
 * load never reaches this file — it renders `work/[slug]/page.tsx` instead.
 *
 * The body is the same server component the full page renders, passed into
 * the client modal as children.
 */
export default async function InterceptedProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <ProjectModal title={project.client} description={project.outcome}>
      <ProjectDetail project={project} headingLevel="h3" />
    </ProjectModal>
  );
}
