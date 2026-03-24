"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SignalStrength } from "@/components/signals/signal-strength";
import { SignalDetailModal } from "@/components/signals/signal-detail-modal";
import type { Signal } from "@/db/schema";

export function SignalsTable({ signals }: { signals: Signal[] }) {
  const [selected, setSelected] = useState<Signal | null>(null);
  const router = useRouter();

  function handleRowClick(sig: Signal, e: React.MouseEvent) {
    // Ctrl/Cmd+click opens the full detail page
    if (e.metaKey || e.ctrlKey) {
      router.push(`/signals/${sig.id}`);
    } else {
      setSelected(sig);
    }
  }

  return (
    <>
      {/* Desktop table */}
      <div className="border border-border rounded-lg overflow-hidden hidden md:block">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-2 text-text-secondary font-normal">Title</th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">Source</th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">Strength</th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">Status</th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((sig) => (
              <tr
                key={sig.id}
                onClick={(e) => handleRowClick(sig, e)}
                className="border-b border-border hover:bg-surface/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 text-text-primary">{sig.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="muted">{sig.source_type}</Badge>
                </td>
                <td className="px-4 py-3">
                  <SignalStrength strength={sig.signal_strength} />
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      sig.status === "raw"
                        ? "warning"
                        : sig.status === "converted"
                        ? "success"
                        : sig.status === "dismissed"
                        ? "danger"
                        : "default"
                    }
                  >
                    {sig.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {sig.created_at ? new Date(sig.created_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
            {signals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                  No signals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {signals.map((sig) => (
          <div
            key={sig.id}
            onClick={(e) => handleRowClick(sig, e)}
            className="border border-border rounded-lg bg-surface p-3 cursor-pointer hover:border-text-secondary/30 transition-colors"
          >
            <p className="text-xs font-mono text-text-primary mb-1.5">{sig.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="muted">{sig.source_type}</Badge>
              <SignalStrength strength={sig.signal_strength} />
              <Badge
                variant={
                  sig.status === "raw"
                    ? "warning"
                    : sig.status === "converted"
                    ? "success"
                    : sig.status === "dismissed"
                    ? "danger"
                    : "default"
                }
              >
                {sig.status}
              </Badge>
              <span className="text-[10px] text-text-secondary font-mono ml-auto">
                {sig.created_at ? new Date(sig.created_at).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        ))}
        {signals.length === 0 && (
          <p className="text-xs font-mono text-text-secondary text-center py-8">
            No signals found.
          </p>
        )}
      </div>

      {selected && (
        <SignalDetailModal
          signal={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
