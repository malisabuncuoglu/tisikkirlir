"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SignalStrength } from "@/components/signals/signal-strength";
import { useToast } from "@/components/ui/toast";
import { updateSignal, dismissSignal } from "@/actions/signals";
import { ConvertToOpportunityModal } from "./convert-modal";
import type { Signal } from "@/db/schema";

interface Props {
  signal: Signal;
  open: boolean;
  onClose: () => void;
}

export function SignalDetailModal({ signal, open, onClose }: Props) {
  const [notes, setNotes] = useState(signal.notes || "");
  const [saving, setSaving] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const { toast } = useToast();

  const tags = signal.tags ? JSON.parse(signal.tags) : [];
  const topics = signal.topics ? JSON.parse(signal.topics) : [];

  async function handleSaveNotes() {
    setSaving(true);
    await updateSignal(signal.id, { notes });
    setSaving(false);
    toast("Notes saved");
  }

  async function handleDismiss() {
    await dismissSignal(signal.id);
    toast("Signal dismissed");
    onClose();
  }

  return (
    <>
      <Modal open={open && !showConvert} onClose={onClose} title="Signal Detail">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-mono font-semibold text-text-primary">
              {signal.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="muted">{signal.source_type}</Badge>
              <SignalStrength strength={signal.signal_strength} />
              <Badge variant={signal.status === "raw" ? "warning" : "default"}>
                {signal.status}
              </Badge>
            </div>
          </div>

          {signal.raw_content && (
            <div>
              <p className="text-[10px] font-mono text-text-secondary mb-1">Raw Content</p>
              <div className="bg-bg border border-border rounded p-3 text-xs font-mono text-text-primary whitespace-pre-wrap max-h-48 overflow-auto">
                {signal.raw_content}
              </div>
            </div>
          )}

          {signal.source_url && (
            <div>
              <p className="text-[10px] font-mono text-text-secondary mb-1">Source</p>
              <p className="text-xs font-mono text-accent break-all">{signal.source_url}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-text-secondary mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="muted">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {topics.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-text-secondary mb-1">Topics</p>
              <div className="flex flex-wrap gap-1">
                {topics.map((topic: string) => (
                  <Badge key={topic} variant="default">{topic}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <Textarea
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your notes on this signal..."
            />
            <div className="flex justify-end mt-1">
              <Button size="sm" variant="ghost" onClick={handleSaveNotes} disabled={saving}>
                {saving ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t border-border">
            <Button size="sm" variant="danger" onClick={handleDismiss}>
              Dismiss
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={onClose}>
                Close
              </Button>
              {signal.status !== "converted" && (
                <Button size="sm" variant="accent" onClick={() => setShowConvert(true)}>
                  Convert to Opportunity
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
      {showConvert && (
        <ConvertToOpportunityModal
          signal={signal}
          open={showConvert}
          onClose={() => {
            setShowConvert(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
