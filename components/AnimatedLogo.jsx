"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLogo({ size = 180 }) {
  const outerRotate = {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 12, ease: "linear" },
  };

  const chars = [
    { char: 'W', translateX: '-0.47em', rotate: '-166.06deg' },
    { char: 'e', translateX: '-0.22em', rotate: '-145.56deg' },
    { char: 'b', translateX: '-0.28em', rotate: '-130.80deg' },
    { char: ' ', translateX: '-0.13em', rotate: '-118.92deg' },
    { char: 'D', translateX: '-0.36em', rotate: '-104.58deg' },
    { char: 'e', translateX: '-0.22em', rotate: '-87.37deg' },
    { char: 's', translateX: '-0.19em', rotate: '-75.07deg' },
    { char: 'i', translateX: '-0.14em', rotate: '-65.23deg' },
    { char: 'g', translateX: '-0.25em', rotate: '-53.76deg' },
    { char: 'n', translateX: '-0.28em', rotate: '-38.19deg' },
    { char: 'e', translateX: '-0.22em', rotate: '-23.43deg' },
    { char: 'r', translateX: '-0.21em', rotate: '-10.59deg' },
    { char: ' ', translateX: '-0.13em', rotate: '-0.63deg' },
    { char: '&', translateX: '-0.42em', rotate: '15.34deg' },
    { char: ' ', translateX: '-0.13em', rotate: '31.31deg' },
    { char: 'D', translateX: '-0.36em', rotate: '45.65deg' },
    { char: 'e', translateX: '-0.22em', rotate: '62.86deg' },
    { char: 'v', translateX: '-0.25em', rotate: '76.79deg' },
    { char: 'e', translateX: '-0.22em', rotate: '90.71deg' },
    { char: 'l', translateX: '-0.14em', rotate: '101.37deg' },
    { char: 'o', translateX: '-0.25em', rotate: '112.84deg' },
    { char: 'p', translateX: '-0.28em', rotate: '128.41deg' },
    { char: 'e', translateX: '-0.22em', rotate: '143.17deg' },
    { char: 'r', translateX: '-0.21em', rotate: '156.00deg' },
    { char: ' ', translateX: '-0.13em', rotate: '165.97deg' },
    { char: '•', translateX: '-0.18em', rotate: '174.83deg' },
  ];

  return (
    <div
      style={{
        width: 65,
        height: 92,
        position: "relative",
      }}
    >
      {/* Outer rotating text (positioned in semicircle above) */}
      <div
        className="absolute inset-0 animate-spin"
        style={{ position: 'relative', height: '5.2em', paddingBottom: '0.6rem', transformOrigin: 'center center', animationDuration: '12s' }}
        aria-label="Web Designer & Developer •"
      >
        {chars.map((item, index) => {
          return (
            <span
              key={index}
              style={{
                position: 'absolute',
                bottom: 'auto',
                left: '50%',
                transform: `translateX(${item.translateX}) rotate(${item.rotate})`,
                transformOrigin: 'center 3.44351em',
                color: item.char === 'W' || item.char === 'D' ? 'var(--accent)' : 'var(--text)',
                fontSize: '0.775rem',
                fontWeight: '600',
              }}
            >
              {item.char === ' ' ? '\u00A0' : item.char}
            </span>
          );
        })}
      </div>

      {/* Static inner circle (fixed in place) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ top: '-6px' }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center animate-spin relative" style={{ background: 'conic-gradient(var(--accent) 50%, var(--text) 50%)', animationDuration: '12s' }}></div>
        <div className="rounded-full bg-white flex flex-col items-center justify-center shadow-inner p-1 absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '3.25rem', height: '3.25rem' }}>
          <span className="font-bold leading-none" style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>
            R.K
          </span>
          <hr className="w-4 border-t border-gray-300 my-0.5" />
          <span className="font-medium -mt-0.5 leading-none" style={{ fontSize: '0.6rem', color: 'var(--text)' }}>
            Prajapati
          </span>
        </div>
      </div>
    </div>
  );
}