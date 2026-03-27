import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePayment } from "../context/PaymentContext";
import { colors, typography } from "../theme";

export default function ProcessingScreen({ navigation }) {
  const { state } = usePayment();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!state.gatewayResponse) {
      navigation.replace("Summary");
      return;
    }
    Animated.timing(progress, { toValue: 1, duration: 2200, useNativeDriver: false }).start();
    const t = globalThis.setTimeout(() => {
      if (state.gatewayResponse.vpc_TxnResponseCode === "0") navigation.replace("Success");
      else if (state.gatewayResponse.vpc_Message === "Cancelled by user") navigation.replace("Cancelled");
      else navigation.replace("Failed");
    }, 2200);
    return () => globalThis.clearTimeout(t);
  }, [navigation, progress, state.gatewayResponse]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.wrap}>
        <LinearGradient colors={[colors.primary, colors.primaryContainer]} style={styles.iconWrap}><Text style={styles.icon}>🔒</Text></LinearGradient>
        <Text style={styles.h1}>Processing Payment</Text>
        <View style={styles.bar}><Animated.View style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} /></View>
        <Text style={styles.steps}>Validating · Authorizing · Confirming</Text>
        <Text style={styles.warn}>Do not close or navigate away</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  iconWrap: { width: 74, height: 74, borderRadius: 37, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  icon: { fontSize: 28, color: "#fff" },
  h1: { ...typography.h2, color: colors.onSurface },
  bar: { width: "100%", height: 12, backgroundColor: colors.surfaceContainerHigh, borderRadius: 999, marginTop: 20, overflow: "hidden" },
  fill: { height: 12, backgroundColor: colors.primary },
  steps: { ...typography.body, color: colors.onSurfaceVariant, marginTop: 12 },
  warn: { ...typography.label, color: colors.warning, marginTop: 16 },
});
