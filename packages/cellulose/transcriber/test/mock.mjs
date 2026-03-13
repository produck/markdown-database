import * as Node from '@produck/cellulose-node';
import * as Provider from '@produck/cellulose-provider';

export class MockNode extends Node.Implement({
	meta: {
		name: 'MockNode',
		version: '0.0.0',
		description: 'A mock node.',
	},
	name: {
		init: () => '',
		description: 'string',
		isValid: (value) => typeof value === 'string',
		equal: (a, b) => a === b,
		toString: (name) => name,
		clone: (name) => name,
	},
	data: {
		init: () => null,
		description: 'any',
		isValid: () => true,
		clone: (data) => data,
	},
}) {
	/** NO MEMBERS */
}

export const TREE = {
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

export class MockProvider extends Provider.Implement({
	meta: {
		name: 'MockProvider',
		version: '0.0.0',
		description: 'A mock provider.',
	},
	origin: {
		isValid: (value) => typeof value === 'object' && value !== null,
		description: 'TreeNode',
	},
	node: {
		isValid: (value) => typeof value === 'object' && value !== null,
		description: 'object',
	},
	async *steps(origin, provider) {
		async function *visit(node) {
			const step = provider.createStep({ name: node.name });

			yield step.enter();

			for (const child of node.children ?? []) {
				yield * visit(child);
			}

			yield step.leave();
		}

		yield * visit(origin);
	},
}) {
	/** NO MEMBERS */
}
