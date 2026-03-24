"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SignalStrength } from "@/components/signals/signal-strength";
import { SignalDetailModal } from "@/components/signals/signal-detail-modal";
import type { Signal } from "@/db/schema";

export function SignalsTable({ signals }: { signals: Signal[] }) {
  const [selected, setSelected] = useState<Signal | null>(null);

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-2 text-text-secondary font-normal">
                Title
              </th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">
                Source
              </th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">
                Strength
              </th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">
                Status
              </th>
              <th className="text-left px-4 py-2 text-text-secondary font-normal">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {signals.map((sig) => (
              <tr
                key={sig.id}
                onClick={() => setSelected(sig)}
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
                  {sig.created_at
                    ? new Date(sig.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {signals.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-text-secondary"
                >
                  No signals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
