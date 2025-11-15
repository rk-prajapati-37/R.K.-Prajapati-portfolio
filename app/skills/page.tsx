"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../lib/sanityClient";
import { motion } from "framer-motion";

const Skills = () => {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "skill"]{ _id, name, level, "icon": icon.asset->url }`)
      .then((data) => setSkills(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-12 text-gray-800"
      >
        💡 My Skills
      </motion.h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {skills.map((skill) => (
          <div key={skill._id} className="group relative bg-white rounded-lg shadow-md p-4">
            {/* Hover icon */}
            <div className="absolute top-3 right-3 opacity-0 transform scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow overflow-hidden">
                {skill.icon ? (
                  <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">{skill.name}</span>
              <span className="text-gray-600">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1 }}
                className="bg-indigo-600 h-3 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
