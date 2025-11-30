"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import PortableTextClient from "./PortableTextClient";

type Certificate = {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  certificateImage?: string;
  url?: string;
  description?: string;
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
  const sortedCerts = [...certificates].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {sortedCerts.map((cert) => {
        const isExpanded = expandedId === cert._id;
        const descValue = (cert as any).description ?? (cert as any).desc ?? (cert as any).content;
        // Removed plain text extraction - we now render PortableText directly.
        return (
          <motion.div key={cert._id} variants={item}>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition h-full flex flex-col">
              {cert.certificateImage && (
                <div className="mb-4 h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={cert.certificateImage}
                      alt={cert.title}
                      width={200}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                </div>
              )}
              <h4 className="font-semibold text-gray-800">{cert.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
              <p className="text-xs text-gray-500 mt-2">{formatDate(cert.date)}</p>
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
                      <PortableTextClient value={descValue} />
                  </div>
                    <button onClick={() => toggleExpanded(cert._id)} className="text-sm text-blue-700 mt-2">
                      {isExpanded ? "Show less" : "Show more"}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 text-gray-700">
                        <PortableTextClient value={descValue} />
                      </div>
                    )}
                </div>
              )}

              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 mt-auto pt-2">
                  View Certificate →
                </a>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
