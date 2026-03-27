import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePayment } from "../context/PaymentContext";
import Card from "../components/Card";
import GradientButton from "../components/GradientButton";
import LineItem from "../components/LineItem";
import Kicker from "../components/Kicker";
import { colors, formatAmount, typography } from "../theme";

export default function SummaryScreen({ navigation }) {
  const { state, charges } = usePayment();
  const isTest = state.env === "test";
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={[colors.primary, colors.primaryContainer]} style={styles.hero}>
          <Text style={styles.lock}>🔒</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroTitle}>UAEU Payment Gateway</Text>
            <Pressable style={styles.badge} onPress={() => navigation.navigate("Gateway")}>
              <Text style={styles.badgeText}>{state.env.toUpperCase()}</Text>
            </Pressable>
          </View>
          <Text style={styles.heroSub}>Secured checkout mock for integration testing</Text>
        </LinearGradient>

        <Card>
          <Kicker text="Order Overview" />
          <Text style={styles.product}>{state.productName}</Text>
          <Text style={styles.sub}>{state.productSubtitle}</Text>
          <LineItem label="Customer" value={state.input.name || "-"} />
          <LineItem label="Email" value={state.input.email || "-"} />
          <LineItem label="Form ID" value={state.input.id || "-"} />
        </Card>

        <Card>
          <Kicker text="Amount Breakdown" />
          <LineItem label="Service" value={formatAmount(charges.service)} />
          <LineItem label="Shipment" value={formatAmount(charges.shipment)} />
          <LineItem label="VAT 5%" value={formatAmount(charges.vat)} />
          <LineItem label="Bank Charges" value={formatAmount(charges.bank)} />
          <LineItem label="Total" value={formatAmount(charges.total)} strong />
        </Card>

        {isTest ? (
          <Card variant="soft">
            <Text style={styles.noticeTitle}>Test Mode Notice</Text>
            <Text style={styles.noticeLine}>Card: 5123 4500 0000 0008</Text>
            <Text style={styles.noticeLine}>Expiry: 01/39 · CVV: 100</Text>
          </Card>
        ) : null}

        <GradientButton title={`Pay AED ${charges.total.toFixed(2)}`} onPress={() => navigation.navigate("Gateway")} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, width: "100%", maxWidth: 980, alignSelf: "center" },
  hero: { borderRadius: 16, padding: 16 },
  lock: { fontSize: 20, marginBottom: 8 },
  heroRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroTitle: { ...typography.h2, color: "#fff", flex: 1 },
  heroSub: { ...typography.body, color: "#dbe6ff", marginTop: 4 },
  badge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { ...typography.label, color: "#fff" },
  product: { ...typography.h3, color: colors.onSurface, marginTop: 8 },
  sub: { ...typography.body, color: colors.onSurfaceVariant, marginBottom: 10 },
  noticeTitle: { ...typography.strong, color: colors.onSurface },
  noticeLine: { ...typography.body, color: colors.onSurfaceVariant, marginTop: 4 },
});
