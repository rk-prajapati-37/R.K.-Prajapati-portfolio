"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { FaArrowRight, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import Typewriter from "./motion/Typewriter";
import { EASE } from "./motion/Reveal";
import { WHATSAPP_QUOTE_URL } from "@/lib/contactLinks";

const HEADLINE = "Websites that bring your business more customers";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "60%", rotateX: -40 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.55, ease: EASE } },
};

export type HeroBadge = { _id?: string; name: string; icon?: string };

/** Used only when no skill is marked "Show in hero" in Sanity. */
const DEFAULT_BADGES: HeroBadge[] = [{ name: "React" }, { name: "Next.js" }, { name: "WordPress" }];

/** Up to 6 positions around the photo, filled in order. */
const BADGE_SLOTS = [
  "-top-2 left-4",
  "top-1/3 -right-6",
  "-bottom-2 left-1/4",
  "top-8 -right-2",
  "bottom-10 -left-8",
  "-top-3 right-1/4",
];

const proofPoints = ["Mobile-friendly & fast", "Delivered in 1–2 weeks", "Free support after launch"];

export default function HeroSection({ badges }: { badges?: HeroBadge[] }) {
  const floatingBadges = (badges && badges.length > 0 ? badges : DEFAULT_BADGES).slice(0, BADGE_SLOTS.length);

  return (
    <div className="pt-12 pb-8 px-6 md:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left text */}
        <motion.div className="md:w-2/3" variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="text-red-600 font-semibold mb-3 flex items-center gap-2 min-h-[1.75rem]">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" aria-hidden />
            <Typewriter
              words={["Web Designer", "WordPress Expert", "React & Next.js Developer", "Freelancer in Mumbai"]}
            />
          </motion.p>

          <motion.h1
            variants={wordContainer}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
            style={{ perspective: 800 }}
            aria-label={HEADLINE}
          >
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
                <motion.span variants={word} className="inline-block origin-bottom">
                  {i >= 5 ? <span className="hero-gradient-text">{w}</span> : w}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p variants={item} className="mt-5 text-lg text-gray-600 leading-relaxed max-w-2xl">
            I&apos;m R.K. Prajapati, a freelance web designer from Mumbai. I build clean, fast websites in WordPress,
            React and Next.js for small businesses, startups and creators, so you look professional and get more
            enquiries online.
          </motion.p>

          <motion.ul variants={item} className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
            {proofPoints.map((p) => (
              <li key={p} className="inline-flex items-center gap-2">
                <FaCheckCircle className="text-green-600" aria-hidden /> {p}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <a
                href={WHATSAPP_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex items-center gap-2 bg-green-600 !text-white rounded-full px-7 py-3.5 shadow-md hover:shadow-lg hover:shadow-green-500/30 hover:bg-green-700 transition text-base"
              >
                <FaWhatsapp className="text-xl" aria-hidden />
                <span className="font-semibold">Get a Free Quote on WhatsApp</span>
              </a>
            </motion.div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-700 px-2 py-3 transition"
            >
              See my work
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </motion.div>

          <motion.p variants={item} className="mt-4 text-xs text-gray-500">
            Usually replies within a few hours · No commitment, just a friendly chat about your project.
          </motion.p>
        </motion.div>

        {/* Right profile */}
        <motion.div
          className="md:w-1/3 flex justify-center"
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          <motion.div
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* rotating conic gradient ring */}
            <motion.div
              aria-hidden
              className="absolute -inset-3 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #dc2626, #f97316, #fbbf24, #dc2626 60%, transparent 60%, transparent 100%)",
                filter: "blur(0.5px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            {/* soft glow pulse */}
            <motion.div
              aria-hidden
              className="absolute -inset-16 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(239,68,68,0.28) 0%, rgba(239,68,68,0.10) 45%, transparent 68%)" }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* photo */}
            <div
              className="relative w-full h-full rounded-full shadow-xl overflow-hidden"
              style={{ background: "var(--surface)", boxShadow: "0 20px 60px rgba(220,38,38,0.25)" }}
            >
              <Image
                src="/profile.svg"
                alt="Rohit Prajapati"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 480px"
                className="object-cover rounded-full p-6"
              />
            </div>

            {/* floating tech badges */}
            {floatingBadges.map((b, i) => {
              const delay = i * 0.5;
              return (
                <motion.span
                  key={b._id ?? b.name}
                  className={`absolute ${BADGE_SLOTS[i]} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border whitespace-nowrap`}
                  style={{ background: "var(--surface)", color: "var(--accent)", borderColor: "var(--card-border)" }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { delay: 0.9 + delay, duration: 0.4 },
                    scale: { delay: 0.9 + delay, duration: 0.4 },
                    y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay },
                  }}
                >
                  {b.icon && <img src={b.icon} alt="" className="w-4 h-4 object-contain" />}
                  {b.name}
                </motion.span>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
