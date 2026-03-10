import { deepFreeze } from '@produck/deep-freeze-enumerable';

const I_CONSTRUCTOR = Symbol('.#constructor');
const I_SEEK = Symbol('.#seek()');

export const I = deepFreeze({
	CONSTRUCTOR: I_CONSTRUCTOR,
	SEEK: I_SEEK,
});

const _I_STEPS = Symbol('._steps()');

export const _I = deepFreeze({
	STEPS: _I_STEPS,
});

const _S_ORIGIN_IS_VALID = Symbol('::_isValidOrigin()');
const _S_ORIGIN_DESCRIPTION = Symbol('::_originDescription');
const _S_NODE_IS_VALID = Symbol('::_isValidNode()');
const _S_NODE_DESCRIPTION = Symbol('::_nodeDescription');

export const _S = deepFreeze({
	ORIGIN: {
		IS_VALID: _S_ORIGIN_IS_VALID,
		DESCRIPTION: _S_ORIGIN_DESCRIPTION,
	},
	NODE: {
		IS_VALID: _S_NODE_IS_VALID,
		DESCRIPTION: _S_NODE_DESCRIPTION,
	},
});

const S_FLAG = Symbol('::flag');

export const S = deepFreeze({
	FLAG: S_FLAG,
});
