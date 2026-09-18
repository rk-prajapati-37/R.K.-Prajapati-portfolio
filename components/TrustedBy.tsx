"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/Reveal";

export type Client = { _id?: string; name: string; logo?: string; website?: string };

/**
 * Fallback list (used only until you add clients in Sanity Studio > "Clients (Trusted by)").
 */
const DEFAULT_CLIENTS: string[] = [
  "IndiaSpend",
  "BoomLive",
  "India Food Network",
  "Ping Network",
  "TheCore",
  "Bong-O-Rosh",
  "Degree Minus One",
  "Dunton Group",
  "Money Protects",
  "Bombay Velvet",
  "MBIZTech Consulting",
  "PDF in Films",
];

export default function TrustedBy({ clients }: { clients?: Client[] }) {
  const list: Client[] =
    clients && clients.length > 0 ? clients : DEFAULT_CLIENTS.map((name) => ({ name }));
  const track = [...list, ...list]; // duplicated for a seamless loop

  return (
    <Reveal amount={0.4}>
      <section className="py-10 px-6 md:px-10" aria-label="Clients I have worked with">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">
            Trusted by brands &amp; businesses
          </p>

          <div
            className="relative overflow-hidden"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            }}
          >
            <motion.div
              className="flex gap-4 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
            >
              {track.map((c, i) => {
                const inner = (
                  <>
                    {c.logo && <img src={c.logo} alt="" className="w-5 h-5 object-contain rounded-sm" />}
                    {c.name}
                  </>
                );
                const cls =
                  "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap";
                const style = { background: "var(--surface)", borderColor: "var(--card-border)", color: "var(--text)" };
                return c.website ? (
                  <a key={`${c.name}-${i}`} href={c.website} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-red-400 transition-colors`} style={style}>
                    {inner}
                  </a>
                ) : (
                  <span key={`${c.name}-${i}`} className={cls} style={style}>
                    {inner}
                  </span>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
