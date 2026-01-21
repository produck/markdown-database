import { AbstractDirectory } from '@produck/cellulose-directory';

const { isPrototypeOf } = Object.prototype;

export function ImplementedDirectoryConstructor(value) {
	if (typeof value !== 'function') {
		return false;
	}

	return isPrototypeOf.call(AbstractDirectory.prototype, value.prototype);
}
