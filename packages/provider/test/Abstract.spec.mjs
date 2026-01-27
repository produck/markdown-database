import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import AbstractProvider, { _I, _S } from '../src/Abstract.mjs';

const root = {
	name: 'root',
	children: [{
		name: 'a',
		children: [{
			name: 'aa',
		}, {
			name: 'ab',
			children: [{
				name: 'aba',
				children: [{
					name: 'abaa',
				}, {
					name: 'abab',
				}],
			}, {
				name: 'abb',
			}],
		}, {
			name: 'ac',
		}],
	}, {
		name: 'b',
	}],
};

class MockDirectoryProvider extends AbstractProvider {
	async *[_I.STEPS](origin) {
		const step = this.createStep(origin.name);

		yield step.enter();

		for await (const child of (origin.children ?? [])) {
			yield * this[_I.STEPS](child);
		}

		yield step.leave();
	}

	static get [_S.ORIGIN.DESCRIPTION]() {
		return 'node';
	}

	static [_S.ORIGIN.IS_VALID](value) {
		return typeof value === 'object' && value !== null;
	}

	static get [_S.NODE.DESCRIPTION]() {
		return 'string';
	}

	static [_S.NODE.IS_VALID](value) {
		return typeof value === 'string';
	}
}

describe('::AbstractDirectoryProvider()', () => {
	describe('new()', () => {
		it('should create a provider.', () => {
			assert.ok(new MockDirectoryProvider());
		});
	});

	describe('::isOrigin()', () => {
		it('should get false.', () => {
			assert.equal(MockDirectoryProvider.isOrigin(null), false);
		});

		it('should get true.', () => {
			assert.equal(MockDirectoryProvider.isOrigin({}), true);
		});
	});

	describe('::isNode()', () => {
		it('should get false.', () => {
			assert.equal(MockDirectoryProvider.isNode(null), false);
		});

		it('should get true.', () => {
			assert.equal(MockDirectoryProvider.isNode(''), true);
		});
	});

	describe('.createStep()', () => {
		it('should throw if bad origin.', () => {
			const provider = new MockDirectoryProvider();

			assert.throws(() => provider.createStep(null), {
				name: 'TypeError',
				message: 'Invalid "args[0] as node", one "string" expected.',
			});
		});

		it('should get a step.', () => {
			const provider = new MockDirectoryProvider();

			assert.ok(provider.createStep('foo'));
		});
	});

	describe('.seek()', () => {
		it('should throw if bad origin.', () => {
			const provider = new MockDirectoryProvider();

			assert.throws(() => provider.seek(null), {
				name: 'TypeError',
				message: 'Invalid "args[0] as origin", one "node" expected.',
			});
		});

		it('should get steps.', async () => {
			const provider = new MockDirectoryProvider();
			const list = [];

			for await (const { node, action } of provider.seek(root)) {
				list.push({ node, action });
			}

			assert.deepEqual(list, [
				{ node: 'root', action: true },
				{ node: 'a', action: true },
				{ node: 'aa', action: true },
				{ node: 'aa', action: false },
				{ node: 'ab', action: true },
				{ node: 'aba', action: true },
				{ node: 'abaa', action: true },
				{ node: 'abaa', action: false },
				{ node: 'abab', action: true },
				{ node: 'abab', action: false },
				{ node: 'aba', action: false },
				{ node: 'abb', action: true },
				{ node: 'abb', action: false },
				{ node: 'ab', action: false },
				{ node: 'ac', action: true },
				{ node: 'ac', action: false },
				{ node: 'a', action: false },
				{ node: 'b', action: true },
				{ node: 'b', action: false },
				{ node: 'root', action: false },
			]);
		});
	});
});
