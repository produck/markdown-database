export const I = Object.freeze({
	ASSERT: Object.freeze({
		NAME: Symbol('.#assertName()'),
		DATA: Symbol('.#assertData()'),
		NODE: Symbol('.#assertNode()'),
		NOT_ANCESTOR: Symbol('.#assertNotAncestor()'),
		UNIQUE_CHILD_NAME: Symbol('.#assertUniqueChildName()'),
		CHILD: Symbol('.#assertChild()'),
	}),
	SIBLING: Object.freeze({
		PREVIOUS: Symbol('.#previousSibling'),
		NEXT: Symbol('.#nextSibling'),
	}),
	CHILD: Object.freeze({
		FIRST: Symbol('.#firstChild'),
		LAST: Symbol('.#lastChild'),
		APPEND: Symbol('.#appendChild()'),
		REMOVE: Symbol('.#removeChild()'),
		INSERT: Symbol('.#insertBefore()'),
		REPLACE: Symbol('.#replaceChild()'),
		HAS_NAME: Symbol('.#childHasName()'),
	}),
	IS: Object.freeze({
		SAME: Symbol('.#isSame()'),
		NAME_EQUAL: Symbol('.#isEqual()'),
	}),
	CONSTRUCTOR: Symbol('.#constructor'),
	PARENT: Symbol('.#parent'),
	NAME: Symbol('.#name'),
	DATA: Symbol('.#data'),
	READABLE_NAME: Symbol('.#readableName'),
	CONTAINS: Symbol('.#contains()'),
	DETACH: Symbol('.#detach()'),
});

export const _I = Object.freeze({
	NAME: Object.freeze({
		INIT: Symbol('._initName()'),
		EQUAL: Symbol('._nameEqual()'),
		TO_STRING: Symbol('._nameToString()'),
		CLONE: Symbol('._cloneName()'),
	}),
	DATA: Object.freeze({
		INIT: Symbol('._initData()'),
		CLONE: Symbol('._cloneData()'),
	}),
});

export const _S = Object.freeze({
	NAME: Object.freeze({
		IS_VALID: Symbol('::_isValidName()'),
		DESCRIPTION: Symbol('::_nameDescription'),
	}),
	DATA: Object.freeze({
		IS_VALID: Symbol('::_isValidData'),
		DESCRIPTION: Symbol('::_nameDescription'),
	}),
});

export const S = Object.freeze({
	FLAG: Symbol('::flag'),
});
