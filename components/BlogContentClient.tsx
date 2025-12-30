"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PortableTextClient from "./PortableTextClientFixed";

type Blog = {
  title: string;
  excerpt?: string;
  details: any;
  category?: string[];
  tags?: string[];
  date: string;
  coverImage?: {
    asset?: {
      url?: string;
      metadata?: {
        dimensions?: {
          height?: number;
          width?: number;
        };
      };
    };
    hotspot?: any;
    crop?: any;
  };
  slug?: string;
  author: string;
};

type FrameType = 'mobile' | 'tablet' | 'mac' | 'laptop';

export default function BlogContentClient({
  blog,
  nextBlog,
  prevBlog,
  error,
}: {
  blog: Blog | null;
  nextBlog?: { title: string; slug: string } | null;
  prevBlog?: { title: string; slug: string } | null;
  error: string | null;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [frameType, setFrameType] = useState<FrameType>('mac');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Blog data received:", blog);
    console.log("Categories:", blog?.category);
    console.log("Details:", blog?.details);
    console.log("Details type:", typeof blog?.details);
    console.log("Is details array:", Array.isArray(blog?.details));
  }, [blog]);

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold">Error Loading Blog</h1>
          <p>{error || "Blog not found"}</p>
        </div>
      </div>
    );
  }

  const buildImages = () => [blog?.coverImage?.asset?.url].filter(Boolean) as string[];

  const selectImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let newFrameType: FrameType;

      if (aspectRatio < 1) {
        newFrameType = 'mobile';
      } else if (aspectRatio < 1.3) {
        newFrameType = 'tablet';
      } else if (aspectRatio < 1.8) {
        newFrameType = 'laptop';
      } else {
        newFrameType = 'mac';
      }

      setFrameType(newFrameType);
      setSelectedImage(src);
    };
    img.onerror = () => {
      setFrameType('mac');
      setSelectedImage(src);
    };
    img.src = src;
  };

  const openGallery = (image?: string) => {
    const imgs = buildImages();
    setAllImages(imgs);
    const imageToSelect = image ?? imgs[0] ?? null;
    if (imageToSelect) {
      selectImage(imageToSelect);
    }
  };

  const currentImageIndex = selectedImage ? allImages.indexOf(selectedImage) : -1;
  const goToNext = () => {
    if (currentImageIndex >= 0 && currentImageIndex < allImages.length - 1) {
      selectImage(allImages[currentImageIndex + 1]);
    }
  };
  const goToPrev = () => {
    if (currentImageIndex > 0) {
      selectImage(allImages[currentImageIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto">
        {blog.coverImage?.asset?.url && (
          <motion.div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group" whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.3 }} onClick={() => openGallery(blog.coverImage!.asset!.url!)}>
            <img 
              src={blog.coverImage.asset.url} 
              alt={blog.title} 
              className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xl font-semibold bg-black/60 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">Click to enlarge</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">{blog.title}</h2>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800">{blog.title}</h1>

          {/* Categories */}
          {blog.category && blog.category.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {blog.category.map((cat, i) => (
                <span 
                  key={i} 
                  onClick={() => router.push(`/blog/category/${cat.toLowerCase()}`)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 transition"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Short Description (Excerpt) */}
          {blog.excerpt && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Short Description</h2>
              <div className="text-gray-700 text-lg leading-relaxed">
                <p>{blog.excerpt}</p>
              </div>
            </div>
          )}

          {/* Blog Details */}
          <div className="mb-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-lg text-gray-800"><strong>Author -</strong> {blog.author}</span>
              </div>
              <div>
                <span className="text-lg text-gray-800"><strong>Published Date -</strong> {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Detailed Info (Content) */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Detailed Info</h2>
            <div className="text-gray-700 text-lg leading-relaxed border-l-4 border-red-500 pl-6">
              {(() => {
                if (Array.isArray(blog.details) && blog.details.length > 0) {
                  return <PortableTextClient value={blog.details} />;
                } else if (blog.details && typeof blog.details === 'string' && blog.details.trim()) {
                  return <div dangerouslySetInnerHTML={{ __html: blog.details }} />;
                } else if (blog.details && typeof blog.details === 'object') {
                  // If details is an object but not an array, try to render it
                  return <div>{JSON.stringify(blog.details)}</div>;
                } else {
                  return (
                    <div className="text-gray-500 italic">
                      <p>No detailed content available.</p>
                      <p className="text-sm mt-2">Please add rich text content in Sanity Studio for this blog post.</p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Blog Navigation */}
          {(nextBlog || prevBlog) && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                {prevBlog && (
                  <Link href={`/blog/${prevBlog.slug}`} className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition">
                    <span className="text-2xl">←</span>
                    <div>
                      <div className="text-sm font-medium">Previous Blog</div>
                      <div className="text-lg font-semibold">{prevBlog.title}</div>
                    </div>
                  </Link>
                )}
                <div className="flex-1"></div>
                {nextBlog && (
                  <Link href={`/blog/${nextBlog.slug}`} className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition">
                    <div className="text-right">
                      <div className="text-sm font-medium">Next Blog</div>
                      <div className="text-lg font-semibold">{nextBlog.title}</div>
                    </div>
                    <span className="text-2xl">→</span>
                  </Link>
                )}
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
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/60 hover:text-white transition text-2xl z-10"
                aria-label="Close gallery"
              >
                ✕
              </button>

              <div ref={modalRef} className="w-full rounded-xl overflow-hidden">
                {frameType === 'mobile' && (
                  <div className="device-frame device-frame--mobile device-frame--mobile-image w-full">
                    <div className="device-screen">
                      <img
                        src={selectedImage}
                        alt="Gallery view"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", selectedImage);
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                )}
                {frameType === 'tablet' && (
                  <div className="device-frame device-frame--tablet device-frame--tablet-image w-full">
                    <div className="device-screen">
                      <img
                        src={selectedImage}
                        alt="Gallery view"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", selectedImage);
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'/%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                )}
                {frameType === 'laptop' && (
                  <div className="device-frame device-frame--laptop device-frame--laptop-image w-full">
                    <div className="device-screen">
                      <img
                        src={selectedImage}
                        alt="Gallery view"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", selectedImage);
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'/%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                )}
                {frameType === 'mac' && (
                  <div className="device-frame device-frame--mac device-frame--mac-image w-full">
                    <div className="device-screen">
                      <img
                        src={selectedImage}
                        alt="Gallery view"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", selectedImage);
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'/%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-white w-full px-2">
                <div className="text-sm font-medium">{currentImageIndex + 1} / {allImages.length}</div>
                <div className="flex gap-2">
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
