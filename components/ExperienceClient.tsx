"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClient";

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

export default function ExperienceClient({ experiences }: { experiences: Experience[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortedExperiences = [...experiences].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatDate = (date: string) => {
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
      className="space-y-4"
    >
      {sortedExperiences.map((exp) => {
        const isExpanded = expandedId === exp._id;
        const companyUrl = (exp as any).companyUrl;
        const descValue = (exp as any).description ?? (exp as any).desc ?? (exp as any).content;
        const extractPlain = (val: any) => {
          if (!val) return "";
          if (typeof val === "string") return val;
          try {
            if (Array.isArray(val)) {
              return val
                .map((block) => {
                  if (typeof block === "string") return block;
                  if (block?.children && Array.isArray(block.children)) {
                    return block.children.map((c: any) => c.text || "").join("");
                  }
                  return "";
                })
                .join("\n\n");
            }
            return String(val);
          } catch {
            return "";
          }
        };
        const plainText = extractPlain(descValue);
        return (
          <motion.div key={exp._id} variants={item} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {exp.logo ? (
                    <img src={exp.logo} alt={`${exp.company} logo`} className="w-8 h-8 object-contain rounded-full bg-white p-1 border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">🏢</span>
                    </div>
                  )}
                  {companyUrl ? (
                    <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                      {exp.company}
                    </a>
                  ) : (
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  )}

                  {exp.logo && (
                    <div className="relative group inline-block">
                      <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-30">
                        <div className="bg-white p-2 rounded-lg shadow-lg border">
                          <img src={exp.logo} alt={`${exp.company} logo`} width={80} height={80} className="object-contain rounded" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{exp.location}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                </p>
                {descValue && (
                  <div className="mt-3 text-gray-700">
                    <div
                      className="max-w-none"
                      style={
                        isExpanded
                          ? undefined
                          : {
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            } as any
                      }
                    >
                      {/* support alternative field names if description is stored differently */}
                      <PortableTextClient value={descValue} />
                    </div>

                    <button onClick={() => toggleExpanded(exp._id)} className="text-sm text-blue-700 mt-2">
                      {isExpanded ? "Show less" : "Show more"}
                    </button>

                    {isExpanded && plainText && <div className="mt-2 text-gray-700 whitespace-pre-wrap">{plainText}</div>}
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
