/**
 * 1. Relative path: test/trust.test.ts
 * 2. Description: Unit tests for the TrustRegistry (peer/trust.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Discovery idempotency, state transitions, and key registration guarantees.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TrustRegistry } from '../src/peer/trust.js';

describe('TrustRegistry.discoverPeer', () => {
  it('creates a pending record with the discovery source', () => {
    const registry = new TrustRegistry();
    const record = registry.discoverPeer('peer-1', 'mdns');
    assert.equal(record.peerId, 'peer-1');
    assert.equal(record.state, 'pending');
    assert.equal(record.source, 'mdns');
    assert.equal(record.trustedAt, null);
  });

  it('is idempotent — the same peerId returns the same record', () => {
    const registry = new TrustRegistry();
    const first = registry.discoverPeer('peer-1', 'mdns');
    const second = registry.discoverPeer('peer-1', 'gossip');
    assert.equal(first, second);
    assert.equal(registry.getAllPeers().length, 1);
  });
});

describe('TrustRegistry.trustPeer', () => {
  it('promotes a pending peer to trusted', () => {
    const registry = new TrustRegistry();
    registry.discoverPeer('peer-1', 'usb');
    assert.equal(registry.trustPeer('peer-1'), true);
    assert.equal(registry.getPeer('peer-1')?.state, 'trusted');
    assert.notEqual(registry.getPeer('peer-1')?.trustedAt, null);
  });

  it('fails for an unknown peer', () => {
    assert.equal(new TrustRegistry().trustPeer('ghost'), false);
  });

  it('fails for an already-trusted peer', () => {
    const registry = new TrustRegistry();
    registry.discoverPeer('peer-1', 'mdns');
    registry.trustPeer('peer-1');
    assert.equal(registry.trustPeer('peer-1'), false);
  });
});

describe('TrustRegistry.rejectPeer', () => {
  it('rejects a pending peer', () => {
    const registry = new TrustRegistry();
    registry.discoverPeer('peer-1', 'gossip');
    assert.equal(registry.rejectPeer('peer-1'), true);
    assert.equal(registry.getPeer('peer-1')?.state, 'rejected');
  });

  it('fails for an unknown or already-rejected peer', () => {
    const registry = new TrustRegistry();
    assert.equal(registry.rejectPeer('ghost'), false);
    registry.discoverPeer('peer-1', 'mdns');
    registry.rejectPeer('peer-1');
    assert.equal(registry.rejectPeer('peer-1'), false);
  });
});

describe('TrustRegistry public keys', () => {
  it('registers and retrieves keys by peerId', () => {
    const registry = new TrustRegistry();
    const key = new Uint8Array([1, 2, 3]);
    registry.registerPublicKey('peer-1', key);
    assert.equal(registry.getPublicKey('peer-1'), key);
    assert.equal(registry.getPublicKey('ghost'), undefined);
  });
});

describe('TrustRegistry.getAllPeers', () => {
  it('returns every discovered peer', () => {
    const registry = new TrustRegistry();
    registry.discoverPeer('a', 'mdns');
    registry.discoverPeer('b', 'gossip');
    registry.discoverPeer('c', 'usb');
    assert.equal(registry.getAllPeers().length, 3);
  });
});
