import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const signals = sqliteTable("signals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  raw_content: text("raw_content"),
  source_type: text("source_type", {
    enum: ["manual", "reddit", "x", "producthunt", "google", "appstore", "other"],
  }).default("manual"),
  source_url: text("source_url"),
  captured_at: integer("captured_at", { mode: "timestamp" }),
  tags: text("tags"), // JSON array
  topics: text("topics"), // JSON array
  signal_strength: text("signal_strength", {
    enum: ["weak", "medium", "strong"],
  }).default("medium"),
  notes: text("notes"),
  status: text("status", {
    enum: ["raw", "reviewed", "converted", "dismissed"],
  }).default("raw"),
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const opportunities = sqliteTable("opportunities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  short_description: text("short_description"),
  linked_signal_ids: text("linked_signal_ids"), // JSON array
  category: text("category", {
    enum: ["saas", "ai_tool", "mobile_app", "web_app", "api_service", "productized_service", "other"],
  }),
  target_user: text("target_user"),
  best_format: text("best_format"),
  best_wedge: text("best_wedge"),
  monetization_model: text("monetization_model"),
  distribution_angle: text("distribution_angle"),
  risks: text("risks"), // JSON array
  score_total: real("score_total"),
  verdict: text("verdict", {
    enum: ["ignore", "watchlist", "explore", "build_thesis"],
  }),
  founder_fit_notes: text("founder_fit_notes"),
  status: text("status", {
    enum: ["raw", "filtered", "scored", "deep_dive", "prep_doc", "prd_candidate", "killed", "archived"],
  }).default("raw"),
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const opportunity_scores = sqliteTable("opportunity_scores", {
  id: text("id").primaryKey(),
  opportunity_id: text("opportunity_id").references(() => opportunities.id),
  pain_severity: real("pain_severity"),
  demand_visibility: real("demand_visibility"),
  monetization_fit: real("monetization_fit"),
  distribution_fit: real("distribution_fit"),
  competitive_wedge: real("competitive_wedge"),
  mvp_feasibility: real("mvp_feasibility"),
  retention_potential: real("retention_potential"),
  founder_fit: real("founder_fit"),
  weighted_total: real("weighted_total"),
  rationale: text("rationale"), // JSON object
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const deep_dives = sqliteTable("deep_dives", {
  id: text("id").primaryKey(),
  opportunity_id: text("opportunity_id").references(() => opportunities.id),
  content_markdown: text("content_markdown"),
  version: integer("version").default(1),
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const prep_docs = sqliteTable("prep_docs", {
  id: text("id").primaryKey(),
  opportunity_id: text("opportunity_id").references(() => opportunities.id),
  content_markdown: text("content_markdown"),
  completeness_score: real("completeness_score"),
  version: integer("version").default(1),
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const prds = sqliteTable("prds", {
  id: text("id").primaryKey(),
  opportunity_id: text("opportunity_id").references(() => opportunities.id),
  content_markdown: text("content_markdown"),
  version: integer("version").default(1),
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  title: text("title"),
  report_type: text("report_type", {
    enum: ["weekly", "deep_dive", "custom"],
  }),
  period_start: integer("period_start", { mode: "timestamp" }),
  period_end: integer("period_end", { mode: "timestamp" }),
  opportunity_ids: text("opportunity_ids"), // JSON array
  content_markdown: text("content_markdown"),
  created_at: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// Type exports
export type Signal = typeof signals.$inferSelect;
export type NewSignal = typeof signals.$inferInsert;
export type Opportunity = typeof opportunities.$inferSelect;
export type NewOpportunity = typeof opportunities.$inferInsert;
export type OpportunityScore = typeof opportunity_scores.$inferSelect;
export type NewOpportunityScore = typeof opportunity_scores.$inferInsert;
export type DeepDive = typeof deep_dives.$inferSelect;
export type PrepDoc = typeof prep_docs.$inferSelect;
export type PRD = typeof prds.$inferSelect;
export type Report = typeof reports.$inferSelect;
