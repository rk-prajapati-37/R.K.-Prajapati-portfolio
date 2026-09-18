"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeToggle({ showLabel = false }) {
  const [isLight, setIsLight] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // initialize from localStorage or system preference
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialLight = stored === "light" || (stored === null && !prefersDark);
    setIsLight(initialLight);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (isLight) {
        document.documentElement.classList.remove("dark");
        window.localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        window.localStorage.setItem("theme", "dark");
      }
    } catch (e) {
      // ignore
    }
  }, [isLight, mounted]);

  const toggle = () => setIsLight((v) => !v);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="flex items-center gap-2 p-2 rounded-md transition opacity-0" style={{ width: "40px", height: "40px" }}>
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden"
      style={{ backgroundColor: "var(--text)", color: "var(--surface)" }}
      whileHover={{ scale: 1.1, rotate: isLight ? -15 : 15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.svg
            key="moon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-8a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm13.66-6.66a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 0 1-1.41-1.42l1.41-1.41a1 1 0 0 1 1.42 0zM8.17 15.83a1 1 0 0 1 0 1.41l-1.41 1.42a1 1 0 0 1-1.42-1.42l1.42-1.41a1 1 0 0 1 1.41 0zm10.49 2.83a1 1 0 0 1-1.42 0l-1.41-1.42a1 1 0 0 1 1.41-1.41l1.42 1.41a1 1 0 0 1 0 1.42zM8.17 8.17a1 1 0 0 1-1.41 0L5.34 6.76a1 1 0 0 1 1.42-1.42l1.41 1.42a1 1 0 0 1 0 1.41z" />
          </motion.svg>
        )}
      </AnimatePresence>
      {showLabel && <span className="ml-2 text-sm">{isLight ? "Dark" : "Light"}</span>}
    </motion.button>
  );
}
