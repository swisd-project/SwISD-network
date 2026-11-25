/**
 * 1. Relative path: test/executor.test.ts
 * 2. Description: Unit tests for the ExecutorRegistry and capability matching (executor/registry.ts, tasks/capabilities.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Registration lifecycle and capability-routing guarantees.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutorRegistry } from '../src/executor/registry.js';
import { peerSupportsExecutor } from '../src/tasks/capabilities.js';
import type { CapabilityManifest } from '../src/tasks/capabilities.js';

describe('ExecutorRegistry', () => {
  it('registers and reports support', () => {
    const registry = new ExecutorRegistry();
    registry.registerExecutor('kokoro-tts');
    assert.equal(registry.supports('kokoro-tts'), true);
    assert.equal(registry.supports('whisper'), false);
  });

  it('unregisters executors', () => {
    const registry = new ExecutorRegistry();
    registry.registerExecutor('kokoro-tts');
    registry.unregisterExecutor('kokoro-tts');
    assert.equal(registry.supports('kokoro-tts'), false);
  });

  it('unregistering an unknown type is a no-op', () => {
    const registry = new ExecutorRegistry();
    registry.unregisterExecutor('ghost');
    assert.equal(registry.getSupportedExecutors().length, 0);
  });

  it('lists registered executors without duplicates', () => {
    const registry = new ExecutorRegistry();
    registry.registerExecutor('a');
    registry.registerExecutor('a');
    assert.deepEqual(registry.getSupportedExecutors(), ['a']);
  });

  it('clears everything', () => {
    const registry = new ExecutorRegistry();
    registry.registerExecutor('a');
    registry.registerExecutor('b');
    registry.clear();
    assert.equal(registry.supports('a'), false);
    assert.equal(registry.getSupportedExecutors().length, 0);
  });
});

describe('peerSupportsExecutor', () => {
  const manifest = (types: string[]): CapabilityManifest => ({
    peerId: 'peer-1',
    availableMemoryBytes: 1024,
    supportedExecutors: types.map(type => ({ type, version: '1.0.0', moduleHash: '0xabc' })),
    lastUpdated: Date.now(),
  });

  it('matches an executor type exactly', () => {
    assert.equal(peerSupportsExecutor(manifest(['kokoro-tts', 'whisper']), 'kokoro-tts'), true);
  });

  it('rejects an unsupported type', () => {
    assert.equal(peerSupportsExecutor(manifest(['whisper']), 'kokoro-tts'), false);
  });

  it('rejects an empty manifest', () => {
    assert.equal(peerSupportsExecutor(manifest([]), 'anything'), false);
  });

  it('is case-sensitive', () => {
    assert.equal(peerSupportsExecutor(manifest(['kokoro-tts']), 'KOKORO-TTS'), false);
  });
});
