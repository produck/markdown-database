import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Step, isStep } from '../src/Step.mjs';

describe('::Step', () => {
	describe('new()', () => {
		it('should throw if no arguments.', () => {
			assert.throws(() => new Step(), {
				name: 'Error',
				message: 'There MUST be only 1 argument(as node).',
			});
		});

		it('should create a step.', () => {
			new Step(null);
		});
	});

	describe('.state', () => {
		it('should get 2 state of 1 step.', () => {
			const step = new Step(null);

			assert.notEqual(step.state, step.state);
		});
	});

	describe('.enter()', () => {
		it('should make .action=true', () => {
			const step = new Step(null);

			assert.equal(step.enter().state.action, true);
		});
	});

	describe('.leave()', () => {
		it('should make .action=false', () => {
			const step = new Step(null);

			assert.equal(step.leave().state.action, false);
		});
	});

	describe('.action()', () => {
		it('should throw if bad value.', () => {
			const step = new Step(null);

			assert.throws(() => step.action(null), {
				name: 'TypeError',
				message: 'Invalid "step.action=", one "symbol" expected.',
			});
		});

		it('should set a custom action.', () => {
			const action = Symbol();
			const step = new Step(null);

			assert.equal(step.action(action).state.action, action);
		});
	});
});

describe('::isStep()', () => {
	it('should get true.', () => {
		assert.equal(isStep(new Step(null)), true);
	});

	it('should get false.', () => {
		assert.equal(isStep(null), false);
	});
});
