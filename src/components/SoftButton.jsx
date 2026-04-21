import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii, typography } from "../theme";

export default function SoftButton({ title, onPress, variant = "soft" }) {
  const variantStyle = {
    soft: { backgroundColor: colors.surfaceContainerLow, text: colors.onSurface, borderColor: colors.outlineVariant },
    ghost: { backgroundColor: "transparent", text: colors.primary, borderColor: colors.outlineVariant },
    danger: { backgroundColor: "#fff1f0", text: colors.error, borderColor: "#ffc9c4" },
  }[variant];
  return (
    <Pressable style={[styles.btn, { backgroundColor: variantStyle.backgroundColor, borderColor: variantStyle.borderColor }]} onPress={onPress}>
      <Text style={[styles.text, { color: variantStyle.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 12, alignItems: "center", borderRadius: radii.button, borderWidth: 1 },
  text: { ...typography.bodySm, fontFamily: "Inter_600SemiBold" },
});
