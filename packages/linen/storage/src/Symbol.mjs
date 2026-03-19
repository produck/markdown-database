import { deepFreeze } from '@produck/deep-freeze-enumerable';

const I_LOCATION = Symbol('.#location');
const I_CONSTRUCTOR = Symbol('.#constructor');
const I_DATA = Symbol('.#data');
const I_SCHEMA = Symbol('.#schema');
const I_LANGUAGE = Symbol('.#language');
const I_TRANSCRIBER_DATA = Symbol('.#DataTranscriber');
const I_TRANSCRIBER_SCHEMA = Symbol('.#SchemaTranscriber');

export const I = deepFreeze({
	LOCATION: I_LOCATION,
	CONSTRUCTOR: I_CONSTRUCTOR,
	DATA: I_DATA,
	SCHEMA: I_SCHEMA,
	LANGUAGE: I_LANGUAGE,
	TRANSCRIBER: {
		DATA: I_TRANSCRIBER_DATA,
		SCHEMA: I_TRANSCRIBER_SCHEMA,
	},
});

const _I_LANGUAGE_FETCH = Symbol('._fetchLanguageList');

export const _I = deepFreeze({
	LANGUAGE: {
		FETCH: _I_LANGUAGE_FETCH,
	},
});

const S_VERSION = Symbol('::#version');

export const S = deepFreeze({
	VERSION: S_VERSION,
});

const _S_AJV = Symbol('::_ajv');
const _S_IMPLEMENTATION_NAME = Symbol('::_implementationName');
const _S_IMPLEMENTATION_VERSION = Symbol('::_implementationVersion');
const _S_IMPLEMENTATION_DESCRIPTION = Symbol('::_implementationDescription');
const _S_TRANSCRIBER_DATA = Symbol('::#DataTranscriber');
const _S_TRANSCRIBER_SCHEMA = Symbol('::#SchemaTranscriber');
const _S_LOCATION_IS = Symbol('::_isLocation');
const _S_LOCATION_DESCRIPTION = Symbol('::_locationDescription');
const _S_LOCATION_TO_ORIGON_DATA = Symbol('::_toDataOrigin');
const _S_LOCATION_TO_ORIGON_SCHEMA = Symbol('::_toSchemaOrigin');

export const _S = deepFreeze({
	AJV: _S_AJV,
	TRANSCRIBER: {
		DATA: _S_TRANSCRIBER_DATA,
		SCHEMA: _S_TRANSCRIBER_SCHEMA,
	},
	LOCATION: {
		IS: _S_LOCATION_IS,
		DESCRIPTION: _S_LOCATION_DESCRIPTION,
		ORIGIN: {
			DATA: _S_LOCATION_TO_ORIGON_DATA,
			SCHEMA: _S_LOCATION_TO_ORIGON_SCHEMA,
		},
	},
	PROVIDER: {
		DATA: {

		},
	},
	IMPLEMENTATION: {
		NAME: _S_IMPLEMENTATION_NAME,
		VERSION: _S_IMPLEMENTATION_VERSION,
		DESCRIPTION: _S_IMPLEMENTATION_DESCRIPTION,
	},

});
