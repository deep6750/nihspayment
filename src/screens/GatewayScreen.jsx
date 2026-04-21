import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import FieldInput from "../components/FieldInput";
import GradientButton from "../components/GradientButton";
import LineItem from "../components/LineItem";
import PaymentMethodTile from "../components/PaymentMethodTile";
import SoftButton from "../components/SoftButton";
import { usePayment } from "../context/PaymentContext";
import { computeCharges, resolveCardScenario } from "../utils/gateway";
import { colors, formatAmount, typography } from "../theme";

const methods = [
  { id: "credit", icon: "💳", title: "Credit Card", subtitle: "Visa/Mastercard" },
  { id: "debit", icon: "🏧", title: "Debit Card", subtitle: "Bank Debit" },
  { id: "applepay", icon: "🍎", title: "Apple Pay", subtitle: "Secure wallet" },
  { id: "samsungpay", icon: "📱", title: "Samsung Pay", subtitle: "Secure wallet" },
];

const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

export default function GatewayScreen({ navigation }) {
  const { state, setMethod, processOutcome } = usePayment();
  const { width } = useWindowDimensions();
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", holder: "" });
  const [error, setError] = useState("");
  const charges = useMemo(() => computeCharges(state.input.amount, state.input.shipment), [state.input.amount, state.input.shipment]);
  const isCard = state.selectedMethod === "credit" || state.selectedMethod === "debit";

  const go = (scenario, method = state.selectedMethod) => {
    processOutcome(scenario, method);
    navigation.navigate("Processing");
  };

  const pay = () => {
    if (isCard) {
      if (!card.number || !card.expiry || !card.cvv || !card.holder.trim()) {
        setError("Fill all card fields.");
        return;
      }
      setError("");
      go(resolveCardScenario(card.number, card.expiry, card.cvv));
      return;
    }
    go("approved");
  };

  const compact = width < 860;

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topbar}>
            <Text style={styles.brand}>SecurePay</Text>
            {!state.integrationMode ? <SoftButton title="Cancel" variant="ghost" onPress={() => navigation.navigate("Summary")} /> : null}
          </View>
          <View style={styles.steps}>
            <View style={styles.stepRow}><View style={styles.stepDotActive} /><Text style={styles.stepTextActive}>Payment</Text></View>
            <View style={styles.stepDivider} />
            <View style={styles.stepRow}><View style={styles.stepDot} /><Text style={styles.stepText}>Review</Text></View>
            <View style={styles.stepDivider} />
            <View style={styles.stepRow}><View style={styles.stepDot} /><Text style={styles.stepText}>Confirm</Text></View>
          </View>

          <View style={[styles.layout, compact && styles.layoutCompact]}>
            <View style={[styles.formCol, compact && styles.formColCompact]}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.grid}>
                {methods.map((m) => (
                  <View key={m.id} style={[styles.tileWrap, compact && styles.tileWrapCompact]}>
                    <PaymentMethodTile item={m} selected={m.id === state.selectedMethod} onPress={() => setMethod(m.id)} />
                  </View>
                ))}
              </View>

              {isCard ? (
                <Card>
                  <Text style={styles.subHeading}>Card Details</Text>
                  <FieldInput label="Cardholder Name" value={card.holder} onChangeText={(holder) => setCard((s) => ({ ...s, holder }))} placeholder="John Doe" />
                  <FieldInput label="Card Number" keyboardType="number-pad" value={card.number} onChangeText={(v) => setCard((s) => ({ ...s, number: formatCard(v) }))} placeholder="0000 0000 0000 0000" />
                  <View style={[styles.inline, compact && styles.inlineCompact]}>
                    <View style={styles.half}><FieldInput label="Expiry Date" value={card.expiry} onChangeText={(v) => setCard((s) => ({ ...s, expiry: formatExpiry(v) }))} placeholder="MM/YY" /></View>
                    <View style={styles.half}><FieldInput label="CVV" secureTextEntry value={card.cvv} onChangeText={(cvv) => setCard((s) => ({ ...s, cvv: cvv.replace(/\D/g, "").slice(0, 4) }))} placeholder="***" /></View>
                  </View>
                  <SoftButton title="Use Test Card" onPress={() => setCard({ number: "5123 4500 0000 0008", expiry: "01/39", cvv: "100", holder: "Test User" })} />
                  {!!error ? <Text style={styles.error}>{error}</Text> : null}
                </Card>
              ) : (
                <Card variant="soft">
                  <Text style={styles.wallet}>Digital Wallet</Text>
                  <Text style={styles.walletSub}>Apple Pay and Samsung Pay are simulated in this mock.</Text>
                </Card>
              )}

              <Card style={styles.mock}>
                <View style={styles.mockTitleRow}>
                  <Text style={styles.mockTitle}>Payment Session Controls</Text>
                </View>
                <View style={[styles.inline, compact && styles.inlineCompact]}>
                  <View style={styles.half}><SoftButton title="Simulate Failure" variant="danger" onPress={() => go("declined")} /></View>
                  <View style={styles.half}><SoftButton title="Simulate Timeout" variant="soft" onPress={() => go("timeout")} /></View>
                  <View style={styles.half}><SoftButton title="Simulate Success" variant="soft" onPress={() => go("approved")} /></View>
                </View>
              </Card>
            </View>

            <View style={[styles.summaryCol, compact && styles.summaryColCompact]}>
              <Card variant="soft" style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.productPill}>
                  <View>
                    <Text style={styles.productName}>Premium Subscription</Text>
                    <Text style={styles.productPlan}>Annual Plan</Text>
                  </View>
                  <Text style={styles.productPrice}>{formatAmount(charges.service)}</Text>
                </View>
                <LineItem label="Subtotal" value={formatAmount(charges.service)} />
                <LineItem label="VAT (5%)" value={formatAmount(charges.vat)} />
                <LineItem label="Total" value={formatAmount(charges.total)} strong />
                <GradientButton title={`Pay ${formatAmount(charges.total).replace("AED ", "AED ")}`} onPress={pay} />
                <Text style={styles.compliance}>PCI-DSS LEVEL 1 COMPLIANT</Text>
              </Card>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 56, gap: 16, width: "100%", maxWidth: 1200, alignSelf: "center", flexGrow: 1 },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { ...typography.h3, color: colors.primary },
  steps: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepDotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.outlineVariant },
  stepTextActive: { ...typography.bodySm, color: colors.onSurface, fontFamily: "Inter_600SemiBold" },
  stepText: { ...typography.bodySm, color: colors.onSurfaceVariant },
  stepDivider: { width: 40, height: 1, backgroundColor: colors.outlineVariant },
  layout: { flexDirection: "row", gap: 24, alignItems: "flex-start" },
  layoutCompact: { flexDirection: "column", alignItems: "stretch" },
  formCol: { flex: 1, gap: 16 },
  formColCompact: { flexGrow: 0, flexShrink: 0, flexBasis: "auto", width: "100%" },
  summaryCol: { width: 380, maxWidth: "100%" },
  summaryColCompact: { width: "100%" },
  sectionTitle: { ...typography.h2, color: colors.onSurface },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  tileWrap: { width: "33.3333%", padding: 6 },
  tileWrapCompact: { width: "100%" },
  subHeading: { ...typography.h3, color: colors.onSurface, marginBottom: 8 },
  inline: { flexDirection: "row", marginHorizontal: -6 },
  inlineCompact: { flexDirection: "column", gap: 10, marginHorizontal: 0 },
  half: { flex: 1, paddingHorizontal: 6 },
  wallet: { ...typography.h3, color: colors.onSurface },
  walletSub: { ...typography.bodySm, color: colors.onSurfaceVariant, marginTop: 6 },
  summaryCard: { gap: 12 },
  summaryTitle: { ...typography.h2, color: colors.onSurface },
  productPill: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: { ...typography.bodySm, fontFamily: "Inter_700Bold", color: colors.onSurface },
  productPlan: { ...typography.bodySm, color: colors.onSurfaceVariant, fontSize: 12 },
  productPrice: { ...typography.strong, color: colors.primary },
  compliance: { ...typography.label, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 4 },
  mock: { borderWidth: 1, borderStyle: "solid", borderColor: colors.outlineVariant },
  mockTitleRow: { marginBottom: 8 },
  mockTitle: { ...typography.label, color: colors.onSurfaceVariant, textTransform: "uppercase" },
  error: { ...typography.bodySm, color: colors.error, marginTop: 8 },
});
