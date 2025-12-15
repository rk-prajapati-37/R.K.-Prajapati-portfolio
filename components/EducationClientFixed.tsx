"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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

type Education = {
  _id: string;
  degree?: string;
  institution?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  logo?: string;
  description?: any;
  order?: number;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function EducationClientFixed({
  educations,
}: {
  educations: Education[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = (educations || [])
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const formatDate = (d?: string) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return d;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">EDUCATION</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Academic Background
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          My educational journey and qualifications that shaped my career
        </p>
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
      {sorted.map((edu) => {
        const isExpanded = expandedId === edu._id;
        const desc =
          edu.description || (edu as any).desc || (edu as any).content;

        return (
          <motion.div
            key={edu._id}
            variants={item}
            className="card p-6 rounded-lg shadow-md border-l-4 border-red-500"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {edu.logo && (
                    <img
                      src={edu.logo}
                      alt={`${edu.institution} logo`}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="text-sm text-gray-700 font-medium">
                      {edu.institution}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(edu._id)}
                  className="text-sm text-red-600 font-semibold"
                >
                  {isExpanded ? "show less" : "show more"}
                </button>
              </div>
            </div>

            {desc && (
              <div
                className={`mt-4 text-gray-700 ${
                  isExpanded ? "" : "overflow-hidden max-h-[6.5rem]"
                }`}
              >
                {isExpanded ? (
                  <PortableTextClient value={desc} />
                ) : (
                  <div className="portable-text">
                    {toPlainFirstParagraph(desc) || toPlainWords(desc, 30)}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
    </>
  );
}
