import { deepFreeze } from '@produck/deep-freeze-enumerable';

export const I = deepFreeze({
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
	CONSTRUCTOR: Symbol('.#constructor'),
	PARENT: Symbol('.#parent'),
	NAME: Symbol('.#name'),
	DATA: Symbol('.#data'),
	READABLE_NAME: Symbol('.#readableName'),
	CONTAINS: Symbol('.#contains()'),
	DETACH: Symbol('.#detach()'),
});

export const _I = deepFreeze({
	NAME: {
		INIT: Symbol('._initName()'),
		EQUAL: Symbol('._nameEqual()'),
		TO_STRING: Symbol('._nameToString()'),
		CLONE: Symbol('._cloneName()'),
	},
	DATA: {
		INIT: Symbol('._initData()'),
		CLONE: Symbol('._cloneData()'),
	},
});

export const _S = deepFreeze({
	NAME: {
		IS_VALID: Symbol('::_isValidName()'),
		DESCRIPTION: Symbol('::_nameDescription'),
	},
	DATA: {
		IS_VALID: Symbol('::_isValidData'),
		DESCRIPTION: Symbol('::_nameDescription'),
	},
});

export const S = deepFreeze({
	FLAG: Symbol('::flag'),
});
