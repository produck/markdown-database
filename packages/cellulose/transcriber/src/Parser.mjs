import { isNodeConstructor } from '@produck/cellulose-node';
import { isProviderConstructor } from '@produck/cellulose-provider';
import { ThrowTypeError } from '@produck/type-error';

export function NodeConstructor(value) {
	if (isNodeConstructor(value)) {
		return value;
	}

	ThrowTypeError('args[0]', 'NodeConstructor');
}

export function ProviderConstructor(value) {
	if (isProviderConstructor(value)) {
		return value;
	}

	ThrowTypeError('args[0]', 'ProviderConstructor');
}
