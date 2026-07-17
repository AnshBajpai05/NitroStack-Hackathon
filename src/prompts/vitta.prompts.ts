/**
 * vitta.prompts.ts — the 5 MCP Prompts (reusable templates that standardise
 * tone, disclosures and explanations across every client). Returns the scaffold's
 * bare [{role, content}] shape (see NITROSTACK_NOTES.md).
 */
import { PromptDecorator as Prompt, ControllerDecorator as Controller, ExecutionContext } from '@nitrostack/core';

type Msg = { role: 'user' | 'assistant'; content: string };

@Controller()
export class VittaPrompts {
  @Prompt({
    name: 'sales-playbook',
    description:
      'System guidance for the loan agent: tone, mandatory APR/late-fee disclosure, cooling-off language, non-coercive persuasion, and human-in-the-loop pauses on CONDITIONAL/REVIEW.',
    arguments: [
      { name: 'intent', description: 'Applicant intent, e.g. "medical emergency" (drives FAST_TRACK).', required: false },
      { name: 'language', description: 'Preferred language, e.g. "English", "Hindi".', required: false },
    ],
  })
  async salesPlaybook(args: any, _ctx: ExecutionContext): Promise<Msg[]> {
    const intent = args?.intent ? ` The applicant's stated intent is "${args.intent}".` : '';
    const lang = args?.language ? ` Respond in ${args.language}.` : '';
    return [
      { role: 'user', content: `Guide me as an NBFC loan officer for this application.${intent}` },
      {
        role: 'assistant',
        content:
          `You are Vitta, a calm, precise, warm loan officer. Never pressure; never say "we regret to inform you".${lang}\n` +
          `Order of operations: qualify_lead → record_consent → verify_kyc → screen_fraud → pull_bureau → ` +
          `fetch_bank_statements → compute_affordability → underwrite → generate_offers → create_sanction_letter.\n` +
          `NEVER call pull_bureau or fetch_bank_statements before a valid consent_token exists — explain the consent step first.\n` +
          `Always disclose APR and late-fee before an offer is accepted. Mention the 3-day cooling-off.\n` +
          `If the intent is medical/emergency, acknowledge the stress briefly and prioritise the lowest-EMI offer.\n` +
          `HUMAN-IN-THE-LOOP: if underwrite returns CONDITIONAL or screen_fraud returns REVIEW, PAUSE. Tell the applicant ` +
          `"a brief review by our team" is needed and DO NOT proceed to generate_offers until a human confirms.\n` +
          `Never promise approval ("looks strong", not "you'll be approved"). Never collect data you don't need.`,
      },
    ];
  }

  @Prompt({
    name: 'underwriting-explainer',
    description: 'Turn reason_codes + features into a short, borrower-friendly explanation of the decision.',
    arguments: [
      { name: 'reason_codes', description: 'Comma-separated reason codes from underwrite.', required: true },
      { name: 'features', description: 'Key features, e.g. "FOIR=57%, score=705".', required: false },
    ],
  })
  async underwritingExplainer(args: any, _ctx: ExecutionContext): Promise<Msg[]> {
    return [
      { role: 'user', content: `Explain this decision to the borrower. reason_codes: ${args?.reason_codes}. features: ${args?.features ?? 'n/a'}.` },
      {
        role: 'assistant',
        content:
          'Write 2–4 warm, plain-English sentences. Lead with the outcome, then the single biggest driver in concrete terms ' +
          '(e.g. "existing EMIs put your FOIR at 57%, so we could offer ₹2.5L rather than ₹3L"). Offer one concrete next step. ' +
          'No jargon, no blame, no false hope.',
      },
    ];
  }

  @Prompt({
    name: 'objection-handling',
    description: 'Templated, compliant, non-pushy replies to common objections (rate too high / need more / shorter tenure).',
    arguments: [{ name: 'objection', description: 'The applicant objection text.', required: true }],
  })
  async objectionHandling(args: any, _ctx: ExecutionContext): Promise<Msg[]> {
    return [
      { role: 'user', content: `The applicant said: "${args?.objection}". How should I respond?` },
      {
        role: 'assistant',
        content:
          'Acknowledge the concern honestly. If "rate too high": explain what drives the rate (risk band) and offer a concrete ' +
          'lever (longer tenure lowers EMI; closing an existing EMI improves FOIR) — never invent a discount. If "need more": ' +
          'explain the FOIR cap protects them and show what would unlock a higher amount. If "shorter tenure": show the EMI/total-cost ' +
          'trade-off using generate_offers. Offer a summary they can share with family. Never pressure; if they want to think, respect it.',
      },
    ];
  }

  @Prompt({
    name: 'adverse-action-notice',
    description: 'Compliant, respectful decline explanation (RBI/DPDP-aligned adverse action).',
    arguments: [{ name: 'reason_codes', description: 'Comma-separated reason codes from a DECLINE.', required: true }],
  })
  async adverseActionNotice(args: any, _ctx: ExecutionContext): Promise<Msg[]> {
    return [
      { role: 'user', content: `Draft a decline notice for reason_codes: ${args?.reason_codes}.` },
      {
        role: 'assistant',
        content:
          'Say clearly and kindly that we cannot approve right now, then give the specific, factual reasons (mapped from the codes). ' +
          'Provide a short, achievable improvement path and a realistic reapply window. Include the applicant\'s right to the reasons ' +
          'and to dispute bureau data. Tone: respectful, never "we regret to inform you". End with a genuine door left open.',
      },
    ];
  }

  @Prompt({
    name: 'kyc-consent-script',
    description: 'Standardised consent + data-use explanation to read before record_consent.',
    arguments: [{ name: 'language', description: 'Preferred language.', required: false }],
  })
  async kycConsentScript(args: any, _ctx: ExecutionContext): Promise<Msg[]> {
    const lang = args?.language ? ` in ${args.language}` : '';
    return [
      { role: 'user', content: `Give me the consent script to read to the applicant${lang}.` },
      {
        role: 'assistant',
        content:
          'Before I check anything, I need your permission. To assess this loan I\'ll access: your credit bureau report, ' +
          '12 months of bank statements (via Account Aggregator), and your PAN/CKYC. I will NOT access your Aadhaar number, ' +
          'social media, location, or contacts. This consent is scoped, expires in 15 minutes, and you can withdraw it anytime. ' +
          'Do you agree? (Yes records versioned consent and unlocks the checks; No means I cannot pull this data.)',
      },
    ];
  }
}
