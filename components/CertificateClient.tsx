"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";

function toPlainText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return String(value);

  const parts: string[] = [];
  for (const block of value) {
    if (!block) continue;
    if (typeof block === "string") {
      parts.push(block);
      continue;
    }
    if (Array.isArray((block as any).children)) {
      parts.push(
        (block as any).children
          .map((c: any) => (c?.text ? String(c.text) : ""))
          .join("")
      );
      continue;
    }
    if ((block as any).text) {
      parts.push(String((block as any).text));
      continue;
    }
    try {
      parts.push(JSON.stringify(block));
    } catch {
      /* ignore */
    }
  }
  return parts.join("\n\n");
}

function toPlainWords(value: any, wordCount = 30): string {
  const text = toPlainText(value || "");
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + "…";
}

function toPlainFirstParagraph(value: any): string {
  if (!value) return "";
  if (typeof value === "string") {
    return value.split(/\n{2,}/)[0] || value;
  }
  const text = toPlainText(value);
  return text.split(/\n{2,}/)[0] || text;
}

type Certificate = {
  _id: string;
  title: string;
  issuer?: string;
  date?: string;
  certificateImage?: string;
  url?: string;
  description?: any;
  order?: number;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function CertificateClient({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");

  const sortedCerts = [...(certificates || [])].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next === id) {
        setTimeout(() => {
          const el = document.getElementById(`cert-desc-${id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 80);
      }
      return next;
    });
  };

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    const target = e.target as HTMLElement;
    if (target.closest && target.closest("a, button, input, textarea, label"))
      return;
    if (typeof window !== "undefined" && window.innerWidth <= 1024) {
      toggleExpanded(id);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return date;
    }
  };

  const openImage = (img?: string, title?: string) => {
    if (!img) return;
    setActiveImage(img);
    setActiveTitle(title || "");
  };

  const closeImage = () => {
    setActiveImage(null);
    setActiveTitle("");
  };

  if (!sortedCerts.length) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">No certificates added yet.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">CERTIFICATES</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Professional Certifications
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Recognitions and credentials that validate my expertise
        </p>
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        // viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedCerts.map((cert) => {
          const isExpanded = expandedId === cert._id;
          const descValue =
            (cert as any).description ??
            (cert as any).desc ??
            (cert as any).content;

          return (
            <motion.article key={cert._id} variants={item}>
              <div
                onClick={(e) => handleCardClick(e, cert._id)}
                aria-expanded={isExpanded}
                aria-controls={`cert-desc-${cert._id}`}
                className={`group rounded-xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full flex flex-col gap-4 cursor-pointer ${
                  isExpanded ? "ring-2 ring-red-500/80" : ""
                }`}
              >
                {/* Image */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImage(cert.certificateImage, cert.title);
                  }}
                  className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-slate-800 rounded-t-2xl overflow-hidden flex items-center justify-center"
                >
                  {cert.certificateImage ? (
                    <>
                      <img
                        src={cert.certificateImage}
                        alt={cert.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <span className="absolute bottom-3 right-3 text-[11px] font-medium bg-black/60 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                        Click to zoom
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No image</span>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 flex flex-col px-4 pb-4 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-slate-50 text-base md:text-lg leading-snug">
                        {cert.title}
                      </h4>
                      {cert.issuer && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(cert.date)}
                    </div>
                  </div>

                  {descValue && (
                    <div className="mt-3 text-gray-700 dark:text-slate-200 text-sm">
                      <div
                        className="max-w-none"
                        style={
                          isExpanded
                            ? {
                                overflow: "visible",
                                maxHeight: "none",
                              }
                            : {
                                overflow: "hidden",
                                maxHeight: "5.5rem",
                              }
                        }
                      >
                        {!isExpanded ? (
                          <div className="portable-text-collapse">
                            {toPlainFirstParagraph(descValue) ||
                              toPlainWords(descValue, 30)}
                          </div>
                        ) : (
                          <div
                            id={`cert-desc-${cert._id}`}
                            className="portable-text"
                            style={{ overflow: "visible" }}
                          >
                            <PortableTextClient value={descValue} />
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          id={`cert-toggle-${cert._id}`}
                          aria-expanded={isExpanded}
                          aria-controls={`cert-desc-${cert._id}`}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            toggleExpanded(cert._id);
                          }}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          {isExpanded ? "show less" : "show more"}
                        </button>

                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-xs font-semibold bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition"
                            aria-label={`View certificate for ${cert.title}`}
                          >
                            View Certificate
                            <span className="ml-1 text-[10px]">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Image modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImage}
          >
            <motion.div
              className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-2 text-slate-100 text-sm">
                <span className="truncate pr-2">{activeTitle}</span>
                <button
                  type="button"
                  onClick={closeImage}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium"
                >
                  Close
                </button>
              </div>
              <div className="bg-black flex items-center justify-center p-4">
                <img
                  src={activeImage}
                  alt={activeTitle || "Certificate"}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
