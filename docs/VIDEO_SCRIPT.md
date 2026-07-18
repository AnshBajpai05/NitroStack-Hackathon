# VIDEO_SCRIPT.md — read this start to end (~2.5 min)

**Team: The Beetles · Amrita University, Amritapuri · Track: BFSI & FinTech**
Target 2:30, hard cap 3:00. Read at a calm, confident pace. `[ON SCREEN]` = what to show; don't read it aloud.

---

### [0:00–0:20] — HOOK + PROBLEM
`[ON SCREEN: the deployed server URL / the tool list, then the NitroChat home]`

> "We're **The Beetles**, and this is **Vitta**.
> In India, getting a personal loan is a leaky, stressful maze — you fill forms, you're passed between portals, your data gets pulled without you really understanding it, and when you're declined, no one tells you *why*.
> We asked a simple question: what if compliance and clarity weren't the paperwork — what if they were the product?"

### [0:20–0:45] — WHAT WE BUILT + HOW
`[ON SCREEN: architecture line — one server, many clients; then the repo / tool list]`

> "Vitta is an **MCP-native lending server**. One server takes a borrower from *hi* to a **signed sanction letter** — qualify, consent, KYC, fraud, credit bureau, bank analysis, underwriting, offers, and audit.
> We built it in TypeScript on the **NitroStack SDK**, with a small, deterministic rules-and-scorecard engine — **no black-box model** — and a test-first consent gate. The whole thing is deployed live on **NitroCloud**."

### [0:45–1:20] — THE MCP INNOVATION (the core)
`[ON SCREEN: highlight the 3 primitives; then the consent refusal moment]`

> "The MCP part is the heart. We ship all three primitives — **seventeen Tools, five Resources, and five Prompts** — but the innovation is *where* we put the compliance.
> Our signature idea is the **consent gate**. Data-pull tools like the credit bureau and bank statements **physically refuse to run** without a valid, scoped, time-boxed consent token — enforced in code, at the tool layer. No matter how the AI is prompted, it cannot pull your data without your explicit yes. That's India's DPDP law, expressed as software.
> And because it's a standard MCP server, the **client is the agent** — the same tools work in a branded chat, in Claude, or in a ChatGPT app, with no rewrite. We even hardened it against a real attack: reusing one applicant's consent token on another is blocked."

### [1:20–1:40] — HOW WE USED THE PLATFORM
`[ON SCREEN: NitroStudio testing, then the NitroCloud deploy / dashboard]`

> "We built end-to-end on the NitroStack platform. We scaffolded with the **CLI**, tested every tool visually in **NitroStudio**, deployed to **NitroCloud** with one connect, and wired it to a branded **NitroChat** surface — all in one place. Let me show you a real run."

### [1:40–2:25] — THE LIVE NITROCHAT DEMO
`[ON SCREEN: scroll the actual NitroChat conversation as you narrate each beat]`

> "Priya needs three lakh rupees for a medical emergency. She's in a rush and asks us to just pull her credit report — **and Vitta refuses**, and explains it needs her consent first.
> `[gauge widget]` She consents, and one call runs KYC, fraud, bureau and bank, and returns an **explainable decision** — conditional, two-and-a-half lakh, and *every reason in plain words*. FOIR at fifty-seven percent. No black box.
> `[what-if widget]` She asks what it would take for the full amount — and our **what-if simulator** re-runs the *real* underwriting: close one EMI, and it moves from conditional to **approved**, at three lakh.
> `[offer cards]` She sees priced offers — APR and cooling-off shown upfront — picks the low-EMI option, and gets a **signed sanction letter**, integrity-hashed, in a single conversation.
> `[audit trail / redaction]` And every step is written to an immutable, **PII-redacted** audit trail."

### [2:25–2:35] — CLOSE
`[ON SCREEN: end card — "Vitta · One server. Any client. Compliant by design." + repo + live URL]`

> "One server. Any client. **Compliant by design.**
> That's Vitta, from **The Beetles**. Thank you."

---

## Delivery notes
- ~410 words ≈ 2:30 at a natural pace. If you run long, trim the second half of the platform section.
- Record the NitroChat conversation (or scroll the completed one) as the visual under 1:40–2:25.
- Keep the tool list on screen in the first 12 seconds — it visually proves the MCP primitives.
- Two moments to let breathe: the **consent refusal** and the **what-if flip**.
- End on the audit-trail / end-card. Do not trail off.
