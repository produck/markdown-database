function assertDirectoryName(value, role) {
	if (typeof value !== 'string') {
		throw new TypeError(`Invalid "${role}", one "string" excepted.`);
	}
}

function assertDirectory(value, role) {
	if (!Directory.isDirectory(value)) {
		throw new TypeError(`Invalid "${role}", one "Directory" expected.`);
	}
}

const SYMBOL = {
	SET_PARENT: Symbol('Directory.setParent()'),
};

export const ENTER = Symbol('VisitActionEnter');
export const LEAVE = Symbol('VisitActionLeave');

export default class Directory {
	/** @type {Directory | null} */
	#parent = null;

	get parent() {
		return this.#parent;
	}

	[SYMBOL.SET_PARENT](value) {
		this.#parent = value;
	}

	#name = '';

	get name() {
		return this.#name;
	}

	set name(value) {
		assertDirectoryName(value, 'assigned value');

		if (this.#parent !== null && this.#parent.hasChild(value)) {
			throw new Error(`One sibling directory named "${value}" has been existed.`);
		}

		this.#name = value;
	}

	#data = null;

	get data() {
		return this.#data;
	}

	set data(value) {
		this.#data = value;
	}

	/** @type {Directory[]} */
	#children = [];

	#hasChild(name) {
		for (const child of this.#children) {
			if (child.name === name) {
				return true;
			}
		}

		return false;
	}

	hasChild(name) {
		assertDirectoryName(name, 'args[0]');

		return this.#hasChild(name);
	}

	/** @param {Directory} directory */
	#appendChild(directory) {
		if (this.#children.includes(directory)) {
			return directory;
		}

		if (this.#hasChild(directory.name)) {
			throw new Error(`One child named "${directory.name}" has been existed.`);
		}

		this.#children.push(directory);
		directory[SYMBOL.SET_PARENT](this);

		return directory;
	}

	/** @param {Directory} directory */
	appendChild(directory) {
		assertDirectory(directory, 'args[0]');

		return this.#appendChild(directory);
	}

	/** @param {Directory} directory */
	#removeChild(directory) {
		const index = this.#children.indexOf(directory);

		if (index < 0) {
			throw new Error('The directory to be removed is not a child of this directory.');
		}

		this.#children.splice(index, 1);
		directory[SYMBOL.SET_PARENT](null);

		return directory;
	}

	removeChild(directory) {
		assertDirectory(directory, 'args[0]');

		return this.#removeChild(directory);
	}

	*children() {
		for (const child of this.#children) {
			yield child;
		}
	}

	*directories() {
		yield { directory: this, action: ENTER };

		for (const child of this.children()) {
			yield * child.directories();
		}

		yield { directory: this, action: LEAVE };
	}

	query(path) {

	}

	static isDirectory(value) {
		return value instanceof Directory;
	}
}
