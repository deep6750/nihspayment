import React, { useEffect, useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import Card from "../components/Card";
import SoftButton from "../components/SoftButton";
import { usePayment } from "../context/PaymentContext";
import { colors } from "../theme";
import { postBackResponse } from "../utils/integration";

export default function ResultScreen({ navigation }) {
  const { state } = usePayment();
  useEffect(() => { if (!state.gatewayResponse) navigation.replace("Summary"); }, [navigation, state.gatewayResponse]);
  const rows = useMemo(() => {
    if (!state.gatewayResponse) return [];
    const base = [
      "vpc_MerchTxnRef", "vpc_OrderInfo", "vpc_Amount", "vpc_TxnResponseCode", "vpc_AcqResponseCode", "vpc_TransactionNo",
      "vpc_ReceiptNo", "vpc_AuthorizeId", "vpc_BatchNo", "vpc_Message", "vpc_Card", "referrer",
      "custom1", "custom2", "custom3", "custom4", "custom5", "custom6", "custom7", "custom8", "custom9", "custom10",
    ];
    return base.map((k) => [k, state.gatewayResponse[k] ?? ""]);
  }, [state.gatewayResponse]);

  if (!state.gatewayResponse) return null;
  const approved = state.gatewayResponse.vpc_TxnResponseCode === "0";
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <SoftButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={[styles.badge, { backgroundColor: approved ? "#e2f6ea" : "#fff1e7", color: approved ? colors.secondary : colors.warning }]}>
          {approved ? "APPROVED" : state.gatewayResponse.vpc_Message === "Cancelled by user" ? "CANCELLED" : "FAILED"}
        </Text>
        <Card>
          {rows.map(([k, v]) => (
            <View key={k} style={[styles.row, k === "vpc_TxnResponseCode" && (approved ? styles.ok : styles.bad)]}>
              <Text style={styles.key}>{k}</Text>
              <Text style={styles.val}>{String(v)}</Text>
            </View>
          ))}
        </Card>
        <SoftButton title="Copy as JSON" onPress={() => Clipboard.setStringAsync(JSON.stringify(state.gatewayResponse, null, 2))} />
        {state.integrationMode && state.input.returnUrl ? (
          <SoftButton title="Post Response to Merchant" onPress={() => postBackResponse(state.input.returnUrl, state.gatewayResponse)} />
        ) : null}
        <SoftButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, width: "100%", maxWidth: 980, alignSelf: "center" },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontFamily: "Inter_700Bold" },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainerLow },
  key: { color: colors.onSurfaceVariant, fontFamily: Platform?.OS === "ios" ? "Courier" : "monospace", fontSize: 12 },
  val: { color: colors.onSurface, fontFamily: Platform?.OS === "ios" ? "Courier" : "monospace", marginTop: 3 },
  ok: { backgroundColor: "#f0fff5" },
  bad: { backgroundColor: "#fff3f3" },
});
