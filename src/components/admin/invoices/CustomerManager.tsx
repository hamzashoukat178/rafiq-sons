"use client";

import { useState } from "react";
import type { Customer, Invoice } from "@/lib/invoice";

interface CustomerManagerProps {
  customers: Customer[];
  invoices: Invoice[];
  onSaveCustomer: (customer: Partial<Customer>) => Promise<boolean>;
  onCreateInvoiceForCustomer: (customer: Customer) => void;
}

export default function CustomerManager({
  customers,
  invoices,
  onSaveCustomer,
  onCreateInvoiceForCustomer,
}: CustomerManagerProps) {
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q)
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.name?.trim()) {
      alert("Customer name is required.");
      return;
    }
    setSaving(true);
    const ok = await onSaveCustomer(editingCustomer);
    setSaving(false);
    if (ok) {
      setEditingCustomer(null);
      setIsCreating(false);
    }
  };

  const getCustomerStats = (customer: Customer) => {
    const matchingInvoices = invoices.filter(
      (inv) =>
        inv.customer_id === customer.id ||
        (inv.customer_name?.toLowerCase() === customer.name?.toLowerCase() &&
          customer.name?.trim().length > 0)
    );
    const count = matchingInvoices.length;
    return { count, invoices: matchingInvoices };
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>👥 Client Directory & CRM</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
              {customers.length} Clients
            </span>
          </h2>
          <p className="text-xs text-gray-500">
            Manage your high-profile couture fashion brands, buyers, and international trade contacts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, company, phone, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setEditingCustomer({ country: "Saudi Arabia" });
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
          >
            + Add New Client
          </button>
        </div>
      </div>

      {/* Edit / Add Modal Drawer */}
      {(isCreating || editingCustomer) && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/30 p-6 shadow-md transition space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <h3 className="text-sm font-bold text-amber-950">
              {editingCustomer?.id ? `Edit Client: ${editingCustomer.name}` : "Create New Client Profile"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingCustomer(null);
                setIsCreating(false);
              }}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name / Contact *</label>
              <input
                type="text"
                required
                value={editingCustomer?.name || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="e.g. Sheikh Faisal Al-Otaibi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brand</label>
              <input
                type="text"
                value={editingCustomer?.company || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="e.g. Al-Noor Haute Couture"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Phone</label>
              <input
                type="text"
                value={editingCustomer?.phone || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="+966 50 123 4567"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editingCustomer?.email || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="faisal@alnoor.sa"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={editingCustomer?.city || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="Riyadh / Dubai / Doha"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={editingCustomer?.country || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, country: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="Saudi Arabia"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Shipping Address</label>
              <input
                type="text"
                value={editingCustomer?.address || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="Street address, district, postal code..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Client Tax / VAT ID</label>
              <input
                type="text"
                value={editingCustomer?.tax_id || ""}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, tax_id: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-amber-600 focus:outline-none"
                placeholder="TRN-3000..."
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCustomer(null);
                  setIsCreating(false);
                }}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gray-900 px-5 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Client Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => {
            const stats = getCustomerStats(c);
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{c.name}</h4>
                      {c.company && (
                        <p className="text-xs font-semibold text-amber-800">{c.company}</p>
                      )}
                    </div>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">
                      {c.country || "Global"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 pt-1">
                    {c.phone && (
                      <p className="flex items-center gap-1.5">
                        <span className="text-gray-400">📞</span> {c.phone}
                      </p>
                    )}
                    {c.email && (
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-gray-400">✉️</span> {c.email}
                      </p>
                    )}
                    {c.city && (
                      <p className="flex items-center gap-1.5">
                        <span className="text-gray-400">📍</span> {c.city}, {c.country}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-900">
                      {stats.count} {stats.count === 1 ? "Invoice" : "Invoices"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCustomer(c);
                      setIsCreating(false);
                    }}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onCreateInvoiceForCustomer(c)}
                    className="rounded-xl bg-amber-600/10 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-600 hover:text-white transition"
                  >
                    🧾 Create Invoice
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            <p className="text-base font-semibold">No clients found matching your search.</p>
            <p className="text-xs mt-1">Add your first client profile or search with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
