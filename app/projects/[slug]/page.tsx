import { client } from "../../../lib/sanityClient";
import ProjectDetailClient from "@/components/ProjectDetailClientFixed";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type SocialLink = {
  platform: string;
  url: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  const project = await client.fetch(
    `*[_type=="project" && slug.current==$slug][0]{
      title,
      description,
      seoTitle,
      seoDescription
    }`,
    { slug }
  );

  return {
    title: project?.seoTitle || project?.title,
    description: project?.seoDescription || project?.description,
  };
}

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
  clientProblem?: string;
  solution?: string;
  results?: string;
};

export default async function ProjectDetail({
  params,
}: Props) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let project: Project | null = null;
  let nextProject: { title: string; slug: string } | null = null;
  let prevProject: { title: string; slug: string } | null = null;
  let error: string | null = null;

  try {
    project = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0]{
        title, description, details, github, demo, techStack, category,
        clientName, date, video, clientProblem, solution, results,
        "imageUrl": image.asset->url,
        "extraImages": extraImages[].asset->url,
        socialLinks[] {
          platform,
          url
        }
      }`,
      { slug }
    );

    // Fetch all projects for navigation
    const allProjects = await client.fetch(`*[_type == "project"] | order(date desc){ title, "slug": slug.current }`);
    const currentIndex = allProjects.findIndex((p: any) => p.slug === slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        prevProject = allProjects[currentIndex - 1];
      }
      if (currentIndex < allProjects.length - 1) {
        nextProject = allProjects[currentIndex + 1];
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load project";
  }

  if (!project && !error) {
    notFound();
  }

  return <ProjectDetailClient project={project} nextProject={nextProject} prevProject={prevProject} error={error} />;
}