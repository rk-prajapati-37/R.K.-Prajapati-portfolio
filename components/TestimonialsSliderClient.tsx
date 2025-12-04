

"use client";

import { useState } from "react";
import PortableTextClient from "./PortableTextClientFixed";
import { motion } from "framer-motion";

type Testimonial = {
  _id: string;
  name: string;
  feedback?: string;
  position?: string; // optional
  company?: string;
  role?: string;
  image?: string;
};


export default function TestimonialsSliderClient({
  testimonials,
  error,
}: {
  testimonials: Testimonial[];
  error: string | null;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const currentTestimonial = testimonials[currentIndex];
  const indicesToShow =
    testimonials.length === 1
      ? [currentIndex]
      : [currentIndex, (currentIndex + 1) % testimonials.length];

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  py-16  flex items-center justify-center">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-semibold text-lg mb-2 accent">TESTIMONIAL</p>
          <h1 className="text-4xl md:text-5xl font-bold">
            CLIENT SPEAK
          </h1>
        </motion.div>

        {/* Testimonial Card */}
        <div className="grid gap-6 md:grid-cols-2">
          {indicesToShow.map((idx, mapIndex) => {
            const t = testimonials[idx];
            const hideOnMobile = mapIndex === 1 ? "hidden md:block" : "";
            return (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`card rounded-2xl p-8 md:p-12 text-center ${hideOnMobile}`}
              >
                {/* Quote Icon */}
                <div className="text-6xl accent mb-6 text-left">"</div>

                {/* Message */}
                  <div className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 italic portable-text">
                      <PortableTextClient value={t.feedback || ""} />
                    </div>

                {/* Profile Section */}
              {/* Profile Section */}
<div className="flex flex-col items-center">
  {t.image && (
    <img
      src={t.image}
      alt={t.name}
      className="w-20 h-20 rounded-full object-cover border-4 mb-4"
      style={{ borderColor: "var(--accent)" }}
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
                <div className="text-6xl accent mt-6 text-right">"</div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={goToPrevious}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition hover:bg-gray-100"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition ${
                  index === currentIndex
                    ? "bg-red-600 w-8"
                    : "bg-gray-300 w-2"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition hover:bg-gray-100"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            {currentIndex + 1} of {testimonials.length}
          </p>
        </div>
      </div>
    </div>
  );
}
