import React, { createContext, useContext, useMemo, useReducer } from "react";
import { buildVpcResponse, computeCharges } from "../utils/gateway";

const PaymentContext = createContext(null);

const initialState = {
  productName: "EMREE Certification",
  productSubtitle: "Emergency Medicine Registry Examination",
  currency: "AED",
  env: "test",
  urls: {
    prod: "https://pay.uaeu.ac.ae/api/Transaction/Input",
    test: "https://pay.webtest.uaeu.ac.ae/api/Transaction/Input",
  },
  input: {
    id: "1",
    name: "Shamma Alameri",
    amount: "100",
    shipment: "0",
    email: "shammaalameri@uaeu.ac.ae",
    returnUrl: "",
    custom1: "DocRequest",
    custom2: "",
    custom3: "",
    custom4: "",
    custom5: "",
    custom6: "",
    custom7: "",
    custom8: "",
    custom9: "",
    custom10: "",
  },
  selectedMethod: "credit",
  gatewayResponse: null,
  integrationMode: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setInput":
      return { ...state, input: { ...state.input, ...action.payload } };
    case "setEnv":
      return { ...state, env: action.payload };
    case "setMethod":
      return { ...state, selectedMethod: action.payload };
    case "setResponse":
      return { ...state, gatewayResponse: action.payload };
    case "resetResponse":
      return { ...state, gatewayResponse: null };
    case "setIntegrationMode":
      return { ...state, integrationMode: !!action.payload };
    default:
      return state;
  }
};

export function PaymentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      state,
      charges: computeCharges(state.input.amount, state.input.shipment),
      setInput: (payload) => dispatch({ type: "setInput", payload }),
      setEnv: (payload) => dispatch({ type: "setEnv", payload }),
      setMethod: (payload) => dispatch({ type: "setMethod", payload }),
      setResponse: (payload) => dispatch({ type: "setResponse", payload }),
      resetResponse: () => dispatch({ type: "resetResponse" }),
      setIntegrationMode: (payload) => dispatch({ type: "setIntegrationMode", payload }),
      processOutcome: (scenario, method = state.selectedMethod) => {
        const response = buildVpcResponse(scenario, method, state.input);
        dispatch({ type: "setResponse", payload: response });
        return response;
      },
    }),
    [state]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within PaymentProvider");
  return ctx;
};
