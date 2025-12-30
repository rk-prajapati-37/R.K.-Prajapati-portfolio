

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";

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
  const [isHovered, setIsHovered] = useState(false);

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
      className="card cursor-pointer focus:outline-none h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden rounded-t-xl bg-gray-200 h-48 flex-shrink-0">
        {project.imageUrl ? (
          <>
            <motion.img
              src={project.imageUrl}
              alt={project.title || "Project"}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            />
            {/* Overlay Gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* View Project Button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                View Project
              </button>
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-600 font-semibold">No Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-3">
          {project.title || "Untitled"}
        </h3>
        <div className="text-gray-600 text-sm mb-4 flex-grow">
          <PortableTextClient 
            value={project.description || "No description"} 
            truncate={false} 
            className="line-clamp-3" 
          />
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map((tech, i) => (
              <motion.span
                key={i}
                className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200"
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-3 py-1 text-gray-400 text-xs font-semibold">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-600 hover:text-gray-800 transition"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ x: 4 }}
            >
              GitHub →
            </motion.a>
          )}
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ x: 4 }}
            >
              Live Demo →
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
}
