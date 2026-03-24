import type { Signal, Opportunity } from "@/db/schema";

export function buildWeeklyReportPrompt({
  signals,
  opportunities,
  dateRange,
}: {
  signals: Signal[];
  opportunities: Opportunity[];
  dateRange: string;
}): string {
  const signalList = signals
    .map(
      (s) =>
        `- **${s.title}** (source: ${s.source_type}, strength: ${s.signal_strength}, status: ${s.status})\n  Content: ${s.raw_content?.slice(0, 200) || "N/A"}\n  Notes: ${s.notes || "None"}`
    )
    .join("\n\n");

  const oppList = opportunities
    .map(
      (o) =>
        `- **${o.title}** (category: ${o.category}, score: ${o.score_total ?? "unscored"}, verdict: ${o.verdict || "none"}, status: ${o.status})\n  Description: ${o.short_description || "N/A"}\n  Target: ${o.target_user || "N/A"}\n  Monetization: ${o.monetization_model || "N/A"}`
    )
    .join("\n\n");

  return `Generate a weekly Digital Opportunity Cockpit report based on the data below.

## PERIOD: ${dateRange}

## SIGNALS (${signals.length} total)
${signalList || "No signals this period."}

## OPPORTUNITIES (${opportunities.length} total)
${oppList || "No opportunities tracked."}

---

Generate the report in EXACTLY this format:

## DIGITAL OPPORTUNITY COCKPIT — WEEKLY REPORT
Period: ${dateRange}

---

### PART 1 — TOP SIGNALS DETECTED

For each signal (up to 10), analyze:
- What's happening
- Commercial importance
- User type affected
- Strength assessment: WEAK | MEDIUM | STRONG

---

### PART 2 — TOP OPPORTUNITY AREAS

For each opportunity area (up to 5), analyze:
- Problem statement
- Target user
- Current alternatives
- Why now
- Monetization model
- Distribution channel
- Red flags
- Score: X/10

---

### PART 3 — THIS WEEK'S BEST 3 BETS

For each bet:
- Best entry wedge
- Positioning
- First 5 MVP features
- Avoid in V1
- Top 3 risks
- 3 validation tests
- Verdict: BUILD | WATCH | SKIP

---

### PART 4 — FOUNDER MEMO

Write a blunt, no-BS memo:
- What to focus on this week
- What to ignore
- Fake excitement alert (hype without substance)
- Real small business opportunity (if any)

End with: "Bu yalnızca ilginç mi, yoksa gerçekten ekmek yenir mi?"`;
}
