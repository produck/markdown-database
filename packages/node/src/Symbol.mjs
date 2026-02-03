export const I = {
	CONSTRUCTOR: Symbol('.#constructor'),
	PARENT: Symbol('.#parent'),
	NAME: Symbol('.#name'),
	DATA: Symbol('.#data'),
	READABLE_NAME: Symbol('.#readableName'),
	ASSERT: {
		NAME: Symbol('.#assertName()'),
		DATA: Symbol('.#assertData()'),
		NODE: Symbol('.#assertNode()'),
		NOT_ANCESTOR: Symbol('.#assertNotAncestor()'),
		UNIQUE_CHILD_NAME: Symbol('.#assertUniqueChildName()'),
		CHILD: Symbol('.#assertChild()'),
	},
	SIBLING: {
		PREVIOUS: Symbol('.#previousSibling'),
		NEXT: Symbol('.#nextSibling'),
	},
	CONTAINS: Symbol('.#contains()'),
	CHILD: {
		FIRST: Symbol('.#firstChild'),
		LAST: Symbol('.#lastChild'),
		APPEND: Symbol('.#appendChild()'),
		REMOVE: Symbol('.#removeChild()'),
		INSERT: Symbol('.#insertBefore()'),
		REPLACE: Symbol('.#replaceChild()'),
		HAS_NAME: Symbol('.#childHasName()'),
	},
	IS: {
		SAME: Symbol('.#isSame()'),
		NAME_EQUAL: Symbol('.#isEqual()'),
	},
	DETACH: Symbol('.#detach()'),
};

export const _I = {
	NAME: {
		INIT: Symbol('._initName()'),
		EQUAL: Symbol('._nameEqual()'),
		TO_STRING: Symbol('._nameToString()'),
	},
	DATA: {
		INIT: Symbol('._initData()'),
	},
};

export const _S = {
	NAME: {
		IS_VALID: Symbol('._isValidName()'),
		DESCRIPTION: Symbol('._nameDescription'),
	},
	DATA: {
		IS_VALID: Symbol('._isValidData'),
		DESCRIPTION: Symbol('._nameDescription'),
	},
};
