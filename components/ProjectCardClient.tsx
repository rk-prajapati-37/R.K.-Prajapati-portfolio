"use client";

import { useRouter } from "next/navigation";

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

export default function ProjectCardClient({ project }: { project: Project }) {
  const router = useRouter();

  const handleClick = () => {
    if (project.slug) {
      router.push(`/projects/${project.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus:outline-none h-full"
    >
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title || "Project"}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {project.title || "Untitled"}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description || "No description"}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 text-gray-400 text-xs">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub →
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={(e) => e.stopPropagation()}
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
