import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "R K Prajapati – Web Designer & Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generates the social-share preview image (WhatsApp, LinkedIn, X, Facebook)
 * on demand, so no static /og-image.jpg is needed.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f1724 0%, #1a2238 60%, #3b0d0d 100%)",
          color: "#ffffff",
          fontFamily: "Inter, Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(220,38,38,0.55), transparent 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#f87171", fontWeight: 600 }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#dc2626" }} />
          Web Designer • Frontend Developer • WordPress Expert
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24, letterSpacing: -2 }}>
          R.K. Prajapati
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, marginTop: 16, color: "#e2e8f0" }}>
          Building modern &amp; high-performance websites
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
          {["React", "Next.js", "WordPress", "Tailwind CSS"].map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 22px",
                borderRadius: 9999,
                border: "2px solid rgba(255,255,255,0.25)",
                fontSize: 24,
                fontWeight: 600,
                color: "#fecaca",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
