"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Accounts", href: "/accounts" },
  { name: "Transactions", href: "/transactions" },
  { name: "Reports", href: "/reports" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 lg:z-auto h-full lg:h-auto bg-white/90 shadow lg:shadow-none w-64 p-6 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <h1 className="text-xl font-semibold mb-8 text-[var(--accent)]">📊 Finances</h1>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md hover:bg-[var(--accent)] hover:text-[var(--background)] transition"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white/90 px-6 py-4 shadow-sm">
          <button
            className="lg:hidden text-[var(--accent)]"
            onClick={() => setOpen(!open)}
          >
            <Menu size={24} />
          </button>
          <h2 className="font-semibold text-lg">Pages & Peace Finances</h2>
          <button className="btn-outline text-sm">Sign Out</button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
