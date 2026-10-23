# Landing Editorial Cut Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose ORYNEO's landing into a shorter, clearer buying journey without changing commercial rules or checkout behavior.

**Architecture:** Keep static `index.html` and `assets/commercial.js`. Replace illustrative hero/acquisition/operation chapters with a typographic hero and concise benefits; retain the pricing selector and move consultative contact to existing `/comecar/`.

**Tech Stack:** HTML, CSS, browser JavaScript, Node test runner, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-23-landing-editorial-cut-design.md`

## Global Constraints

- Brand master/Inter/approved colors only; no fabricated product screens or claims.
- Preserve exact pricing, tiers, setup, add-on rules and URLs from `assets/commercial.js`.
- No real request, order or payment during QA.

## Review Focus

- Monthly/annual switch keeps price and billing labels consistent.
- Direct contract action carries only allowed commercial parameters and UTMs.
- Consultative CTA preserves the `/comecar/` route.
- Mobile at 320 px does not overflow or conceal terms.
- Removed sections do not leave dead nav anchors or JavaScript errors.

---

### Task 1: Editorial structure and routing

**Files:** Modify `index.html`, `tests/landing-journey.test.mjs`, `tests/commercial-links.test.mjs`.

**Interfaces:** Existing `buildCommercialUrl` and `buildDirectCheckoutUrl` remain unchanged.

- [ ] Add tests for the visible section sequence, no simulated conversations/frames, consultative route, and checkout CTAs.
- [ ] Run focused tests and observe RED.
- [ ] Replace redundant presentation markup, adjust navigation and remove obsolete tab scripts.
- [ ] Run focused tests and full suite to GREEN.

### Task 2: Visual system and responsive QA

**Files:** Modify `index.html` CSS and tests as needed.

**Interfaces:** Preserve current IDs/data attributes used by commercial JavaScript.

- [ ] Add tests for important visible commercial disclosures and brand-safe visual affordances; observe RED where applicable.
- [ ] Implement new desktop/mobile layout without pill buttons or nested fake interfaces.
- [ ] Run tests; inspect 1280, 390 and 320 px, scroll length and overflow.

### Task 3: Release verification

**Files:** Release notes only if needed.

- [ ] Re-run full Node suite and read output.
- [ ] Verify checkout URL/form links without submitting data or generating a payment.
- [ ] Compare Git diff against catalogue/integrations and obtain independent review if permitted.
- [ ] Publish through the authorized GitHub flow and compare commit/Pages response before claiming completion.
