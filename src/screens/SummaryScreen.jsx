import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePayment } from "../context/PaymentContext";
import Card from "../components/Card";
import GradientButton from "../components/GradientButton";
import LineItem from "../components/LineItem";
import Kicker from "../components/Kicker";
import { colors, formatAmount, typography } from "../theme";

export default function SummaryScreen({ navigation }) {
  const { state, charges } = usePayment();
  const { width } = useWindowDimensions();
  const isTest = state.env === "test";
  const compact = width < 760;

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topbar}>
          <Text style={styles.brand}>SecurePay</Text>
          <Text style={styles.cancel}>Cancel</Text>
        </View>

        <View style={styles.steps}>
          <View style={styles.stepRow}>
            <View style={styles.stepDotActive} />
            <Text style={styles.stepLabelActive}>Summary</Text>
          </View>
          <View style={styles.stepDivider} />
          <View style={styles.stepRow}>
            <View style={styles.stepDot} />
            <Text style={styles.stepLabel}>Payment</Text>
          </View>
        </View>

        <View style={[styles.body, compact && styles.bodyCompact]}>
          <View style={styles.mainCol}>
            <Card>
              <Kicker text="Order Summary" />
              <Text style={styles.product}>{state.productName}</Text>
              <Text style={styles.sub}>{state.productSubtitle}</Text>
              <LineItem label="Transaction ID" value={`#SP-${state.input.id || "882910"}`} />
              <LineItem label="Customer" value={state.input.name || "-"} />
              <LineItem label="Email" value={state.input.email || "-"} />
            </Card>

            <Card variant="soft">
              <Kicker text="Amount Breakdown" />
              <LineItem label="Premium Subscription" value={formatAmount(charges.service)} />
              <LineItem label="Platform Fee" value={formatAmount(charges.vat)} />
              <LineItem label="Total Amount" value={formatAmount(charges.total)} strong />
            </Card>

            {isTest ? (
              <Card variant="accent">
                <Text style={styles.noticeTitle}>Test Mode Notice</Text>
                <Text style={styles.noticeLine}>Card: 5123 4500 0000 0008</Text>
                <Text style={styles.noticeLine}>Expiry: 01/39 · CVV: 100</Text>
                <Pressable style={styles.envPill} onPress={() => navigation.navigate("Gateway")}>
                  <Text style={styles.envText}>{state.env.toUpperCase()}</Text>
                </Pressable>
              </Card>
            ) : null}
          </View>

          <View style={styles.sideCol}>
            <Card style={styles.sideCard}>
              <Text style={styles.sideTitle}>Checkout</Text>
              <Text style={styles.sideSubtitle}>Proceed to secure payment method selection.</Text>
              <GradientButton title={`Pay AED ${charges.total.toFixed(2)}`} onPress={() => navigation.navigate("Gateway")} />
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 56, gap: 16, width: "100%", maxWidth: 1200, alignSelf: "center", flexGrow: 1 },
  topbar: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  brand: { ...typography.h3, color: colors.primary },
  cancel: { ...typography.bodySm, color: colors.onSurfaceVariant, fontFamily: "Inter_600SemiBold" },
  steps: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepDotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.outlineVariant },
  stepDivider: { width: 42, height: 1, backgroundColor: colors.outlineVariant },
  stepLabelActive: { ...typography.bodySm, color: colors.onSurface, fontFamily: "Inter_600SemiBold" },
  stepLabel: { ...typography.bodySm, color: colors.onSurfaceVariant },
  body: { flexDirection: "row", gap: 24, alignItems: "flex-start" },
  bodyCompact: { flexDirection: "column" },
  mainCol: { flex: 1, gap: 16 },
  sideCol: { width: 320, maxWidth: "100%" },
  sideCard: { gap: 12 },
  sideTitle: { ...typography.h2, color: colors.onSurface },
  sideSubtitle: { ...typography.bodySm, color: colors.onSurfaceVariant },
  product: { ...typography.h2, color: colors.onSurface, marginTop: 8 },
  sub: { ...typography.bodySm, color: colors.onSurfaceVariant, marginBottom: 10 },
  noticeTitle: { ...typography.strong, color: colors.onSurface },
  noticeLine: { ...typography.bodySm, color: colors.onSurfaceVariant, marginTop: 4 },
  envPill: { alignSelf: "flex-start", marginTop: 10, borderRadius: 999, backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4 },
  envText: { ...typography.label, color: colors.onPrimary },
});
