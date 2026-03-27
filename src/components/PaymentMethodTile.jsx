import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radii, typography } from "../theme";

export default function PaymentMethodTile({ item, selected, onPress }) {
  return (
    <Pressable
      style={[styles.tile, selected && styles.selected]}
      onPress={async () => {
        if (Platform.OS !== "web") {
          try {
            await Haptics.selectionAsync();
          } catch (_e) {
            // Ignore haptics failures on unsupported devices.
          }
        }
        onPress?.();
      }}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sub}>{item.subtitle}</Text>
      {selected ? <View style={styles.check}><Text style={styles.checkText}>✓</Text></View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 120,
  },
  selected: { borderColor: colors.primary },
  icon: { fontSize: 24 },
  title: { ...typography.label, color: colors.onSurface, marginTop: 8 },
  sub: { ...typography.label, color: colors.onSurfaceVariant, fontSize: 12 },
  check: { position: "absolute", right: 8, top: 8, backgroundColor: colors.primary, borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  checkText: { color: "#fff", fontSize: 12 },
});
