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
  wrap: { gap: 4 },
  label: { ...typography.label, color: colors.onSurfaceVariant },
  input: {
    ...typography.body,
    backgroundColor: colors.surfaceContainerHigh,
    borderTopLeftRadius: radii.inputTop,
    borderTopRightRadius: radii.inputTop,
    borderBottomWidth: 2,
    borderBottomColor: colors.outline,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.onSurface,
  },
  focused: { borderBottomColor: colors.primary },
  error: { borderBottomColor: colors.error },
  errorText: { ...typography.label, color: colors.error },
  hint: { ...typography.label, color: colors.onSurfaceVariant, fontSize: 12 },
});
