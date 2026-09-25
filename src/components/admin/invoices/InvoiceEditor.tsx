"use client";

import { useState } from "react";
import {
  CURRENCIES,
  PAYMENT_TERMS_OPTIONS,
  ITEM_PRESETS,
  calculateInvoiceTotals,
  formatCurrency,
  type Invoice,
  type InvoiceItem,
  type Customer,
  type InvoiceSettings,
} from "@/lib/invoice";

interface InvoiceEditorProps {
  initialInvoice?: Invoice | null;
  settings: InvoiceSettings;
  customers: Customer[];
  nextInvoiceNumber: string;
  onSave: (invoice: Partial<Invoice>, saveCustomerProfile?: boolean) => Promise<boolean>;
  onCancel: () => void;
  onView?: (invoice: Invoice) => void;
}

export default function InvoiceEditor({
  initialInvoice,
  settings,
  customers,
  nextInvoiceNumber,
  onSave,
  onCancel,
  onView,
}: InvoiceEditorProps) {
  const isEditing = Boolean(initialInvoice?.id);

  const [saving, setSaving] = useState(false);
  const [saveCustomerProfile, setSaveCustomerProfile] = useState(true);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoice_number || nextInvoiceNumber || "RS-INV-2026-001"
  );
  const [invoiceDate, setInvoiceDate] = useState(
    initialInvoice?.invoice_date || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(initialInvoice?.due_date || "");
  const [currency, setCurrency] = useState(
    initialInvoice?.currency || settings.defaultCurrency || "SAR"
  );
  const [paymentStatus, setPaymentStatus] = useState<Invoice["payment_status"]>(
    initialInvoice?.payment_status || "pending"
  );
  const [paymentTerms, setPaymentTerms] = useState(
    initialInvoice?.payment_terms || settings.defaultPaymentTerms || PAYMENT_TERMS_OPTIONS[0]
  );

  // Customer State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "new">("new");
  const [customerName, setCustomerName] = useState(initialInvoice?.customer_name || "");
  const [customerCompany, setCustomerCompany] = useState(initialInvoice?.customer_company || "");
  const [customerEmail, setCustomerEmail] = useState(initialInvoice?.customer_email || "");
  const [customerPhone, setCustomerPhone] = useState(initialInvoice?.customer_phone || "");
  const [customerAddress, setCustomerAddress] = useState(initialInvoice?.customer_address || "");
  const [customerCity, setCustomerCity] = useState(initialInvoice?.customer_city || "");
  const [customerCountry, setCustomerCountry] = useState(
    initialInvoice?.customer_country || "Saudi Arabia"
  );
  const [customerTaxId, setCustomerTaxId] = useState(initialInvoice?.customer_tax_id || "");

  // Delivery State
  const [deliveryCarrier, setDeliveryCarrier] = useState(
    initialInvoice?.delivery_carrier || "DHL Express Worldwide"
  );
  const [trackingNumber, setTrackingNumber] = useState(initialInvoice?.tracking_number || "");
  const [deliveryStatus, setDeliveryStatus] = useState(
    initialInvoice?.delivery_status || "In Production"
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    initialInvoice?.estimated_delivery || ""
  );

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items && initialInvoice.items.length > 0
      ? initialInvoice.items
      : [
          {
            id: "item-1",
            description: "Custom Woven Damask Labels (High-Density 50D, Ultrasonic Cut)",
            specifications: "50mm x 25mm, End Fold, Pantone 19-4052 TCX, 5000 pcs",
            quantity: 5000,
            unit: "pcs",
            unit_price: 0.15,
            total: 750,
          },
        ]
  );

  // Financials State
  const [discountAmount, setDiscountAmount] = useState<number>(
    initialInvoice?.discount_amount || 0
  );
  const [taxRate, setTaxRate] = useState<number>(initialInvoice?.tax_rate || 0);
  const [shippingAmount, setShippingAmount] = useState<number>(
    initialInvoice?.shipping_amount || 0
  );
  const [advancePaid, setAdvancePaid] = useState<number>(
    initialInvoice?.advance_paid || 0
  );
  const [notes, setNotes] = useState(
    initialInvoice?.notes || "Production timeline: 7-10 working days after digital approval. Courier transit 3-4 days via DHL Express."
  );

  // Quick select customer
  const handleSelectCustomer = (idStr: string) => {
    if (idStr === "new") {
      setSelectedCustomerId("new");
      return;
    }
    const id = Number(idStr);
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name || "");
      setCustomerCompany(found.company || "");
      setCustomerEmail(found.email || "");
      setCustomerPhone(found.phone || "");
      setCustomerAddress(found.address || "");
      setCustomerCity(found.city || "");
      setCustomerCountry(found.country || "Saudi Arabia");
      setCustomerTaxId(found.tax_id || "");
    }
  };

  // Calculations
  const calculated = calculateInvoiceTotals({
    items,
    discount_amount: Number(discountAmount) || 0,
    tax_rate: Number(taxRate) || 0,
    shipping_amount: Number(shippingAmount) || 0,
    advance_paid: Number(advancePaid) || 0,
  });

  // Automatically update status based on advance payment if desired
  const setQuickAdvance = (percentage: number) => {
    const calcAdvance = Math.round((calculated.grandTotal * percentage) / 100 * 100) / 100;
    setAdvancePaid(calcAdvance);
    if (percentage === 100) {
      setPaymentStatus("paid");
    } else if (percentage > 0) {
      setPaymentStatus("partial");
    }
  };

  // Line Items Handlers
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unit_price") {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unit_price) || 0;
      item.total = Math.round(q * p * 100) / 100;
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = (presetIndex?: number) => {
    const preset = presetIndex !== undefined ? ITEM_PRESETS[presetIndex] : null;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: preset?.description || "",
      specifications: preset?.specifications || "",
      quantity: preset?.quantity || 1000,
      unit: preset?.unit || "pcs",
      unit_price: preset?.unit_price || 0,
      total: (preset?.quantity || 1000) * (preset?.unit_price || 0),
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Please enter the customer / client name.");
      return;
    }

    setSaving(true);
    const payload: Partial<Invoice> = {
      ...(initialInvoice?.id ? { id: initialInvoice.id } : {}),
      invoice_number: invoiceNumber.trim(),
      invoice_date: invoiceDate,
      due_date: dueDate || null,
      currency,
      payment_status: paymentStatus,
      payment_terms: paymentTerms,
      customer_id: selectedCustomerId === "new" ? undefined : selectedCustomerId,
      customer_name: customerName.trim(),
      customer_company: customerCompany.trim() || null,
      customer_email: customerEmail.trim() || null,
      customer_phone: customerPhone.trim() || null,
      customer_address: customerAddress.trim() || null,
      customer_city: customerCity.trim() || null,
      customer_country: customerCountry.trim() || null,
      customer_tax_id: customerTaxId.trim() || null,
      items,
      subtotal: calculated.subtotal,
      discount_amount: Number(discountAmount) || 0,
      tax_rate: Number(taxRate) || 0,
      tax_amount: calculated.taxAmount,
      shipping_amount: Number(shippingAmount) || 0,
      total_amount: calculated.grandTotal,
      advance_paid: Number(advancePaid) || 0,
      balance_due: calculated.balanceDue,
      delivery_carrier: deliveryCarrier || null,
      tracking_number: trackingNumber || null,
      delivery_status: deliveryStatus || null,
      estimated_delivery: estimatedDelivery || null,
      notes: notes || null,
      bank_details: settings.bankDetails || {},
      terms_conditions: settings.termsAndConditions || [],
    };

    const ok = await onSave(payload, saveCustomerProfile);
    setSaving(false);
    if (ok && onView && payload.invoice_number) {
      onView(payload as Invoice);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Bar with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
          >
            ← Cancel
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEditing ? `Edit Invoice: ${invoiceNumber}` : "Create New Commercial Invoice"}
            </h2>
            <p className="text-xs text-gray-500">
              Fill in client details, items, pricing, advance terms and generate instant PDF/Print.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
          >
            {saving ? "💾 Saving Invoice..." : isEditing ? "💾 Update & Save Invoice" : "✨ Create & Save Invoice"}
          </button>
        </div>
      </div>

      {/* Grid: Invoice Meta & Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Invoice Number *
          </label>
          <input
            type="text"
            required
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            placeholder="e.g. RS-INV-2026-001"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Invoice Date *
          </label>
          <input
            type="date"
            required
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Due / Completion Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-medium text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Currency (GCC & Global) *
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50/50 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} - {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client / Consignee Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <h3 className="text-sm font-bold text-gray-900">Client / Consignee Information</h3>
          </div>

          {customers.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 font-medium">Quick load from client directory:</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="rounded-xl border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 focus:border-amber-600 focus:outline-none"
              >
                <option value="new">+ New Client Profile</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ""} - {c.country}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Client / Contact Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="e.g. Sheikh Faisal Al-Otaibi / Hamza Ali"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Company / Brand Name
            </label>
            <input
              type="text"
              value={customerCompany}
              onChange={(e) => setCustomerCompany(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="e.g. Al-Noor Couture / Luxe Atelier"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              WhatsApp / Mobile Number
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="+966 50 123 4567 / +92 320 2025795"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="client@brand.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="Riyadh / Dubai / Doha / Karachi"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={customerCountry}
              onChange={(e) => setCustomerCountry(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="Saudi Arabia / UAE / Qatar / UK"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Delivery / Consignee Address
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="Building #, Street, District, Zip / Postal Code"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Client TRN / VAT / Tax ID (Optional)
            </label>
            <input
              type="text"
              value={customerTaxId}
              onChange={(e) => setCustomerTaxId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="e.g. 300123456700003"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="saveCustomer"
            checked={saveCustomerProfile}
            onChange={(e) => setSaveCustomerProfile(e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="saveCustomer" className="text-xs text-gray-600 cursor-pointer">
            Save or update this client profile in Client Directory for 1-click re-invoicing
          </label>
        </div>
      </div>

      {/* Dynamic Line Items Table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏷️</span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Custom Products & Services Line Items</h3>
              <p className="text-xs text-gray-500">Specify exact dimensions, weave density, paper gsm, quantity, and unit price.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Add Presets */}
            <span className="text-xs text-gray-400 font-medium">Quick Preset:</span>
            <button
              type="button"
              onClick={() => handleAddItem(0)}
              className="rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
            >
              + Woven Damask
            </button>
            <button
              type="button"
              onClick={() => handleAddItem(1)}
              className="rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
            >
              + Foil Hangtags
            </button>
            <button
              type="button"
              onClick={() => handleAddItem(2)}
              className="rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
            >
              + Leather Patches
            </button>
            <button
              type="button"
              onClick={() => handleAddItem()}
              className="rounded-lg bg-gray-900 px-3 py-1 text-xs font-bold text-white hover:bg-black"
            >
              + Add Custom Row
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 space-y-3 transition hover:border-amber-300"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold text-xs">
                  {index + 1}
                </span>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Product Description (e.g. Custom Woven Damask Labels 50D)"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Specs & Dimensions (e.g. 50mm x 25mm, Loop Fold, Pantone Black)"
                    value={item.specifications || ""}
                    onChange={(e) => handleItemChange(index, "specifications", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length <= 1}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Unit</label>
                  <select
                    value={item.unit || "pcs"}
                    onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-amber-600 focus:outline-none capitalize"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="meters">Meters</option>
                    <option value="rolls">Rolls</option>
                    <option value="sets">Sets</option>
                    <option value="boxes">Boxes</option>
                    <option value="gross">Gross (144 pcs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                    Unit Price ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                    Row Total ({currency})
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-mono font-black text-gray-900">
                    {(item.quantity * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleAddItem()}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-xs font-bold text-gray-600 hover:border-amber-500 hover:text-amber-700 transition flex items-center justify-center gap-2"
        >
          <span>➕</span> Add Another Product / Service Line
        </button>
      </div>

      {/* Financials & Calculation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Terms & Delivery Information */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-lg">💳</span>
              <h3 className="text-sm font-bold text-gray-900">Payment Terms & Status</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Payment Terms Clause *
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-amber-600 focus:outline-none"
              >
                {PAYMENT_TERMS_OPTIONS.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Payment Status *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["pending", "partial", "paid", "sent", "draft", "void"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPaymentStatus(st)}
                    className={`rounded-xl py-2 text-xs font-bold capitalize transition border ${
                      paymentStatus === st
                        ? st === "paid"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : st === "partial"
                          ? "bg-amber-600 text-white border-amber-600"
                          : st === "pending"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {st === "partial" ? "50% Partial" : st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Production & Order Notes (Shown on Invoice)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="Special instructions, Pantone approval terms, packing instructions..."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="text-lg">✈️</span>
              <h3 className="text-sm font-bold text-gray-900">Delivery & Freight Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Courier / Carrier Method
                </label>
                <input
                  type="text"
                  value={deliveryCarrier}
                  onChange={(e) => setDeliveryCarrier(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                  placeholder="DHL Express / FedEx Priority / Air Cargo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  AWB / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono text-gray-900 focus:border-amber-600 focus:outline-none"
                  placeholder="e.g. DHL-9812739120"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shipping Status
                </label>
                <input
                  type="text"
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                  placeholder="In Production / Dispatched / Delivered"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Est. Delivery / Dispatch
                </label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                  placeholder="e.g. 5-7 Business Days"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary & Auto Calculations */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="text-lg">🧮</span>
            <h3 className="text-sm font-bold text-gray-900">Financial Breakdown & Adjustments</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Subtotal */}
            <div className="flex justify-between items-center py-1">
              <span className="font-semibold text-gray-600">Subtotal:</span>
              <span className="font-mono font-bold text-sm text-gray-900">
                {formatCurrency(calculated.subtotal, currency)}
              </span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center gap-3">
              <label className="font-semibold text-gray-600 shrink-0">Discount Amount ({currency}):</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-36 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono font-bold text-gray-900 text-right focus:border-amber-600 focus:outline-none"
              />
            </div>

            {/* Shipping */}
            <div className="flex justify-between items-center gap-3">
              <label className="font-semibold text-gray-600 shrink-0">Shipping / Freight ({currency}):</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingAmount}
                onChange={(e) => setShippingAmount(Number(e.target.value))}
                className="w-36 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono font-bold text-gray-900 text-right focus:border-amber-600 focus:outline-none"
              />
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center gap-3">
              <label className="font-semibold text-gray-600 shrink-0">Tax / VAT Rate (%):</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-36 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono font-bold text-gray-900 text-right focus:border-amber-600 focus:outline-none"
              />
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center py-3 border-t-2 border-gray-900">
              <span className="text-sm font-black text-gray-900">Grand Total:</span>
              <span className="font-mono text-lg font-black text-gray-900">
                {formatCurrency(calculated.grandTotal, currency)}
              </span>
            </div>

            {/* Quick 50% / 100% Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 pb-1 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500">Quick Advance Shortcuts:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickAdvance(0)}
                  className="rounded px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  0%
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAdvance(50)}
                  className="rounded px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-900 hover:bg-amber-200"
                >
                  50% Advance
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAdvance(100)}
                  className="rounded px-2 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                >
                  100% Full Paid
                </button>
              </div>
            </div>

            {/* Advance Paid */}
            <div className="flex justify-between items-center gap-3 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
              <label className="font-bold text-emerald-900 shrink-0">Advance Received ({currency}):</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className="w-36 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-emerald-900 text-right focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Balance Due */}
            <div className="flex justify-between items-center bg-gray-900 text-amber-400 p-3.5 rounded-xl shadow-md">
              <span className="text-sm font-black tracking-wide">REMAINING BALANCE DUE:</span>
              <span className="font-mono text-xl font-black">
                {formatCurrency(calculated.balanceDue, currency)}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 py-3 text-sm font-bold text-white shadow-lg transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
            >
              {saving ? "💾 Saving Invoice..." : isEditing ? "💾 Save Changes & Update Invoice" : "✨ Create Commercial Invoice & Open Preview"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
