import { db } from "@/lib/db";
import {
  opportunities,
  opportunity_scores,
  signals,
  deep_dives,
  prep_docs,
  prds,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { VerdictBadge, CategoryBadge, StatusBadge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { KillButton, ArchiveButton } from "@/components/opportunities/opportunity-actions";
import { ScoringPanel } from "@/components/scoring/scoring-panel";
import { AIPanel } from "@/components/opportunities/ai-panel";
import Link from "next/link";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = db.select().from(opportunities).where(eq(opportunities.id, id)).get();
  if (!opp) notFound();

  const score = db
    .select()
    .from(opportunity_scores)
    .where(eq(opportunity_scores.opportunity_id, id))
    .get();

  const risks = opp.risks ? JSON.parse(opp.risks) : [];
  const linkedSignalIds = opp.linked_signal_ids
    ? JSON.parse(opp.linked_signal_ids)
    : [];

  const linkedSignals =
    linkedSignalIds.length > 0
      ? db.select().from(signals).where(inArray(signals.id, linkedSignalIds)).all()
      : [];

  const allDeepDives = db
    .select()
    .from(deep_dives)
    .where(eq(deep_dives.opportunity_id, id))
    .all();

  const allPrepDocs = db
    .select()
    .from(prep_docs)
    .where(eq(prep_docs.opportunity_id, id))
    .all();

  const allPRDs = db
    .select()
    .from(prds)
    .where(eq(prds.opportunity_id, id))
    .all();

  const statusSteps = ["raw", "filtered", "scored", "deep_dive", "prep_doc", "prd_candidate"];
  const currentStepIdx = statusSteps.indexOf(opp.status || "raw");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/opportunities"
          className="text-xs font-mono text-text-secondary hover:text-text-primary"
        >
          &larr; Opportunities
        </Link>
        <div className="flex gap-2">
          <ArchiveButton id={id} />
          <KillButton id={id} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardContent>
              <h1 className="text-sm font-mono font-bold text-text-primary mb-3">
                {opp.title}
              </h1>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <CategoryBadge category={opp.category} />
                <VerdictBadge verdict={opp.verdict} />
                <StatusBadge status={opp.status} />
              </div>
              {opp.score_total != null && (
                <div className="mt-3">
                  <p className="text-3xl font-mono font-bold text-accent">
                    {Math.round(opp.score_total)}
                  </p>
                  <p className="text-[10px] font-mono text-text-secondary">
                    weighted score
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status stepper */}
          <Card>
            <CardContent>
              <p className="text-xs font-mono text-text-secondary mb-2">
                Status Pipeline
              </p>
              <div className="space-y-1">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        i <= currentStepIdx ? "bg-accent" : "bg-border"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-mono ${
                        i <= currentStepIdx ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {step.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Linked signals */}
          {linkedSignals.length > 0 && (
            <Card>
              <CardContent>
                <p className="text-xs font-mono text-text-secondary mb-2">
                  Linked Signals
                </p>
                <div className="space-y-1.5">
                  {linkedSignals.map((sig) => (
                    <div
                      key={sig.id}
                      className="text-[10px] font-mono text-text-primary bg-bg border border-border rounded px-2 py-1.5"
                    >
                      {sig.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Score breakdown */}
          {score && (
            <Card>
              <CardContent>
                <p className="text-xs font-mono text-text-secondary mb-3">
                  Score Breakdown
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Pain Severity", value: score.pain_severity },
                    { label: "Demand Visibility", value: score.demand_visibility },
                    { label: "Monetization Fit", value: score.monetization_fit },
                    { label: "Distribution Fit", value: score.distribution_fit },
                    { label: "Competitive Wedge", value: score.competitive_wedge },
                    { label: "MVP Feasibility", value: score.mvp_feasibility },
                    { label: "Retention Potential", value: score.retention_potential },
                    { label: "Founder Fit", value: score.founder_fit },
                  ].map((dim) => (
                    <div key={dim.label}>
                      <div className="flex justify-between text-[10px] font-mono mb-0.5">
                        <span className="text-text-secondary">{dim.label}</span>
                        <span className="text-text-primary">{dim.value ?? 0}/10</span>
                      </div>
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${((dim.value ?? 0) / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right panel */}
        <div className="col-span-2 space-y-4">
          {/* Overview */}
          <Card>
            <CardContent>
              <h2 className="text-xs font-mono font-semibold text-text-secondary mb-2">
                Overview
              </h2>
              {opp.short_description && (
                <p className="text-sm font-mono text-text-primary mb-4">
                  {opp.short_description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <p className="text-text-secondary">Target User</p>
                  <p className="text-text-primary mt-0.5">{opp.target_user || "—"}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Best Format</p>
                  <p className="text-text-primary mt-0.5">{opp.best_format || "—"}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Best Wedge</p>
                  <p className="text-text-primary mt-0.5">{opp.best_wedge || "—"}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Monetization</p>
                  <p className="text-text-primary mt-0.5">{opp.monetization_model || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-text-secondary">Distribution Angle</p>
                  <p className="text-text-primary mt-0.5">{opp.distribution_angle || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risks */}
          {risks.length > 0 && (
            <Card>
              <CardContent>
                <h2 className="text-xs font-mono font-semibold text-text-secondary mb-2">
                  Risks
                </h2>
                <ul className="space-y-1">
                  {risks.map((risk: string, i: number) => (
                    <li
                      key={i}
                      className="text-xs font-mono text-danger/80 flex items-start gap-2"
                    >
                      <span className="text-danger mt-0.5">!</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Scoring */}
          <ScoringPanel opportunityId={id} existingScore={score} />

          {/* AI Panel */}
          <AIPanel
            opportunityId={id}
            opportunityTitle={opp.title}
            deepDives={allDeepDives}
            prepDocs={allPrepDocs}
            prds={allPRDs}
          />

          {/* Founder fit notes */}
          {opp.founder_fit_notes && (
            <Card>
              <CardContent>
                <h2 className="text-xs font-mono font-semibold text-text-secondary mb-2">
                  Founder Fit Notes
                </h2>
                <p className="text-xs font-mono text-text-primary">
                  {opp.founder_fit_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
