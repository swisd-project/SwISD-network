<!--
- Path: 13_swisd-network/mcp/BACKLOG.md
- Description: Work ledger for swisd-network — phases, tasks, state.
- Input: Owner tasks and completed work.
- Output: Open and done items with state markers.
- Provides: Task state. Never holds locked decisions (GOSPEL.md owns those).
-->

# SwISD-Network backlog

State markers (standard §3): `[ ]` open · `[~]` under development · `[x]` done and tested.

- [ ] Multi-user accounts.
- [ ] Per-node trust delegation.
- [ ] Trust ledger: event TTL / compaction.
- [ ] Gossip transport: ledger root exchange over heartbeat — not yet wired.

Pushed to github.com/swisd-project/SwISD-network.

## Swarm task I/O over libp2p
- [ ] Define TaskEnvelope + TaskFrame types (tasks/envelope.ts): inline vs CID input, chunk/done/failed frames
- [ ] Define Executor contract: execute(input: ReadableStream<Uint8Array>, ctx): ReadableStream<TaskFrame>
- [ ] Byte framing for TaskFrames over libp2p streams (sibling of models/framing.ts)
- [ ] Task protocol handler: node.handle('/swisd/task/1.0.0') — verify moduleHash, run executor, stream frames back
- [ ] Dispatcher: dialProtocol to trusted, capability-matching peers only (TrustRegistry + peerSupportsExecutor gate)
- [ ] Unit tests: envelope round-trip, frame decode, executor lifecycle, untrusted-dial rejection
