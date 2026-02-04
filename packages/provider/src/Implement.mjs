import { ThrowTypeError } from '@produck/type-error';
import { SubConstructorProxy as SCP } from '@produck/es-abstract';

import Abstract, { _I, _S } from './Abstract.mjs';

function isPlainObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	let prototype = value;

	while (Object.getPrototypeOf(prototype) !== null) {
		prototype = Object.getPrototypeOf(prototype);
	}

	return Object.getPrototypeOf(value) === prototype;
}

function normalizeOptions(options) {
	const final = {};

	if (isPlainObject(options)) {
		final.options = {};

		const {
			origin: _origin,
			node: _node,
			steps: _steps,
		} = options;

		if (isPlainObject(_origin)) {
			final.options.origin = {};

			const {
				isValid: _isValid,
				description: _description,
			} = _origin;

			if (typeof _isValid === 'function') {
				final.options.origin.isValid = _isValid;
			} else {
				ThrowTypeError('args[0].origin.isValid', 'function');
			}

			if (typeof _description === 'string') {
				final.options.origin.description = _description;
			} else {
				ThrowTypeError('args[0].origin.description', 'string');
			}
		} else {
			ThrowTypeError('args[0].origin', 'plain object');
		}

		if (isPlainObject(_node)) {
			final.options.node = {};

			const {
				isValid: _isValid,
				description: _description,
			} = _node;

			if (typeof _isValid === 'function') {
				final.options.node.isValid = _isValid;
			} else {
				ThrowTypeError('args[0].node.isValid', 'function');
			}

			if (typeof _description === 'string') {
				final.options.node.description = _description;
			} else {
				ThrowTypeError('args[0].node.description', 'string');
			}
		} else {
			ThrowTypeError('args[0].node', 'plain object');
		}

		if (typeof _steps === 'function') {
			final.options.steps = _steps;
		} else {
			ThrowTypeError('args[0].steps', '(origin, provider) => Generator<Step>');
		}
	} else {
		ThrowTypeError('args[0] as options', 'plain object');
	}

	return final.options;
}

export function Implement(options) {
	const _options = normalizeOptions(options);

	return SCP(class ImplementedNodeProvider extends Abstract {
		async *[_I.STEPS](origin) {
			yield * _options.steps(origin, this);
		}

		static get [_S.ORIGIN.DESCRIPTION]() {
			return _options.origin.description;
		}

		static [_S.ORIGIN.IS_VALID](value) {
			return _options.origin.isValid(value);
		}

		static get [_S.NODE.DESCRIPTION]() {
			return _options.node.description;
		}

		static [_S.NODE.IS_VALID](value) {
			return _options.node.isValid(value);
		}
	});
}
