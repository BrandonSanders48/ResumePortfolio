import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// Shared by app/opengraph-image.tsx and app/twitter-image.tsx -- both file
// conventions render independently in Next.js, so this keeps the actual
// card design in one place instead of duplicating the JSX twice.
export function renderSiteOgImage() {
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
          background: "linear-gradient(135deg, #0b0d13 0%, #14171f 60%, #1a1f2e 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#ffffff",
              color: "#0b0d13",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            BS
          </div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}>BRANDONSANDERS.ORG</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>Brandon Sanders, CISSP</div>
          <div style={{ display: "flex", fontSize: 34, color: "#8fb5af", marginTop: 20 }}>
            IT Security Leader &amp; Manager
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.55)", marginTop: 12 }}>
            Portfolio &amp; Resume
          </div>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
