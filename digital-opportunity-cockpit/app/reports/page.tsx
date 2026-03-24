import { db } from "@/lib/db";
import { reports, signals, opportunities } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenerateReportButton } from "@/components/reports/generate-report-modal";
import Link from "next/link";

export default function ReportsPage() {
  const allReports = db.select().from(reports).orderBy(desc(reports.created_at)).all();

  const allSignals = db.select().from(signals).orderBy(desc(signals.created_at)).all();
  const allOpps = db
    .select()
    .from(opportunities)
    .where(sql`${opportunities.status} != 'killed' AND ${opportunities.status} != 'archived'`)
    .all();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-mono font-bold text-text-primary">Reports</h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            {allReports.length} reports generated
          </p>
        </div>
        <GenerateReportButton signals={allSignals} opportunities={allOpps} />
      </div>

      {allReports.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-text-secondary font-mono text-center py-8">
              No reports generated yet. Click &quot;Generate Report&quot; to create your
              first weekly report.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allReports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="hover:border-text-secondary/30 transition-colors cursor-pointer mb-3">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-text-primary">
                        {report.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="muted">{report.report_type}</Badge>
                        <span className="text-[10px] text-text-secondary font-mono">
                          {report.created_at
                            ? new Date(report.created_at).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      {report.content_markdown && (
                        <p className="text-[10px] text-text-secondary font-mono mt-2 line-clamp-2">
                          {report.content_markdown.slice(0, 200)}...
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
