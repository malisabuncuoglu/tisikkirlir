"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "⬡", label: "Dashboard" },
  { href: "/signals", icon: "⚡", label: "Signals" },
  { href: "/opportunities", icon: "◈", label: "Opportunities" },
  { href: "/reports", icon: "⊞", label: "Reports" },
  { href: "/archive", icon: "⊘", label: "Archive" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border px-4 py-2 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-accent tracking-wider">
            OPPORTUNITY
          </span>
          <span className="text-[10px] font-mono text-text-secondary tracking-wider ml-1">
            COCKPIT
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary hover:text-text-primary text-lg cursor-pointer"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop: always visible, mobile: overlay */}
      <aside
        className={`
          w-48 shrink-0 border-r border-border bg-surface h-screen sticky top-0 flex flex-col z-40
          max-md:fixed max-md:left-0 max-md:top-0 max-md:transition-transform max-md:duration-200
          ${mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        <div className="px-4 py-4 border-b border-border">
          <h1 className="text-xs font-mono font-bold text-accent tracking-wider">
            OPPORTUNITY
          </h1>
          <p className="text-[10px] font-mono text-text-secondary tracking-wider">
            COCKPIT
          </p>
        </div>
        <nav className="flex-1 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2 text-xs font-mono transition-colors ${
                  isActive
                    ? "text-accent bg-accent/5 border-r-2 border-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] font-mono text-text-secondary">
            v0.1.0 — local only
          </p>
          <p className="text-[10px] font-mono text-text-secondary/50 mt-0.5">
            Press ? for shortcuts
          </p>
        </div>
      </aside>
    </>
  );
}
