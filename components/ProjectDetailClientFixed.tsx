"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PortableTextClient, { toPlainText } from "./PortableTextClientFixed";
import ProjectSocialLinks from "./ProjectSocialLinks";
import HireMeCTA from "./HireMeCTA";
import SitePreview, { type PreviewPage } from "./SitePreview";
import { useRouter } from "next/navigation";

type SocialLink = {
  platform: string;
  url: string;
};

type Project = {
  title?: string;
  description?: string;
  details?: any;
  github?: string;
  demo?: string;
  techStack?: string[];
  category?: string[] | string;
  imageUrl?: string;
  extraImages?: { _key?: string; url?: string }[];
  pages?: PreviewPage[];
  video?: string;
  date?: string;
  clientName?: string;
  slug?: string;
  socialLinks?: SocialLink[];
  clientProblem?: string;
  solution?: string;
  results?: string;
};

export default function ProjectDetailClientFixed({ project, nextProject, prevProject, error }: { project: Project | null; nextProject?: { title: string; slug: string } | null; prevProject?: { title: string; slug: string } | null; error: string | null; }) {
  const router = useRouter();
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold">Error Loading Project</h1>
          <p>{error || "Project not found"}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return dateStr;
    }
  };

  // Convert common video links to embeddable URLs (YouTube / Vimeo). If already embed, return as-is.
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '').toLowerCase();
      // YouTube watch links -> embed
      if (host.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
        // playlist or other formats - return as-is
        return url;
      }
      // youtu.be short links
      if (host.includes('youtu.be')) {
        const id = u.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      // Vimeo
      if (host.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean).pop();
        if (id) return `https://player.vimeo.com/video/${id}`;
      }
      // If already an embed URL (contains /embed/ or player.vimeo), return as-is
      if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;
      return url; // fallback
    } catch (e) {
      return url;
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/projects?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto">
        {project.imageUrl && (
          <div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg">
            <img src={project.imageUrl} alt={project.title || 'Project'} className="w-full h-auto object-contain" />
          </div>
        )}

        {/* Video preview inside device frames for mobile/tablet if project.video exists */}
        {project.video && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mobile frame */}
            <div className="device-frame device-frame--mobile device-responsive">
              <div className="device-frame--mobile device-screen">
                {(() => {
                  const embed = getEmbedUrl(project.video);
                  if (!embed) return <div className="flex items-center justify-center h-full text-sm text-gray-400">Invalid video</div>;
                  return (
                    <iframe
                      src={embed}
                      title={project.title || 'Project demo'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
            </div>

            {/* Tablet/Large frame */}
            <div className="device-frame device-frame--tablet device-responsive">
              <div className="device-frame--tablet device-screen">
                {(() => {
                  const embed = getEmbedUrl(project.video);
                  if (!embed) return <div className="flex items-center justify-center h-full text-sm text-gray-400">Invalid video</div>;
                  return (
                    <iframe
                      src={embed}
                      title={project.title || 'Project demo'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">{project.title || 'Untitled Project'}</h1>
          </div>

          <div className="flex gap-4 flex-wrap mb-6 items-center">
            <div className="flex gap-4 flex-wrap">
              {project.github && (<a href={project.github} target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition">GitHub</a>)}
              {project.demo && (<a href={project.demo} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition">Live Project Link</a>)}
            </div>
            
            {/* Social Links */}
            {project.socialLinks && project.socialLinks.length > 0 && (
              <div className="ml-auto">
                <ProjectSocialLinks socialLinks={project.socialLinks} />
              </div>
            )}
          </div>

          {project.category && (
            <div className="flex flex-wrap gap-3 mb-6">
              {Array.isArray(project.category) ? project.category.map((cat, i) => (
                <button key={i} onClick={() => handleCategoryClick(String(cat))} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">{cat}</button>
              )) : (
                <button onClick={() => handleCategoryClick(String(project.category))} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">{String(project.category)}</button>
              )}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Project Description</h2>
            <div className="text-gray-700 text-lg leading-relaxed">
              <p>{project.description || "No description available."}</p>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              {project.clientName && (
                <div>
                  <span className="text-lg text-gray-800"><strong>Client -</strong> {project.clientName}</span>
                </div>
              )}
              {project.date && (
                <div>
                  <span className="text-lg text-gray-800"><strong>Project Date -</strong> {formatDate(project.date)}</span>
                </div>
              )}
            </div>
            {project.techStack && project.techStack.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Case Study Sections */}
          {project.clientProblem && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Client Problem</h2>
              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
                <p className="text-gray-700 text-lg leading-relaxed">{project.clientProblem}</p>
              </div>
            </div>
          )}

          {project.solution && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">My Solution</h2>
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-gray-700 text-lg leading-relaxed">{project.solution}</p>
              </div>
            </div>
          )}

          {project.results && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Results & Impact</h2>
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-gray-700 text-lg leading-relaxed">{project.results}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Detailed Info</h2>
            <div className="text-gray-700 text-lg leading-relaxed border-l-4 border-red-500 pl-6">
              {Array.isArray(project.details) ? (
                <PortableTextClient value={project.details} />
              ) : (
                <div className="portable-text">
                  {project.details || "Use rich text here (headings, paragraphs, lists)."}
                </div>
              )}
            </div>
          </div>

          {project.video && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">Demo Video</h3>
              <div className="aspect-video">
                <iframe
                  src={project.video.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <SitePreview pages={project.pages} extras={project.extraImages} demo={project.demo} title={project.title} />

          {/* Hire Me CTA */}
          <HireMeCTA text="Want a similar project?" />

          {/* Project Navigation */}
          {(nextProject || prevProject) && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                {prevProject && (
                  <Link href={`/projects/${prevProject.slug}`} className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition">
                    <span className="text-2xl">←</span>
                    <div>
                      <div className="text-sm font-medium">Previous Project</div>
                      <div className="text-lg font-semibold">{prevProject.title}</div>
                    </div>
                  </Link>
                )}
                <div className="flex-1"></div>
                {nextProject && (
                  <Link href={`/projects/${nextProject.slug}`} className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition">
                    <div className="text-right">
                      <div className="text-sm font-medium">Next Project</div>
                      <div className="text-lg font-semibold">{nextProject.title}</div>
                    </div>
                    <span className="text-2xl">→</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
    }


