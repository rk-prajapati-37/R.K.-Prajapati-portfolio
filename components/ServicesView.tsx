"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck, FaWhatsapp, FaClock, FaStar, FaPhoneAlt, FaPencilRuler, FaCode, FaRocket, FaChevronDown, FaQuoteLeft, FaArrowRight, FaFileAlt, FaStore, FaShoppingCart, FaLaptopCode, FaTools, FaGlobe } from "react-icons/fa";
import PageHeader from "./PageHeader";
import PortableTextClient from "./PortableTextClientFixed";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/Reveal";
import TiltCard from "./motion/TiltCard";
import { WHATSAPP_NUMBER, WHATSAPP_QUOTE_URL } from "@/lib/contactLinks";

export type Service = {
  _id: string;
  title: string;
  slug?: string;
  startingPrice?: string;
  deliveryTime?: string;
  shortDescription?: string;
  features?: string[];
  whatsappText?: string;
  popular?: boolean;
};

type Testimonial = { _id: string; name: string; feedback?: any; role?: string; company?: string; image?: string };

const steps = [
  { Icon: FaPhoneAlt, title: "1. Free call", text: "Tell me about your business and what the website should do. I suggest the right package." },
  { Icon: FaPencilRuler, title: "2. Design", text: "You get a homepage design first. We adjust until you love it, before any code is written." },
  { Icon: FaCode, title: "3. Build", text: "I build the full site, mobile-friendly and fast, and share a preview link for your feedback." },
  { Icon: FaRocket, title: "4. Launch & support", text: "Site goes live on your domain. Free support after launch so nothing breaks." },
];

const faqs = [
  { q: "How long does a website take?", a: "A landing page takes 3–5 days, a business website 7–14 days, an online store 2–3 weeks. The timeline starts once I have your content (text, logo, photos)." },
  { q: "What do I need to give you?", a: "Your logo, a rough idea of pages, some text and photos. If you don't have text or images, I can help write and source them." },
  { q: "Do you provide domain and hosting?", a: "Yes. I can buy and set up domain and hosting in your name, or use ones you already have. You always own everything." },
  { q: "How does payment work?", a: "50% to start, 50% on launch. UPI, bank transfer or online payment. No hidden costs; the quote is the final price." },
  { q: "Will I be able to update the website myself?", a: "Yes. WordPress and Shopify sites come with a simple admin panel and a short walkthrough so you can change text, images and products yourself." },
  { q: "What happens after launch?", a: "Free support for the first month. After that you can take a monthly maintenance plan or contact me when needed." },
];

/** Pick an icon from the package title; no images needed on pricing cards. */
const iconFor = (title = "") => {
  const t = title.toLowerCase();
  if (/landing|one page|single page/.test(t)) return FaFileAlt;
  if (/e-?commerce|store|shop|woocommerce|shopify/.test(t)) return FaShoppingCart;
  if (/app|custom|react|next/.test(t)) return FaLaptopCode;
  if (/maintenance|support|care/.test(t)) return FaTools;
  if (/business|company|corporate|wordpress/.test(t)) return FaStore;
  return FaGlobe;
};

const waFor = (s: Service) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(s.whatsappText || `Hi Rohit, I'm interested in the "${s.title}" package. Can you share details and a quote?`)}`;

export default function ServicesView({ services, testimonials }: { services: Service[]; testimonials: Testimonial[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const popularIndex = services.findIndex((s) => s.popular);
  const highlight = popularIndex >= 0 ? popularIndex : services.length >= 3 ? 1 : -1;

  return (
    <div className="page-wrap">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Services & Pricing"
          title="Websites for Every Budget"
          subtitle="Clear packages, fixed prices, no surprises. Every site is mobile-friendly, fast and SEO-ready."
          crumbs={[{ label: "Services" }]}
        />

        {/* ---------- Packages ---------- */}
        {services.length === 0 ? (
          <div className="card text-center py-12 rounded-2xl">
            <p className="text-gray-600 mb-4">Packages are being updated. Message me for a custom quote.</p>
            <a href={WHATSAPP_QUOTE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 !text-white px-6 py-3 rounded-full font-semibold">
              <FaWhatsapp /> WhatsApp me
            </a>
          </div>
        ) : (
          <StaggerGroup className={`grid gap-6 items-stretch ${services.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-3xl mx-auto"}`} stagger={0.12}>
            {services.map((s, i) => {
              const hot = i === highlight;
              return (
                <StaggerItem key={s._id} className="h-full">
                  <TiltCard className="h-full rounded-2xl" maxTilt={5}>
                    <div
                      className={`relative h-full flex flex-col rounded-2xl p-7 border transition-shadow ${hot ? "shadow-2xl border-red-500 ring-2 ring-red-500/20" : "shadow-lg hover:shadow-xl"}`}
                      style={{ background: "var(--surface)", borderColor: hot ? undefined : "var(--card-border)" }}
                    >
                      {hot && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                          <FaStar aria-hidden /> Most popular
                        </span>
                      )}
                      {(() => { const Icon = iconFor(s.title); return (
                        <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${hot ? "bg-red-600 text-white" : "bg-red-50 text-red-600"}`}><Icon aria-hidden /></span>
                      ); })()}
                      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>{s.title}</h2>
                      {s.shortDescription && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.shortDescription}</p>}

                      <div className="mb-4">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Starting at</div>
                        <div className="text-3xl font-extrabold text-red-600">{s.startingPrice || "Custom"}</div>
                        {s.deliveryTime && (
                          <div className="inline-flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                            <FaClock className="text-red-500" aria-hidden /> {s.deliveryTime}
                          </div>
                        )}
                      </div>

                      {s.features && s.features.length > 0 && (
                        <ul className="space-y-2 mb-6 text-sm">
                          {s.features.map((f, k) => (
                            <li key={k} className="flex items-start gap-2 text-gray-700">
                              <span className="mt-0.5 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] shrink-0"><FaCheck aria-hidden /></span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto space-y-2 pt-2">
                        <motion.a
                          href={waFor(s)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn-shine w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold !text-white ${hot ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <FaWhatsapp aria-hidden /> Get this package
                        </motion.a>
                        {s.slug && (
                          <Link href={`/services/${s.slug}`} className="block text-center text-sm font-semibold text-gray-600 hover:text-red-600 py-1">
                            See full details <FaArrowRight className="inline text-xs" aria-hidden />
                          </Link>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}

        <Reveal className="text-center mt-8" amount={0.6}>
          <p className="text-sm text-gray-500">
            Need something different? <a href={WHATSAPP_QUOTE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-600">Message me</a> and I&apos;ll send a custom quote within a few hours.
          </p>
        </Reveal>

        {/* ---------- Process ---------- */}
        <section className="mt-24">
          <Reveal className="text-center mb-10">
            <p className="font-semibold text-sm md:text-base mb-2 text-red-600 uppercase tracking-[0.2em]">How it works</p>
            <h2 className="section-title text-3xl md:text-4xl font-bold">From idea to live website in 4 steps</h2>
          </Reveal>
          <StaggerGroup className="grid gap-6 md:grid-cols-4" stagger={0.1}>
            {steps.map(({ Icon, title, text }, i) => (
              <StaggerItem key={title} className="h-full">
                <div className="card h-full rounded-2xl !p-6 relative overflow-hidden">
                  <span className="absolute -right-3 -top-4 text-7xl font-black text-red-600/5 select-none">{i + 1}</span>
                  <span className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg mb-4"><Icon aria-hidden /></span>
                  <h3 className="font-bold mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        {/* ---------- Testimonials ---------- */}
        {testimonials.length > 0 && (
          <section className="mt-24">
            <Reveal className="text-center mb-10">
              <p className="font-semibold text-sm md:text-base mb-2 text-red-600 uppercase tracking-[0.2em]">Client feedback</p>
              <h2 className="section-title text-3xl md:text-4xl font-bold">People I&apos;ve built for</h2>
            </Reveal>
            <StaggerGroup className="grid gap-6 md:grid-cols-3" stagger={0.12}>
              {testimonials.slice(0, 3).map((t) => (
                <StaggerItem key={t._id} className="h-full">
                  <div className="card h-full rounded-2xl !p-6 flex flex-col">
                    <FaQuoteLeft className="text-xl text-red-600/60 mb-3" aria-hidden />
                    <div className="text-sm text-gray-700 leading-relaxed flex-grow line-clamp-5 portable-text">
                      <PortableTextClient value={t.feedback || ""} />
                    </div>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">{t.name?.charAt(0)}</span>
                      )}
                      <div>
                        <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text)" }}>{t.name}</p>
                        {(t.role || t.company) && <p className="text-xs" style={{ color: "var(--muted)" }}>{[t.role, t.company].filter(Boolean).join(" · ")}</p>}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}

        {/* ---------- FAQ ---------- */}
        <section className="mt-24 max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <p className="font-semibold text-sm md:text-base mb-2 text-red-600 uppercase tracking-[0.2em]">FAQ</p>
            <h2 className="section-title text-3xl md:text-4xl font-bold">Questions clients ask</h2>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="card rounded-2xl !p-0 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold"
                    style={{ color: "var(--text)" }}
                    aria-expanded={isOpen}
                  >
                    {f.q}
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-red-600 shrink-0"><FaChevronDown aria-hidden /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <Reveal className="mt-24" amount={0.4}>
          <div className="rounded-2xl p-10 text-center text-white bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 !text-white">Ready to get your website?</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8">Send me a message on WhatsApp. Tell me your business and budget, and I&apos;ll reply with a plan and quote, usually within a few hours.</p>
            <motion.a
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaWhatsapp className="text-xl" aria-hidden /> Get a Free Quote
            </motion.a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
