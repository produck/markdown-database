import { ThrowTypeError } from '@produck/type-error';
import { SubConstructorProxy as SCP } from '@produck/es-abstract';
import { isNodeConstructor } from '@produck/cellulose-node';
import { isProviderConstructor } from '@produck/cellulose-provider';

import Abstract from './Abstract.mjs';
import { _I, _S } from './Symbol/index.mjs';

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
			node: _node,
			provider: _provider,
			parser: _parser,
		} = options;

		if (isNodeConstructor(_node)) {
			final.options.node = _node;
		} else {
			ThrowTypeError('args[0].node', 'NodeConstructor');
		}

		if (isProviderConstructor(_provider)) {
			final.options.provider = _provider;
		} else {
			ThrowTypeError('args[0].provider', 'ProviderConstructor');
		}

		if (isPlainObject(_parser)) {
			final.options.parser = {};

			const {
				name: _name,
				data: _data,
			} = _parser;

			if (typeof _name === 'function') {
				final.options.parser.name = _name;
			} else {
				ThrowTypeError('args[0].parser.name', 'function');
			}

			if (typeof _data === 'function') {
				final.options.parser.data = _data;
			} else {
				ThrowTypeError('args[0].parser.data', 'function');
			}
		} else {
			ThrowTypeError('args[0].parser', 'plain object');
		}
	} else {
		ThrowTypeError('args[0] as options', 'plain object');
	}

	return final.options;
}

export function Implement(options) {
	const _options = normalizeOptions(options);

	return SCP(class ImplementedTranscriber extends Abstract {
		[_I.PARSE.NAME](node) {
			return _options.parser.name(node);
		}

		[_I.PARSE.DATA](node, name) {
			return _options.parser.data(node, name);
		}

		static [_S.CONSTRUCTOR.NODE] = _options.node;
		static [_S.CONSTRUCTOR.PROVIDER] = _options.provider;
	});
}
