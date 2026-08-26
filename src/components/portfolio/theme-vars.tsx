import type { ReactNode } from "react";
import { usePortfolio } from "@/lib/portfolio-store";

/**
 * Applies the editable theme colors as CSS variables on a wrapper element, so
 * the whole design system re-derives from them (borders, muted text, cards…).
 */
export function ThemeVars({ children }: { children: ReactNode }) {
  const { content, mode } = usePortfolio();
  const palette = mode === "dark" ? content.theme.dark : content.theme.light;

  return (
    <div
      style={
        {
          "--brand": content.theme.accent,
          "--background": palette.background,
          "--foreground": palette.foreground,
        } as React.CSSProperties
      }
      className="bg-background text-foreground"
    >
      {children}
    </div>
  );
}
