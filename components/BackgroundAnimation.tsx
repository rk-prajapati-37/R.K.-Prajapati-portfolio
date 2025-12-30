"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'indigo', 'teal', 'orange', 'cyan'];

export default function BackgroundAnimation() {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generatedShapes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 10, // 10-30px
      color: `bg-${colors[Math.floor(Math.random() * 10)]}-300`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10, // 10-20s
    }));
    setShapes(generatedShapes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.color} opacity-20 rounded-full`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}