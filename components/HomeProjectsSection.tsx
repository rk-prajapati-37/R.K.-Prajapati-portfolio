"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/Reveal";
import TiltCard from "./motion/TiltCard";

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
        <Reveal className="text-center mb-12">
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">PROJECTS</p>
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 mb-4">Recent Work</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Here are some of my recent projects showcasing modern web development techniques and creative solutions.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" stagger={0.12}>
          {projects.slice(0, 6).map((project) => (
            <StaggerItem key={project._id} className="h-full">
              <TiltCard className="h-full rounded-xl">
                <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                  <Link href={project.slug ? `/projects/${project.slug}` : "/projects"} className="relative block h-48 bg-gray-200 overflow-hidden" aria-label={`Open ${project.title || "project"}`}>
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title || "Project"}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <span className="text-red-600 font-semibold">Project Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-semibold shadow translate-y-2 group-hover:translate-y-0 transition-transform">View Project →</span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      <Link href={project.slug ? `/projects/${project.slug}` : "/projects"} className="hover:text-red-600 transition-colors !no-underline" style={{ color: "inherit" }}>
                        {project.title || "Untitled Project"}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description || "Project description"}</p>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.08, y: -2 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-auto">
                      <motion.div whileHover={{ x: 4 }}>
                        <Link href={project.slug ? `/projects/${project.slug}` : "/projects"} className="text-red-600 hover:text-red-700 font-semibold text-sm">
                          View Project →
                        </Link>
                      </motion.div>
                      {project.demo && (
                        <motion.a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                          whileHover={{ x: 4 }}
                        >
                          Live Demo ↗
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                          whileHover={{ x: 4 }}
                        >
                          GitHub →
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="text-center" delay={0.1}>
          <motion.div className="inline-block" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/projects"
              className="btn-shine inline-flex items-center bg-red-600 !text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
            >
              View All Projects →
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
