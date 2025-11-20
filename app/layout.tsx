import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata = {
  title: "My Portfolio",
  description: "Personal Portfolio built with Next.js + Sanity + Tailwind",
};

const pageAnimation = {
  hidden: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.24, ease: "easeIn" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <motion.main
          className="pt-20 min-h-screen site-container"
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={pageAnimation}
        >
          {children}
        </motion.main>
        <Footer />
      </body>
    </html>
  );
}
