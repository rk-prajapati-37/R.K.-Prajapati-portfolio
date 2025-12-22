"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

export default function HomeProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">PROJECTS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Recent Work
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Here are some of my recent projects showcasing modern web development techniques and creative solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.slice(0, 6).map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48 bg-gray-200">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title || "Project"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <span className="text-red-600 font-semibold">Project Image</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {project.title || "Untitled Project"}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description || "Project description"}
                </p>

                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}