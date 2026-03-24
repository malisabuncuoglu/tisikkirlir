"use server";

import { db } from "@/lib/db";
import {
  opportunities,
  signals,
  deep_dives,
  prep_docs,
  prds,
  reports,
} from "@/db/schema";
import { eq, inArray, and, gte, lte } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { anthropic, SYSTEM_PROMPT, AI_MODEL } from "@/lib/anthropic";
import { buildDeepDivePrompt } from "@/lib/prompts/deep-dive";
import { buildPrepDocPrompt } from "@/lib/prompts/prep-doc";
import { buildPRDPrompt } from "@/lib/prompts/prd-generator";
import { buildWeeklyReportPrompt } from "@/lib/prompts/weekly-report";

export async function generateDeepDive(opportunityId: string): Promise<string> {
  const opp = db
    .select()
    .from(opportunities)
    .where(eq(opportunities.id, opportunityId))
    .get();
  if (!opp) throw new Error("Opportunity not found");

  const linkedIds = opp.linked_signal_ids
    ? JSON.parse(opp.linked_signal_ids)
    : [];
  const linkedSignals =
    linkedIds.length > 0
      ? db.select().from(signals).where(inArray(signals.id, linkedIds)).all()
      : [];

  const prompt = buildDeepDivePrompt({
    opportunity: opp,
    signals: linkedSignals,
  });

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Get current version count
  const existing = db
    .select()
    .from(deep_dives)
    .where(eq(deep_dives.opportunity_id, opportunityId))
    .all();

  db.insert(deep_dives)
    .values({
      id: uuid(),
      opportunity_id: opportunityId,
      content_markdown: content,
      version: existing.length + 1,
      created_at: new Date(),
    })
    .run();

  // Update status
  db.update(opportunities)
    .set({ status: "deep_dive", updated_at: new Date() })
    .where(eq(opportunities.id, opportunityId))
    .run();

  revalidatePath(`/opportunities/${opportunityId}`);
  return content;
}

export async function generatePrepDoc(opportunityId: string): Promise<string> {
  const opp = db
    .select()
    .from(opportunities)
    .where(eq(opportunities.id, opportunityId))
    .get();
  if (!opp) throw new Error("Opportunity not found");

  const latestDeepDive = db
    .select()
    .from(deep_dives)
    .where(eq(deep_dives.opportunity_id, opportunityId))
    .all()
    .pop();

  const prompt = buildPrepDocPrompt({
    opportunity: opp,
    deepDive: latestDeepDive,
  });

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Calculate completeness (check for section headers)
  const sections = [
    "EXECUTIVE SUMMARY",
    "PROBLEM DEFINITION",
    "SOLUTION OVERVIEW",
    "TARGET MARKET",
    "COMPETITIVE ANALYSIS",
    "BUSINESS MODEL",
    "GO-TO-MARKET",
    "TECHNICAL ARCHITECTURE",
    "MVP FEATURE",
    "DEVELOPMENT TIMELINE",
    "RISKS",
    "VALIDATION PLAN",
    "SUCCESS METRICS",
    "DECISION",
  ];
  const filledSections = sections.filter((s) =>
    content.toUpperCase().includes(s)
  );
  const completeness = Math.round(
    (filledSections.length / sections.length) * 100
  );

  const existing = db
    .select()
    .from(prep_docs)
    .where(eq(prep_docs.opportunity_id, opportunityId))
    .all();

  db.insert(prep_docs)
    .values({
      id: uuid(),
      opportunity_id: opportunityId,
      content_markdown: content,
      completeness_score: completeness,
      version: existing.length + 1,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .run();

  db.update(opportunities)
    .set({ status: "prep_doc", updated_at: new Date() })
    .where(eq(opportunities.id, opportunityId))
    .run();

  revalidatePath(`/opportunities/${opportunityId}`);
  return content;
}

export async function generatePRD(opportunityId: string): Promise<string> {
  const opp = db
    .select()
    .from(opportunities)
    .where(eq(opportunities.id, opportunityId))
    .get();
  if (!opp) throw new Error("Opportunity not found");

  const latestPrepDoc = db
    .select()
    .from(prep_docs)
    .where(eq(prep_docs.opportunity_id, opportunityId))
    .all()
    .pop();

  if (!latestPrepDoc) throw new Error("No prep doc found. Generate one first.");

  const prompt = buildPRDPrompt({
    prepDoc: latestPrepDoc,
    opportunity: opp,
  });

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";

  const existing = db
    .select()
    .from(prds)
    .where(eq(prds.opportunity_id, opportunityId))
    .all();

  db.insert(prds)
    .values({
      id: uuid(),
      opportunity_id: opportunityId,
      content_markdown: content,
      version: existing.length + 1,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .run();

  db.update(opportunities)
    .set({ status: "prd_candidate", updated_at: new Date() })
    .where(eq(opportunities.id, opportunityId))
    .run();

  revalidatePath(`/opportunities/${opportunityId}`);
  return content;
}

export async function generateWeeklyReport(params: {
  signalIds: string[];
  opportunityIds: string[];
  periodStart: string;
  periodEnd: string;
  title: string;
}): Promise<string> {
  const selectedSignals =
    params.signalIds.length > 0
      ? db
          .select()
          .from(signals)
          .where(inArray(signals.id, params.signalIds))
          .all()
      : [];

  const selectedOpps =
    params.opportunityIds.length > 0
      ? db
          .select()
          .from(opportunities)
          .where(inArray(opportunities.id, params.opportunityIds))
          .all()
      : [];

  const dateRange = `${params.periodStart} to ${params.periodEnd}`;
  const prompt = buildWeeklyReportPrompt({
    signals: selectedSignals,
    opportunities: selectedOpps,
    dateRange,
  });

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";

  db.insert(reports)
    .values({
      id: uuid(),
      title: params.title || `Weekly Report — ${dateRange}`,
      report_type: "weekly",
      period_start: new Date(params.periodStart),
      period_end: new Date(params.periodEnd),
      opportunity_ids: JSON.stringify(params.opportunityIds),
      content_markdown: content,
      created_at: new Date(),
    })
    .run();

  revalidatePath("/reports");
  revalidatePath("/");
  return content;
}

export async function getDeepDives(opportunityId: string) {
  return db
    .select()
    .from(deep_dives)
    .where(eq(deep_dives.opportunity_id, opportunityId))
    .all();
}

export async function getPrepDocs(opportunityId: string) {
  return db
    .select()
    .from(prep_docs)
    .where(eq(prep_docs.opportunity_id, opportunityId))
    .all();
}

export async function getPRDs(opportunityId: string) {
  return db
    .select()
    .from(prds)
    .where(eq(prds.opportunity_id, opportunityId))
    .all();
}
