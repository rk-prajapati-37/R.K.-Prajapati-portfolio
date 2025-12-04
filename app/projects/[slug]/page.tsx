import { client } from "../../../lib/sanityClient";
import ProjectDetailClient from "@/components/ProjectDetailClientFixed";
import { notFound } from "next/navigation";

type SocialLink = {
  platform: string;
  url: string;
};

type Project = {
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  techStack?: string[];
  category?: string[];
  imageUrl?: string;
  extraImages?: string[];
  video?: string;
  date?: string;
  clientName?: string;
  socialLinks?: SocialLink[];
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let project: Project | null = null;
  let error: string | null = null;

  try {
    project = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0]{
        title, description, github, demo, techStack, category,
        clientName, date, video,
        "imageUrl": image.asset->url,
        "extraImages": extraImages[].asset->url,
        socialLinks[] {
          platform,
          url
        }
      }`,
      { slug }
    );
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load project";
  }

  if (!project && !error) {
    notFound();
  }

  return <ProjectDetailClient project={project} error={error} />;
}