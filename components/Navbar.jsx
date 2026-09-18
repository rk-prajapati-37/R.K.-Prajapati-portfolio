"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import AnimatedLogo from "./AnimatedLogo";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./motion/ScrollProgress";
import { WHATSAPP_QUOTE_URL } from "@/lib/contactLinks";

/**
 * Simple, client-focused navigation:
 * Home · Services · Work · About · Blog · Contact · [Get a Quote]
 * Sub-pages (experience, skills, education, certificates, testimonials, social)
 * still exist and are reachable from About / Contact, but are not in the menu.
 */
const LINKS = [
  { href: "/", label: "Home", match: (p) => p === "/" },
  { href: "/services", label: "Services", match: (p) => p.startsWith("/services") },
  { href: "/projects", label: "Work", match: (p) => p.startsWith("/projects") },
  {
    href: "/about",
    label: "About",
    match: (p) => ["/about", "/experience", "/skills", "/education", "/certificates", "/testimonials"].some((r) => p.startsWith(r)),
  },
  { href: "/blog", label: "Blog", match: (p) => p.startsWith("/blog") },
  { href: "/contact", label: "Contact", match: (p) => p.startsWith("/contact") || p.startsWith("/social") },
];

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-1.5 rounded-full font-semibold transition hover:no-underline inline-block ${
        active ? "!text-white" : "text-gray-700 border border-gray-200 hover:border-red-500"
      }`}
      style={active ? undefined : { background: "var(--surface)" }}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50"
      animate={{
        height: scrolled ? 72 : 96,
        boxShadow: scrolled ? "0 8px 30px rgba(2,6,23,0.12)" : "0 2px 8px rgba(2,6,23,0.06)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{
        color: "var(--text)",
        background: scrolled ? "color-mix(in srgb, var(--surface) 78%, transparent)" : "var(--surface)",
        backdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <ScrollProgress />
      <div className="site-container flex justify-between items-center h-full !py-0">
        <Link href="/" className="flex items-center gap-3" aria-label="R.K Prajapati – Home">
          <motion.div animate={{ scale: scrolled ? 0.8 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
            <AnimatedLogo />
          </motion.div>
          <div className="hidden sm:flex flex-col font-semibold">
            <span className="text-base">R.K Prajapati</span>
            <span className="text-[var(--muted)] text-xs hidden lg:block">Web Designer &amp; Developer</span>
          </div>
        </Link>

        {/* desktop */}
        <div className="hidden md:flex gap-2 items-center">
          {LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={l.match(pathname)}>
              {l.label}
            </NavLink>
          ))}
          <motion.a
            href={WHATSAPP_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine ml-1 inline-flex items-center gap-2 bg-green-600 !text-white px-4 py-2 rounded-full hover:bg-green-700 transition font-semibold shadow-lg hover:no-underline"
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp aria-hidden /> Get a Quote
          </motion.a>
          <ThemeToggle />
        </div>

        {/* mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="p-2 rounded-md focus:outline-none focus:ring-2 relative w-10 h-10"
            style={{ color: "var(--text)" }}
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span className="absolute left-2 right-2 h-[2px] bg-current rounded" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }} style={{ top: "50%" }} transition={{ duration: 0.25 }} />
            <motion.span className="absolute left-2 right-2 h-[2px] bg-current rounded" animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} style={{ top: "50%" }} transition={{ duration: 0.2 }} />
            <motion.span className="absolute left-2 right-2 h-[2px] bg-current rounded" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }} style={{ top: "50%" }} transition={{ duration: 0.25 }} />
          </button>
          <ThemeToggle />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden overflow-hidden shadow-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "var(--surface)", color: "var(--text)", borderTop: "1px solid var(--card-border)" }}
          >
            <motion.div
              className="px-4 py-4 space-y-2"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
            >
              {LINKS.map((l) => (
                <motion.div key={l.href} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                  <Link
                    href={l.href}
                    className={`block py-2 px-3 rounded-lg font-medium ${l.match(pathname) ? "text-red-600 bg-red-50" : ""}`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="pt-2">
                <a
                  href={WHATSAPP_QUOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 !text-white px-4 py-3 rounded-full text-center hover:bg-green-700 transition font-semibold"
                >
                  <FaWhatsapp aria-hidden /> Get a Free Quote on WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
