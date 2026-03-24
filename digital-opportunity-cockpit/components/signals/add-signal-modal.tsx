"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createSignal } from "@/actions/signals";

export function AddSignalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="accent" size="md" onClick={() => setOpen(true)}>
        + Add Signal
      </Button>
      {open && (
        <Modal open={open} onClose={() => setOpen(false)} title="Add Signal">
          <AddSignalInline onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}

export function AddSignalInline({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const tagsRaw = (form.get("tags") as string) || "";
    const topicsRaw = (form.get("topics") as string) || "";

    try {
      await createSignal({
        title: form.get("title") as string,
        raw_content: form.get("raw_content") as string,
        source_type: form.get("source_type") as string,
        source_url: form.get("source_url") as string,
        signal_strength: form.get("signal_strength") as string,
        tags: tagsRaw
          ? JSON.stringify(tagsRaw.split(",").map((s) => s.trim()))
          : undefined,
        topics: topicsRaw
          ? JSON.stringify(topicsRaw.split(",").map((s) => s.trim()))
          : undefined,
        notes: form.get("notes") as string,
      });
      toast("Signal added");
    } catch {
      toast("Failed to add signal", "error");
    }

    setLoading(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="title" label="Title" required placeholder="What did you observe?" />
      <Textarea
        name="raw_content"
        label="Raw Content"
        placeholder="Full text, quote, or description..."
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          name="source_type"
          label="Source"
          options={[
            { value: "manual", label: "Manual" },
            { value: "reddit", label: "Reddit" },
            { value: "x", label: "X (Twitter)" },
            { value: "producthunt", label: "ProductHunt" },
            { value: "google", label: "Google" },
            { value: "appstore", label: "App Store" },
            { value: "other", label: "Other" },
          ]}
        />
        <Select
          name="signal_strength"
          label="Strength"
          options={[
            { value: "weak", label: "Weak" },
            { value: "medium", label: "Medium" },
            { value: "strong", label: "Strong" },
          ]}
        />
      </div>
      <Input name="source_url" label="Source URL" placeholder="https://..." />
      <Input name="tags" label="Tags" placeholder="tag1, tag2, tag3 (comma-separated)" />
      <Input
        name="topics"
        label="Topics"
        placeholder="topic1, topic2 (comma-separated)"
      />
      <Textarea name="notes" label="Notes" placeholder="Your initial thoughts..." />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? "Saving..." : "Add Signal"}
        </Button>
      </div>
    </form>
  );
}
