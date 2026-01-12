import * as path from 'node:path';

export class Directory {
	#location = '';

	/** @type { null | Directory } */
	#parent = null;

	constructor(parent = null) {
		this.#parent = parent;
	}

	get location() {
		/** @type {string[]} */
		const componentList = [];

		if (this.#parent !== null) {
			componentList.push(this.#parent.location);
		}

		componentList.push(this.#location);

		return path.resolve(...componentList);
	}
}
