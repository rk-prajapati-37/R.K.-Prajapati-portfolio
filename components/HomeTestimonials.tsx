"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaArrowRight, FaStar } from "react-icons/fa";
import PortableTextClient from "./PortableTextClientFixed";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/Reveal";
import TiltCard from "./motion/TiltCard";

type Testimonial = {
  _id: string;
  name: string;
  feedback?: any;
  role?: string;
  company?: string;
  image?: string;
};

export default function HomeTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">Testimonials</p>
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Clients Say</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Real feedback from people I have built websites for.</p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
          {testimonials.slice(0, 3).map((t) => (
            <StaggerItem key={t._id} className="h-full">
              <TiltCard className="h-full rounded-2xl" maxTilt={6}>
                <div className="card !p-7 h-full flex flex-col rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <FaQuoteLeft className="text-2xl text-red-600/70" aria-hidden />
                    <div className="flex gap-0.5 text-yellow-400" aria-label="5 star rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className="text-sm" aria-hidden />
                      ))}
                    </div>
                  </div>

                  <div className="text-gray-700 leading-relaxed flex-grow line-clamp-6 portable-text">
                    <PortableTextClient value={t.feedback || ""} />
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t" style={{ borderColor: "var(--card-border)" }}>
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2" style={{ borderColor: "var(--accent)" }} />
                    ) : (
                      <span className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
                        {t.name?.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold leading-tight" style={{ color: "var(--text)" }}>
                        {t.name}
                      </p>
                      {(t.role || t.company) && (
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {[t.role, t.company].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {testimonials.length > 3 && (
          <Reveal className="text-center mt-10" amount={0.6}>
            <motion.div className="inline-block" whileHover={{ x: 4 }}>
              <Link href="/testimonials" className="inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-700">
                Read all {testimonials.length} testimonials <FaArrowRight className="text-xs" aria-hidden />
              </Link>
            </motion.div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
