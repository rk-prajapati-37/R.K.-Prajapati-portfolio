import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LayoutMotion from "../components/LayoutMotion";
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
        <LayoutMotion>
          {children}
        </LayoutMotion>
        <Footer />
      </body>
    </html>
  );
}
