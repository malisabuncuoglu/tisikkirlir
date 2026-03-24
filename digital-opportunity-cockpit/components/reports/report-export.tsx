"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { downloadMarkdown } from "@/lib/export";

export function ReportExportButton({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  const { toast } = useToast();

  function handleExport() {
    downloadMarkdown(content, `${title.toLowerCase().replace(/\s+/g, "-")}.md`);
    toast("Exported as .md");
  }

  return (
    <Button size="sm" variant="ghost" onClick={handleExport}>
      Export .md
    </Button>
  );
}
