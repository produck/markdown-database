import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Ajv from 'ajv';

import StringJsonSchemaNode from '../src/Node.mjs';
import { Implement } from '../src/Implement.mjs';
import DefaultNode from '../src/index.mjs';

describe('::StringJsonSchemaNode()', () => {
	describe('.ajv', () => {
		it('should return an Ajv instance', () => {
			const Node = Implement();

			assert.ok(Node.ajv instanceof Ajv);
		});
	});

	describe('.data', () => {
		it('should accept a valid JSON schema', () => {
			const Node = Implement();
			const node = new Node();

			node.data = { type: 'string' };
			assert.deepEqual(node.data, { type: 'string' });
		});

		it('should accept a complex JSON schema', () => {
			const Node = Implement();
			const node = new Node();

			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
					age: { type: 'number' },
				},
				required: ['name'],
			};

			node.data = schema;
			assert.deepEqual(node.data, schema);
		});

		it('should reject an invalid JSON schema', () => {
			const Node = Implement();
			const node = new Node();

			assert.throws(() => {
				node.data = { type: 'invalid-type' };
			});
		});

		it('should reject non-JSON values', () => {
			const Node = Implement();
			const node = new Node();

			for (const v of [() => {}, new Date(), Symbol('test'), undefined]) {
				assert.throws(() => { node.data = v; });
			}
		});
	});
});

describe('::implement()', () => {
	it('should return a Node class with default Ajv', () => {
		const Node = Implement();

		assert.ok(Node.ajv instanceof Ajv);
	});

	it('should accept a custom Ajv instance', () => {
		const ajv = new Ajv();
		const Node = Implement(ajv);

		assert.strictEqual(Node.ajv, ajv);
	});

	it('should throw if args[0] is not an Ajv instance', () => {
		for (const v of [{}, null, 'bad']) {
			assert.throws(() => Implement(v), {
				name: 'TypeError',
				message: /args\[0\] as ajv/,
			});
		}
	});

	it('should create a working node instance', () => {
		const Node = Implement();
		const node = new Node();

		assert.ok(node instanceof Node);
		assert.equal(node.name, '');
		assert.equal(node.data, null);
	});
});

describe('.meta', () => {
	it('should return implementation name.', () => {
		const Node = Implement();

		assert.equal(Node.meta.name, '@produck/cellulose-node-string-json-schema');
	});

	it('should return implementation version.', () => {
		const Node = Implement();

		assert.equal(Node.meta.version, '0.0.0');
	});

	it('should return implementation description.', () => {
		const Node = Implement();

		assert.equal(Node.meta.description, '');
	});
});

describe('::default export', () => {
	it('should be a valid Node class', () => {
		const node = new DefaultNode();

		assert.ok(node instanceof DefaultNode);
		assert.ok(DefaultNode.ajv instanceof Ajv);
	});
});
