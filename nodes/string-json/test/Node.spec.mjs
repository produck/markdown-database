import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import StringJsonNode from '../src/Node.mjs';

describe('::StringJsonNode()', () => {
	it('should create instance', () => {
		const node = new StringJsonNode();

		assert.ok(node instanceof StringJsonNode);
	});

	it('should have default name and data', () => {
		const node = new StringJsonNode();

		assert.equal(node.name, '');
		assert.equal(node.data, null);
	});

	it('should validate name as string', () => {
		const node = new StringJsonNode();

		assert.strictEqual(typeof node.name, 'string');
	});

	it('should validate data as JSON serializable', () => {
		const node = new StringJsonNode();

		// Valid values: null
		node.data = null;
		assert.strictEqual(node.data, null);

		// Valid values: number
		node.data = 123;
		assert.strictEqual(node.data, 123);

		node.data = 0;
		assert.strictEqual(node.data, 0);

		node.data = -42.5;
		assert.strictEqual(node.data, -42.5);

		// Valid values: boolean
		node.data = true;
		assert.strictEqual(node.data, true);

		node.data = false;
		assert.strictEqual(node.data, false);

		// Valid values: string
		node.data = 'string';
		assert.strictEqual(node.data, 'string');

		node.data = '';
		assert.strictEqual(node.data, '');

		// Valid values: plain object
		node.data = { key: 'value' };
		assert.deepEqual(node.data, { key: 'value' });

		node.data = { nested: { count: 42, active: true }, items: [1, 'a', null] };
		assert.deepEqual(node.data, { nested: { count: 42, active: true }, items: [1, 'a', null] });

		node.data = { a: null, b: 123, c: true, d: 'text', e: {}, f: [] };
		assert.deepEqual(node.data, { a: null, b: 123, c: true, d: 'text', e: {}, f: [] });

		// Valid values: array
		node.data = [1, 2, 3];
		assert.deepEqual(node.data, [1, 2, 3]);

		node.data = [null, 'text', 42, true, { name: 'obj' }, [1, 2]];
		assert.deepEqual(node.data, [null, 'text', 42, true, { name: 'obj' }, [1, 2]]);

		// Valid values: empty object and array
		node.data = {};
		assert.deepEqual(node.data, {});

		node.data = [];
		assert.deepEqual(node.data, []);
	});
});
