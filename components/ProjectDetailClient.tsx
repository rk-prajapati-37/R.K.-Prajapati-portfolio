"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortableTextClient from "./PortableTextClient";
import { useRouter } from "next/navigation";

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
};

export default function ProjectDetailClient({
  project,
  error,
}: {
  project: Project | null;
  error: string | null;
}) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'image' | 'layout'>('image');
  const [allImages, setAllImages] = useState<string[]>([]);

  const openGallery = (image: string) => {
    const images = [project?.imageUrl, ...(project?.extraImages || [])].filter(
      Boolean
    ) as string[];
    setAllImages(images);
    setSelectedImage(image);
    setModalMode('image');
  };

  const openLayout = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    const images = [project?.imageUrl, ...(project?.extraImages || [])].filter(Boolean) as string[];
    setAllImages(images);
    setSelectedImage(null);
    setModalMode('layout');
  };

  const currentImageIndex = allImages.indexOf(selectedImage || "");

  const goToNext = () => {
    if (currentImageIndex < allImages.length - 1) {
      setSelectedImage(allImages[currentImageIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(allImages[currentImageIndex - 1]);
    }
  };

  const handleCategoryClick = (category: string) => {
    // Filter projects by category
    router.push(`/projects?category=${encodeURIComponent(category)}`);
  };

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br py-10  flex items-center justify-center">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">Error Loading Project</h1>
          <p>{error || "Project not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Hero Section with Main Image */}
        {project.imageUrl && (
          <motion.div
            className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            onClick={() => openGallery(project.imageUrl!)}
          >
            <img
              src={project.imageUrl}
              alt={project.title || "Project"}
              className="w-full h-96 object-cover group-hover:brightness-75 transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <span className="text-white text-lg font-semibold bg-black/50 px-6 py-2 rounded-lg">
                Click to View
              </span>
            </div>
          </motion.div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent"
          >
            {project.title || "Untitled Project"}
          </motion.h1>

          {/* Categories */}
          {project.category && (
            <div className="flex flex-wrap gap-3 mb-6">
              {Array.isArray(project.category)
                ? project.category.map((cat, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleCategoryClick(cat)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-semibold rounded-full hover:shadow-lg transition cursor-pointer"
                    >
                      {cat} →
                    </motion.button>
                  ))
                : (
                    <motion.button
                      onClick={() => handleCategoryClick(String(project.category))}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-semibold rounded-full hover:shadow-lg transition cursor-pointer"
                    >
                      {project.category} →
                    </motion.button>
                  )}
            </div>
          )}

          {/* Description / Detailed Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Detailed Info</h2>
            <div className="text-gray-700 text-lg mb-8 leading-relaxed border-l-4 border-red-500 pl-6">
              <div className="portable-text">
                <PortableTextClient value={project.description || "No description available."} />
              </div>
            </div>
          </div>

          {/* Project Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
            {project.clientName && (
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Client
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {project.clientName}
                </p>
              </div>
            )}
            {project.date && (
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Date
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {project.date}
                </p>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-full border-2 border-red-200 hover:border-red-400 transition"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition shadow-lg"
              >
                GitHub Repository
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                Official Website
              </motion.a>
            )}
          </div>

          {/* Demo Video */}
          {project.video && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    📱 Mobile & Tablet Preview
                  </h2>
              {/* Responsive device frames: mobile on small screens, tablet on md, and side-by-side on lg */}
              <div className="device-responsive mx-auto">
                {/* Device preview: stacked on small screens, side-by-side on lg */}
                <div className="device-row flex flex-col lg:flex-row items-center justify-center mx-auto">
                  <div className="device-frame device-frame--tablet mx-auto">
                    <div className="device-screen">
                      <iframe src={project.video} className="w-full h-full" allowFullScreen title={project.title || "Project demo"} />
                    </div>
                  </div>
                  <div className="device-frame device-frame--mobile mx-auto mt-6 lg:mt-0">
                    <div className="device-screen">
                      <iframe src={project.video} className="w-full h-full" allowFullScreen title={project.title || "Project demo"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

              {/* Gallery Section */}
          {project.extraImages && project.extraImages.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Website Layout              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.extraImages.map((img, i) => (
                  <motion.div
                    key={i}
                    onClick={() => openGallery(img)}
                    className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-64 object-cover group-hover:brightness-75 transition duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      {project.demo && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openLayout(e); }}
                          className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-lg"
                        >
                          View Website Layout
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

          {/* Image Lightbox Modal */}
      <AnimatePresence>
        {(selectedImage || modalMode === 'layout') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedImage(null); setModalMode('image'); }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] flex flex-col"
            >
              {/* Main Image / Device frame (laptop) */}
                {/* Prefer image-based Mac bezel if an asset exists at /public/images/device-mac.png */}
                <div className="device-frame device-frame--mac device-frame--mac-image mx-auto">
                <div className={`device-screen ${modalMode === 'layout' ? 'overflow-auto' : 'overflow-hidden'}`}>
                  {modalMode === 'layout' && project.demo ? (
                    <iframe
                      src={project.demo}
                      className="w-full h-full"
                      allowFullScreen
                      title={project.title || "Project demo"}
                    />
                  ) : (
                    <img src={selectedImage || project.imageUrl || ''} alt="Gallery view" className="w-full h-full object-contain" />
                  )}
                </div>
              </div>

              {/* Navigation Controls (moved overlay) */}
              <div className="flex items-center justify-between gap-4 mt-6 hidden lg:flex">
                {/* Previous Button */}
                {currentImageIndex > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPrev}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    ← Previous
                  </motion.button>
                )}

                {/* Image Counter */}
                <span className="text-white font-semibold text-lg">
                  {currentImageIndex + 1} / {allImages.length}
                </span>

                {/* Next Button */}
                {currentImageIndex < allImages.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNext}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Next →
                  </motion.button>
                )}
              </div>

              {/* Overlay navigation for small screens (left/right arrows on device frame) */}
              <button
                aria-label="Previous image"
                onClick={goToPrev}
                className={`device-overlay-btn device-overlay-btn--left ${currentImageIndex <= 0 ? 'hidden' : ''}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path></svg>
              </button>

              <button
                aria-label="Next image"
                onClick={goToNext}
                className={`device-overlay-btn device-overlay-btn--right ${currentImageIndex >= allImages.length - 1 ? 'hidden' : ''}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
              </button>

              {/* Close Button (inside modal, visible on all sizes) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedImage(null); setModalMode('image'); }}
                className="absolute top-4 right-4 z-60 text-white text-3xl font-bold hover:text-gray-300 transition"
                aria-label="Close gallery"
              >
                ✕
              </motion.button>
              {/* (Device-frame modal implemented above; no duplicate overlay needed) */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
