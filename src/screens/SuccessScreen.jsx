import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import GradientButton from "../components/GradientButton";
import SoftButton from "../components/SoftButton";
import LineItem from "../components/LineItem";
import { usePayment } from "../context/PaymentContext";
import { colors, formatAmount, typography } from "../theme";
import { computeCharges } from "../utils/gateway";
import { postBackResponse } from "../utils/integration";

export default function SuccessScreen({ navigation }) {
  const { state, resetResponse, setIntegrationMode } = usePayment();
  useEffect(() => { if (!state.gatewayResponse) navigation.replace("Summary"); }, [navigation, state.gatewayResponse]);
  if (!state.gatewayResponse) return null;
  const r = state.gatewayResponse;
  const total = computeCharges(state.input.amount, state.input.shipment).total;
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={["#0a8f46", colors.secondary]} style={styles.hero}>
          <Text style={styles.badge}>✓</Text>
          <Text style={styles.title}>Payment Approved</Text>
          <Text style={styles.pill}>{r.vpc_Message}</Text>
        </LinearGradient>
        <Card>
          <LineItem label="MerchTxnRef" value={r.vpc_MerchTxnRef} />
          <LineItem label="TransactionNo" value={r.vpc_TransactionNo} />
          <LineItem label="ReceiptNo" value={r.vpc_ReceiptNo} />
          <LineItem label="AuthorizeId" value={r.vpc_AuthorizeId || "-"} />
          <LineItem label="Card" value={r.vpc_Card} />
          <LineItem label="Total" value={formatAmount(total)} strong />
        </Card>
        <Card variant="soft">
          <LineItem label="Customer" value={state.input.name || "-"} />
          <LineItem label="OrderInfo" value={r.vpc_OrderInfo} />
          <LineItem label="Email" value={state.input.email || "-"} />
          <LineItem label="Custom1" value={r.custom1 || "-"} />
          <LineItem label="Txn/Acq" value={`${r.vpc_TxnResponseCode}/${r.vpc_AcqResponseCode}`} />
        </Card>
        <GradientButton
          title={state.integrationMode && state.input.returnUrl ? "Return to Merchant" : "Done"}
          onPress={() => {
            if (state.integrationMode && state.input.returnUrl) {
              postBackResponse(state.input.returnUrl, r);
              return;
            }
            resetResponse();
            setIntegrationMode(false);
            navigation.navigate("Summary");
          }}
        />
        <SoftButton title="View Full Response" variant="ghost" onPress={() => navigation.navigate("Result")} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, width: "100%", maxWidth: 980, alignSelf: "center" },
  hero: { borderRadius: 16, padding: 18, alignItems: "center" },
  badge: { fontSize: 34, color: "#fff" },
  title: { ...typography.h2, color: "#fff", marginTop: 4 },
  pill: { ...typography.label, color: "#fff", marginTop: 8, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
