"use client";

import { useState, useMemo } from "react";
import {
  formatCurrency,
  CURRENCIES,
  type Invoice,
  type Customer,
  type InvoiceSettings,
} from "@/lib/invoice";
import InvoiceEditor from "./InvoiceEditor";
import InvoicePreview from "./InvoicePreview";

interface InvoiceManagerProps {
  invoices: Invoice[];
  customers: Customer[];
  settings: InvoiceSettings;
  nextInvoiceNumber: string;
  onSaveInvoice: (invoice: Partial<Invoice>, saveCustomerProfile?: boolean) => Promise<boolean>;
  onDeleteInvoice: (id: number, voidOnly?: boolean) => Promise<boolean>;
  onRefreshData: () => Promise<void>;
}

export default function InvoiceManager({
  invoices,
  customers,
  settings,
  nextInvoiceNumber,
  onSaveInvoice,
  onDeleteInvoice,
  onRefreshData,
}: InvoiceManagerProps) {
  // Navigation & View State
  const [activeView, setActiveView] = useState<"list" | "create" | "edit" | "preview">("list");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter & Search State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalPendingBalance = 0;
    let paidCount = 0;
    let partialCount = 0;
    let pendingCount = 0;

    invoices.forEach((inv) => {
      if (inv.payment_status === "paid") {
        paidCount++;
      } else if (inv.payment_status === "partial") {
        partialCount++;
        totalPendingBalance += Number(inv.balance_due) || 0;
      } else if (inv.payment_status === "pending" || inv.payment_status === "sent") {
        pendingCount++;
        totalPendingBalance += Number(inv.balance_due || inv.total_amount) || 0;
      }
    });

    return {
      totalInvoices: invoices.length,
      paidCount,
      partialCount,
      pendingCount,
      totalPendingBalance,
    };
  }, [invoices]);

  // Filtered Invoices List
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        inv.invoice_number?.toLowerCase().includes(q) ||
        inv.customer_name?.toLowerCase().includes(q) ||
        inv.customer_company?.toLowerCase().includes(q) ||
        inv.customer_country?.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || inv.payment_status === statusFilter;
      const matchCurrency = currencyFilter === "all" || inv.currency === currencyFilter;

      return matchSearch && matchStatus && matchCurrency;
    });
  }, [invoices, search, statusFilter, currencyFilter]);

  // Actions
  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setActiveView("create");
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setActiveView("edit");
  };

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setActiveView("preview");
  };

  const handleDuplicate = (invoice: Invoice) => {
    const duplicated: Partial<Invoice> = {
      ...invoice,
      id: undefined,
      invoice_number: nextInvoiceNumber,
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: null,
      payment_status: "pending",
      advance_paid: 0,
      balance_due: invoice.total_amount,
    };
    setSelectedInvoice(duplicated as Invoice);
    setActiveView("create");
  };

  const handleQuickStatusChange = async (invoice: Invoice, newStatus: Invoice["payment_status"]) => {
    let newAdvance = invoice.advance_paid || 0;
    let newBalance = invoice.balance_due;

    if (newStatus === "paid") {
      newAdvance = invoice.total_amount;
      newBalance = 0;
    } else if (newStatus === "pending") {
      newAdvance = 0;
      newBalance = invoice.total_amount;
    }

    await onSaveInvoice({
      ...invoice,
      payment_status: newStatus,
      advance_paid: newAdvance,
      balance_due: newBalance,
    });
    await onRefreshData();
  };

  const handleDelete = async (invoice: Invoice) => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoice_number}?`)) {
      await onDeleteInvoice(invoice.id!, false);
      await onRefreshData();
    }
  };

  const handleSaveAndRefresh = async (inv: Partial<Invoice>, saveCust?: boolean): Promise<boolean> => {
    const ok = await onSaveInvoice(inv, saveCust);
    if (ok) {
      await onRefreshData();
      setActiveView("list");
      setSelectedInvoice(null);
    }
    return ok;
  };

  if (activeView === "preview" && selectedInvoice) {
    return (
      <InvoicePreview
        invoice={selectedInvoice}
        settings={settings}
        onEdit={(inv) => handleEdit(inv)}
        onClose={() => setActiveView("list")}
      />
    );
  }

  if (activeView === "create" || activeView === "edit") {
    return (
      <InvoiceEditor
        initialInvoice={selectedInvoice}
        settings={settings}
        customers={customers}
        nextInvoiceNumber={nextInvoiceNumber}
        onSave={handleSaveAndRefresh}
        onCancel={() => {
          setActiveView("list");
          setSelectedInvoice(null);
        }}
        onView={(saved) => {
          setSelectedInvoice(saved);
          setActiveView("preview");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Invoices</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">{metrics.totalInvoices}</span>
            <span className="text-xs font-semibold text-gray-400">All Time</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Fully Paid</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-900">{metrics.paidCount}</span>
            <span className="text-xs font-bold text-emerald-700">Orders Completed</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">50% Advance Received</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-900">{metrics.partialCount}</span>
            <span className="text-xs font-bold text-amber-700">In Production</span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Pending Invoices</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-900">{metrics.pendingCount}</span>
            <span className="text-xs font-bold text-blue-700">Awaiting Advance</span>
          </div>
        </div>
      </div>

      {/* Action Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoice #, client, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-gray-300 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-800 focus:border-amber-600 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">50% Partial</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="draft">Draft</option>
            <option value="void">Void</option>
          </select>

          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-800 focus:border-amber-600 focus:outline-none"
          >
            <option value="all">All Currencies</option>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-amber-700 hover:to-amber-800"
        >
          <span>✨</span> + Create Commercial Invoice
        </button>
      </div>

      {/* Invoices Master Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-700 font-bold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client / Brand</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Advance Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const curr = inv.currency || "SAR";
                  return (
                    <tr key={inv.id} className="hover:bg-amber-50/30 transition">
                      {/* Invoice Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handlePreview(inv)}
                          className="hover:text-amber-700 hover:underline flex items-center gap-1.5"
                        >
                          <span>📄</span> {inv.invoice_number}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        {inv.invoice_date}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{inv.customer_name}</p>
                        {inv.customer_company && (
                          <p className="text-[11px] text-gray-500">{inv.customer_company}</p>
                        )}
                      </td>

                      {/* Country */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                          {inv.customer_country || "Worldwide"}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                        {formatCurrency(inv.total_amount, curr)}
                      </td>

                      {/* Advance Paid */}
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold whitespace-nowrap">
                        {formatCurrency(inv.advance_paid || 0, curr)}
                      </td>

                      {/* Balance Due */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-amber-900 whitespace-nowrap">
                        {formatCurrency(inv.balance_due, curr)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={inv.payment_status}
                          onChange={(e) =>
                            handleQuickStatusChange(inv, e.target.value as Invoice["payment_status"])
                          }
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider focus:outline-none border cursor-pointer ${
                            inv.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : inv.payment_status === "partial"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : inv.payment_status === "pending"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="partial">50% Advance</option>
                          <option value="paid">Paid</option>
                          <option value="sent">Sent</option>
                          <option value="draft">Draft</option>
                          <option value="void">Void</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePreview(inv)}
                            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            title="View / Print A4"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(inv)}
                            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-amber-800"
                            title="Edit Invoice"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(inv)}
                            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-blue-800"
                            title="Duplicate as New Invoice"
                          >
                            📑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(inv)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete Invoice"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <div className="space-y-2">
                      <p className="text-base font-semibold">No invoices found.</p>
                      <p className="text-xs">Click &ldquo;+ Create Commercial Invoice&rdquo; above to generate your first bill.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
