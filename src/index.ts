/**
 * 1. Relative path: src/index.ts
 * 2. Description: Library entrypoint for SwISD-Network — the swarm brain.
 * 3. Expects: swisd-core (file:../12_swisd-core) for config, crypto, delivery, models, observability, performance.
 * 4. Provides: Centralized access to admin, crdt, executor, models (P2P), network, ownership, peer, and tasks.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

export * from './errors.js';
export * from './types.js';
export * from './utils.js';
export * from './admin/index.js';
export * from './crdt/index.js';
export * from './executor/index.js';
export * from './models/index.js';
export * from './network/index.js';
export * from './ownership/index.js';
export * from './peer/index.js';
export * from './tasks/index.js';
