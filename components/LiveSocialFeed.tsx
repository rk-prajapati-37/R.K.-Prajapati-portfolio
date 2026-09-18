"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaYoutube, FaInstagram, FaFacebookF, FaPlay, FaExternalLinkAlt } from "react-icons/fa";
import { Reveal } from "./motion/Reveal";
import TiltCard from "./motion/TiltCard";

type FeedPlatform = "youtube" | "instagram" | "facebook";
type FeedPost = {
  id: string;
  platform: FeedPlatform;
  title?: string;
  text?: string;
  image?: string;
  url: string;
  date: string;
  isVideo?: boolean;
};

const META: Record<FeedPlatform, { label: string; Icon: React.ComponentType<any>; color: string; bg: string }> = {
  youtube: { label: "YouTube", Icon: FaYoutube, color: "text-red-600", bg: "bg-red-50" },
  instagram: { label: "Instagram", Icon: FaInstagram, color: "text-pink-500", bg: "bg-pink-50" },
  facebook: { label: "Facebook", Icon: FaFacebookF, color: "text-blue-600", bg: "bg-blue-50" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

export default function LiveSocialFeed({ limit = 9 }: { limit?: number }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [platforms, setPlatforms] = useState<FeedPlatform[]>([]);
  const [filter, setFilter] = useState<"all" | FeedPlatform>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/social-feed")
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts || []);
        setPlatforms(d.platforms || []);
      })
      .catch((e) => console.error("Live social feed failed:", e))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  // "All": interleave platforms (newest of each, round-robin) so one busy platform doesn't hide the others.
  const interleaved = (() => {
    const byPlatform = new Map<FeedPlatform, FeedPost[]>();
    for (const p of posts) byPlatform.set(p.platform, [...(byPlatform.get(p.platform) || []), p]);
    const queues = [...byPlatform.values()];
    const out: FeedPost[] = [];
    while (out.length < posts.length) {
      for (const q of queues) {
        const next = q.shift();
        if (next) out.push(next);
      }
    }
    return out;
  })();
  const visible = (filter === "all" ? interleaved : posts.filter((p) => p.platform === filter)).slice(0, limit);

  return (
    <section className="mb-16">
      <Reveal className="text-center mb-8">
        <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">Live feed</p>
        <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 mb-3">Latest Posts</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pulled automatically from my social channels, updated every hour.
        </p>
      </Reveal>

      {/* filter tabs */}
      {platforms.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(["all", ...platforms] as const).map((p) => {
            const active = filter === p;
            const Icon = p === "all" ? null : META[p].Icon;
            return (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  active ? "!text-white" : "text-gray-700 border border-gray-200 hover:border-red-400"
                }`}
                style={active ? undefined : { background: "var(--surface)" }}
              >
                {active && (
                  <motion.span
                    layoutId="live-feed-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-2">
                  {Icon && <Icon aria-hidden />} {p === "all" ? "All" : META[p].label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card !p-0 overflow-hidden rounded-2xl animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((post, i) => {
              const { label, Icon, color, bg } = META[post.platform];
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <TiltCard className="h-full rounded-2xl" maxTilt={6}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group card !p-0 overflow-hidden rounded-2xl h-full flex flex-col hover:no-underline"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title || label}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${bg}`}>
                            <Icon className={`text-5xl ${color}`} aria-hidden />
                          </div>
                        )}
                        {post.isVideo && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center text-xl backdrop-blur-sm transition-transform group-hover:scale-110">
                              <FaPlay className="ml-1" aria-hidden />
                            </span>
                          </span>
                        )}
                        <span
                          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${color}`}
                        >
                          <Icon aria-hidden /> {label}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        {post.title && (
                          <h3 className="font-bold text-gray-800 mb-1 line-clamp-2" style={{ color: "var(--text)" }}>
                            {post.title}
                          </h3>
                        )}
                        {post.text && !post.title && (
                          <p className="text-sm text-gray-600 line-clamp-4">{post.text}</p>
                        )}
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
                          <span>{formatDate(post.date)}</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-red-600 group-hover:gap-2 transition-all">
                            View <FaExternalLinkAlt className="text-[10px]" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </a>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
