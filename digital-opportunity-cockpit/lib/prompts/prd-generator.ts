import type { Opportunity, PrepDoc } from "@/db/schema";

export function buildPRDPrompt({
  prepDoc,
  opportunity,
}: {
  prepDoc: PrepDoc;
  opportunity: Opportunity;
}): string {
  return `Generate a lean, commercial, solo-founder-friendly Product Requirements Document (PRD).

## CONTEXT
**Opportunity:** ${opportunity.title}
**Category:** ${opportunity.category || "Not specified"}
**Target User:** ${opportunity.target_user || "Not specified"}

## PREPARATION DOCUMENT
${prepDoc.content_markdown || "No prep doc available."}

---

Write the PRD with ALL 20 sections below. Keep it practical — this is for a solo founder or tiny team, not a corporate product org.

# PRD: ${opportunity.title}

## 1. DOCUMENT INFO
- Author: Solo Founder
- Status: Draft
- Last Updated: Today
- Version: 1.0

## 2. PRODUCT OVERVIEW
One paragraph. What are we building and why?

## 3. OBJECTIVES & KEY RESULTS
- O1: ...
  - KR1: ...
  - KR2: ...
- O2: ...
  - KR1: ...
  - KR2: ...

## 4. USER PERSONAS
Persona 1: [Name, role, pain, goal]
Persona 2: [Name, role, pain, goal]

## 5. USER STORIES
Format: As a [persona], I want to [action] so that [benefit].
(10-15 stories, grouped by priority)

## 6. FUNCTIONAL REQUIREMENTS
### 6.1 Core Features (P0 — Must Ship)
### 6.2 Important Features (P1 — Ship Soon After)
### 6.3 Nice-to-Have (P2 — Backlog)

## 7. NON-FUNCTIONAL REQUIREMENTS
- Performance targets
- Security requirements
- Scalability needs
- Accessibility basics

## 8. INFORMATION ARCHITECTURE
- Site map / app structure
- Navigation model
- Key user flows

## 9. DATA MODEL
Key entities and their relationships (simplified).

## 10. API DESIGN
Key endpoints or integrations needed.

## 11. TECH STACK RECOMMENDATION
- Frontend:
- Backend:
- Database:
- Hosting:
- Key libraries:

## 12. UI/UX GUIDELINES
- Design principles
- Component patterns
- Responsive strategy

## 13. AUTHENTICATION & AUTHORIZATION
- Auth method
- User roles (if any)
- Security considerations

## 14. THIRD-PARTY INTEGRATIONS
- Payment processing
- Email/notifications
- Analytics
- Other APIs

## 15. ANALYTICS & TRACKING
Key events to track from day one.

## 16. MONETIZATION IMPLEMENTATION
- Pricing page structure
- Payment flow
- Trial/freemium mechanics
- Upgrade triggers

## 17. LAUNCH CHECKLIST
Pre-launch, launch day, post-launch items.

## 18. DEVELOPMENT PHASES
- Phase 1 (MVP): Features + timeline
- Phase 2 (Growth): Features + timeline
- Phase 3 (Scale): Features + timeline

## 19. RISKS & DEPENDENCIES
Known risks and their impact on the build.

## 20. APPENDIX
Any additional notes, references, or resources.

---

Keep it actionable. Every section should help the builder make decisions, not just document them.`;
}
