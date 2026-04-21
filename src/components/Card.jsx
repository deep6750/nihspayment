import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radii, shadows } from "../theme";

export default function Card({ children, variant = "default", style }) {
  const map = {
    default: colors.surface,
    soft: colors.surfaceContainerLow,
    accent: "#d5e3fc",
    danger: "#ffdad6",
  };
  return <View style={[styles.card, { backgroundColor: map[variant] || map.default }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.card,
  },
});
