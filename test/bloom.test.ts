/**
 * 1. Relative path: test/bloom.test.ts
 * 2. Description: Unit tests for the Bloom-filter TTL (network/bloom.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Creation guards, membership truth, and false-positive boundedness.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createBloomFilter, addToBloomFilter, mightContain } from '../src/network/bloom.js';

describe('createBloomFilter', () => {
  it('rejects non-positive dimensions', () => {
    assert.throws(() => createBloomFilter(0, 3), /strictly positive/);
    assert.throws(() => createBloomFilter(64, 0), /strictly positive/);
    assert.throws(() => createBloomFilter(-1, -1), /strictly positive/);
  });

  it('creates an empty filter of the requested size', () => {
    const filter = createBloomFilter(64, 3);
    assert.equal(filter.filter.length, 64);
    assert.equal(filter.hashFunctionsCount, 3);
    assert.ok(filter.filter.every(b => b === 0));
  });
});

describe('addToBloomFilter / mightContain', () => {
  it('reports inserted values as present', () => {
    let filter = createBloomFilter(128, 3);
    filter = addToBloomFilter(filter, 'peer-abc');
    assert.equal(mightContain(filter, 'peer-abc'), true);
  });

  it('never reports unknown values as present when the filter is empty', () => {
    const filter = createBloomFilter(128, 3);
    assert.equal(mightContain(filter, 'nothing-here'), false);
  });

  it('does not mutate the original filter (returns a copy)', () => {
    const original = createBloomFilter(128, 3);
    const updated = addToBloomFilter(original, 'peer-abc');
    assert.ok(original.filter.every(b => b === 0));
    assert.notEqual(original.filter, updated.filter);
  });

  it('keeps false positives low for a small set in a generous filter', () => {
    let filter = createBloomFilter(4096, 4);
    const inserted: string[] = [];
    for (let i = 0; i < 50; i++) {
      const id = `peer-${i}`;
      inserted.push(id);
      filter = addToBloomFilter(filter, id);
    }
    let falsePositives = 0;
    for (let i = 50; i < 500; i++) {
      if (mightContain(filter, `peer-${i}`)) falsePositives++;
    }
    // 4kB filter, 4 hashes, 50 items: FP rate ~1.4% — allow generous margin.
    assert.ok(falsePositives < 25, `too many false positives: ${falsePositives}`);
  });

  it('inserted values survive many subsequent insertions', () => {
    let filter = createBloomFilter(4096, 4);
    for (let i = 0; i < 100; i++) filter = addToBloomFilter(filter, `peer-${i}`);
    assert.equal(mightContain(filter, 'peer-0'), true);
    assert.equal(mightContain(filter, 'peer-99'), true);
  });
});
