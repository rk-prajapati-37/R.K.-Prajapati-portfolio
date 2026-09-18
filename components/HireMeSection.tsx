"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaBriefcase, FaFileInvoice, FaWhatsapp } from "react-icons/fa";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/Reveal";
import { WHATSAPP_QUOTE_URL } from "@/lib/contactLinks";

const buttons = [
  {
    href: "/contact",
    label: "Hire Me",
    Icon: FaBriefcase,
    className: "bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600",
    external: false,
  },
  {
    href: WHATSAPP_QUOTE_URL,
    label: "WhatsApp",
    Icon: FaWhatsapp,
    className: "bg-green-600 hover:bg-green-700 hover:shadow-green-500/30",
    external: true,
  },
  {
    href: "/contact?type=quote",
    label: "Get Free Quote",
    Icon: FaFileInvoice,
    className: "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30",
    external: false,
  },
];

const btnClass =
  "btn-shine inline-flex items-center gap-2 !text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg";

export default function HireMeSection() {
  return (
    <Reveal amount={0.3}>
      <section className="relative mt-16 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* animated gradient border glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-60"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, rgba(220,38,38,0.5) 12%, transparent 25%)",
            maskImage: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMaskImage: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 2,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-4xl mx-auto text-center px-6 md:px-10 relative">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to start your project?</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            I design and develop fast, modern, and scalable websites that help businesses grow.
          </p>

          <StaggerGroup className="flex flex-col sm:flex-row gap-4 justify-center items-center" stagger={0.12} amount={0.5}>
            {buttons.map(({ href, label, Icon, className, external }) => (
              <StaggerItem key={href}>
                <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.95 }}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={`${btnClass} ${className}`}>
                      <Icon aria-hidden /> {label}
                    </a>
                  ) : (
                    <Link href={href} className={`${btnClass} ${className}`}>
                      <Icon aria-hidden /> {label}
                    </Link>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </Reveal>
  );
}
