"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import SkillsGridClient from "@/components/SkillsGridClient";
import ExperienceClient from "@/components/ExperienceClient";
import EducationClient from "@/components/EducationClient";
import CertificateClient from "@/components/CertificateClient";

interface AboutClientProps {
  skills: Array<{ _id: string; name: string; level: string; percent?: number; icon?: string }>;
  experiences: any[];
  educations: any[];
  certificates: any[];
}

export default function AboutClient({ skills, experiences, educations, certificates }: AboutClientProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "education" | "certificates">("experience");
  const pathname = usePathname();

  useEffect(() => {
    const valid = ["experience", "skills", "education", "certificates"];
    const setFromHash = () => {
      if (typeof window === "undefined") return;
      const h = (window.location.hash || "").replace("#", "");
      // prefer explicit path (/experience, /skills) else fallback to hash
      if (pathname && pathname !== "/about") {
        const p = pathname.replace("/", "");
        if (valid.includes(p)) setActiveTab(p as any);
        return;
      }
      if (valid.includes(h)) {
        setActiveTab(h as any);
        const el = document.getElementById(h);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 text-gray-800 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        <div className="md:w-1/3 flex justify-center">
          <div className="bg-white p-3 shadow-xl rounded-[30px]">
            <Image
              src="/profile.svg"
              width={400}
              height={400}
              alt="Profile"
              className="rounded-[20px] object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3 space-y-4">
          <h4 className="text-red-600 uppercase tracking-wide font-semibold">Main Info</h4>
          <h1 className="text-4xl font-bold">About Me</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Hi there! I'm <strong>Rohit K. Prajapati</strong>, a <strong>Front-End WordPress Developer</strong> with over <strong>5+ years</strong> of 
              experience in my personal role at <strong>various companies</strong>. I especially handled more than 10 WordPress websites 
              including prominent sites such as BoomLive, TheCore, IndiaSpend.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Currently seeking a challenging role to further refine my skills, unleash my creativity, and actively 
              contribute to a company's growth. I am eager to be an integral part of success.
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-red-600 mb-2">Ready to Collaborate:</h3>
              <p className="text-gray-700">
                If you're looking to enhance your online presence, I'm here to help. Visit my{" "}
                <a href="#portfolio" className="text-red-600 hover:text-red-700">portfolio</a> to get in touch, 
                and let's explore how we can work together.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-5">
            <a
              href="/RohitPrajapatiCV.pdf"
              download
              style={{ color: "#fff"}} className="bg-red-600 text-white px-6 py-3 rounded-full shadow hover:bg-red-700 transition"
            >
              Download CV
            </a>
            <div className="flex gap-4 text-xl">
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <div className="flex justify-center mb-8">
          <div className="flex gap-4 px-2 md:space-x-6 overflow-x-auto no-scrollbar">
            {["experience", "skills", "education", "certificates"].map((tab) => {
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              const isActive = activeTab === tab;
              const baseClass = `shrink-0 inline-block px-6 py-2 rounded-full text-sm font-medium transition ${
                isActive ? "bg-red-600 text-white shadow" : "bg-white border border-gray-300 hover:bg-gray-100"
              }`;

              if (pathname === "/about" || pathname === "/about/") {
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab as any);
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `#${tab}`);
                      }
                    }}
                    className={baseClass}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <Link key={tab} href={`/${tab}`} scroll={true} className={baseClass}>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {activeTab === "experience" && experiences.length > 0 && (
          <motion.div id="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ExperienceClient experiences={experiences} />
          </motion.div>
        )}

        {activeTab === "skills" && (
          <motion.div id="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SkillsGridClient skills={skills} />
          </motion.div>
        )}

        {activeTab === "education" && educations.length > 0 && (
          <motion.div id="education" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EducationClient educations={educations} />
          </motion.div>
        )}

        {activeTab === "certificates" && certificates.length > 0 && (
          <motion.div id="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CertificateClient certificates={certificates} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import SkillsGridClient from "@/components/SkillsGridClient";
import ExperienceClient from "@/components/ExperienceClient";
import EducationClient from "@/components/EducationClient";
import CertificateClient from "@/components/CertificateClient";

interface AboutClientProps {
  skills: Array<{ _id: string; name: string; level: string; percent?: number; icon?: string }>;
  experiences: any[];
  educations: any[];
  certificates: any[];
}

export default function AboutClient({ skills, experiences, educations, certificates }: AboutClientProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "education" | "certificates">("experience");
  const pathname = usePathname();

  useEffect(() => {
    const valid = ["experience", "skills", "education", "certificates"];
    const setFromHash = () => {
      if (typeof window === "undefined") return;
      const h = (window.location.hash || "").replace("#", "");
      // prefer explicit path (/experience, /skills) else fallback to hash
      if (pathname && pathname !== "/about") {
        const p = pathname.replace("/", "");
        if (valid.includes(p)) setActiveTab(p as any);
        return;
      }
      if (valid.includes(h)) {
        setActiveTab(h as any);
        const el = document.getElementById(h);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br py-12 text-gray-800 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        <div className="md:w-1/3 flex justify-center">
          <div className="bg-white p-3 shadow-xl rounded-[30px]">
            <Image
              src="/profile.svg"
              width={400}
              height={400}
              alt="Profile"
              className="rounded-[20px] object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3 space-y-4">
          <h4 className="text-red-600 uppercase tracking-wide font-semibold">Main Info</h4>
          <h1 className="text-4xl font-bold">About Me</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Hi there! I'm <strong>Rohit K. Prajapati</strong>, a <strong>Front-End WordPress Developer</strong> with over <strong>5+ years</strong> of 
              experience in my personal role at <strong>various companies</strong>. I especially handled more than 10 WordPress websites 
              including prominent sites such as BoomLive, TheCore, IndiaSpend.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Currently seeking a challenging role to further refine my skills, unleash my creativity, and actively 
              contribute to a company's growth. I am eager to be an integral part of success.
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-red-600 mb-2">Ready to Collaborate:</h3>
              <p className="text-gray-700">
                If you're looking to enhance your online presence, I'm here to help. Visit my{" "}
                <a href="#portfolio" className="text-red-600 hover:text-red-700">portfolio</a> to get in touch, 
                and let's explore how we can work together.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-5">
            <a
              href="/RohitPrajapatiCV.pdf"
              download
              style={{ color: "#fff"}} className="bg-red-600 text-white px-6 py-3 rounded-full shadow hover:bg-red-700 transition"
            >
              Download CV
            </a>
            <div className="flex gap-4 text-xl">
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <div className="flex justify-center mb-8">
          <div className="flex gap-4 px-2 md:space-x-6 overflow-x-auto no-scrollbar">
            {["experience", "skills", "education", "certificates"].map((tab) => {
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              const isActive = activeTab === tab;
              const baseClass = `shrink-0 inline-block px-6 py-2 rounded-full text-sm font-medium transition ${
                isActive ? "bg-red-600 text-white shadow" : "bg-white border border-gray-300 hover:bg-gray-100"
              }`;

              // If we're on the About page, keep tabs internal (don't navigate away).
              // Otherwise render as links that go to the dedicated page.
              if (pathname === "/about" || pathname === "/about/") {
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab as any);
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `#${tab}`);
                      }
                    }}
                    className={baseClass}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <Link key={tab} href={`/${tab}`} scroll={true} className={baseClass}>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {activeTab === "experience" && experiences.length > 0 && (
          <motion.div id="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ExperienceClient experiences={experiences} />
          </motion.div>
        )}

        {activeTab === "skills" && (
          <motion.div id="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SkillsGridClient skills={skills} />
          </motion.div>
        )}

        {activeTab === "education" && educations.length > 0 && (
          <motion.div id="education" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EducationClient educations={educations} />
          </motion.div>
        )}

        {activeTab === "certificates" && certificates.length > 0 && (
          <motion.div id="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CertificateClient certificates={certificates} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
