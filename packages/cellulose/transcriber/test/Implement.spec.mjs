import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MockNode, MockProvider, TREE } from './mock.mjs';

import { Implement } from '../src/Implement.mjs';

function FullOptions() {
	return {
		node: MockNode,
		provider: MockProvider,
		transformer: {
			name: (node) => node.name,
			data: () => null,
		},
	};
}

describe('::Implement()', () => {
	it('should throw if bad "args[0] as options".', () => {
		assert.throws(() => Implement(null), {
			name: 'TypeError',
			message: 'Invalid "args[0] as options", one "plain object" expected.',
		});
	});

	it('should throw if bad "args[0].node".', () => {
		const sample = FullOptions();

		sample.node = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].node", one "NodeConstructor" expected.',
		});
	});

	it('should throw if "args[0].node" is a plain class.', () => {
		const sample = FullOptions();

		sample.node = class {};

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].node", one "NodeConstructor" expected.',
		});
	});

	it('should throw if bad "args[0].provider".', () => {
		const sample = FullOptions();

		sample.provider = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].provider", one "ProviderConstructor" expected.',
		});
	});

	it('should throw if "args[0].provider" is a plain class.', () => {
		const sample = FullOptions();

		sample.provider = class {};

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].provider", one "ProviderConstructor" expected.',
		});
	});

	it('should throw if bad "args[0].transformer".', () => {
		const sample = FullOptions();

		sample.transformer = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].transformer", one "plain object" expected.',
		});
	});

	it('should throw if bad "args[0].transformer.name".', () => {
		const sample = FullOptions();

		sample.transformer.name = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].transformer.name", one "function" expected.',
		});
	});

	it('should throw if bad "args[0].transformer.data".', () => {
		const sample = FullOptions();

		sample.transformer.data = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].transformer.data", one "function" expected.',
		});
	});

	it('should get ImplementedTranscriber.', () => {
		const Transcriber = Implement(FullOptions());

		assert.equal(typeof Transcriber, 'function');
	});

	it('should create a transcriber instance.', () => {
		const Transcriber = Implement(FullOptions());
		const transcriber = new Transcriber();

		assert.ok(transcriber);
	});

	it('should transcribe a tree.', async () => {
		const Transcriber = Implement(FullOptions());
		const transcriber = new Transcriber();
		const root = await transcriber.transcribe(TREE);

		assert.ok(root instanceof MockNode);
		assert.equal(root.name, 'root');
	});

	it('should build correct tree structure.', async () => {
		const Transcriber = Implement(FullOptions());
		const transcriber = new Transcriber();
		const root = await transcriber.transcribe(TREE);

		assert.equal(root.name, 'root');
		assert.equal(root.firstChild.name, 'a');
		assert.equal(root.lastChild.name, 'b');
	});

	it('should pass node and name to transformer.data.', async () => {
		const received = [];

		const sample = FullOptions();

		sample.transformer.data = (node, name) => {
			received.push({ node, name });

			return null;
		};

		const Transcriber = Implement(sample);
		const transcriber = new Transcriber();

		await transcriber.transcribe(TREE);

		assert.ok(received.length > 0);
		assert.equal(received[0].name, 'root');
	});
});
