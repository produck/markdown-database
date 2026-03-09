import { deepFreeze } from '@produck/deep-freeze-enumerable';

export const I = deepFreeze({
	PATHNAME: {
		VALID: Symbol('.isValidPathname'),
		DESCRIPTION: Symbol('.pathnameDescription'),
		IGNORE: {
			IS: Symbol('.isIgnored'),
		},
	},
});
