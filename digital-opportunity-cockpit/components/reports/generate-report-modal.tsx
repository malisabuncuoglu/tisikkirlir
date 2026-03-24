"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateWeeklyReport } from "@/actions/generate";
import type { Signal, Opportunity } from "@/db/schema";

interface Props {
  signals: Signal[];
  opportunities: Opportunity[];
}

export function GenerateReportButton({ signals, opportunities }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="accent" size="md" onClick={() => setOpen(true)}>
        + Generate Report
      </Button>
      {open && (
        <GenerateReportModal
          open={open}
          onClose={() => setOpen(false)}
          signals={signals}
          opportunities={opportunities}
        />
      )}
    </>
  );
}

function GenerateReportModal({
  open,
  onClose,
  signals,
  opportunities,
}: Props & { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [selectedSignals, setSelectedSignals] = useState<string[]>(
    signals.map((s) => s.id)
  );
  const [selectedOpps, setSelectedOpps] = useState<string[]>(
    opportunities.map((o) => o.id)
  );
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await generateWeeklyReport({
        title: (form.get("title") as string) || "Weekly Report",
        periodStart: form.get("period_start") as string,
        periodEnd: form.get("period_end") as string,
        signalIds: selectedSignals,
        opportunityIds: selectedOpps,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    }
    setLoading(false);
  }

  function toggleSignal(id: string) {
    setSelectedSignals((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleOpp(id: string) {
    setSelectedOpps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Generate Weekly Report">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" label="Report Title" defaultValue="Weekly Report" />
        <div className="grid grid-cols-2 gap-3">
          <Input
            name="period_start"
            label="Period Start"
            type="date"
            defaultValue={weekAgo}
          />
          <Input
            name="period_end"
            label="Period End"
            type="date"
            defaultValue={today}
          />
        </div>

        {/* Signal selection */}
        <div>
          <p className="text-xs font-mono text-text-secondary mb-1">
            Include Signals ({selectedSignals.length}/{signals.length})
          </p>
          <div className="max-h-32 overflow-auto border border-border rounded p-2 space-y-1">
            {signals.map((sig) => (
              <label
                key={sig.id}
                className="flex items-center gap-2 text-[10px] font-mono text-text-primary cursor-pointer hover:text-accent"
              >
                <input
                  type="checkbox"
                  checked={selectedSignals.includes(sig.id)}
                  onChange={() => toggleSignal(sig.id)}
                  className="accent-accent"
                />
                {sig.title}
              </label>
            ))}
            {signals.length === 0 && (
              <p className="text-[10px] text-text-secondary">No signals</p>
            )}
          </div>
        </div>

        {/* Opportunity selection */}
        <div>
          <p className="text-xs font-mono text-text-secondary mb-1">
            Include Opportunities ({selectedOpps.length}/{opportunities.length})
          </p>
          <div className="max-h-32 overflow-auto border border-border rounded p-2 space-y-1">
            {opportunities.map((opp) => (
              <label
                key={opp.id}
                className="flex items-center gap-2 text-[10px] font-mono text-text-primary cursor-pointer hover:text-accent"
              >
                <input
                  type="checkbox"
                  checked={selectedOpps.includes(opp.id)}
                  onChange={() => toggleOpp(opp.id)}
                  className="accent-accent"
                />
                {opp.title}
              </label>
            ))}
            {opportunities.length === 0 && (
              <p className="text-[10px] text-text-secondary">No opportunities</p>
            )}
          </div>
        </div>

        {error && <p className="text-xs font-mono text-danger">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
