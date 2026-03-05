import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MockNode, MockProvider, TREE } from './mock.mjs';

import AbstractTranscriber from '../src/Abstract.mjs';
import { _I, _S } from '../src/Symbol.mjs';

class TestTranscriber extends AbstractTranscriber {
	[_I.TRANSFORM.NAME](node) {
		return node.name;
	}

	[_I.TRANSFORM.DATA]() {
		return null;
	}

	static [_S.CONSTRUCTOR.NODE] = MockNode;
	static [_S.CONSTRUCTOR.PROVIDER] = MockProvider;
}

describe('::Transcriber()', () => {
	describe('new()', () => {
		it('should create a transcriber.', () => {
			assert.ok(new TestTranscriber());
		});
	});

	describe('.provider', () => {
		it('should get a provider instance.', () => {
			const transcriber = new TestTranscriber();

			assert.ok(transcriber.provider instanceof MockProvider);
		});
	});

	describe('.transcribe()', () => {
		it('should transcribe a tree.', async () => {
			const transcriber = new TestTranscriber();
			const root = await transcriber.transcribe(TREE);

			assert.ok(root instanceof MockNode);
			assert.equal(root.name, 'root');
		});

		it('should build correct tree structure.', async () => {
			const transcriber = new TestTranscriber();
			const root = await transcriber.transcribe(TREE);

			assert.equal(root.name, 'root');
			assert.equal(root.firstChild.name, 'a');
			assert.equal(root.lastChild.name, 'b');
		});

		it('should build nested children.', async () => {
			const transcriber = new TestTranscriber();
			const root = await transcriber.transcribe(TREE);
			const a = root.firstChild;

			assert.equal(a.firstChild.name, 'aa');
			assert.equal(a.firstChild.nextSibling.name, 'ab');
			assert.equal(a.lastChild.name, 'ac');
		});

		it('should build deeply nested children.', async () => {
			const transcriber = new TestTranscriber();
			const root = await transcriber.transcribe(TREE);
			const ab = root.firstChild.firstChild.nextSibling;

			assert.equal(ab.name, 'ab');
			assert.equal(ab.firstChild.name, 'aba');
			assert.equal(ab.firstChild.firstChild.name, 'abaa');
			assert.equal(ab.firstChild.lastChild.name, 'abab');
			assert.equal(ab.lastChild.name, 'abb');
		});
	});

	describe('::Node', () => {
		it('should get the Node constructor.', () => {
			assert.equal(TestTranscriber.Node, MockNode);
		});
	});

	describe('::Provider', () => {
		it('should get the Provider constructor.', () => {
			assert.equal(TestTranscriber.Provider, MockProvider);
		});
	});
});
