"use client";
import "../globals.css";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Accounts", href: "/accounts" },
  { name: "Transactions", href: "/transactions" },
  { name: "Reports", href: "/reports" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FAF6F1] text-[#111] font-[var(--font-montserrat)]">
      {/* ─────────────── Sidebar ─────────────── */}
      <aside
        className={`fixed md:static z-40 md:z-auto h-full md:h-auto bg-white/90 shadow-md md:shadow-none w-64 p-6 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand header */}
        <h1 className="text-2xl font-semibold mb-10 text-[#5DA865] tracking-wide">
          📊 Finances
        </h1>

        {/* Nav items */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-[#5DA865] hover:text-white transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ─────────────── Main Content ─────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white/95 border-b border-[#ddd] px-6 py-4 shadow-sm sticky top-0 z-30">
          {/* Hamburger (only visible on mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-[#5DA865] hover:bg-[#F0EDE8] transition"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold tracking-wide text-[#111]">
            Pages & Peace Finances
          </h2>

          {/* Sign out */}
          <button className="btn btn-outline text-sm font-medium">
            Sign Out
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#FAF6F1]">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8">
            {children}
          </div>
        </main>
      </div>

      {/* ─────────────── Overlay (for mobile) ─────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
