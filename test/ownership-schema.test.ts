/**
 * 1. Relative path: test/ownership-schema.test.ts
 * 2. Description: Unit tests for ownership ledger guards (ownership/schema.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Strict parser accept/reject guarantees and hex-format validation.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isEd25519PublicKeyHex,
  isEd25519SignatureHex,
  assertOwnershipLedger,
} from '../src/ownership/schema.js';

const pubKey = `0x${'ab'.repeat(32)}`;
const sig = `0x${'cd'.repeat(64)}`;

const validLedger = {
  swarmName: 'test-swarm',
  revision: 1,
  conductors: [],
  policy: 'locked',
  keystoneWorkload: 'forbidden',
  recoveryPhraseHash: '0x1234',
  successorKey: null,
  keystonePublicKey: pubKey,
  event: null,
  previousRevisionHash: null,
  updatedAt: Date.now(),
  updatedBy: pubKey,
  signature: sig,
};

describe('isEd25519PublicKeyHex', () => {
  it('accepts a 64-hex-digit 0x string', () => {
    assert.equal(isEd25519PublicKeyHex(pubKey), true);
  });

  it('rejects wrong length, uppercase, and missing prefix', () => {
    assert.equal(isEd25519PublicKeyHex(`0x${'ab'.repeat(31)}`), false);
    assert.equal(isEd25519PublicKeyHex(`0x${'AB'.repeat(32)}`), false);
    assert.equal(isEd25519PublicKeyHex(`${'ab'.repeat(32)}`), false);
  });
});

describe('isEd25519SignatureHex', () => {
  it('accepts a 128-hex-digit 0x string', () => {
    assert.equal(isEd25519SignatureHex(sig), true);
  });

  it('rejects wrong length', () => {
    assert.equal(isEd25519SignatureHex(`0x${'cd'.repeat(63)}`), false);
  });
});

describe('assertOwnershipLedger', () => {
  it('accepts a valid ledger', () => {
    const ledger = assertOwnershipLedger(validLedger);
    assert.equal(ledger.swarmName, 'test-swarm');
    assert.equal(ledger.revision, 1);
    assert.equal(ledger.policy, 'locked');
  });

  it('rejects non-objects', () => {
    assert.throws(() => assertOwnershipLedger(null), /non-null object/);
    assert.throws(() => assertOwnershipLedger('string'), /non-null object/);
  });

  it('rejects a missing or empty swarmName', () => {
    assert.throws(() => assertOwnershipLedger({ ...validLedger, swarmName: '' }), /swarmName/);
    assert.throws(() => assertOwnershipLedger({ ...validLedger, swarmName: undefined }), /swarmName/);
  });

  it('rejects a revision below 1 or non-integer', () => {
    assert.throws(() => assertOwnershipLedger({ ...validLedger, revision: 0 }), /revision/);
    assert.throws(() => assertOwnershipLedger({ ...validLedger, revision: 1.5 }), /revision/);
  });

  it('rejects an invalid policy', () => {
    assert.throws(() => assertOwnershipLedger({ ...validLedger, policy: 'anarchy' }), /policy/);
  });

  it('rejects an invalid keystoneWorkload', () => {
    assert.throws(() => assertOwnershipLedger({ ...validLedger, keystoneWorkload: 'mandatory' }), /keystoneWorkload/);
  });

  it('rejects a missing recoveryPhraseHash', () => {
    assert.throws(() => assertOwnershipLedger({ ...validLedger, recoveryPhraseHash: '' }), /recoveryPhraseHash/);
  });
});
