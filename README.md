# Vitta — MCP-native NBFC lending assistant

**Amrita University MCP Hackathon 2026 · BFSI & FinTech track · Team: The Beetles**

One NitroStack-deployed MCP server that turns any MCP client (NitroChat, ChatGPT App, Claude) into an
NBFC loan officer: it takes a personal-loan prospect from *"hi"* to a signed sanction letter — autonomously,
and by the book. The **MCP client is the agent; this server is the capability layer.**

> **The consent gate is the product.** `pull_bureau` and `fetch_bank_statements` refuse to run
> (`{error:"CONSENT_REQUIRED", ...}`) without a valid, scoped, time-boxed consent token from `record_consent`.
> DPDP compliance expressed as code, tested before anything else.

## The golden path
```
qualify_lead → record_consent (issues consent_token) → verify_kyc → screen_fraud
→ pull_bureau ⚿ → fetch_bank_statements ⚿ → compute_affordability → underwrite
→ generate_offers → create_sanction_letter → log_audit_event / get_audit_trail
```
`⚿` = consent-gated. Every arrow is an MCP tool call chosen by the client.

## MCP primitives (all 3 — R10 needs 2)
- **14 Tools** — the 12 domain tools above + `revoke_consent` (DPDP withdrawal) + `health_check`.
- **5 Resources** — `policy://credit-policy/v1.7`, `catalog://products/personal-loan`, `ref://city-tiers`,
  `consent://templates`, `case://{lead_id}` (live application record).
- **5 Prompts** — `sales-playbook`, `underwriting-explainer`, `objection-handling`, `adverse-action-notice`,
  `kyc-consent-script`.

## Quickstart
```bash
npm install            # root + widget deps
npm run build          # → dist/ + src/widgets/out/  (verified clean)
npm start              # production server (dual transport: stdio + HTTP SSE)
# or
npm run dev            # stdio dev server; open the folder in NitroStudio to test visually
```
Testing / verification (all free, no platform credits):
```bash
npm test               # 23 unit + golden-path + consent tests (vitest)
npm run regress        # edge-path harness: paths A–F, prints PASS/FAIL
```

## Deterministic demo (no live uncertainty)
Seeds are keyed by **PAN last digit** and **mobile suffix** (see `mocks/*.json`):

| Story | PAN | Mobile | Outcome |
|---|---|---|---|
| APPROVE | `AAAPA1230A` (…0) | `9000000010` | APPROVE ₹3,00,000, 3 offers |
| **CONDITIONAL (demo)** | **`VITTA1235K`** (…5) | **`9876543222`** | CONDITIONAL ₹2,50,000 — "existing EMIs put FOIR at 57%" |
| DECLINE | `ZZZPZ1239Z` (…9) | any | DECLINE with adverse-action reasons |
| Fraud REVIEW | any | `…99` | screen_fraud → REVIEW (human handoff) |

## Architecture
- `src/lib/` — pure, deterministic engine: `consent.ts` (the gate), `scorecard.ts` (rules + pre-baked
  scorecard, **never trained ML**), `emi.ts`, `affordability.ts`, `offers.ts`, `sanction.ts`, `seeds.ts`,
  `redact.ts` (PII redaction on every audit event), `store.ts` (JSON-file persistence), `engine.ts`
  (golden-path orchestration).
- `src/tools/`, `src/resources/`, `src/prompts/` — thin NitroStack decorator wrappers over the engine, so
  **tool behavior and tested behavior are identical by construction.**
- Consent is enforced **inline** as the first line of each gated handler (NitroStack Guards cannot read tool
  input — a genuine platform finding, documented in [`docs/NITROSTACK_NOTES.md`](docs/NITROSTACK_NOTES.md)).

## Docs
- [`docs/NITROSTACK_NOTES.md`](docs/NITROSTACK_NOTES.md) — verified NitroStack SDK/CLI API notes (the only API truth).
- [`docs/SPEC.md`](docs/SPEC.md) — tool/resource/prompt contracts + policy.
- [`PLAN.md`](PLAN.md) — the 24-hour implementation plan. [`THIRD_PARTY.md`](THIRD_PARTY.md) — R12 disclosure.

Built with the NitroStack SDK/CLI (`@nitrostack/core`, `@nitrostack/cli`). All external data are synthetic
deterministic mocks — **no real bureau/AA/KYC APIs, no real PII, ever.**

---
NitroStack: [docs](https://docs.nitrostack.ai) · [studio](https://nitrostack.ai/studio) · [repo](https://github.com/nitrocloudofficial/nitrostack)
