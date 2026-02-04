import fs from 'node:fs';
import path from 'node:path';
import * as Provider from '@produck/cellulose-provider';

const READDIR_OPTIONS = {
	withFileTypes: true,
};

function isValidOrigin(value) {
	return typeof value === 'string' && path.isAbsolute(value);
}

function isValidNode(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const keys = Object.keys(value);

	if (keys.length !== 1 || keys[0] !== 'origin') {
		return false;
	}

	return isValidOrigin(value.origin);
}

export default Provider.Implement({
	origin: {
		isValid: isValidOrigin,
		description: 'AbsolutePathnameString',
	},
	node: {
		isValid: isValidNode,
		description: 'ObjectWithOrigin',
	},
	async *steps(origin, provider) {
		const stat = await fs.promises.stat(origin);

		if (!stat.isDirectory()) {
			throw new Error(`Stat of "${origin}" MUST be a directory.`);
		}

		const step = provider.createStep({ origin });

		yield step.enter();

		for (const dirent of await fs.promises.readdir(origin, READDIR_OPTIONS)) {
			if (dirent.isDirectory()) {
				const childOrigin = path.join(dirent.parentPath, dirent.name);

				yield * provider[Provider._I.STEPS](childOrigin);
			}
		}

		yield step.leave();
	},
});
