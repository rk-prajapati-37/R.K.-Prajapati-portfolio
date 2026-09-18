"use client";
import React, { useContext, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useIsPresent, type Variants } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

const pageAnimation: Variants = {
  hidden: { opacity: 0, y: 18 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: [0.42, 0, 1, 1] },
  },
};

/**
 * Keeps the App Router context LIVE while the page is present (so streamed
 * server data, loading states and revalidation all reach the page), and only
 * freezes it while the page is animating out, so the exit animation shows the
 * OLD page instead of flashing the new one.
 */
function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const isPresent = useIsPresent();
  const lastLive = useRef(context);
  if (isPresent) lastLive.current = context;
  return (
    <LayoutRouterContext.Provider value={isPresent ? context : lastLive.current}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function LayoutMotion({ children, className = "pt-24 site-container" }: Props) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout">
      <motion.main
        key={pathname}
        className={className}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={pageAnimation}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.main>
    </AnimatePresence>
  );
}
