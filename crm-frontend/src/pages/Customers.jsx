import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Button, Input, Badge, Modal } from "../components/ui";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  company: "",
  industry: "",
  status: "Active",
};

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/customer");
      setCustomers(data);
    } catch (err) {
      setError("Could not load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(customer) {
    setEditingId(customer.id);
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      company: customer.company,
      industry: customer.industry,
      status: customer.status,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/customer/${editingId}`, form);
      } else {
        await api.post("/customer", form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      alert("Save failed. Check the form and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this customer? This cannot be undone.")) return;
    try {
      await api.delete(`/customer/${id}`);
      await load();
    } catch (err) {
      alert("Delete failed. Admin role is required.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} on record`}
        action={<Button onClick={openCreate}>+ New customer</Button>}
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
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Company</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-paper-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/customers/${c.id}`}
                        className="font-medium text-ink-900 hover:text-amber-600"
                      >
                        {c.firstName} {c.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{c.company}</td>
                    <td className="px-4 py-3 text-ink-700 font-mono text-xs">
                      {c.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={c.status === "Active" ? "active" : "neutral"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-xs font-medium text-ink-700 hover:text-amber-600"
                      >
                        Edit
                      </button>
                      {user?.role === "Admin" && (
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-700/50">
                      No customers yet. Add your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit customer" : "New customer"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Last name"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone number"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
            <Input
              label="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Industry"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />
            <Input
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save customer"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
