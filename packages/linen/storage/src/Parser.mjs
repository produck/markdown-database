import { AbstractTranscriber } from '@produck/cellulose-transcriber';
import { isSubConstructor } from '@produck/is-sub-constructor';
import { ThrowTypeError } from '@produck/type-error';

import * as Node from './Node.mjs';

function assertTranscriberConstructor(value, role) {
	if (!isSubConstructor(value, AbstractTranscriber)) {
		ThrowTypeError(role, 'TranscriberConstructor');
	}
}

export function DataTranscribeConstructor(value) {
	assertTranscriberConstructor(value, 'args[0]');

	if (!isSubConstructor(value.Node, Node.Json.Base)) {
		ThrowTypeError('::[_S.TRANSCRIBER.DATA].Node', 'JsonNode');
	}

	return value;
}

export function SchemaTranscriberConstructor(value) {
	assertTranscriberConstructor(value, 'args[0]');

	if (!isSubConstructor(value.Node, Node.JsonSchema.Abstract)) {
		ThrowTypeError('::[_S.TRANSCRIBER.SCHEMA].Node', '<Sub>JsonSchemaNode');
	}

	return value;
}
