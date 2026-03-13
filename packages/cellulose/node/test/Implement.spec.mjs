import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Implement } from '../src/Implement.mjs';

function FullOptions() {
	return {
		meta: {
			name: '',
			version: '',
			description: '',
		},
		name: {
			init: () => {},
			description: '',
			isValid: (v) => v !== 'bad',
			equal: (a, b) => a === b,
			toString: (v) => v,
			clone: (v) => v,
		},
		data: {
			init: () => null,
			description: '',
			isValid: (v) => v !== 'bad',
			clone: (v) => v,
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

	it('should throw if bad "args[0].meta".', () => {
		const sample = FullOptions();

		sample.meta = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].meta", one "plain object" expected.',
		});
	});

	it('should throw if bad "args[0].meta.name".', () => {
		const sample = FullOptions();

		sample.meta.name = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].meta.name", one "string" expected.',
		});
	});

	it('should throw if bad "args[0].meta.version".', () => {
		const sample = FullOptions();

		sample.meta.version = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].meta.version", one "string" expected.',
		});
	});

	it('should throw if bad "args[0].meta.description".', () => {
		const sample = FullOptions();

		sample.meta.description = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].meta.description", one "string" expected.',
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

	it('should throw if bad "args[0].name.clone".', () => {
		const sample = FullOptions();

		sample.name.clone = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].name.clone", one "function" expected.',
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

	it('should throw if bad "args[0].data.clone".', () => {
		const sample = FullOptions();

		sample.data.clone = [];

		assert.throws(() => Implement(sample), {
			name: 'TypeError',
			message: 'Invalid "args[0].data.clone", one "function" expected.',
		});
	});

	it('should get correct meta from Implement.', () => {
		const options = FullOptions();

		options.meta.name = 'TestNode';
		options.meta.version = '1.2.3';
		options.meta.description = 'A test node.';
		options.name.description = 'string';
		options.data.description = 'JsonValue';

		const Node = Implement(options);

		assert.deepEqual(Node.meta, {
			name: 'TestNode',
			version: '1.2.3',
			description: 'A test node.',
			node: {
				name: 'string',
				data: 'JsonValue',
			},
		});
	});

	it('should get ImplementedNode.', () => {
		const FullOptionsNode = Implement(FullOptions());

		const parent = new FullOptionsNode();
		const childFoo = new FullOptionsNode();
		const childBar = new FullOptionsNode();

		childFoo.name = 'foo';
		childBar.name = 'bar';
		parent.appendChild(childFoo);
		parent.appendChild(childBar);

		assert.throws(() => parent.name = 'bad');
		assert.throws(() => parent.data = 'bad');
		assert.throws(() => childBar.name = 'foo');
	});
});
