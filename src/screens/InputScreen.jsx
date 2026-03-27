import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import FieldInput from "../components/FieldInput";
import GradientButton from "../components/GradientButton";
import SoftButton from "../components/SoftButton";
import LineItem from "../components/LineItem";
import { usePayment } from "../context/PaymentContext";
import { computeCharges } from "../utils/gateway";
import { colors, formatAmount, typography } from "../theme";

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

export default function InputScreen({ navigation }) {
  const { state, setInput, setEnv, resetResponse } = usePayment();
  const [errors, setErrors] = useState({});
  const [showCustom, setShowCustom] = useState(false);
  const preview = useMemo(() => computeCharges(state.input.amount, state.input.shipment), [state.input.amount, state.input.shipment]);

  const validate = () => {
    const e = {};
    if (!state.input.id || Number(state.input.id) <= 0) e.id = "Form ID must be a positive number";
    if (!state.input.name?.trim()) e.name = "Name is required";
    if (!state.input.amount || Number(state.input.amount) <= 0) e.amount = "Amount must be positive";
    if (state.input.email && !isEmail(state.input.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <SoftButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Card variant="soft">
          <View style={styles.row}>
            <Text style={styles.label}>Environment</Text>
            <Switch value={state.env === "prod"} onValueChange={(v) => setEnv(v ? "prod" : "test")} />
          </View>
          <Text style={styles.url}>{state.urls[state.env]}</Text>
        </Card>

        <Card>
          <Text style={styles.heading}>Required Fields</Text>
          <FieldInput label="Form ID" keyboardType="number-pad" value={state.input.id} onChangeText={(id) => setInput({ id })} error={errors.id} />
          <FieldInput label="Amount" keyboardType="decimal-pad" value={state.input.amount} onChangeText={(amount) => setInput({ amount })} error={errors.amount} />
          <FieldInput label="Customer Name" value={state.input.name} onChangeText={(name) => setInput({ name })} error={errors.name} maxLength={150} />
        </Card>

        <Card>
          <Text style={styles.heading}>Optional Fields</Text>
          <FieldInput label="Email" value={state.input.email} onChangeText={(email) => setInput({ email })} error={errors.email} keyboardType="email-address" maxLength={70} />
          <FieldInput label="Shipment Amount" keyboardType="decimal-pad" value={state.input.shipment} onChangeText={(shipment) => setInput({ shipment })} />
          <FieldInput label="Return URL" value={state.input.returnUrl} onChangeText={(returnUrl) => setInput({ returnUrl })} hint="Will be echoed back as referrer." />
          <Pressable onPress={() => setShowCustom((s) => !s)}><Text style={styles.toggle}>Custom Fields {showCustom ? "▲" : "▼"}</Text></Pressable>
          {showCustom &&
            Array.from({ length: 10 }).map((_, i) => {
              const key = `custom${i + 1}`;
              const maxLength = i < 5 ? 250 : 500;
              return <FieldInput key={key} label={key} value={state.input[key]} onChangeText={(v) => setInput({ [key]: v })} maxLength={maxLength} />;
            })}
        </Card>

        <Card variant="soft">
          <Text style={styles.heading}>Live Amount Preview</Text>
          <LineItem label="Service" value={formatAmount(preview.service)} />
          <LineItem label="Shipment" value={formatAmount(preview.shipment)} />
          <LineItem label="VAT 5%" value={formatAmount(preview.vat)} />
          <LineItem label="Bank Charges" value={formatAmount(preview.bank)} />
          <LineItem label="Total" value={formatAmount(preview.total)} strong />
        </Card>

        <GradientButton
          title="Continue to Payment"
          onPress={() => {
            if (!validate()) return;
            resetResponse();
            navigation.navigate("Gateway");
          }}
        />
        <SoftButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { ...typography.strong, color: colors.onSurface },
  url: { ...typography.body, color: colors.onSurfaceVariant, marginTop: 6 },
  heading: { ...typography.h3, color: colors.onSurface, marginBottom: 8 },
  toggle: { ...typography.label, color: colors.primary, marginTop: 4 },
});
