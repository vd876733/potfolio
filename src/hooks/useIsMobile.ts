"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Attach event listener
    mediaQuery.addEventListener("change", handler);

    // Clean up
    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
