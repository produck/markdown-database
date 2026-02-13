import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SubConstructorProxy } from '@produck/es-abstract';

import { MockNode, MockProvider } from './mock.mjs';

import AbstractTranscriber from '../src/Abstract.mjs';
import { _I, _S } from '../src/Symbol/index.mjs';

function MockTranscriber(Node, Provider) {
	class CustomTranscriber extends AbstractTranscriber {
		[_I.PARSE.NAME](node) {
			return node.name;
		}

		[_I.PARSE.DATA]() {
			return null;
		}

		static [_S.CONSTRUCTOR.NODE] = Node;
		static [_S.CONSTRUCTOR.PROVIDER] = Provider;
	}

	return SubConstructorProxy(CustomTranscriber);
}

describe('::Parser', () => {
	describe('::ImplementedNodeConstructor()', () => {
		it('should accept a valid NodeConstructor.', () => {
			const Transcriber = MockTranscriber(MockNode, MockProvider);

			assert.equal(Transcriber[_S.CONSTRUCTOR.NODE], MockNode);
		});

		it('should throw if Node is null.', () => {
			const Transcriber = MockTranscriber(null, MockProvider);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.NODE], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "NodeConstructor" expected.',
			});
		});

		it('should throw if Node is undefined.', () => {
			const Transcriber = MockTranscriber(undefined, MockProvider);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.NODE], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "NodeConstructor" expected.',
			});
		});

		it('should throw if Node is a plain function.', () => {
			const Transcriber = MockTranscriber(() => {}, MockProvider);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.NODE], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "NodeConstructor" expected.',
			});
		});

		it('should throw if Node is a plain class.', () => {
			const Transcriber = MockTranscriber(class {}, MockProvider);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.NODE], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "NodeConstructor" expected.',
			});
		});

		it('should throw if Node is a string.', () => {
			const Transcriber = MockTranscriber('Node', MockProvider);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.NODE], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "NodeConstructor" expected.',
			});
		});

		it('should throw if Node is a number.', () => {
			const Transcriber = MockTranscriber(1, MockProvider);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.NODE], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "NodeConstructor" expected.',
			});
		});
	});

	describe('::ImplementedProviderConstructor()', () => {
		it('should accept a valid ProviderConstructor.', () => {
			const Transcriber = MockTranscriber(MockNode, MockProvider);

			assert.equal(Transcriber[_S.CONSTRUCTOR.PROVIDER], MockProvider);
		});

		it('should throw if Provider is null.', () => {
			const Transcriber = MockTranscriber(MockNode, null);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.PROVIDER], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "ProviderConstructor" expected.',
			});
		});

		it('should throw if Provider is undefined.', () => {
			const Transcriber = MockTranscriber(MockNode, undefined);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.PROVIDER], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "ProviderConstructor" expected.',
			});
		});

		it('should throw if Provider is a plain function.', () => {
			const Transcriber = MockTranscriber(MockNode, () => {});

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.PROVIDER], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "ProviderConstructor" expected.',
			});
		});

		it('should throw if Provider is a plain class.', () => {
			const Transcriber = MockTranscriber(MockNode, class {});

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.PROVIDER], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "ProviderConstructor" expected.',
			});
		});

		it('should throw if Provider is a string.', () => {
			const Transcriber = MockTranscriber(MockNode, 'Provider');

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.PROVIDER], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "ProviderConstructor" expected.',
			});
		});

		it('should throw if Provider is a number.', () => {
			const Transcriber = MockTranscriber(MockNode, 1);

			assert.throws(() => Transcriber[_S.CONSTRUCTOR.PROVIDER], {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "ProviderConstructor" expected.',
			});
		});
	});
});
