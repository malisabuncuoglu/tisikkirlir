"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { createOpportunity } from "@/actions/opportunities";

export function AddOpportunityButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="accent" size="md" onClick={() => setOpen(true)}>
        + New Opportunity
      </Button>
      {open && (
        <Modal open={open} onClose={() => setOpen(false)} title="New Opportunity">
          <AddOpportunityForm onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}

function AddOpportunityForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await createOpportunity({
      title: form.get("title") as string,
      short_description: form.get("short_description") as string,
      category: form.get("category") as string,
      target_user: form.get("target_user") as string,
      best_format: form.get("best_format") as string,
      monetization_model: form.get("monetization_model") as string,
    });
    setLoading(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="title" label="Title" required placeholder="Opportunity name" />
      <Textarea
        name="short_description"
        label="Description"
        placeholder="What's the opportunity?"
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
      <Input name="target_user" label="Target User" placeholder="Who is this for?" />
      <Input name="best_format" label="Best Format" placeholder="Web app, API, etc." />
      <Input
        name="monetization_model"
        label="Monetization"
        placeholder="Subscription, credits, etc."
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
