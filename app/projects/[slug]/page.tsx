"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/sanityClient";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

type Project = {
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  techStack?: string[];
  category?: string[];
  imageUrl?: string;
  extraImages?: string[];
  video?: string;
  date?: string;
  clientName?: string;
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!slug) return;
    client
      .fetch(
        `*[_type == "project" && slug.current == $slug][0]{
          title, description, github, demo, techStack, category,
          clientName, date, video,
          "imageUrl": image.asset->url,
          "extraImages": extraImages[].asset->url
        }`,
        { slug }
      )
      .then((data) => setProject(data))
      .catch(console.error);
  }, [slug]);

  if (!project)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading project details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-80 object-cover rounded-xl mb-8"
          />
        )}

        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-4">
          {Array.isArray(project.category) ? (
            project.category.map((cat, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
              >
                {cat}
              </span>
            ))
          ) : project.category ? (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
              {project.category}
            </span>
          ) : null}
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="text-gray-600 text-sm space-y-1 mb-6">
          {project.clientName && (
            <p>
              <strong>Client:</strong> {project.clientName}
            </p>
          )}
          {project.date && (
            <p>
              <strong>Date:</strong> {project.date}
            </p>
          )}
        </div>

        {project.techStack && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-10">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            >
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Live Demo
            </a>
          )}
        </div>

        {project.video && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">🎥 Demo Video</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={project.video}
                className="w-full h-96 rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {project.extraImages && project.extraImages.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">📸 Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.extraImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Extra image ${i + 1}`}
                  className="rounded-lg shadow-md object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
