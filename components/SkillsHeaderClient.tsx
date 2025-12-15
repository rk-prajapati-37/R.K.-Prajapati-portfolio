"use client";

import { motion } from "framer-motion";

export default function SkillsHeaderClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">SKILLS</p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        Technical Expertise
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Technologies and tools I use to bring ideas to life
      </p>
    </motion.div>
  );
}
