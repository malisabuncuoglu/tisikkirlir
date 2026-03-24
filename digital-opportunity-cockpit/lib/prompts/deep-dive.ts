import type { Opportunity, Signal } from "@/db/schema";

export function buildDeepDivePrompt({
  opportunity,
  signals,
}: {
  opportunity: Opportunity;
  signals: Signal[];
}): string {
  const signalContext = signals
    .map(
      (s) =>
        `- **${s.title}** (${s.source_type}, strength: ${s.signal_strength}): ${s.raw_content || "No content"}`
    )
    .join("\n");

  return `Analyze this digital opportunity through 10 critical lenses. Be skeptical, specific, and commercially honest.

## OPPORTUNITY
**Title:** ${opportunity.title}
**Category:** ${opportunity.category || "Not specified"}
**Description:** ${opportunity.short_description || "No description"}
**Target User:** ${opportunity.target_user || "Not specified"}
**Monetization Model:** ${opportunity.monetization_model || "Not specified"}
**Distribution Angle:** ${opportunity.distribution_angle || "Not specified"}

## LINKED SIGNALS
${signalContext || "No signals linked."}

---

Analyze through these 10 lenses:

### LENS 1 — PROBLEM REALITY CHECK
Is this a real problem people actively try to solve? Or is it a "nice-to-have"? Who suffers most? How do they currently cope? What's the cost of inaction?

### LENS 2 — DEMAND SIGNALS
What evidence exists that people want this? Search volume? Forum posts? Competitor revenue? App store reviews? Be specific about what signal types you see.

### LENS 3 — COMPETITIVE LANDSCAPE
Who else is playing here? What do they do well? What do they miss? Is there a gap or is the space saturated? Name actual competitors if you know them.

### LENS 4 — TIMING & TRENDS
Why now? What changed recently that makes this more viable? Is this a rising tide or a fading wave? Technology enablers? Regulatory changes? Cultural shifts?

### LENS 5 — MONETIZATION REALITY
Will people actually pay? How much? What model works? Can you reach $10k MRR with a realistic customer count? What's the LTV/CAC math look like?

### LENS 6 — DISTRIBUTION STRATEGY
How do you reach the first 100 users? The first 1,000? What channels work? Is there a built-in viral loop? Can you leverage existing platforms?

### LENS 7 — MVP SCOPE
What's the absolute minimum viable product? 3-5 core features max. What can be cut? What must be there day one? How long to build?

### LENS 8 — RETENTION & MOAT
What keeps users coming back? What switching costs exist? Can you build a data moat? Network effects? How sticky is this?

### LENS 9 — FOUNDER-MARKET FIT
Can a solo founder or tiny team build and operate this? What skills are needed? What's the operational burden? Any regulatory hurdles?

### LENS 10 — RISK INVENTORY
Top 5 risks ranked by severity. For each: likelihood, impact, and mitigation strategy.

---

### FINAL VERDICT

**Score Suggestion:** [0-100]
**Verdict:** [IGNORE | WATCHLIST | EXPLORE | BUILD THESIS]
**One-line summary:** [Your blunt, honest assessment]
**Key question to answer before proceeding:** [The single most important unknown]

> "Bu yalnızca ilginç mi, yoksa gerçekten ekmek yenir mi?"`;
}
