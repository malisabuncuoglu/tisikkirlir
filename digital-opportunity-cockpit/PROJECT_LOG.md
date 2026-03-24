# Digital Opportunity Cockpit — Project Log

**Last updated:** 2026-03-24
**Current phase:** COMPLETE
**Current task:** Done
**Overall status:** 100% complete

---

## Completed Tasks

### Phase 1 — Core Scaffold
- [x] 1.1 create-next-app — completed 2026-03-24
- [x] 1.2 Install dependencies — completed 2026-03-24
- [x] 1.3 Design token setup (dark workbench theme, CSS variables) — completed 2026-03-24
- [x] 1.4 Font setup (system monospace stack) — completed 2026-03-24
- [x] 1.5 Write full db/schema.ts (all 7 tables) — completed 2026-03-24
- [x] 1.6 Run initial migration (drizzle-kit push) — completed 2026-03-24
- [x] 1.7 Write lib/db.ts singleton — completed 2026-03-24
- [x] 1.8 Build layout: root layout + left sidebar navigation — completed 2026-03-24
- [x] 1.9 Build UI primitives: Button, Badge, Card, Modal, Tabs, Input, Textarea, Select — completed 2026-03-24
- [x] 1.10 Dashboard page (live data from db) — completed 2026-03-24
- [x] 1.11 Write db/seed.ts with 3 sample signals + 2 sample opportunities + 1 score — completed 2026-03-24
- [x] 1.12 All route pages created — completed 2026-03-24

### Phase 2 — Signals System
- [x] 2.1 actions/signals.ts — all CRUD actions — completed 2026-03-24
- [x] 2.2 Signals inbox page — table, filters, search — completed 2026-03-24
- [x] 2.3 Add signal modal — completed 2026-03-24
- [x] 2.4 Signal detail modal + dedicated detail page — completed 2026-03-24
- [x] 2.5 Convert signal to opportunity flow — completed 2026-03-24
- [x] 2.6 Dismiss signal action — completed 2026-03-24
- [x] 2.7 Signal strength indicator component (3-dot visual) — completed 2026-03-24
- [x] 2.8 Dashboard signal count + recent signals list (live from db) — completed 2026-03-24
- [x] 2.9 Update PROJECT_LOG.md — completed 2026-03-24

### Phase 3 — Opportunities System
- [x] 3.1 actions/opportunities.ts — all CRUD + lifecycle actions — completed 2026-03-24
- [x] 3.2 Opportunities list page — card grid — completed 2026-03-24
- [x] 3.3 New opportunity modal (manual entry) — completed 2026-03-24
- [x] 3.4 Opportunity detail page — layout (left panel + right panel) — completed 2026-03-24
- [x] 3.5 Overview section — all metadata — completed 2026-03-24
- [x] 3.6 Status stepper component — completed 2026-03-24
- [x] 3.7 Linked signals display — completed 2026-03-24
- [x] 3.8 Kill opportunity action (reason input, moves to archive) — completed 2026-03-24
- [x] 3.9 Archive page — completed 2026-03-24
- [x] 3.10 Restore from archive — completed 2026-03-24
- [x] 3.11 Dashboard top opportunities (live from db) — completed 2026-03-24
- [x] 3.12 Update PROJECT_LOG.md — completed 2026-03-24

### Phase 4 — Scoring Engine
- [x] 4.1 lib/scoring.ts — weights, calculator, verdict logic — completed 2026-03-24
- [x] 4.2 actions/scoring.ts — save, get, calculate — completed 2026-03-24
- [x] 4.3 Scoring panel in opportunity detail — 8-dimension sliders — completed 2026-03-24
- [x] 4.4 Rationale text field per dimension — completed 2026-03-24
- [x] 4.5 Auto-calculate weighted total on slider change — completed 2026-03-24
- [x] 4.6 Verdict badge auto-update — completed 2026-03-24
- [x] 4.7 Score breakdown bar chart component (pure CSS) — completed 2026-03-24
- [x] 4.8 Score displayed on opportunity cards — completed 2026-03-24
- [x] 4.9 Score color coding — completed 2026-03-24
- [x] 4.10 Update PROJECT_LOG.md — completed 2026-03-24

### Phase 5 — AI Deep Dive
- [x] 5.1 lib/anthropic.ts — client setup, system prompt — completed 2026-03-24
- [x] 5.2 lib/prompts/deep-dive.ts — prompt builder — completed 2026-03-24
- [x] 5.3 actions/generate.ts — generateDeepDive action — completed 2026-03-24
- [x] 5.4 Deep Dive section — generate button — completed 2026-03-24
- [x] 5.5 Markdown renderer component — completed 2026-03-24
- [x] 5.6 Save to deep_dives table — completed 2026-03-24
- [x] 5.7 Version history — completed 2026-03-24
- [x] 5.8 Export deep dive as .md — completed 2026-03-24
- [x] 5.9 Status auto-update — completed 2026-03-24
- [x] 5.10 Update PROJECT_LOG.md — completed 2026-03-24

### Phase 6 — Prep Doc + PRD
- [x] 6.1 lib/prompts/prep-doc.ts — prompt builder — completed 2026-03-24
- [x] 6.2 lib/prompts/prd-generator.ts — prompt builder — completed 2026-03-24
- [x] 6.3 Prep doc section — completed 2026-03-24
- [x] 6.4 Prep doc AI generation — completed 2026-03-24
- [x] 6.5 Completeness score — completed 2026-03-24
- [x] 6.6 PRD section — generate from prep doc — completed 2026-03-24
- [x] 6.7 PRD generation — completed 2026-03-24
- [x] 6.8 Version history for both — completed 2026-03-24
- [x] 6.9 Export prep doc as .md — completed 2026-03-24
- [x] 6.10 Export PRD as .md — completed 2026-03-24
- [x] 6.11 Status auto-update: prep_doc → prd_candidate — completed 2026-03-24
- [x] 6.12 Update PROJECT_LOG.md — completed 2026-03-24

### Phase 7 — Weekly Report
- [x] 7.1 lib/prompts/weekly-report.ts — prompt builder — completed 2026-03-24
- [x] 7.2 Reports page — list of past reports — completed 2026-03-24
- [x] 7.3 Generate report modal (date range, signal/opp selection) — completed 2026-03-24
- [x] 7.4 Report generation (save to reports table) — completed 2026-03-24
- [x] 7.5 Report detail page — full markdown render — completed 2026-03-24
- [x] 7.6 Export report as .md — completed 2026-03-24
- [x] 7.7 Dashboard report access — completed 2026-03-24
- [x] 7.8 Update PROJECT_LOG.md — completed 2026-03-24

### Phase 8 — Polish + README
- [x] 8.1 Mobile responsiveness (responsive sidebar, grid layouts, mobile card view) — completed 2026-03-24
- [x] 8.2 Empty states for all pages — completed 2026-03-24
- [x] 8.3 Loading states for all AI generation buttons — completed 2026-03-24
- [x] 8.4 Error states (AI fail — clear error messages) — completed 2026-03-24
- [x] 8.5 Keyboard shortcuts (Cmd+K quick add, 1-5 navigation, ? help) — completed 2026-03-24
- [x] 8.6 Toast notifications for all actions — completed 2026-03-24
- [x] 8.7 README.md — install, run, use guide — completed 2026-03-24
- [x] 8.8 .env.example — completed 2026-03-24
- [x] 8.9 Final PROJECT_LOG.md update — completed 2026-03-24
- [x] 8.10 DONE — completed 2026-03-24

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-24 | Used system monospace font stack instead of Google Fonts (Geist) | Google Fonts API returned 403 in build environment |
| 2026-03-24 | Non-streaming AI generation instead of streaming | Simpler implementation, save-on-complete pattern works well for single-user tool |
| 2026-03-24 | Used raw SQL for enum column filters | Drizzle ORM has type issues with nullable enum columns and `eq()` |
| 2026-03-24 | Inline AI panel instead of tabs | Keeps all content visible in a single scroll, better for deep work sessions |
| 2026-03-24 | Signal detail available both as modal (click) and full page (Cmd+click or /signals/[id]) | Flexibility: quick peek vs deep review |

---

## Known Issues

None. Project is complete.
