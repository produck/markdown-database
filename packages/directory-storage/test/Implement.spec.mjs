import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Implement } from '../src/Implement.mjs';

function FullOptions() {
	return {
		name: {
			model: '',
			init: () => {},
			description: '',
			isValid: (v) => v !== 'bad',
			equal: (a, b) => a === b,
			toString: (v) => v,
		},
		data: {
			model: '',
			init: () => null,
			description: '',
			isValid: (v) => v !== 'bad',
		},
	};
}

describe('::Implement()', () => {
	it('should throw if bad "args[0]".', () => {
		assert.throws(() => Implement(null), {
			name: 'TypeError',
			message: 'Invalid "args[0]", one "plain object" expected.',
		});
	});

	it('should throw if bad "args[0].name".', () => {
		const sample = FullOptions();

		sample.name = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name", one "plain object" expected.',
		});
	});

	it('should throw if bad "args[0].name.model".', () => {
		const sample = FullOptions();

		sample.name.model = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.model", one "string" expected.',
		});
	});

	it('should throw if bad "args[0].name.init".', () => {
		const sample = FullOptions();

		sample.name.init = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.init", one "function" expected.',
		});
	});

	it('should throw if bad "args[0].name.description".', () => {
		const sample = FullOptions();

		sample.name.description = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.description", one "string" expected.',
		});
	});

	it('should throw if bad "args[0].name.isValid".', () => {
		const sample = FullOptions();

		sample.name.isValid = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.isValid", one "function" expected.',
		});
	});

	it('should throw if bad "args[0].name.equal".', () => {
		const sample = FullOptions();

		sample.name.equal = null;

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.equal", one "function" expected.',
		});
	});

	it('should throw if bad "args[0].name.toString".', () => {
		const sample = FullOptions();

		sample.name.toString = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.toString", one "function" expected.',
		});
	});

	it('should throw if bad "args[0].data".', () => {
		const sample = FullOptions();

		sample.data = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].data", one "plain object" expected.',
		});
	});

	it('should throw if bad "args[0].data.model".', () => {
		const sample = FullOptions();

		sample.data.model = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].data.model", one "string" expected.',
		});
	});

	it('should throw if bad "args[0].data.init".', () => {
		const sample = FullOptions();

		sample.data.init = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].data.init", one "function" expected.',
		});
	});

	it('should throw if bad "args[0].data.description".', () => {
		const sample = FullOptions();

		sample.data.description = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].data.description", one "string" expected.',
		});
	});

	it('should throw if bad "args[0].data.isValid".', () => {
		const sample = FullOptions();

		sample.data.isValid = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].data.isValid", one "function" expected.',
		});
	});

	it('should get ImplementdDirectory.', () => {
		const FullOptionsDirectory = Implement(FullOptions());

		assert.ok(FullOptionsDirectory.model);

		const parent = new FullOptionsDirectory();
		const childFoo = new FullOptionsDirectory();
		const childBar = new FullOptionsDirectory();

		childFoo.name = 'foo';
		childBar.name = 'bar';
		parent.appendChild(childFoo);
		parent.appendChild(childBar);

		assert.throws(() => parent.name = 'bad');
		assert.throws(() => parent.data = 'bad');
		assert.throws(() => childBar.name = 'foo');
	});
});
