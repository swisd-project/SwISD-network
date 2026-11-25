# SwISD-Network

Swarm brain library, carved out of the [SwISD testbed](https://github.com/hideosnes/SwISD): libp2p networking, CRDTs, peer trust, ownership, task routing, and the node admin API. Consumes [SwISD-Core](https://github.com/swisd-project/SwISD-Core) for config, crypto, delivery, models, observability, performance.

## Modules

| Path | Contents |
| --- | --- |
| `src/network` | libp2p node, discovery, router (gossip + egress tunnel), bloom, health |
| `src/crdt` | Merkle, reputation log, structures |
| `src/peer` | Trust registry |
| `src/ownership` | Keystone, anchors, succession, recovery rate limiter |
| `src/executor` | Registry |
| `src/tasks` | Capabilities, lifecycle, locator, ingestion |
| `src/admin` | Token-guarded HTTP API + swarm snapshot builder |
| `src/models` | P2P model transfer: wire framing, seeder, fetcher |
| `src/errors.ts`, `src/types.ts`, `src/utils.ts` | Shared |

## Requirements

- Node >= 22
- Dependencies: libp2p 3.3.9 + `@libp2p/*` (tcp, mdns, gossipsub, noise, yamux, ping, peer-id, interface), `bonjour-service`.
- **Build-time prerequisite:** `swisd-core` is a local dependency (`file:../12_swisd-core`). The `12_swisd-core` checkout must sit next to this one, built (`npm run build` there first), before `npm install` / `npm run build` here.
- TypeScript, strict, NodeNext. Strict ESM.

## Install / build

```sh
npm install
npm run build   # tsc
```

`npm test` is a placeholder — no test suite yet.

## Usage

Subpath exports: `./admin`, `./crdt`, `./executor`, `./models`, `./network`, `./ownership`, `./peer`, `./tasks`. The root barrel exports 80 symbols.

P2P model chunk wire protocol: `/swisd/model/1.1.0` (`src/models/framing.ts`).

```ts
import { createSwISDNode } from 'swisd-network/network';
import { TrustRegistry } from 'swisd-network/peer';
```

## License

MPL-2.0.
