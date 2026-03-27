import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { colors, radii, typography } from "../theme";

export default function GradientButton({ title, onPress, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={async () => {
        if (Platform.OS !== "web") {
          try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (_e) {
            // Ignore haptics failures on unsupported devices.
          }
        }
        onPress?.();
      }}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <LinearGradient colors={[colors.primary, colors.primaryContainer]} start={{ x: 0.1, y: 0.9 }} end={{ x: 0.9, y: 0.1 }} style={styles.gradient}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { borderRadius: radii.button, overflow: "hidden" },
  gradient: { borderRadius: radii.button, paddingVertical: 14, alignItems: "center" },
  text: { ...typography.strong, color: "#fff" },
  pressed: { transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
});
