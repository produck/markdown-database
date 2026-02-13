import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import StringJsonNode from '../src/Node.mjs';

describe('::StringJsonNode()', () => {
	describe('new()', () => {
		it('should create instance', () => {
			const node = new StringJsonNode();

			assert.ok(node instanceof StringJsonNode);
		});

		it('should have default name and data', () => {
			const node = new StringJsonNode();

			assert.equal(node.name, '');
			assert.equal(node.data, null);
		});
	});

	describe('.name', () => {
		it('should be a string', () => {
			const node = new StringJsonNode();

			node.name = 'test';
			assert.strictEqual(typeof node.name, 'string');
			assert.strictEqual(node.name, 'test');
		});

		it('should accept any string value', () => {
			const node = new StringJsonNode();

			assert.strictEqual((node.name = '', node.name), '');
			assert.strictEqual((node.name = 'valid-name', node.name), 'valid-name');
			assert.strictEqual((node.name = 'with spaces', node.name), 'with spaces');
		});

		it('should enforce unique name among siblings', () => {
			const [a, b, c] = new Array(3).fill(null).map(() => new StringJsonNode());

			a.name = 'a';
			b.name = 'b';
			c.name = 'c';

			a.appendChild(b);
			a.appendChild(c);

			assert.throws(() => c.name = 'b', {
				message: /A sibling node named "b" already exists/,
			});

			assert.strictEqual(c.name, 'c');
		});
	});

	describe('.data', () => {
		it('should have default value of null', () => {
			assert.equal(new StringJsonNode().data, null);
		});

		it('should accept primitive values', () => {
			const node = new StringJsonNode();

			for (const v of [123, 0, -42.5]) {
				node.data = v;
				assert.strictEqual(node.data, v);
			}

			for (const v of [true, false]) {
				node.data = v;
				assert.strictEqual(node.data, v);
			}

			for (const v of ['string', '']) {
				node.data = v;
				assert.strictEqual(node.data, v);

			}

			node.data = null;
			assert.strictEqual(node.data, null);
		});

		it('should accept arrays', () => {
			const node = new StringJsonNode();

			for (const v of [[], [1, 2, 3], [null, 'text', 42, true]]) {
				node.data = v;
				assert.deepEqual(node.data, v);
			}
		});

		it('should accept plain objects', () => {
			const node = new StringJsonNode();

			for (const v of [
				{}, { key: 'value' },
				{ a: null, b: 123, c: true, d: 'text' },
			]) {
				node.data = v;
				assert.deepEqual(node.data, v);
			}
		});

		it('should accept nested structures', () => {
			const node = new StringJsonNode();
			const testCases = [
				{ nested: { count: 42, active: true }, items: [1, 'a', null] },
				[1, { name: 'obj' }, [1, 2]],
				{ e: {}, f: [] },
			];

			for (const v of testCases) {
				node.data = v;
				assert.deepEqual(node.data, v);
			}
		});

		it('should reject invalid types', () => {
			const node = new StringJsonNode();

			for (const v of [
				() => {},
				new Date(),
				Symbol('test'),
				undefined,
				new (class { constructor() { this.value = 42; } })(),
			]) {
				assert.throws(() => { node.data = v; }, /JsonValue/);
			}
		});

		it('should reject objects with invalid properties', () => {
			const node = new StringJsonNode();

			// Objects with invalid property values
			for (const v of [
				{ valid: 1, invalid: () => {} },
				{ valid: 'text', invalid: new Date() },
				{ nested: { valid: 1, invalid: Symbol('test') } },
				{ valid: 1, invalid: undefined },
				{ a: 1, b: 2, c: new (class {})() },
			]) {
				assert.throws(() => { node.data = v; }, /JsonValue/);
			}

			// Arrays with invalid elements
			for (const v of [
				[1, 2, () => {}],
				['a', 'b', new Date()],
				[null, true, Symbol('test')],
				[{ valid: 1 }, undefined],
				[[1, 2], 3, new (class {})()],
			]) {
				assert.throws(() => { node.data = v; }, /JsonValue/);
			}
		});
	});
});
