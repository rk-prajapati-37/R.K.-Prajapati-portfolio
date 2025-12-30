import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LayoutMotion from "../components/LayoutMotion";
import WhatsAppFloat from "../components/WhatsAppFloat";
import BackgroundAnimation from "../components/BackgroundAnimation";
import "./globals.css";

export const metadata = {
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
    url: "https://rkprajapati.dev",
    title: "R K Prajapati | Full Stack Developer",
    description: "Professional Next.js & React Developer available for freelance projects. Specializing in modern web development, responsive design, and performance optimization.",
    siteName: "R K Prajapati Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "R K Prajapati - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "R K Prajapati | Full Stack Developer",
    description: "Professional Next.js & React Developer available for freelance projects.",
    images: ["/og-image.jpg"],
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

const pageAnimation = {
  hidden: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.24, ease: "easeIn" } },
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
      <body className="min-h-screen relative">
        <BackgroundAnimation />
        <Navbar />
        <LayoutMotion>
          {children}
        </LayoutMotion>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
