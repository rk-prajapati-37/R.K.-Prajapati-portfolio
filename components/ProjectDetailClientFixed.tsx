"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";
import { useRouter } from "next/navigation";

type Project = {
  title?: string;
  description?: any;
  github?: string;
  demo?: string;
  techStack?: string[];
  category?: string[] | string;
  imageUrl?: string;
  extraImages?: string[];
  video?: string;
  date?: string;
  clientName?: string;
  slug?: string;
};

export default function ProjectDetailClientFixed({ project, error }: { project: Project | null; error: string | null; }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedImage && !allImages.length) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImage, allImages]);

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold">Error Loading Project</h1>
          <p>{error || "Project not found"}</p>
        </div>
      </div>
    );
  }

  const buildImages = () => [project?.imageUrl, ...(project?.extraImages || [])].filter(Boolean) as string[];
  const openGallery = (image?: string) => { const imgs = buildImages(); setAllImages(imgs); setSelectedImage(image ?? imgs[0] ?? null); };
  const currentImageIndex = selectedImage ? allImages.indexOf(selectedImage) : -1;
  const goToNext = () => { if (currentImageIndex >= 0 && currentImageIndex < allImages.length - 1) setSelectedImage(allImages[currentImageIndex + 1]); };
  const goToPrev = () => { if (currentImageIndex > 0) setSelectedImage(allImages[currentImageIndex - 1]); };

  const handleCategoryClick = (category: string) => {
    router.push(`/projects?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto">
        {project.imageUrl && (
          <motion.div className="relative mb-12 rounded-2xl overflow-hidden shadow-lg cursor-pointer" whileHover={{ scale: 1.02 }} onClick={() => openGallery(project.imageUrl!)}>
            <img src={project.imageUrl} alt={project.title || 'Project'} className="w-full h-96 object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition"><span className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded">Click to view</span></div>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800">{project.title || 'Untitled Project'}</h1>

          {project.category && (
            <div className="flex flex-wrap gap-3 mb-6">
              {Array.isArray(project.category) ? project.category.map((cat, i) => (
                <button key={i} onClick={() => handleCategoryClick(String(cat))} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">{cat}</button>
              )) : (
                <button onClick={() => handleCategoryClick(String(project.category))} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">{String(project.category)}</button>
              )}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Detailed Info</h2>
            <div className="text-gray-700 text-lg leading-relaxed border-l-4 border-red-500 pl-6">
              <PortableTextClient value={project.description || "No description available."} />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap mb-6">
            {project.github && (<a href={project.github} target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-800 text-white rounded">GitHub</a>)}
            {project.demo && (<a href={project.demo} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 text-white rounded">Open Demo</a>)}
          </div>

          {project.extraImages && project.extraImages.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Website Layout</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.extraImages.map((img, i) => (
                  <motion.div key={i} className="relative rounded-xl overflow-hidden shadow" whileHover={{ scale: 1.03 }} onClick={() => openGallery(img)}>
                    <img src={img} alt={`Layout ${i + 1}`} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition bg-black/25"><button onClick={(e) => { e.stopPropagation(); openGallery(img); }} className="text-white bg-black/50 px-3 py-1 rounded">View</button></div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <div ref={modalRef} className="bg-[var(--surface)] rounded-xl overflow-hidden p-4">
                <img src={selectedImage} alt="Gallery" className="w-full h-auto max-h-[80vh] object-contain" />
              </div>

              <div className="mt-2 flex items-center justify-between text-white">
                <div>{currentImageIndex + 1} / {allImages.length}</div>
                <div className="flex gap-2 items-center">
                  <button onClick={goToPrev} className="bg-white/8 px-3 py-2 rounded disabled:opacity-50" disabled={currentImageIndex <= 0}>Prev</button>
                  <button onClick={goToNext} className="bg-white/8 px-3 py-2 rounded disabled:opacity-50" disabled={currentImageIndex >= allImages.length - 1}>Next</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
