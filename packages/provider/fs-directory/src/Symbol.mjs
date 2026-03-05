export const I = Object.freeze({
	PATHNAME: Object.freeze({
		VALID: Symbol('.isValidPathname'),
		DESCRIPTION: Symbol('.pathnameDescription'),
		IGNORE: Object.freeze({
			IS: Symbol('.isIgnored'),
		}),
	}),
});
