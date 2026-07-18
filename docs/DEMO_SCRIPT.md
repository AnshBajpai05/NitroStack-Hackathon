# DEMO_SCRIPT.md — the one-shot NitroChat conversation + the ≤2:00 video

> App verified on prod (11/11): 17 tools · 11 resources (5 data + 4 widget UIs + 2 system) · 5 prompts.
> This is the plan for the single budgeted NitroChat run and the submission video.

---

## THE PREMISE (the story you're telling)

**Priya Sharma**, salaried in Kochi, has a **medical emergency** and needs **₹3 lakh**. She already
carries existing EMIs. In one chat, Vitta takes her from "hi" to a **signed sanction letter** — but it
**refuses to touch her data without consent**, **explains every decision in plain words**, and shows her
**exactly what would unlock the full amount**. The thesis the judges must feel: *compliance and clarity
are the product, not the paperwork.*

One MCP server on NitroStack. The chat client is the agent. Same server would power a website, WhatsApp,
or an underwriter console — no rewrite.

---

## PRE-FLIGHT (before you spend the $0.50 — 3 minutes, all free)

1. **NitroChat** open at the `/embed` page, green "Connected".
2. **System prompt** pasted (the version with FAST PATH + NEVER STOP SILENTLY). Saved.
3. **Model = strongest available** (Sonnet/Opus-class, NOT Haiku). This is the single biggest reliability lever.
4. **Two browser tabs ready:** (a) NitroChat, (b) a blank tab for the letter URL.
5. **Screen recorder ON** (OBS / Win+G) capturing the NitroChat tab. **The recording IS the run** — first clean take wins.
6. Clock: keep it moving. If the agent ever stalls, type `continue` (you'll edit it out).

---

## THE CONVERSATION — 6 messages, copy-paste exactly

Type these one at a time, waiting for each response. This single conversation surfaces **every** feature:
qualify + FAST_TRACK, the consent gate, the explainable decision gauge, the what-if simulator, the offer
cards, the signed sanction letter, and the audit trail.

**Message 1 — borrower opens (qualify + consent gate in one):**
```
Hi, I need ₹3 lakh for 36 months for a medical emergency. I'm salaried in Kochi, PAN VITTA1235K, mobile 9876543222, name Priya Sharma. I'm in a rush — can you just pull my credit report right away?
```
→ Agent qualifies her (FAST_TRACK), but **refuses to pull without consent** and asks for it. *(Signature feature.)*

**Message 2 — grant consent:**
```
Yes, I consent to the credit bureau, bank statements, and KYC.
```
→ Agent calls `advance_application` (one step: KYC → fraud → bureau → bank → affordability → underwrite)
→ **decision gauge widget** renders: **CONDITIONAL, ₹2,50,000, FOIR 57%**, reason chips. Agent pauses (human-in-the-loop).

**Message 3 — the what-if (the wow):**
```
What would it take for me to get the full ₹3 lakh?
```
→ `simulate_scenario` → **what-if widget**: TODAY vs WHAT-IF, red FOIR bar crossing the 55% cap → green, ₹2.5L → ₹3L.

**Message 4 — proceed to offers:**
```
Let's go ahead with the ₹2.5 lakh conditional offer — show me my options.
```
→ `generate_offers` → **offer-comparison widget**: 48-month ₹7,084 (recommended) + 36-month ₹8,788, APR + total cost upfront.

**Message 5 — accept + sanction:**
```
I'll take the recommended 48-month offer. Please generate my sanction letter.
```
→ `create_sanction_letter` → letter card + **a real URL** (`…nitrocloud.ai/letters/<lead_id>`) + SHA256 hash.
→ **In your second browser tab, open that URL** — the full styled sanction letter renders. *(This is your hero shot.)*

**Message 6 — compliance close:**
```
Show me the full audit trail for this application.
```
→ `get_audit_trail` → every step, immutable, **PII-redacted** (PAN shows as `VITXXXXXXK`).

**Optional Message 7 (only if the run is smooth and you want the live-data flex):**
```
What live reference rates are these priced against?
```
→ `get_reference_rates` → live ECB INR rates. Shows the one real external integration.

> Stop after message 6 (or 7). You now have the complete footage. Save the recording immediately.

---

## THE VIDEO — ≤2:00, shot-by-shot

The raw recording is longer than 2:00. The video is an **edited cut**: trim dead air, speed up tool-call
waits ~1.5×, add a voiceover and captions. If you can't edit, do a tight single take and talk fast — but
editing is normal and expected for a demo.

| Time | On screen | Voiceover (tight) |
|---|---|---|
| 0:00–0:12 | The deployed **server URL docs page** + the tool list | "This is Vitta — one MCP server on NitroStack. It turns any AI client into an NBFC loan officer: seventeen tools, five resources, five prompts." |
| 0:12–0:28 | Msg 1 → agent qualifies, then **refuses to pull data, asks consent** | "Priya needs three lakh for a medical emergency. The agent qualifies her — then refuses to touch any data without consent. That refusal is the whole product." |
| 0:28–0:50 | Msg 2 → **gauge widget** (CONDITIONAL ₹2.5L, reasons) | "With her explicit yes, one call runs KYC, fraud, bureau and bank — gated by that consent token — and returns an explainable decision. Conditional, two-point-five lakh, every reason in plain words. No black box." |
| 0:50–1:12 | Msg 3 → **what-if widget** (FOIR bar crosses the cap) | "She asks what it would take for the full amount. The simulator re-runs the *real* underwriting — close one EMI and the full three lakh unlocks. Deterministic, explainable." |
| 1:12–1:32 | Msg 4–5 → **offer cards**, then **browser: the signed letter** | "APR and cooling-off shown upfront. She picks the low-EMI offer — and gets a signed sanction letter, integrity-hashed, in one conversation." |
| 1:32–1:50 | Msg 6 → **audit trail** (redacted) + a 3-sec insert of `CONSENT_REQUIRED` / cross-lead block | "Every step is in an immutable, PII-redacted audit trail. And consent is enforced in code — reuse another applicant's token and the server blocks it." |
| 1:50–2:00 | End card: **"One server. Any client. Compliant by design."** + repo/URL | "One server. Any client. Compliant by design." |

**Recording tips**
- Keep the tool/suggested-prompt list visible in the first 12 seconds — it *visually proves* the MCP primitives.
- The consent pause and the what-if flip are your two strongest 8-second moments — let them breathe.
- Pre-seed nothing risky; the demo pair is deterministic, it renders identically every time.
- If a widget looks dark, cut to the browser (letter URL) or your Studio screenshots as B-roll.

---

## THE DELIVERABLES (R18) — the exact submission package

- **Live public URL (R13):** `https://vitta-6a5a5835-the-beetles-amrita-university-amritapuri-campus.app.nitrocloud.ai`
- **Demo video ≤2:00 (R18b/R19):** the edited NitroChat cut above — shows the server connected to an MCP client. Upload YouTube-unlisted or Drive-public; verify it plays **logged-out**.
- **200–400 word write-up:** ready in `docs/SUBMISSION.md`.
- **Public repo:** `https://github.com/AnshBajpai05/NitroStack-Hackathon`.
- **All members' names + roll numbers (R20):** FILL IN `docs/SUBMISSION.md` — missing roll numbers can void the entry.
- **Track:** BFSI & FinTech (R14). **Primitives:** all 3 (R10). **THIRD_PARTY.md** complete (R12).
- **Dual submission (R17):** NitroStack portal + Discord `#amrita-hackathon` + Reddit (post template in `docs/SUBMISSION.md`).

---

## THE ONE-LINER for every judge
> "Vitta is the only entry where compliance is the innovation: consent enforced in code, every decision
> explained, and a what-if simulator that turns a 'no' into a path to 'yes' — one MCP server, any client."
