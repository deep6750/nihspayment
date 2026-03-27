import { Platform } from "react-native";

const allowedKeys = [
  "id",
  "name",
  "amount",
  "shipment",
  "email",
  "returnUrl",
  "custom1",
  "custom2",
  "custom3",
  "custom4",
  "custom5",
  "custom6",
  "custom7",
  "custom8",
  "custom9",
  "custom10",
];

export const parseIncomingInput = () => {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return { hasIncoming: false, payload: null };
  }
  const merged = new window.URLSearchParams();
  const sources = [window.location.search];
  const hash = window.location.hash || "";
  const hashQueryIndex = hash.indexOf("?");
  if (hashQueryIndex >= 0) {
    sources.push(hash.slice(hashQueryIndex));
  }
  sources.forEach((source) => {
    const params = new window.URLSearchParams(source);
    params.forEach((value, key) => merged.set(key, value));
  });
  const payload = {};
  for (const key of allowedKeys) {
    const value = merged.get(key);
    if (value !== null) payload[key] = value;
  }
  const hasIncoming = Boolean(payload.id && payload.name && payload.amount);
  return { hasIncoming, payload: hasIncoming ? payload : null };
};

export const postBackResponse = (returnUrl, response) => {
  if (!returnUrl || !response || Platform.OS !== "web" || typeof window === "undefined") return false;
  const doc = window.document;
  const form = doc.createElement("form");
  form.method = "post";
  form.action = returnUrl;
  Object.entries(response).forEach(([key, value]) => {
    const input = doc.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value ?? "");
    form.appendChild(input);
  });
  doc.body.appendChild(form);
  form.submit();
  return true;
};
