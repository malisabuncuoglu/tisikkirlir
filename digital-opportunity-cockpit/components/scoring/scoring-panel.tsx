"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerdictBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { saveScore } from "@/actions/scoring";
import {
  SCORE_WEIGHTS,
  SCORE_LABELS,
  calculateWeightedScore,
  getVerdict,
  type ScoreDimension,
} from "@/lib/scoring";
import type { OpportunityScore } from "@/db/schema";

interface Props {
  opportunityId: string;
  existingScore: OpportunityScore | null | undefined;
}

export function ScoringPanel({ opportunityId, existingScore }: Props) {
  const [scores, setScores] = useState<Record<ScoreDimension, number>>({
    pain_severity: existingScore?.pain_severity ?? 5,
    demand_visibility: existingScore?.demand_visibility ?? 5,
    monetization_fit: existingScore?.monetization_fit ?? 5,
    distribution_fit: existingScore?.distribution_fit ?? 5,
    competitive_wedge: existingScore?.competitive_wedge ?? 5,
    mvp_feasibility: existingScore?.mvp_feasibility ?? 5,
    retention_potential: existingScore?.retention_potential ?? 5,
    founder_fit: existingScore?.founder_fit ?? 5,
  });

  const existingRationale = existingScore?.rationale
    ? JSON.parse(existingScore.rationale)
    : {};
  const [rationale, setRationale] = useState<Record<string, string>>(existingRationale);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const weightedTotal = calculateWeightedScore(scores);
  const verdict = getVerdict(weightedTotal);

  async function handleSave() {
    setSaving(true);
    try {
      await saveScore(opportunityId, { ...scores, rationale });
      toast("Scores saved");
    } catch {
      toast("Failed to save scores", "error");
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono font-semibold text-text-secondary">Scoring</h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-accent">{weightedTotal}</span>
            <VerdictBadge verdict={verdict} />
          </div>
        </div>

        <div className="space-y-4">
          {(Object.keys(SCORE_WEIGHTS) as ScoreDimension[]).map((dim) => (
            <div key={dim}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-text-secondary">
                  {SCORE_LABELS[dim]}{" "}
                  <span className="text-text-secondary/50">
                    ({(SCORE_WEIGHTS[dim] * 100).toFixed(0)}%)
                  </span>
                </label>
                <span className="text-xs font-mono text-text-primary font-bold">
                  {scores[dim]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={scores[dim]}
                onChange={(e) =>
                  setScores((prev) => ({ ...prev, [dim]: parseInt(e.target.value) }))
                }
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-accent"
              />
              <input
                type="text"
                value={rationale[dim] || ""}
                onChange={(e) =>
                  setRationale((prev) => ({ ...prev, [dim]: e.target.value }))
                }
                placeholder="Rationale..."
                className="w-full mt-1 bg-bg border border-border rounded px-2 py-1 text-[10px] font-mono text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent/30"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="accent" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Scores"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
