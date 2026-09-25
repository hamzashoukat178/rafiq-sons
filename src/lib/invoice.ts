export type InvoiceCurrency = "SAR" | "AED" | "KWD" | "QAR" | "USD" | "PKR";

export type InvoiceItem = {
  id?: string;
  name?: string;
  description: string;
  specifications?: string;
  size?: string;
  shape?: string;
  color?: string;
  quantity: number;
  unit?: string;
  unit_price: number;
  discount?: number;
  total: number;
};

export type Customer = {
  id?: number;
  name: string;
  company?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  tax_id?: string | null;
  customer_ref?: string | null;
  notes?: string | null;
  total_invoices?: number;
  total_spent?: number;
  created_at?: string;
  updated_at?: string;
};

export type Invoice = {
  id?: number;
  invoice_number: string;
  invoice_date: string;
  due_date?: string | null;
  currency: InvoiceCurrency | string;
  payment_status: "pending" | "partial" | "paid" | "sent" | "draft" | "void" | "unpaid" | "refunded" | "cancelled";
  payment_terms?: string;
  payment_terms_type?: "100_advance" | "50_50" | "custom";
  payment_terms_text?: string | null;
  
  // Customer details
  customer_id?: number | null;
  customer_name: string;
  customer_company?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_whatsapp?: string | null;
  customer_address?: string | null;
  customer_city?: string | null;
  customer_country?: string | null;
  customer_tax_id?: string | null;
  customer_ref?: string | null;

  // Items
  items: InvoiceItem[];

  // Financial totals
  subtotal: number;
  discount_amount?: number;
  tax_rate?: number;
  tax_amount?: number;
  shipping_amount?: number;
  shipping_charge?: number;
  total_amount: number;
  grand_total?: number;
  advance_paid?: number;
  amount_paid?: number;
  balance_due: number;

  // Delivery & Tracking
  delivery_carrier?: string | null;
  courier?: string | null;
  tracking_number?: string | null;
  delivery_status?: string | null;
  estimated_delivery?: string | null;
  estimated_delivery_date?: string | null;

  // Notes & terms
  notes?: string | null;
  terms?: string | null;
  terms_conditions?: string[];
  bank_details?: Record<string, string>;
  audit_log?: { date: string; action: string; note?: string }[] | Record<string, unknown>[];

  is_void?: boolean;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type BankDetails = {
  bankName?: string;
  accountTitle?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  branch?: string;
  instructions?: string;
};

export type InvoiceSettings = {
  companyName?: string;
  companyTagline?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  taxNumber?: string;
  defaultCurrency?: InvoiceCurrency | string;
  invoicePrefix?: string;
  prefix?: string;
  nextNumber?: number;
  defaultPaymentTerms?: string;
  defaultNotes?: string;
  bankDetails?: BankDetails;
  termsAndConditions?: string[];
};

export const CURRENCIES = [
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", flag: "🇸🇦", decimals: 2 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", decimals: 2 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼", decimals: 3 },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦", decimals: 2 },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", decimals: 2 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰", decimals: 0 },
] as const;

export const PAYMENT_TERMS_OPTIONS = [
  "50% Advance with Order Confirmation + 50% Before Dispatch",
  "100% Advance Payment with Order Placement",
  "30% Advance + 70% Upon Dispatch Inspection",
  "Net 15 Days Commercial Term",
  "Net 30 Days Commercial Term",
  "Custom Payment Terms Agreed via Contract",
];

export const ITEM_PRESETS = [
  {
    description: "Custom Woven Damask Labels (High-Density 50D, Ultrasonic Edge Cut)",
    specifications: "50mm x 25mm, Loop/End Fold, Pantone Matched Weaving, Soft Non-Scratch Edge",
    quantity: 5000,
    unit: "pcs",
    unit_price: 0.15,
  },
  {
    description: "Luxury Matte Gold Hot-Foil Hangtags (600 GSM Cotton Card)",
    specifications: "85mm x 45mm, Precision Die-Cut, Gold Gilded Beveled Edges, Metal Eyelet & Wax Cord",
    quantity: 3000,
    unit: "pcs",
    unit_price: 0.35,
  },
  {
    description: "Custom Debossed Genuine Leather Patches (Heavyweight Stitch Channel)",
    specifications: "70mm x 40mm, Cognac Saddle Tan, High-Relief Heat Embossing, Pre-Punched Stitch Holes",
    quantity: 2000,
    unit: "pcs",
    unit_price: 0.65,
  },
  {
    description: "Satin Silk Wash Care & Composition Instruction Labels",
    specifications: "70mm x 30mm, Double-Sided High-Definition Thermal Print, Multi-Language Care Icons",
    quantity: 5000,
    unit: "pcs",
    unit_price: 0.08,
  },
  {
    description: "High-Density TPU & Silicone 3D Heat Transfer Badges",
    specifications: "60mm x 60mm, Multi-Color Layered 3D Relief, Industrial Polyurethane Heat-Seal Backing",
    quantity: 2500,
    unit: "pcs",
    unit_price: 0.45,
  },
  {
    description: "Custom Branded Luxury Rigid Apparel Gift & Magnetic Presentation Box",
    specifications: "350mm x 250mm x 60mm, 1200 GSM Greyboard, Soft Touch Matte Lamination, Hot Stamped Crest",
    quantity: 500,
    unit: "boxes",
    unit_price: 3.50,
  },
];

export const DEFAULT_TERMS_AND_CONDITIONS = [
  "Production commences upon receipt and verification of the initial agreed advance remittance.",
  "For 50/50 payment terms, the final 50% balance must be settled prior to courier dispatch and release of air waybill tracking.",
  "Digital artwork proofs and dimensional specifications signed off by the client are legally binding standards for mass production.",
  "Custom manufactured trims and bespoke packaging goods cannot be cancelled or returned once loom setup or dye batches are initiated.",
  "A standard industry tolerance of ±3% on production quantity and ±1mm on cut dimensions is standard and acceptable.",
  "Pantone color standards (TCX/TPG/PMS) will be matched as closely as possible within the natural physics of textile yarn and paper substrates.",
  "Air courier dispatch (DHL Express / FedEx / Air Freight) transit is estimated at 3 to 5 business days worldwide.",
  "Any destination country import VAT, custom duties, or local clearing fees are the responsibility of the consignee unless specified DDP.",
  "Claims regarding discrepancy or defects must be reported in writing with photo evidence within 7 days of shipment receipt.",
  "All commercial operations are governed by international apparel trade conventions and Rafiq Sons official terms.",
];

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  companyName: "RAFIQ SONS LABELS",
  companyTagline: "Haute Couture Trim & Packaging Atelier",
  address: "Main Boulevard, Industrial Area, Faisalabad, Punjab, Pakistan",
  city: "Faisalabad",
  country: "Pakistan",
  phone: "+92 320 2025795",
  whatsapp: "+92 320 2025795",
  email: "hamzashoukat178@gmail.com",
  website: "www.rafiqsonslabels.com",
  taxNumber: "PK-NTN-4892019-2",
  defaultCurrency: "SAR",
  invoicePrefix: "RS-INV-2026-",
  defaultPaymentTerms: PAYMENT_TERMS_OPTIONS[0],
  defaultNotes: "Production timeline: 7-10 working days after digital approval. Courier transit 3-4 days via DHL Express Worldwide.",
  bankDetails: {
    bankName: "Meezan Bank Limited / Standard Chartered Bank",
    accountTitle: "RAFIQ SONS LABELS",
    accountNumber: "02010108920192",
    iban: "PK36MEZN0002010108920192",
    swiftCode: "MEZNPKKA",
    branch: "Main Islamic Banking Branch, Faisalabad, Pakistan",
    instructions: "Please send the bank remittance slip or SWIFT reference to hamzashoukat178@gmail.com or WhatsApp +92 320 2025795 for instant production priority.",
  },
  termsAndConditions: DEFAULT_TERMS_AND_CONDITIONS,
};

export function formatCurrency(amount?: number | null, currencyCode: string = "SAR"): string {
  const curr = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const num = Number(amount || 0);
  const formattedNumber = num.toLocaleString("en-US", {
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals,
  });
  return `${curr.code} ${formattedNumber}`;
}

export function generateInvoiceNumber(prefix = "RS-INV-2026-", num = 1): string {
  const padded = String(num).padStart(4, "0");
  return `${prefix}${padded}`;
}

export function calculateInvoiceTotals(params: {
  items: InvoiceItem[];
  discount_amount?: number;
  discountAmount?: number;
  shipping_amount?: number;
  shippingCharge?: number;
  tax_rate?: number;
  taxRate?: number;
  advance_paid?: number;
  amountPaid?: number;
}) {
  const subtotal = (params.items || []).reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;
    const disc = Number(item.discount) || 0;
    const lineTotal = item.total !== undefined ? item.total : Math.max(0, qty * price - disc);
    return sum + lineTotal;
  }, 0);

  const discountAmount = Math.max(0, Number(params.discount_amount ?? params.discountAmount) || 0);
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const shippingCharge = Math.max(0, Number(params.shipping_amount ?? params.shippingCharge) || 0);
  const taxRate = Math.max(0, Number(params.tax_rate ?? params.taxRate) || 0);
  const taxAmount = (taxableBase * taxRate) / 100;
  const grandTotal = taxableBase + shippingCharge + taxAmount;
  const advancePaid = Math.max(0, Number(params.advance_paid ?? params.amountPaid) || 0);
  const balanceDue = Math.max(0, grandTotal - advancePaid);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingAmount: Number(shippingCharge.toFixed(2)),
    taxRate: Number(taxRate.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    advancePaid: Number(advancePaid.toFixed(2)),
    balanceDue: Number(balanceDue.toFixed(2)),
  };
}
