"use client";

import { useState } from "react";
import { formatCurrency, type Invoice, type InvoiceSettings } from "@/lib/invoice";
import { generateInvoicePDF } from "./InvoicePDF";

interface InvoicePreviewProps {
  invoice: Invoice;
  settings: InvoiceSettings;
  onEdit?: (invoice: Invoice) => void;
  onClose?: () => void;
}

export default function InvoicePreview({
  invoice,
  settings,
  onEdit,
  onClose,
}: InvoicePreviewProps) {
  const [downloading, setDownloading] = useState(false);

  const currency = invoice.currency || settings.defaultCurrency || "SAR";

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const filename = `RafiqSons-Invoice-${invoice.invoice_number || "RS-INV"}.pdf`;
    await generateInvoicePDF("invoice-printable-doc", filename);
    setDownloading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*COMMERCIAL INVOICE - RAFIQ SONS LABELS*\n\n` +
      `*Invoice #:* ${invoice.invoice_number}\n` +
      `*Client:* ${invoice.customer_name} ${invoice.customer_company ? `(${invoice.customer_company})` : ""}\n` +
      `*Date:* ${invoice.invoice_date}\n` +
      `*Total Amount:* ${formatCurrency(invoice.total_amount, currency)}\n` +
      `*Advance Paid:* ${formatCurrency(invoice.advance_paid || 0, currency)}\n` +
      `*Balance Due:* ${formatCurrency(invoice.balance_due, currency)}\n` +
      `*Payment Terms:* ${invoice.payment_terms}\n` +
      `*Status:* ${invoice.payment_status.toUpperCase()}\n\n` +
      `For queries or bank transfer confirmation, please reply to this message. Thank you for choosing Rafiq Sons!`;

    const phone = invoice.customer_phone?.replace(/[^0-9]/g, "") || "";
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">● Paid In Full</span>;
      case "partial":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">● 50% Advance Received</span>;
      case "sent":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-100 text-blue-800 border border-blue-300">● Invoice Issued</span>;
      case "draft":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gray-100 text-gray-700 border border-gray-300">● Draft</span>;
      case "void":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-red-100 text-red-800 border border-red-300">● Void / Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-300">● Payment Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
          >
            ← Back to Invoices
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>{invoice.invoice_number}</span>
              {getStatusBadge(invoice.payment_status)}
            </h2>
            <p className="text-xs text-gray-500">
              Customer: <span className="font-semibold text-gray-700">{invoice.customer_name}</span> ({invoice.customer_country || "International"})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(invoice)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              ✏️ Edit Invoice
            </button>
          )}

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            💬 WhatsApp Bill
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-black"
          >
            🖨️ Direct Print (A4)
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-amber-700 hover:to-amber-800 disabled:opacity-50"
          >
            {downloading ? "⏳ Rendering PDF..." : "📥 Download PDF"}
          </button>
        </div>
      </div>

      {/* Main Printable A4 Document Sheet */}
      <div className="overflow-x-auto pb-6 flex justify-center">
        <div
          id="invoice-printable-doc"
          className="invoice-printable-container w-full max-w-[820px] bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-200/80 p-8 sm:p-12 relative font-sans leading-relaxed text-sm select-text"
          style={{ minHeight: "1123px" }}
        >
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-900 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 flex items-center justify-center text-amber-400 font-serif font-black text-2xl shadow-inner border border-amber-500/30">
                  RS
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 font-serif">
                    {settings.companyName || "RAFIQ SONS LABELS"}
                  </h1>
                  <p className="text-[11px] font-bold tracking-widest text-amber-700 uppercase">
                    {settings.companyTagline || "Haute Couture Trim & Packaging Atelier"}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-gray-600 space-y-0.5">
                <p className="font-medium">{settings.address || "Main Boulevard, Faisalabad, Punjab, Pakistan"}</p>
                <p>
                  <span className="font-semibold text-gray-800">Direct / WhatsApp:</span> {settings.phone || "+92 320 2025795"} |{" "}
                  <span className="font-semibold text-gray-800">Email:</span> {settings.email || "hamzashoukat178@gmail.com"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Official Web:</span> {settings.website || "www.rafiqsonslabels.com"}{" "}
                  {settings.taxNumber && <span>| <span className="font-semibold text-gray-800">NTN / Tax ID:</span> {settings.taxNumber}</span>}
                </p>
              </div>
            </div>

            <div className="sm:text-right space-y-2 self-stretch sm:self-auto flex flex-col justify-between items-start sm:items-end">
              <div>
                <span className="inline-block px-3 py-1 rounded bg-gray-900 text-amber-400 font-mono font-bold text-xs tracking-widest uppercase">
                  COMMERCIAL INVOICE
                </span>
                <h3 className="text-xl font-black font-mono text-gray-900 mt-1">
                  {invoice.invoice_number}
                </h3>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-gray-500">Invoice Date:</span>
                  <span className="font-bold text-gray-900">{invoice.invoice_date}</span>
                </div>
                {invoice.due_date && (
                  <div className="flex justify-between sm:justify-end gap-3">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-bold text-gray-900">{invoice.due_date}</span>
                  </div>
                )}
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-gray-500">Currency:</span>
                  <span className="font-mono font-black text-amber-800">{currency}</span>
                </div>
                <div className="pt-1">{getStatusBadge(invoice.payment_status)}</div>
              </div>
            </div>
          </div>

          {/* Customer / Consignee Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                BILLED TO / CONSIGNEE
              </p>
              <h4 className="text-base font-bold text-gray-900">{invoice.customer_name}</h4>
              {invoice.customer_company && (
                <p className="text-xs font-semibold text-amber-800">{invoice.customer_company}</p>
              )}
              {invoice.customer_address && (
                <p className="text-xs text-gray-600 whitespace-pre-line">{invoice.customer_address}</p>
              )}
              <p className="text-xs text-gray-600 font-medium">
                {invoice.customer_city ? `${invoice.customer_city}, ` : ""}
                <span className="font-bold text-gray-800">{invoice.customer_country || "Worldwide"}</span>
              </p>
              {invoice.customer_phone && (
                <p className="text-xs text-gray-600">
                  <span className="text-gray-500">Phone / WhatsApp:</span> {invoice.customer_phone}
                </p>
              )}
              {invoice.customer_email && (
                <p className="text-xs text-gray-600">
                  <span className="text-gray-500">Email:</span> {invoice.customer_email}
                </p>
              )}
              {invoice.customer_tax_id && (
                <p className="text-xs text-gray-600">
                  <span className="text-gray-500">TRN / Tax ID:</span> {invoice.customer_tax_id}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-gray-200 sm:pl-6">
              <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                COMMERCIAL & SHIPMENT DETAILS
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">Payment Term:</span>
                  <span className="font-bold text-gray-900 text-right">{invoice.payment_terms || "50% Advance + 50% Before Dispatch"}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">Courier / Shipping:</span>
                  <span className="font-semibold text-gray-900">{invoice.delivery_carrier || "DHL Express Worldwide"}</span>
                </div>
                {invoice.tracking_number && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">AWB / Tracking #:</span>
                    <span className="font-mono font-bold text-gray-900">{invoice.tracking_number}</span>
                  </div>
                )}
                {invoice.delivery_status && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Delivery Status:</span>
                    <span className="capitalize font-medium text-amber-800">{invoice.delivery_status}</span>
                  </div>
                )}
                {invoice.estimated_delivery && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Est. Dispatch / Delivery:</span>
                    <span className="font-semibold text-gray-900">{invoice.estimated_delivery}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-900 bg-gray-50 text-gray-700">
                  <th className="py-2.5 px-3 font-black uppercase text-[10px] w-8 text-center">#</th>
                  <th className="py-2.5 px-3 font-black uppercase text-[10px]">Item Description & Specifications</th>
                  <th className="py-2.5 px-3 font-black uppercase text-[10px] text-right w-20">Qty</th>
                  <th className="py-2.5 px-3 font-black uppercase text-[10px] text-center w-16">Unit</th>
                  <th className="py-2.5 px-3 font-black uppercase text-[10px] text-right w-28">Rate ({currency})</th>
                  <th className="py-2.5 px-3 font-black uppercase text-[10px] text-right w-32">Total ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 text-center font-mono font-semibold text-gray-400">{index + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-900">{item.description}</p>
                        {item.specifications && (
                          <p className="text-[11px] text-gray-500 mt-0.5">{item.specifications}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-gray-800">
                        {item.quantity?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center text-gray-500 capitalize">{item.unit || "pcs"}</td>
                      <td className="py-3 px-3 text-right font-mono text-gray-800">
                        {item.unit_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                        {(item.total || (item.quantity * item.unit_price))?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      No line items specified.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2 pb-6 border-b border-gray-200">
            {/* Notes / Special Instructions */}
            <div className="w-full sm:w-1/2 space-y-2">
              {invoice.notes && (
                <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3 text-xs">
                  <p className="font-bold text-amber-900 mb-1">Production & Client Notes:</p>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}
            </div>

            {/* Calculations Table */}
            <div className="w-full sm:w-1/2 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-gray-900">
                  {formatCurrency(invoice.subtotal, currency)}
                </span>
              </div>

              {Number(invoice.discount_amount || 0) > 0 && (
                <div className="flex justify-between py-1 text-emerald-700 font-medium">
                  <span>Discount / Loyalty Rebate:</span>
                  <span className="font-mono font-semibold">
                    - {formatCurrency(invoice.discount_amount, currency)}
                  </span>
                </div>
              )}

              {Number(invoice.shipping_amount || 0) > 0 && (
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Shipping & Handling ({invoice.delivery_carrier || "Courier"}):</span>
                  <span className="font-mono font-semibold text-gray-900">
                    + {formatCurrency(invoice.shipping_amount, currency)}
                  </span>
                </div>
              )}

              {Number(invoice.tax_amount || 0) > 0 && (
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Tax / VAT ({invoice.tax_rate}%):</span>
                  <span className="font-mono font-semibold text-gray-900">
                    + {formatCurrency(invoice.tax_amount, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t-2 border-gray-900 text-sm font-black text-gray-900">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-gray-950">
                  {formatCurrency(invoice.total_amount, currency)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-emerald-800 font-semibold bg-emerald-50 px-2 rounded">
                <span>Advance Paid:</span>
                <span className="font-mono">
                  {formatCurrency(invoice.advance_paid || 0, currency)}
                </span>
              </div>

              <div className="flex justify-between py-2 bg-gray-900 text-amber-400 font-black px-3 rounded-xl text-sm shadow-sm">
                <span>BALANCE DUE:</span>
                <span className="font-mono text-base">
                  {formatCurrency(invoice.balance_due, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Official Bank Account & Remittance Details */}
          <div className="py-6 border-b border-gray-200">
            <div className="rounded-xl border border-gray-300 bg-gray-50/80 p-4">
              <p className="text-[10px] font-black tracking-widest text-gray-700 uppercase mb-2">
                OFFICIAL BANK TRANSFER & REMITTANCE INSTRUCTIONS
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-500">Bank Name:</p>
                  <p className="font-bold text-gray-900">{settings.bankDetails?.bankName || "Meezan Bank Limited / Standard Chartered"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Title (Beneficiary):</p>
                  <p className="font-bold text-gray-900">{settings.bankDetails?.accountTitle || "RAFIQ SONS LABELS"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Number:</p>
                  <p className="font-mono font-bold text-gray-900">{settings.bankDetails?.accountNumber || "02010108920192"}</p>
                </div>
                <div>
                  <p className="text-gray-500">IBAN Number (International Wire):</p>
                  <p className="font-mono font-black text-amber-900">{settings.bankDetails?.iban || "PK00MEZN0002010108920192"}</p>
                </div>
                {settings.bankDetails?.swiftCode && (
                  <div>
                    <p className="text-gray-500">Swift / BIC Code:</p>
                    <p className="font-mono font-bold text-gray-900">{settings.bankDetails.swiftCode}</p>
                  </div>
                )}
                {settings.bankDetails?.branch && (
                  <div>
                    <p className="text-gray-500">Branch:</p>
                    <p className="font-medium text-gray-900">{settings.bankDetails.branch}</p>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 italic">
                * Please send the bank remittance slip or SWIFT reference to <span className="font-bold text-gray-700">+92 320 2025795</span> to initiate instant production scheduling.
              </p>
            </div>
          </div>

          {/* Standard B2B Commercial Terms & Conditions */}
          <div className="py-6 border-b border-gray-200">
            <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">
              TERMS & CONDITIONS (STANDARD COMMERCIAL CONTRACT)
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-gray-600 leading-normal">
              {(settings.termsAndConditions || []).map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ol>
          </div>

          {/* Authorized Signature & Seal Footer */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div className="text-gray-500 space-y-1">
              <p className="font-bold text-gray-800">Thank you for your business!</p>
              <p className="text-[11px]">This is a computer-generated luxury commercial invoice issued by Rafiq Sons Labels & Packaging.</p>
              <p className="text-[11px] font-mono text-gray-400">Ref: {invoice.invoice_number} | {new Date().toLocaleDateString()}</p>
            </div>

            <div className="text-center sm:text-right w-48 space-y-2">
              <div className="h-14 border-b border-gray-400 flex items-end justify-center sm:justify-end pb-1">
                <span className="font-serif italic font-bold text-amber-900 tracking-wide">Rafiq Sons Atelier</span>
              </div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider">Authorized Signatory & Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
