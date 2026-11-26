<!--
- Path: 13_swisd-network/mcp/FILETREE.md
- Description: Target tree of swisd-network — the single owner of all paths and module boundaries.
- Input: The actual repository shape.
- Output: The tree as it should look.
- Provides: Paths, module boundaries, naming. Concepts and decisions live in GUIDE/GOSPEL.
-->

# SwISD-Network file tree

```
13_swisd-network/
├── src/
│   ├── index.ts                 # barrel export
│   ├── errors.ts                # LedgerCorruptError etc.
│   ├── utils.ts
│   ├── types.ts
│   ├── network/                 # libp2p, discovery (mDNS), bloom, health
│   │   ├── libp2p.ts / discovery.ts / bloom.ts / health.ts
│   │   └── router/              # gossipRouter, egressTunnel
│   ├── crdt/                    # merkle (Merkle-DAG), reputation, reputationLog, structures
│   ├── peer/                    # trust (TrustRegistry), trustLedger (signed trust-event ledger: Merkle root + replay + JSONL)
│   ├── ownership/               # keystone, anchor (ownership/bond), succession, recoveryRateLimiter, schema
│   ├── executor/                # registry
│   ├── tasks/                   # locator, capabilities, lifecycle, ingestion
│   ├── models/                  # seeder, fetcher, framing
│   └── admin/                   # server (admin API), snapshot
├── test/                        # node:test + tsx
│   ├── trustLedger.test.ts / swarmId.test.ts / reputation.test.ts / trust.test.ts
│   ├── merkle.test.ts / bloom.test.ts / locator.test.ts
│   ├── ownership-schema.test.ts / executor.test.ts
├── dist/                        # tsc output (gitignored)
├── package.json                 # libp2p stack + swisd-core (file:../12_swisd-core)
├── tsconfig.json
├── README.md
└── mcp/                         # this folder (docs, uncommitted)
```
