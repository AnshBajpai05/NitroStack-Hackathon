# CLAUDE.md — Vitta (MCP lending server, Amrita MCP Hackathon 2026)

## What this project is
Vitta is an MCP server built on the **Nitrostack** platform (SDK + CLI) for the BFSI
track. It exposes an NBFC personal-loan origination workflow as MCP Tools,
Resources, and Prompts. The MCP client (NitroChat / Claude) is the agent; this
server is the capability layer. Deadline: 12:00 PM IST 18 July 2026.

## THE GOLDEN PATH (the only scope)
qualify_lead → record_consent (issues consent_token) → verify_kyc → screen_fraud
→ pull_bureau ⚿ → fetch_bank_statements ⚿ → compute_affordability → underwrite
→ generate_offers → create_sanction_letter → log_audit_event / get_audit_trail
⚿ = consent-gated: MUST return {error:"CONSENT_REQUIRED", hint:"..."} without a
valid token. This gate is the project's signature feature.

## Non-negotiable rules for Claude Code
1. NEVER invent Nitrostack SDK/CLI APIs from memory. The ONLY sources of truth are:
   `docs/NITROSTACK_NOTES.md` (Phase −1, every claim cited), the generated scaffold,
   CLI `--help`, and `.d.ts` in `node_modules/@nitrostack/*`. If an API you need is not
   there, STOP and say so — ask an on-site Nitrostack mentor. Do not guess.
   Key verified facts (see NITROSTACK_NOTES.md for citations):
   - Working CLI binary is `nitrostack-cli` (via `@nitrostack/core@1.0.13`,
     `@nitrostack/cli@1.0.14`). **There is NO `deploy` CLI command** — deploy is
     platform-side (dashboard: CLI · GitHub connect · package upload).
   - Decorators: `@Tool`/`@ToolDecorator`, `@Resource`, `@Prompt`, `@Widget`,
     `@Module`, `@McpApp`, `@HealthCheck`, `@UseGuards`, `@UseFilters`, `@Injectable`.
     Zod `inputSchema`. Entry: `McpApplicationFactory.create(AppModule)` → `.start()`.
   - **ExecutionContext carries NO tool input** (`requestId, toolName, logger,
     metadata, auth, task`). A Guard cannot read a `consent_token` tool arg →
     THE CONSENT GATE IS ENFORCED INLINE as the first line of each gated handler,
     not as a Guard. Guards stay for header/auth checks only.
2. Test-first for the consent gate. `tests/consent.test.ts` must exist and pass
   before any gated tool is written. Runner: **vitest** (scaffold ships none).
   Unit-test helpers from `@nitrostack/core/testing` (`createMockContext`, `MockLogger`).
3. All external data is deterministic mocks in `/mocks/*.json`, keyed by PAN
   last digit and mobile suffix. Never call real bureau/AA/KYC APIs. Never use
   real PII anywhere, including tests and fixtures.
4. Canonical tool name is `fetch_bank_statements` (NOT fetch_bank_stmts) everywhere.
5. Mock outcome mapping (canonical): PAN last digit 0–1 = APPROVE, 5–6 = CONDITIONAL,
   8–9 = DECLINE. Mobile suffix 00–33 = stable salaried, 34–66 = self-employed,
   67–99 = volatile. Demo pair: PAN `VITTA1235K` (→ CONDITIONAL), mobile `9876543222` (→ stable).
6. Every new library/dataset/API goes into THIRD_PARTY.md in the SAME commit (rule R12).
7. Keep it boring: plain TypeScript on the Nitrostack scaffold, in-memory stores
   persisted to `./data/*.json`. No databases, no ORMs, no extra frameworks (R15).
8. Decisioning is rules + a pre-baked scorecard + reason codes. NEVER trained ML.
9. Redact PII (PAN, mobile, name) in every audit payload before storage.
10. After the `freeze` tag, only fix bugs that break the golden path. No refactors.
11. Do not run a deploy yourself. The team controls prod. Never deploy after 11:00 AM IST 18 Jul.

## Commands (verified in this environment — see NITROSTACK_NOTES.md)
- scaffold: `npx @nitrostack/cli init vitta-lending --template typescript-starter`  (done)
- dev:   `npm run dev`   → stdio MCP + widget dev server (open folder in NitroStudio to test)
- build: `npm run build` → `dist/` + `src/widgets/out/` (verified: builds clean, 27.6s)
- start: `npm start`     → build + start prod server (port 3000, dual transport)
- test:  `npx vitest run` (add vitest in Phase 0)
- regress: `npm run regress` → scripts/regress (paths A–F)
- deploy: **platform-side only** — build locally, then GitHub-connect the repo or package-upload
          in the NitroCloud dashboard. Human/team-triggered (rule 11). See PLAN.md §6.

## Layout
src/tools/       one file per MCP tool (12 tools)
src/lib/         consent.ts, scorecard.ts, emi.ts, redact.ts, store.ts
src/resources/   5 MCP resources
src/prompts/     5 MCP prompt templates
mocks/           bureau_seed.json, bank_seed.json, kyc_seed.json, fraud_seed.json, city_tiers.json
tests/           consent.test.ts FIRST, then goldenpath.test.ts, tools/*.test.ts
scripts/         regress.ts, seed-demo.ts
docs/            NITROSTACK_NOTES.md, DEPLOY_LOG.md, SPEC.md

## Definition of done — every tool
- [ ] Input/output schema matches SPEC exactly
- [ ] 1–3 sentence natural-language description (judged under Technical Quality 25%)
- [ ] Gated tools: consent check is the FIRST statement in the handler
- [ ] Writes a redacted audit event via log_audit_event
- [ ] Deterministic against the mock seeds
- [ ] Unit test passing; golden-path test still green
- [ ] Committed with the phase's commit message

## Budget (Free plan): 3 apps · 3 chats · 5.0M Studio tokens · $0.50 NitroChat credits.
Test tool-by-tool in the nitro dev panel / NitroStudio (free), NOT via long agentic chats
(expensive). Reserve NitroChat runs for Phase 6 verification + demo recording. See PLAN.md §6.
