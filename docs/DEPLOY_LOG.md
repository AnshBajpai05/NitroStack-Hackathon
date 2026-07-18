# DEPLOY_LOG.md — every deploy (tag · IST time · URL · verify result)

Deploy is platform-side (NitroCloud dashboard: CLI · GitHub connect · package upload).
Run the §6.5 checklist after EVERY deploy and record the result here.

| # | git tag | IST time | Public URL | health_check | consent probe (pull_bureau, no token) | notes |
|---|---------|----------|------------|--------------|----------------------------------------|-------|
| D1 | deploy-1 (9450be4) | 17 Jul 22:08 | https://vitta-6a5a5835-the-beetles-amrita-university-amritapuri-campus.app.nitrocloud.ai | ✓ ok, secret configured | ✓ CONSENT_REQUIRED | FULL server (not just skeleton): 16 tools · 5 prompts · 4 widgets. `node scripts/verify-prod.mjs` → 10/10 PASS incl. demo pair CONDITIONAL ₹2.5L, what-if flip, live rates, audit redaction. Cloud runs MCP sessions ENABLED (Mcp-Session-Id header required — verifier handles it). GitHub auto-deploy on push to main. |

## Post-deploy checklist (§6.5) — tick each after a deploy
- [ ] Public URL loads in an **incognito** window
- [ ] Tool list servable: 14 tools, 5 resources, 5 prompts enumerate
- [ ] `health_check` returns `{ok:true, version:"1.0.0"}`
- [ ] Consent probe: `pull_bureau` with no/garbage token → `CONSENT_REQUIRED` (judge Path D)
- [ ] Demo pair `VITTA1235K` / `9876543222` → CONDITIONAL ₹2,50,000 story
- [ ] Clear stale demo cases in `data/` before recording
- [ ] Dashboard shows no error/latency spike

## Rollback (guaranteed, source-level)
`git checkout <tag> && npm run build` → redeploy that tag via the dashboard (≈2 min).

| D2 | (bugfix, auto) | 17 Jul 22:40 | same URL | ✓ | ✓ | fix: stale-tenure bug (found live by Claude MCP client). NOTE: this auto-deploy came up WITHOUT CONSENT_SECRET even though var was saved — env vars apply only on the NEXT explicit deploy after saving. |
| D3 | (manual redeploy) | 17 Jul 22:55 | same URL | ✓ secret configured | ✓ | 10/10 verify-prod PASS. Rule: after EVERY deploy run `node scripts/verify-prod.mjs`; check `consent_secret_configured:true`. |
| D4 | (manual redeploy) | 17 Jul 23:10 | same URL | ✓ secret configured | ✓ | 10/10 PASS. CONFIRMED QUIRK: GitHub auto-deploys DROP env vars; only manual "Deploy from GitHub" applies them. Mitigation: daily work on `dev` branch (no auto-deploy); deploys = merge to main → push → immediately manual Deploy from GitHub → verify-prod 10/10. |
| D5 | v9 (manual, 51ca1bd) | 17 Jul 23:30 | same URL | ✓ secret configured | ✓ | 10/10 PASS. Both LLM-client-found bugs fixed+regression-tested: stale-tenure (underwrite) + FOIR-breaching offers. This is the release-candidate build for the demo recording. |
| D6 | deploy-6 (RC) | 18 Jul 00:15 | same URL | ✓ | ✓ | 11/11 PASS incl. NEW letter-URL check (GET /letters/:leadId → HTTP 200, SHA256 in doc). Added: real letter download URL served from store, consent-ask hardening, widget button fallbacks. RELEASE CANDIDATE for the demo recording. |
| D7 | (manual) | 18 Jul 01:00 | same URL | ✓ | ✓ | 11/11 PASS. Fixed sanction-letter widget crash (useState-after-return / Rules of Hooks) + baked agent behavior into sales-playbook prompt (consent-first, lean on attached widgets, one-line narration). NOT frozen yet — team still rehearsing. |
| D8 | (manual) | 18 Jul 01:40 | same URL | ✓ | ✓ | 11/11 PASS + jti confirmed returned by record_consent on prod. DD-audit hardening live: per-boot random consent secret (unforgeable from public repo), revoke UX fix, doc drift fixed, 7 vendor skill dirs removed. |
