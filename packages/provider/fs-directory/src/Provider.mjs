import fs from 'node:fs';
import path from 'node:path';
import * as Ow from '@produck/ow';
import { ThrowTypeError } from '@produck/type-error';
import * as Provider from '@produck/cellulose-provider';

import { I } from './Symbol/index.mjs';

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

export default class FSDirectoryProvider extends Provider.Implement({
	origin: {
		isValid: isValidOrigin,
		description: 'AbsolutePathnameString',
	},
	node: {
		isValid: isValidNode,
		description: 'ObjectWithOrigin',
	},
	async *steps(pathname, provider) {
		const {
			[I.PATHNAME.VALID]: isValidPathname,
			[I.PATHNAME.DESCRIPTION]: pathnameDescription,
		} = provider;

		const stat = await fs.promises.stat(pathname);

		if (!stat.isDirectory()) {
			Ow.Error.Common(`Stat of "${pathname}" MUST be a directory.`);
		}

		yield *(async function *visit(origin) {
			if (!(await isValidPathname(origin))) {
				Ow.Error.Common(pathnameDescription);
			}

			const step = provider.createStep({ origin });

			yield step.enter();

			for (const dirent of await fs.promises.readdir(origin, READDIR_OPTIONS)) {
				if (dirent.isDirectory()) {
					const childOrigin = path.join(dirent.parentPath, dirent.name);

					yield * visit(childOrigin);
				}
			}

			yield step.leave();
		})(pathname);
	},
}) {
	[I.PATHNAME.VALID] = () => true;
	[I.PATHNAME.DESCRIPTION] = 'CustomPathname';

	definePathname(validator, description) {
		if (typeof validator !== 'function') {
			ThrowTypeError('args[0] as validator', '(value: unknown) => true');
		}

		if (typeof description !== 'string') {
			ThrowTypeError('args[1] as description', 'string');
		}

		this[I.PATHNAME.VALID] = validator;
		this[I.PATHNAME.DESCRIPTION] = description;
	}
};
