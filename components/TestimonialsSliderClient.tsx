"use client";

import { useState } from "react";
import PortableTextClient from "./PortableTextClientFixed";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import PageHeader from "./PageHeader";

type Testimonial = {
  _id: string;
  name: string;
  feedback?: string;
  position?: string;
  company?: string;
  role?: string;
  image?: string;
};

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
};

export default function TestimonialsSliderClient({
  testimonials,
  error,
}: {
  testimonials: Testimonial[];
  error: string | null;
}) {
  const [[currentIndex, direction], setPage] = useState<[number, number]>([0, 0]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-6">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">Error Loading Testimonials</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-6">
        <div className="text-center text-gray-600">
          <h1 className="text-2xl font-bold mb-2">No Testimonials Yet</h1>
          <p>Check back soon!</p>
        </div>
      </div>
    );
  }

  const total = testimonials.length;
  const indicesToShow = total === 1 ? [currentIndex] : [currentIndex, (currentIndex + 1) % total];

  const paginate = (dir: number) => {
    setPage(([i]) => [(i + dir + total) % total, dir]);
  };
  const goTo = (i: number) => setPage(([cur]) => [i, i > cur ? 1 : -1]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) * info.velocity.x;
    if (info.offset.x < -60 || swipe < -8000) paginate(1);
    else if (info.offset.x > 60 || swipe > 8000) paginate(-1);
  };

  return (
    <div className="page-wrap">
      <div className="max-w-6xl w-full mx-auto">
        <PageHeader
          eyebrow="Testimonials"
          title="What Clients Say"
          subtitle="Real feedback from people I have built websites for"
          crumbs={[{ label: "About", href: "/about" }, { label: "Testimonials" }]}
        />

        {/* Testimonial Cards (swipe / drag to navigate) */}
        <div className="relative overflow-hidden px-1">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag={total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={onDragEnd}
              className="grid gap-6 md:grid-cols-2 cursor-grab active:cursor-grabbing"
            >
              {indicesToShow.map((idx, mapIndex) => {
                const t = testimonials[idx];
                const hideOnMobile = mapIndex === 1 ? "hidden md:block" : "";
                return (
                  <motion.div
                    key={t._id}
                    className={`card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden ${hideOnMobile}`}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    {/* Quote Icon */}
                    <motion.div
                      className="text-6xl accent mb-6 text-left leading-none select-none"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      &ldquo;
                    </motion.div>

                    {/* Message */}
                    <div className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 italic portable-text">
                      <PortableTextClient value={t.feedback || ""} />
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center">
                      {t.image && (
                        <motion.img
                          src={t.image}
                          alt={t.name}
                          className="w-20 h-20 rounded-full object-cover border-4 mb-4"
                          style={{ borderColor: "var(--accent)" }}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
                          draggable={false}
                        />
                      )}

                      <h3 className="text-2xl font-bold mb-1">{t.name}</h3>

                      {(t.position || t.company || t.role) && (
                        <p className="muted text-sm">
                          {t.role && <span>{t.role}</span>}
                          {t.role && t.company && <span> · </span>}
                          {t.company && <span>{t.company}</span>}
                          {!t.role && !t.company && t.position && <span>{t.position}</span>}
                        </p>
                      )}
                    </div>

                    {/* Closing Quote */}
                    <div className="text-6xl accent mt-6 text-right leading-none select-none">&rdquo;</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <motion.button
            onClick={() => paginate(-1)}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition hover:bg-gray-100"
            aria-label="Previous testimonial"
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full ${index === currentIndex ? "bg-red-600" : "bg-gray-300"}`}
                animate={{ width: index === currentIndex ? 32 : 8 }}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => paginate(1)}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition hover:bg-gray-100"
            aria-label="Next testimonial"
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Counter */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm tabular-nums">
            {currentIndex + 1} of {total}
          </p>
        </div>
      </div>
    </div>
  );
}
