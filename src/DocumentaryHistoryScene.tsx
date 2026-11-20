import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface DocumentaryHistoryProps {
  aspectRatio?: "16:9" | "9:16";
  primaryColor?: string;
  accentColor?: string;
}

export const DocumentaryHistoryScene: React.FC<DocumentaryHistoryProps> = ({
  aspectRatio = "16:9",
  primaryColor = "#eab308",
  accentColor = "#dc2626",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 1. Ken Burns 2.0 Smooth 3D Push & Camera Float
  const cameraZoom = interpolate(frame, [0, 450], [1.0, 1.12], { extrapolateRight: "clamp" });
  const cameraPanX = Math.sin(frame * 0.015) * 15;
  const cameraPanY = Math.cos(frame * 0.012) * 10;

  // 2. Highlighter sweep progress (starts at frame 45, lasts 40 frames)
  const highlightProgress = interpolate(frame, [45, 85], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Map route line draw progress (starts at frame 100, lasts 60 frames)
  const routeDraw = interpolate(frame, [100, 170], [420, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Red ink stamp spring impact
  const stampSpring = spring({
    frame: frame - 160,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.6 },
  });

  // 5. Kurzgesagt-style Character Puppet idle breath & eye blink
  const breathY = Math.sin(frame * 0.08) * 3;
  const isBlinking = frame % 90 > 84;

  return (
    <div
      style={{
        width,
        height,
        background: "#0c0d10",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Playfair Display', Georgia, serif",
      }}
    >
      {/* 2.5D PARALLAX BACKGROUND (Vintage Parchment & Topographic Map) */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          right: -40,
          bottom: -40,
          transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(28, 24, 20, 0.4) 0%, rgba(12, 13, 16, 0.95) 100%),
            repeating-linear-gradient(45deg, rgba(255, 230, 180, 0.02) 0px, rgba(255, 230, 180, 0.02) 2px, transparent 2px, transparent 16px)
          `,
          filter: "sepia(0.25) contrast(1.1)",
        }}
      >
        {/* Topographic Contour Lines SVG */}
        <svg
          style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50,300 Q 300,150 650,350 T 1300,280 T 1950,420"
            fill="none"
            stroke="#e2d4b7"
            strokeWidth="1.5"
          />
          <path
            d="M 20,450 Q 400,320 850,500 T 1500,410 T 1950,580"
            fill="none"
            stroke="#e2d4b7"
            strokeWidth="1.5"
          />
          <path
            d="M 80,650 Q 500,520 950,700 T 1600,600 T 1950,750"
            fill="none"
            stroke="#e2d4b7"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* FLOATING 35MM DUST PARTICLES */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35 }}>
        {[...Array(12)].map((_, idx) => {
          const px = (idx * 160 + frame * 0.4) % width;
          const py = (idx * 85 + Math.sin(frame * 0.02 + idx) * 20) % height;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: px,
                top: py,
                width: idx % 2 === 0 ? 3 : 2,
                height: idx % 2 === 0 ? 3 : 2,
                borderRadius: "50%",
                background: "rgba(255, 240, 200, 0.6)",
                boxShadow: "0 0 6px rgba(255, 240, 200, 0.8)",
              }}
            />
          );
        })}
      </div>

      {/* HISTORICAL ARCHIVE MAP & ANIMATED ROUTE (VOX / JOHNNY HARRIS STYLE) */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 80,
          width: width * 0.52,
          height: height * 0.72,
          background: "rgba(22, 20, 18, 0.75)",
          border: "1px solid rgba(226, 212, 183, 0.25)",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#eab308", fontWeight: 700, textTransform: "uppercase" }}>
          ARCHIVAL CARTOGRAPHY • SECTOR DECLASSIFIED
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#f5eee6", marginTop: 4 }}>
          The Strategic Corridor (1944 — 1952)
        </div>

        {/* Dynamic Route Map */}
        <svg style={{ width: "100%", height: "80%", marginTop: 16 }} viewBox="0 0 800 500">
          {/* Base Grid */}
          <line x1="100" y1="50" x2="100" y2="450" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <line x1="400" y1="50" x2="400" y2="450" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <line x1="700" y1="50" x2="700" y2="450" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

          {/* Animated Marching Route */}
          <path
            d="M 140,360 C 240,260 380,380 520,220 S 680,180 720,120"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeDasharray="420"
            strokeDashoffset={routeDraw}
          />

          {/* Waypoint A */}
          <circle cx="140" cy="360" r="6" fill="#eab308" />
          <text x="140" y="395" fill="#f5eee6" fontSize="14" textAnchor="middle" fontFamily="'Inter', sans-serif">
            ORIGIN POINT
          </text>

          {/* Waypoint B */}
          {frame >= 140 && (
            <g>
              <circle cx="520" cy="220" r="6" fill="#eab308" />
              <text x="520" y="255" fill="#f5eee6" fontSize="14" textAnchor="middle" fontFamily="'Inter', sans-serif">
                CROSSING ALPHA
              </text>
            </g>
          )}

          {/* Final Waypoint Pin Drop */}
          {frame >= 170 && (
            <g transform="translate(720, 120)">
              <circle cx="0" cy="0" r="8" fill="#dc2626" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.6" />
              <text x="0" y="-18" fill="#f87171" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="'Inter', sans-serif">
                TARGET EXTRACTION
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ARCHIVAL NEWSPAPER CLIPPING & HIGHLIGHTER SWEEP */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 70,
          width: width * 0.32,
          background: "#f4ede1",
          color: "#1c1917",
          padding: 28,
          borderRadius: 4,
          boxShadow: "0 30px 70px rgba(0, 0, 0, 0.8)",
          transform: "rotate(1.5deg)",
        }}
      >
        <div style={{ borderBottom: "2px solid #1c1917", paddingBottom: 8, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", fontWeight: 700, textTransform: "uppercase" }}>
            THE DAILY CHRONICLE • SPECIAL DISPATCH
          </div>
          <div style={{ fontSize: 9, color: "#78716c", marginTop: 2 }}>OCTOBER 14, 1947 • ARCHIVE FILE NO. 892-B</div>
        </div>

        {/* Main Headline with Animated Yellow Highlighter */}
        <div style={{ position: "relative", marginTop: 14 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${highlightProgress}%`,
              background: "rgba(250, 204, 21, 0.55)",
              borderRadius: 3,
              zIndex: 1,
            }}
          />
          <div style={{ position: "relative", zIndex: 2, fontSize: 21, fontWeight: 900, lineHeight: 1.25 }}>
            GOVERNMENT CONFIRMS SUPERSONIC FLIGHT BARRIER BREACHED
          </div>
        </div>

        <p style={{ fontSize: 11, lineHeight: 1.6, color: "#44403c", marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
          Official records reveal that the X-1 rocket-powered research aircraft exceeded Mach 1.06 in high-altitude
          tests over the Mojave Desert yesterday morning.
        </p>

        {/* Red Ink DECLASSIFIED Stamp */}
        {stampSpring > 0.01 && (
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 20,
              border: "3px solid #dc2626",
              borderRadius: 6,
              color: "#dc2626",
              padding: "6px 14px",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: "0.2em",
              transform: `scale(${Math.max(0.1, stampSpring)}) rotate(-12deg)`,
              opacity: Math.min(1, stampSpring),
            }}
          >
            DECLASSIFIED
          </div>
        )}
      </div>

      {/* KURZGESAGT-STYLE VECTOR CHARACTER PUPPET */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: width * 0.38,
          transform: `translateY(${breathY}px)`,
        }}
      >
        <svg width="180" height="240" viewBox="0 0 180 240">
          {/* Character Body / Robe */}
          <path d="M 50,140 Q 90,110 130,140 L 145,240 L 35,240 Z" fill="#2563eb" />
          {/* White Collar */}
          <polygon points="90,145 75,130 105,130" fill="#ffffff" />
          {/* Head */}
          <ellipse cx="90" cy="85" rx="36" ry="40" fill="#fde047" />
          {/* Glasses Frame */}
          <circle cx="78" cy="82" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle cx="102" cy="82" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="92" y1="82" x2="88" y2="82" stroke="#1e293b" strokeWidth="3" />
          {/* Eyes (Animated Blink) */}
          {!isBlinking ? (
            <>
              <circle cx="78" cy="82" r="4" fill="#0f172a" />
              <circle cx="102" cy="82" r="4" fill="#0f172a" />
            </>
          ) : (
            <>
              <line x1="72" y1="82" x2="84" y2="82" stroke="#0f172a" strokeWidth="3" />
              <line x1="96" y1="82" x2="108" y2="82" stroke="#0f172a" strokeWidth="3" />
            </>
          )}
          {/* Smile */}
          <path d="M 82,102 Q 90,110 98,102" fill="none" stroke="#0f172a" strokeWidth="2.5" />
          {/* Arm Pointing to Map */}
          <path d="M 52,150 Q 15,160 5,130" fill="none" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" />
          <circle cx="5" cy="130" r="7" fill="#fde047" />
        </svg>
      </div>

      {/* 2.5% FILM GRAIN OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)`,
        }}
      />
    </div>
  );
};
