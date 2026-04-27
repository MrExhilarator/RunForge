import { createContext, useContext } from "react";

export const LIGHT = {
  // Violet spectrum
  v50: "#f5f3ff", v100: "#ede9fe", v200: "#ddd6fe", v300: "#c4b5fd",
  v400: "#a78bfa", v500: "#8b5cf6", v600: "#7c3aed", v700: "#6d28d9",
  v800: "#5b21b6", v900: "#4c1d95",
  // Neutrals (warm tinted)
  white: "#ffffff", bg: "#faf8ff", surface: "#f3f0fa", surfaceAlt: "#ece7f7",
  card: "#ffffff", border: "#e9e2f5", borderLight: "#f0ebfa",
  text: "#1e1533", textSec: "#4a3d6b", dim: "#8578a0", muted: "#b8aed0",
  placeholder: "#c5bbd9",
  // Accents
  green: "#22c55e", greenBg: "#f0fdf4", red: "#ef4444", redBg: "#fef2f2",
  blue: "#3b82f6", orange: "#f97316", amber: "#eab308",
  // Nav
  navBg: "rgba(250,248,255,0.95)", navScrollBg: "rgba(255,255,255,0.92)",
  isDark: false,
};

export const DARK = {
  // Violet spectrum (slightly brighter for dark bg)
  v50: "#1e1535", v100: "#2a1f4e", v200: "#3b2d6b", v300: "#6d52b5",
  v400: "#a78bfa", v500: "#8b5cf6", v600: "#a78bfa", v700: "#c4b5fd",
  v800: "#ddd6fe", v900: "#ede9fe",
  // Neutrals
  white: "#0f0b1a", bg: "#0b0814", surface: "#161025", surfaceAlt: "#1c1533",
  card: "#140e22", border: "#2a1f4e", borderLight: "#1e1535",
  text: "#e8e2f4", textSec: "#b8aed0", dim: "#7a6fa0", muted: "#4a3d6b",
  placeholder: "#4a3d6b",
  // Accents
  green: "#34d399", greenBg: "#0d2818", red: "#f87171", redBg: "#2d1215",
  blue: "#60a5fa", orange: "#fb923c", amber: "#fbbf24",
  // Nav
  navBg: "rgba(11,8,20,0.95)", navScrollBg: "rgba(15,11,26,0.92)",
  isDark: true,
};

export const ThemeContext = createContext(LIGHT);
export const useTheme = () => useContext(ThemeContext);

export const TYPE_COLORS = {
  "Easy Run": "#22c55e", Intervals: "#f97316", "Tempo Run": "#8b5cf6",
  "Long Run": "#3b82f6", "Hill Repeats": "#ef4444", Rest: "#94a3b8",
  "Walk/Run": "#06b6d4", Race: "#eab308",
};
