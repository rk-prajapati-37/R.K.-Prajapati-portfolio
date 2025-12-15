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
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
        My Skills
      </h1>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl font-bold text-gray-800 mb-6 mt-4"
      >
        💡 My Skills
      </motion.h2>
    </motion.div>
  );
}
