import { useEffect, useState } from "react";
import api from "../api/axios";
import { PageHeader, Button, Input, Select, Badge, Modal } from "../components/ui";

const emptyForm = {
  customerId: "",
  name: "",
  type: "Call",
  subject: "",
  notes: "",
  interactionDate: new Date().toISOString().slice(0, 16),
  status: "Pending",
};

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [interRes, custRes] = await Promise.all([
        api.get("/interaction"),
        api.get("/customer"),
      ]);
      setInteractions(interRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      setError("Could not load interactions.");
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
      await api.post("/interaction", {
        ...form,
        customerId: Number(form.customerId),
        name: form.name || customerName(Number(form.customerId)),
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
    if (!confirm("Delete this interaction?")) return;
    try {
      await api.delete(`/interaction/${id}`);
      await load();
    } catch (err) {
      alert("Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Interactions"
        subtitle={`${interactions.length} logged`}
        action={<Button onClick={openCreate}>+ Log interaction</Button>}
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
                  <th className="text-left px-4 py-3">Subject</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200">
                {interactions.map((i) => (
                  <tr key={i.id} className="hover:bg-paper-50">
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {customerName(i.customerId)}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{i.subject}</td>
                    <td className="px-4 py-3 text-ink-700">{i.type}</td>
                    <td className="px-4 py-3 text-ink-700 text-xs font-mono">
                      {new Date(i.interactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={i.status === "Completed" ? "success" : "neutral"}>
                        {i.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(i.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {interactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink-700/50">
                      No interactions logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log interaction">
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
            label="Subject"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Call</option>
              <option>Email</option>
              <option>Meeting</option>
              <option>Note</option>
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Pending</option>
              <option>Completed</option>
            </Select>
          </div>
          <Input
            label="Date"
            type="datetime-local"
            required
            value={form.interactionDate}
            onChange={(e) => setForm({ ...form, interactionDate: e.target.value })}
          />
          <label className="block text-sm">
            <span className="block mb-1 font-medium text-ink-800">Notes</span>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-paper-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save interaction"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
