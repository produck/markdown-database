import * as assert from 'node:assert/strict';
import { describe, it, before } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import FSDirectoryProvider from '../src/Provider.mjs';

describe('::FSDirectoryProvider()', () => {
	describe('.seek()', () => {
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const tempDir = path.resolve(__dirname, 'sample.ign');
		const rootPathname = path.resolve(tempDir, 'a');
		const p = (...segments) => path.join(rootPathname, ...segments);

		before(async () => {
			// Clean up old directory if it exists
			await fs.rm(tempDir, { recursive: true, force: true });

			// Create directory structure
			await fs.mkdir(path.join(rootPathname, 'aa', 'aaa'), { recursive: true });
			await fs.mkdir(path.join(rootPathname, 'ab', 'aba'), { recursive: true });
			await fs.mkdir(path.join(rootPathname, 'ab', 'abb', 'abba'), { recursive: true });
			await fs.mkdir(path.join(rootPathname, 'ac'), { recursive: true });

			// Create bad file
			await fs.writeFile(path.join(rootPathname, 'bad'), '');
		});

		it('should traverse sample/a directory tree', async () => {
			const provider = new FSDirectoryProvider();
			const visited = [];

			for await (const step of provider.seek(rootPathname)) {
				visited.push({ origin: step.node.origin, action: step.action });
			}

			assert.deepEqual(visited, [
				{ origin: p(), action: true },
				{ origin: p('aa'), action: true },
				{ origin: p('aa', 'aaa'), action: true },
				{ origin: p('aa', 'aaa'), action: false },
				{ origin: p('aa'), action: false },
				{ origin: p('ab'), action: true },
				{ origin: p('ab', 'aba'), action: true },
				{ origin: p('ab', 'aba'), action: false },
				{ origin: p('ab', 'abb'), action: true },
				{ origin: p('ab', 'abb', 'abba'), action: true },
				{ origin: p('ab', 'abb', 'abba'), action: false },
				{ origin: p('ab', 'abb'), action: false },
				{ origin: p('ab'), action: false },
				{ origin: p('ac'), action: true },
				{ origin: p('ac'), action: false },
				{ origin: p(), action: false },
			]);
		});

		it('should throw error when origin is not a directory', async () => {
			const provider = new FSDirectoryProvider();

			await assert.rejects(async () => {
				for await (const step of provider.seek(p('bad'))) {
					void step;
				}
			}, {
				name: 'Error',
				message: /MUST be a directory/,
			});
		});
	});
});
