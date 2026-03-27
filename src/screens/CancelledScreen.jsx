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

export default function CancelledScreen({ navigation }) {
  const { state, setIntegrationMode } = usePayment();
  useEffect(() => { if (!state.gatewayResponse) navigation.replace("Summary"); }, [navigation, state.gatewayResponse]);
  if (!state.gatewayResponse) return null;
  const r = state.gatewayResponse;
  const total = computeCharges(state.input.amount, state.input.shipment).total;
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={["#d97706", "#b45309"]} style={styles.hero}>
          <Text style={styles.badge}>✕</Text>
          <Text style={styles.title}>Payment Cancelled</Text>
          <Text style={styles.sub}>No charge was made</Text>
        </LinearGradient>
        <Card>
          <LineItem label="Acq Code" value={r.vpc_AcqResponseCode} />
          <LineItem label="Transaction Ref" value={r.vpc_MerchTxnRef} />
          <LineItem label="Customer" value={state.input.name || "-"} />
          <LineItem label="Amount" value={formatAmount(total)} />
          <LineItem label="Status" value={r.vpc_Message} />
        </Card>
        <Card variant="soft">
          <Text style={styles.info}>No charge was made to the selected payment instrument. You can safely retry payment.</Text>
          {r.custom1 ? <Text style={styles.custom}>custom1: {r.custom1}</Text> : null}
          {r.custom2 ? <Text style={styles.custom}>custom2: {r.custom2}</Text> : null}
        </Card>
        <GradientButton
          title={state.integrationMode && state.input.returnUrl ? "Return to Merchant" : "Try Again"}
          onPress={() => {
            if (state.integrationMode && state.input.returnUrl) {
              postBackResponse(state.input.returnUrl, r);
              return;
            }
            navigation.navigate("Gateway");
          }}
        />
        <SoftButton
          title="Return to Summary"
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
  sub: { ...typography.body, color: "#fff" },
  info: { ...typography.body, color: colors.onSurfaceVariant },
  custom: { ...typography.label, color: colors.onSurface, marginTop: 6 },
});
