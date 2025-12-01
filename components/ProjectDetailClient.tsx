"use client";

import { useState, useEffect, useRef } from "react";
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
  const [zoom, setZoom] = useState<number>(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number | null>(null);
  const lastTapRef = useRef<number | null>(null);
  // Momentum / velocity tracking
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const rafRef = useRef<number | null>(null);
  const lastMoveRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const zoomLevels = [1, 1.5, 2, 3];
  const [friction, setFriction] = useState(0.94);
  const [showSettings, setShowSettings] = useState(false);

  const openGallery = (image: string) => {
    const images = [project?.imageUrl, ...(project?.extraImages || [])].filter(
      Boolean
    ) as string[];
    setAllImages(images);
    setSelectedImage(image);
    setModalMode('image');
  };

  const openLayout = (image?: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    const images = [project?.imageUrl, ...(project?.extraImages || [])].filter(Boolean) as string[];
    setAllImages(images);
    if (image) {
      setSelectedImage(image);
      setModalMode('image');
    } else {
      setSelectedImage(null);
      setModalMode('layout');
      setIsIframeLoaded(null);
    }
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

  // Keyboard navigation and ESC to close
  useEffect(() => {
    if (!selectedImage && modalMode !== 'layout') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setModalMode('image');
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedImage, modalMode, allImages]);

  // Reset zoom when modal changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [selectedImage, modalMode]);

  // Reset pan when zoom resets to 1
  useEffect(() => {
    if (zoom === 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  // show zoom indicator whenever zoom changes
  useEffect(() => {
    setShowZoomIndicator(true);
    const t = setTimeout(() => setShowZoomIndicator(false), 900);
    return () => clearTimeout(t);
  }, [zoom]);

  // Apply momentum after pointer/touch release
  const startInertia = (vx: number, vy: number) => {
    cancelAnimationFrame(rafRef.current || 0);
    const step = () => {
      // decay velocity
      vx *= friction;
      vy *= friction;
      const newX = pan.x + vx;
      const newY = pan.y + vy;
      const clamped = clampPan(newX, newY, modalRef.current, zoom);
      setPan({ x: clamped.x, y: clamped.y });
      // stop when velocity small
      if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(rafRef.current || 0);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // Touch swipe handling for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    // double-tap detection
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // double-tap -> toggle zoom
      setZoom((z) => (z === 1 ? 2 : 1));
      lastTapRef.current = null;
      e.preventDefault();
      return;
    }
    lastTapRef.current = now;

    // pinch start
    if (e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.hypot(dx, dy);
      initialZoomRef.current = zoom;
    } else {
      touchStartRef.current = e.touches?.[0]?.clientX || null;
      // single-finger pan start
      if (zoom > 1 && e.touches && e.touches.length === 1) {
        isPanningRef.current = true;
        pointerStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        initialPanRef.current = { ...pan };
      }
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (pinchStartDistRef.current && e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / (pinchStartDistRef.current || dist);
      const newZoom = Math.max(1, Math.min(3, (initialZoomRef.current || zoom) * ratio));
      setZoom(newZoom);
      setShowZoomIndicator(true);
      return;
    }
    if (isPanningRef.current && e.touches && e.touches.length === 1 && pointerStartRef.current) {
      const dx = e.touches[0].clientX - pointerStartRef.current.x;
      const dy = e.touches[0].clientY - pointerStartRef.current.y;
      const newPan = { x: initialPanRef.current.x + dx, y: initialPanRef.current.y + dy };
      const clamped = clampPan(newPan.x, newPan.y, modalRef.current, zoom);
      const now = Date.now();
      if (lastMoveRef.current) {
        const dt = Math.max(16, now - lastMoveRef.current.t);
        const vx = (clamped.x - lastMoveRef.current.x) / (dt / 16);
        const vy = (clamped.y - lastMoveRef.current.y) / (dt / 16);
        velocityRef.current = { vx, vy };
      }
      lastMoveRef.current = { t: now, x: clamped.x, y: clamped.y };
      setPan({ x: clamped.x, y: clamped.y });
      return;
    }
    touchStartRef.current = touchStartRef.current || e.touches?.[0]?.clientX || null;
  };

  const snapZoom = (z: number) => {
    const nearest = zoomLevels.reduce((prev, curr) => Math.abs(curr - z) < Math.abs(prev - z) ? curr : prev, zoomLevels[0]);
    setZoom(nearest);
    setShowZoomIndicator(true);
    setTimeout(() => setShowZoomIndicator(false), 900);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    // reset pinch
    if (pinchStartDistRef.current) {
      // pinch ended -> snap to nearest
      snapZoom(zoom);
    }
    pinchStartDistRef.current = null;
    initialZoomRef.current = null;
    if (isPanningRef.current) {
      isPanningRef.current = false;
      pointerStartRef.current = null;
      // start inertia
      const { vx, vy } = velocityRef.current;
      startInertia(vx, vy);
    } else {
      const start = touchStartRef.current;
      const end = e.changedTouches?.[0]?.clientX || null;
      if (start == null || end == null) return;
      const delta = start - end;
      if (Math.abs(delta) > 30) {
        if (delta > 0) goToNext();
        else goToPrev();
      }
    }
    touchStartRef.current = null;
  };

  // Pointer-based drag (mouse/pen) support
  const onPointerDown: React.PointerEventHandler = (e) => {
    // allow pan when zoomed-in OR when in image modal so users can reposition vertically
    if (zoom <= 1 && modalMode !== 'image') return;
    isPanningRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    initialPanRef.current = { ...pan };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    // reset velocity tracking
    velocityRef.current = { vx: 0, vy: 0 };
    lastMoveRef.current = { t: Date.now(), x: pan.x, y: pan.y };
  };
  const onPointerMove: React.PointerEventHandler = (e) => {
    if (!isPanningRef.current || !pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const newPan = { x: initialPanRef.current.x + dx, y: initialPanRef.current.y + dy };
    const clamped = clampPan(newPan.x, newPan.y, modalRef.current, zoom);
    // track velocity in px per frame
    const now = Date.now();
    if (lastMoveRef.current) {
      const dt = Math.max(16, now - lastMoveRef.current.t);
      const vx = (clamped.x - lastMoveRef.current.x) / (dt / 16);
      const vy = (clamped.y - lastMoveRef.current.y) / (dt / 16);
      velocityRef.current = { vx, vy };
    }
    lastMoveRef.current = { t: now, x: clamped.x, y: clamped.y };
    setPan({ x: clamped.x, y: clamped.y });
  };
  const onPointerUp: React.PointerEventHandler = (e) => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch {/* ignore */}
      pointerStartRef.current = null;
      // start inertia
      const { vx, vy } = velocityRef.current;
      startInertia(vx, vy);
      // snap after inertia start if needed
      if (zoom !== 1) snapZoom(zoom);
    }
  };

  // Double click to zoom toggle
  const onDoubleClick: React.MouseEventHandler = () => {
    const z = zoom === 1 ? 2 : 1;
    setZoom(z);
    setShowZoomIndicator(true);
    setTimeout(() => setShowZoomIndicator(false), 900);
  };

  // Clamp pan to avoid moving image too far outside viewport
  const clampPan = (x: number, y: number, container: HTMLDivElement | null, zoomFactor: number) => {
    if (!container) return { x, y };
    const rect = container.getBoundingClientRect();
    // if zoom > 1, standard clamp to avoid moving image outside viewport
    let maxX = Math.max(0, (rect.width * (zoomFactor - 1)) / 2);
    let maxY = Math.max(0, (rect.height * (zoomFactor - 1)) / 2);
    // if not zoomed but it's a simple image modal, allow limited vertical reposition
    if (zoomFactor <= 1 && modalMode === 'image') {
      maxY = Math.max(maxY, rect.height * 0.25);
      maxX = Math.max(maxX, rect.width * 0.08);
    }
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    return { x: clamp(x, maxX), y: clamp(y, maxY) };
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
                          onClick={(e) => { e.stopPropagation(); openLayout(img, e); }}
                          className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-lg"
                        >
                          View Layout Image
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
              {modalMode === 'layout' ? (
                <div className="device-frame device-frame--mac device-frame--mac-image mx-auto">
                  <div
                    ref={modalRef}
                    className={`device-screen ${modalMode === 'layout' ? 'overflow-auto' : 'overflow-hidden'}`}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  >
                    <iframe
                      src={project.demo}
                      className="w-full h-full"
                      allowFullScreen
                      title={project.title || "Project demo"}
                      onLoad={() => setIsIframeLoaded(true)}
                      onError={() => setIsIframeLoaded(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="mx-auto bg-black rounded-md overflow-hidden" style={{ maxWidth: '100%', maxHeight: '80vh' }}>
                  <div
                    ref={modalRef}
                    className={`w-full h-full overflow-hidden`}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  >
                    <img
                      src={selectedImage || project.imageUrl || ''}
                      alt="Gallery view"
                      className="w-full h-auto max-h-[80vh] object-contain project-modal-image"
                      style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onDoubleClick={onDoubleClick}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                    />
                  </div>
                </div>
              )}
              {/* Layout iframe fallback: show notice/cta if not loaded */}
              {modalMode === 'layout' && project.demo && isIframeLoaded === false && (
                <div className="mt-3 p-3 bg-yellow-50 text-yellow-900 rounded">This site may block framing; <a href={project.demo} target="_blank" rel="noopener noreferrer" className="underline">Open in a new tab</a>.</div>
              )}

              {/* Header / Caption & Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-4">
                <div className="text-white font-semibold">{project.title || 'Project'}</div>
                <div className="flex items-center gap-2">
                  {/* When in image mode, keep only minimal actions */}
                  {modalMode === 'image' ? (
                    <>
                      <button aria-label="Open in new tab" onClick={() => window.open(selectedImage || project.imageUrl || project.demo || '', '_blank')} className="btn text-sm">Open</button>
                      <button className="btn text-sm" onClick={() => { const link = document.createElement('a'); link.href = selectedImage || project.imageUrl || ''; link.download = `${project.title || 'project'}.png`; document.body.appendChild(link); link.click(); link.remove(); }}>Download</button>
                    </>
                  ) : (
                    <>
                      <button aria-label="Zoom" onClick={() => setZoom((z) => z === 1 ? 2 : 1)} className="btn text-sm">{zoom === 1 ? 'Zoom' : 'Reset'}</button>
                      <button
                        aria-label="Toggle Fullscreen"
                        onClick={() => {
                          const el = modalRef.current?.parentElement;
                          if (!el) return;
                          if (!document.fullscreenElement) {
                            el.requestFullscreen?.();
                            setFullscreen(true);
                          } else {
                            document.exitFullscreen?.();
                            setFullscreen(false);
                          }
                        }}
                        className="btn text-sm"
                      >
                        {fullscreen ? 'Exit' : 'Fullscreen'}
                      </button>
                      <button aria-label="Open in new tab" onClick={() => window.open(selectedImage || project.imageUrl || project.demo || '', '_blank')} className="btn text-sm">Open</button>
                    </>
                  )}
                </div>
                {showZoomIndicator && (
                  <div className="zoom-indicator">{Math.round(zoom * 100)}%</div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 justify-between">
                {/* When simple image modal, hide advanced controls on small screens */}
                {modalMode === 'layout' && (
                  <>
                    <div className="hidden md:flex items-center gap-2">
                      <label className="text-gray-300 text-sm">Zoom</label>
                      <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} onMouseUp={() => snapZoom(zoom)} onTouchEnd={() => snapZoom(zoom)} className="w-40" />
                      <span className="text-gray-300 text-xs">{zoom.toFixed(2)}x</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <label className="text-gray-300 text-sm">Momentum</label>
                      <input type="range" min={0.8} max={0.98} step={0.01} value={friction} onChange={(e) => setFriction(Number(e.target.value))} className="w-36" />
                      <span className="text-gray-300 text-xs">{friction}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn text-sm hidden md:block" onClick={() => { const link = document.createElement('a'); link.href = selectedImage || project.imageUrl || ''; link.download = `${project.title || 'project'}.png`; document.body.appendChild(link); link.click(); link.remove(); }}>Download</button>
                      <button className="btn text-sm" onClick={() => setShowSettings((v) => !v)}>⚙️</button>
                    </div>
                  </>
                )}
              </div>
              {showSettings && modalMode === 'layout' && (
                <div className="mt-2 bg-white/5 p-3 rounded-md text-gray-200 hidden md:block">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label>Pad top</label>
                    <input type="number" defaultValue={60} onChange={(e) => document.documentElement.style.setProperty('--mac-pad-top', `${e.target.value}px`)} className="px-2 py-1 rounded bg-white/5" />
                    <span className="text-xs">px</span>
                    <label>Pad sides</label>
                    <input type="number" defaultValue={56} onChange={(e) => document.documentElement.style.setProperty('--mac-pad-sides', `${e.target.value}px`)} className="px-2 py-1 rounded bg-white/5" />
                    <span className="text-xs">px</span>
                    <label>Pad bottom</label>
                    <input type="number" defaultValue={80} onChange={(e) => document.documentElement.style.setProperty('--mac-pad-bottom', `${e.target.value}px`)} className="px-2 py-1 rounded bg-white/5" />
                    <span className="text-xs">px</span>
                  </div>
                </div>
              )}

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
