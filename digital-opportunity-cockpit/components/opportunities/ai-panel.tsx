"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { useToast } from "@/components/ui/toast";
import { downloadMarkdown } from "@/lib/export";
import {
  generateDeepDive,
  generatePrepDoc,
  generatePRD,
} from "@/actions/generate";
import type { DeepDive, PrepDoc, PRD } from "@/db/schema";

interface AIPanelProps {
  opportunityId: string;
  opportunityTitle: string;
  deepDives: DeepDive[];
  prepDocs: PrepDoc[];
  prds: PRD[];
}

export function AIPanel({
  opportunityId,
  opportunityTitle,
  deepDives,
  prepDocs,
  prds,
}: AIPanelProps) {
  return (
    <div className="space-y-4">
      <DeepDiveSection
        opportunityId={opportunityId}
        opportunityTitle={opportunityTitle}
        deepDives={deepDives}
      />
      <PrepDocSection
        opportunityId={opportunityId}
        opportunityTitle={opportunityTitle}
        prepDocs={prepDocs}
      />
      <PRDSection
        opportunityId={opportunityId}
        opportunityTitle={opportunityTitle}
        prds={prds}
        hasPrepDoc={prepDocs.length > 0}
      />
    </div>
  );
}

function DeepDiveSection({
  opportunityId,
  opportunityTitle,
  deepDives,
}: {
  opportunityId: string;
  opportunityTitle: string;
  deepDives: DeepDive[];
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(
    deepDives[deepDives.length - 1]?.content_markdown || ""
  );
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generateDeepDive(opportunityId);
      setContent(result);
      toast("Deep dive generated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setError(msg);
      toast(msg, "error");
    }
    setLoading(false);
  }

  function handleExport() {
    downloadMarkdown(
      content,
      `deep-dive-${opportunityTitle.toLowerCase().replace(/\s+/g, "-")}.md`
    );
    toast("Exported as .md");
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-semibold text-text-secondary">Deep Dive</h2>
            {deepDives.length > 0 && <Badge variant="muted">v{deepDives.length}</Badge>}
          </div>
          <div className="flex gap-2">
            {content && (
              <Button size="sm" variant="ghost" onClick={handleExport}>
                Export .md
              </Button>
            )}
            <Button size="sm" variant="accent" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : deepDives.length > 0 ? "Regenerate" : "Generate Deep Dive"}
            </Button>
          </div>
        </div>
        {error && <p className="text-xs font-mono text-danger mb-2">{error}</p>}
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-xs font-mono text-text-secondary py-8 text-center">
            No deep dive yet. Click &quot;Generate Deep Dive&quot; to analyze this opportunity.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PrepDocSection({
  opportunityId,
  opportunityTitle,
  prepDocs,
}: {
  opportunityId: string;
  opportunityTitle: string;
  prepDocs: PrepDoc[];
}) {
  const latest = prepDocs[prepDocs.length - 1];
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(latest?.content_markdown || "");
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generatePrepDoc(opportunityId);
      setContent(result);
      toast("Prep doc generated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setError(msg);
      toast(msg, "error");
    }
    setLoading(false);
  }

  function handleExport() {
    downloadMarkdown(
      content,
      `prep-doc-${opportunityTitle.toLowerCase().replace(/\s+/g, "-")}.md`
    );
    toast("Exported as .md");
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-semibold text-text-secondary">Prep Doc</h2>
            {prepDocs.length > 0 && <Badge variant="muted">v{prepDocs.length}</Badge>}
            {latest?.completeness_score != null && (
              <Badge
                variant={
                  latest.completeness_score >= 80 ? "success" : latest.completeness_score >= 50 ? "warning" : "danger"
                }
              >
                {latest.completeness_score}% complete
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {content && (
              <Button size="sm" variant="ghost" onClick={handleExport}>
                Export .md
              </Button>
            )}
            <Button size="sm" variant="accent" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : prepDocs.length > 0 ? "Regenerate" : "Generate Prep Doc"}
            </Button>
          </div>
        </div>
        {error && <p className="text-xs font-mono text-danger mb-2">{error}</p>}
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-xs font-mono text-text-secondary py-8 text-center">
            No prep doc yet. Generate a deep dive first, then create the prep doc.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PRDSection({
  opportunityId,
  opportunityTitle,
  prds,
  hasPrepDoc,
}: {
  opportunityId: string;
  opportunityTitle: string;
  prds: PRD[];
  hasPrepDoc: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(prds[prds.length - 1]?.content_markdown || "");
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generatePRD(opportunityId);
      setContent(result);
      toast("PRD generated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setError(msg);
      toast(msg, "error");
    }
    setLoading(false);
  }

  function handleExport() {
    downloadMarkdown(
      content,
      `prd-${opportunityTitle.toLowerCase().replace(/\s+/g, "-")}.md`
    );
    toast("Exported as .md");
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-semibold text-text-secondary">PRD</h2>
            {prds.length > 0 && <Badge variant="muted">v{prds.length}</Badge>}
          </div>
          <div className="flex gap-2">
            {content && (
              <Button size="sm" variant="ghost" onClick={handleExport}>
                Export .md
              </Button>
            )}
            <Button size="sm" variant="accent" onClick={handleGenerate} disabled={loading || !hasPrepDoc}>
              {loading ? "Generating..." : prds.length > 0 ? "Regenerate PRD" : "Generate PRD"}
            </Button>
          </div>
        </div>
        {!hasPrepDoc && (
          <p className="text-xs font-mono text-warning mb-2">
            Generate a Prep Doc first before creating a PRD.
          </p>
        )}
        {error && <p className="text-xs font-mono text-danger mb-2">{error}</p>}
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-xs font-mono text-text-secondary py-8 text-center">
            No PRD yet. Complete the Prep Doc first, then generate the PRD.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
