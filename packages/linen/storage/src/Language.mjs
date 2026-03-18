import * as Ow from '@produck/ow';
import { ThrowTypeError } from '@produck/type-error';

function toHexFromByte(byte) {
	return byte.toString(16).padStart(2, '0');
}

function toHexFromBuffer(buffer) {
	return Array.from(new Uint8Array(buffer), toHexFromByte).join('');
}

function assertBcp47LanguageTag(tag, role) {
	if (!isLanguageTag(tag)) {
		ThrowTypeError(role, 'language tag in BCP 47');
	}
}

export async function toCode(tag) {
	assertBcp47LanguageTag(tag, 'args[0] as tag');

	const plainBuffer = new TextEncoder().encode(tag);
	const buffer = await crypto.subtle.digest('SHA-256', plainBuffer);

	return toHexFromBuffer(buffer).slice(0, 8);
}

export function isLanguageTag(tag) {
	try {
		void new Intl.Locale(tag);
	} catch {
		return false;
	}

	return true;
}

export class Language {
	#tag = 'und';
	#code = '00000000';

	constructor(tag) {
		assertBcp47LanguageTag(tag, 'args[0] as tag');
		this.#tag = tag;
	}

	async prepare() {
		this.#code = await toCode(this.#tag);
	}

	get tag() {
		return this.#tag;
	}

	get code() {
		return this.#code;
	}
}

export class LanguageRegistry {
	/**@type {Language[]}  */
	#list = [];
	#currentIndex = 0;

	#assertNotEmpty() {
		if (this.#list.length === 0) {
			Ow.Error.Common('No language.');
		}
	}

	get current() {
		this.#assertNotEmpty();

		return this.#list[this.#currentIndex];
	}

	get default() {
		this.#assertNotEmpty();

		return this.#list[this.#currentIndex];
	}

	use(tag) {
		assertBcp47LanguageTag(tag, 'args[0] as tag');

		const index = this.#list.findIndex(language => language.tag === tag);

		if (index === -1) {
			Ow.Error.Common(`Language "${tag}" not found.`);
		}

		this.#currentIndex = index;
	}

	useIndex(index) {
		if (!Number.isInteger(index) || index < 0) {
			ThrowTypeError('args[0] as index', 'integer(>=0)');
		}

		this.#currentIndex = index;
	}

	async append(tag) {
		assertBcp47LanguageTag(tag, 'args[0] as tag');

		if (this.#list.some(language => language.tag === tag)) {
			Ow.Error.Common(`Language "${tag}" already exists.`);
		}

		const language = new Language(tag);

		await language.prepare();
		this.#list.push(language);

		return language;
	}

	*languages() {
		yield * this.#list;
	}

	*[Symbol.iterator]() {
		yield * this.languages();
	}
}

export { LanguageRegistry as Registry };
