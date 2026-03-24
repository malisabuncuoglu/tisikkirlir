"use server";

import { db } from "@/lib/db";
import { opportunities } from "@/db/schema";
import { eq, desc, and, sql, or } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import type { Opportunity, NewOpportunity } from "@/db/schema";

export interface OpportunityFilters {
  category?: string;
  verdict?: string;
  status?: string;
  scoreMin?: number;
  scoreMax?: number;
}

export async function createOpportunity(data: {
  title: string;
  short_description?: string;
  category?: string;
  target_user?: string;
  best_format?: string;
  best_wedge?: string;
  monetization_model?: string;
  distribution_angle?: string;
}): Promise<Opportunity> {
  const id = uuid();
  const now = new Date();
  db.insert(opportunities)
    .values({
      id,
      title: data.title,
      short_description: data.short_description || null,
      category: (data.category as NewOpportunity["category"]) || null,
      target_user: data.target_user || null,
      best_format: data.best_format || null,
      best_wedge: data.best_wedge || null,
      monetization_model: data.monetization_model || null,
      distribution_angle: data.distribution_angle || null,
      status: "raw",
      created_at: now,
      updated_at: now,
    })
    .run();
  revalidatePath("/opportunities");
  revalidatePath("/");
  return db.select().from(opportunities).where(eq(opportunities.id, id)).get()!;
}

export async function updateOpportunity(
  id: string,
  data: Partial<{
    title: string;
    short_description: string;
    category: string;
    target_user: string;
    best_format: string;
    best_wedge: string;
    monetization_model: string;
    distribution_angle: string;
    risks: string;
    founder_fit_notes: string;
    linked_signal_ids: string;
    score_total: number;
    verdict: string;
    status: string;
  }>
): Promise<Opportunity> {
  db.update(opportunities)
    .set({ ...data, updated_at: new Date() } as Partial<NewOpportunity>)
    .where(eq(opportunities.id, id))
    .run();
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${id}`);
  revalidatePath("/");
  return db.select().from(opportunities).where(eq(opportunities.id, id)).get()!;
}

export async function updateStatus(id: string, status: string): Promise<void> {
  db.update(opportunities)
    .set({ status: status as NewOpportunity["status"], updated_at: new Date() })
    .where(eq(opportunities.id, id))
    .run();
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${id}`);
  revalidatePath("/");
}

export async function killOpportunity(id: string, reason?: string): Promise<void> {
  const updates: Partial<NewOpportunity> & { updated_at: Date } = {
    status: "killed",
    updated_at: new Date(),
  };
  if (reason) {
    updates.founder_fit_notes = reason;
  }
  db.update(opportunities)
    .set(updates)
    .where(eq(opportunities.id, id))
    .run();
  revalidatePath("/opportunities");
  revalidatePath("/archive");
  revalidatePath("/");
}

export async function archiveOpportunity(id: string): Promise<void> {
  db.update(opportunities)
    .set({ status: "archived", updated_at: new Date() } as Partial<NewOpportunity>)
    .where(eq(opportunities.id, id))
    .run();
  revalidatePath("/opportunities");
  revalidatePath("/archive");
  revalidatePath("/");
}

export async function restoreOpportunity(id: string): Promise<void> {
  db.update(opportunities)
    .set({ status: "raw", updated_at: new Date() } as Partial<NewOpportunity>)
    .where(eq(opportunities.id, id))
    .run();
  revalidatePath("/opportunities");
  revalidatePath("/archive");
  revalidatePath("/");
}

export async function getOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]> {
  const conditions = [];

  // Exclude killed and archived by default
  conditions.push(
    sql`${opportunities.status} != 'killed' AND ${opportunities.status} != 'archived'`
  );

  if (filters?.category && filters.category !== "all") {
    conditions.push(sql`${opportunities.category} = ${filters.category}`);
  }
  if (filters?.verdict && filters.verdict !== "all") {
    conditions.push(sql`${opportunities.verdict} = ${filters.verdict}`);
  }
  if (filters?.status && filters.status !== "all") {
    conditions.push(sql`${opportunities.status} = ${filters.status}`);
  }

  return db
    .select()
    .from(opportunities)
    .where(and(...conditions))
    .orderBy(desc(opportunities.score_total))
    .all();
}

export async function getOpportunity(id: string): Promise<Opportunity | undefined> {
  return db.select().from(opportunities).where(eq(opportunities.id, id)).get();
}

export async function getArchivedOpportunities(): Promise<Opportunity[]> {
  return db
    .select()
    .from(opportunities)
    .where(
      or(
        eq(opportunities.status, "killed"),
        eq(opportunities.status, "archived")
      )
    )
    .orderBy(desc(opportunities.updated_at))
    .all();
}
