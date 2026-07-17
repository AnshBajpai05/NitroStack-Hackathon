# THIRD_PARTY.md — external components (admin rule R12: undisclosed third-party code can disqualify)

> Update this file in the SAME commit that introduces any new dependency, dataset, or API.

## Platform / SDK (from `nitrostack-cli init` scaffold)
| Component | Version | License | Purpose |
|---|---|---|---|
| `@nitrostack/core` | ^1 (1.0.13) | Apache-2.0 | NitroStack MCP runtime: decorators, DI, transports |
| `@nitrostack/cli` | ^1 (1.0.14) | Apache-2.0 | scaffold / dev / build / start / generate |
| `@nitrostack/widgets` | ^1 (1.0.8) | Apache-2.0 | React widget SDK (Phase 7 only; add when first imported) |
| `@modelcontextprotocol/ext-apps` | >=0.1.0 | MIT | MCP apps extension (scaffold dep) |
| `zod` | ^3.22.4 | MIT | input/output schema validation |
| `dotenv` | ^16.3.1 | BSD-2-Clause | env loading |
| `typescript` | ^5.3.3 | Apache-2.0 | compiler (dev) |
| `@types/node` | ^22 | MIT | Node types (dev) |
| React / Next.js (in `src/widgets`) | scaffold-pinned | MIT | widget frontend (bundled by nitrostack-cli build) |

## Added by the team
| Component | Version | License | Purpose | Commit |
|---|---|---|---|---|
| `vitest` | ^2 | MIT | unit + golden-path + consent tests | Phase 0 |
| _(PDF lib for sanction letter — decide in Phase 3; record here in same commit)_ | | | | |

## Data
All bureau / bank / KYC / fraud data are **synthetic deterministic mocks** in `/mocks/*.json`,
keyed by PAN last digit and mobile suffix. **No real PII, no real external APIs, ever.**

## AI assistance
Claude Code (Anthropic) used for implementation per admin rule R22. Architecture and
creative direction are the team's (The Beetles).
