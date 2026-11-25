/**
 * 1. Relative path: test/locator.test.ts
 * 2. Description: Unit tests for the chunk locator (tasks/locator.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Routing-table construction, ledger fallback, and orphan detection.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildChunkRoutingTable, findOrphanedChunks } from '../src/tasks/locator.js';

const cids = (n: number) => Array.from({ length: n }, (_, i) => `cid-${i}`);

describe('buildChunkRoutingTable', () => {
  it('maps each chunk index to its CID and ledger peers', () => {
    const ledger = new Map([['cid-0', new Set(['peer-a', 'peer-b'])]]);
    const table = buildChunkRoutingTable('root', 2, cids(2), ledger);
    assert.equal(table.rootCid, 'root');
    assert.equal(table.totalChunks, 2);
    assert.deepEqual([...table.chunkMap.get(0)!.availablePeers], ['peer-a', 'peer-b']);
    assert.equal(table.chunkMap.get(1)!.availablePeers.size, 0);
  });

  it('falls back to an empty peer set for unknown CIDs', () => {
    const table = buildChunkRoutingTable('root', 1, ['unknown'], new Map());
    assert.equal(table.chunkMap.get(0)!.availablePeers.size, 0);
  });

  it('rejects an empty root CID', () => {
    assert.throws(() => buildChunkRoutingTable('', 1, ['cid'], new Map()), /non-empty string/);
  });

  it('rejects a CID array length that mismatches totalChunks', () => {
    assert.throws(
      () => buildChunkRoutingTable('root', 3, cids(2), new Map()),
      /does not match totalChunks/
    );
  });

  it('rejects a negative or non-integer totalChunks', () => {
    assert.throws(() => buildChunkRoutingTable('root', -1, [], new Map()), /non-negative integer/);
    assert.throws(() => buildChunkRoutingTable('root', 1.5, [], new Map()), /non-negative integer/);
  });
});

describe('findOrphanedChunks', () => {
  it('flags chunks below the replication factor', () => {
    const ledger = new Map([
      ['cid-0', new Set(['peer-a', 'peer-b'])],
      ['cid-1', new Set(['peer-a'])],
    ]);
    const table = buildChunkRoutingTable('root', 2, cids(2), ledger);
    const orphans = findOrphanedChunks(table, 2);
    assert.equal(orphans.length, 1);
    assert.equal(orphans[0]!.cid, 'cid-1');
  });

  it('reports nothing when replication is satisfied', () => {
    const ledger = new Map([['cid-0', new Set(['peer-a', 'peer-b'])]]);
    const table = buildChunkRoutingTable('root', 1, cids(1), ledger);
    assert.equal(findOrphanedChunks(table, 2).length, 0);
  });

  it('treats unreplicated chunks as fully orphaned', () => {
    const table = buildChunkRoutingTable('root', 1, ['cid-0'], new Map());
    const orphans = findOrphanedChunks(table, 1);
    assert.equal(orphans.length, 1);
    assert.equal(orphans[0]!.availablePeers.size, 0);
  });

  it('rejects a non-positive replication factor', () => {
    const table = buildChunkRoutingTable('root', 1, ['cid-0'], new Map());
    assert.throws(() => findOrphanedChunks(table, 0), /positive integer/);
    assert.throws(() => findOrphanedChunks(table, -1), /positive integer/);
    assert.throws(() => findOrphanedChunks(table, 1.5), /positive integer/);
  });
});
