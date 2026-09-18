"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";

/**
 * Wraps the app with:
 *  - Lenis smooth scrolling (skipped when the user prefers reduced motion)
 *  - MotionConfig so every framer-motion animation honours prefers-reduced-motion
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      // Let inner scrollable areas (project/blog device mockups, anything marked data-lenis-prevent) scroll natively
      prevent: (node) => node.classList.contains("device-screen") || node.hasAttribute("data-lenis-prevent"),
    });

    // Let in-page anchor links scroll smoothly too
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -110 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
