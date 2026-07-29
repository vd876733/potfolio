"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect } from "react";
import { playClickSound, playHoverSound } from "@/utils/sound";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Target buttons, role="button", and .cursor-target elements
      const clickable = target.closest('button, [role="button"], .cursor-target');
      if (clickable) {
        if (clickable.hasAttribute('disabled') || (clickable as any).disabled) return;
        playClickSound();
      }
    };

    const handleGlobalPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, [role="button"], .cursor-target');
      if (clickable) {
        if (clickable.hasAttribute('disabled') || (clickable as any).disabled) return;

        // Check if we're already hovering this element to prevent repeats
        const lastHovered = (window as any)._lastHoveredElement;
        if (lastHovered === clickable) return;
        (window as any)._lastHoveredElement = clickable;

        playHoverSound();
      } else {
        (window as any)._lastHoveredElement = null;
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    document.addEventListener("pointerover", handleGlobalPointerOver, { capture: true, passive: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      document.removeEventListener("pointerover", handleGlobalPointerOver, { capture: true });
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
