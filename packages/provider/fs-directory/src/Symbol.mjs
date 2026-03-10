import { deepFreeze } from '@produck/deep-freeze-enumerable';

const I_PATHNAME_VALID = Symbol('.isValidPathname');
const I_PATHNAME_DESCRIPTION = Symbol('.pathnameDescription');
const I_PATHNAME_IGNORE_IS = Symbol('.isIgnored');

export const I = deepFreeze({
	PATHNAME: {
		VALID: I_PATHNAME_VALID,
		DESCRIPTION: I_PATHNAME_DESCRIPTION,
		IGNORE: {
			IS: I_PATHNAME_IGNORE_IS,
		},
	},
});
