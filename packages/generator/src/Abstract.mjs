import Abstract, { Member as M } from '@produck/es-abstract';
import * as Parser from './Parser.mjs';

const ENTER = true;
const LEAVE = false;

const I = {
	DIRECTORY_CONSTRUCTOR: Symbol('.#Directory'),
	PROVIDER: Symbol('.#provider'),
};

const _S = {
	DIRECTORY_CONSTRUCTOR: Symbol('::_Directory'),
	PROVIDER_CONSTRUCTOR: Symbol('::_Provider'),
};

export default Abstract(class DirectorGenerator {
	constructor() {
		this[I.DIRECTORY_CONSTRUCTOR] = new.target;
	}

	async generate() {
		/**
		 * @type {import('@produck/cellulose-node').DirectoryConstructor}
		 */
		const Directory = this[I.DIRECTORY_CONSTRUCTOR];
		const root = new Directory();
		const stack = [];
		let current = root;

		for await (const step of this[I.PROVIDER].seek()) {
			if (step.action === ENTER) {
				const child = new Directory();

				child.name = step.node.name;
				child.data = step.node.data;
				current.appendChild(child);
				current = child;
				stack.push(step);
			}

			if (step.action === LEAVE) {
				if (stack.pop() !== step) {
					throw new Error('Bad Implementation, Not paired.');
				}
			}

			throw new Error('Bad Implementation. Undefined action.');
		}
	}
}, ...[
	Abstract.Static({
		[_S.DIRECTORY_CONSTRUCTOR]: Parser.ImplementedDirectoryConstructor,
	}),
]);
