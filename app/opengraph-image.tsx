import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #00C853 0%, #0A1628 72%)",
          color: "white",
          padding: "64px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              opacity: 0.85
            }}
          >
            SaveRateAfrica
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1 }}>
              Real-time rates to Nigeria
            </div>
            <div
              style={{
                fontSize: 30,
                maxWidth: 820,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.84)"
              }}
            >
              Compare remittance providers, save on fees, and send more money
              home from USA, UK, and Canada.
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)"
              }}
            >
              10+ providers
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                borderRadius: 999,
                background: "#FFD600",
                color: "#0A1628",
                fontWeight: 700
              }}
            >
              Send More. Spend Less.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
