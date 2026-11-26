<!--
- Path: 13_swisd-network/mcp/GUIDE.md
- Description: Architecture of swisd-network — stack, concepts, module conventions, trust-ledger wiring.
- Input: The codebase, GOSPEL.md, and the shared laws in ../12_swisd-core/mcp/GOSPEL.md.
- Output: Concepts, module layout, build/test recipes.
- Provides: The canonical architecture reference for swisd-network.
-->

# SwISD-Network guide

- Node 22+, strict ESM, TypeScript.
- Install: `npm install` (pulls swisd-core via `file:../12_swisd-core`). Build: `npm run build` (tsc → dist/). Test: `npm test` (`node --import tsx --test test/*.test.ts`).
- Layout: `src/<module>/` with `index.ts` barrel. Modules: network, crdt, peer, ownership, executor, tasks, models, admin. Shared: `errors.ts`, `utils.ts`, `types.ts`.
- Trust ledger: `src/peer/trustLedger.ts` — signed trust events, Merkle root, replay, JSONL persistence. TrustRegistry: `src/peer/trust.ts`.
- New module: `src/<name>/index.ts` + export in `src/index.ts` + `./<name>` entries in package.json exports.
- New code needs a test in `test/` (harness law: 12_swisd-core GOSPEL D-004).
- Dependency direction: cockpit → network → core (canonical: 12_swisd-core GOSPEL D-003).
- Remote: github.com/swisd-project/SwISD-network.
