import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "Dashboard" | "Sales" | "Customers" | "Settings";

// ─── Mock data ────────────────────────────────────────────────────────────────

const salesData = [
  { day: "Mon", value: 12400 },
  { day: "Tue", value: 15200 },
  { day: "Wed", value: 13800 },
  { day: "Thu", value: 18500 },
  { day: "Fri", value: 16200 },
  { day: "Sat", value: 21400 },
  { day: "Sun", value: 19800 },
];

const orders = [
  { customer: "Anna Schmidt", date: "Sep 5", amount: "€420", status: "Completed" },
  { customer: "John Miller", date: "Sep 4", amount: "€280", status: "Completed" },
  { customer: "Sofia Weber", date: "Sep 4", amount: "€650", status: "Pending" },
  { customer: "Daniel Brown", date: "Sep 3", amount: "€190", status: "Completed" },
  { customer: "Emma Wilson", date: "Sep 2", amount: "€510", status: "Failed" },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Failed: "bg-red-50 text-red-600 ring-1 ring-red-200",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const navItems: { label: Page; icon: () => JSX.Element }[] = [
  { label: "Dashboard", icon: GridIcon },
  { label: "Sales", icon: TrendingIcon },
  { label: "Customers", icon: UsersIcon },
  { label: "Settings", icon: SettingsIcon },
];

// ─── Chart tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-600 text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>
          €{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

const kpiColors: Record<string, { icon: string }> = {
  indigo: { icon: "bg-indigo-50 text-indigo-600" },
  violet: { icon: "bg-violet-50 text-violet-600" },
  sky: { icon: "bg-sky-50 text-sky-600" },
};

const kpiIcons: Record<string, JSX.Element> = {
  indigo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  violet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  sky: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

function KpiCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpiColors[color].icon}`}>
          {kpiIcons[color]}
        </div>
      </div>
      <p className="text-2xl font-600 text-gray-900 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
        {value}
      </p>
      <div className="flex items-center gap-1 text-xs font-500 text-emerald-600">
        <ArrowUp />
        <span>{change} vs last month</span>
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <main className="flex-1 px-5 lg:px-8 py-7 space-y-7">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Total Revenue" value="€124,500" change="+12.5%" color="indigo" />
        <KpiCard label="Orders" value="1,248" change="+8.4%" color="violet" />
        <KpiCard label="Customers" value="856" change="+5.2%" color="sky" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 font-600 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
              Sales Overview
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-500">
            <ArrowUp />
            14.2%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={salesData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }} activeDot={{ r: 5, fill: "#6366f1", stroke: "white", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-gray-900 font-600 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
            Recent Orders
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">5 most recent transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-500 text-gray-500 uppercase tracking-wide px-6 py-3">Customer</th>
                <th className="text-left text-xs font-500 text-gray-500 uppercase tracking-wide px-4 py-3">Date</th>
                <th className="text-left text-xs font-500 text-gray-500 uppercase tracking-wide px-4 py-3">Amount</th>
                <th className="text-left text-xs font-500 text-gray-500 uppercase tracking-wide px-4 py-3 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-600 shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {order.customer.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-gray-800 font-500">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{order.date}</td>
                  <td className="px-4 py-3.5 text-gray-800 font-500">{order.amount}</td>
                  <td className="px-4 py-3.5 pr-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-500 ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function PlaceholderPage({ page }: { page: Page }) {
  const meta: Record<string, { description: string; icon: JSX.Element }> = {
    Sales: {
      description: "Track pipeline, deals, and revenue targets.",
      icon: <TrendingIcon />,
    },
    Customers: {
      description: "Manage accounts, contacts, and activity.",
      icon: <UsersIcon />,
    },
    Settings: {
      description: "Configure your workspace, team, and preferences.",
      icon: <SettingsIcon />,
    },
  };

  const { description, icon } = meta[page];

  return (
    <main className="flex-1 px-5 lg:px-8 py-7">
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-gray-900 font-600 text-lg mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
          {page}
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      </div>
    </main>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(target: Page) {
    setPage(target);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-full bg-gray-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-56 flex flex-col
          bg-gray-950 text-gray-300
          transform transition-transform duration-200
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-white font-600 text-sm tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Vanta
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map(({ label, icon: Icon }) => {
            const active = label === page;
            return (
              <button
                key={label}
                onClick={() => navigate(label)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${active
                    ? "bg-indigo-600 text-white font-500"
                    : "text-gray-400 hover:bg-white/6 hover:text-gray-200"}
                `}
              >
                <Icon />
                {label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-5 border-t border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-600" style={{ fontFamily: "Outfit, sans-serif" }}>
              ML
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 font-500 truncate">Maria Lange</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-5 lg:px-8 gap-4 sticky top-0 z-10">
          <button className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>

          <h1 className="text-gray-900 font-600 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
            {page}
          </h1>

          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="hidden sm:inline">Last 30 days</span>
              <ChevronDown />
            </button>

            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-600" style={{ fontFamily: "Outfit, sans-serif" }}>
              ML
            </div>
          </div>
        </header>

        {page === "Dashboard" ? <DashboardPage /> : <PlaceholderPage page={page} />}
      </div>
    </div>
  );
}
