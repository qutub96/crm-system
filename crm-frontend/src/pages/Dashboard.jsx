import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import api from "../api/axios";
import { PageHeader, StatCard } from "../components/ui";

const PIE_COLORS = ["#C68A2E", "#293349", "#8A9BAE", "#D9C9A3"];

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [custRes, oppRes, interRes] = await Promise.all([
          api.get("/customer"),
          api.get("/opportunity"),
          api.get("/interaction"),
        ]);
        setCustomers(custRes.data);
        setOpportunities(oppRes.data);
        setInteractions(interRes.data);
      } catch (err) {
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusCounts = groupCount(customers, (c) => c.status || "Unknown");
  const stageCounts = groupCount(opportunities, (o) => o.stage || "Unknown");
  const pipelineValue = opportunities.reduce(
    (sum, o) => sum + (Number(o.value) || 0),
    0
  );
  const pendingInteractions = interactions.filter(
    (i) => i.status === "Pending"
  ).length;

  const stageData = Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
  }));
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="A snapshot of your pipeline right now"
      />

      <div className="p-8">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard label="Customers" value={loading ? "—" : customers.length} />
          <StatCard
            label="Open opportunities"
            value={loading ? "—" : opportunities.length}
          />
          <StatCard
            label="Pipeline value"
            value={loading ? "—" : formatCurrency(pipelineValue)}
          />
          <StatCard
            label="Pending interactions"
            value={loading ? "—" : pendingInteractions}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-paper-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">
              Opportunities by stage
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E1D3" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 12, fill: "#293349" }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#293349" }} />
                <Tooltip />
                <Bar dataKey="count" fill="#C68A2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-paper-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">
              Customers by status
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-ink-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  {s.name} ({s.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupCount(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
