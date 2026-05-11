"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left text */}
        <div className="md:w-2/3">
          <p className="text-red-600 font-semibold mb-2">🚀 Web Designer • Frontend Developer • WordPress Expert</p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Building Modern, Responsive & High-Performance Websites
          </motion.h1>
          <p className="text-red-600 mt-2">Hi, I'm R.K. Prajapati — passionate about creating visually appealing, user-friendly, and business-focused digital experiences.</p>

          <div className="mt-6 prose max-w-none text-gray-600">
            <p>
              I specialize in designing and developing modern websites using WordPress, Elementor, React, HTML, CSS, JavaScript, and Tailwind CSS. From business websites to landing pages and custom frontend solutions, I focus on delivering clean design, fast performance, and responsive user experiences.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/projects" className="inline-block bg-red-600 text-white rounded-full px-6 py-3 shadow-md hover:shadow-lg hover:bg-red-700 transition">
              <span className="font-medium">Explore My Work</span>
            </Link>
            <Link href="/contact" className="inline-block bg-white border border-red-600 rounded-full px-6 py-3 shadow-md hover:shadow-lg">
              <span className="text-red-600 font-medium">Contact Me</span>
            </Link>
          </div>
        </div>

        {/* Right profile */}
        <div className="md:w-1/3 flex justify-center">
          <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-white shadow-xl ring-8 ring-white">
            <Image src="/profile.svg" alt="Rohit Prajapati" fill sizes="(max-width: 768px) 80vw, 480px" className="object-cover rounded-full p-6" />
          </div>
        </div>
      </div>
    </div>
  );
}