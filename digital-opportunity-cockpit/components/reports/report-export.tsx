"use client";

import { Button } from "@/components/ui/button";
import { downloadMarkdown } from "@/lib/export";

export function ReportExportButton({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() =>
        downloadMarkdown(
          content,
          `${title.toLowerCase().replace(/\s+/g, "-")}.md`
        )
      }
    >
      Export .md
    </Button>
  );
}
