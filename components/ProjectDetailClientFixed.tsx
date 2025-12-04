"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";
import ProjectSocialLinks from "./ProjectSocialLinks";
import { useRouter } from "next/navigation";

type SocialLink = {
  platform: string;
  url: string;
};

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
  socialLinks?: SocialLink[];
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

  // Convert common video links to embeddable URLs (YouTube / Vimeo). If already embed, return as-is.
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '').toLowerCase();
      // YouTube watch links -> embed
      if (host.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
        // playlist or other formats - return as-is
        return url;
      }
      // youtu.be short links
      if (host.includes('youtu.be')) {
        const id = u.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      // Vimeo
      if (host.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean).pop();
        if (id) return `https://player.vimeo.com/video/${id}`;
      }
      // If already an embed URL (contains /embed/ or player.vimeo), return as-is
      if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;
      return url; // fallback
    } catch (e) {
      return url;
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/projects?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto">
        {project.imageUrl && (
          <motion.div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg cursor-pointer" whileHover={{ scale: 1.02 }} onClick={() => openGallery(project.imageUrl!)}>
            <img src={project.imageUrl} alt={project.title || 'Project'} className="w-full h-96 object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition"><span className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded">Click to view</span></div>
          </motion.div>
        )}

        {/* Video preview inside device frames for mobile/tablet if project.video exists */}
        {project.video && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mobile frame */}
            <div className="device-frame device-frame--mobile device-responsive">
              <div className="device-frame--mobile device-screen">
                {(() => {
                  const embed = getEmbedUrl(project.video);
                  if (!embed) return <div className="flex items-center justify-center h-full text-sm text-gray-400">Invalid video</div>;
                  return (
                    <iframe
                      src={embed}
                      title={project.title || 'Project demo'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
            </div>

            {/* Tablet/Large frame */}
            <div className="device-frame device-frame--tablet device-responsive">
              <div className="device-frame--tablet device-screen">
                {(() => {
                  const embed = getEmbedUrl(project.video);
                  if (!embed) return <div className="flex items-center justify-center h-full text-sm text-gray-400">Invalid video</div>;
                  return (
                    <iframe
                      src={embed}
                      title={project.title || 'Project demo'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
            </div>
          </div>
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

          <div className="flex gap-4 flex-wrap mb-6 items-center">
            <div className="flex gap-4 flex-wrap">
              {project.github && (<a href={project.github} target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition">GitHub</a>)}
              {project.demo && (<a href={project.demo} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition">Open Demo</a>)}
            </div>
            
            {/* Social Links */}
            {project.socialLinks && project.socialLinks.length > 0 && (
              <div className="ml-auto">
                <ProjectSocialLinks socialLinks={project.socialLinks} />
              </div>
            )}
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.8, opacity: 0 }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full flex flex-col items-center" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedImage(null)} 
                className="absolute -top-10 right-0 text-white/60 hover:text-white transition text-2xl z-10"
                aria-label="Close gallery"
              >
                ✕
              </button>

              {/* Image Container */}
              <div ref={modalRef} className="w-full bg-black/40 rounded-xl overflow-hidden backdrop-blur-sm">
                <img 
                  src={selectedImage} 
                  alt="Gallery view" 
                  className="w-full h-auto max-h-[80vh] object-contain"
                  onError={(e) => {
                    console.error("Image failed to load:", selectedImage);
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-between text-white w-full px-2">
                <div className="text-sm font-medium">{currentImageIndex + 1} / {allImages.length}</div>
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={goToPrev} 
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg disabled:opacity-30 transition text-sm font-medium"
                    disabled={currentImageIndex <= 0}
                  >
                    ← Prev
                  </button>
                  <button 
                    onClick={goToNext} 
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg disabled:opacity-30 transition text-sm font-medium"
                    disabled={currentImageIndex >= allImages.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Keyboard hint */}
              <div className="mt-3 text-xs text-white/40 text-center">
                Use arrow keys to navigate • ESC to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
