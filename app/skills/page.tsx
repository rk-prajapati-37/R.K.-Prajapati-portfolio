"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../lib/sanityClient";
import { motion } from "framer-motion";

const Skills = () => {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(`*[_type == "skill"]{ _id, name, level }`)
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
          <div key={skill._id} className="bg-white rounded-lg shadow-md p-4">
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
