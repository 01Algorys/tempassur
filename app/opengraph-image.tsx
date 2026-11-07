import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const logo = await fetch(new URL("../public/tempassur-logo-white.png", import.meta.url)).then((res) => res.arrayBuffer())

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
        {/* eslint-disable-next-line jsx-a11y/alt-text -- ImageResponse only renders plain img */}
        <img src={logo as unknown as string} width={400} height={108} />
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
