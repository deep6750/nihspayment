import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useFonts as useInter, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts as useManrope, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaymentProvider } from "./src/context/PaymentContext";
import EntryScreen from "./src/screens/EntryScreen";
import SummaryScreen from "./src/screens/SummaryScreen";
import GatewayScreen from "./src/screens/GatewayScreen";
import ProcessingScreen from "./src/screens/ProcessingScreen";
import SuccessScreen from "./src/screens/SuccessScreen";
import FailedScreen from "./src/screens/FailedScreen";
import CancelledScreen from "./src/screens/CancelledScreen";
import ResultScreen from "./src/screens/ResultScreen";

const Stack = createStackNavigator();

export default function App() {
  const [interLoaded] = useInter({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [manropeLoaded] = useManrope({ Manrope_800ExtraBold });
  if (!interLoaded || !manropeLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaymentProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator initialRouteName="Entry" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="Summary" component={SummaryScreen} />
            <Stack.Screen name="Gateway" component={GatewayScreen} />
            <Stack.Screen name="Processing" component={ProcessingScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Failed" component={FailedScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Cancelled" component={CancelledScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaymentProvider>
    </GestureHandlerRootView>
  );
}
