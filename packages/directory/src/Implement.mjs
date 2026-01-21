import { SubConstructorProxy as SCP } from '@produck/es-abstract-token';
import AbstractDirectory, { _I, _S } from './Abstract.mjs';

import * as Throw from './Throw.mjs';

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
	const _options = {};

	if (isPlainObject(options)) {
		const { name: _name, data: _data } = options;

		if (isPlainObject(_name)) {
			const name = _options.name = {};

			const {
				model: _model,
				init: _init,
				description: _description,
				isValid: _isValid,
				equal: _equal,
				toString: _toString,
			} = _name;

			if (typeof _model === 'string') {
				name.model = _model;
			} else {
				Throw.TypeError('args[0].name.model', 'string');
			}

			if (typeof _init === 'function') {
				name.init = _init;
			} else {
				Throw.TypeError('args[0].name.init', 'function');
			}

			if (typeof _description === 'string') {
				name.description = _description;
			} else {
				Throw.TypeError('args[0].name.description', 'string');
			}

			if (typeof _isValid === 'function') {
				name.isValid = _isValid;
			} else {
				Throw.TypeError('args[0].name.isValid', 'function');
			}

			if (typeof _equal === 'function') {
				name.equal = _equal;
			} else {
				Throw.TypeError('args[0].name.equal', 'function');
			}

			if (typeof _toString === 'function') {
				name.toString = _toString;
			} else {
				Throw.TypeError('args[0].name.toString', 'function');
			}
		} else {
			Throw.TypeError('args[0].name', 'plain object');
		}

		if (isPlainObject(_data)) {
			const data = _options.data = {};

			const {
				model: _model,
				init: _init,
				description: _description,
				isValid: _isValid,
			} = _data;

			if (typeof _model === 'string') {
				data.model = _model;
			} else {
				Throw.TypeError('args[0].data.model', 'string');
			}

			if (typeof _init === 'function') {
				data.init = _init;
			} else {
				Throw.TypeError('args[0].data.init', 'function');
			}

			if (typeof _description === 'string') {
				data.description = _description;
			} else {
				Throw.TypeError('args[0].data.description', 'string');
			}

			if (typeof _isValid === 'function') {
				data.isValid = _isValid;
			} else {
				Throw.TypeError('args[0].data.isValid', 'function');
			}
		} else {
			Throw.TypeError('args[0].data', 'plain object');
		}
	} else {
		Throw.TypeError('args[0]', 'plain object');
	}

	return _options;
}

export function Implement(options) {
	const _options = normalizeOptions(options);

	return SCP(class ImplementedDirectory extends AbstractDirectory {
		[_I.NAME.INIT]() {
			return _options.name.init();
		}

		get [_I.NAME.DESCRIPTION]() {
			return _options.name.description;
		}

		[_I.NAME.EQUAL](a, b) {
			return _options.name.equal(a, b);
		}

		[_I.NAME.IS_VALID](value) {
			return _options.name.isValid(value);
		}

		[_I.NAME.TO_STRING](name) {
			return _options.name.toString(name);
		}

		[_I.DATA.INIT]() {
			return _options.data.init();
		}

		get [_I.DATA.DESCRIPTION]() {
			return _options.data.description;
		}

		[_I.DATA.IS_VALID](value) {
			return _options.data.isValid(value);
		}

		static get [_S.MODEL.NAME]() {
			return _options.name.model;
		}

		static get [_S.MODEL.DATA]() {
			return _options.data.model;
		}
	});
}
