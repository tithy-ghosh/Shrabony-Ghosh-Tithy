import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.title}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #04120f 0%, #07211b 55%, #0d3a30 100%)",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(45,212,191,0.5), transparent 65%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -60,
            width: 380,
            height: 380,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(251,146,60,0.35), transparent 65%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#2dd4bf",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Portfolio
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            marginTop: 18,
            letterSpacing: -3,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "#99f6e4",
            marginTop: 8,
          }}
        >
          {site.title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(255,255,255,0.65)",
            marginTop: 34,
            maxWidth: 900,
          }}
        >
          Next.js · TypeScript · Node.js · Go · PostgreSQL — building fast,
          accessible web products end-to-end.
        </div>
      </div>
    ),
    size,
  );
}
