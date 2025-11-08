"use client";
import React, { useEffect, useState } from "react";
import { client } from "../../lib/sanityClient";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(`*[_type == "testimonial"]{ _id, name, message, position }`)
      .then((data) => setTestimonials(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6 text-gray-800">
      <h2 className="text-4xl font-bold text-center mb-12">💬 Testimonials</h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >
            <p className="text-gray-600 mb-4 italic">"{t.message}"</p>
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
