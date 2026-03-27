import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePayment } from "../context/PaymentContext";
import { parseIncomingInput } from "../utils/integration";
import { colors, typography } from "../theme";

export default function EntryScreen({ navigation }) {
  const { setInput, resetResponse, setIntegrationMode } = usePayment();

  useEffect(() => {
    const { hasIncoming, payload } = parseIncomingInput();
    if (hasIncoming && payload) {
      setInput(payload);
      setIntegrationMode(true);
      resetResponse();
      navigation.replace("Gateway");
      return;
    }
    setIntegrationMode(false);
    navigation.replace("Summary");
  }, [navigation, resetResponse, setInput, setIntegrationMode]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.text}>Preparing secure gateway...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  text: { ...typography.body, color: colors.onSurfaceVariant },
});
