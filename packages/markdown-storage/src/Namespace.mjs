import { Directory } from './Directory.mjs';

export class NamespaceSchema {

}

export class ItemSchema {

}

export class Namespace extends EventTarget {
	/** @type {Directory | null} */
	#directory;

	constructor(directory) {
		super();

		this.#directory = directory;
	}

	#schema = {
		self: null,
		item: null,
	};

	get isItem() {
		return this.#schema.item !== null;
	}

	async check() {

	}

	static from
}
