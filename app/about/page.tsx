"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { client } from "../../lib/sanityClient";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certificates from "./components/Certificates";

interface Experience {
  id: number;
  position: string;
  company: string;
  location: string;
  date: string;
  description: string;
  companyLogo?: string;
  websiteUrl?: string;
}

interface Education {
  id: number;
  degree: string;
  institute: string;
  year: string;
  details: string;
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "education" | "certificates">("experience");
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "skill"]{ _id, name, level, "icon": icon.asset->url }`)
      .then((data: any) => setSkills(data))
      .catch(console.error);
  }, []);

  // Activate a tab based on URL hash (e.g. /about#experience)
  useEffect(() => {
    const valid = ["experience", "skills", "education", "certificates"];
    const setFromHash = () => {
      if (typeof window === "undefined") return;
      const h = (window.location.hash || "").replace("#", "");
      if (valid.includes(h)) {
        setActiveTab(h as any);
        // Also smooth-scroll to the element if present
        const el = document.getElementById(h);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);

  const experiences: Experience[] = [
    {
      id: 1,
      position: "Frontend Developer | WordPress Developer",
      company: "Freelancer",
      location: "Mumbai, India",
      date: "Jan 2023 – Present",
      description: "Working as a freelance frontend developer & WordPress specialist handling multiple projects worldwide.",
      companyLogo: "/images/companies/freelancer.png"
    },
    {
      id: 2,
      position: "Frontend Developer | WordPress Developer",
      company: "Ping Digital Broadcast Pvt. Ltd",
      location: "Mumbai, India",
      date: "Apr 2022 – Present",
      description: "Currently employed as a Frontend and WordPress Developer at Ping Digital Broadcast Private Limited. Working on BoomLive, TheCore, IndiaSpend platforms and other major projects.",
      companyLogo: "/images/companies/ping.png",
      websiteUrl: "https://www.pingnetwork.in"
    },
    {
      id: 3,
      position: "Frontend Developer | WordPress Developer",
      company: "DLC (Della Leaders Club)",
      location: "Mumbai, India",
      date: "May 2021 – Apr 2022",
      description: "Developed responsive websites and managed Elementor-based WordPress pages.",
    },
    {
      id: 4,
      position: "Frontend Developer | WordPress Developer",
      company: "Magnetrix Web Solutions",
      location: "Mumbai, India",
      date: "Jun 2020 – Jun 2021",
      description: "Worked on WordPress CMS customization and UI/UX improvement for multiple clients.",
    },
    {
      id: 5,
      position: "Web Designer | Web Developer | WordPress Developer",
      company: "Beyondd Digital Marketing Agency",
      location: "Mumbai, India",
      date: "Jul 2018 – Jun 2020",
      description: "Handled design-to-development workflow, WordPress themes, and website optimization.",
    },
    {
      id: 6,
      position: "MIS Executive Manager",
      company: "Grofers International Pvt. Ltd",
      location: "Mumbai, India",
      date: "Aug 2017 – Sep 2018",
      description: "Worked in data analytics and operational reporting.",
    },
  ];

  // Using dynamic skills from Sanity

  const education: Education[] = [
    {
      id: 1,
      degree: "Bachelor of Science (IT)",
      institute: "Mumbai University",
      year: "2017 – 2020",
      details: "Graduated with a focus on web development and software engineering.",
    },
    {
      id: 2,
      degree: "HSC (Science)",
      institute: "Maharashtra State Board",
      year: "2015 – 2017",
      details: "Completed higher secondary education with a science background.",
    },
  ];

  return (
    <div className="bg-[#f8f8f8] min-h-screen text-gray-800 pt-24 pb-20 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        {/* Profile Image */}
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

        {/* Info */}
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
              className="bg-red-600 text-white px-6 py-3 rounded-full shadow hover:bg-red-700 transition"
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

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="flex justify-center space-x-6 mb-8">
          {["experience", "skills", "education", "certificates"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                if (typeof window !== "undefined") window.location.hash = `#${tab}`;
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-red-600 text-white shadow"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Experience Section */}
        {activeTab === "experience" && (
          <motion.div id="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Experience />
          </motion.div>
        )}

        {/* Skills Section */}
        {activeTab === "skills" && (
          <motion.div id="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-4">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ translateY: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                className="group relative bg-white border border-gray-200 shadow-sm p-4 rounded-xl hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center overflow-hidden">
                      {skill.icon ? (
                        <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <span className="font-medium text-gray-800 text-lg">{skill.name}</span>
                    </div>
                  </div>

                  <div className="text-gray-600 text-sm">{skill.level}%</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  {(() => {
                    const levelStr = skill.level;
                    const numeric = typeof skill.percent === 'number' ? skill.percent : Number(levelStr);
                    const map: Record<string, number> = { Beginner: 25, Intermediate: 60, Advanced: 80, Expert: 95 };
                    const pct = Number.isFinite(numeric) && numeric > 0 ? numeric : (map[levelStr] ?? 60);
                    return (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1 }}
                        className="bg-red-600 h-2 rounded-full"
                      />
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Education Section */}
        {activeTab === "education" && (
          <motion.div id="education" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Education />
          </motion.div>
        )}

        {/* Certificates Section */}
        {activeTab === "certificates" && (
          <motion.div id="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Certificates />
          </motion.div>
        )}
      </div>
    </div>
  );
}
