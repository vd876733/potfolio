"use client";

import FloatingNavbar from "./FloatingNavbar";

interface TopNavProps {
  onNavClick: (section: string) => void;
  viewMode: "3D" | "2D";
  toggleViewMode: () => void;
}

export default function TopNav({ onNavClick, viewMode, toggleViewMode }: TopNavProps) {
  return (
    <FloatingNavbar
      onNavClick={onNavClick}
      viewMode={viewMode}
      toggleViewMode={toggleViewMode}
    />
  );
}
