# DEPLOY_LOG.md — every deploy (tag · IST time · URL · verify result)

Deploy is platform-side (NitroCloud dashboard: CLI · GitHub connect · package upload).
Run the §6.5 checklist after EVERY deploy and record the result here.

| # | git tag | IST time | Public URL | health_check | consent probe (pull_bureau, no token) | notes |
|---|---------|----------|------------|--------------|----------------------------------------|-------|
| D1 | _pending_ | | | | | walking skeleton → first prod deploy |

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
