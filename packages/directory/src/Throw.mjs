function ThrowTypeError(role, expected) {
	throw new TypeError(`Invalid "${role}", one "${expected}" expected.`);
}

export {
	ThrowTypeError as TypeError,
};
