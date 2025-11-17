"use client";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const sortedCerts = [...certificates].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

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
      {sortedCerts.map((cert) => (
        <motion.div key={cert._id} variants={item}>
          <a
            href={cert.url || "#"}
            target={cert.url ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition h-full flex flex-col"
          >
            {cert.certificateImage && (
              <div className="mb-4 h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <Image
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
            {cert.description && <p className="text-sm text-gray-700 mt-3">{cert.description}</p>}
            {cert.url && <p className="text-xs text-blue-600 mt-auto pt-2">View Certificate →</p>}
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
}
