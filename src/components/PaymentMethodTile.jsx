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
      <View style={styles.row}>
        <View style={styles.iconWrap}><Text style={styles.icon}>{item.icon}</Text></View>
        <View style={styles.copy}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.sub}>{item.subtitle}</Text>
        </View>
      </View>
      {selected ? <View style={styles.check}><Text style={styles.checkText}>✓</Text></View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    minHeight: 92,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1 },
  selected: { borderColor: colors.primary, borderWidth: 2 },
  icon: { fontSize: 18 },
  title: { ...typography.bodySm, fontFamily: "Inter_700Bold", color: colors.onSurface },
  sub: { ...typography.bodySm, color: colors.onSurfaceVariant, fontSize: 12 },
  check: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { color: "#fff", fontSize: 12 },
});
