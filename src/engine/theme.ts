/**
 * Visual Theme & Design Tokens for Incremental Backup Video
 * Minimalist Educational Presentation Design (Canva-inspired)
 */

export const THEME = {
  colors: {
    cream: "#FFF7ED", // Warm cream / ivory background
    creamDark: "#FEEAD2",
    white: "#FFFFFF",
    charcoal: "#292524", // Primary headings & text
    charcoalMuted: "#78716C",
    charcoalLight: "#A8A29E",
    orange: "#F45B16", // Primary brand highlight & accents
    orangeLight: "rgba(244, 91, 22, 0.12)",
    blue: "#2685D9", // Backup data & active process
    blueLight: "rgba(38, 133, 217, 0.12)",
    green: "#10B981", // Completed backups & success
    greenLight: "rgba(16, 185, 129, 0.12)",
    red: "#EF4444", // Warnings & limitations
    redLight: "rgba(239, 68, 68, 0.12)",
    purple: "#8B5CF6",
    border: "rgba(41, 37, 36, 0.08)",
    borderStrong: "rgba(41, 37, 36, 0.16)",
  },
  shadows: {
    card: "0 20px 50px -10px rgba(41, 37, 36, 0.08), 0 4px 16px -2px rgba(41, 37, 36, 0.04), 0 0 0 1px rgba(41, 37, 36, 0.04)",
    cardElevated: "0 30px 60px -12px rgba(41, 37, 36, 0.14), 0 8px 24px -4px rgba(41, 37, 36, 0.06), 0 0 0 1px rgba(244, 91, 22, 0.2)",
    soft: "0 10px 30px -5px rgba(41, 37, 36, 0.06), 0 2px 8px -1px rgba(41, 37, 36, 0.04)",
    subtle: "0 4px 12px rgba(41, 37, 36, 0.04)",
  },
  borderRadius: {
    card: "28px",
    panel: "24px",
    pill: "9999px",
    small: "14px",
  },
  typography: {
    fontFamily: "'Inter', 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: "44px",
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: "-0.025em",
      color: "#292524",
    },
    h2: {
      fontSize: "34px",
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: "#292524",
    },
    h3: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.015em",
      color: "#292524",
    },
    body: {
      fontSize: "17px",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#57534E",
    },
    caption: {
      fontSize: "14px",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
      color: "#78716C",
    },
  },
  springs: {
    gentle: { damping: 16, mass: 0.9, stiffness: 90 },
    snappy: { damping: 14, mass: 0.7, stiffness: 120 },
    bouncy: { damping: 12, mass: 0.6, stiffness: 140 },
  },
};
