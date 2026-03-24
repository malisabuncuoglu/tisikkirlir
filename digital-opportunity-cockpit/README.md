# Digital Opportunity Cockpit

A personal founder research agent and opportunity scoring engine. Internal tool for detecting, filtering, scoring, and prioritizing digital business opportunities.

**Not a SaaS. Not a product. A founder's workbench.**

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** SQLite via better-sqlite3 + Drizzle ORM
- **AI:** Anthropic Claude API (claude-sonnet-4-5)
- **Styling:** Tailwind CSS (dark workbench theme)
- **Export:** Markdown (.md) downloads

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 3. Initialize database
npx drizzle-kit push

# 4. Seed demo data (optional)
npx tsx db/seed.ts

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes (for AI features) |
| `DATABASE_PATH` | Path to SQLite database file | No (defaults to `./db/cockpit.db`) |

## Features

### Signals Inbox
Capture market signals from Reddit, X, ProductHunt, Google, App Store, or manual entry. Filter by source, strength, status. Convert signals to opportunities or dismiss them.

### Opportunities
Full lifecycle management: create, filter, score, deep dive, prep doc, PRD candidate. Kill or archive opportunities. Restore from archive.

### Scoring Engine
8-dimension weighted scoring system:
- Pain Severity (18%)
- Monetization Fit (16%)
- Demand Visibility (14%)
- Distribution Fit (14%)
- Competitive Wedge (12%)
- MVP Feasibility (10%)
- Retention Potential (8%)
- Founder Fit (8%)

Verdicts: **BUILD THESIS** (80+) | **EXPLORE** (65-79) | **WATCHLIST** (50-64) | **IGNORE** (<50)

### AI Generation
All powered by Claude API:
- **Deep Dive:** 10-lens analysis of an opportunity
- **Prep Doc:** Comprehensive preparation document (14 sections)
- **PRD:** Full product requirements document (20 sections)
- **Weekly Report:** Signal summary, opportunity ranking, founder memo

### Export
All generated content can be exported as `.md` files.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Cmd+K` | Quick add signal |
| `1` | Go to Dashboard |
| `2` | Go to Signals |
| `3` | Go to Opportunities |
| `4` | Go to Reports |
| `5` | Go to Archive |
| `?` | Show shortcuts help |

## Project Structure

```
app/                    Next.js pages (App Router)
  signals/              Signals inbox + detail
  opportunities/        Opportunity list + detail
  reports/              Reports list + detail
  archive/              Killed/archived opportunities
actions/                Server Actions (CRUD + AI generation)
components/             React components
  ui/                   Primitives (button, badge, card, modal, etc.)
  signals/              Signal-specific components
  opportunities/        Opportunity-specific components
  scoring/              Scoring panel
  reports/              Report generation modal
db/
  schema.ts             Drizzle ORM schema (7 tables)
  seed.ts               Demo data seeder
lib/
  db.ts                 Database singleton
  scoring.ts            Weighted scoring engine
  anthropic.ts          AI client + system prompt
  export.ts             Markdown export utility
  prompts/              AI prompt builders
```

## Design

Dark workbench aesthetic. Every pixel serves a decision. No marketing, no fluff.

- Background: `#0a0a0a`
- Accent: `#e8ff47` (signal yellow)
- Monospace-first typography

---

> "Bana internetin gurultusunu degil, kucuk ekipli ve satilabilir dijital is firsatlarini getir."
