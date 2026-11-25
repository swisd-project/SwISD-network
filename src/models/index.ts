/**
 * 1. Relative path: src/models/index.ts
 * 2. Description: Barrel export for the P2P model domain — wire framing, seeder, and fetcher.
 * 3. Expects: swisd-core/models for the shared model schema, registry, and chunk path convention.
 * 4. Provides: Centralized access to the swarm-side model transfer modules.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

export * from './framing.js';
export * from './seeder.js';
export * from './fetcher.js';
