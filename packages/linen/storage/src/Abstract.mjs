import * as Ow from '@produck/ow';
import { ThrowTypeError } from '@produck/type-error';
import { isSubConstructor } from '@produck/is-sub-constructor';
import Abstract, { Member as M } from '@produck/es-abstract';
import * as Transcribe from '@produck/cellulose-transcriber';

import PACKAGE from './package.gen.mjs';
import { _I, _S, I, S } from './Symbol.mjs';
import * as Node from './Node.mjs';
import * as Language from './Language.mjs';
import * as Parser from './Parser.mjs';
import { ValidationResult } from './Validator.mjs';

const INIT = Object.freezes({
	DATA: new Node.Json.Base(),
	SCHEMA: new Node.JsonSchema.default(),
});

export default Abstract(class LinenStorage {
	//TODO commit() {}

	static [_S.TRANSCRIBER.DATA] = Transcribe.AbstractTranscriber;
	static [_S.TRANSCRIBER.SCHEMA] = Transcribe.AbstractTranscriber;

	constructor(location) {
		const {
			[_S.TRANSCRIBER.DATA]: DataTranscriber,
			[_S.TRANSCRIBER.SCHEMA]: SchemaTranscriber,
		} = this[I.CONSTRUCTOR] = new.target;

		const dataTranscriber = new DataTranscriber();
		const schemaTranscriber = new SchemaTranscriber();

		this[I.LOCATION] = location;
		this[I.TRANSCRIBER.DATA] = dataTranscriber;
		this[I.TRANSCRIBER.SCHEMA] = schemaTranscriber;
	}

	[I.LANGUAGE] = new Language.Registry();
	[I.DATA] = INIT.DATA;
	[I.SCHEMA] = INIT.SCHEMA;

	get data() {
		return this[I.DATA];
	}

	get schema() {
		return this[I.SCHEMA];
	}

	async fetch() {
		const {
			[_S.LOCATION.ORIGIN.DATA]: toDataOrigin,
			[_S.LOCATION.ORIGIN.SCHEMA]: toSchemaOrigin,
		} = this[I.CONSTRUCTOR];

		const { [I.LOCATION]: location } = this;
		const dataOrigin = toDataOrigin(location);
		const schemaOrigin = toSchemaOrigin(location);

		const data = await this[I.TRANSCRIBER.DATA].transcribe(dataOrigin);
		const schema = await this[I.TRANSCRIBER.SCHEMA].transcribe(schemaOrigin);
		const languageTagList = await this[_I.LANGUAGE.FETCH](location);

		for await(const languageTag of languageTagList) {
			await this[I.LANGUAGE].append(languageTag);
		}

		const result = ValidationResult.execute(schema, data, this[I.LANGUAGE]);

		if (!result.ok) {
			result.throw();
		}

		this[I.SCHEMA] = schema;
		this[I.DATA] = data;
	}

	static async attach(location, force) {
		const {
			[_S.LOCATION.IS]: isLocation,
			[_S.LOCATION.DESCRIPTION]: locationDescription,
		} = this;

		if (!isLocation(location)) {
			ThrowTypeError('args[0] as location', locationDescription);
		}

		if (typeof force !== 'boolean') {
			ThrowTypeError('args[1] as force', 'boolean');
		}

		const storage = new this(location);

		await storage.fetch();

		return storage();
	}

	static [S.VERSION] = PACKAGE.VERSION;

	static get meta() {
		const {
			[_S.TRANSCRIBER.DATA]: {
				Provider: DataProvider,
				Node: DataNode,
			},
			[_S.TRANSCRIBER.SCHEMA]: {
				Provider: SchemaProvider,
				Node: SchemaNode,
			},
		} = this;

		return {
			linen: {
				storage: {
					version: this[S.VERSION],
				},
			},
			implementation: {
				name: this[_S.IMPLEMENTATION.NAME],
				version: this[_S.IMPLEMENTATION.VERSION],
				description: this[_S.IMPLEMENTATION.DESCRIPTION],
				node: {
					data: DataNode.meta,
					schema: SchemaNode.meta,
				},
				provider: {
					data: DataProvider.meta,
					schema: SchemaProvider.meta,
				},
			},
		};
	}

	static isLocation(value) {
		return this[_S.LOCATION.IS](value);
	}

	static get SchemaNode() {
		return this[_S.TRANSCRIBER.SCHEMA].Node;
	}
}, ...[
	Abstract.Static({
		[_S.TRANSCRIBER.DATA]: Parser.DataTranscribeConstructor,
		[_S.TRANSCRIBER.SCHEMA]: Parser.SchemaTranscriberConstructor,
	}),
	Abstract.storage({
		[_S.LOCATION.IS]: M.Method(M.Any).returns(M.Boolean),
		[_S.LOCATION.DESCRIPTION]: M.String,
		[_S.LOCATION.ORIGIN.DATA]: M.Method().args(M.Any).returns(M.Any),
		[_S.LOCATION.ORIGIN.SCHEMA]: M.Method().args(M.Any).returns(M.Any),
	}),
	Abstract.Static({
		[_S.IMPLEMENTATION.NAME]: M.String,
		[_S.IMPLEMENTATION.VERSION]: M.String,
		[_S.IMPLEMENTATION.DESCRIPTION]: M.String,
	}),
	Abstract({
		[_I.LANGUAGE.FETCH]: M.Method().args(M.Instance(Promise)),
	}),
]);
