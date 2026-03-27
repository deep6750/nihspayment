export const colors = {
  bg: "#f7f9fc",
  surface: "#ffffff",
  surfaceContainerLow: "#f2f4f7",
  surfaceContainerHigh: "#e6e8eb",
  primary: "#00236f",
  primaryContainer: "#1e3a8a",
  secondary: "#006e2d",
  error: "#ba1a1a",
  warning: "#b45309",
  onSurface: "#191c1e",
  onSurfaceVariant: "#444651",
  outline: "#c5c5d3",
};

export const radii = {
  card: 16,
  button: 12,
  inputTop: 8,
};

export const shadows = {
  card: {
    shadowColor: "rgba(25,28,30,0.2)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
};

export const typography = {
  h1: { fontFamily: "Manrope_800ExtraBold", fontSize: 30, letterSpacing: -0.9, lineHeight: 36 },
  h2: { fontFamily: "Manrope_800ExtraBold", fontSize: 24, letterSpacing: -0.72, lineHeight: 30 },
  h3: { fontFamily: "Manrope_800ExtraBold", fontSize: 20, letterSpacing: -0.6, lineHeight: 26 },
  body: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 18 },
  strong: { fontFamily: "Inter_700Bold", fontSize: 15, lineHeight: 22 },
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

export const formatAmount = (value) => `AED ${Number(value || 0).toFixed(2)}`;
