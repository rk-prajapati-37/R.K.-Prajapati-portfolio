"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClientFixed";
import { toPlainFirstParagraph, toPlainWords } from "../lib/portableText";

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

export default function EducationClientFixed({ educations }: { educations: Education[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = (educations || []).slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));
  const formatDate = (d?: string) => {
    if (!d) return "";
    try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" }); } catch { return d; }
  };

  return (
    <motion.div initial="hidden" whileInView="show" className="space-y-6">
      {sorted.map((edu) => {
        const isExpanded = expandedId === edu._id;
        const desc = edu.description || (edu as any).desc || (edu as any).content;
        return (
          <motion.div key={edu._id} className="card p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {edu.logo && <img src={edu.logo} alt={`${edu.institution} logo`} width={36} height={36} className="rounded-full" />}
                  <div>
                    <div className="text-sm text-gray-700 font-medium">{edu.institution}</div>
                    <div className="text-xs text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(edu._id)} className="text-sm text-red-600 font-semibold">{isExpanded ? 'show less' : 'show more'}</button>
              </div>
            </div>

            {desc && (
              <div className={`mt-4 text-gray-700 ${isExpanded ? '' : 'overflow-hidden max-h-[6.5rem]'}`}>
                {isExpanded ? <PortableTextClient value={desc} /> : <div className="portable-text">{toPlainFirstParagraph(desc) || toPlainWords(desc, 30)}</div>}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
