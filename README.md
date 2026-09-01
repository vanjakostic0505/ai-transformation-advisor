# AI Transformation Advisor — Interactive Prototype

A clickable product prototype for a **ValueShore** advisory experience: an evidence-led AI opportunity and discovery tool.

> **Design Your AI Operating Model**
> Understand where AI could transform your workforce, processes and operations — and see the assumptions behind every figure, so the highest-value opportunities can be validated rather than assumed.

This is a **prototype**, not a production platform. There is no backend, no authentication, no LLM calls and no real integrations.

It is also, deliberately, **not an automated business case**. Every output is labelled as indicative, every euro figure shows its arithmetic, and the interface is explicit that production follows discovery, a validated business case and a controlled pilot.

---

## The commercial journey it sits at the front of

```
Self-assessment → Indicative opportunity map → Expert validation
  → AI Value Discovery Sprint → Business case → Transformation roadmap
  → Controlled pilot → Implementation → Measurement and scale
```

This tool covers the **first two stages only**, and says so on the landing page, in the journey rail and on the roadmap.

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
| `npm run verify` | Headless walk-through of the entire journey plus the arithmetic; fails on any console error |

Requires Node 20.19+ (Vite 8).

---

## The value model

**No euro figure in this product is typed in by hand.** Every one is computed in `src/engine/valueModel.ts` from named drivers that the user can see and change.

```
annual hours in scope
  transaction basis : volume per month × 12 × minutes per item ÷ 60
  time-share basis  : people × hours per week × 46 working weeks

annual hours saved
  = hours in scope
    × addressable share       how much of the work AI could touch at all
    × time saving             how much of that time actually goes away
    × adoption                how much of it gets used in practice
    × (1 − rework adjustment) verification and correction overhead

point estimate  = hours saved × loaded hourly cost
published range = point ± uncertainty band, rounded to the nearest €5K
```

The multiplicative chain is the point. Four individually optimistic-looking factors compound into a conservative one, which is why these figures are smaller than the ones usually quoted.

### Provenance and confidence

Every driver carries one of three labels, shown beside it in the interface:

| Label | Meaning |
| --- | --- |
| **From your answers** | Taken directly from what the user entered |
| **Illustrative assumption** | A sector default supplied so the model can run at all |
| **Requires validation** | An operational fact that can only be established by measurement |

Confidence is capped at **"higher"** and can never be "high". Completing a questionnaire cannot produce high confidence; only measured operational baselines can.

### Numbers reconcile — and `npm run verify` proves it

- The headline figure equals the **exact sum** of the high-priority opportunity ranges.
- Each worker concept's value equals the **exact sum** of the opportunities it would deliver.
- Adjusting any assumption cascades to the opportunity, the worker concept and the headline.
- The engine's output is checked against an independently written calculation in the test.

With the worked example loaded: **€490K–€745K** across six high-priority opportunities, **€400K–€605K** across four worker concepts, readiness **55/100**.

---

## The readiness model

Twelve dimensions across three groups — operational foundations; data, security and governance; organisation and delivery capacity.

**Manual workload is collected but scores zero.** A large amount of remaining manual work indicates a large *opportunity*; it is not evidence that an organisation is *ready*. Treating it as readiness — as an earlier four-question version did — inflated the score for exactly the companies least prepared to run a pilot. It is reported separately as an opportunity signal.

The output is not a single number. It is a score, plus the strongest factors, the most important gaps, what must be validated before a pilot, and one concrete next discovery action — with a "How this score was formed" panel explaining the arithmetic.

The scale runs 20–98. It cannot reach 100, because a questionnaire cannot establish readiness.

---

## Architecture

```
src/
  types/index.ts            Domain model, including provenance and confidence
  data/                     Fixtures: catalogs, demo company, opportunity seeds,
                            worker concepts, roadmap and delivery gates
  engine/
    valueModel.ts           The calculation. Pure, and independently testable
    advisorEngine.ts        deriveMap() — swap for real API calls
    smoothOperator.ts       packageWorkerForSmoothOperator() — swap for real API
  state/AdvisorProvider.tsx View routing, assessment state, field validation,
                            driver overrides
  components/
    ui/                     Button, Card, Field, Overlay, Evidence (status,
                            provenance, confidence, promise banner)
    assessment/             6 steps, progress rail, per-field validation
    dashboard/              Results header, readiness breakdown, advisory CTAs
    opportunities/          Map, row, detail panel, assumptions panel
    ai-workers/             Concept cards and detail panels
    roadmap/                8-stage journey, delivery gates, 90-day illustration
    smooth-operator/        Delivery section, handoff demo, placeholder screen
tests/journey.test.tsx      Full-journey walk-through and arithmetic checks
```

**No component imports a fixture.** They consume a `TransformationMap`, which only `advisorEngine.ts` produces. That is the seam for a real backend.

---

## What is mocked

| Area | Today | A real MVP would need |
| --- | --- | --- |
| Opportunity identification | Eight fixed seeds in `data/opportunities.ts` | LLM analysis over the assessment input plus industry benchmarks |
| Driver defaults | Illustrative sector assumptions | A benchmark library, ideally per industry and geography |
| Operational baselines | Marked "requires validation" and never faked | Connectors to Zendesk, Salesforce, SAP to pull real volumes |
| Readiness weights | Hand-set, documented in `data/catalogs.ts` | Calibration against actual pilot outcomes |
| Persistence | React state, lost on reload | `POST /api/assessments`, plus auth and a tenant model |
| Smooth Operator handoff | Animated, fake `SO-DRAFT-…` reference | `POST /v1/agents/draft` returning a real draft id and URL |
| Advisory CTAs | Explanatory modals | Scheduling or CRM integration |

---

## Accessibility

**Tested, by automated assertion and by inspection:**

- Colour contrast on all text tokens, computed rather than eyeballed. The two grey tones were 4.4:1 and 2.6:1; both were darkened to clear WCAG AA (4.5:1). Measured values are recorded in `src/index.css`.
- Form labels associated with their controls; errors wired via `aria-describedby` and `aria-invalid` and asserted in the test.
- Focus trapping in dialogs, Escape to close, and **focus returned to the triggering control** on close.
- Disabled buttons given a solid style rather than 40% opacity, so the label stays legible.
- Touch targets raised to 44px on the progress rail, close buttons, scale inputs and chip removal.
- A skip-to-content link, one `h1` per view, and a heading order checked by hand.
- `prefers-reduced-motion` honoured globally.
- Duplicate accessible names removed (two controls both named "Close" in one dialog).

**Not tested, and it would be wrong to claim otherwise:**

- No screen-reader testing with VoiceOver, NVDA or JAWS.
- No testing at 200% and 400% browser zoom.
- No automated axe or Lighthouse audit.
- Colour-blind simulation not run; priority and confidence are backed by text labels as well as colour, but this has not been verified with a simulator.

**This is not a claim of WCAG compliance.** It is a record of what was addressed. A specialist audit with assistive technology is still required.

---

## Responsive

Designed at 1440px. Structurally audited at 1024px and 375px: every fixed-width grid track sits behind a breakpoint, and all decorative overflow is inside clipped containers. Side panels become full-width sheets on mobile, the opportunity table collapses to stacked cards, the 90-day plan swaps positioned bars for full-width ones, and the header wordmark is hidden below 640px to prevent overflow.

**Visual confirmation on real devices has not been done** — the automated harness has no layout engine. Open the site at 375px and 1024px before showing it to anyone.
