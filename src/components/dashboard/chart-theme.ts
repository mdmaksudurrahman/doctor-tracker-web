import type { CSSProperties } from "react";

// Eight distinct hues. The donuts need that many, since conditions show up to 8 slices.
export const PALETTE = [250, 160, 70, 25, 300, 200, 340, 110].map(
    (hue) => `oklch(0.65 0.16 ${hue})`
);

// The grouped "Other" slice
export const OTHER_COLOR = "var(--muted-foreground)";

export const axisTick = { fill: "var(--muted-foreground)", fontSize: 12 };
export const gridStroke = "var(--border)";

// Makes tooltips follow the light/dark theme
export const tooltipStyles: {
    contentStyle: CSSProperties;
    labelStyle: CSSProperties;
    itemStyle: CSSProperties;
} = {
    contentStyle: {
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        color: "var(--popover-foreground)",
        fontSize: 13,
    },
    labelStyle: { color: "var(--popover-foreground)", fontWeight: 500 },
    itemStyle: { color: "var(--popover-foreground)" },
};