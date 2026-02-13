import { Implement } from '@produck/cellulose-node';
import isPlainObj from 'is-plain-obj';

function isValidName(value) {
	return typeof value === 'string';
}

const VALID_PRIMITIVE_TYPES = new Set(['number', 'string', 'boolean']);

function isValidData(value) {
	if (value === null || VALID_PRIMITIVE_TYPES.has(typeof value)) {
		return true;
	}

	if (Array.isArray(value)) {
		return value.every(isValidData);
	}

	if (isPlainObj(value)) {
		for (const key in value) {
			if (!isValidData(value[key])) {
				return false;
			}
		}

		return true;
	}

	return false;
}

export default class StringJsonNode extends Implement({
	name: {
		init: () => '',
		description: 'string',
		isValid: isValidName,
		equal: (a, b) => a === b,
		toString: (name) => name,
	},
	data: {
		init: () => null,
		description: 'JsonValue',
		isValid: isValidData,
	},
}) {
	/** NO MEMBERS */
}
