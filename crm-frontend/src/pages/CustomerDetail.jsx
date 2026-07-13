import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { PageHeader, Badge } from "../components/ui";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [custRes, interRes, oppRes] = await Promise.all([
          api.get(`/customer/${id}`),
          api.get(`/interaction/customer/${id}`),
          api.get(`/opportunity/customer/${id}`),
        ]);
        setCustomer(custRes.data);
        setInteractions(interRes.data);
        setOpportunities(oppRes.data);
      } catch (err) {
        setError("Could not load this customer.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <p className="p-8 text-sm text-ink-700/60">Loading…</p>;
  }

  if (error || !customer) {
    return <p className="p-8 text-sm text-red-600">{error || "Not found."}</p>;
  }

  return (
    <div>
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        subtitle={
          <Link to="/customers" className="text-amber-600 hover:underline">
            &larr; Back to customers
          </Link>
        }
      />

      <div className="p-8 grid grid-cols-3 gap-6">
        <div className="bg-white border border-paper-200 rounded-lg p-5 space-y-3 h-fit">
          <h3 className="text-sm font-semibold text-ink-900">Profile</h3>
          <DetailRow label="Email" value={customer.email} mono />
          <DetailRow label="Phone" value={customer.phoneNumber} />
          <DetailRow label="Company" value={customer.company} />
          <DetailRow label="Industry" value={customer.industry} />
          <DetailRow
            label="Status"
            value={<Badge tone={customer.status === "Active" ? "active" : "neutral"}>{customer.status}</Badge>}
          />
        </div>

        <div className="col-span-2 space-y-6">
          <section className="bg-white border border-paper-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-3">
              Interactions ({interactions.length})
            </h3>
            {interactions.length === 0 ? (
              <p className="text-sm text-ink-700/50">No interactions logged yet.</p>
            ) : (
              <ul className="space-y-3">
                {interactions.map((i) => (
                  <li key={i.id} className="border-b border-paper-200 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-ink-900">{i.subject}</p>
                      <Badge tone={i.status === "Completed" ? "success" : "neutral"}>
                        {i.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-700/60 mt-0.5">
                      {i.type} · {new Date(i.interactionDate).toLocaleDateString()}
                    </p>
                    {i.notes && (
                      <p className="text-sm text-ink-700 mt-1">{i.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white border border-paper-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-3">
              Opportunities ({opportunities.length})
            </h3>
            {opportunities.length === 0 ? (
              <p className="text-sm text-ink-700/50">No opportunities yet.</p>
            ) : (
              <ul className="space-y-3">
                {opportunities.map((o) => (
                  <li key={o.id} className="border-b border-paper-200 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-ink-900">
                        {o.title || "Untitled opportunity"}
                      </p>
                      <span className="font-mono text-sm text-amber-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(o.value)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-700/60 mt-0.5">
                      {o.stage} · closes{" "}
                      {new Date(o.expectedCloseDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wide text-ink-700/50">
        {label}
      </p>
      <p className={`text-sm text-ink-900 ${mono ? "font-mono" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
