"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set initial theme from localStorage or system preference
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeLight = stored === "light" || (stored === null && !prefersDark);
    
    if (shouldBeLight) {
      document.documentElement.setAttribute("data-theme", "light");
      setIsLight(true);
    } else {
      document.documentElement.removeAttribute("data-theme");
      setIsLight(false);
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "light");
      window.localStorage.setItem("theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      window.localStorage.setItem("theme", "dark");
    }
  };

  if (!mounted) return <div className="ml-4 w-9 h-9" />; // Prevent hydration mismatch

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className={`ml-4 p-2 rounded-md text-sm flex items-center justify-center transition-all duration-200 ${
        isLight
          ? "bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500"
          : "bg-gray-700 hover:bg-gray-600 border-2 border-gray-600"
      }`}
      title={isLight ? 'Light theme' : 'Dark theme'}
    >
      {isLight ? (
        // Sun icon - dark color for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 4.5a.75.75 0 01.75-.75h0A.75.75 0 0111.5 4.5V5a.75.75 0 01-1.5 0v-.5zM10 15.5a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0v-.25a.75.75 0 01.75-.75zM4.5 10a.75.75 0 01-.75-.75h-.25a.75.75 0 010-1.5h.25A.75.75 0 014.5 10zM15.5 10a.75.75 0 01.75-.75h.25a.75.75 0 010 1.5h-.25A.75.75 0 0115.5 10zM6.22 6.22a.75.75 0 01.53-.22.75.75 0 01.53 1.28l-.18.18a.75.75 0 11-1.06-1.06l.18-.18zM13.72 13.72a.75.75 0 01.53-.22.75.75 0 01.53 1.28l-.18.18a.75.75 0 11-1.06-1.06l.18-.18zM6.22 13.78a.75.75 0 010-1.06l.18-.18a.75.75 0 111.06 1.06l-.18.18a.75.75 0 01-1.06 0zM13.72 6.28a.75.75 0 010-1.06l.18-.18a.75.75 0 111.06 1.06l-.18.18a.75.75 0 01-1.06 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
        </svg>
      ) : (
        // Moon icon - white color for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 116.707 2.707a6 6 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
