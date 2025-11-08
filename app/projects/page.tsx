"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/sanityClient";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";



type Project = {
  _id: string;
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
  slug?: {
    current: string;
  };
};



export default function Projects() {

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "project"]{
          _id,
          title,
          description,
          techStack,
          github,
          demo,
          "slug": slug.current,
          "imageUrl": image.asset->url
        }`
      )
      .then((data) => {
        console.log('Fetched projects:', data);
        setProjects(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-16 px-6">
      <motion.h1
        className="text-4xl font-bold text-center mb-12 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🚀 My Projects
      </motion.h1>

      {projects.length === 0 ? (

        <div className="text-center text-gray-600 text-lg">
          Loading projects...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Navigate on card click using router to avoid nested anchors */}
              <ProjectCardContent project={project} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Extracted card content as a separate component to handle router navigation
function ProjectCardContent({ project }: { project: any }) {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") router.push(`/projects/${project.slug}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/projects/${project.slug}`)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus:outline-none"
    >
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 text-gray-400 text-xs">+{project.techStack.length - 3} more</span>
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
