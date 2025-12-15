"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";
import HireMeCTA from "./HireMeCTA";

type Experience = {
  _id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  logo?: string;
  description?: any;
  order?: number;
};

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

export default function ExperienceClient({
  experiences,
}: {
  experiences: Experience[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortedExperiences = [...experiences].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next === id) {
        setTimeout(() => {
          const el = document.getElementById(`exp-desc-${id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 80);
      }
      return next;
    });
  };

  const formatDate = (date: string) => {
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">EXPERIENCE</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Professional Journey
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          A timeline of my career growth and key achievements in web development
        </p>
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-4"
      >
      {sortedExperiences.map((exp) => {
        const isExpanded = expandedId === exp._id;
        const companyUrl = (exp as any).companyUrl;
        const descValue =
          (exp as any).description ?? (exp as any).desc ?? (exp as any).content;

        return (
          <motion.div
            key={exp._id}
            variants={item}
            className="card rounded-lg shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition min-h-0"
          >
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {exp.position}
                </h3>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {exp.logo && (
                    <img
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full bg-white p-1 border flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    {exp.company && (
                      <div className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
                        {companyUrl ? (
                          <a
                            href={companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </div>
                    )}
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500">
                      <span className="truncate">{exp.location}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                      </span>
                    </div>
                  </div>
                </div>

                {descValue && (
                  <div className="mt-4 text-gray-700">
                    <div
                      className="max-w-none"
                      style={
                        isExpanded
                          ? ({
                              overflow: "visible",
                              maxHeight: "none",
                            } as React.CSSProperties)
                          : ({
                              overflow: "hidden",
                              maxHeight: "6.5rem",
                            } as React.CSSProperties)
                      }
                    >
                      {!isExpanded ? (
                        <div
                          className={`text-gray-700 portable-text-collapse ${
                            isExpanded ? "expanded" : ""
                          }`}
                        >
                          {toPlainFirstParagraph(descValue) ||
                            toPlainWords(descValue, 30)}
                        </div>
                      ) : (
                        <div
                          id={`exp-desc-${exp._id}`}
                          className="portable-text"
                          style={{ overflow: "visible" }}
                        >
                          <PortableTextClient value={descValue} />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        id={`exp-toggle-${exp._id}`}
                        aria-expanded={isExpanded}
                        aria-controls={`exp-desc-${exp._id}`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          toggleExpanded(exp._id);
                        }}
                        className="text-sm font-semibold mt-2 text-red-600"
                      >
                        {isExpanded ? "show less" : "show more"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Freelancer CTA */}
                {exp.position && exp.position.toLowerCase().includes('freelance') && (
                  <div className="mt-6">
                    <p className="text-gray-600">
                      I help startups and businesses build fast, scalable websites.
                    </p>
                    <Link
                      href="/services"
                      className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition font-semibold"
                    >
                      View My Services
                    </Link>
                  </div>
                )}
              </div>
          </motion.div>
        );
      })}
    </motion.div>
    <HireMeCTA text="I am open to freelance and remote projects." />
    </>
  );
}
