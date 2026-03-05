import { ThrowTypeError } from '@produck/type-error';
import { SubConstructorProxy as SCP } from '@produck/es-abstract';
import { isNodeConstructor } from '@produck/cellulose-node';
import { isProviderConstructor } from '@produck/cellulose-provider';

import Abstract from './Abstract.mjs';
import { _I, _S } from './Symbol.mjs';

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
			transformer: _transformer,
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

		if (isPlainObject(_transformer)) {
			final.options.transformer = {};

			const {
				name: _name,
				data: _data,
			} = _transformer;

			if (typeof _name === 'function') {
				final.options.transformer.name = _name;
			} else {
				ThrowTypeError('args[0].transformer.name', 'function');
			}

			if (typeof _data === 'function') {
				final.options.transformer.data = _data;
			} else {
				ThrowTypeError('args[0].transformer.data', 'function');
			}
		} else {
			ThrowTypeError('args[0].transformer', 'plain object');
		}
	} else {
		ThrowTypeError('args[0] as options', 'plain object');
	}

	return final.options;
}

export function Implement(options) {
	const _options = normalizeOptions(options);

	const {
		name: transformName,
		data: transformData,
	} = _options.transformer;

	return SCP(class ImplementedTranscriber extends Abstract {
		[_I.TRANSFORM.NAME](node) {
			return transformName(node, this);
		}

		[_I.TRANSFORM.DATA](node, name) {
			return transformData(node, name, this);
		}

		static [_S.CONSTRUCTOR.NODE] = _options.node;
		static [_S.CONSTRUCTOR.PROVIDER] = _options.provider;
	});
}
