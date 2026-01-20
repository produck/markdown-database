import Abstract, { Member as M } from '@produck/es-abstract';

import { ACTION } from './Symbol.mjs';

const I = {
	TARGET_CONSTRUCTOR: Symbol('.#targetConstructor'),
	PARENT: Symbol('.#parent'),
	CHILDREN: Symbol('.#children'),
	NAME: Symbol('.#name'),
	DATA: Symbol('.#data'),
	SET_PARENT: Symbol('.#setParent()'),
	READABLE_NAME: Symbol('.#readableName'),
	ASSERT: {
		NAME: Symbol('.#assertName()'),
		DATA: Symbol('.#assertData()'),
		DIRECTORY: Symbol('.#assertDirectory()'),
	},
	CHILD: {
		HAS: Symbol('.#hasChild()'),
		APPEND: Symbol('.#appendChild()'),
		REMOVE: Symbol('.#removeChild()'),
	},
};

export const _I = {
	NAME: {
		INIT: Symbol('._initName()'),
		EQUAL: Symbol('._nameEqual()'),
		IS_VALID: Symbol('._isValidName()'),
		TO_STRING: Symbol('._nameToString()'),
		DESCRIPTION: Symbol('._nameDescription'),
	},
	DATA: {
		INIT: Symbol('._initData()'),
		IS_VALID: Symbol('._isValidData'),
		DESCRIPTION: Symbol('._nameDescription'),
	},
};

export const _S = {
	MODEL: {
		NAME: Symbol('::nameModel'),
		DATA: Symbol('::dataModel'),
	},
};

function ThrowTypeError(role, expected) {
	throw new TypeError(`Invalid "${role}", one "${expected}" expected.`);
}

export default Abstract(class Directory {
	[I.TARGET_CONSTRUCTOR] = Directory;

	constructor() {
		this[I.TARGET_CONSTRUCTOR] = new.target;
	}

	[I.ASSERT.DIRECTORY](value, role) {
		if (!(value instanceof this[I.TARGET_CONSTRUCTOR])) {
			ThrowTypeError(role, 'Directory');
		}
	}

	[I.ASSERT.NAME](value, role) {
		if (!this[_I.NAME.IS_VALID](value)) {
			ThrowTypeError(role, this[_I.NAME.DESCRIPTION]);
		}
	}

	[I.ASSERT.DATA](value, role) {
		if (!this[_I.DATA.IS_VALID](value)) {
			ThrowTypeError(role, this[_I.DATA.DESCRIPTION]);
		}
	}

	[I.PARENT] = null;

	/** @type {Directory | null} */
	get parent() {
		return this[I.PARENT];
	}

	[I.SET_PARENT](value) {
		this[I.PARENT] = value;
	}

	[I.NAME] = this[_I.NAME.INIT]();

	get [I.READABLE_NAME]() {
		return this[_I.NAME.TO_STRING](this[I.NAME]);
	}

	get name() {
		return this[I.NAME];
	}

	set name(value) {
		this[I.ASSERT.NAME](value, 'assigned value');

		if (this.parent !== null && this.parent.hasChild(value)) {
			const name = this[_I.NAME.TO_STRING](value);

			throw new Error(`A sibling directory named "${name}" has been existed.`);
		}

		this[I.NAME] = value;
	}

	[I.DATA] = this[_I.DATA.INIT]();

	get data() {
		return this[I.DATA];
	}

	set data(value) {
		this[I.ASSERT.DATA](value, 'assigned value');

		this[I.DATA] = value;
	}

	/** @type {Directory[]} */
	[I.CHILDREN] = [];

	[I.CHILD.HAS](name) {
		for (const { name: childName } of this[I.CHILDREN]) {
			if (childName === name || this[_I.NAME.EQUAL](childName, name)) {
				return true;
			}
		}

		return false;
	}

	hasChild(name) {
		this[I.ASSERT.NAME](name, 'args[0]');

		return this[I.CHILD.HAS](name);
	}

	/** @param {Directory} directory */
	[I.CHILD.APPEND](directory) {
		if (this[I.CHILDREN].includes(directory)) {
			return directory;
		}

		if (this[I.CHILD.HAS](directory.name)) {
			throw new Error(`A child named "${directory[I.READABLE_NAME]}" has been existed.`);
		}

		this[I.CHILDREN].push(directory);
		directory[I.SET_PARENT](this);

		return directory;
	}

	/** @param {Directory} directory */
	appendChild(directory) {
		this[I.ASSERT.DIRECTORY](directory, 'args[0]');

		return this[I.CHILD.APPEND](directory);
	}

	/** @param {Directory} directory */
	[I.CHILD.REMOVE](directory) {
		const index = this[I.CHILDREN].indexOf(directory);

		if (index < 0) {
			throw new Error('The directory to be removed is not a child of this directory.');
		}

		this[I.CHILDREN].splice(index, 1);
		directory[I.SET_PARENT](null);

		return directory;
	}

	removeChild(directory) {
		this[I.ASSERT.DIRECTORY](directory, 'args[0]');

		return this[I.CHILD.REMOVE](directory);
	}

	*children() {
		for (const child of this[I.CHILDREN]) {
			yield child;
		}
	}

	*directories() {
		yield { directory: this, action: ACTION.ENTER };

		for (const child of this.children()) {
			yield * child.directories();
		}

		yield { directory: this, action: ACTION.LEAVE };
	}

	static get model() {
		return {
			name: this[_S.MODEL.NAME],
			data: this[_S.MODEL.DATA],
		};
	}

	static isDirectory(value) {
		return value instanceof this;
	}
}, ...[
	Abstract({
		[_I.NAME.INIT]: M.Method().returns(M.Any),
		[_I.NAME.EQUAL]: M.Method().returns(M.Boolean),
		[_I.NAME.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
		[_I.NAME.TO_STRING]: M.Method().returns(M.String),
		[_I.NAME.DESCRIPTION]: M.String,
	}),
	Abstract({
		[_I.DATA.INIT]: M.Method().returns(M.Any),
		[_I.DATA.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
		[_I.DATA.DESCRIPTION]: M.String,
	}),
	Abstract.Static({
		[_S.MODEL.NAME]: M.String,
		[_S.MODEL.DATA]: M.String,
	}),
]);
