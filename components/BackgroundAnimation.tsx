"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const colors = ['bg-blue-300', 'bg-purple-300', 'bg-pink-300', 'bg-green-300', 'bg-yellow-300'];
const shapeTypes = ['circle', 'square', 'triangle', 'star'] as const;

interface Shape {
  id: number;
  size: number;
  color: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

export default function BackgroundAnimation() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const generatedShapes: Shape[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2-6px
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10, // 10-20s
      shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    }));
    setShapes(generatedShapes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.color} opacity-20 ${shape.shape === 'circle' ? 'rounded-full' : ''}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            clipPath: shape.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : shape.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : undefined,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 3, // 2-5s
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}