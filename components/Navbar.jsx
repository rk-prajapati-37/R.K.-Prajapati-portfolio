"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedLogo from "./AnimatedLogo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 w-full h-[96px] shadow-md z-50"
      style={{ background: "var(--surface)", color: "var(--text)" }}
    >
      <div className="site-container flex justify-between items-center h-[96px]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <AnimatedLogo />
            <div className="hidden sm:flex flex-col font-semibold">
               <span className="text-base border-b border-gray-300 ">R.K Prajapati</span>
              <span className="text-[var(--muted)] text-sm ">Web Designer &amp; Developer</span>
            </div>
          </Link>
          {/* desktop: theme toggle removed — icon stays after mobile menu button */}
        </div>
        <div className="hidden md:flex gap-2 items-center">
          <Link href="/" className={`px-3 py-1.5 rounded-full font-semibold transition hover:no-underline ${pathname === '/' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Home</Link>

          {/* About dropdown (hover + focus) */}
          <div
            className="relative"
            ref={aboutRef}
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
            onFocus={() => setAboutOpen(true)}
            onBlur={(e) => {
              const related = e.relatedTarget;
              if (!aboutRef.current) return;
              if (related && aboutRef.current.contains(related)) return;
              setAboutOpen(false);
            }}
          >
            <Link href="/about" className={`px-3 py-1.5 rounded-full font-semibold transition hover:no-underline ${pathname === '/about' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>About</Link>
            <div className={`absolute right-0 mt-2 w-56 bg-[var(--surface)] text-[var(--text)] rounded-md shadow-lg ${aboutOpen ? 'block' : 'hidden'}`}>
              <div className="py-4 space-y-2">
                <Link href="/experience" className={`block px-3 py-1.5 rounded-full font-semibold transition hover:no-underline text-center ${pathname === '/experience' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Experience</Link>
                <Link href="/skills" className={`block px-3 py-1.5 rounded-full font-semibold transition hover:no-underline text-center ${pathname === '/skills' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Skills</Link>
                <Link href="/education" className={`block px-3 py-1.5 rounded-full font-semibold transition hover:no-underline text-center ${pathname === '/education' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Education</Link>
                <Link href="/certificates" className={`block px-3 py-1.5 rounded-full font-semibold transition hover:no-underline text-center ${pathname === '/certificates' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Certificates</Link>
              </div>
            </div>
          </div>

          <Link href="/projects" className={`px-3 py-1.5 rounded-full font-semibold transition hover:no-underline ${pathname === '/projects' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Projects</Link>
          <Link href="/blog" className={`px-3 py-1.5 rounded-full font-semibold transition hover:no-underline ${pathname === '/blog' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Blog</Link>
          <Link href="/testimonials" className={`px-3 py-1.5 rounded-full font-semibold transition hover:no-underline ${pathname === '/testimonials' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Testimonials</Link>
          
          {/* Contact dropdown with Social option */}
          <div
            className="relative"
            ref={contactRef}
            onMouseEnter={() => setContactOpen(true)}
            onMouseLeave={() => setContactOpen(false)}
            onFocus={() => setContactOpen(true)}
            onBlur={(e) => {
              const related = e.relatedTarget;
              if (!contactRef.current) return;
              if (related && contactRef.current.contains(related)) return;
              setContactOpen(false);
            }}
          >
            <Link href="/contact" className={`px-3 py-1.5 rounded-full font-semibold transition hover:no-underline ${pathname === '/contact' || pathname === '/social' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>Contact</Link>
            <div className={`absolute right-0 mt-2 w-56 bg-[var(--surface)] text-[var(--text)] rounded-md shadow-lg ${contactOpen ? 'block' : 'hidden'}`}>
              <div className="py-4 space-y-2">
                <Link href="/social" className={`block px-3 py-1.5 rounded-full font-semibold transition hover:no-underline text-center ${pathname === '/social' ? "bg-gradient-to-r from-red-600 to-red-500 !text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200 hover:border-red-500"}`}>🔗 Social Media</Link>
              </div>
            </div>
          </div>
          <a
            href="/RohitPrajapatiCV.pdf"
            download="Rohit-Prajapati-Resume.pdf"
            className="bg-gradient-to-r from-red-600 to-red-500 !text-white px-3 py-1.5 rounded-full hover:from-red-700 hover:to-red-600 transition font-semibold shadow-lg hover:no-underline"
          >
            📄 Resume
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
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
          {/* mobile theme icon placed after the menu button */}
          <div className="ml-2">
            <ThemeToggle />
          </div>
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
          
          {/* Mobile Contact submenu - Social only */}
          <div className="pt-2">
            <div className="font-medium">Contact</div>
            <Link href="/social" onClick={() => setOpen(false)} className="block pl-3 py-1">🔗 Social Media</Link>
          </div>
          
          <a
            href="/RohitPrajapatiCV.pdf"
            download="Rohit-Prajapati-Resume.pdf"
            onClick={() => setOpen(false)}
            className="block bg-red-600 text-white px-4 py-2 rounded-full text-center hover:bg-red-700 transition font-medium"
          >
            📄 Download Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
