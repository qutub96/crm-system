import { useEffect, useState } from "react";
import api from "../api/axios";
import { PageHeader, Button, Input, Select, Badge, Modal } from "../components/ui";

const emptyForm = {
  customerId: "",
  title: "",
  description: "",
  value: "",
  stage: "New",
  expectedCloseDate: new Date().toISOString().slice(0, 10),
  probabilityPercentage: 20,
};

const stageTone = {
  New: "neutral",
  Proposal: "active",
  Negotiation: "active",
  Won: "success",
  Lost: "danger",
};

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [oppRes, custRes] = await Promise.all([
        api.get("/opportunity"),
        api.get("/customer"),
      ]);
      setOpportunities(oppRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      setError("Could not load opportunities.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function customerName(customerId) {
    const c = customers.find((c) => c.id === customerId);
    return c ? `${c.firstName} ${c.lastName}` : `#${customerId}`;
  }

  function openCreate() {
    setForm({ ...emptyForm, customerId: customers[0]?.id || "" });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/opportunity", {
        ...form,
        customerId: Number(form.customerId),
        value: Number(form.value),
        probabilityPercentage: Number(form.probabilityPercentage),
      });
      setModalOpen(false);
      await load();
    } catch (err) {
      alert("Save failed. Check the form and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this opportunity?")) return;
    try {
      await api.delete(`/opportunity/${id}`);
      await load();
    } catch (err) {
      alert("Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Opportunities"
        subtitle={`${opportunities.length} in pipeline`}
        action={<Button onClick={openCreate}>+ New opportunity</Button>}
      />

      <div className="p-8">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading ? (
          <p className="text-ink-700/60 text-sm">Loading…</p>
        ) : (
          <div className="bg-white border border-paper-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-100 text-ink-700/70 text-xs uppercase font-mono">
                <tr>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Value</th>
                  <th className="text-left px-4 py-3">Stage</th>
                  <th className="text-left px-4 py-3">Closes</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200">
                {opportunities.map((o) => (
                  <tr key={o.id} className="hover:bg-paper-50">
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {customerName(o.customerId)}
                    </td>
                    <td className="px-4 py-3 text-ink-700">
                      {o.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 font-mono text-amber-600">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(o.value)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={stageTone[o.stage] || "neutral"}>
                        {o.stage}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-700 text-xs font-mono">
                      {new Date(o.expectedCloseDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {opportunities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink-700/50">
                      No opportunities yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New opportunity">
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Customer"
            required
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </Select>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Value (USD)"
              type="number"
              min="0"
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
            <Select
              label="Stage"
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
            >
              <option>New</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Won</option>
              <option>Lost</option>
            </Select>
          </div>
          <Input
            label="Expected close date"
            type="date"
            required
            value={form.expectedCloseDate}
            onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
          />
          <label className="block text-sm">
            <span className="block mb-1 font-medium text-ink-800">Description</span>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-paper-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save opportunity"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
