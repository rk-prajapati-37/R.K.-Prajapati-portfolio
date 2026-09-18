"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaFileDownload, FaArrowRight, FaBriefcase, FaGraduationCap, FaAward, FaWhatsapp, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import HireMeCTA from "@/components/HireMeCTA";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/PageHeader";
import { WHATSAPP_QUOTE_URL } from "@/lib/contactLinks";

interface Skill { _id: string; name: string; level?: string | number; percent?: number; icon?: string; order?: number }
interface Experience { _id: string; position?: string; company?: string; location?: string; startDate?: string; endDate?: string; isCurrent?: boolean; logo?: string; companyUrl?: string }
interface Education { _id: string; degree?: string; institution?: string; startDate?: string; endDate?: string }
interface Certificate { _id: string; title?: string; issuer?: string; date?: string; certificateImage?: string; url?: string }

interface AboutClientProps {
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  certificates: Certificate[];
}

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61558068947419", Icon: FaFacebookF, color: "text-blue-600 hover:bg-blue-50" },
  { name: "X (Twitter)", href: "https://twitter.com/prajapa54879726", Icon: FaXTwitter, color: "text-gray-800 hover:bg-gray-50" },
  { name: "Instagram", href: "https://www.instagram.com/r.k.prajapati0307/", Icon: FaInstagram, color: "text-pink-500 hover:bg-pink-50" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/r-k-prajapati-2a5b4b169/", Icon: FaLinkedinIn, color: "text-blue-700 hover:bg-blue-50" },
];

const whyMe = [
  "I reply within a few hours, on WhatsApp or email",
  "Fixed price quoted upfront, no surprise costs",
  "Mobile-friendly and fast on every device",
  "You own the site, domain and hosting",
  "Free support after launch",
  "Simple admin so you can update it yourself",
];

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "");

export default function AboutClient({ skills, experiences, educations, certificates }: AboutClientProps) {
  const skillChips = [...(skills || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).slice(0, 12);
  const jobs = (experiences || []).slice(0, 3);
  const edu = (educations || [])[0];
  const certs = (certificates || []).slice(0, 3);
  const yearsSince = 2019;
  const years = Math.max(1, new Date().getFullYear() - yearsSince);

  return (
    <div className="page-wrap text-gray-800">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: "About" }]} />
      </div>

      {/* ---------- Intro ---------- */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        <motion.div
          className="md:w-1/3 flex flex-col items-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="p-4 shadow-xl rounded-[35px_0] mb-6" style={{ background: "var(--surface)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}>
            <Image src="/Rohit_K_Prajapati.jpg" width={420} height={420} alt="Rohit K. Prajapati" priority className="rounded-[35px_0] object-cover" />
          </div>
          <div className="flex gap-3">
            {socials.map(({ name, href, Icon, color }) => (
              <motion.a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shadow border border-gray-200 ${color}`}
                whileHover={{ y: -4, scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="md:w-2/3 space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <p className="text-red-600 uppercase tracking-[0.2em] font-semibold text-sm">About me</p>
          <h1 className="section-title text-4xl md:text-5xl font-bold">Hi, I&apos;m Rohit</h1>
          <p className="inline-flex items-center gap-2 text-sm text-gray-500"><FaMapMarkerAlt className="text-red-500" aria-hidden /> Mumbai, India · working with clients worldwide</p>

          <p className="text-gray-700 leading-relaxed text-lg">
            I&apos;m a freelance web designer and developer. For the last {years}+ years I&apos;ve been building websites for small
            businesses, startups, media companies and creators, in <strong className="text-red-600">WordPress, React and Next.js</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            I care about two things: the site should look professional, and it should actually bring you enquiries. That means
            clean design, fast loading, mobile-first layouts and clear calls to action. You talk to me directly, no agency, no middlemen.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <motion.a href={WHATSAPP_QUOTE_URL} target="_blank" rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 bg-green-600 !text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition font-semibold shadow-md"
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <FaWhatsapp aria-hidden /> Let&apos;s talk
            </motion.a>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link href="/projects" className="inline-flex items-center gap-2 border border-red-600 text-red-600 px-5 py-2.5 rounded-full font-medium transition hover:bg-red-50">
                See my work <FaArrowRight className="text-xs" aria-hidden />
              </Link>
            </motion.div>
            <a href="/RohitPrajapatiCV.pdf" download="Rohit-Prajapati-Resume.pdf" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 px-2 py-2">
              <FaFileDownload aria-hidden /> Download CV
            </a>
          </div>
        </motion.div>
      </div>

      {/* ---------- Why work with me ---------- */}
      <section className="max-w-6xl mx-auto mt-20">
        <Reveal className="mb-8">
          <h2 className="section-title text-3xl font-bold">Why clients work with me</h2>
        </Reveal>
        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.06}>
          {whyMe.map((w) => (
            <StaggerItem key={w}>
              <div className="card rounded-xl !p-4 flex items-start gap-3 h-full">
                <FaCheckCircle className="text-green-600 mt-1 shrink-0" aria-hidden />
                <span className="text-gray-700 text-sm leading-relaxed">{w}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ---------- Tools ---------- */}
      {skillChips.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20">
          <Reveal className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <h2 className="section-title text-3xl font-bold">Tools I work with</h2>
            <Link href="/skills" className="text-sm font-semibold text-red-600 hover:text-red-700">All skills <FaArrowRight className="inline text-xs" aria-hidden /></Link>
          </Reveal>
          <StaggerGroup className="flex flex-wrap gap-3" stagger={0.04}>
            {skillChips.map((s) => (
              <StaggerItem key={s._id}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold" style={{ background: "var(--surface)", borderColor: "var(--card-border)", color: "var(--text)" }}>
                  {s.icon && <img src={s.icon} alt="" className="w-5 h-5 object-contain" />}
                  {s.name}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* ---------- Experience / Education / Certifications (compact) ---------- */}
      <section className="max-w-6xl mx-auto mt-20 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="card rounded-2xl !p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold inline-flex items-center gap-2" style={{ color: "var(--text)" }}><FaBriefcase className="text-red-600" aria-hidden /> Experience</h2>
              <Link href="/experience" className="text-sm font-semibold text-red-600 hover:text-red-700">Full timeline <FaArrowRight className="inline text-xs" aria-hidden /></Link>
            </div>
            {jobs.length === 0 ? (
              <p className="text-sm text-gray-500">Details coming soon.</p>
            ) : (
              <ul className="space-y-4">
                {jobs.map((j) => (
                  <li key={j._id} className="flex gap-4">
                    {j.logo ? (
                      <img src={j.logo} alt="" className="w-10 h-10 rounded-lg object-contain border shrink-0" style={{ borderColor: "var(--card-border)", background: "var(--surface)" }} />
                    ) : (
                      <span className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0"><FaBriefcase aria-hidden /></span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight" style={{ color: "var(--text)" }}>{j.position}</p>
                      <p className="text-sm text-gray-600">{j.company}{j.location ? ` · ${j.location}` : ""}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{fmt(j.startDate)} – {j.isCurrent ? "Present" : fmt(j.endDate)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        <div className="grid gap-6">
          <Reveal delay={0.1}>
            <div className="card rounded-2xl !p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold inline-flex items-center gap-2" style={{ color: "var(--text)" }}><FaGraduationCap className="text-red-600" aria-hidden /> Education</h2>
                {educations.length > 0 && <Link href="/education" className="text-xs font-semibold text-red-600">Details</Link>}
              </div>
              {edu ? (
                <>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{fmt(edu.startDate)} – {fmt(edu.endDate)}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">BSc Computer Science, Mumbai University</p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card rounded-2xl !p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold inline-flex items-center gap-2" style={{ color: "var(--text)" }}><FaAward className="text-red-600" aria-hidden /> Certifications</h2>
                {certificates.length > 3 && <Link href="/certificates" className="text-xs font-semibold text-red-600">All {certificates.length}</Link>}
              </div>
              {certs.length === 0 ? (
                <p className="text-sm text-gray-500">Coming soon.</p>
              ) : (
                <ul className="space-y-2">
                  {certs.map((c) => (
                    <li key={c._id} className="text-sm">
                      <span className="font-medium" style={{ color: "var(--text)" }}>{c.title}</span>
                      {c.issuer && <span className="text-gray-500"> · {c.issuer}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <HireMeCTA text="Looking for a reliable freelance developer?" />
    </div>
  );
}
