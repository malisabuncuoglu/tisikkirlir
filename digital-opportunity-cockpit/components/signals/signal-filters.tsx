"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, Input } from "@/components/ui/input";

export function SignalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/signals?${params.toString()}`);
  }

  return (
    <div className="flex items-end gap-3 mb-4">
      <Input
        label="Search"
        placeholder="Search signals..."
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => {
          // Debounce-like: update on blur or enter
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateFilter("search", (e.target as HTMLInputElement).value);
          }
        }}
        onBlur={(e) => updateFilter("search", e.target.value)}
      />
      <Select
        label="Source"
        value={searchParams.get("source_type") || "all"}
        onChange={(e) => updateFilter("source_type", e.target.value)}
        options={[
          { value: "all", label: "All Sources" },
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
        label="Strength"
        value={searchParams.get("signal_strength") || "all"}
        onChange={(e) => updateFilter("signal_strength", e.target.value)}
        options={[
          { value: "all", label: "All Strengths" },
          { value: "weak", label: "Weak" },
          { value: "medium", label: "Medium" },
          { value: "strong", label: "Strong" },
        ]}
      />
      <Select
        label="Status"
        value={searchParams.get("status") || "all"}
        onChange={(e) => updateFilter("status", e.target.value)}
        options={[
          { value: "all", label: "All Statuses" },
          { value: "raw", label: "Raw" },
          { value: "reviewed", label: "Reviewed" },
          { value: "converted", label: "Converted" },
          { value: "dismissed", label: "Dismissed" },
        ]}
      />
    </div>
  );
}
