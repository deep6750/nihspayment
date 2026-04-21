import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radii, typography } from "../theme";

export default function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
        style={[styles.input, focused && styles.focused, error && styles.error]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!!hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { ...typography.label, color: colors.onSurfaceVariant, textTransform: "uppercase" },
  input: {
    ...typography.bodySm,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.base,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 13,
    color: colors.onSurface,
  },
  focused: { borderColor: colors.primary },
  error: { borderColor: colors.error },
  errorText: { ...typography.bodySm, color: colors.error, fontSize: 12 },
  hint: { ...typography.bodySm, color: colors.onSurfaceVariant, fontSize: 12 },
});
