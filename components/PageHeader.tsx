"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaChevronRight, FaHome } from "react-icons/fa";

/**
 * One consistent header for every inner page:
 *   Home › Section › Page   (breadcrumb – tells the user where they are)
 *   EYEBROW
 *   Title (gradient, same size everywhere)
 *   Subtitle
 *   [optional sub-navigation tabs, e.g. About group]
 */

export type Crumb = { label: string; href?: string };
export type Tab = { label: string; href: string };

/** Sub-navigation shared by all "About" pages so users can hop between them. */
export const ABOUT_TABS: Tab[] = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Education", href: "/education" },
  { label: "Certificates", href: "/certificates" },
  { label: "Testimonials", href: "/testimonials" },
];

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex justify-center mb-5">
      <ol className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border" style={{ background: "var(--surface)", borderColor: "var(--card-border)", color: "var(--muted)" }}>
        <li>
          <Link href="/" className="inline-flex items-center gap-1 hover:text-red-600 transition-colors" aria-label="Home">
            <FaHome aria-hidden /> Home
          </Link>
        </li>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="inline-flex items-center gap-2">
              <FaChevronRight className="text-[9px] opacity-60" aria-hidden />
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-red-600 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "text-red-600 font-semibold" : ""} aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SubNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  return (
    <div className="flex justify-center mt-8">
      <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full border max-w-full" style={{ background: "var(--surface)", borderColor: "var(--card-border)" }}>
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition hover:no-underline ${active ? "!text-white" : "text-gray-700 hover:text-red-600"}`}
            >
              {active && (
                <motion.span
                  layoutId="subnav-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  tabs,
  className = "",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  tabs?: Tab[];
  className?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center mb-12 ${className}`}
    >
      <Breadcrumbs items={crumbs && crumbs.length > 0 ? crumbs : [{ label: title }]} />
      <p className="font-semibold text-sm md:text-base mb-2 text-red-600 uppercase tracking-[0.2em]">{eyebrow}</p>
      <h1 className="section-title text-4xl md:text-5xl font-bold">{title}</h1>
      {subtitle && <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-3">{subtitle}</p>}
      {tabs && tabs.length > 0 && <SubNav tabs={tabs} />}
    </motion.header>
  );
}
