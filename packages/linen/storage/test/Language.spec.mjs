import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	isLanguageTag,
	toCode,
	Language,
	Registry as LanguageRegistry,
} from '../src/Language.mjs';

describe('isLanguageTag()', () => {
	for (const tag of ['en', 'zh-CN', 'ja-JP', 'en-US', 'und']) {
		it(`should return true for "${tag}".`, () => {
			assert.equal(isLanguageTag(tag), true);
		});
	}

	for (const [title, value] of [
		['an empty string', ''],
		['a number', 123],
		['null', null],
		['undefined', undefined],
		['an invalid tag', '!!!'],
	]) {
		it(`should return false for ${title}.`, () => {
			assert.equal(isLanguageTag(value), false);
		});
	}
});

describe('toCode()', () => {
	it('should return an 8-char hex string.', async () => {
		const code = await toCode('en');

		assert.equal(typeof code, 'string');
		assert.equal(code.length, 8);
		assert.match(code, /^[0-9a-f]{8}$/);
	});

	it('should return the same code for the same tag.', async () => {
		const code1 = await toCode('en');
		const code2 = await toCode('en');

		assert.equal(code1, code2);
	});

	it('should return different codes for different tags.', async () => {
		const codeEn = await toCode('en');
		const codeZh = await toCode('zh-CN');

		assert.notEqual(codeEn, codeZh);
	});

	it('should throw if tag is invalid.', async () => {
		await assert.rejects(() => toCode('!!!'), {
			name: 'TypeError',
		});
	});
});

describe('Language', () => {
	describe('new()', () => {
		it('should create a language.', () => {
			const lang = new Language('en');

			assert.ok(lang instanceof Language);
		});

		it('should throw if tag is invalid.', () => {
			assert.throws(() => new Language('!!!'), {
				name: 'TypeError',
			});
		});
	});

	describe('.tag', () => {
		it('should return the language tag.', () => {
			const lang = new Language('zh-CN');

			assert.equal(lang.tag, 'zh-CN');
		});
	});

	describe('.code', () => {
		it('should return "00000000" before prepare.', () => {
			const lang = new Language('en');

			assert.equal(lang.code, '00000000');
		});

		it('should return a valid code after prepare.', async () => {
			const lang = new Language('en');

			await lang.prepare();
			assert.match(lang.code, /^[0-9a-f]{8}$/);
			assert.notEqual(lang.code, '00000000');
		});
	});

	describe('.prepare()', () => {
		it('should compute the code from the tag.', async () => {
			const lang = new Language('en');
			const expected = await toCode('en');

			await lang.prepare();
			assert.equal(lang.code, expected);
		});
	});
});

describe('LanguageRegistry', () => {
	describe('.current', () => {
		it('should throw if registry is empty.', () => {
			const registry = new LanguageRegistry();

			assert.throws(() => registry.current, {
				message: /No language/,
			});
		});

		it('should return the current language.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			assert.equal(registry.current.tag, 'en');
		});
	});

	describe('.default', () => {
		it('should throw if registry is empty.', () => {
			const registry = new LanguageRegistry();

			assert.throws(() => registry.default, {
				message: /No language/,
			});
		});

		it('should return the default language.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			assert.equal(registry.default.tag, 'en');
		});
	});

	describe('.use()', () => {
		it('should switch current language by tag.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			await registry.append('zh-CN');
			registry.use('zh-CN');
			assert.equal(registry.current.tag, 'zh-CN');
		});

		it('should throw if tag is invalid.', () => {
			const registry = new LanguageRegistry();

			assert.throws(() => registry.use('!!!'), {
				name: 'TypeError',
			});
		});

		it('should throw if tag is not found.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			assert.throws(() => registry.use('zh-CN'), {
				message: /not found/,
			});
		});
	});

	describe('.useIndex()', () => {
		it('should switch current language by index.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			await registry.append('zh-CN');
			registry.useIndex(1);
			assert.equal(registry.current.tag, 'zh-CN');
		});

		for (const [title, value] of [
			['a negative number', -1],
			['a float', 1.5],
			['a string', 'foo'],
			['null', null],
		]) {
			it(`should throw if index is ${title}.`, () => {
				const registry = new LanguageRegistry();

				assert.throws(() => registry.useIndex(value), {
					name: 'TypeError',
				});
			});
		}
	});

	describe('.append()', () => {
		it('should add a language and return it.', async () => {
			const registry = new LanguageRegistry();
			const lang = await registry.append('en');

			assert.ok(lang instanceof Language);
			assert.equal(lang.tag, 'en');
			assert.match(lang.code, /^[0-9a-f]{8}$/);
		});

		it('should throw if tag is invalid.', async () => {
			const registry = new LanguageRegistry();

			await assert.rejects(() => registry.append('!!!'), {
				name: 'TypeError',
			});
		});

		it('should throw if tag already exists.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			await assert.rejects(() => registry.append('en'), {
				message: /already exists/,
			});
		});
	});

	describe('.languages()', () => {
		it('should yield all languages.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			await registry.append('zh-CN');

			const tags = Array.from(registry.languages(), l => l.tag);

			assert.deepEqual(tags, ['en', 'zh-CN']);
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('should iterate all languages.', async () => {
			const registry = new LanguageRegistry();

			await registry.append('en');
			await registry.append('ja-JP');

			const tags = Array.from(registry, l => l.tag);

			assert.deepEqual(tags, ['en', 'ja-JP']);
		});
	});
});
