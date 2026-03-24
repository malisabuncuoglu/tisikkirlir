import type { Opportunity, DeepDive } from "@/db/schema";

export function buildPrepDocPrompt({
  opportunity,
  deepDive,
}: {
  opportunity: Opportunity;
  deepDive?: DeepDive | null;
}): string {
  return `Create a comprehensive Preparation Document for this opportunity. This is the document I'll use before deciding to build.

## OPPORTUNITY
**Title:** ${opportunity.title}
**Category:** ${opportunity.category || "Not specified"}
**Description:** ${opportunity.short_description || "No description"}
**Target User:** ${opportunity.target_user || "Not specified"}
**Monetization Model:** ${opportunity.monetization_model || "Not specified"}
**Distribution Angle:** ${opportunity.distribution_angle || "Not specified"}

${deepDive?.content_markdown ? `## DEEP DIVE ANALYSIS\n${deepDive.content_markdown}` : ""}

---

Fill ALL sections below. Be specific, actionable, and commercially serious. No fluff.

# PREPARATION DOCUMENT: ${opportunity.title}

## 1. EXECUTIVE SUMMARY
2-3 sentences. What is this, who is it for, and why should I build it?

## 2. PROBLEM DEFINITION
- The core pain point (one sentence)
- Who experiences this pain (specific personas)
- Current workarounds and their inadequacies
- Cost of the problem (time, money, frustration)

## 3. SOLUTION OVERVIEW
- What we're building (one paragraph)
- How it solves the problem differently
- Key differentiator vs. alternatives

## 4. TARGET MARKET
- Primary segment (specific, not "everyone")
- Market size estimate (TAM/SAM/SOM — rough is fine)
- User personas (2-3 detailed)

## 5. COMPETITIVE ANALYSIS
| Competitor | Strengths | Weaknesses | Our Advantage |
|-----------|-----------|------------|---------------|
(at least 3 competitors)

## 6. BUSINESS MODEL
- Revenue model (subscription/credits/one-time)
- Pricing tiers
- Unit economics estimate
- Path to $10k MRR
- Path to $50k MRR

## 7. GO-TO-MARKET STRATEGY
- Launch strategy (first 100 users)
- Growth strategy (100 → 1,000 users)
- Scale strategy (1,000+ users)
- Marketing channels ranked by expected ROI

## 8. TECHNICAL ARCHITECTURE
- Stack recommendation
- Key technical decisions
- Build vs. buy decisions
- Infrastructure needs
- Third-party dependencies

## 9. MVP FEATURE SET
| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
(P0 = must have, P1 = should have, P2 = nice to have)

## 10. DEVELOPMENT TIMELINE
- Week 1-2: ...
- Week 3-4: ...
- Month 2: ...
- Month 3: ...

## 11. RISKS & MITIGATIONS
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
(at least 5 risks)

## 12. VALIDATION PLAN
Before building, test these hypotheses:
1. ...
2. ...
3. ...
(Include method and success criteria for each)

## 13. SUCCESS METRICS
- Week 1 metrics
- Month 1 metrics
- Month 3 metrics
- Month 6 metrics

## 14. DECISION
**Go / No-Go / Need More Data**
Rationale:

> "Bu yalnızca ilginç mi, yoksa gerçekten ekmek yenir mi?"`;
}
