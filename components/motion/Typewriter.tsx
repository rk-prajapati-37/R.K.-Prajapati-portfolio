"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Typewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1600,
  className = "",
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deletingSpeed : typingSpeed
      );
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className}>
      {text}
      <motion.span
        aria-hidden
        className="inline-block w-[2px] h-[1em] align-[-0.15em] ml-[2px] bg-current"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
}
