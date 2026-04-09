import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: "80px",
        }}
      >
        <svg
          width="340"
          height="340"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="180,40 300,108 300,244 180,312 60,244 60,108"
            fill="#16a34a"
            fillOpacity="0.2"
            stroke="#22c55e"
            strokeWidth="8"
          />
          <polygon
            points="180,68 274,122 274,230 180,284 86,230 86,122"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            opacity="0.5"
          />
          <polyline
            points="96,116 180,278 264,116"
            fill="none"
            stroke="#22c55e"
            strokeWidth="26"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="180" cy="180" r="18" fill="#22c55e" />
        </svg>
      </div>
    ),
    size,
  );
}
