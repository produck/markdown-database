import * as fs from 'node:fs';
import * as path from 'node:path';

const RTTF = [() => true, () => false];
const META_FILENAME = '.mds';

async function isPathnameExisted(pathname) {
	return await fs.promises.access(pathname).then(...RTTF);
}

const WORKSPACE_STRUCTURE = {
	[META_FILENAME]: { type: 'file' },

};

export class Workspace {
	#location = '';

	async loadSchems() {

	}

	async generate(destination) {

	}

	static async attach(pathname) {
		const rootPathname = path.resolve(pathname);

		if (!await isPathnameExisted(rootPathname)) {
			throw new Error(`Path "${rootPathname}" is NOT found.`);
		}

		const stats = await fs.promises.stat(rootPathname);

		if (!stats.isDirectory()) {
			throw new Error(`Path "${rootPathname}" is NOT directory.`);
		}

		const metaPathname = path.join(rootPathname, META_FILENAME);

		if (!await isPathnameExisted(rootPathname)) {
			throw new Error(`File "${metaPathname}" is NOT found.`);
		}

		const workspace = new this(rootPathname);

		await workspace.loadSchems();

		return workspace;
	}
}
