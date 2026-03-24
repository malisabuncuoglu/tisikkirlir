import { db } from "@/lib/db";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ReportExportButton } from "@/components/reports/report-export";
import Link from "next/link";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = db.select().from(reports).where(eq(reports.id, id)).get();
  if (!report) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/reports"
          className="text-xs font-mono text-text-secondary hover:text-text-primary"
        >
          &larr; Reports
        </Link>
        {report.content_markdown && (
          <ReportExportButton
            content={report.content_markdown}
            title={report.title || "report"}
          />
        )}
      </div>

      <Card className="mb-4">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-mono font-bold text-text-primary">
                {report.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="muted">{report.report_type}</Badge>
                <span className="text-[10px] text-text-secondary font-mono">
                  {report.period_start
                    ? new Date(report.period_start).toLocaleDateString()
                    : "—"}{" "}
                  &mdash;{" "}
                  {report.period_end
                    ? new Date(report.period_end).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {report.content_markdown ? (
            <MarkdownRenderer content={report.content_markdown} />
          ) : (
            <p className="text-xs font-mono text-text-secondary text-center py-8">
              No content.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
