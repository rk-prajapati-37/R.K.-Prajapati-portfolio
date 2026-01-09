"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProjectCardClient from "./ProjectCardClient";

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

export default function ProjectsGridClient({
  projects,
  error,
  allCategories,
  selectedCategory,
}: {
  projects: Project[];
  error: string | null;
  allCategories: string[];
  selectedCategory: string | null;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryFilter = (category: string | null) => {
    if (category) {
      router.push(`/projects?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/projects");
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">Error Loading Projects</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">PROJECTS</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            My Work
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Explore my portfolio of web development and design work
          </p>
        </motion.div>

        {/* Category Filter */}
        {allCategories.length > 0 && (
          <div className="mb-12 relative">
            {/* Left Arrow Button - Hidden on mobile, visible on md and up */}
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50 transition"
              aria-label="Scroll categories left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div ref={scrollRef} className="flex gap-3 px-2 overflow-x-auto no-scrollbar justify-start md:px-12">
              {/* All Projects Button */}
              <motion.button
                onClick={() => handleCategoryFilter(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"
                }`}
              >
                All Projects
              </motion.button>

              {/* Category Buttons */}
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`shrink-0 px-6 py-2 rounded-full font-semibold transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Right Arrow Button - Hidden on mobile, visible on md and up */}
            <button
              onClick={scrollRight}
              className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50 transition"
              aria-label="Scroll categories right"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-2xl transition"
                whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" }}
              >
                <ProjectCardClient project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-gray-600">
              {selectedCategory
                ? `No projects found in "${selectedCategory}" category`
                : "No projects available"}
            </p>
            {selectedCategory && (
              <button
                onClick={() => handleCategoryFilter(null)}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                View All Projects
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
