import { deepFreeze } from '@produck/deep-freeze-enumerable';

const I_CONSTRUCTOR = Symbol('.#constructor');
const I_NODE = Symbol('.#node');
const I_PROVIDER = Symbol('.#provider');

export const I = deepFreeze({
	CONSTRUCTOR: I_CONSTRUCTOR,
	NODE: I_NODE,
	PROVIDER: I_PROVIDER,
});

const _I_TRANSFORM_NAME = Symbol('._transformName');
const _I_TRANSFORM_DATA = Symbol('._transformData');
const _I_TRANSFORM_DESCRIPTION = Symbol('._TRANSFORMER_DESCRIPTION');

export const _I = deepFreeze({
	TRANSFORM: {
		NAME: _I_TRANSFORM_NAME,
		DATA: _I_TRANSFORM_DATA,
		DESCRIPTION: _I_TRANSFORM_DESCRIPTION,
	},
});

const _S_CONSTRUCTOR_NODE = Symbol('::_NodeConstructor');
const _S_CONSTRUCTOR_PROVIDER = Symbol('::_ProviderConstructor');

export const _S = deepFreeze({
	CONSTRUCTOR: {
		NODE: _S_CONSTRUCTOR_NODE,
		PROVIDER: _S_CONSTRUCTOR_PROVIDER,
	},
});

const S_FLAG = Symbol('::flag');

export const S = deepFreeze({
	FLAG: S_FLAG,
});
