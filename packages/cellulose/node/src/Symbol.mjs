import { deepFreeze } from '@produck/deep-freeze-enumerable';

const I_ASSSERT_NAME = Symbol('.#assertName()');
const I_ASSERT_DATA = Symbol('.#assertData()');
const I_ASSERT_NODE = Symbol('.#assertNode()');
const I_ASSERT_NOT_ANCESTOR = Symbol('.#assertNotAncestor()');
const I_ASSERT_UNIQUE_CHILD_NAME = Symbol('.#assertUniqueChildName()');
const I_ASSERT_CHILD = Symbol('.#assertChild()');
const I_SIBLING_PREVIOUS = Symbol('.#previousSibling');
const I_SIBLING_NEXT = Symbol('.#nextSibling');
const I_CHILD_FIRST = Symbol('.#firstChild');
const I_CHILD_LAST = Symbol('.#lastChild');
const I_CHILD_APPEND = Symbol('.#appendChild()');
const I_CHILD_REMOVE = Symbol('.#removeChild()');
const I_CHILD_INSERT = Symbol('.#insertBefore()');
const I_CHILD_REPLACE = Symbol('.#replaceChild()');
const I_CHILD_HAS_NAME = Symbol('.#childHasName()');
const I_IS_SAME = Symbol('.#isSame()');
const I_IS_NAME_EQUAL = Symbol('.#isEqual()');
const I_CONSTRUCTOR = Symbol('.#constructor');
const I_PARENT = Symbol('.#parent');
const I_NAME = Symbol('.#name');
const I_DATA = Symbol('.#data');
const I_READABLE_NAME = Symbol('.#readableName');
const I_CONTAINS = Symbol('.#contains()');
const I_DETACH = Symbol('.#detach()');

export const I = deepFreeze({
	ASSERT: {
		NAME: I_ASSSERT_NAME,
		DATA: I_ASSERT_DATA,
		NODE: I_ASSERT_NODE,
		NOT_ANCESTOR: I_ASSERT_NOT_ANCESTOR,
		UNIQUE_CHILD_NAME: I_ASSERT_UNIQUE_CHILD_NAME,
		CHILD: I_ASSERT_CHILD,
	},
	SIBLING: {
		PREVIOUS: I_SIBLING_PREVIOUS,
		NEXT: I_SIBLING_NEXT,
	},
	CHILD: {
		FIRST: I_CHILD_FIRST,
		LAST: I_CHILD_LAST,
		APPEND: I_CHILD_APPEND,
		REMOVE: I_CHILD_REMOVE,
		INSERT: I_CHILD_INSERT,
		REPLACE: I_CHILD_REPLACE,
		HAS_NAME: I_CHILD_HAS_NAME,
	},
	IS: {
		SAME: I_IS_SAME,
		NAME_EQUAL: I_IS_NAME_EQUAL,
	},
	CONSTRUCTOR: I_CONSTRUCTOR,
	PARENT: I_PARENT,
	NAME: I_NAME,
	DATA: I_DATA,
	READABLE_NAME: I_READABLE_NAME,
	CONTAINS: I_CONTAINS,
	DETACH: I_DETACH,
});

const _I_NAME_INIT = Symbol('._initName()');
const _I_NAME_EQUAL = Symbol('._nameEqual()');
const _I_NAME_TO_STRING = Symbol('._nameToString()');
const _I_NAME_CLONE = Symbol('._cloneName()');
const _I_DATA_INIT = Symbol('._initData()');
const _I_DATA_CLONE = Symbol('._cloneData()');

export const _I = deepFreeze({
	NAME: {
		INIT: _I_NAME_INIT,
		EQUAL: _I_NAME_EQUAL,
		TO_STRING: _I_NAME_TO_STRING,
		CLONE: _I_NAME_CLONE,
	},
	DATA: {
		INIT: _I_DATA_INIT,
		CLONE: _I_DATA_CLONE,
	},
});

const _S_NAME_IS_VALID = Symbol('::_isValidName()');
const _S_NAME_DESCRIPTION = Symbol('::_nameDescription');
const _S_DATA_IS_VALID = Symbol('::_isValidData');
const _S_DATA_DESCRIPTION = Symbol('::_nameDescription');
const _S_IMPLEMENTATION_NAME = Symbol('::_implementationName');
const _S_IMPLEMENTATION_VERSION = Symbol('::_implementationVersion');
const _S_IMPLEMENTATION_DESCRIPTION = Symbol('::_implementationDescription');

export const _S = deepFreeze({
	NAME: {
		IS_VALID: _S_NAME_IS_VALID,
		DESCRIPTION: _S_NAME_DESCRIPTION,
	},
	DATA: {
		IS_VALID: _S_DATA_IS_VALID,
		DESCRIPTION: _S_DATA_DESCRIPTION,
	},
	IMPLEMENTATION: {
		NAME: _S_IMPLEMENTATION_NAME,
		VERSION: _S_IMPLEMENTATION_VERSION,
		DESCRIPTION: _S_IMPLEMENTATION_DESCRIPTION,
	},
});
