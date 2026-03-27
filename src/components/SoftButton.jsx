import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii, typography } from "../theme";

export default function SoftButton({ title, onPress, variant = "soft" }) {
  const variantStyle = {
    soft: { backgroundColor: colors.surfaceContainerHigh, text: colors.onSurface },
    ghost: { backgroundColor: "transparent", text: colors.primary },
    danger: { backgroundColor: "#ffe5e5", text: colors.error },
  }[variant];
  return (
    <Pressable style={[styles.btn, { backgroundColor: variantStyle.backgroundColor }]} onPress={onPress}>
      <Text style={[styles.text, { color: variantStyle.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 12, alignItems: "center", borderRadius: radii.button },
  text: { ...typography.label },
});
