import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Select } from "../components/ui";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "SalesRep",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(Array.isArray(data) ? data.join(", ") : data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-widest text-amber-500 uppercase">
            Ledger
          </p>
          <h1 className="text-2xl font-semibold text-paper-50 mt-1">
            Create your account
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 space-y-4 shadow-xl"
        >
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <Input
            label="Full name"
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Jane Doe"
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 6 characters"
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="SalesRep">Sales rep</option>
            <option value="Admin">Admin</option>
          </Select>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-paper-200/60 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
