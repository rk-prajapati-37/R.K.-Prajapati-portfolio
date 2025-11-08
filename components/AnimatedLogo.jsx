"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLogo({ size = 180 }) {
  // outer rotates continuously
  const outerRotate = {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 16, ease: "linear" },
  };

  // inner pulse on hover
  const badgePulse = { whileHover: { scale: 1.06 }, whileTap: { scale: 0.98 } };

  // inner rotates slowly opposite direction for subtle motion
  const innerRotate = {
    animate: { rotate: -360 },
    transition: { repeat: Infinity, duration: 28, ease: "linear" },
  };

  return (
    <motion.div {...badgePulse} style={{ width: size, height: size }} title="R.K Prajapati - Web Designer & Developer">
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="R.K Prajapati logo"
      >
        <defs>
          <linearGradient id="ringGradMain" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* outer circular path for stroke */}
          <path id="outerPath" d="M60,8 a52,52 0 1,1 -0.1,0" />
          {/* slightly larger path for placing circular text outside the ring so it doesn't get clipped */}
          <path id="outerTextPath" d="M60,4 a56,56 0 1,1 -0.1,0" />
        </defs>

        {/* rotating outer ring using the defined gradient so it shows clearly */}
          {/* rotating outer ring composed of two half-arcs (red + black) */}
          <motion.g {...outerRotate} style={{ originX: "50%", originY: "50%" }}>
            {/* red half */}
            <use href="#outerPath" fill="none" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" strokeDasharray="163 163" strokeDashoffset="0" />
            {/* black half (offset so it sits opposite) */}
            <use href="#outerPath" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeDasharray="163 163" strokeDashoffset="163" />
          </motion.g>

          {/* move the circular text further out (larger radius) so it doesn't overlap the ring stroke */}
          {/* circular text moved inward so it sits inside the outer ring (radius ~44) */}
          <path id="textPathInner" d="M60,16 a44,44 0 1,1 -0.1,0" fill="none" />

          {/* circular text placed on the inner path and in white so it remains visible */}
          <text fontFamily="Poppins, 'Segoe UI', Roboto, Arial, sans-serif" fontSize="12" fill="#ffffff" fontWeight="700">
            <textPath href="#textPathInner" startOffset="6%">Web Designer &amp; Developer • Web Designer &amp; Developer • Web Designer &amp; Developer •</textPath>
          </text>

        {/* inner badge (empty center) */}
        <motion.g {...innerRotate} style={{ originX: "50%", originY: "50%" }}>
          <circle cx="60" cy="60" r="34" fill="none" stroke="#000" strokeWidth="4" opacity="0.12" />
          <circle cx="60" cy="60" r="32" fill="#ffffff" stroke="#e11d48" strokeWidth="4" />
          <circle cx="60" cy="60" r="24" fill="#ffffff" stroke="#b91c1c" strokeWidth="2" />
        </motion.g>
        {/* center text inside badge */}
        <text x="60" y="57" textAnchor="middle" fontSize="20" fontWeight="700" fill="#b91c1c" fontFamily="'Times New Roman', Georgia, serif">
          R.K
        </text>
        <text x="60" y="70" textAnchor="middle" fontSize="11" fill="#111827" fontFamily="'Times New Roman', Georgia, serif">
          Prajapati
        </text>
      </svg>
    </motion.div>
  );
}
