import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Implement } from '../src/Implement.mjs';

function FullOptions() {
	return {
		node: {
			isValid: () => true,
			description: 'node',
		},
		origin: {
			isValid: () => true,
			description: 'origin',
		},
		steps: async function * (_origin, provider) {
			const step = provider.createStep({});
			yield step.enter();
			yield step.leave();
		},
	};
}

describe('::Implement()', () => {
	it('should throw if bad args[0].', () => {
		assert.throws(() => Implement(null), {
			name: 'TypeError',
			message: 'Invalid "args[0] as options", one "plain object" expected.',
		});
	});

	it('should throw if bad args[0].node', () => {
		const sample = FullOptions();

		sample.node = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].node", one "plain object" expected.',
		});
	});

	it('should throw if bad args[0].node.isValid', () => {
		const sample = FullOptions();

		sample.node.isValid = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].node.isValid", one "function" expected.',
		});
	});

	it('should throw if bad args[0].node.description', () => {
		const sample = FullOptions();

		sample.node.description = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].node.description", one "string" expected.',
		});
	});

	it('should throw fi bad args[0].origin', () => {
		const sample = FullOptions();

		sample.origin = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].origin", one "plain object" expected.',
		});
	});

	it('should throw if bad args[0].origin.isValid', () => {
		const sample = FullOptions();

		sample.origin.isValid = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].origin.isValid", one "function" expected.',
		});
	});

	it('should throw if bad args[0].origin.description', () => {
		const sample = FullOptions();

		sample.origin.description = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].origin.description", one "string" expected.',
		});
	});

	it('should throw if bad args[0].steps', () => {
		const sample = FullOptions();

		sample.steps = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].steps", one "(origin, provider) => Generator<Step>" expected.',
		});
	});

	it('should get ImplementedProvider', async () => {
		const Provider = Implement(FullOptions());

		assert.equal(typeof Provider, 'function');
		assert.equal(Provider.isOrigin({}), true);
		assert.equal(Provider.isNode({}), true);

		const provider = new Provider();
		const states = [];

		for await (const state of provider.seek({})) {
			states.push(state);
		}

		assert.equal(states.length, 2);
		assert.equal(states[0].action, true);
		assert.equal(states[1].action, false);
	});
});
