import Abstract, { Member as M } from '@produck/es-abstract';

import { _S } from './Symbol/index.mjs';

export default Abstract(class LinenStorage {


	// environment
	// language
	// schema
	// root
	get root() {

	}

	set root() {

	}

	get schema() {

	}

	set schema() {

	}

	attach(pathname, force) {
		if (force) {
			// init
		}

		if (!pathname) {
			// throw
		}


	}
}, ...[
	Abstract.Static({
		[_S.TRANSCRIBER.ROOT]: M.Function,
		[_S.TRANSCRIBER.SCHEMA]: M.Function,
	}),
]);
