import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radii, shadows } from "../theme";

export default function Card({ children, variant = "default", style }) {
  const map = {
    default: colors.surface,
    soft: colors.surfaceContainerLow,
    accent: "#e8eeff",
    danger: "#fff1f1",
  };
  return <View style={[styles.card, { backgroundColor: map[variant] || map.default }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: 16,
    ...shadows.card,
  },
});
