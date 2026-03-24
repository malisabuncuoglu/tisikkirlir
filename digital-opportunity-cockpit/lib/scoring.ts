export const SCORE_WEIGHTS = {
  pain_severity: 0.18,
  demand_visibility: 0.14,
  monetization_fit: 0.16,
  distribution_fit: 0.14,
  competitive_wedge: 0.12,
  mvp_feasibility: 0.10,
  retention_potential: 0.08,
  founder_fit: 0.08,
} as const;

export type ScoreDimension = keyof typeof SCORE_WEIGHTS;

export const SCORE_LABELS: Record<ScoreDimension, string> = {
  pain_severity: "Pain Severity",
  demand_visibility: "Demand Visibility",
  monetization_fit: "Monetization Fit",
  distribution_fit: "Distribution Fit",
  competitive_wedge: "Competitive Wedge",
  mvp_feasibility: "MVP Feasibility",
  retention_potential: "Retention Potential",
  founder_fit: "Founder Fit",
};

export type Verdict = "ignore" | "watchlist" | "explore" | "build_thesis";

export function calculateWeightedScore(scores: Record<ScoreDimension, number>): number {
  let total = 0;
  for (const [dim, weight] of Object.entries(SCORE_WEIGHTS)) {
    total += (scores[dim as ScoreDimension] || 0) * weight;
  }
  // Scale to 0-100
  return Math.round(total * 10);
}

export function getVerdict(score: number): Verdict {
  if (score >= 80) return "build_thesis";
  if (score >= 65) return "explore";
  if (score >= 50) return "watchlist";
  return "ignore";
}

export function getVerdictColor(verdict: Verdict | string | null): string {
  switch (verdict) {
    case "build_thesis":
      return "text-accent";
    case "explore":
      return "text-success";
    case "watchlist":
      return "text-warning";
    case "ignore":
      return "text-danger";
    default:
      return "text-text-secondary";
  }
}

export function getScoreColor(score: number | null): string {
  if (score == null) return "text-text-secondary";
  if (score >= 80) return "text-accent";
  if (score >= 65) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}
