"use client";

import { motion } from "framer-motion";

export default function SkillsHeaderClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br  pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-3xl font-bold text-gray-800 mb-6"
    >
      💡 My Skills
    </motion.h2>
    </div>
    </div>
  );
}
