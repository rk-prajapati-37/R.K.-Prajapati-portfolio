"use client";
import { useState } from "react";
import { experienceData } from "../data/experienceData";
import Image from "next/image";
import PortableTextClient from "@/components/PortableTextClient";

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-red-700 mb-5">Experience</h2>
      <div className="space-y-5">
        {experienceData.map((exp, i) => (
          <div key={i} className="bg-white shadow-lg p-5 rounded-xl border">
            <p className="text-sm text-red-600">{exp.date}</p>
            <h3 className="font-bold text-lg mt-1">{exp.title}</h3>

            {/* Company name with hover-tooltips for logo */}
            <div className="mt-1">
              <span className="relative inline-block group">
                <span className="italic text-blue-700 inline-block">
                  <span className="company-name">{exp.company}</span>
                </span>
                {/* logo popup: appears when hovering the company-name span */}
                {exp.logo && (
                  <div className="absolute left-full top-0 ml-4 hidden group-hover:block z-30">
                    <div className="bg-white p-2 rounded-lg shadow-lg border">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width={120}
                        height={120}
                        className="object-contain rounded"
                      />
                    </div>
                  </div>
                )}
              </span>
            </div>

            {expanded === i ? (
              <>
                <div className="text-gray-700 mt-3">
                  <PortableTextClient value={exp.description} />
                </div>
                <button
                  className="text-red-600 mt-2"
                  onClick={() => setExpanded(null)}
                >
                  show less
                </button>
              </>
            ) : (
              <button
                className="text-blue-700 mt-2"
                onClick={() => setExpanded(i)}
              >
                show more
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
