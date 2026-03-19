import { SubConstructorProxy as SCP } from '@produck/es-abstract';
import * as Transcribe from '@produck/cellulose-transcriber';
import StringJsonNode from '@produck/cellulose-node-string-json';
import * as StringJsonSchemaNode from '@produck/cellulose-node-string-json-schema';

import AbstractStorage from './Abstract.mjs';
import { _S } from './Symbol.mjs';

export function normalizeOptions(options) {
	const _options = {
		name: '',
		version: '',
		description: '',
		location: {
			description: '',
			isValid: null,
			origin: {
				data: null,
				schema: null,
			},
		},
		data: {
			provider: null,
			transformer: {
				name: null,
				data: null,
			},
		},
		schema: {
			provider: null,
			transformer: {
				name: null,
				data: null,
			},
			ajv: null,
		},
	};

	return _options;
}

export function implement(options) {
	const _options = normalizeOptions(options);
	const FinalStringJsonSchemaNode = StringJsonSchemaNode.Implement(_options.ajv);

	const DataTranscriber = Transcribe.Implement({
		node: StringJsonNode,
		provider: _options.data.provider,
		transformer: {
			name: _options.data.transformer.name,
			data: _options.data.transformer.data,
		},
	});

	const SchemaTranscriber = Transcribe.Implement({
		node: FinalStringJsonSchemaNode,
		provider: _options.schema.provider,
		transformer: {
			name: _options.schema.transformer.name,
			data: _options.schema.transformer.data,
		},
	});

	return SCP(class ImplementedStorage extends AbstractStorage {
		static [_S.TRANSCRIBER.DATA] = DataTranscriber;
		static [_S.TRANSCRIBER.SCHEMA] = SchemaTranscriber;
		static [_S.LOCATION.IS] = _options.location.isValid;
		static [_S.LOCATION.DESCRIPTION] = _options.location.description;
		static [_S.LOCATION.ORIGIN.DATA] = _options.location.origin.data;
		static [_S.LOCATION.ORIGIN.SCHEMA] = _options.location.origin.schema;
		static [_S.IMPLEMENTATION.NAME] = _options.name;
		static [_S.IMPLEMENTATION.VERSION] = _options.version;
		static [_S.IMPLEMENTATION.DESCRIPTION] = _options.description;
	});
}
