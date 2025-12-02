"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";  // ✅ IMPORT ADD KIA

// ✅ UTILITY FUNCTIONS (local - no external dependency)
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

export default function CertificateClientFixed({ certificates }: { certificates: Certificate[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = (certificates || []).slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));
  const formatDate = (d?: string) => {
    if (!d) return "";
    try { 
      return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" }); 
    } catch { 
      return d; 
    }
  };

  return (
    <motion.div initial="hidden" whileInView="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((cert) => {
        const isExpanded = expandedId === cert._id;
        const descValue = (cert as any).description ?? (cert as any).desc ?? (cert as any).content;
        return (
          <motion.div key={cert._id} className="card rounded-lg shadow-md p-4 hover:shadow-lg transition min-h-0 cursor-pointer" aria-expanded={isExpanded}>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-36 h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {cert.certificateImage ? (
                  <img src={cert.certificateImage} alt={cert.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-sm text-gray-500">No image</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{cert.title}</h4>
                    {cert.issuer && <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">{formatDate(cert.date || "")}</div>
                </div>

                {descValue && (
                  <div className="mt-3 text-gray-700">
                    <div className="max-w-none" style={isExpanded ? { overflow: 'visible', maxHeight: 'none' } as React.CSSProperties : { overflow: 'hidden', maxHeight: '6.5rem' } as React.CSSProperties}>
                      {!isExpanded ? (
                        <div className="text-gray-700 portable-text-collapse">
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
                          onClick={(ev) => { ev.stopPropagation(); toggle(cert._id); }} 
                          className="text-sm font-semibold mt-2 text-red-600"
                        >
                          {isExpanded ? "show less" : "show more"}
                        </button>
                      </div>
                      {cert.url ? (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-block text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" 
                          aria-label={`View certificate for ${cert.title}`}
                        >
                          View Certificate →
                        </a>
                      ) : null}
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
