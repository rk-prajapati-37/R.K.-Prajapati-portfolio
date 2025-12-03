"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const pageAnimation: Variants = {
  hidden: { opacity: 0, y: 6 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: {
      duration: 0.24,
      ease: [0.42, 0, 1, 1], // easeIn
    },
  },
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function LayoutMotion({
  children,
  className = "pt-24 site-container",
}: Props) {
  return (
    <motion.main
      className={className}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={pageAnimation}
    >
      {children}
    </motion.main>
  );
}
