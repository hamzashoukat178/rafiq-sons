"use client";

import { useState } from "react";
import {
  CURRENCIES,
  PAYMENT_TERMS_OPTIONS,
  DEFAULT_TERMS_AND_CONDITIONS,
  type InvoiceSettings,
} from "@/lib/invoice";

interface InvoiceSettingsViewProps {
  settings: InvoiceSettings;
  onSave: (settings: InvoiceSettings) => Promise<boolean>;
}

export default function InvoiceSettingsView({
  settings: initialSettings,
  onSave,
}: InvoiceSettingsViewProps) {
  const [form, setForm] = useState<InvoiceSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTermChange = (index: number, val: string) => {
    const terms = [...(form.termsAndConditions || [])];
    terms[index] = val;
    setForm({ ...form, termsAndConditions: terms });
  };

  const handleAddTerm = () => {
    setForm({
      ...form,
      termsAndConditions: [...(form.termsAndConditions || []), "New commercial term clause."],
    });
  };

  const handleRemoveTerm = (index: number) => {
    setForm({
      ...form,
      termsAndConditions: (form.termsAndConditions || []).filter((_, i) => i !== index),
    });
  };

  const handleResetTerms = () => {
    if (confirm("Reset terms & conditions to Rafiq Sons standard luxury export clauses?")) {
      setForm({ ...form, termsAndConditions: DEFAULT_TERMS_AND_CONDITIONS });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const ok = await onSave(form);
    setSaving(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>⚙️ Commercial Invoice & Banking Configuration</span>
          </h2>
          <p className="text-xs text-gray-500">
            Configure your official company profile, bank remittance accounts, default currency, and 10 export terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {success && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              ✓ Settings Saved Successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
          >
            {saving ? "💾 Saving Settings..." : "💾 Save All Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Profile Details */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="text-lg">🏛️</span>
            <h3 className="text-sm font-bold text-gray-900">Company & Brand Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Trade Name</label>
              <input
                type="text"
                value={form.companyName || ""}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Tagline / Subtitle</label>
              <input
                type="text"
                value={form.companyTagline || ""}
                onChange={(e) => setForm({ ...form, companyTagline: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Atelier & Works Address</label>
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Direct Phone / WhatsApp</label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry / Billing Email</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Website</label>
              <input
                type="text"
                value={form.website || ""}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">NTN / Tax Registration Number</label>
              <input
                type="text"
                value={form.taxNumber || ""}
                onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Invoicing Defaults & Sequence */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="text-lg">🧾</span>
            <h3 className="text-sm font-bold text-gray-900">Invoicing Defaults & Sequence</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Default Invoicing Currency</label>
              <select
                value={form.defaultCurrency || "SAR"}
                onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50/50 focus:border-amber-600 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Invoice Number Prefix</label>
              <input
                type="text"
                value={form.invoicePrefix || "RS-INV-2026-"}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Default Payment Terms Clause</label>
              <select
                value={form.defaultPaymentTerms || PAYMENT_TERMS_OPTIONS[0]}
                onChange={(e) => setForm({ ...form, defaultPaymentTerms: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-amber-600 focus:outline-none"
              >
                {PAYMENT_TERMS_OPTIONS.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Default Client Note</label>
              <textarea
                rows={2}
                value={form.defaultNotes || ""}
                onChange={(e) => setForm({ ...form, defaultNotes: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Official Bank Account & Remittance Details */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-lg">🏦</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Official Bank Account & Remittance Information</h3>
            <p className="text-xs text-gray-500">Printed on every commercial invoice for international wire transfers & local remittance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name *</label>
            <input
              type="text"
              required
              value={form.bankDetails?.bankName || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  bankDetails: { ...(form.bankDetails || {}), bankName: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="e.g. Meezan Bank Limited / Standard Chartered"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Account Title (Beneficiary Name) *</label>
            <input
              type="text"
              required
              value={form.bankDetails?.accountTitle || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  bankDetails: { ...(form.bankDetails || {}), accountTitle: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="RAFIQ SONS LABELS"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Account Number *</label>
            <input
              type="text"
              required
              value={form.bankDetails?.accountNumber || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  bankDetails: { ...(form.bankDetails || {}), accountNumber: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="02010108920192"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">IBAN Number (International Wire) *</label>
            <input
              type="text"
              required
              value={form.bankDetails?.iban || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  bankDetails: { ...(form.bankDetails || {}), iban: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono font-black text-amber-900 focus:border-amber-600 focus:outline-none"
              placeholder="PK00MEZN0002010108920192"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Swift / BIC Code</label>
            <input
              type="text"
              value={form.bankDetails?.swiftCode || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  bankDetails: { ...(form.bankDetails || {}), swiftCode: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="MEZNPKKA"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Branch Name & City</label>
            <input
              type="text"
              value={form.bankDetails?.branch || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  bankDetails: { ...(form.bankDetails || {}), branch: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
              placeholder="Main Branch, Faisalabad, Pakistan"
            />
          </div>
        </div>
      </div>

      {/* Terms & Conditions (10 Clauses) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📜</span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Standard Commercial Terms & Conditions (10 Clauses)</h3>
              <p className="text-xs text-gray-500">Every point below appears verbatim on all issued export commercial invoices.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTerms}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 underline"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleAddTerm}
              className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black"
            >
              + Add Clause
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {(form.termsAndConditions || []).map((term, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-mono font-bold text-gray-600 mt-0.5">
                {index + 1}
              </span>
              <textarea
                rows={2}
                value={term}
                onChange={(e) => handleTermChange(index, e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-amber-600 focus:outline-none leading-relaxed"
              />
              <button
                type="button"
                onClick={() => handleRemoveTerm(index)}
                className="shrink-0 p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                title="Remove clause"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
        >
          {saving ? "💾 Saving All Changes..." : "💾 Save All Settings"}
        </button>
      </div>
    </form>
  );
}
