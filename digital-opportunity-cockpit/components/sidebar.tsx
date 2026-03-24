"use client";

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

  return (
    <aside className="w-48 shrink-0 border-r border-border bg-surface h-screen sticky top-0 flex flex-col">
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
      </div>
    </aside>
  );
}
