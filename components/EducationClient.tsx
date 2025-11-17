"use client";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const sortedEducations = [...educations].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

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
      {sortedEducations.map((edu) => (
        <motion.div key={edu._id} variants={item} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-700 font-medium">{edu.institution}</p>
                {edu.logo && (
                  <div className="relative group inline-block">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center cursor-help">
                      <span className="text-xs text-gray-600">🎓</span>
                    </div>
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-30">
                      <div className="bg-white p-2 rounded-lg shadow-lg border">
                        <Image
                          src={edu.logo}
                          alt={`${edu.institution} logo`}
                          width={80}
                          height={80}
                          className="object-contain rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{edu.location}</p>
              <p className="text-sm text-gray-500">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate || "")}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
