import { ThrowTypeError } from '@produck/type-error';
import Ajv from 'ajv';

import AbstractNode from './Node.mjs';
import { _S } from './Symbol.mjs';

export function Implement(ajv = new Ajv()) {
	if (!(ajv instanceof Ajv)) {
		ThrowTypeError('args[0] as ajv', 'Ajv');
	}

	return class SpecifiedAjvStringJsonSchemaNode extends AbstractNode {
		static [_S.AJV] = ajv;
	};
}
