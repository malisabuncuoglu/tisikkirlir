import { db } from "@/lib/db";
import { signals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SignalStrength } from "@/components/signals/signal-strength";
import { SignalDetailActions } from "@/components/signals/signal-detail-actions";
import Link from "next/link";

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const signal = db.select().from(signals).where(eq(signals.id, id)).get();
  if (!signal) notFound();

  const tags = signal.tags ? JSON.parse(signal.tags) : [];
  const topics = signal.topics ? JSON.parse(signal.topics) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/signals"
          className="text-xs font-mono text-text-secondary hover:text-text-primary"
        >
          &larr; Signals
        </Link>
        <SignalDetailActions signal={signal} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — metadata */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent>
              <h1 className="text-sm font-mono font-bold text-text-primary mb-3">
                {signal.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="muted">{signal.source_type}</Badge>
                <SignalStrength strength={signal.signal_strength} />
                <Badge
                  variant={
                    signal.status === "raw"
                      ? "warning"
                      : signal.status === "converted"
                      ? "success"
                      : signal.status === "dismissed"
                      ? "danger"
                      : "default"
                  }
                >
                  {signal.status}
                </Badge>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {signal.source_url && (
                  <div>
                    <p className="text-text-secondary">Source URL</p>
                    <p className="text-accent break-all mt-0.5">{signal.source_url}</p>
                  </div>
                )}
                <div>
                  <p className="text-text-secondary">Captured</p>
                  <p className="text-text-primary mt-0.5">
                    {signal.captured_at
                      ? new Date(signal.captured_at).toLocaleString()
                      : signal.created_at
                      ? new Date(signal.created_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {tags.length > 0 && (
            <Card>
              <CardContent>
                <p className="text-xs font-mono text-text-secondary mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag: string) => (
                    <Badge key={tag} variant="muted">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {topics.length > 0 && (
            <Card>
              <CardContent>
                <p className="text-xs font-mono text-text-secondary mb-2">Topics</p>
                <div className="flex flex-wrap gap-1">
                  {topics.map((topic: string) => (
                    <Badge key={topic} variant="default">{topic}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — content */}
        <div className="md:col-span-2 space-y-4">
          {signal.raw_content && (
            <Card>
              <CardContent>
                <h2 className="text-xs font-mono font-semibold text-text-secondary mb-2">
                  Raw Content
                </h2>
                <div className="bg-bg border border-border rounded p-4 text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed">
                  {signal.raw_content}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <h2 className="text-xs font-mono font-semibold text-text-secondary mb-2">
                Notes
              </h2>
              {signal.notes ? (
                <p className="text-xs font-mono text-text-primary whitespace-pre-wrap">
                  {signal.notes}
                </p>
              ) : (
                <p className="text-xs font-mono text-text-secondary italic">
                  No notes yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
