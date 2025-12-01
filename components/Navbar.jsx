<<<<<<< HEAD
"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import AnimatedLogo from "./AnimatedLogo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);

  return (
    <nav style={{ background: 'var(--surface)', color: 'var(--text)' }} className="fixed top-0 left-0 w-full h-24 shadow-md z-50">
      <div className="site-container flex justify-between items-center h-24">
        <Link href="/" className="flex items-center gap-3">
          <AnimatedLogo size={56} />
          <div className="hidden sm:flex flex-col text-lg font-semibold">
            <span>R.K Prajapati</span>
            <span className="text-[var(--muted)] text-sm">Web Designer &amp; Developer</span>
          </div>
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:underline">Home</Link>

          {/* About dropdown (hover + focus) */}
          {/* About dropdown (hover + focus) - JS backed to avoid disappearing when moving cursor */}
          <div
            className="relative"
            ref={aboutRef}
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
            onFocus={() => setAboutOpen(true)}
            onBlur={(e) => {
              // close only when focus leaves the whole wrapper
              const related = e.relatedTarget;
              if (!aboutRef.current) return;
              if (related && aboutRef.current.contains(related)) return;
              setAboutOpen(false);
            }}
          >
            <Link href="/about" className="px-3 py-1 rounded-md hover:bg-gray-800 focus:outline-none cursor-pointer">About</Link>
            <div className={`absolute right-0 mt-2 w-48 bg-[var(--surface)] text-[var(--text)] rounded-md shadow-lg ${aboutOpen ? 'block' : 'hidden'}`}>
              <div className="py-2">
                <Link href="/experience" className="block px-4 py-2 hover:bg-white/3">Experience</Link>
                <Link href="/skills" className="block px-4 py-2 hover:bg-white/3">Skills</Link>
                <Link href="/education" className="block px-4 py-2 hover:bg-white/3">Education</Link>
                <Link href="/certificates" className="block px-4 py-2 hover:bg-white/3">Certificates</Link>
              </div>
            </div>
          </div>

          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/contact">Contact</Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2"
          style={{ color: 'var(--text)' }}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
          </button>
        </div>
      </div>

      <div className={`${open ? "block" : "hidden"} md:hidden`}>
        <div className="px-4 py-4 space-y-3" style={{ background: 'var(--surface)', color: 'var(--text)' }}>
          <Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>

          {/* mobile About submenu */}
          <div className="pt-2">
            <div className="font-medium">About</div>
            <Link href="/about" onClick={() => setOpen(false)} className="block pl-3 py-1">About (overview)</Link>
            <Link href="/experience" onClick={() => setOpen(false)} className="block pl-3 py-1">Experience</Link>
            <Link href="/skills" onClick={() => setOpen(false)} className="block pl-3 py-1">Skills</Link>
            <Link href="/education" onClick={() => setOpen(false)} className="block pl-3 py-1">Education</Link>
            <Link href="/certificates" onClick={() => setOpen(false)} className="block pl-3 py-1">Certificates</Link>
          </div>

          <Link href="/projects" onClick={() => setOpen(false)} className="block">Projects</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="block">Blog</Link>
          <Link href="/testimonials" onClick={() => setOpen(false)} className="block">Testimonials</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block">Contact</Link>
        </div>
        {/* Theme toggle is intentionally kept in header for mobile - remove duplicate in menu */}
      </div>
    </nav>
  );
}
=======
"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import AnimatedLogo from "./AnimatedLogo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);

  return (
    <nav style={{ background: 'var(--surface)', color: 'var(--text)' }} className="fixed top-0 left-0 w-full h-24 shadow-md z-50">
      <div className="site-container flex justify-between items-center h-24">
        <Link href="/" className="flex items-center gap-3">
          <AnimatedLogo size={56} />
          <div className="hidden sm:flex flex-col text-lg font-semibold">
            <span>R.K Prajapati</span>
            <span className="text-[var(--muted)] text-sm">Web Designer &amp; Developer</span>
          </div>
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:underline">Home</Link>

          {/* About dropdown (hover + focus) */}
          {/* About dropdown (hover + focus) - JS backed to avoid disappearing when moving cursor */}
          <div
            className="relative"
            ref={aboutRef}
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
            onFocus={() => setAboutOpen(true)}
            onBlur={(e) => {
              // close only when focus leaves the whole wrapper
              const related = e.relatedTarget;
              if (!aboutRef.current) return;
              if (related && aboutRef.current.contains(related)) return;
              setAboutOpen(false);
            }}
          >
            <Link href="/about" className="px-3 py-1 rounded-md hover:bg-gray-800 focus:outline-none cursor-pointer">About</Link>
            <div className={`absolute right-0 mt-2 w-48 bg-[var(--surface)] text-[var(--text)] rounded-md shadow-lg ${aboutOpen ? 'block' : 'hidden'}`}>
              <div className="py-2">
                <Link href="/experience" className="block px-4 py-2 hover:bg-white/3">Experience</Link>
                <Link href="/skills" className="block px-4 py-2 hover:bg-white/3">Skills</Link>
                <Link href="/education" className="block px-4 py-2 hover:bg-white/3">Education</Link>
                <Link href="/certificates" className="block px-4 py-2 hover:bg-white/3">Certificates</Link>
              </div>
            </div>
          </div>

          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/contact">Contact</Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2"
          style={{ color: 'var(--text)' }}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
          </button>
        </div>
      </div>

      <div className={`${open ? "block" : "hidden"} md:hidden`}>
        <div className="px-4 py-4 space-y-3" style={{ background: 'var(--surface)', color: 'var(--text)' }}>
          <Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>

          {/* mobile About submenu */}
          <div className="pt-2">
            <div className="font-medium">About</div>
            <Link href="/about" onClick={() => setOpen(false)} className="block pl-3 py-1">About (overview)</Link>
            <Link href="/experience" onClick={() => setOpen(false)} className="block pl-3 py-1">Experience</Link>
            <Link href="/skills" onClick={() => setOpen(false)} className="block pl-3 py-1">Skills</Link>
            <Link href="/education" onClick={() => setOpen(false)} className="block pl-3 py-1">Education</Link>
            <Link href="/certificates" onClick={() => setOpen(false)} className="block pl-3 py-1">Certificates</Link>
          </div>

          <Link href="/projects" onClick={() => setOpen(false)} className="block">Projects</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="block">Blog</Link>
          <Link href="/testimonials" onClick={() => setOpen(false)} className="block">Testimonials</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block">Contact</Link>
        </div>
        {/* Theme toggle is intentionally kept in header for mobile - remove duplicate in menu */}
      </div>
    </nav>
  );
}
>>>>>>> dc78aa9ff67fa16fd51f7455df467cef8cfd31b0
