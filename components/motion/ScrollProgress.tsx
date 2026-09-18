"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 right-0 bottom-[-2px] h-[3px] origin-left z-[60] pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #dc2626, #f97316, #dc2626)",
        boxShadow: "0 0 12px rgba(220,38,38,0.6)",
      }}
    />
  );
}
