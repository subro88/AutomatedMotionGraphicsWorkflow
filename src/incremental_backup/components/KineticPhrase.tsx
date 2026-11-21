import React from "react";
import { THEME } from "../theme";

interface KineticPhraseProps {
  text: string;
  boldWords?: string[];
  highlightWord?: string;
  fontSize?: number;
}

export const KineticPhrase: React.FC<KineticPhraseProps> = ({
  text,
  boldWords = [],
  highlightWord = "",
  fontSize,
}) => {
  const words = text.split(" ");
  
  // Dynamic responsive font size: short phrases pop huge (62px), longer sentences scale to 54px
  const calculatedFontSize =
    fontSize || (words.length <= 8 ? 62 : words.length <= 12 ? 56 : 50);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 16px",
        maxWidth: "940px",
        padding: "0 10px",
        boxSizing: "border-box",
        textAlign: "center",
        lineHeight: 1.18,
        fontFamily: THEME.typography.fontFamily,
      }}
    >
      {words.map((w, i) => {
        const cleanWord = w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const isBold = boldWords.some(
          (bw) => bw.toLowerCase() === cleanWord || w.toLowerCase().includes(bw.toLowerCase())
        );
        const isHighlight =
          highlightWord &&
          (cleanWord === highlightWord.toLowerCase() ||
            w.toLowerCase().includes(highlightWord.toLowerCase()));

        return (
          <span
            key={i}
            style={{
              fontSize: `${calculatedFontSize}px`,
              fontWeight: isBold || isHighlight ? 850 : 500,
              color: isHighlight
                ? THEME.colors.orange
                : isBold
                ? THEME.colors.charcoal
                : THEME.colors.charcoalMuted,
              transform: isHighlight ? "scale(1.12)" : "scale(1)",
              transition: "transform 0.15s ease",
              display: "inline-block",
              letterSpacing: "-0.025em",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
