# SUBMISSION KIT — copy-paste ready (R17/R18/R20)

## Portal fields (R18)

**Live MCP server URL (R13):**
`https://vitta-6a5a5835-the-beetles-amrita-university-amritapuri-campus.app.nitrocloud.ai`

**Public repo:** `https://github.com/AnshBajpai05/NitroStack-Hackathon`

**Track:** BFSI & FinTech (R14) · **Team:** The Beetles — Amrita University, Amritapuri
**Members + roll numbers:** _<FILL IN ALL MEMBERS — R20; missing roll numbers can void the entry>_

**Demo video (≤2:00, R18b/R19):** _<link after recording>_

---

## Write-up (≈290 words — edit freely, keep tool names EXACT)

**Problem.** NBFC personal-loan origination is a leaky, compliance-heavy chain — qualify, consent,
KYC, credit-assess, price, sanction — stitched across forms and portals. Most leads drop out between
steps, and declines rarely come with a clear, lawful reason.

**Solution.** Vitta is a consent-native MCP lending server on NitroStack. One deployed server exposes
the entire workflow as **16 Tools** (qualify_lead, record_consent, verify_kyc, screen_fraud,
pull_bureau, fetch_bank_statements, compute_affordability, underwrite, generate_offers,
create_sanction_letter, audit tools, simulate_scenario, live reference rates), **5 Resources**
(versioned credit policy, rate card, city tiers, consent templates, the live case record), and
**5 Prompts** (sales playbook, underwriting explainer, objection handling, adverse-action notice,
KYC consent script — localised in English, Hindi and Malayalam). Any MCP client becomes the loan
officer: it reasons step-by-step, pauses for a human on CONDITIONAL or fraud-REVIEW outcomes, and
drives a prospect from "hi" to a signed sanction letter in one conversation.

**The signature idea: DPDP consent enforced at the tool layer.** pull_bureau and
fetch_bank_statements refuse to execute — `{error:"CONSENT_REQUIRED"}` — without a valid, scoped,
time-boxed HMAC consent token issued by record_consent. No client, however prompted, can pull data
without provable consent; revocation invalidates the token. Every decision is written to an
append-only, PII-redacted audit trail with policy/scorecard/prompt versions stamped.

**Explainability as product.** Underwriting is rules + a transparent scorecard with reason codes —
and the what-if simulator (simulate_scenario) re-runs the real decisioning with changed levers, so a
borrower sees exactly what turns their CONDITIONAL into an APPROVE. Interactive widgets render the
decision gauge, offer comparison, sanction letter and what-if delta in-chat.

**Impact.** The funnel collapses into one auditable, explainable session. Demo data are deterministic
PAN/mobile-keyed mocks; CIBIL/AA/CKYC are drop-in adapters. Built with the NitroStack SDK/CLI and
deployed on NitroCloud with a hosted NitroChat surface — the same tools power a website widget,
WhatsApp, or an underwriter console with no rewrite.

---

## Community post (R17 — Discord `#amrita-hackathon` + Reddit)

```
Vitta — a consent-native MCP lending server (Amrita MCP Hackathon 2026, BFSI)

One NitroStack MCP server turns any AI client into an NBFC loan officer:
qualify → DPDP consent (tools literally refuse without a valid token) → KYC →
bureau + bank cashflow → FOIR → explainable underwriting with reason codes →
3 priced offers (interactive widget) → signed sanction letter → immutable audit trail.

The bit we're proud of: consent is enforced at the tool layer, and the what-if
simulator re-runs the REAL underwriting with changed levers — "close your card
EMI and your CONDITIONAL becomes an APPROVE at the full amount."

16 tools · 5 resources · 5 prompts (EN/HI/ML) · 4 widgets · live URL · repo below.
[demo GIF] · [architecture figure] · [live URL] · [repo]
#MCP #NitroStack #BFSI #AgenticAI
```

---

## Pre-submit checklist (11:00–11:30 AM, from a phone on mobile data)
- [ ] Live URL opens (incognito): initialize responds
- [ ] `node scripts/verify-prod.mjs` → 10/10, `consent_secret_configured: true`
- [ ] Video link plays logged-out · ≤2:00 · shows MCP client connected (R19)
- [ ] Repo public, README current, THIRD_PARTY.md complete (R12)
- [ ] All names + roll numbers in the portal form (R20)
- [ ] Portal submitted (R18) + Discord + Reddit posted (R17)
- [ ] NO deploys after 11:00 AM unless verify fails (then: Deploy from GitHub of tag `freeze` only)
