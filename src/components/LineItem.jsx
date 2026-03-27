import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

export default function LineItem({ label, value, strong }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.value, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { ...typography.body, color: colors.onSurfaceVariant },
  value: { ...typography.body, color: colors.onSurface },
  strong: { ...typography.strong, color: colors.onSurface },
});
