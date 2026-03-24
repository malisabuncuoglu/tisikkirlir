import { getOpportunities } from "@/actions/opportunities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VerdictBadge, CategoryBadge, StatusBadge } from "@/components/ui/badge";
import { AddOpportunityButton } from "@/components/opportunities/add-opportunity-modal";
import Link from "next/link";

export default async function OpportunitiesPage() {
  const allOpps = await getOpportunities();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-mono font-bold text-text-primary">
            Opportunities
          </h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            {allOpps.length} active opportunities
          </p>
        </div>
        <AddOpportunityButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allOpps.map((opp) => (
          <Link key={opp.id} href={`/opportunities/${opp.id}`}>
            <Card className="hover:border-text-secondary/30 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{opp.title}</CardTitle>
                  <span
                    className={`text-xl font-mono font-bold shrink-0 ${
                      opp.score_total != null && opp.score_total >= 80
                        ? "text-accent"
                        : opp.score_total != null && opp.score_total >= 65
                        ? "text-success"
                        : opp.score_total != null && opp.score_total >= 50
                        ? "text-warning"
                        : "text-text-secondary"
                    }`}
                  >
                    {opp.score_total != null ? Math.round(opp.score_total) : "—"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {opp.short_description && (
                  <p className="text-xs text-text-secondary font-mono line-clamp-2 mb-3">
                    {opp.short_description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-1.5">
                  <CategoryBadge category={opp.category} />
                  <VerdictBadge verdict={opp.verdict} />
                  <StatusBadge status={opp.status} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {allOpps.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-sm text-text-secondary font-mono">
              No opportunities yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
