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

  const compact = width < 720;

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          {!state.integrationMode ? <SoftButton title="Back" variant="ghost" onPress={() => navigation.navigate("Summary")} /> : null}
          <Text style={styles.title}>CCAvenue Gateway</Text>
          <Text style={styles.sub}>🔒 Secured · Mock</Text>
          {state.integrationMode ? <Text style={styles.source}>Source: external merchant form request</Text> : null}

          <View style={styles.grid}>
            {methods.map((m) => (
              <View key={m.id} style={[styles.tileWrap, compact && styles.tileWrapCompact]}>
                <PaymentMethodTile item={m} selected={m.id === state.selectedMethod} onPress={() => setMethod(m.id)} />
              </View>
            ))}
          </View>

          {isCard ? (
            <Card>
              <FieldInput label="Card Number" keyboardType="number-pad" value={card.number} onChangeText={(v) => setCard((s) => ({ ...s, number: formatCard(v) }))} placeholder="1234 5678 9012 3456" />
              <View style={[styles.inline, compact && styles.inlineCompact]}>
                <View style={styles.half}><FieldInput label="Expiry" value={card.expiry} onChangeText={(v) => setCard((s) => ({ ...s, expiry: formatExpiry(v) }))} placeholder="MM/YY" /></View>
                <View style={styles.half}><FieldInput label="CVV" secureTextEntry value={card.cvv} onChangeText={(cvv) => setCard((s) => ({ ...s, cvv: cvv.replace(/\D/g, "").slice(0, 4) }))} placeholder="100" /></View>
              </View>
              <FieldInput label="Name on Card" value={card.holder} onChangeText={(holder) => setCard((s) => ({ ...s, holder }))} />
              <SoftButton title="Use Test Card" onPress={() => setCard({ number: "5123 4500 0000 0008", expiry: "01/39", cvv: "100", holder: "Test User" })} />
              {!!error ? <Text style={styles.error}>{error}</Text> : null}
            </Card>
          ) : (
            <Card variant="soft">
              <Text style={styles.wallet}>Wallet Checkout</Text>
              <Text style={styles.walletSub}>Tap Pay to simulate wallet authorization.</Text>
            </Card>
          )}

          <Card variant="soft">
            <LineItem label="Customer" value={state.input.name || "-"} />
            <LineItem label="Form ID" value={state.input.id || "-"} />
            <LineItem label="Service" value={formatAmount(charges.service)} />
            <LineItem label="Shipment" value={formatAmount(charges.shipment)} />
            <LineItem label="VAT 5%" value={formatAmount(charges.vat)} />
            <LineItem label="Total" value={formatAmount(charges.total)} strong />
          </Card>

          <Card style={styles.mock}>
            <View style={styles.mockTitleRow}>
              <Text style={styles.mockTitle}>🛠 Mock Controls</Text>
              <Text style={styles.dev}>DEV ONLY</Text>
            </View>
            <View style={[styles.inline, compact && styles.inlineCompact]}>
              <View style={styles.half}><SoftButton title="✓ Approve" variant="soft" onPress={() => go("approved")} /></View>
              <View style={styles.half}><SoftButton title="✗ Decline" variant="danger" onPress={() => go("declined")} /></View>
            </View>
            <View style={[styles.inline, compact && styles.inlineCompact]}>
              <View style={styles.half}><SoftButton title="⏱ Timeout" variant="soft" onPress={() => go("timeout")} /></View>
              <View style={styles.half}><SoftButton title="✕ Cancel" variant="ghost" onPress={() => go("cancelled")} /></View>
            </View>
          </Card>

          <GradientButton title={`Pay AED ${charges.total.toFixed(2)}`} onPress={pay} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, width: "100%", maxWidth: 980, alignSelf: "center" },
  title: { ...typography.h2, color: colors.onSurface },
  sub: { ...typography.body, color: colors.onSurfaceVariant },
  source: { ...typography.label, color: colors.onSurfaceVariant },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  tileWrap: { width: "50%", padding: 6 },
  tileWrapCompact: { width: "100%" },
  inline: { flexDirection: "row", marginHorizontal: -6 },
  inlineCompact: { flexDirection: "column", gap: 10, marginHorizontal: 0 },
  half: { flex: 1, paddingHorizontal: 6 },
  wallet: { ...typography.h3, color: colors.onSurface },
  walletSub: { ...typography.body, color: colors.onSurfaceVariant, marginTop: 6 },
  mock: { borderWidth: 1, borderStyle: "dashed", borderColor: colors.outline },
  mockTitleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  mockTitle: { ...typography.strong, color: colors.onSurface },
  dev: { ...typography.label, color: colors.warning },
  error: { ...typography.label, color: colors.error, marginTop: 8 },
});
