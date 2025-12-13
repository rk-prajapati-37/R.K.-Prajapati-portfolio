import { client } from "../../lib/sanityClient";
import ProjectsGridClient from "@/components/ProjectsGridClient";

type Project = {
  _id: string;
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  techStack?: string[];
  category?: string[];
  imageUrl?: string;
  slug?: string;
};

export default async function Projects({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const params = (await searchParams) || {};

  const selectedCategory = params.category ? decodeURIComponent(params.category) : null;

  let projects: Project[] = [];
  let error: string | null = null;

  try {
    projects = await client.fetch(`*[_type == "project"]{
      _id,
      title,
      description,
      techStack,
      category,
      github,
      demo,
      "slug": slug.current,
      "imageUrl": image.asset->url
    }`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load projects";
  }

  // Filter by category if provided
  const filteredProjects = selectedCategory
    ? projects.filter((p) =>
        Array.isArray(p.category)
          ? p.category.includes(selectedCategory)
          : p.category === selectedCategory
      )
    : projects;

  // Get unique categories from all projects
  const allCategories = Array.from(
    new Set(
      projects.flatMap((p) =>
        Array.isArray(p.category) ? p.category : p.category ? [p.category] : []
      )
    )
  ).sort();

  return (
    <ProjectsGridClient
      projects={filteredProjects}
      error={error}
      allCategories={allCategories}
      selectedCategory={selectedCategory}
    />
  );
}