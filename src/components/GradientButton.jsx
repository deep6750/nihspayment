import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.gradient}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { borderRadius: radii.button, overflow: "hidden" },
  gradient: { borderRadius: radii.button, paddingVertical: 16, alignItems: "center", backgroundColor: colors.primary },
  text: { ...typography.strong, color: colors.onPrimary },
  pressed: { transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
});
