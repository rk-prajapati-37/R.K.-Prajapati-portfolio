import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LayoutMotion from "../components/LayoutMotion";
import WhatsAppFloat from "../components/WhatsAppFloat";
import BackgroundAnimation from "../components/BackgroundAnimation";
import SmoothScroll from "../components/motion/SmoothScroll";
import CustomCursor from "../components/motion/CustomCursor";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://r-k-prajapati-portfolio.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "R K Prajapati | Full Stack Developer",
    template: "%s | R K Prajapati",
  },
  description:
    "Professional Next.js & React Developer available for freelance projects. Specializing in modern web development, responsive design, and performance optimization.",
  keywords: ["web developer", "full stack developer", "React", "Next.js", "freelancer", "web design", "JavaScript", "portfolio"],
  authors: [{ name: "Rohit Prajapati" }],
  creator: "Rohit Prajapati",
  publisher: "R K Prajapati",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "R K Prajapati | Full Stack Developer",
    description: "Professional Next.js & React Developer available for freelance projects. Specializing in modern web development, responsive design, and performance optimization.",
    siteName: "R K Prajapati Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "R K Prajapati | Full Stack Developer",
    description: "Professional Next.js & React Developer available for freelance projects.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isLight = theme === 'light' || (theme === null && !prefersDark);
                if (isLight) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen relative" suppressHydrationWarning={true}>
        <SmoothScroll>
          <BackgroundAnimation />
          <CustomCursor />
          <Navbar />
          <LayoutMotion>{children}</LayoutMotion>
          <Footer />
          <WhatsAppFloat />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
