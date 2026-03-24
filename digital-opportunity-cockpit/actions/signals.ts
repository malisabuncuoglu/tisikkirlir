"use server";

import { db } from "@/lib/db";
import { signals, opportunities } from "@/db/schema";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import type { Signal, NewSignal } from "@/db/schema";

export interface SignalFilters {
  source_type?: string;
  signal_strength?: string;
  status?: string;
  search?: string;
}

export async function createSignal(data: {
  title: string;
  raw_content?: string;
  source_type?: string;
  source_url?: string;
  signal_strength?: string;
  tags?: string;
  topics?: string;
  notes?: string;
}): Promise<Signal> {
  const id = uuid();
  const now = new Date();
  db.insert(signals)
    .values({
      id,
      title: data.title,
      raw_content: data.raw_content || null,
      source_type: (data.source_type as NewSignal["source_type"]) || "manual",
      source_url: data.source_url || null,
      captured_at: now,
      tags: data.tags || null,
      topics: data.topics || null,
      signal_strength:
        (data.signal_strength as NewSignal["signal_strength"]) || "medium",
      notes: data.notes || null,
      status: "raw",
      created_at: now,
      updated_at: now,
    })
    .run();
  revalidatePath("/signals");
  revalidatePath("/");
  return db.select().from(signals).where(eq(signals.id, id)).get()!;
}

export async function updateSignal(
  id: string,
  data: Partial<{
    title: string;
    raw_content: string;
    source_type: string;
    source_url: string;
    signal_strength: string;
    tags: string;
    topics: string;
    notes: string;
    status: string;
  }>
): Promise<Signal> {
  db.update(signals)
    .set({ ...data, updated_at: new Date() } as Partial<NewSignal>)
    .where(eq(signals.id, id))
    .run();
  revalidatePath("/signals");
  revalidatePath("/");
  return db.select().from(signals).where(eq(signals.id, id)).get()!;
}

export async function deleteSignal(id: string): Promise<void> {
  db.delete(signals).where(eq(signals.id, id)).run();
  revalidatePath("/signals");
  revalidatePath("/");
}

export async function dismissSignal(id: string): Promise<void> {
  db.update(signals)
    .set({ status: "dismissed", updated_at: new Date() })
    .where(eq(signals.id, id))
    .run();
  revalidatePath("/signals");
  revalidatePath("/");
}

export async function convertToOpportunity(
  signalId: string,
  data: {
    title: string;
    category?: string;
    short_description?: string;
  }
) {
  const signal = db.select().from(signals).where(eq(signals.id, signalId)).get();
  if (!signal) throw new Error("Signal not found");

  const oppId = uuid();
  const now = new Date();
  db.insert(opportunities)
    .values({
      id: oppId,
      title: data.title,
      short_description: data.short_description || signal.raw_content?.slice(0, 200) || null,
      linked_signal_ids: JSON.stringify([signalId]),
      category: (data.category as "saas" | "ai_tool" | "mobile_app" | "web_app" | "api_service" | "productized_service" | "other") || null,
      status: "raw",
      created_at: now,
      updated_at: now,
    })
    .run();

  db.update(signals)
    .set({ status: "converted", updated_at: now })
    .where(eq(signals.id, signalId))
    .run();

  revalidatePath("/signals");
  revalidatePath("/opportunities");
  revalidatePath("/");
  return { id: oppId };
}

export async function getSignals(filters?: SignalFilters): Promise<Signal[]> {
  const conditions = [];

  if (filters?.source_type && filters.source_type !== "all") {
    conditions.push(sql`${signals.source_type} = ${filters.source_type}`);
  }
  if (filters?.signal_strength && filters.signal_strength !== "all") {
    conditions.push(sql`${signals.signal_strength} = ${filters.signal_strength}`);
  }
  if (filters?.status && filters.status !== "all") {
    conditions.push(sql`${signals.status} = ${filters.status}`);
  }
  if (filters?.search) {
    conditions.push(sql`${signals.title} LIKE ${'%' + filters.search + '%'}`);
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(signals)
      .where(and(...conditions))
      .orderBy(desc(signals.created_at))
      .all();
  }

  return db.select().from(signals).orderBy(desc(signals.created_at)).all();
}

export async function getSignal(id: string): Promise<Signal | undefined> {
  return db.select().from(signals).where(eq(signals.id, id)).get();
}
