import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { THEME } from "../theme";

interface HeaderBannerProps {
  category?: string;
  title: string;
  subtitle?: string;
  shieldIcon?: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  category = "Windows Server 2008 / 2008 R2",
  title,
  subtitle,
  shieldIcon = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldSpring = spring({
    frame,
    fps,
    config: THEME.springs.snappy,
  });

  const textSpring = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: THEME.springs.gentle,
  });

  const shieldRotate = interpolate(shieldSpring, [0, 1], [-25, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "18px",
        marginBottom: "28px",
      }}
    >
      {shieldIcon && (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "16px",
            background: THEME.colors.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(244, 91, 22, 0.3)",
            transform: `scale(${shieldSpring}) rotate(${shieldRotate}deg)`,
            opacity: shieldSpring,
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L4 5V11.5C4 16.5 7.4 21.2 12 22.5C16.6 21.2 20 16.5 20 11.5V5L12 2Z"
              fill="#FFFFFF"
            />
            <path
              d="M12 7V17.5M8.5 12H15.5"
              stroke={THEME.colors.orange}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 16}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            borderRadius: THEME.borderRadius.pill,
            background: THEME.colors.orangeLight,
            color: THEME.colors.orange,
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: THEME.colors.orange,
            }}
          />
          {category}
        </div>

        <h1
          style={{
            ...THEME.typography.h1,
            margin: "0 0 4px 0",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              ...THEME.typography.body,
              margin: 0,
              fontSize: "18px",
              color: THEME.colors.charcoalMuted,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
