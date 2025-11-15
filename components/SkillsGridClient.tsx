"use client";

import { motion } from "framer-motion";

type Skill = {
  _id: string;
  name: string;
  level: string;
  percent?: number;
  icon?: string;
};

export default function SkillsGridClient({ skills }: { skills: Skill[] }) {
  const getNumericPercent = (skill: Skill): number => {
    if (typeof skill.percent === "number" && skill.percent > 0) {
      return skill.percent;
    }
    const numeric = Number(skill.level);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
    const map: Record<string, number> = {
      Beginner: 25,
      Intermediate: 60,
      Advanced: 80,
      Expert: 95,
    };
    return map[skill.level] ?? 60;
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {skills.map((skill, idx) => (
        <motion.div
          key={skill._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: idx * 0.06 }}
          whileHover={{ translateY: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
          className="group relative bg-white border border-gray-200 shadow-sm p-4 rounded-xl hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center overflow-hidden">
                {skill.icon ? (
                  <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div>
                <span className="font-medium text-gray-800 text-lg">{skill.name}</span>
              </div>
            </div>

            <div className="text-gray-600 text-sm">{getNumericPercent(skill)}%</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getNumericPercent(skill)}%` }}
              transition={{ duration: 1 }}
              className="bg-red-600 h-2 rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
