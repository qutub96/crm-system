export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-paper-200">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-ink-700/70 mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white border border-paper-200 rounded-lg px-5 py-4">
      <p className="text-xs font-mono uppercase tracking-wide text-ink-700/60">
        {label}
      </p>
      <p className="text-2xl font-semibold text-ink-900 mt-1">{value}</p>
      {hint && <p className="text-xs text-ink-700/50 mt-1">{hint}</p>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-paper-200 text-ink-800",
    active: "bg-amber-500/15 text-amber-600",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-ink-900 text-paper-50 hover:bg-ink-800",
    outline: "border border-paper-200 text-ink-800 hover:bg-paper-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-ink-700 hover:bg-paper-100",
  };
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block text-sm">
      {label && (
        <span className="block mb-1 font-medium text-ink-800">{label}</span>
      )}
      <input
        className="w-full px-3 py-2 border border-paper-200 rounded-md bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block text-sm">
      {label && (
        <span className="block mb-1 font-medium text-ink-800">{label}</span>
      )}
      <select
        className="w-full px-3 py-2 border border-paper-200 rounded-md bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 px-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <h3 className="font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-ink-700/60 hover:text-ink-900 text-sm"
          >
            Close
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
