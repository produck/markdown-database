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

	describe('.clone()', () => {
		it('should clone a leaf node.', () => {
			const node = new StringJsonNode();

			node.name = 'foo';
			node.data = { a: 1 };

			const cloned = node.clone();

			assert.notEqual(cloned, node);
			assert.equal(cloned.name, 'foo');
			assert.deepEqual(cloned.data, { a: 1 });
			assert.equal(cloned.parent, null);
		});

		it('should deep copy data on clone.', () => {
			const node = new StringJsonNode();
			const data = { nested: { value: 42 }, list: [1, 2, 3] };

			node.data = data;

			const cloned = node.clone();

			assert.deepEqual(cloned.data, data);
			assert.notEqual(cloned.data, node.data);
			assert.notEqual(cloned.data.nested, node.data.nested);
			assert.notEqual(cloned.data.list, node.data.list);
		});

		it('should shallow clone by default.', () => {
			const parent = new StringJsonNode();
			const child = new StringJsonNode();

			parent.name = 'parent';
			child.name = 'child';
			parent.appendChild(child);

			const cloned = parent.clone();

			assert.equal(cloned.name, 'parent');
			assert.equal(cloned.hasChildNodes(), false);
		});

		it('should deep clone with children.', () => {
			const root = new StringJsonNode();
			const a = new StringJsonNode();
			const b = new StringJsonNode();

			root.name = 'root';
			a.name = 'a';
			a.data = { x: 1 };
			b.name = 'b';
			b.data = [1, 2];
			root.appendChild(a);
			root.appendChild(b);

			const cloned = root.clone(true);

			assert.notEqual(cloned, root);
			assert.equal(cloned.firstChild.name, 'a');
			assert.deepEqual(cloned.firstChild.data, { x: 1 });
			assert.notEqual(cloned.firstChild.data, a.data);
			assert.equal(cloned.lastChild.name, 'b');
			assert.deepEqual(cloned.lastChild.data, [1, 2]);
			assert.notEqual(cloned.lastChild.data, b.data);
		});

		it('should clone null data.', () => {
			const node = new StringJsonNode();

			node.name = 'test';

			const cloned = node.clone();

			assert.equal(cloned.data, null);
		});

		it('should clone primitive data.', () => {
			const node = new StringJsonNode();

			for (const v of [42, 'hello', true, false]) {
				node.data = v;

				const cloned = node.clone();

				assert.equal(cloned.data, v);
			}
		});
	});
});
