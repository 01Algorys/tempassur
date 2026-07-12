import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          padding: "80px",
          backgroundColor: "#072F5F",
          backgroundImage: "linear-gradient(135deg, #072F5F 0%, #0A4D9E 60%, #072F5F 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            🛡️
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: "white" }}>
            Temp<span style={{ color: "#FF7A00" }}>Assur</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 58,
            fontWeight: 800,
            color: "white",
            maxWidth: 900,
            lineHeight: 1.15,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 820,
          }}
        >
          Assurance temporaire 100 % en ligne, de 1 à 90 jours, pour tous vos véhicules.
        </div>
      </div>
    ),
    { ...size }
  )
}
