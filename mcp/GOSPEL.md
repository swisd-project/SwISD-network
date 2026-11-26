<!--
- Path: 13_swisd-network/mcp/GOSPEL.md
- Description: Locked decisions and environment law for swisd-network.
- Input: Owner decisions, the codebase, and the shared SwISD laws in ../12_swisd-core/mcp/GOSPEL.md.
- Output: Domain-specific law; pointers to the canonical shared laws.
- Provides: The law for this domain. Shared SwISD laws are pointed at, never copied.
-->

# SwISD-Network gospel

Shared SwISD laws (key format, ledger integrity, dependency direction, test harness, README style) live canonically in `../12_swisd-core/mcp/GOSPEL.md` (D-001…D-005). Pointers only:

- Keys in ledgers, ledger integrity, `LedgerCorruptError` — core gospel D-001/D-002.
- Dependency direction: network → core, never the reverse; core depends on nothing — core gospel D-003.
- Tests: node:test + tsx only — core gospel D-004. READMEs dry — core gospel D-005.

Domain decisions

- Trust decisions are keystone-signed events, never memory-only (canonical statement: core gospel D-002). Domain consequence: TrustRegistry is backed by the TrustLedger (`src/peer/trustLedger.ts` — Merkle root + replay + JSONL persistence).
- `deriveSwarmId` determines membership; mDNS discovery is filtered by swarm ID.

Environment

- Node 22+, strict ESM, TypeScript. Deps: libp2p stack + `swisd-core` (`file:../12_swisd-core`).
- Remote: github.com/swisd-project/SwISD-network.
