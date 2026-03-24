"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { convertToOpportunity } from "@/actions/signals";
import type { Signal } from "@/db/schema";

interface Props {
  signal: Signal;
  open: boolean;
  onClose: () => void;
}

export function ConvertToOpportunityModal({ signal, open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await convertToOpportunity(signal.id, {
      title: form.get("title") as string,
      category: form.get("category") as string,
      short_description: form.get("short_description") as string,
    });
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Convert to Opportunity">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="title"
          label="Opportunity Title"
          required
          defaultValue={signal.title}
        />
        <Select
          name="category"
          label="Category"
          options={[
            { value: "saas", label: "SaaS" },
            { value: "ai_tool", label: "AI Tool" },
            { value: "mobile_app", label: "Mobile App" },
            { value: "web_app", label: "Web App" },
            { value: "api_service", label: "API Service" },
            { value: "productized_service", label: "Productized Service" },
            { value: "other", label: "Other" },
          ]}
        />
        <Textarea
          name="short_description"
          label="Short Description"
          defaultValue={signal.raw_content?.slice(0, 200) || ""}
          placeholder="Brief description of the opportunity..."
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? "Converting..." : "Convert"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
