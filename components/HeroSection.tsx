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
          <p className="text-red-600 font-semibold mb-2">Hello!</p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            I'm Rohit Prajapati
          </motion.h1>
          <p className="text-red-600 mt-2">( Web Designer & Developer )</p>

          <div className="mt-6 prose max-w-none text-gray-600">
            <p>
              A passionate and seasoned web developer who holds a BSc in Computer
              Science from Mumbai University. With a focus on creating clean,
              responsive, and user-friendly websites, I bring a wealth of
              experience and expertise in WordPress, HTML, CSS, PHP, and
              JavaScript.
            </p>
            <h3 className="text-red-600 mt-6">Freelance Availability:</h3>
            <p>
              Having had the privilege of contributing to reputable
              organizations, I am now excited to extend my services as a
              freelance web developer. My career has been shaped by a
              commitment to delivering high-quality, customized solutions.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/about" className="inline-block bg-white border rounded-full px-6 py-3 shadow-md hover:shadow-lg">
              <span className="text-red-600 font-medium">More about Me</span>
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