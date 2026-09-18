"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CountUp from "react-countup";
import { client } from "@/lib/sanityClient";
import { FaBullseye, FaBolt, FaLightbulb, FaTools, FaMobileAlt, FaRocket } from "react-icons/fa";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/Reveal";
import TiltCard from "./motion/TiltCard";

const query = `*[_type == "stats"] | order(order asc) {
  _id,
  value,
  suffix,
  label
}`;

const reasons = [
  {
    Icon: FaBullseye,
    title: "Client-Focused Approach",
    description: "I prioritize understanding your unique needs and delivering solutions that exceed expectations.",
  },
  {
    Icon: FaBolt,
    title: "Fast Delivery",
    description: "Quick turnaround times without compromising on quality. Most projects delivered within 1-2 weeks.",
  },
  {
    Icon: FaLightbulb,
    title: "You Own Everything",
    description: "Domain, hosting and code stay in your name. No lock-in, no monthly ransom.",
  },
  {
    Icon: FaTools,
    title: "WordPress & React Expert",
    description: "Business sites in WordPress, custom web apps in React and Next.js, e-commerce in Shopify.",
  },
  {
    Icon: FaMobileAlt,
    title: "Mobile-First Design",
    description: "All websites are responsive and optimized for mobile devices from the ground up.",
  },
  {
    Icon: FaRocket,
    title: "Performance Optimized",
    description: "Fast loading speeds and SEO-friendly code that helps your business grow online.",
  },
];

export default function WhyChooseMe() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    client
      .fetch(query)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setStats([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (stats.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(stats.length / 3));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [stats]);

  const visibleStats = stats.slice(currentIndex * 3, currentIndex * 3 + 3);
  const pages = Math.ceil(stats.length / 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal className="text-center mb-16">
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">WHY CHOOSE ME</p>
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Work With Me?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            With years of experience and a passion for creating exceptional digital experiences, I deliver results that
            drive business growth.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
          {reasons.map((reason) => (
            <StaggerItem key={reason.title} className="h-full">
              <TiltCard className="h-full rounded-xl" maxTilt={6}>
                <div className="group bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 h-full border border-transparent hover:border-red-200">
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mb-4"
                    whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <reason.Icon aria-hidden />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Animated Stats Slider Section */}
        <Reveal className="mt-16" amount={0.4}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading stats...</div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentIndex}
                  className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {visibleStats.map((stat) => (
                    <div key={stat._id}>
                      <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2 tabular-nums">
                        {typeof stat.value === "number" ? (
                          <CountUp end={stat.value} duration={2} enableScrollSpy scrollSpyOnce scrollSpyDelay={100} />
                        ) : (
                          stat.value
                        )}
                        {stat.suffix}
                      </div>
                      <div className="text-gray-700 text-lg font-medium">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Slider Indicators */}
            {pages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: pages }, (_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Show stats page ${index + 1}`}
                    className={`h-3 rounded-full ${index === currentIndex ? "bg-red-600" : "bg-gray-300"}`}
                    animate={{ width: index === currentIndex ? 28 : 12 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
