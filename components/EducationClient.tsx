"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClient";
import { toPlainText } from "../lib/portableText";

type Education = {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
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
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function EducationClient({ educations }: { educations: Education[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortedEducations = [...educations].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

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
      {sortedEducations.map((edu) => {
        const isExpanded = expandedId === edu._id;
        const institutionUrl = (edu as any).institutionUrl;
        const descValue = (edu as any).description ?? (edu as any).desc ?? (edu as any).content;

        return (
          <motion.div key={edu._id} variants={item} className="card rounded-lg shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {edu.logo ? (
                    <img src={edu.logo} alt={`${edu.institution} logo`} className="w-8 h-8 object-contain rounded-full bg-white p-1 border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">🎓</span>
                    </div>
                  )}
                  {institutionUrl ? (
                    <a href={institutionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                      {edu.institution}
                    </a>
                  ) : (
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                  )}

                  {edu.logo && (
                    <div className="relative group inline-block">
                      <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-30">
                        <div className="bg-white p-2 rounded-lg shadow-lg border">
                          <img src={edu.logo} alt={`${edu.institution} logo`} width={80} height={80} className="object-contain rounded" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{edu.location}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate || "")}
                </p>
                {descValue && (
                  <div className="mt-3 text-gray-700">
                    <div className="max-w-none">
                      {!isExpanded ? (
                        <div className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                          {toPlainText(descValue).slice(0, 320) + (toPlainText(descValue).length > 320 ? '…' : '')}
                        </div>
                      ) : (
                        <div className="portable-text">
                          <PortableTextClient value={descValue} />
                        </div>
                      )}
                    </div>

                    <button onClick={() => toggleExpanded(edu._id)} className="text-sm text-blue-700 mt-2">
                      {isExpanded ? "Show less" : "Show more"}
                    </button>

                    {/* Expanded content already rendered above when isExpanded === true */}
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


