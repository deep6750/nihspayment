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

const reasonMap = {
  "05": "Do Not Honour — Card refused by bank.",
  "91": "Issuer or Switch Inoperative (Timeout).",
};

export default function FailedScreen({ navigation }) {
  const { state, resetResponse, setIntegrationMode } = usePayment();
  useEffect(() => { if (!state.gatewayResponse) navigation.replace("Summary"); }, [navigation, state.gatewayResponse]);
  if (!state.gatewayResponse) return null;
  const r = state.gatewayResponse;
  const timedOut = r.vpc_AcqResponseCode === "91";
  const total = computeCharges(state.input.amount, state.input.shipment).total;
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={timedOut ? ["#d97706", "#b45309"] : ["#d94848", "#ba1a1a"]} style={styles.hero}>
          <Text style={styles.badge}>{timedOut ? "⏱" : "✕"}</Text>
          <Text style={styles.title}>{timedOut ? "Payment Timeout" : "Payment Declined"}</Text>
        </LinearGradient>
        <Card variant="danger">
          <Text style={styles.reason}>{reasonMap[r.vpc_AcqResponseCode] || "Transaction declined by issuer."}</Text>
          <LineItem label="Acq Code" value={r.vpc_AcqResponseCode} />
          <LineItem label="Txn Code" value={r.vpc_TxnResponseCode} />
          <LineItem label="Message" value={r.vpc_Message} />
        </Card>
        <Card variant="soft">
          <LineItem label="Transaction Ref" value={r.vpc_MerchTxnRef} />
          <LineItem label="Customer" value={state.input.name || "-"} />
          <LineItem label="Amount" value={formatAmount(total)} />
          <LineItem label="Card Type" value={r.vpc_Card || "-"} />
        </Card>
        <Card variant="soft">
          <Text style={styles.tip}>• Check card details and expiry date.</Text>
          <Text style={styles.tip}>• Verify available funds/limits.</Text>
          <Text style={styles.tip}>• Contact issuing bank if needed.</Text>
          <Text style={styles.tip}>• Try another payment method.</Text>
        </Card>
        <GradientButton
          title={state.integrationMode && state.input.returnUrl ? "Return to Merchant" : "Try Again"}
          onPress={() => {
            if (state.integrationMode && state.input.returnUrl) {
              postBackResponse(state.input.returnUrl, r);
              return;
            }
            resetResponse();
            navigation.navigate("Gateway");
          }}
        />
        <SoftButton
          title="Cancel Payment"
          variant="ghost"
          onPress={() => {
            setIntegrationMode(false);
            navigation.navigate("Summary");
          }}
        />
        <SoftButton title="View Response Details" variant="ghost" onPress={() => navigation.navigate("Result")} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, width: "100%", maxWidth: 980, alignSelf: "center" },
  hero: { borderRadius: 16, padding: 18, alignItems: "center" },
  badge: { fontSize: 34, color: "#fff" },
  title: { ...typography.h2, color: "#fff" },
  reason: { ...typography.strong, color: colors.error, marginBottom: 8 },
  tip: { ...typography.body, color: colors.onSurfaceVariant, marginBottom: 6 },
});
