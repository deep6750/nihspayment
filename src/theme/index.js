export const colors = {
  bg: "#f7f9fb",
  surface: "#ffffff",
  surfaceDim: "#d8dadc",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerHighest: "#e0e3e5",
  primary: "#002058",
  primaryContainer: "#1a3673",
  secondary: "#515f74",
  tertiary: "#002a1a",
  success: "#10b981",
  error: "#ba1a1a",
  warning: "#b45309",
  onPrimary: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#444650",
  outline: "#757781",
  outlineVariant: "#c4c6d1",
};

export const radii = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  card: 24,
  button: 16,
  inputTop: 8,
};

export const shadows = {
  card: {
    shadowColor: "#191c1e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
};

export const typography = {
  h1: { fontFamily: "Inter_700Bold", fontSize: 32, letterSpacing: -0.64, lineHeight: 38 },
  h2: { fontFamily: "Inter_600SemiBold", fontSize: 24, letterSpacing: -0.24, lineHeight: 31 },
  h3: { fontFamily: "Inter_600SemiBold", fontSize: 20, letterSpacing: -0.1, lineHeight: 28 },
  body: { fontFamily: "Inter_400Regular", fontSize: 16, lineHeight: 25 },
  bodySm: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 21 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 12, lineHeight: 14, letterSpacing: 0.6 },
  strong: { fontFamily: "Inter_700Bold", fontSize: 16, lineHeight: 24 },
};

export const spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  containerMax: 1200,
  gutter: 24,
};

export const formatAmount = (value) => `AED ${Number(value || 0).toFixed(2)}`;
