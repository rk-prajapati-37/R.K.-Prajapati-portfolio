"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

/**
 * Lightweight ambient background:
 *  - 3 slow-drifting gradient blobs (pure radial gradients, no CSS blur filter:
 *    large blur() filters render as faint rectangles on some Windows GPUs)
 *  - a soft glow that follows the mouse
 *  - a subtle dot grid for texture
 *
 * Replaces the previous 50-shape infinite animation, which was heavy on mobile.
 */
export default function BackgroundAnimation() {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(220,38,38,0.10), transparent 60%)`;

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(rgba(120,120,140,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* drifting blobs */}
      <motion.div
        className="absolute -top-56 -left-56 w-[760px] h-[760px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.20) 0%, rgba(220,38,38,0.08) 30%, transparent 62%)" }}
        animate={{ x: [0, 80, -40, 0], y: [0, 60, 120, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 -right-64 w-[820px] h-[820px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, rgba(249,115,22,0.06) 30%, transparent 62%)" }}
        animate={{ x: [0, -90, 30, 0], y: [0, -70, 50, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-64 left-1/3 w-[720px] h-[720px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.05) 30%, transparent 62%)" }}
        animate={{ x: [0, 60, -60, 0], y: [0, -80, -20, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* mouse glow */}
      <motion.div className="absolute inset-0" style={{ background: glow }} />
    </div>
  );
}
