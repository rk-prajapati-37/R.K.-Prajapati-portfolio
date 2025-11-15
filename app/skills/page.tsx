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
        {skills.map((skill, idx) => (
          <motion.div
            key={skill._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            whileHover={{ translateY: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
            className="group relative bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center overflow-hidden">
                  {skill.icon ? (
                    <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <div>
                  <span className="font-semibold text-gray-800">{skill.name}</span>
                </div>
              </div>

              <div className="text-gray-600">{skill.level}%</div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1 }}
                className="bg-indigo-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
