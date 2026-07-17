/**
 * goldenpath.test.ts — drives the full path in-process for the three seeded
 * identities, plus the consent-gate probe (judge Path D). PLAN.md §5 Phase 2.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/lib/store.js';
import {
  qualifyLead, recordConsent, verifyKyc, screenFraud, pullBureau, fetchBankStatements,
  computeAffordabilityStep, underwriteStep, generateOffersStep, createSanctionStep, getAuditTrail,
} from '../src/lib/engine.js';
import type { ConsentRefusal } from '../src/lib/types.js';

function isRefusal(x: unknown): x is ConsentRefusal {
  return !!x && typeof x === 'object' && (x as any).error === 'CONSENT_REQUIRED';
}

/** Run intake through consent+kyc+fraud; return {lead_id, consent_token}. */
function intake(session_id: string, pan: string, mobile: string, city = 'Kochi', purpose = 'medical emergency') {
  const q = qualifyLead({ session_id, purpose, amount: 300000, tenure_months: 36, employment: 'SALARIED', city });
  const c = recordConsent({ session_id, lead_id: q.lead_id, consent_text_version: 'consent-v3', accepted: true, channel: 'web' });
  if (!c.accepted) throw new Error('consent failed');
  verifyKyc({ session_id, lead_id: q.lead_id, pan, name: 'Test Applicant' });
  screenFraud({ session_id, lead_id: q.lead_id, identifiers: { mobile, pan } });
  return { lead_id: q.lead_id, consent_token: c.consent_token, intent_flag: q.intent_flag };
}

beforeEach(() => store._resetAll());

describe('golden path — three deterministic stories', () => {
  it('B: CONDITIONAL demo path (VITTA1235K / 9876543222) → ₹2.5L, FOIR ≈ 57%', () => {
    const s = 'sess-cond';
    const { lead_id, consent_token, intent_flag } = intake(s, 'VITTA1235K', '9876543222');
    expect(intent_flag).toBe('FAST_TRACK'); // "medical emergency"

    const bureau = pullBureau({ session_id: s, lead_id, consent_token, pan: 'VITTA1235K' });
    expect(isRefusal(bureau)).toBe(false);
    fetchBankStatements({ session_id: s, lead_id, consent_token, months: 12 });
    const aff = computeAffordabilityStep({ session_id: s, lead_id });
    expect(Math.round(aff.foir * 100)).toBe(57);

    const decision = underwriteStep({ session_id: s, lead_id });
    expect(decision.outcome).toBe('CONDITIONAL');
    expect(decision.max_amount).toBe(250000);
    expect(decision.reason_codes).toContain('FOIR_LIMIT');
    expect(decision.explanations.join(' ')).toMatch(/instead of/i);

    const offers = generateOffersStep({ session_id: s, lead_id });
    expect(offers.offers.length).toBeGreaterThanOrEqual(1);
    // FAST_TRACK → recommended is the lowest-EMI offer
    const rec = offers.offers.find((o) => o.offer_id === offers.recommended_offer_id)!;
    expect(Math.min(...offers.offers.map((o) => o.emi))).toBe(rec.emi);

    const sanction = createSanctionStep({ session_id: s, lead_id, offer_id: offers.recommended_offer_id });
    expect('hash' in sanction).toBe(true);
  });

  it('A: APPROVE path (PAN …0) → full amount, offers generated', () => {
    const s = 'sess-appr';
    const { lead_id, consent_token } = intake(s, 'AAAPA1230A', '9000000010', 'Mumbai', 'home renovation');
    pullBureau({ session_id: s, lead_id, consent_token, pan: 'AAAPA1230A' });
    fetchBankStatements({ session_id: s, lead_id, consent_token });
    computeAffordabilityStep({ session_id: s, lead_id });
    const decision = underwriteStep({ session_id: s, lead_id });
    expect(decision.outcome).toBe('APPROVE');
    expect(decision.max_amount).toBe(300000);
    const offers = generateOffersStep({ session_id: s, lead_id });
    expect(offers.offers.length).toBe(3);
  });

  it('C: DECLINE path (PAN …9) → adverse-action reasons, no offers', () => {
    const s = 'sess-dec';
    const { lead_id, consent_token } = intake(s, 'ZZZPZ1239Z', '9000000010', 'Mumbai', 'home renovation');
    pullBureau({ session_id: s, lead_id, consent_token, pan: 'ZZZPZ1239Z' });
    fetchBankStatements({ session_id: s, lead_id, consent_token });
    computeAffordabilityStep({ session_id: s, lead_id });
    const decision = underwriteStep({ session_id: s, lead_id });
    expect(decision.outcome).toBe('DECLINE');
    expect(decision.reason_codes.length).toBeGreaterThan(0);
    expect(decision.explanations.length).toBeGreaterThan(0);
    const offers = generateOffersStep({ session_id: s, lead_id });
    expect(offers.offers.length).toBe(0);
  });

  it('D: consent-gate probe — pull_bureau with no/garbage token refuses (judge probe)', () => {
    const s = 'sess-gate';
    const q = qualifyLead({ session_id: s, purpose: 'x', amount: 300000, tenure_months: 36, employment: 'SALARIED', city: 'Kochi' });
    const noTok = pullBureau({ session_id: s, lead_id: q.lead_id, consent_token: undefined, pan: 'VITTA1235K' });
    expect(isRefusal(noTok)).toBe(true);
    if (isRefusal(noTok)) expect(noTok.code).toBe('CONSENT_REQUIRED');
    const garbage = fetchBankStatements({ session_id: s, lead_id: q.lead_id, consent_token: 'garbage.token' });
    expect(isRefusal(garbage)).toBe(true);
  });

  it('tenure re-negotiation: affordability override at 48m flows into underwrite (agent-found bug)', () => {
    // A live Claude run exposed this: agent re-ran compute_affordability with
    // tenure_months=48, but underwrite still used the stale case tenure and
    // capped at the shorter tenure's amount. Overrides must persist to the case.
    const s = 'sess-renego';
    const { lead_id, consent_token } = intake(s, 'VITTA1235K', '9876543222');
    pullBureau({ session_id: s, lead_id, consent_token, pan: 'VITTA1235K' });
    fetchBankStatements({ session_id: s, lead_id, consent_token });

    // first pass at 24 months → tight FOIR cap
    computeAffordabilityStep({ session_id: s, lead_id, tenure_months: 24 });
    const d24 = underwriteStep({ session_id: s, lead_id });
    expect(d24.max_amount).toBeLessThan(250000);

    // re-negotiate at 48 months → full ₹3L must be serviceable
    computeAffordabilityStep({ session_id: s, lead_id, tenure_months: 48 });
    const d48 = underwriteStep({ session_id: s, lead_id });
    expect(d48.max_amount).toBe(300000);
    expect(d48.outcome).toBe('CONDITIONAL'); // score band still needs review
  });

  it('audit trail redacts PII — raw demo PAN never stored in clear', () => {
    const s = 'sess-redact';
    const { lead_id, consent_token } = intake(s, 'VITTA1235K', '9876543222');
    pullBureau({ session_id: s, lead_id, consent_token, pan: 'VITTA1235K' });
    const trail = getAuditTrail({ session_id: s });
    const blob = JSON.stringify(trail);
    expect(blob).not.toContain('VITTA1235K');
    expect(blob).not.toContain('9876543222');
    expect(trail.count).toBeGreaterThan(0);
  });
});
