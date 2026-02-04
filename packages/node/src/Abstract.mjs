import { ThrowTypeError } from '@produck/type-error';
import Abstract, { Member as M } from '@produck/es-abstract';

import * as ACTION from './Action.mjs';
import { I, _I, _S } from './Symbol.mjs';

function ThrowError(message) {
	throw new Error(message);
}

export default Abstract(class Node {
	[I.CONSTRUCTOR] = Node;

	constructor() {
		this[I.CONSTRUCTOR] = new.target;
	}

	[I.ASSERT.NODE](value, role) {
		if (!(value instanceof this[I.CONSTRUCTOR])) {
			ThrowTypeError(role, 'Node');
		}
	}

	[I.ASSERT.NAME](value, role) {
		if (!this[I.CONSTRUCTOR][_S.NAME.IS_VALID](value)) {
			ThrowTypeError(role, this[I.CONSTRUCTOR][_S.NAME.DESCRIPTION]);
		}
	}

	[I.ASSERT.DATA](value, role) {
		if (!this[I.CONSTRUCTOR][_S.DATA.IS_VALID](value)) {
			ThrowTypeError(role, this[I.CONSTRUCTOR][_S.DATA.DESCRIPTION]);
		}
	}

	[I.ASSERT.NOT_ANCESTOR](node) {
		for (const parent of this.parents()) {
			if (node === parent) {
				ThrowError('The new child is an ancestor of the parent');
			}
		}
	}

	[I.ASSERT.CHILD](node, role) {
		if (node[I.PARENT] !== this) {
			ThrowError(`The node ${role} is not a child of this node.`);
		}
	}

	[I.ASSERT.UNIQUE_CHILD_NAME](node) {
		if (this[I.CHILD.HAS_NAME](node.name)) {
			const readableName = this[_I.NAME.TO_STRING](node.name);

			ThrowError(`A child named "${readableName}" already exists.`);
		}
	}

	[I.CHILD.HAS_NAME](name) {
		for (const child of this.children()) {
			if (this[_I.NAME.EQUAL](child.name, name)) {
				return true;
			}
		}

		return false;
	}

	[I.PARENT] = null;
	[I.SIBLING.PREVIOUS] = null;
	[I.SIBLING.NEXT] = null;
	[I.CHILD.FIRST] = null;
	[I.CHILD.LAST] = null;

	get parent() {
		return this[I.PARENT];
	}

	get previousSibling() {
		return this[I.SIBLING.PREVIOUS];
	}

	get nextSibling() {
		return this[I.SIBLING.NEXT];
	}

	get firstChild() {
		return this[I.CHILD.FIRST];
	}

	get lastChild() {
		return this[I.CHILD.LAST];
	}

	*parents() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let current = this;

		while (current !== null) {
			yield current;
			current = current[I.PARENT];
		}
	}

	*children() {
		let current = this[I.CHILD.FIRST];

		while (current !== null) {
			yield current;
			current = current[I.SIBLING.NEXT];
		}
	}

	*nodes() {
		yield { node: this, action: ACTION.ENTER };

		for (const child of this.children()) {
			yield * child.nodes();
		}

		yield { node: this, action: ACTION.LEAVE };
	}

	[I.NAME] = this[_I.NAME.INIT]();

	get name() {
		return this[I.NAME];
	}

	set name(value) {
		this[I.ASSERT.NAME](value, 'assigned value');

		const parent = this[I.PARENT];

		if (parent !== null && parent.hasChildNodes()) {
			if (parent[I.CHILD.HAS_NAME](value)) {
				const readableName = this[_I.NAME.TO_STRING](value);

				ThrowError(`A sibling node named "${readableName}" already exists.`);
			}
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

	[I.IS.SAME](node) {
		return node === this;
	}

	isSameNode(node) {
		this[I.ASSERT.NODE](node, 'args[0] as node');

		return this[I.IS.SAME](node);
	}

	[I.IS.NAME_EQUAL](node) {
		return this[_I.NAME.EQUAL](node.name, this.name);
	}

	isNameEqualNode(node) {
		this[I.ASSERT.NODE](node, 'args[0] as node');

		return this[I.IS.NAME_EQUAL](node);
	}

	[I.CHILD.CONTAINS](node) {
		for (const step of this.nodes()) {
			if (step.action === ACTION.ENTER && step.node === node) {
				return true;
			}
		}

		return false;
	}

	contains(node) {
		this[I.ASSERT.NODE](node, 'args[0] as node');

		return this[I.CHILD.CONTAINS](node);
	}

	[I.DETACH]() {
		const hasParent = this[I.PARENT] !== null;
		const hasPrevious = this[I.SIBLING.PREVIOUS] !== null;
		const hasNext = this[I.SIBLING.NEXT] !== null;

		if (hasParent) {
			if (!hasPrevious) {
				this[I.PARENT][I.CHILD.FIRST] = this[I.SIBLING.NEXT];
			}

			if (!hasNext) {
				this[I.PARENT][I.CHILD.LAST] = this[I.SIBLING.PREVIOUS];
			}

			this[I.PARENT] = null;
		}

		if (hasPrevious) {
			this[I.SIBLING.PREVIOUS][I.SIBLING.NEXT] = this[I.SIBLING.NEXT];
			this[I.SIBLING.PREVIOUS] = null;
		}

		if (hasNext) {
			this[I.SIBLING.NEXT][I.SIBLING.PREVIOUS] = this[I.SIBLING.PREVIOUS];
			this[I.SIBLING.NEXT] = null;
		}
	}

	[I.CHILD.APPEND](node) {
		node[I.DETACH]();
		node[I.PARENT] = this;
		node[I.SIBLING.PREVIOUS] = this[I.CHILD.LAST];

		if (this.hasChildNodes()) {
			this[I.CHILD.LAST][I.SIBLING.NEXT] = node;
		} else {
			this[I.CHILD.FIRST] = node;
		}

		this[I.CHILD.LAST] = node;
	}

	appendChild(node) {
		this[I.ASSERT.NODE](node, 'args[0] as node');
		this[I.ASSERT.NOT_ANCESTOR](node);
		this[I.ASSERT.UNIQUE_CHILD_NAME](node);
		this[I.CHILD.APPEND](node);

		return node;
	}

	[I.CHILD.REMOVE](node) {
		node[I.DETACH]();
	}

	removeChild(node) {
		this[I.ASSERT.NODE](node, 'args[0] as node');
		this[I.ASSERT.CHILD](node, 'to be removed');
		this[I.CHILD.REMOVE](node);

		return node;
	}

	[I.CHILD.REPLACE](newChild, oldChild) {
		const oldPrevious = oldChild[I.SIBLING.PREVIOUS];
		const oldNext = oldChild[I.SIBLING.NEXT];

		newChild[I.DETACH]();
		newChild[I.PARENT] = this;
		newChild[I.SIBLING.PREVIOUS] = oldPrevious;
		newChild[I.SIBLING.NEXT] = oldNext;

		if (oldPrevious !== null) {
			oldPrevious[I.SIBLING.NEXT] = newChild;
		}

		if (oldNext !== null) {
			oldNext[I.SIBLING.PREVIOUS] = newChild;
		}

		if (this[I.CHILD.FIRST] === oldChild) {
			this[I.CHILD.FIRST] = newChild;
		}

		if (this[I.CHILD.LAST] === oldChild) {
			this[I.CHILD.LAST] = newChild;
		}

		oldChild[I.PARENT] = null;
		oldChild[I.SIBLING.PREVIOUS] = null;
		oldChild[I.SIBLING.NEXT] = null;
	}

	replaceChild(newChild, oldChild) {
		this[I.ASSERT.NODE](newChild, 'args[0] as newChild');
		this[I.ASSERT.NODE](oldChild, 'args[1] as oldChild');
		this[I.ASSERT.NOT_ANCESTOR](newChild);
		this[I.ASSERT.UNIQUE_CHILD_NAME](newChild);
		this[I.ASSERT.CHILD](oldChild, 'to be replaced');
		this[I.CHILD.REPLACE](newChild, oldChild);

		return oldChild;
	}

	[I.CHILD.INSERT](newNode, referenceNode) {
		newNode[I.DETACH]();

		const referencePrevious = referenceNode[I.SIBLING.PREVIOUS];

		if (referencePrevious !== null) {
			referencePrevious[I.SIBLING.NEXT] = newNode;
		}

		if (this[I.CHILD.FIRST] === referenceNode) {
			this[I.CHILD.FIRST] = newNode;
		}

		newNode[I.PARENT] = this;
		newNode[I.SIBLING.PREVIOUS] = referenceNode[I.SIBLING.PREVIOUS];
		newNode[I.SIBLING.NEXT] = referenceNode;
		referenceNode[I.SIBLING.PREVIOUS] = newNode;
	}

	insertBefore(newNode, referenceNode) {
		this[I.ASSERT.NODE](newNode, 'args[0] as newNode');
		this[I.ASSERT.NODE](referenceNode, 'args[1] as referenceNode');
		this[I.ASSERT.NOT_ANCESTOR](newNode);
		this[I.ASSERT.UNIQUE_CHILD_NAME](newNode);
		this[I.ASSERT.CHILD](referenceNode, 'to insert before');
		this[I.CHILD.INSERT](newNode, referenceNode);

		return newNode;
	}

	hasChildNodes() {
		return this[I.CHILD.FIRST] !== null;
	}

	static get description() {
		return {
			name: this[_S.NAME.DESCRIPTION],
			data: this[_S.DATA.DESCRIPTION],
		};
	}

	static isNode(value) {
		return value instanceof this;
	}

	static isValidName(value) {
		return this[_S.NAME.IS_VALID](value);
	}

	static isValidData(value) {
		return this[_S.DATA.IS_VALID](value);
	}
}, ...[
	Abstract({
		[_I.NAME.INIT]: M.Method().returns(M.Any),
		[_I.NAME.EQUAL]: M.Method().returns(M.Boolean),
		[_I.NAME.TO_STRING]: M.Method().returns(M.String),
	}),
	Abstract({
		[_I.DATA.INIT]: M.Method().returns(M.Any),
	}),
	Abstract.Static({
		[_S.NAME.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
		[_S.NAME.DESCRIPTION]: M.String,
		[_S.DATA.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
		[_S.DATA.DESCRIPTION]: M.String,
	}),
]);
