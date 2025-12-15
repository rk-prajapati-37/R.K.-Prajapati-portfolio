"use client";

import { client } from "@/lib/sanityClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const SERVICES_QUERY = `
      *[_type == "service"] | order(_createdAt asc) {
        _id,
        title,
        startingPrice,
        deliveryTime,
        shortDescription,
        features,
        whatsappText,
        "slug": slug.current
      }
    `;

    client.fetch(SERVICES_QUERY).then(setServices);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        My Services
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service: any) => (
          <div
            key={service._id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold mb-2">
              {service.title}
            </h2>

            <p className="text-gray-600 mb-3">
              {service.shortDescription}
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

            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/services/${service.slug}`}
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                View Details
              </Link>

              {service.whatsappText && (
                <a
                  href={`https://wa.me/918082068480?text=${encodeURIComponent(service.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
