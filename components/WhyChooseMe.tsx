"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { client } from "@/lib/sanityClient";

const query = `*[_type == "stats"] | order(order asc) {
  _id,
  value,
  suffix,
  label
}`;

export default function WhyChooseMe() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    client.fetch(query).then((data) => {
      setStats(data);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching stats:', error);
      setStats([]); // Fallback to empty array
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (stats.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(stats.length / 3));
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [stats]);

  const reasons = [
    {
      icon: "🎯",
      title: "Client-Focused Approach",
      description: "I prioritize understanding your unique needs and delivering solutions that exceed expectations."
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising on quality. Most projects delivered within 1-2 weeks."
    },
    {
      icon: "💡",
      title: "Modern Technologies",
      description: "Using cutting-edge technologies like Next.js, React, and modern CSS frameworks for optimal performance."
    },
    {
      icon: "🔧",
      title: "Full-Stack Expertise",
      description: "From frontend design to backend development, I handle complete web solutions."
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "All websites are responsive and optimized for mobile devices from the ground up."
    },
    {
      icon: "🚀",
      title: "Performance Optimized",
      description: "Fast loading speeds and SEO-friendly code that helps your business grow online."
    }
  ];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">WHY CHOOSE ME</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Work With Me?
            </h2>
          </div>
          <div className="text-center py-8">Loading stats...</div>
        </div>
      </section>
    );
  }

  const fixedStat = {
    value: "24/7",
    suffix: "",
    label: "Support"
  };

  const visibleStats = stats.slice(currentIndex * 3, (currentIndex * 3) + 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">WHY CHOOSE ME</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Work With Me?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            With years of experience and a passion for creating exceptional digital experiences,
            I deliver results that drive business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Animated Stats Slider Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={currentIndex}
          >
            {/* Dynamic Stats (3 columns) */}
            {visibleStats.map((stat) => (
              <div key={stat._id}>
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {typeof stat.value === "number" ? (
                    <CountUp end={stat.value} duration={2} />
                  ) : (
                    stat.value
                  )}
                  {stat.suffix}
                </div>
                <div className="text-gray-700 text-lg font-medium">{stat.label}</div>
              </div>
            ))}

            {/* Fixed 24/7 Support (4th column) */}
            <div>
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                {fixedStat.value}
                {fixedStat.suffix}
              </div>
              <div className="text-gray-700 text-lg font-medium">{fixedStat.label}</div>
            </div>
          </motion.div>

          {/* Slider Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(stats.length / 3) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-red-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}