import { deepFreeze } from '@produck/deep-freeze-enumerable';

export const I = deepFreeze({
	CONSTRUCTOR: Symbol('.#constructor'),
	NODE: Symbol('.#node'),
	PROVIDER: Symbol('.#provider'),
});

export const _I = deepFreeze({
	TRANSFORM: {
		NAME: Symbol('._transformName'),
		DATA: Symbol('._transformData'),
		DESCRIPTION: Symbol('._TRANSFORMER_DESCRIPTION'),
	},
});

export const _S = deepFreeze({
	CONSTRUCTOR: {
		NODE: Symbol('::_NodeConstructor'),
		PROVIDER: Symbol('::_ProviderConstructor'),
	},
});
