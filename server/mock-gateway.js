const http = require("http");
const { URL } = require("url");
const querystring = require("querystring");

const PORT = Number(process.env.PORT || process.env.MOCK_GATEWAY_PORT || 8787);
const HOST = process.env.MOCK_GATEWAY_HOST || "0.0.0.0";
const WEB_GATEWAY_URL = process.env.MOCK_WEB_GATEWAY_URL || "https://nihspaymentgateway.expo.app";

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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function validate(payload) {
  const errors = [];
  if (!payload.id || Number(payload.id) <= 0) errors.push("id must be a positive number");
  if (!payload.name || !String(payload.name).trim()) errors.push("name is required");
  if (!payload.amount || Number(payload.amount) <= 0) errors.push("amount must be positive");
  return errors;
}

function buildPayload(input) {
  const payload = {};
  for (const key of allowedKeys) {
    if (input[key] !== undefined && input[key] !== null && input[key] !== "") {
      payload[key] = String(input[key]);
    }
  }
  if (!payload.returnUrl && input.referrer) {
    payload.returnUrl = String(input.referrer);
  }
  return payload;
}

function parseMultipartFormData(body, contentType) {
  const out = {};
  if (!contentType.includes("multipart/form-data")) return out;
  const fieldRegex = /name="([^"]+)"(?:\r\n|[^\r\n]*\r\n)+\r\n([\s\S]*?)\r\n(?=--)/g;
  let match = fieldRegex.exec(body);
  while (match) {
    const name = match[1];
    const value = match[2];
    if (name) out[name] = value;
    match = fieldRegex.exec(body);
  }
  return out;
}

function redirectToGateway(res, payload) {
  const url = new URL(WEB_GATEWAY_URL);
  url.pathname = "/";
  Object.entries(payload).forEach(([k, v]) => url.searchParams.set(k, v));
  res.statusCode = 303;
  res.setHeader("Location", url.toString());
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

function json(res, code, data) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/health") {
      return json(res, 200, { ok: true, service: "mock-gateway" });
    }
    if (url.pathname !== "/api/Transaction/Input") {
      return json(res, 404, { error: "Not found" });
    }

    if (req.method === "GET") {
      const payload = buildPayload(Object.fromEntries(url.searchParams.entries()));
      const errors = validate(payload);
      if (errors.length) return json(res, 400, { ok: false, errors });
      return redirectToGateway(res, payload);
    }

    if (req.method === "POST") {
      const contentType = req.headers["content-type"] || "";
      const body = await readBody(req);
      const parsed = (() => {
        if (contentType.includes("application/x-www-form-urlencoded")) {
          return querystring.parse(body);
        }
        if (contentType.includes("multipart/form-data")) {
          return parseMultipartFormData(body, contentType);
        }
        try {
          return JSON.parse(body || "{}");
        } catch (_e) {
          return {};
        }
      })();
      const payload = buildPayload(parsed);
      const errors = validate(payload);
      if (errors.length) return json(res, 400, { ok: false, errors });
      return redirectToGateway(res, payload);
    }

    return json(res, 405, { ok: false, error: "Method not allowed" });
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message || "Internal error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Mock gateway endpoint listening at http://localhost:${PORT}/api/Transaction/Input`);
  console.log(`Redirect target: ${WEB_GATEWAY_URL}`);
});
