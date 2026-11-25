/**
 * 1. Relative path: test/reputation.test.ts
 * 2. Description: Unit tests for the read-time reputation projection (crdt/reputation.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Decay math, neutral defaults, clock-skew protection, and parameter guards.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReputationScore } from '../src/crdt/reputation.js';

const HOUR = 3600000;
const event = (outcome: 'success' | 'failure', hoursAgo: number, timestamp = Date.now() - hoursAgo * HOUR) => ({
  eventId: `e-${outcome}-${hoursAgo}`,
  authorPeerId: 'author',
  targetPeerId: 'target',
  outcome,
  latencyMs: 100,
  timestamp,
  signature: new Uint8Array(64),
});

describe('calculateReputationScore', () => {
  it('returns 0.5 for an empty event set (neutral default)', () => {
    assert.equal(calculateReputationScore([], Date.now()), 0.5);
  });

  it('returns 1.0 for a single recent success', () => {
    assert.equal(calculateReputationScore([event('success', 0)], Date.now()), 1.0);
  });

  it('returns 0.0 for a single recent failure', () => {
    assert.equal(calculateReputationScore([event('failure', 0)], Date.now()), 0.0);
  });

  it('weights recent events more than old ones', () => {
    const now = Date.now();
    const recent = event('success', 0, now);
    const ancient = event('failure', 100, now - 100 * HOUR);
    const score = calculateReputationScore([recent, ancient], now);
    assert.ok(score > 0.5, `recent success should dominate: ${score}`);
  });

  it('a 50/50 mix of recent events yields 0.5', () => {
    const now = Date.now();
    const score = calculateReputationScore(
      [event('success', 0, now), event('failure', 0, now)],
      now
    );
    assert.ok(Math.abs(score - 0.5) < 1e-9);
  });

  it('ignores future-dated events (clock skew protection)', () => {
    const now = Date.now();
    const future = event('failure', -10, now + 10 * HOUR);
    assert.equal(calculateReputationScore([future], now), 0.5);
  });

  it('ignores non-finite timestamps', () => {
    const bad = { ...event('failure', 0), timestamp: Number.NaN };
    assert.equal(calculateReputationScore([bad], Date.now()), 0.5);
  });

  it('rejects a decay factor outside (0, 1]', () => {
    assert.throws(() => calculateReputationScore([event('success', 0)], Date.now(), 0), /range \(0, 1\]/);
    assert.throws(() => calculateReputationScore([event('success', 0)], Date.now(), 1.5), /range \(0, 1\]/);
    assert.throws(() => calculateReputationScore([event('success', 0)], Date.now(), Number.NaN), /range \(0, 1\]/);
  });

  it('rejects a non-positive time unit', () => {
    assert.throws(() => calculateReputationScore([event('success', 0)], Date.now(), 0.99, 0), /positive finite/);
    assert.throws(() => calculateReputationScore([event('success', 0)], Date.now(), 0.99, -1), /positive finite/);
  });

  it('rejects a non-finite now timestamp', () => {
    assert.throws(() => calculateReputationScore([event('success', 0)], Number.NaN), /finite timestamp/);
  });

  it('decay factor 1 disables decay entirely', () => {
    const now = Date.now();
    const score = calculateReputationScore(
      [event('success', 0, now), event('failure', 1000, now - 1000 * HOUR)],
      now,
      1
    );
    assert.equal(score, 0.5);
  });
});
