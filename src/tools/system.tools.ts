/**
 * system.tools.ts — health_check tool (PLAN.md §5 Phase 0). Cheap liveness probe
 * used by the post-deploy verification checklist (§6.5).
 */
import { ToolDecorator as Tool, ControllerDecorator as Controller, ExecutionContext, z } from '@nitrostack/core';

export const SERVER_VERSION = '1.0.0';

@Controller()
export class SystemTools {
  @Tool({
    name: 'health_check',
    description: 'Liveness probe. Returns {ok:true, version, server, ts}. Use to verify the deployment is reachable.',
    inputSchema: z.object({}),
  })
  async health_check(_input: any, _ctx: ExecutionContext) {
    return { ok: true, version: SERVER_VERSION, server: 'vitta-lending', ts: new Date().toISOString() };
  }
}
