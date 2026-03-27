const stripSpaces = (v) => (v || "").replace(/\s+/g, "");

const toNumber = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const randomDigits = (len) => {
  let out = "";
  for (let i = 0; i < len; i += 1) out += Math.floor(Math.random() * 10).toString();
  return out;
};

const txnRef = () => {
  const d = new Date();
  const p = (n, w = 2) => `${n}`.padStart(w, "0");
  return `T${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}${randomDigits(6)}`;
};

export const computeCharges = (amount, shipment) => {
  const service = toNumber(amount);
  const ship = toNumber(shipment);
  const vat = service * 0.05;
  const bank = 0;
  const total = service + ship + vat + bank;
  return { service, shipment: ship, vat, bank, total };
};

export const resolveCardScenario = (cardNumber, expiry, cvv) => {
  const n = stripSpaces(cardNumber);
  if (n === "5123450000000008" && (expiry || "").trim() === "01/39" && (cvv || "").trim() === "100") {
    return "approved";
  }
  return "declined";
};

export const buildVpcResponse = (scenario, method, input) => {
  const charges = computeCharges(input.amount, input.shipment);
  const map = {
    approved: { txn: "0", acq: "00", msg: "Approved", auth: randomDigits(6) },
    declined: { txn: "1", acq: "05", msg: "Declined", auth: "" },
    timeout: { txn: "1", acq: "91", msg: "Transaction Declined by Issuer (Timeout)", auth: "" },
    cancelled: { txn: "1", acq: "17", msg: "Cancelled by user", auth: "" },
  };
  const cardMap = { credit: "VC", debit: "MC", applepay: "AP", samsungpay: "SP" };
  const m = map[scenario] || map.declined;
  return {
    vpc_MerchTxnRef: txnRef(),
    vpc_OrderInfo: (input.name || "").trim().replace(/\s+/g, "+"),
    vpc_Amount: String(Math.round(charges.total)),
    vpc_TxnResponseCode: m.txn,
    vpc_AcqResponseCode: m.acq,
    vpc_TransactionNo: randomDigits(12),
    vpc_ReceiptNo: randomDigits(12),
    vpc_AuthorizeId: m.auth,
    vpc_BatchNo: "null",
    vpc_Message: m.msg,
    vpc_Card: cardMap[method] || "VC",
    referrer: input.returnUrl || "",
    custom1: input.custom1 || "",
    custom2: input.custom2 || "",
    custom3: input.custom3 || "",
    custom4: input.custom4 || "",
    custom5: input.custom5 || "",
    custom6: input.custom6 || "",
    custom7: input.custom7 || "",
    custom8: input.custom8 || "",
    custom9: input.custom9 || "",
    custom10: input.custom10 || "",
  };
};
