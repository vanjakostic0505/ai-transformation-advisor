# AI Transformation Advisor — Interactive Prototype

A clickable product prototype for a strategy-to-execution layer that sits above **Smooth Operator**.

> **Design Your AI Operating Model**
> Understand how AI can transform your workforce, processes and operations — then turn the highest-value opportunities into AI workers.

This is a **prototype**, not a production platform. There is no backend, no authentication, no LLM calls and no real integrations. Every number is a deterministic mock behind a clean interface, so the mocks can be swapped for real services without touching the UI.

---

## The journey it demonstrates

```
COMPANY → WORK → AI OPPORTUNITIES → BUSINESS VALUE
  → TARGET AI OPERATING MODEL → AI WORKFORCE
  → AGENT DEPLOYMENT → SMOOTH OPERATOR
```

End to end, a stakeholder can: fill in a six-step assessment → watch the analysis run → read a ranked opportunity map → open any opportunity → design the AI worker that delivers it → hand that worker to Smooth Operator → land on the Smooth Operator configuration screen → return to the map.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b` typecheck + production build |
| `npm run preview` | Serve the production build |
| `npm run verify` | Headless JSDOM walk-through of the **entire** journey; fails on any console error |

`npm run verify` is the fast regression guard. It clicks through all 34 checkpoints of the journey and asserts zero console errors.

Requires Node 20.19+ (Vite 8).

---

## Architecture

```
src/
  types/index.ts            Domain model — the contract between UI and data
  data/                     Mock fixtures (catalogs, demo company, opportunities,
                            workers, operating model, roadmap)
  engine/
    advisorEngine.ts        generateTransformationMap()  ← swap for real API
    smoothOperator.ts       packageWorkerForSmoothOperator() ← swap for real API
  state/AdvisorProvider.tsx Single source of truth: view routing + assessment state
  utils/                    Formatting, className helper
  components/
    ui/                     Button, Card, Badge, Field, SidePanel, Modal, …
    layout/                 TopBar, Footer, Logo
    landing/                Hero, JourneyRail, HowItWorks, Positioning
    assessment/             6 steps + progress rail + custom-entry control
    analysis/               Animated analysis screen
    dashboard/              ResultsHeader, ResultsPage
    opportunities/          Opportunity map, row, detail panel
    operating-model/        Current vs target comparison
    ai-workers/             Worker cards + detail panel
    smooth-operator/        Handoff modal + placeholder destination screen
    roadmap/                5-phase roadmap, 90-day plan, final CTA
tests/journey.test.tsx      Full-journey smoke test
```

**No component imports a fixture directly.** They consume `TransformationMap`, which only `advisorEngine.ts` produces. That is the seam for the real backend.

### Design system

Tailwind v4 with tokens defined in `src/index.css` under `@theme` — a deep petrol-navy brand, a teal accent reserved for affirmative/data states, and priority colours that are earthy rather than alarm-red. Type is Inter with tight display tracking. No component library, no icon dependency.

---

## What is mocked

| Area | Today | Real MVP would need |
| --- | --- | --- |
| Opportunity identification | Fixed fixture in `data/opportunities.ts` | LLM analysis over the assessment input + industry benchmarks |
| Value estimation | Hard-coded ranges | ROI engine: volumes × handling time × loaded cost, with confidence intervals |
| Readiness score | Weighted formula in `advisorEngine.ts` | Same formula is fine — calibrate weights against outcome data |
| AI worker recommendations | Fixed fixture in `data/workers.ts` | Capability catalogue matched to opportunity + system availability |
| Assessment persistence | React state, lost on reload | `POST /api/assessments`, plus auth and a tenant model |
| Smooth Operator handoff | `setTimeout` animation, fake `SO-DRAFT-…` reference | `POST /v1/agents/draft` returning a real draft id + redirect URL |
| "Open in Smooth Operator" | In-app placeholder screen | Redirect into the Smooth Operator workspace |
| "Book a workshop" | `window.alert` | Scheduling integration |

### Number integrity

The headline figures reconcile deliberately, because executives check them:

- The **six HIGH-priority opportunities sum to exactly €480K–€720K** — the dashboard headline.
- The **four recommended AI workers sum to €390K–€590K**, a stated subset, sequenced into the first wave.
- The **demo company's readiness score computes to 64/100** from its actual answers, not a hard-coded constant. Change an answer in step 6 and it moves.

Every monetary figure is a range, and every screen carrying one also carries the disclaimer: *illustrative estimate based on the information provided*.

---

## Positioning guardrails baked into the UI

The interface repeatedly states what this is not — another chatbot, an agent builder, a readiness assessment — and what it is: an advisor connecting business strategy, workforce design, measurable value and AI execution.

The operating-model section is explicit that headcount is unchanged: AI absorbs repeatable volume, people keep judgement, exceptions and the customer relationship. Every AI worker ships with named human approval points and evaluation criteria agreed before anything is built.

---

## Responsive

Designed at 1440px, verified down through 1024px and 375px. Side panels become full-width sheets on mobile; the opportunity table collapses to stacked cards; the 90-day plan swaps its positioned Gantt bars for full-width bars with inline date windows.
