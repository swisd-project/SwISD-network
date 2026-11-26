<!--
- Path: 13_swisd-network/mcp/AGENTS.md
- Description: Binder and entry point for the swisd-network domain — document map, workflow, conflict and update policy per project-standard.md.
- Input: The four supporting documents in this folder, project-standard.md (workspace root), the codebase.
- Output: Orientation for any agent working in this domain.
- Provides: The map and rules of engagement. Definitions, paths, decisions, and tasks live in the supporting documents.
-->

# AGENTS.md — SwISD-Network domain binder

## 1. Purpose and scope

Governs `13_swisd-network`: the SwISD P2P layer (libp2p, discovery, CRDT/reputation, trust ledger, ownership, task transport, admin API). Does not govern `12_swisd-core` or `14_swisd-cockpit`; SwISD-wide shared laws are owned by core's gospel — this domain points, never copies.

## 2. Project goal

SwISD-Network connects SwISD peers: swarm membership via `deriveSwarmId`, mDNS discovery filtered by swarm ID, keystone-signed trust events on a Merkle/JSONL ledger, ownership/bond anchors, and swarm task I/O over libp2p. What it is not: a UI, and not a base library — it depends on core (GOSPEL of 12_swisd-core, D-003).

## 3. Document map

| File | Domain | Read when |
| --- | --- | --- |
| `GOSPEL.md` | Domain decisions + pointers to the shared SwISD laws in 12_swisd-core/mcp/GOSPEL.md | Always first. |
| `GUIDE.md` | Architecture: stack, layout, trust ledger wiring | Before adding or changing modules. |
| `FILETREE.md` | Target tree: paths, module boundaries, naming | Before creating/moving files; diff after large changes. |
| `BACKLOG.md` | Work: phases, tasks, state | Before starting any task; record state while working. |
| `README.md` | Human-facing repo readme | On demand only. |
| `../12_swisd-core/mcp/GOSPEL.md` | SwISD-wide law (keys, ledger integrity, dependency direction, test harness, README style) | Whenever a shared law matters. |

## 4. AI workflow

1. Analyze the prompt; identify the affected documents.
2. Binder first; read GOSPEL (and the core gospel it points to), then only the relevant documents.
3. Generate; flag conflicts; point instead of copy.

## 5. Do's and Don'ts

- Do: depend on core, never on cockpit (core gospel D-003). Don't: restate shared laws here.
- Do: node:test + tsx tests for new code (core gospel D-004). Don't: add test dependencies.
- Do: state changes only after owner confirmation (standard §5.3). Don't: hardcode paths outside FILETREE.

## 6. Conflict resolution

Each document is the expert authority of its domain. If this domain's docs conflict with the shared law in core's gospel, the core gospel wins (canonical home). Remaining conflicts are flagged to the owner; no autonomous resolution.

## 7. Document update policy

After a major change, the agent proposes an update to the relevant document; the owner approves. Minor edits happen on explicit task.

## 8. Glossary pointers

| Term | Canonical location |
| --- | --- |
| Ledger key format, ledger integrity | 12_swisd-core GOSPEL D-001/D-002 |
| Dependency direction | 12_swisd-core GOSPEL D-003 |
| Test harness, README style | 12_swisd-core GOSPEL D-004/D-005 |
| Trust ledger internals | GUIDE "Trust ledger"; paths in FILETREE |
| Swarm ID / discovery | GUIDE |

## 9. Pending reminders

- Gossip transport (ledger root exchange over heartbeat) not yet wired — BACKLOG.
- Swarm task I/O over libp2p — BACKLOG section.
