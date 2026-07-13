import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data || "Invalid email or password. Please try again."
      );
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
            CRM Console
          </h1>
          <p className="text-sm text-paper-200/50 mt-2">
            Sign in to view your pipeline
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 space-y-4 shadow-xl"
        >
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              {typeof error === "string" ? error : "Login failed."}
            </p>
          )}
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-paper-200/60 mt-5">
          No account?{" "}
          <Link to="/register" className="text-amber-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
