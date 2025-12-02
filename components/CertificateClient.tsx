"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";  // ✅ ADD KIA

// ✅ UTILITY FUNCTIONS (lib/portableText.ts ki jagah)
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
    if (Array.isArray(block.children)) {
      parts.push(block.children.map((c: any) => (c?.text ? String(c.text) : "")).join(""));
      continue;
    }
    if (block.text) {
      parts.push(String(block.text));
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
    return (value.split(/\n{2,}/)[0] || value);
  }
  const text = toPlainText(value);
  return (text.split(/\n{2,}/)[0] || text);
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CertificateClient({ certificates }: { certificates: Certificate[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortedCerts = [...(certificates || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next === id) {
        setTimeout(() => {
          const el = document.getElementById(`cert-desc-${id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
      return next;
    });
  };

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    const target = e.target as HTMLElement;
    if (target.closest && target.closest('a, button, input, textarea, label')) return;
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      toggleExpanded(id);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return date;
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {sortedCerts.map((cert) => {
        const isExpanded = expandedId === cert._id;
        const descValue = (cert as any).description ?? (cert as any).desc ?? (cert as any).content;
        
        return (
          <motion.div key={cert._id} variants={item}>
            <div 
              onClick={(e) => handleCardClick(e, cert._id)} 
              aria-expanded={isExpanded} 
              aria-controls={`cert-desc-${cert._id}`}
              className={`certificate-card card rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-0.5 h-full flex flex-col md:flex-row md:items-start gap-4 min-h-0 cursor-pointer ${isExpanded ? 'ring-2 ring-red-500' : ''}`}
            >
              <div className="w-full md:w-36 h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {cert.certificateImage ? (
                  <img
                    src={cert.certificateImage}
                    alt={cert.title}
                    width={200}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-sm text-gray-500">No image</div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">{cert.title}</h4>
                    {cert.issuer && <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">{formatDate(cert.date)}</div>
                </div>
                
                {descValue && (
                  <div className="mt-3 text-gray-700">
                    <div className="max-w-none" style={isExpanded ? { overflow: 'visible', maxHeight: 'none' } as React.CSSProperties : { overflow: 'hidden', maxHeight: '6.5rem' } as React.CSSProperties}>
                      {!isExpanded ? (
                        <div className={`text-gray-700 portable-text-collapse ${isExpanded ? 'expanded' : ''}`}>
                          {toPlainFirstParagraph(descValue) || toPlainWords(descValue, 30)}
                        </div>
                      ) : (
                        <div id={`cert-desc-${cert._id}`} className="portable-text" style={{ overflow: 'visible' }}>
                          <PortableTextClient value={descValue} />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <div className="flex-1 flex justify-end">
                        <button 
                          id={`cert-toggle-${cert._id}`} 
                          aria-expanded={isExpanded} 
                          aria-controls={`cert-desc-${cert._id}`} 
                          onClick={(ev) => { ev.stopPropagation(); toggleExpanded(cert._id); }} 
                          className="text-sm font-semibold mt-2 text-red-600"
                        >
                          {isExpanded ? "show less" : "show more"}
                        </button>
                      </div>
                      <div className="flex-shrink-0">
                        {cert.url && (
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" 
                            aria-label={`View certificate for ${cert.title}`}
                          >
                            View Certificate →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
