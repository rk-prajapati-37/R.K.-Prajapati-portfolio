"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle({ showLabel = false }) {
  const [isLight, setIsLight] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // initialize from localStorage or system preference
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  const toggle = () => {
    console.log('Toggling theme, current isLight:', isLight);
    setIsLight((v) => !v);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 p-2 rounded-md transition opacity-0"
        style={{ width: '40px', height: '40px' }}
      >
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:opacity-80"
      style={{ backgroundColor: 'var(--text)', color: 'var(--surface)' }}
    >
      <span className="text-lg">
        {isLight ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
