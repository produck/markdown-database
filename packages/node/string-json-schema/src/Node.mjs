import Ajv from 'ajv';
import Abstract, { Member as M } from '@produck/es-abstract';
import * as Node from '@produck/cellulose-node';
import StringJsonNode from '@produck/cellulose-node-string-json';

import { _S } from './Symbol.mjs';
import * as PACKAGE from './package.gen.mjs';

export default Abstract(class StringJsonSchemaNode extends StringJsonNode {
	static [_S.AJV] = new Ajv();

	static get ajv() {
		return this[_S.AJV];
	}

	static [Node._S.DATA.IS_VALID](value) {
		const ajv = this[_S.AJV];

		return super[Node._S.DATA.IS_VALID](value) && ajv.validateSchema(value);
	}

	static get [Node._S.IMPLEMENTATION.NAME]() {
		return PACKAGE.NAME;
	}

	static get [Node._S.IMPLEMENTATION.VERSION]() {
		return PACKAGE.VERSION;
	}

	static get [Node._S.IMPLEMENTATION.DESCRIPTION]() {
		return PACKAGE.DESCRIPTION;
	}
}, ...[
	Abstract.Static({
		[_S.AJV]: M.Instance(Ajv),
	}),
]);
