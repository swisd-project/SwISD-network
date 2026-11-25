/**
 * 1. Relative path: test/merkle.test.ts
 * 2. Description: Unit tests for Merkle-DAG primitives (crdt/merkle.ts).
 * 3. Expects: node:test runner.
 * 4. Provides: Content-addressing, determinism, domain separation, and inclusion-proof verification.
 * 5. SPDX-License-Identifier: MPL-2.0
 * 6. Copyright (c) 2026 Homahuki GmbH
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createLeafNode, createInternalNode, verifyInclusionProof } from '../src/crdt/merkle.js';

const enc = (s: string) => new TextEncoder().encode(s);
const sha256 = (data: Uint8Array) => createHash('sha256').update(data).digest('hex');

describe('createLeafNode', () => {
  it('content-addresses leaf data with the 0x00 domain prefix', () => {
    const leaf = createLeafNode(enc('payload'));
    assert.equal(leaf.cid, sha256(new Uint8Array([0x00, ...enc('payload')])));
    assert.deepEqual(leaf.links, []);
    assert.deepEqual([...leaf.data!], [...enc('payload')]);
  });

  it('produces different cids for different data', () => {
    assert.notEqual(createLeafNode(enc('a')).cid, createLeafNode(enc('b')).cid);
  });

  it('is deterministic for the same data', () => {
    assert.equal(createLeafNode(enc('same')).cid, createLeafNode(enc('same')).cid);
  });
});

describe('createInternalNode', () => {
  it('content-addresses sorted links with the 0x01 domain prefix', () => {
    const a = createLeafNode(enc('a')).cid;
    const b = createLeafNode(enc('b')).cid;
    const internal = createInternalNode([a, b]);
    const sorted = [a, b].sort().join('');
    assert.equal(internal.cid, sha256(new Uint8Array([0x01, ...enc(sorted)])));
    assert.deepEqual(internal.links, [a, b].sort());
  });

  it('hashes deterministically regardless of link order', () => {
    const a = createLeafNode(enc('a')).cid;
    const b = createLeafNode(enc('b')).cid;
    const c = createLeafNode(enc('c')).cid;
    assert.equal(createInternalNode([a, b, c]).cid, createInternalNode([c, a, b]).cid);
  });

  it('leaf and internal domains never collide', () => {
    // Leaf 0x00 + "x" can never equal internal 0x01 + anything.
    const leaf = createLeafNode(enc('x'));
    const internal = createInternalNode([leaf.cid]);
    assert.notEqual(leaf.cid, internal.cid);
  });
});

describe('verifyInclusionProof', () => {
  it('verifies a valid single-step proof', () => {
    const left = createLeafNode(enc('left'));
    const right = createLeafNode(enc('right'));
    const root = createInternalNode([left.cid, right.cid]);
    const proof = [{ sibling: right.cid, isLeft: false }];
    assert.equal(verifyInclusionProof(left.data!, proof, root.cid), true);
  });

  it('rejects a proof against the wrong root', () => {
    const left = createLeafNode(enc('left'));
    const right = createLeafNode(enc('right'));
    const root = createInternalNode([left.cid, right.cid]);
    const forged = createLeafNode(enc('forged'));
    const proof = [{ sibling: right.cid, isLeft: false }];
    assert.equal(verifyInclusionProof(forged.data!, proof, root.cid), false);
  });

  it('rejects a tampered sibling', () => {
    const left = createLeafNode(enc('left'));
    const right = createLeafNode(enc('right'));
    const root = createInternalNode([left.cid, right.cid]);
    const proof = [{ sibling: sha256(enc('evil')), isLeft: false }];
    assert.equal(verifyInclusionProof(left.data!, proof, root.cid), false);
  });

  it('rejects an empty proof unless the leaf IS the root', () => {
    const leaf = createLeafNode(enc('solo'));
    // A single-leaf tree: root would be the leaf cid itself (no internal nodes).
    assert.equal(verifyInclusionProof(leaf.data!, [], leaf.cid), true);
    assert.equal(verifyInclusionProof(createLeafNode(enc('other')).data!, [], leaf.cid), false);
  });
});
