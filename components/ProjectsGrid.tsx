"use client";

import { motion } from "framer-motion";
import ProjectCardClient from "@/components/ProjectCardClient";

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

export default function ProjectsGrid({
  projects,
  error,
}: {
  projects: Project[];
  error: string | null;
}) {
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

      {error ? (
        <div className="text-center text-red-600 text-lg">
          <p>
            Failed to load projects: <strong>{error}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Ensure <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> are configured.
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
            >
              <ProjectCardClient project={project} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
