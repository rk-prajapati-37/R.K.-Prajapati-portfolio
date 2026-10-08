"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaDesktop, FaMobileAlt } from "react-icons/fa";

export type PreviewPage = {
  _key?: string;
  pageName?: string;
  description?: string;
  desktopUrl?: string;
  mobileUrl?: string;
};

type Device = "desktop" | "mobile";

const DESKTOP_RATIO = 10 / 16; // frame height / width
const MOBILE_RATIO = 19 / 9;

// Sanity image URLs end with -<width>x<height>.<ext>
function dims(url?: string) {
  const m = url?.match(/-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
}

// how long the scroll from top to bottom should take (longer pages scroll for longer)
function panSeconds(url: string | undefined, frameRatio: number) {
  const d = dims(url);
  if (!d) return 6;
  const frames = d.h / d.w / frameRatio - 1; // how many extra "screens" of content
  if (frames <= 0.05) return 0;
  return Math.min(16, Math.max(3, frames * 1.5));
}

function ScrollImage({ src, alt, seconds, enabled }: { src: string; alt: string; seconds: number; enabled: boolean }) {
  const [active, setActive] = useState(false);
  const canPan = enabled && seconds > 0;
  return (
    <div
      className="absolute inset-0 cursor-ns-resize"
      onMouseEnter={() => canPan && setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => canPan && setActive((v) => !v)} // tap on touch screens
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="w-full h-full block object-cover select-none"
        style={{
          objectPosition: active ? "center bottom" : "center top",
          transition: active ? `object-position ${seconds}s linear` : "object-position 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      />
    </div>
  );
}

function hostOf(url?: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

export default function SitePreview({ pages, demo, title }: { pages: PreviewPage[]; demo?: string; title?: string }) {
  const reduce = useReducedMotion();
  const usable = useMemo(() => (pages || []).filter((p) => p.desktopUrl || p.mobileUrl), [pages]);
  const [pageIdx, setPageIdx] = useState(0);
  const page = usable[Math.min(pageIdx, usable.length - 1)];
  const [device, setDevice] = useState<Device>(page?.desktopUrl ? "desktop" : "mobile");

  // keep the device valid when switching pages that only have one view
  useEffect(() => {
    if (!page) return;
    if (device === "desktop" && !page.desktopUrl) setDevice("mobile");
    if (device === "mobile" && !page.mobileUrl) setDevice("desktop");
  }, [page, device]);

  if (!usable.length || !page) return null;

  const hasBoth = !!page.desktopUrl && !!page.mobileUrl;
  const src = device === "desktop" ? page.desktopUrl! : page.mobileUrl!;
  const seconds = panSeconds(src, device === "desktop" ? DESKTOP_RATIO : MOBILE_RATIO);
  const host = hostOf(demo);

  return (
    <section className="mb-10" aria-label="Website preview">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h3 className="text-2xl font-bold">Website Preview</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="hidden md:inline">Hover over the screen to scroll through the page.</span>
            <span className="md:hidden">Tap the screen to scroll through the page.</span>
          </p>
        </div>

        {hasBoth && (
          <div className="inline-flex rounded-full bg-gray-100 p-1" role="tablist" aria-label="Device">
            {(["desktop", "mobile"] as Device[]).map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={device === d}
                onClick={() => setDevice(d)}
                className={`relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  device === d ? "text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {device === d && (
                  <motion.span layoutId="site-preview-device" className="absolute inset-0 rounded-full bg-red-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative inline-flex items-center gap-2">
                  {d === "desktop" ? <FaDesktop /> : <FaMobileAlt />}
                  {d === "desktop" ? "Desktop" : "Mobile"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {usable.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Pages">
          {usable.map((p, i) => (
            <button
              key={p._key || i}
              role="tab"
              aria-selected={i === pageIdx}
              onClick={() => setPageIdx(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                i === pageIdx ? "bg-red-50 border-red-300 text-red-600" : "border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {p.pageName || `Page ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-br from-red-50 via-gray-50 to-orange-50 p-4 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${page._key || pageIdx}-${device}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mx-auto"
            style={{ maxWidth: device === "desktop" ? 860 : 290 }}
          >
            {device === "desktop" ? (
              <div className="rounded-xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/10">
                <div className="flex items-center gap-3 bg-gray-100 border-b border-gray-200 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-gray-500 text-center">{host || title || "website"}</div>
                </div>
                <div className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "16 / 10" }}>
                  <ScrollImage src={src} alt={`${title || "Website"} – ${page.pageName || "page"} (desktop)`} seconds={seconds} enabled={!reduce} />
                </div>
              </div>
            ) : (
              <div className="relative rounded-[2.6rem] bg-gray-900 p-2.5 shadow-2xl ring-1 ring-black/20">
                <span className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10 h-1.5 w-16 rounded-full bg-gray-700" />
                <div className="relative w-full overflow-hidden rounded-[2.1rem] bg-white" style={{ aspectRatio: "9 / 19" }}>
                  <ScrollImage src={src} alt={`${title || "Website"} – ${page.pageName || "page"} (mobile)`} seconds={seconds} enabled={!reduce} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {page.description && <p className="mx-auto mt-6 max-w-2xl text-center text-gray-600">{page.description}</p>}
      </div>
    </section>
  );
}
