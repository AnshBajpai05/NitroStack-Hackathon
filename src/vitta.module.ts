import { Module } from '@nitrostack/core';
import { IntakeTools } from './tools/intake.tools.js';
import { DecisionTools } from './tools/decision.tools.js';
import { DocumentTools } from './tools/document.tools.js';
import { AuditTools } from './tools/audit.tools.js';
import { SystemTools } from './tools/system.tools.js';
import { VittaResources } from './resources/vitta.resources.js';
import { VittaPrompts } from './prompts/vitta.prompts.js';

/**
 * VittaModule — the NBFC lending capability layer.
 * 13 Tools (12 domain + revoke_consent + health_check), 5 Resources, 5 Prompts.
 */
@Module({
  name: 'vitta',
  description: 'NBFC personal-loan origination: qualify → consent → KYC → bureau → underwrite → offers → sanction → audit.',
  controllers: [
    IntakeTools,
    DecisionTools,
    DocumentTools,
    AuditTools,
    SystemTools,
    VittaResources,
    VittaPrompts,
  ],
})
export class VittaModule {}
