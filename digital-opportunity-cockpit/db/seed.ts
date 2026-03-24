import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { v4 as uuid } from "uuid";
import * as schema from "./schema";
import path from "path";

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "cockpit.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

const now = new Date();
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const threeDAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

// Signals
const signal1Id = uuid();
const signal2Id = uuid();
const signal3Id = uuid();

db.insert(schema.signals).values([
  {
    id: signal1Id,
    title: "Reddit thread: SMBs struggling with invoice follow-ups",
    raw_content:
      "Multiple posts on r/smallbusiness about time wasted chasing late payments. Users mention wanting automated reminders that don't feel robotic. Current tools (QuickBooks, FreshBooks) have reminder features but they're too generic.",
    source_type: "reddit",
    source_url: "https://reddit.com/r/smallbusiness/example",
    captured_at: weekAgo,
    tags: JSON.stringify(["invoicing", "automation", "smb"]),
    topics: JSON.stringify(["payment collection", "accounts receivable"]),
    signal_strength: "strong",
    notes: "High engagement thread, 200+ comments. Real pain visible.",
    status: "reviewed",
    created_at: weekAgo,
    updated_at: weekAgo,
  },
  {
    id: signal2Id,
    title: "ProductHunt: 3 AI meeting summarizers launched this week",
    raw_content:
      "Three separate AI meeting summarizer tools launched on ProductHunt within 5 days. All got 200+ upvotes. Market is clearly hot but getting crowded fast.",
    source_type: "producthunt",
    captured_at: threeDAgo,
    tags: JSON.stringify(["ai", "meetings", "productivity"]),
    topics: JSON.stringify(["meeting notes", "ai assistants"]),
    signal_strength: "medium",
    notes: "Crowded space. Differentiation would need to be very sharp.",
    status: "reviewed",
    created_at: threeDAgo,
    updated_at: threeDAgo,
  },
  {
    id: signal3Id,
    title: "X thread: Freelancers want better proposal generation",
    raw_content:
      "Popular thread by @freelancetips about how creating client proposals takes 2-3 hours. Many replies agreeing. Some mention using ChatGPT but say it's too generic. Want something that knows their business.",
    source_type: "x",
    captured_at: now,
    tags: JSON.stringify(["freelance", "proposals", "ai"]),
    topics: JSON.stringify(["proposal generation", "freelancer tools"]),
    signal_strength: "strong",
    status: "raw",
    created_at: now,
    updated_at: now,
  },
]).run();

// Opportunities
const opp1Id = uuid();
const opp2Id = uuid();

db.insert(schema.opportunities).values([
  {
    id: opp1Id,
    title: "Smart Invoice Follow-up Agent for SMBs",
    short_description:
      "AI-powered invoice reminder system that crafts personalized follow-up messages based on client relationship, payment history, and invoice amount. Not just reminders — intelligent collection.",
    linked_signal_ids: JSON.stringify([signal1Id]),
    category: "saas",
    target_user: "Small business owners and freelancers with 10-100 invoices/month",
    best_format: "Web app with email integration",
    best_wedge: "QuickBooks/Xero integration — plug into existing workflow",
    monetization_model: "Subscription: $29/mo starter, $79/mo pro",
    distribution_angle: "Accounting software marketplace listings + content marketing around 'get paid faster'",
    risks: JSON.stringify([
      "QuickBooks might build this natively",
      "Low switching cost if competitor emerges",
      "SMBs are price sensitive",
    ]),
    score_total: 72,
    verdict: "explore",
    founder_fit_notes: "Good fit — clear problem, integrations are buildable solo, recurring revenue.",
    status: "scored",
    created_at: weekAgo,
    updated_at: now,
  },
  {
    id: opp2Id,
    title: "AI Proposal Writer for Freelancers",
    short_description:
      "Tool that learns from your past proposals, portfolio, and pricing to generate client-ready proposals in minutes instead of hours.",
    linked_signal_ids: JSON.stringify([signal3Id]),
    category: "ai_tool",
    target_user: "Freelance designers, developers, consultants billing $5k+ projects",
    best_format: "Web app + Chrome extension",
    best_wedge: "Import past proposals to 'train' — creates instant lock-in",
    monetization_model: "Freemium: 3 proposals/mo free, $19/mo unlimited",
    distribution_angle: "Freelancer communities (r/freelance, Twitter, Contra, Toptal blog)",
    risks: JSON.stringify([
      "Generic AI tools might be 'good enough'",
      "Hard to build moat around AI-generated text",
    ]),
    score_total: null,
    verdict: null,
    status: "raw",
    created_at: now,
    updated_at: now,
  },
]).run();

// Score for opportunity 1
db.insert(schema.opportunity_scores).values({
  id: uuid(),
  opportunity_id: opp1Id,
  pain_severity: 8,
  demand_visibility: 7,
  monetization_fit: 8,
  distribution_fit: 7,
  competitive_wedge: 6,
  mvp_feasibility: 8,
  retention_potential: 7,
  founder_fit: 7,
  weighted_total: 72,
  rationale: JSON.stringify({
    pain_severity: "Late payments are a universal SMB pain — visceral and frequent",
    demand_visibility: "Reddit threads, Quora questions, clear search volume",
    monetization_fit: "B2B SaaS with clear ROI story — tool pays for itself",
    distribution_fit: "Marketplace listings give initial distribution, SEO for long tail",
    competitive_wedge: "AI personalization is the wedge — current tools send generic reminders",
    mvp_feasibility: "Core loop is simple: connect invoice tool, generate follow-up, send",
    retention_potential: "Monthly billing cycle creates natural retention, but low switching cost",
    founder_fit: "Buildable solo, clear scope, domain is learnable",
  }),
  created_at: weekAgo,
}).run();

console.log("Seed data inserted successfully.");
console.log(`  - 3 signals: ${signal1Id}, ${signal2Id}, ${signal3Id}`);
console.log(`  - 2 opportunities: ${opp1Id}, ${opp2Id}`);
console.log(`  - 1 opportunity score for: ${opp1Id}`);

sqlite.close();
