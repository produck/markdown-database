export const I = Object.freeze({
	CONSTRUCTOR: Symbol('.#constructor'),
	NODE: Symbol('.#node'),
	PROVIDER: Symbol('.#provider'),
});

export const _I = Object.freeze({
	TRANSFORM: Object.freeze({
		NAME: Symbol('._transformName'),
		DATA: Symbol('._transformData'),
		DESCRIPTION: Symbol('._TRANSFORMER_DESCRIPTION'),
	}),
});

export const _S = Object.freeze({
	CONSTRUCTOR: Object.freeze({
		NODE: Symbol('::_NodeConstructor'),
		PROVIDER: Symbol('::_ProviderConstructor'),
	}),
});
