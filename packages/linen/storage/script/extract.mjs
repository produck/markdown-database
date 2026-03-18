import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PackageExtractor } from '@produck/package-meta-extractor';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT_PATHNAME = path.resolve(__dirname, '../');
const OUTPUT = path.resolve(PACKAGE_ROOT_PATHNAME, 'src/package.gen.mjs');
const extractor = new PackageExtractor(PACKAGE_ROOT_PATHNAME);

await extractor.read();
await extractor.generate(OUTPUT);
