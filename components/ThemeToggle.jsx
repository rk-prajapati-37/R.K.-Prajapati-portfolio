"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle({ showLabel = false }) {
  const [isLight, setIsLight] = useState(true);
  const [mounted, setMounted] = useState(true);

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

  const toggle = () => setIsLight((v) => !v);

  const bg = isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
  const border = isLight ? 'rgba(2,6,23,0.2)' : 'rgba(255,255,255,0.2)';
  const iconColor = isLight ? 'var(--text)' : 'var(--accent)';

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="flex items-center gap-2 p-2 rounded-md transition"
      style={{ color: iconColor, background: bg, border: `1px solid ${border}`, padding: '8px', borderRadius: 8 }}
    >
      {isLight ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M21.752 15.002A9 9 0 0 1 9 2.248 7 7 0 1 0 21.752 15.002z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 1.05l1.79-1.79-1.79-1.79-1.8 1.79 1.8 1.79zM20 11v2h3v-2h-3zM4.22 19.78l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm6.36-2.36l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79z" />
        </svg>
      )}
      {showLabel && (
        <span className="hidden sm:inline text-sm font-medium">Dark / Light</span>
      )}
    </button>
  );
}
