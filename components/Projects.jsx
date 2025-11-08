"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/sanityClient";



const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "project"]{
          _id,
          title,
          description,
          "imageUrl": image.asset->url,
          link,
          techStack
        }`
      )
      .then((data) => setProjects(data))
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          My Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-400 text-lg">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((p) => (
              <div
                key={p._id}
                className="relative bg-gray-800/60 border border-gray-700 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-purple-300 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Tech Stack Tags */}
                  {p.techStack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-700/20 text-purple-300 text-xs px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Project Link Button */}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
