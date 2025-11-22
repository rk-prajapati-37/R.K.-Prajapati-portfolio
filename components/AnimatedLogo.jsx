"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLogo({ size = 180 }) {
  const outerRotate = {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 12, ease: "linear" },
  };

  const innerRotate = {
    animate: { rotate: -360 },
    transition: { repeat: Infinity, duration: 20, ease: "linear" },
  };

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(0px 8px 18px rgba(0,0,0,0.25))",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* OUTER CIRCLE PATH */}
          <path id="outerCircle" d="M60,10 a50,50 0 1,1 -0.1,0" />

          {/* PERFECT CENTER ROTATION TEXT PATH */}
          <path id="textCircle" d="M60,10 a50,50 0 1,1 -0.1,0" />
        </defs>

        {/* OUTER ARC (RED + BLACK) */}
        <motion.g
          {...outerRotate}
          style={{ originX: "50%", originY: "50%" }}
        >
          <use
            href="#outerCircle"
            fill="none"
            // stroke="#c00"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="157"
            strokeDashoffset="0"
          />

          <use
            href="#outerCircle"
            fill="none"
            // stroke="#111827"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="157"
            strokeDashoffset="157"
          />
        </motion.g>

        {/* OUTER TEXT - PERFECT CENTER ROTATION */}
        <motion.text
          {...outerRotate}
          style={{ originX: "50%", originY: "50%" }}
          fontFamily="Poppins, sans-serif"
          fontSize="11"
          fill="#c00"
          fontWeight="700"
        >
          <textPath href="#textCircle" startOffset="0%">
            Web Designer &amp; Developer • Web Designer &amp; Developer •
          </textPath>
        </motion.text>

        {/* INNER BADGE (STATIC LIKE GIF) */}
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="#ffffff"
          stroke="#c00"
          strokeWidth="4"
        />

        {/* CENTER TEXT */}
        <text
          x="60"
          y="55"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill="#b91c1c"
          fontFamily="'Times New Roman', serif"
        >
          R.K
        </text>

        <text
          x="60"
          y="72"
          textAnchor="middle"
          fontSize="15"
          fill="#111827"
          fontFamily="'Times New Roman', serif"
        >
          Prajapati
        </text>
      </svg>
    </motion.div>
  );
}
