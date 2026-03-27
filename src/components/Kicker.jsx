import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

export default function Kicker({ text }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  text: { ...typography.label, color: colors.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 },
});
