import { deepFreeze } from '@produck/deep-freeze-enumerable';

export const I = deepFreeze({
	CONSTRUCTOR: Symbol('.#constructor'),
	SEEK: Symbol('.#seek()'),
});

export const _I = deepFreeze({
	STEPS: Symbol('._steps()'),
});

export const _S = deepFreeze({
	ORIGIN: {
		IS_VALID: Symbol('::_isValidOrigin()'),
		DESCRIPTION: Symbol('::_originDescription'),
	},
	NODE: {
		IS_VALID: Symbol('::_isValidNode()'),
		DESCRIPTION: Symbol('::_nodeDescription'),
	},
});

export const S = deepFreeze({
	FLAG: Symbol('::flag'),
});
