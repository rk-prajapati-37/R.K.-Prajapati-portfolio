"use client";

import { motion } from "framer-motion";
import { StaggerGroup, StaggerItem } from "./motion/Reveal";

type Skill = {
  _id: string;
  name: string;
  level: string;
  percent?: number;
  icon?: string;
};

export default function SkillsGridClient({ skills, columns = 3 }: { skills: Skill[]; columns?: number }) {
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

  const responsiveColsClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  if (!skills || skills.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No skills to display</p>
      </div>
    );
  }

  return (
    <StaggerGroup className={`grid ${responsiveColsClass} gap-4 w-full`} stagger={0.07} amount={0.1}>
      {skills.map((skill) => {
        const pct = getNumericPercent(skill);
        return (
          <StaggerItem key={skill._id}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 14px 30px rgba(220,38,38,0.12)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-4 rounded-xl hover:border-red-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center overflow-hidden"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {skill.icon ? (
                      <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </motion.div>

                  <div>
                    <span className="font-medium text-gray-800 dark:text-white text-lg">{skill.name}</span>
                  </div>
                </div>

                <motion.div
                  className="text-gray-600 dark:text-gray-400 text-sm tabular-nums"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  {pct}%
                </motion.div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="h-2 rounded-full relative overflow-hidden"
                  style={{ background: "linear-gradient(90deg, #dc2626, #f97316)" }}
                >
                  {/* shimmer sweep */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-1/3 bg-white/40"
                    animate={{ x: ["-100%", "400%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}
