"use client";

import { client } from "@/lib/sanityClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HireMeCTA from "@/components/HireMeCTA";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  // Function to truncate text to 20-25 words
  const truncateText = (text: string, maxWords: number = 22) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  useEffect(() => {
    const SERVICES_QUERY = `
      *[_type == "service"] | order(_createdAt asc) {
        _id,
        title,
        startingPrice,
        deliveryTime,
        shortDescription,
        description,
        features,
        whatsappText,
        "slug": slug.current,
        relatedProjects[]->{
          _id,
          title,
          description,
          techStack,
          github,
          demo,
          "slug": slug.current,
          "imageUrl": image.asset->url
        }
      }
    `;

    client.fetch(SERVICES_QUERY).then(setServices);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">SERVICES</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            My Services
          </h1>
          <p className="text-gray-600 text-lg">Expert web development services to bring your digital vision to life</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service: any, index: number) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-2">
                {service.title}
              </h2>

              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                {truncateText(service.description || service.shortDescription)}
              </p>

              <p className="text-red-600 font-semibold mb-2">
                Starting at {service.startingPrice}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                ⏱ {service.deliveryTime}
              </p>

              {service.features && service.features.length > 0 && (
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  {service.features.slice(0, 3).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {service.relatedProjects && service.relatedProjects.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Related Projects:</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.relatedProjects.slice(0, 2).map((project: any) => (
                      <Link
                        key={project._id}
                        href={`/projects/${project.slug}`}
                        className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs hover:bg-blue-100 transition"
                      >
                        {project.title}
                      </Link>
                    ))}
                    {service.relatedProjects.length > 2 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{service.relatedProjects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Link
                  href={`/services/${service.slug}`}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-center text-sm font-medium"
                >
                  View Details
                </Link>

                {service.whatsappText && (
                  <a
                    href={`https://wa.me/918082068480?text=${encodeURIComponent(service.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition text-center text-sm font-medium"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hire Me CTA */}
      <div className="mt-16">
        <HireMeCTA text="Need a custom service for your project?" />
      </div>
    </div>
  );
}
