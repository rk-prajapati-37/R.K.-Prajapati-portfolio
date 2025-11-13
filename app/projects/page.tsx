import { client } from "../../lib/sanityClient";
import ProjectsGrid from "@/components/ProjectsGrid";

type Project = {
  _id: string;
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  techStack?: string[];
  imageUrl?: string;
  slug?: string;
};

export default async function Projects() {
  let projects: Project[] = [];
  let error: string | null = null;

  try {
    projects = await client.fetch(`*[_type == "project"]{
      _id,
      title,
      description,
      techStack,
      github,
      demo,
      "slug": slug.current,
      "imageUrl": image.asset->url
    }`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load projects";
  }

  return <ProjectsGrid projects={projects} error={error} />;
}