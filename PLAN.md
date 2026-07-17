# VITTA — FINAL IMPLEMENTATION PLAN (Claude Code Edition, v2.1)
### Amrita University MCP Hackathon 2026 · BFSI & FinTech Track · Team: The Beetles
### Hard deadline: 12:00 PM IST, 18 July 2026. Submit by 11:30 AM. No extensions.

> **v2.1 — Nitrostack-verified edition (17 Jul).** Synthesized from 4 sources: `brainstorm.md` (master prompt v1.0), *Vitta Hackathon Winning Plan v1.0* (PDF), the official *MCP Hackathon 2026* admin brief (PDF), and the live NitroStack workspace screenshot (Free plan: **3 apps · 3 chats · 5.0M Studio tokens · $0.50 NitroChat credits**).
>
> v2.0 changes vs the v1.0 master prompt: restructured into **discrete Claude Code sessions with acceptance gates**, added a **Phase −1 SDK Discovery step** (Claude Code must never guess Nitrostack APIs), added a full **deployment strategy** built around your Free-plan limits, standardized two naming/mock inconsistencies (see §10), and added a permanent `CLAUDE.md` so context survives across sessions.

---

## §0 · HOW TO USE THIS DOCUMENT WITH CLAUDE CODE

1. `git init` the repo, save this file as `PLAN.md` in the repo root.
2. Copy the block in **§1** verbatim into `CLAUDE.md` in the repo root. Claude Code reads `CLAUDE.md` automatically at the start of every session — it is your persistent memory.
3. Run **one Claude Code session per phase**. Paste the phase prompt (§5) as the opening message. Small, scoped sessions with verifiable gates beat one giant session: Claude Code performs best when it can run a command, see it pass, and commit.
4. After every green gate: `git add -A && git commit` with the message given in the phase. Tag every successful deploy.
5. Rule **R22** of the admin brief explicitly permits AI coding assistants (Claude, Copilot, Cursor) for *implementation*. The architecture and creative direction in this plan are the team's — Claude Code executes it. You are fully compliant.

**The one thing (unchanged from v1.0):** the consent gate is the product. `pull_bureau` and `fetch_bank_statements` must refuse to run without a valid, scoped, time-boxed consent token. Test it before anything else. Demo it clearly.

---

## §1 · `CLAUDE.md` — COPY THIS ENTIRE BLOCK INTO THE REPO ROOT

```markdown
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
1. NEVER invent Nitrostack SDK/CLI APIs from memory. Nitrostack is niche — your
   training data does not cover it. The ONLY sources of truth are:
   `docs/NITROSTACK_NOTES.md` (written in Phase −1), the generated scaffold,
   CLI --help output, type definitions in node_modules/@nitrostack/*, and the
   OFFICIAL docs (fetch these, quote them into NITROSTACK_NOTES.md):
   - https://docs.nitrostack.ai/getting-started and /quick-start
   - https://docs.nitrostack.ai/sdk/typescript/server-concepts
   - https://docs.nitrostack.ai/sdk/typescript/tools-guide
   - https://docs.nitrostack.ai/sdk/typescript/authentication-overview  ← guards
   - https://docs.nitrostack.ai/sdk/typescript/ui-widgets-guide
   - https://docs.nitrostack.ai/cli/introduction
   - https://docs.nitrostack.ai/deployment/checklist
   - https://github.com/nitrocloudofficial/nitrostack (official README)
   If an API you need is not in those, STOP and say so — the team will ask an
   on-site Nitrostack mentor. Do not guess.

## Verified SDK facts (from the official README, 17 Jul 2026 — re-verify versions in Phase −1)
- Packages: `@nitrostack/core` (decorators, DI, runtime), `@nitrostack/cli`
  (scaffold/dev/codegen), `@nitrostack/widgets` (React SDK for tool-output UIs).
  Open source, Apache 2.0. Node >= 20.18 required.
- All THREE primitives are decorator-defined: `@Tool({name, description,
  inputSchema: z.object({...})})` with Zod validation, plus resource and
  prompt decorators; app shape is `@McpApp({module, server:{name,version}})`
  + `@Module`.
- Middleware pipeline exists: `@UseGuards(...)`, interceptors, pipes,
  exception filters; JWT / OAuth 2.1 / API-key auth are built in.
  → THE CONSENT GATE IS A GUARD: implement `ConsentGuard` and apply
  `@UseGuards(ConsentGuard)` to pull_bureau and fetch_bank_statements. This is
  the platform-idiomatic pattern and scores directly on "Nitrostack platform
  usage" + "security considerations". (Fallback if guards can't shape the
  refusal payload: inline validConsent() as the handler's first line.)
- Widgets: `@Widget('widget-name')` decorator attaches a React component to a
  tool's output; NitroStudio previews widgets with hot reload.
- Scaffold: `npx @nitrostack/cli init <name>`; dev loop: `npm install &&
  npm run dev`. NitroStudio (desktop/web) opens the project folder, runs the
  dev server, and provides tool testing + an AI chat that uses YOUR OWN
  OpenAI/Gemini API key (stored locally) — i.e., free agentic testing that
  does not burn platform tokens or NitroChat credits.
2. Test-first for the consent gate. `tests/consent.test.*` must exist and pass
   before any gated tool is written.
3. All external data is deterministic mocks in `/mocks/*.json`, keyed by PAN
   last digit and mobile suffix. Never call real bureau/AA/KYC APIs. Never use
   real PII anywhere, including tests and fixtures.
4. Canonical tool name is `fetch_bank_statements` (NOT fetch_bank_stmts) —
   use it everywhere: code, schemas, docs, demo.
5. Mock outcome mapping (canonical, from PLAN.md §10): PAN last digit 0–1 =
   APPROVE profile, 5–6 = CONDITIONAL, 8–9 = DECLINE. Mobile suffix 00–33 =
   stable salaried, 34–66 = self-employed, 67–99 = volatile.
6. Every new library/dataset/API goes into THIRD_PARTY.md in the same commit
   that introduces it (admin rule R12 — undisclosed third-party code can
   disqualify the team).
7. Keep it boring: plain TypeScript/JavaScript on the Nitrostack scaffold,
   in-memory stores persisted to ./data/*.json. No databases, no ORMs, no
   extra frameworks (admin rule R15: Nitrostack SDK/CLI only).
8. Decisioning is rules + a pre-baked scorecard + reason codes. NEVER describe
   or implement it as trained ML.
9. Redact PII (PAN, mobile, name) in every audit payload before storage.
10. After the feature freeze commit (tagged `freeze`), only fix bugs that break
    the golden path. No refactors, no new features, no dependency bumps.
11. Do not run `nitro deploy` yourself unless the phase prompt says to. The
    team controls prod. Never deploy after 11:00 AM IST on 18 July.

## Commands (README-verified; the hackathon brief's `nitro …` forms are likely
## the same CLI via global install — Phase −1 records which forms work here)
- `npx @nitrostack/cli init vitta-lending`  → scaffold (brief variant:
                            `npm i -g nitrostack && nitro init vitta-lending`)
- `npm run dev`          → local MCP dev server (+ widget server if present);
                            open the folder in NitroStudio for visual testing
- `npm test`             → unit + integration tests (vitest or node:test —
                            whichever the scaffold supports; decide in Phase 0)
- `npm run regress`      → scripts/regress — runs edge paths A–F end-to-end
- build/deploy           → per docs.nitrostack.ai/deployment/checklist and the
                            portal's "Deploy MCP" step (CLI · GitHub · package
                            upload). Brief variant: `nitro build`,
                            `nitro deploy --prod`. PROD DEPLOY IS TEAM-TRIGGERED
                            ONLY — see PLAN.md §6.

## Layout
src/tools/       one file per MCP tool (12 tools)
src/lib/         consent.ts, scorecard.ts, emi.ts, redact.ts, store.ts
src/resources/   5 MCP resources
src/prompts/     5 MCP prompt templates
mocks/           bureau_seed.json, bank_seed.json, kyc_seed.json,
                 fraud_seed.json, city_tiers.json
tests/           consent.test.* FIRST, then goldenpath.test.*, tools/*.test.*
scripts/         regress.*, seed-demo.*
docs/            NITROSTACK_NOTES.md, DEPLOY_LOG.md

## Definition of done — every tool
- [ ] Input/output JSON schema matches PLAN.md §5 exactly
- [ ] 1–3 sentence natural-language description (the model reads this to decide
      what to call — it is judged under Technical Quality 25%)
- [ ] Gated tools: consent check is the FIRST statement in the handler
- [ ] Writes a redacted audit event via log_audit_event
- [ ] Deterministic against the mock seeds
- [ ] Unit test passing; golden-path test still green
- [ ] Committed with the phase's commit message

## Budget (Free plan — from the live workspace dashboard)
3 apps max · 3 chats max · 5.0M Studio tokens · $0.50 NitroChat credits.
Implications: test tool-by-tool in the nitro dev panel (cheap), not via long
agentic chats (expensive). Full agentic chat runs are reserved for Phase 6
verification and demo rehearsal/recording. See PLAN.md §6 for the app/chat
slot budget.
```

---

## §2 · GROUND TRUTH — WHAT WE'RE JUDGED ON (from the admin brief)

**Rubric:** Technical Quality 25% · Innovation & Creativity 25% · Real-World Impact 20% · Demo & Presentation 15% · Completeness 10% · Community Visibility 5%. Automated checks at 06:01 PM verify deployment reachability, submission completeness, and MCP primitive count — a dead URL is an automatic zero regardless of code quality (R13).

**Rules digest (the ones that can kill or save us):**
- **R10** ≥2 MCP primitives required — we ship all 3 (12 Tools, 5 Resources, 5 Prompts).
- **R11** all work within the window (12:00 PM Jul 17 → 12:00 PM Jul 18).
- **R12** declare every external component in `THIRD_PARTY.md` — undisclosed third-party code can disqualify.
- **R13** live public Nitrostack URL at the deadline, or the project is not evaluated.
- **R15** built on Nitrostack SDK/CLI — no waiver needed if we stay native.
- **R16** submissions close 12:00 PM IST sharp; **R17** dual submission (Nitrostack portal + McpToTheMoon Discord `#amrita-hackathon` + Reddit); **R18** portal needs URL + ≤2-min video + 200–400-word write-up + public repo; **R19** video must show the server connected to an MCP-compatible client (screen recording + voiceover OK); **R20** all names + roll numbers.
- **R22** AI coding assistants permitted for implementation. ✔ Claude Code is legal.

**Workspace facts (dashboard screenshot):** team *The Beetles — Amrita University Amritapuri Campus*, Free plan, 0/3 apps used, 0/3 chats used, 5.0M Studio tokens, $0.50 NitroChat credits, deploy paths available: **CLI, GitHub connect, or package upload** (Studio "Deploy MCP" step). All three deploy paths are used in the strategy in §6.

---

## §3 · PHASE −1: NITROSTACK SDK DISCOVERY (T+0 → T+0:45) — *new, and the single most important change for Claude Code*

Claude Code has **zero reliable training knowledge of Nitrostack**. If you skip this phase, it will hallucinate SDK function names and burn hours. This phase converts the platform into a local, greppable source of truth.

**Terminal (human runs, 5 min):**
```bash
node --version                       # must be >= 20.18 (README prerequisite)
npx @nitrostack/cli init vitta-lending   # README-verified scaffold command
# If the hackathon workshop taught a different form, it's the same CLI:
#   npm install -g nitrostack && nitro init vitta-lending
cd vitta-lending && npm install
git init && git add -A && git commit -m "chore: raw scaffold (untouched)"
```
Also install **NitroStudio** (desktop app from nitrostack.ai/studio) on one laptop now — it opens the project folder, runs the dev server for you, and is the free visual test panel used at every gate.

**Claude Code session prompt — Phase −1:**
```
Read CLAUDE.md and PLAN.md §3 first.
This repo is a fresh, untouched `nitro init` scaffold for the Nitrostack MCP
platform. Your ONLY job in this session is discovery — write, do not code:

1. Run the CLI's --help and every subcommand's --help (try both `npx
   @nitrostack/cli --help` and `nitro --help`; record which forms work).
2. Read the entire scaffold: every generated file, config, and example tool/
   resource/prompt definition.
3. Read node_modules/@nitrostack/core (and /cli, /widgets if present): README,
   package.json exports, and .d.ts type definitions — especially the Tool/
   Resource/Prompt decorators, Guards, ExecutionContext, and @Widget.
3b. Fetch the official docs pages listed in CLAUDE.md rule 1 (tools-guide,
   authentication-overview for Guards, ui-widgets-guide, cli/introduction,
   deployment/checklist) and paste the load-bearing excerpts (code samples,
   command tables) into NITROSTACK_NOTES.md with their URLs.
4. Produce docs/NITROSTACK_NOTES.md with exactly these sections:
   - How a Tool is defined (exact import path, registration API, where the
     input/output schema goes, where the natural-language description goes)
   - How a Resource is defined and what URI schemes are supported
   - How a Prompt template is defined
   - How local testing works (`nitro dev` panel: how to invoke a tool)
   - How state/persistence is expected to work in this scaffold
   - How env vars / secrets are set
   - How deployment works (CLI flags, what URL is produced, GitHub-connect
     option if documented)
   - UNKNOWNS: an explicit list of anything you could not verify from local
     sources. Do not fill gaps with guesses.
5. Confirm which test runner the scaffold supports (or add vitest if none) and
   record the decision in the notes.

Gate: docs/NITROSTACK_NOTES.md exists, has no invented APIs (every claim cites
a file path or --help output), and the UNKNOWNS list is honest.
Commit: "docs: nitrostack SDK discovery notes"
```

Any UNKNOWN that blocks the golden path → ask an **on-site Nitrostack mentor** immediately (the admin brief provides mentors + a bookable slot via the portal + the Discord support channel). Mentor answers get appended to the notes file so Claude Code can use them.

---

## §4 · REPO LAYOUT (target state)

```
vitta-lending/
├── CLAUDE.md                  ← §1 block, verbatim
├── PLAN.md                    ← this document
├── THIRD_PARTY.md             ← updated in the same commit as any new dependency
├── README.md                  ← quickstart + architecture figure + demo link
├── docs/
│   ├── NITROSTACK_NOTES.md    ← Phase −1 output; the only Nitrostack API truth
│   └── DEPLOY_LOG.md          ← every deploy: tag, time, URL, verify result
├── mocks/                     ← bureau_seed.json, bank_seed.json, kyc_seed.json,
│                                fraud_seed.json, city_tiers.json
├── src/
│   ├── tools/                 ← 12 files: qualify_lead.ts … get_audit_trail.ts
│   ├── lib/                   ← consent.ts, scorecard.ts, emi.ts, redact.ts, store.ts
│   ├── resources/             ← credit-policy.ts, product-catalog.ts, city-tiers.ts,
│   │                            consent-templates.ts, case-record.ts
│   └── prompts/               ← sales-playbook.ts, underwriting-explainer.ts,
│                                objection-handling.ts, adverse-action-notice.ts,
│                                kyc-consent-script.ts
├── tests/                     ← consent.test.* (FIRST), goldenpath.test.*, tools/
├── scripts/                   ← regress.*, seed-demo.*
└── data/                      ← runtime JSON persistence (gitignored)
```

Full tool/resource/prompt **specifications (schemas, descriptions, internal logic, FOIR bands, scorecard, hard negatives, explanation templates) are already complete in `brainstorm.md` Phases 1–3 — treat that file as the spec appendix to this plan.** Copy it into the repo as `docs/SPEC.md` so Claude Code can read it locally. The only two corrections to apply to it are in §10 below.

---

## §5 · CLAUDE CODE PHASE PROMPTS (one session each, with gates)

> Timeline anchors assume the 24h window (T+0 = 12:00 PM Jul 17). If you're starting late, the order and gates still hold — compress, don't skip gates.

### Phase 0 — Scaffold, seeds, walking-skeleton deploy (T+0:45 → T+2:00)
```
Read CLAUDE.md, PLAN.md §5 Phase 0, docs/NITROSTACK_NOTES.md, docs/SPEC.md.
1. Create THIRD_PARTY.md now, listing nitrostack + anything the scaffold ships.
2. Create all 5 mock seed files in /mocks per SPEC.md Phase 0, using the
   CANONICAL mapping from CLAUDE.md rule 5 (0–1 approve / 5–6 conditional /
   8–9 decline). Include the demo identities:
   - PAN "VITTA1235K" (last digit 5 → CONDITIONAL), mobile "9876543222"
     (suffix 22 → stable salaried)  ← THE DEMO PAIR
   - one APPROVE pair (PAN ending 0) and one DECLINE pair (PAN ending 9)
3. Implement src/lib/store.ts: tiny JSON-file-backed key-value store for
   cases, consents, audit events (append-only array + seq counter).
4. Implement ONE trivial tool `health_check` (returns {ok:true, version})
   using the exact registration pattern from NITROSTACK_NOTES.md.
5. Verify `nitro dev` runs and health_check is callable in the test panel.
Gate: nitro dev green; health_check invocable; seeds validate against the
mapping table (write tests/seeds.test.* asserting the demo PAN resolves to a
CONDITIONAL bureau profile).
Commit: "feat: scaffold + deterministic seeds + health_check"
THEN (human): first prod deploy — see PLAN.md §6 step D1.
```

### Phase 1a — Consent module, TEST-FIRST (T+2:00 → T+3:00)
```
Read CLAUDE.md rules 1–3 and SPEC.md Tool 2.
1. Write tests/consent.test.* FIRST, covering: (a) no token → CONSENT_REQUIRED,
   (b) expired token (>900s) → CONSENT_EXPIRED, (c) token without required
   scope → SCOPE_NOT_GRANTED, (d) tampered token → CONSENT_INVALID,
   (e) valid token → passes. Watch them fail.
2. Implement src/lib/consent.ts: signToken / verifyToken (HMAC-SHA256 with a
   server secret from env — set via the mechanism documented in
   NITROSTACK_NOTES.md), validConsent(token, requiredScope), 15-min TTL,
   scopes ["CREDIT_BUREAU","BANK_STATEMENTS","KYC"].
3. Implement the gate the PLATFORM-IDIOMATIC way: a NitroStack Guard
   (ConsentGuard, per docs.nitrostack.ai/sdk/typescript/authentication-overview
   and the @UseGuards pattern in the official README), parameterized by
   required scope, returning/throwing the exact refusal payload
   { error:"CONSENT_REQUIRED", code, hint:"Call record_consent first and pass
   the returned consent_token" }. If the Guard API cannot read tool input or
   shape the error payload the way the spec needs, FALL BACK to calling
   validConsent() as the first line of each gated handler — behavior over
   idiom. Record which approach shipped in NITROSTACK_NOTES.md.
4. Make all 5 tests pass (tests target the observable refusal behavior, so
   they hold under either implementation).
Gate: npm test green. This module is now FROZEN except for bugfixes.
Commit: "feat: consent gate as NitroStack Guard (test-first) — signature feature"
```

### Phase 1b — Intake tools (T+3:00 → T+6:00)
```
Implement per SPEC.md, in order: qualify_lead, record_consent, verify_kyc,
screen_fraud, pull_bureau ⚿, fetch_bank_statements ⚿ (canonical name!).
- Gated tools: validConsent(...) is the FIRST line; on failure return
  { error:"CONSENT_REQUIRED", code, hint:"Call record_consent first and pass
  the returned consent_token" } and log a CONSENT_GATE_BLOCKED audit event.
- qualify_lead sets the intent flag (medical/emergency → FAST_TRACK) on the
  case record per SPEC.md.
- Every tool writes its redacted audit event.
- Unit test each tool against the seeds; add a negative test that calls
  pull_bureau with NO token and asserts the refusal (this is judge probe
  Path D — it must never regress).
Gate: npm test green; in the nitro dev panel, manually run the sequence
qualify_lead → record_consent → verify_kyc → pull_bureau and see real data;
then run pull_bureau with a garbage token and see the refusal.
Commit: "feat: intake tools with enforced consent gate"
```

### Phase 2 — Decisioning core (T+6:00 → T+8:30)
```
Implement per SPEC.md: compute_affordability (FOIR/DTI + bands),
src/lib/scorecard.ts + src/lib/emi.ts (reducing-balance formula), underwrite
(hard negatives → FOIR caps by income band → scorecard: APPROVE ≥60 /
CONDITIONAL 40–59 / DECLINE <40, with reason_codes[] AND borrower-friendly
explanations[]), generate_offers (≤3 offers, intent-aware ordering:
FAST_TRACK → lowest EMI first; recommended flag + why_recommended).
Add tests/goldenpath.test.*: drive the full path in-process for the three
seeded identities and assert: demo PAN → CONDITIONAL with FOIR-related reason
code; PAN…0 → APPROVE with 3 offers; PAN…9 → DECLINE with explanations.
Verify EMI math against a hand-computed case in a test (e.g. ₹3,00,000 @
15.99% for 36m → EMI 10,545–10,650 range; pin the exact value the formula
produces and assert it).
Gate: npm test green including goldenpath.
Commit: "feat: affordability + explainable underwriting + intent-aware offers"
```

### Phase 3 — Documents & audit (T+8:30 → T+10:00)
```
Implement create_sanction_letter (HTML → PDF server-side; include every field
listed in SPEC.md Tool 10: borrower name prominent, amount/EMI/APR/total cost,
fees, first-EMI date, 3-row amortization + link, NBFC identifiers, 3-day
cooling-off notice, mock e-sign line, SHA256 hash footer), log_audit_event
(redactPII applied to every payload; version block {policy, scorecard,
prompt}), get_audit_trail (FULL | SUMMARY | COMPLIANCE_VIEW).
Choose the PDF approach documented/possible per NITROSTACK_NOTES.md; if a
library is added, update THIRD_PARTY.md in the same commit.
Gate: golden path in nitro dev ends with a real downloadable PDF whose hash
matches; get_audit_trail returns the full event sequence for the session with
PII redacted (assert "VITTA1235K" never appears in stored audit data).
Commit: "feat: sanction letter PDF + immutable redacted audit trail"
```

### Phase 4 — MCP Resources (T+10:00 → T+11:00)
```
Register the 5 resources per SPEC.md Phase 2 using the pattern from
NITROSTACK_NOTES.md: policy://credit-policy/v1.7,
catalog://products/personal-loan, ref://city-tiers, consent://templates,
case://{lead_id} (live, reads from store.ts so the client can check state
without re-running tools).
Gate: all 5 visible in the Studio resource browser / dev panel; case://
resource reflects a case updated moments earlier by a tool call.
Commit: "feat: 5 MCP resources incl. live case record"
```

### Phase 5 — MCP Prompts (T+11:00 → T+12:00)
```
Register the 5 prompt templates verbatim from SPEC.md Phase 3:
sales-playbook, underwriting-explainer, objection-handling,
adverse-action-notice, kyc-consent-script.
Gate: all 5 listed by the server; spot-check one renders with variables.
Commit: "feat: 5 MCP prompt templates (disclosures, tone, explanations)"
→ ALL THREE PRIMITIVES NOW SHIP (R10 exceeded; both 25% rubric lines armed).
THEN (human): deploy D2 per §6 — first full-server prod deploy.
```

### Phase 6 — Client integration + human-in-the-loop (T+12:00 → T+15:00)
```
Human does the clicking (Studio/NitroChat UI); Claude Code fixes contract
mismatches it surfaces.
1. Connect NitroChat chat (uses chat slot 1 of 3) to the deployed server.
2. Connect ONE additional MCP client (Claude) — R19 requires demoing an
   MCP-compatible client connection.
3. Run the golden path ONCE agentically in NitroChat (this costs NitroChat
   credits — see §6 budget). Fix any schema/description issue that confused
   the client, re-test the specific tool in the dev panel (cheap), redeploy.
4. Human-in-the-loop: verify that on underwrite → CONDITIONAL or screen_fraud
   → REVIEW, the client pauses (sales-playbook prompt instructs the pause +
   "brief review by our team" message) and does NOT auto-proceed to
   generate_offers until the human confirms.
Gate: full golden path succeeds agentically in NitroChat AND in the second
MCP client, including the CONDITIONAL pause.
Commit: "fix: client-integration contract fixes" (whatever changed)
```

### Phase 7 — Rich widgets (STRETCH — only if Phase 6 gate passed) (T+15:00 → T+17:00)
```
Widgets are a VERIFIED first-class feature: `@nitrostack/widgets` (React SDK)
+ the `@Widget('name')` decorator on a tool attach a component to that tool's
output, previewable with hot reload in NitroStudio. Follow
docs.nitrostack.ai/sdk/typescript/ui-widgets-guide exactly (widget server,
src/widgets/ layout per the scaffold). Build: 3-offer comparison cards
(recommended badge, why_recommended, accept button → create_sanction_letter)
attached to generate_offers, and the sanction-letter document card (download
button, hash, name in clear typography) attached to create_sanction_letter.
Add @nitrostack/widgets to THIRD_PARTY.md in the same commit.
Gate: widgets preview in NitroStudio AND render in NitroChat; accepting an
offer produces the PDF card.
If the deployed-widget path breaks and mentors are unavailable — SKIP the
deploy of widgets (keep them local-only for a NitroStudio demo shot). A clean
text golden path on prod beats a broken widget on prod.
Commit: "feat: offer comparison + sanction widgets"
```

### Phase 8 — Edge paths & regression harness (T+17:00 → T+18:30)
```
Write scripts/regress.* to run all six paths from SPEC.md Phase 6 in-process
and print PASS/FAIL per path:
A APPROVE (PAN…0) · B CONDITIONAL demo path (VITTA1235K) · C DECLINE +
adverse-action content (PAN…9) · D consent-gate refusal (judge probe) ·
E fraud REVIEW (mobile suffix 99) · F objection-handling (verify prompt text
renders for "rate too high").
Wire as `npm run regress`.
Gate: 6/6 PASS, twice in a row.
Commit: "test: edge-path regression harness (paths A–F)"
→ FEATURE FREEZE. Tag: `git tag freeze`. CLAUDE.md rule 10 now applies.
```

### Phase 9 — Demo, write-up, submission (T+18:30 → T+23:00)
Humans lead; Claude Code assists only with README polish and the write-up draft (both already drafted in SPEC.md — the 200–400-word write-up and the community-post template are copy-paste ready). Demo script: follow SPEC.md Phase 7 **exactly** — ≤2:00, tool list visible in the first 12 seconds, one continuous take, CONDITIONAL demo path with PAN `VITTA1235K`, ends on audit-trail flash. Submission checklist: SPEC.md "Submission Checklist" (portal R18 items + Discord/Reddit R17 + roll numbers R20), verified **on a clean device in incognito**. Final submit by **11:30 AM**.

---

## §6 · DEPLOYMENT STRATEGY (built for the Free plan: 3 apps · 3 chats · 5.0M tokens · $0.50 credits)

### 6.1 The doctrine
**Deploy a walking skeleton in hour 2, then deploy on every green gate, and keep the last-known-good URL alive at all times.** The judged artifact is a reachable public URL (R13) — automated reachability checks run at 06:01 PM. A broken deploy at 11:59 AM is a zero. Every deploy is recorded in `docs/DEPLOY_LOG.md` (tag · IST time · URL · verify result) and tagged in git (`deploy-1`, `deploy-2`, …) so any deploy can be reproduced from source instantly.

### 6.2 App-slot budget (3 max — spend them deliberately)
| Slot | App | Purpose |
|---|---|---|
| 1 | `vitta-lending` | **PROD** — the submitted URL. Created at D1, never deleted, URL never changes. |
| 2 | `vitta-staging` | Optional staging: use it to rehearse any deploy you're nervous about (e.g. the Phase 7 widget deploy) before touching prod. Create lazily, only when first needed. |
| 3 | *(empty)* | **Emergency reserve.** If prod ever gets into an unrecoverable platform-side state, redeploy the last-good git tag here and swap the submitted URL. Do not spend this slot on experiments. |

Chat-slot budget (3 max): chat 1 = **prod NitroChat widget** (demo + submission), chat 2 = created only if a widget/branding experiment is needed, chat 3 = reserve. Never fill all three.

### 6.3 Token & credit budget (this is why we test in the panel, not in chat)
- **5.0M Studio tokens** power AI-assisted Studio features and platform usage. Conserve: Claude Code (your own subscription) does the code generation; Studio's AI assist is a fallback, not the default.
- **$0.50 NitroChat credits** ≈ a small handful of full agentic conversations. Ration explicitly: **1 run** for Phase 6 verification, **1 run** for a full rehearsal, **1–2 runs** for the actual recording, keep the remainder as margin. Everything else — every tool bug, every schema tweak — is verified in the `nitro dev` test panel and `npm test`/`npm run regress`, which cost nothing.
- **Record the demo video the moment the golden path is clean in a client** (even before widgets). If credits or the platform die later, you already hold a valid R19 video. Re-record only if Phase 7 lands and there's budget.

### 6.4 The deploy sequence
- **D1 (T+2:00, after Phase 0):** first prod deploy of the walking skeleton (`health_check` + seeds). `nitro build && nitro deploy --prod`. Capture the public URL — this exact URL goes in the submission. Verify per 6.5. Tag `deploy-1`.
- **D2 (after Phase 5):** full server — 12 tools, 5 resources, 5 prompts. This is the deploy Phase 6 clients connect to.
- **D3 (after Phase 6 fixes):** contract-fix deploy.
- **D4 (after Phase 7, only if widgets shipped):** rehearse on `vitta-staging` first if nervous.
- **D5 (after Phase 8 freeze):** the release candidate. Run 6.5 verification + one NitroChat smoke of the demo path. This should be the final deploy.
- **11:00 AM Jul 18: deploy lockout.** After this, `nitro deploy` is run only if the 6.5 checklist FAILS against prod, and only from the `freeze`/`deploy-5` tag. 11:00–11:30: submit. 11:30–12:00: buffer, hands off prod.

Primary deploy path is the **CLI** (`nitro deploy --prod`). The dashboard also offers **GitHub connect** and **package upload** — set up GitHub connect on the repo early as the backup path (if the CLI misbehaves at 10 AM, pushing `main` still deploys), and package-upload is the path of last resort via Studio.

### 6.5 Post-deploy verification checklist (run after EVERY deploy, log result in DEPLOY_LOG.md)
1. Public URL loads in an **incognito** window (not just your logged-in session).
2. Tool list is visible/servable to a client: all 12 tools, 5 resources, 5 prompts enumerate.
3. `health_check` returns `{ok:true}` with the expected version/commit hash.
4. Consent-gate probe: call `pull_bureau` with no token against **prod** → `CONSENT_REQUIRED`. (Judges may probe exactly this — Path D.)
5. Demo pair `VITTA1235K` / `9876543222` resolves to the CONDITIONAL story on prod.
6. Prod uses its own `data/` state — clear stale demo cases before recording.
7. Dashboard shows no error spike in request logs / latency panel.

### 6.6 Rollback
Platform-level rollback is an UNKNOWN until Phase −1 documents it. The guaranteed rollback is source-level: `git checkout deploy-N && nitro build && nitro deploy --prod` (≈2 minutes). If the platform itself is stuck: redeploy `deploy-N` to the reserve app slot and swap the URL in the (not yet submitted) portal form. If it's after submission: contact the Nitrostack mentor desk immediately — they run the infra.

### 6.7 Free-tier feasibility — where the plan actually spends platform resources
**What costs ₹0 in platform terms (≈95% of the build):** Claude Code generation (your own subscription) · `npm run dev` + `npm test` + `npm run regress` locally · **NitroStudio** tool testing, widget preview, and — critically — its built-in AI chat, which runs on **your own OpenAI/Gemini API key** stored locally, so full agentic golden-path rehearsals cost you a few rupees of your own key and **zero** Studio tokens / NitroChat credits. Deterministic JSON mocks mean no external API spend, ever.

**What draws on the workspace allotment:** hosting the deployed app (1 of 3 slots — a tiny stateless TS server, exactly the free plan's advertised "Create App → Deploy MCP → Add Chat" use case) · the hosted **NitroChat** widget's model calls ($0.50 credits — the one genuinely scarce resource) · possibly Studio tokens for platform-hosted AI features (which this plan deliberately never relies on). **After the first NitroChat run, read the dashboard delta** (credits used, tokens used) and recompute how many runs remain — budget from measurement, not assumption.

**Demo fallback ladder — all three satisfy R19 ("connected to at least one MCP-compatible client"):**
1. **NitroChat branded widget** — best visuals; use the rationed runs here.
2. **NitroStudio chat** (own API key) — free, unlimited rehearsals; acceptable on camera.
3. **Claude connected to the deployed URL** — free on the team's Claude account; the Winning Plan itself lists "Claude (demo host)" as the R19 client, so this is a pre-blessed path even if every credit is gone.

**Kickoff action (first 30 min):** the admin brief states every registered team receives Nitrostack Platform Credits *provisioned at hackathon start* (the ₹4.28L cloud-credits budget line). The 5.0M/$0.50 currently showing may be the pre-event baseline. Ask the mentor desk whether hackathon credits top these up — if yes, the ration in 6.3 relaxes; if no, this plan already fits inside the baseline.

**Emergency-only note:** the official NitroStack tutorial demonstrates ngrok tunneling for local servers — usable for a mid-build client test if the cloud hiccups, but **never for submission**: R13 requires the public URL generated through the Nitrostack platform.

---

## §7 · TESTING STRATEGY (summary)
Order of construction is a compliance argument, not just hygiene: **consent tests exist before the gated tools do** (Phase 1a), so the repo history itself proves the gate wasn't bolted on. Layers: `tests/consent.test.*` (5 cases) → per-tool unit tests against seeds → `tests/goldenpath.test.*` (3 identities, in-process) → `npm run regress` (paths A–F) → panel smoke on `nitro dev` → 6.5 checklist on prod → one budgeted agentic run in NitroChat. Determinism rule: any test that depends on time uses injected clocks; any randomness (UUIDs OK) must not affect outcomes.

---

## §8 · DEMO & SUBMISSION (delta only — full scripts live in SPEC.md)
- Demo: SPEC.md Phase 7 table, unchanged, with two additions: (1) at 0:45–1:05, show the **prod URL** briefly in frame — reinforces R13/Completeness; (2) at the consent step, flash the refusal you get *without* consent before granting it — 3 seconds that demonstrate the signature feature on camera.
- Write-up: SPEC.md draft, but replace `fetch_bank_stmts` with `fetch_bank_statements` before pasting (see §10).
- Dual submission R17: portal (judged) + Discord `#amrita-hackathon` + Reddit (visibility, 5%) using SPEC.md Appendix B template with demo GIF + Figure 1 architecture image.
- Names + roll numbers for **all** Beetles members (R20). Track = BFSI & FinTech (R14).
- Verify every artifact (URL, video link, repo) opens from a teammate's phone on mobile data before 11:30.

---

## §9 · GUARDRAILS FOR CLAUDE CODE (paste-adjacent to any ad-hoc request)
Do **not**: invent Nitrostack APIs (rule 1) · rename tools or change schemas after Phase 6 (clients are bound to them) · add databases, ORMs, LangChain/LangGraph, or any orchestration framework (R15; the MCP client is the orchestrator) · train, fake, or *describe* an ML model (rules-first is the honest, defensible story) · put real PII in code, seeds, tests, or logs · touch `src/lib/consent.ts` after Phase 1a except for a failing-test-driven bugfix · refactor after the `freeze` tag · run `nitro deploy` unprompted · let `THIRD_PARTY.md` lag behind `package.json` by even one commit · exceed 3 sentences in a tool description or let a description drift from behavior.

---

## §10 · INCONSISTENCIES FOUND ACROSS THE SOURCE DOCS — RESOLVED HERE (canonical)
1. **Tool name:** the Winning Plan PDF uses `fetch_bank_statements`; brainstorm.md uses `fetch_bank_stmts`. **Canonical: `fetch_bank_statements`** everywhere (code, write-up, demo voiceover). A name mismatch between the write-up and the live tool list is exactly the kind of thing a technical judge notices.
2. **Mock mapping:** the PDF's Appendix A says PAN 8/9 → "borderline / CONDITIONAL"; brainstorm.md says 5–6 → CONDITIONAL and 8–9 → DECLINE. **Canonical: brainstorm.md's three-band mapping** (0–1 APPROVE · 5–6 CONDITIONAL · 8–9 DECLINE) — it gives all three demo stories distinct seeds. Demo pair: PAN `VITTA1235K`, mobile `9876543222`.
3. **Event dates:** the admin brief itself flips between 17/18 July in places (its own plan flags this). Binding anchors: hackathon window **12:00 PM Jul 17 → 12:00 PM Jul 18**, judging from ~06:00 PM Jul 18, and the automated reachability check at 06:01 PM — so the prod URL must stay alive **through the evening of Jul 18**, not just until noon.
4. **Demo video length:** everything agrees on **≤2:00** (R18b). The old pre-Vitta doc's "4-minute demo" is dead; never resurrect it.
5. **CLI commands:** the admin brief teaches `npm install -g nitrostack` → `nitro init/dev/build/deploy --prod`; the official README (verified 17 Jul 2026) says `npx @nitrostack/cli init` → `npm run dev`. Almost certainly the same CLI reached two ways (the global install exposes the `nitro` binary), and the hackathon may pin a specific version. **Canonical: whatever Phase −1 records as working in this environment** — try the README form first, the brief's form second, and write the winner into `NITROSTACK_NOTES.md`. Never let the two forms mix in scripts or docs.

---

## §11 · RISK REGISTER (delta vs SPEC.md — Claude-Code-specific risks added)
| Risk | Mitigation |
|---|---|
| Claude Code hallucinates Nitrostack APIs | Phase −1 notes file is the only API truth; CLAUDE.md rule 1; UNKNOWNS go to mentors, never guessed. |
| Long Claude Code session drifts off-plan | One session per phase; every session opens by reading CLAUDE.md + the phase prompt; gates are commands, not vibes. |
| Free-plan credits exhausted before demo | §6.3 ration; record a "good-enough" demo at first clean client run; panel testing is free. |
| Prod URL dies before 06:01 PM judging check | Last-known-good doctrine; git tags per deploy; reserve app slot; GitHub-connect backup deploy path; mentor desk escalation. |
| Consent gate regresses late | Path D lives in both `npm test` and `npm run regress` AND in the post-deploy checklist — it's rechecked on prod after every deploy. |
| Schema drift between server and recorded demo | Feature freeze at Phase 8; demo recorded against a tagged deploy; no renames after Phase 6. |

---

## THE ONE THING (unchanged)
> **The consent gate is the product. Everything else is the wrapper.**
> No valid, scoped, time-boxed token from `record_consent` → `pull_bureau` and `fetch_bank_statements` refuse, on prod, on camera, and under a judge's probe. DPDP expressed as code, tested before anything else, verified after every deploy.

*Final Implementation Plan v2.0 — Claude Code Edition · The Beetles · Amrita MCP Hackathon 2026 · BFSI & FinTech · Submit by 11:30 AM IST, 18 July 2026.*
