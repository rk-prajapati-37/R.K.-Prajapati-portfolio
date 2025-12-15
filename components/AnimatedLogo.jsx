"use client";
import React from "react";

export default function AnimatedLogo() {
  const text = "Web Designer & Developer •";
  const chars = text.split("");

  const SIZE = 90;
  const TEXT_RADIUS = 45; // ✅ zyada space (IMPORTANT)

  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        position: "relative",
      }}
    >
      {/* Rotating text */}
      <div
        className="absolute inset-0 animate-spin"
        style={{
          animationDuration: "12s",
          zIndex: 20,
        }}
      >
        {chars.map((char, i) => {
          const angle = (360 / chars.length) * i;

          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `rotate(${angle}deg) translateY(-${TEXT_RADIUS}px)`,
                transformOrigin: "0 0",
                fontSize: "0.75rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                color:
                  char === "W" || char === "D"
                    ? "var(--accent)"
                    : "var(--text)",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Ring + Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="rounded-full animate-spin"
          style={{
            width: 58,
            height: 58,
            background:
              "conic-gradient(var(--accent) 50%, var(--text) 50%)",
            animationDuration: "12s",
          }}
        />

        <div
          className="absolute rounded-full bg-white flex flex-col items-center justify-center shadow-inner"
          style={{ width: 46, height: 46 }}
        >
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "red" }}>
            R.K
          </span>
          <hr style={{ width: 20, margin: "2px 0" }} />
          <span style={{ fontSize: "0.55rem" }}>Prajapati</span>
        </div>
      </div>
    </div>
  );
}