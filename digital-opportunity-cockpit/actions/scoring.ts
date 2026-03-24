"use server";

import { db } from "@/lib/db";
import { opportunity_scores, opportunities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import {
  calculateWeightedScore,
  getVerdict,
  type ScoreDimension,
} from "@/lib/scoring";

export interface ScoreInput {
  pain_severity: number;
  demand_visibility: number;
  monetization_fit: number;
  distribution_fit: number;
  competitive_wedge: number;
  mvp_feasibility: number;
  retention_potential: number;
  founder_fit: number;
  rationale?: Record<string, string>;
}

export async function saveScore(
  opportunityId: string,
  scores: ScoreInput
) {
  const weightedTotal = calculateWeightedScore(
    scores as Record<ScoreDimension, number>
  );
  const verdict = getVerdict(weightedTotal);

  // Check if score exists
  const existing = db
    .select()
    .from(opportunity_scores)
    .where(eq(opportunity_scores.opportunity_id, opportunityId))
    .get();

  if (existing) {
    db.update(opportunity_scores)
      .set({
        pain_severity: scores.pain_severity,
        demand_visibility: scores.demand_visibility,
        monetization_fit: scores.monetization_fit,
        distribution_fit: scores.distribution_fit,
        competitive_wedge: scores.competitive_wedge,
        mvp_feasibility: scores.mvp_feasibility,
        retention_potential: scores.retention_potential,
        founder_fit: scores.founder_fit,
        weighted_total: weightedTotal,
        rationale: scores.rationale ? JSON.stringify(scores.rationale) : null,
      })
      .where(eq(opportunity_scores.id, existing.id))
      .run();
  } else {
    db.insert(opportunity_scores)
      .values({
        id: uuid(),
        opportunity_id: opportunityId,
        pain_severity: scores.pain_severity,
        demand_visibility: scores.demand_visibility,
        monetization_fit: scores.monetization_fit,
        distribution_fit: scores.distribution_fit,
        competitive_wedge: scores.competitive_wedge,
        mvp_feasibility: scores.mvp_feasibility,
        retention_potential: scores.retention_potential,
        founder_fit: scores.founder_fit,
        weighted_total: weightedTotal,
        rationale: scores.rationale ? JSON.stringify(scores.rationale) : null,
        created_at: new Date(),
      })
      .run();
  }

  // Update opportunity score and verdict
  db.update(opportunities)
    .set({
      score_total: weightedTotal,
      verdict,
      status: "scored",
      updated_at: new Date(),
    })
    .where(eq(opportunities.id, opportunityId))
    .run();

  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath("/opportunities");
  revalidatePath("/");

  return { weightedTotal, verdict };
}

export async function getScore(opportunityId: string) {
  return db
    .select()
    .from(opportunity_scores)
    .where(eq(opportunity_scores.opportunity_id, opportunityId))
    .get();
}
