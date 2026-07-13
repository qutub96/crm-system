import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/customers", label: "Customers" },
  { to: "/interactions", label: "Interactions" },
  { to: "/opportunities", label: "Opportunities" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 bg-ink-950 text-paper-100 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-ink-800">
        <p className="font-mono text-xs tracking-widest text-amber-500 uppercase">
          Ledger
        </p>
        <h1 className="text-lg font-semibold mt-1">CRM Console</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-ink-800 text-amber-500"
                  : "text-paper-200/70 hover:bg-ink-900 hover:text-paper-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-ink-800">
        <p className="text-sm font-medium truncate">{user?.fullName}</p>
        <p className="text-xs text-paper-200/50 font-mono truncate">
          {user?.role}
        </p>
        <button
          onClick={logout}
          className="mt-3 w-full text-left text-xs font-medium text-paper-200/70 hover:text-amber-500 transition-colors"
        >
          Sign out &rarr;
        </button>
      </div>
    </aside>
  );
}
