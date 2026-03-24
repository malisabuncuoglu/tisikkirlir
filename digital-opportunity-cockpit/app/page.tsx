import { db } from "@/lib/db";
import { signals, opportunities } from "@/db/schema";
import { desc, eq, or, sql } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VerdictBadge, CategoryBadge } from "@/components/ui/badge";
import { SignalStrength } from "@/components/signals/signal-strength";
import Link from "next/link";

export default function Dashboard() {
  const openOpps = db
    .select({ count: sql<number>`count(*)` })
    .from(opportunities)
    .where(
      or(
        eq(opportunities.verdict, "explore"),
        eq(opportunities.verdict, "build_thesis")
      )
    )
    .get();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const signalsThisWeek = db
    .select({ count: sql<number>`count(*)` })
    .from(signals)
    .where(sql`${signals.created_at} >= ${weekAgo.getTime() / 1000}`)
    .get();

  const killedCount = db
    .select({ count: sql<number>`count(*)` })
    .from(opportunities)
    .where(eq(opportunities.status, "killed"))
    .get();

  const topOpps = db
    .select()
    .from(opportunities)
    .where(sql`${opportunities.status} != 'killed' AND ${opportunities.status} != 'archived'`)
    .orderBy(desc(opportunities.score_total))
    .limit(3)
    .all();

  const recentSignals = db
    .select()
    .from(signals)
    .orderBy(desc(signals.created_at))
    .limit(5)
    .all();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-mono font-bold text-text-primary">Dashboard</h1>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Opportunity tracking & signal monitoring
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-accent">
              {openOpps?.count ?? 0}
            </p>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Open Opportunities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-text-primary">
              {signalsThisWeek?.count ?? 0}
            </p>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Signals This Week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-danger">
              {killedCount?.count ?? 0}
            </p>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Killed Ideas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <div>
          <h2 className="text-sm font-mono font-semibold text-text-primary mb-3">
            Top Opportunities
          </h2>
          <div className="flex flex-col gap-3">
            {topOpps.length === 0 ? (
              <Card>
                <CardContent>
                  <p className="text-xs text-text-secondary font-mono">
                    No opportunities yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              topOpps.map((opp) => (
                <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                  <Card className="hover:border-text-secondary/30 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle>{opp.title}</CardTitle>
                        <span className="text-lg font-mono font-bold text-accent shrink-0">
                          {opp.score_total != null
                            ? Math.round(opp.score_total)
                            : "—"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={opp.category} />
                        <VerdictBadge verdict={opp.verdict} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Signals */}
        <div>
          <h2 className="text-sm font-mono font-semibold text-text-primary mb-3">
            Recent Signals
          </h2>
          <div className="flex flex-col gap-2">
            {recentSignals.length === 0 ? (
              <Card>
                <CardContent>
                  <p className="text-xs text-text-secondary font-mono">
                    No signals yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              recentSignals.map((sig) => (
                <Link key={sig.id} href={`/signals`}>
                  <Card className="hover:border-text-secondary/30 transition-colors cursor-pointer py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-text-primary truncate">
                          {sig.title}
                        </p>
                        <p className="text-[10px] font-mono text-text-secondary mt-0.5">
                          {sig.source_type} &middot;{" "}
                          {sig.created_at
                            ? new Date(sig.created_at).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                      <SignalStrength strength={sig.signal_strength} />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
