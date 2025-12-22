"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import SkillsGridClient from "@/components/SkillsGridClient";
import ExperienceClient from "@/components/ExperienceClient";
import EducationClient from "@/components/EducationClientFixed";
import CertificateClient from "@/components/CertificateClient";
import HireMeCTA from "@/components/HireMeCTA";

interface AboutClientProps {
  skills: Array<{ _id: string; name: string; level: string; percent?: number; icon?: string }>;
  experiences: any[];
  educations: any[];
  certificates: any[];
}

export default function AboutClient({
  skills,
  experiences,
  educations,
  certificates,
}: AboutClientProps) {
  const [activeTab, setActiveTab] = useState<
    "experience" | "education" | "certificates"
  >("experience");

  const pathname = usePathname();

  useEffect(() => {
    const valid = ["experience", "education", "certificates"];

    const setFromHash = () => {
      if (typeof window === "undefined") return;

      const hash = (window.location.hash || "").replace("#", "");

      // If visiting /experience, /skills etc.
      if (pathname && pathname !== "/about") {
        const page = pathname.replace("/", "");
        if (valid.includes(page)) setActiveTab(page as any);
        return;
      }

      // Fallback: read #hash
      if (valid.includes(hash)) {
        setActiveTab(hash as any);
        const el = document.getElementById(hash);
        if (el) {
          // allow layout changes / animation to settle before scrolling to correct position
          setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        }
      }
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);

    return () => window.removeEventListener("hashchange", setFromHash);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 text-gray-800 pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        {/* Left Profile Section */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="bg-white p-4 shadow-xl rounded-[35px_0] mb-6" style={{
            '--tw-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '15px'
          } as React.CSSProperties}>
            <Image
              src="/Rohit_K_Prajapati.jpg"
              width={420}
              height={420}
              alt="Rohit K. Prajapati"
              className="rounded-[35px_0] object-cover"
            />
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61558068947419"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 text-blue-600 rounded-full flex items-center justify-center hover:text-blue-700 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              <FaFacebookF className="text-lg" />
            </a>
            <a
              href="https://twitter.com/prajapa54879726"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 text-blue-400 rounded-full flex items-center justify-center hover:text-blue-500 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              <FaTwitter className="text-lg" />
            </a>
            <a
              href="https://www.instagram.com/r.k.prajapati0307/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 text-pink-500 rounded-full flex items-center justify-center hover:text-pink-600 hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              href="https://www.linkedin.com/in/r-k-prajapati-2a5b4b169/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 text-blue-700 rounded-full flex items-center justify-center hover:text-blue-800 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              <FaLinkedinIn className="text-lg" />
            </a>
          </div>
        </div>

        {/* Right Content Section */}
        <div className="md:w-2/3 space-y-4">
          <h4 className="text-red-600 uppercase tracking-wide font-semibold">Main Info</h4>
          <h1 className="text-4xl font-bold">About Me</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Hi there! I'm <strong>Rohit K. Prajapati</strong>, a{" "}
              <strong>Front-End WordPress Developer</strong> with over{" "}
              <strong>5+ years</strong> of experience. I have handled more than 10
              WordPress websites including BoomLive, TheCore, IndiaSpend.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Currently seeking a challenging role to further refine my skills, unleash
              creativity, and contribute to a company's growth.
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-red-600 mb-2">Ready to Collaborate:</h3>
              <p className="text-gray-700">
                If you're looking to enhance your online presence, I'm here to help. Visit
                my{" "}
                <a href="#portfolio" className="text-red-600 hover:text-red-700">
                  portfolio
                </a>{" "}
                to get in touch, and let's work together.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-5">
            <a
              href="/RohitPrajapatiCV.pdf"
              download="RohitPrajapatiCV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Rohit K. Prajapati CV"
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition font-medium"
            >
              Download CV
            </a>

            <div className="flex gap-4 text-xl">
              <a href="#" className="text-gray-600 hover:text-red-600">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Showcase Section - Full Width with Light Background */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 py-16 mt-16 transition-colors duration-300 block" id="skills-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Technical Skills
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg px-4">
              Technologies and tools I specialize in
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            {skills && skills.length > 0 ? (
              <SkillsGridClient skills={skills} columns={3} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Skills loading or no skills available</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Tabs Section */}
      <div className="max-w-6xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Professional Details
          </h2>
          <p className="text-gray-600 text-lg">
            Explore my experience, education, and certifications
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200 overflow-x-auto">
            <div className="flex gap-1 md:gap-4 min-w-max">
              {[
                { key: "experience", label: "Experience", icon: "💼" },
                { key: "education", label: "Education", icon: "🎓" },
                { key: "certificates", label: "Certificates", icon: "🏆" }
              ].map((tab) => {
                const isActive = activeTab === tab.key;

                const baseClass = `flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`;

                if (pathname === "/about" || pathname === "/about/") {
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.key as any);

                        if (typeof window !== "undefined") {
                          window.history.replaceState(null, "", `#${tab.key}`);

                          setTimeout(() => {
                            const el = document.getElementById(tab.key);
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 80);
                        }
                      }}
                      className={baseClass}
                    >
                      <span className="text-sm md:text-base">{tab.icon}</span>
                      <span className="inline">{tab.label}</span>
                    </button>
                  );
                }

                return (
                  <Link key={tab.key} href={`/${tab.key}`} scroll={true} className={baseClass}>
                    <span className="text-sm md:text-base">{tab.icon}</span>
                    <span className="hidden xs:inline md:inline">{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "experience" && experiences.length > 0 && (
          <motion.div
            id="experience"
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ExperienceClient experiences={experiences} />
          </motion.div>
        )}

        {activeTab === "education" && educations.length > 0 && (
          <motion.div
            id="education"
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EducationClient educations={educations} />
          </motion.div>
        )}

        {activeTab === "certificates" && certificates.length > 0 && (
          <motion.div
            id="certificates"
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CertificateClient certificates={certificates} />
          </motion.div>
        )}
      </div>

      {/* Hire Me CTA */}
      <HireMeCTA text="Looking for a reliable freelance developer?" />
    </div>
  );
}
/* Duplicate content removed; keeping the top copy as the correct implementation. */
