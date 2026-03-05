export const I = Object.freeze({
	CONSTRUCTOR: Symbol('.#constructor'),
	SEEK: Symbol('.#seek()'),
});

export const _I = Object.freeze({
	STEPS: Symbol('._steps()'),
});

export const _S = Object.freeze({
	ORIGIN: Object.freeze({
		IS_VALID: Symbol('::_isValidOrigin()'),
		DESCRIPTION: Symbol('::_originDescription'),
	}),
	NODE: Object.freeze({
		IS_VALID: Symbol('::_isValidNode()'),
		DESCRIPTION: Symbol('::_nodeDescription'),
	}),
});

export const S = Object.freeze({
	FLAG: Symbol('::flag'),
});
