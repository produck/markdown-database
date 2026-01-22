import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ACTION } from '../src/Symbol.mjs';
import AbstractDirectory, { _I, _S } from '../src/Abstract.mjs';

class TestDirectory extends AbstractDirectory {
	[_I.NAME.INIT]() {
		return '';
	}

	get [_I.NAME.DESCRIPTION]() {
		return 'string';
	}

	[_I.NAME.EQUAL](a, b) {
		return a === b;
	}

	[_I.NAME.IS_VALID](value) {
		return typeof value === 'string';
	}

	[_I.NAME.TO_STRING](name) {
		return name;
	}

	[_I.DATA.INIT]() {
		return null;
	}

	get [_I.DATA.DESCRIPTION]() {
		return 'PlainObject';
	}

	[_I.DATA.IS_VALID](value) {
		return value !== 'bad';
	}

	static get [_S.MODEL.NAME]() {
		return 'foo';
	}

	static get [_S.MODEL.DATA]() {
		return 'bar';
	}
}

const { ENTER, LEAVE } = ACTION;

describe('::Directory()', () => {
	describe('new ()', () => {
		it('should create a directory', () => {
			new TestDirectory();
		});
	});

	describe('::isDirectory()', () => {
		it('should get true.', () => {
			assert.equal(TestDirectory.isDirectory(new TestDirectory()), true);
		});

		it('should get false.', () => {
			assert.equal(TestDirectory.isDirectory(null), false);
		});
	});

	describe('::model', () => {
		it('should get model.', () => {
			assert.deepEqual(TestDirectory.model, {
				name: 'foo',
				data: 'bar',
			});
		});
	});

	describe('.parent', () => {
		it('should get null.', () => {
			assert.equal(new TestDirectory().parent, null);
		});

		it.only('should get its parent.', () => {
			const parent = new TestDirectory();
			const directory = new TestDirectory();

			parent.appendChild(directory);
			assert.equal(directory.parent, parent);
		});
	});

	describe('.name', () => {
		it('should get "".', () => {
			const directory = new TestDirectory();

			assert.equal(directory.name, '');
		});

		it('should set a new value', () => {
			const directory = new TestDirectory();

			directory.name = 'foo';
			assert.equal(directory.name, 'foo');
		});

		it('should throw if set bad value.', () => {
			const directory = new TestDirectory();

			assert.throws(() => directory.name = false, {
				name: 'TypeError',
				message: 'Invalid "assigned value", one "string" expected.',
			});
		});

		it('should throw if new value to be same with other siblings.', () => {
			const parent = new TestDirectory();
			const childFoo = new TestDirectory();
			const childBar = new TestDirectory();

			childFoo.name = 'foo';
			childBar.name = 'bar';
			parent.appendChild(childFoo);
			parent.appendChild(childBar);

			assert.throws(() => childBar.name = 'foo', {
				name: 'Error',
				message: 'A sibling directory named "foo" has been existed.',
			});
		});
	});

	describe('.data', () => {
		it('should set data.', () => {
			const directory = new TestDirectory();

			directory.data = 'foo';
		});

		it('should get data.', () => {
			const directory = new TestDirectory();

			assert.notEqual(directory.data, 'bar');
			directory.data = 'bar';
			assert.equal(directory.data, 'bar');
		});

		it('should throw if set bad data.', () => {
			const directory = new TestDirectory();

			assert.throws(() => directory.data = 'bad', {
				name: 'TypeError',
				message: 'Invalid "assigned value", one "PlainObject" expected.',
			});
		});
	});

	describe('.hasChild()', () => {
		it('should throw if bad name.', () => {
			const directory = new TestDirectory();

			assert.throws(() => directory.hasChild(false), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "string" expected.',
			});
		});

		it('should get true.', () => {
			const directory = new TestDirectory();
			const child = new TestDirectory;

			child.name = 'foo';
			directory.appendChild(child);
			assert.equal(directory.hasChild('foo'), true);
		});

		it('should get false.', () => {
			const directory = new TestDirectory();

			assert.equal(directory.hasChild('notExisted'), false);
		});
	});

	describe('.appendChild()', () => {
		it('should throw if bad directory.', () => {
			const directory = new TestDirectory();

			assert.throws(() => directory.appendChild(null), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "Directory" expected.',
			});
		});

		it('should ok.', () => {
			const directory = new TestDirectory();
			const child = new TestDirectory();

			assert.equal([...directory.children()].length, 0);
			assert.equal(directory.appendChild(child), child);
			assert.equal([...directory.children()].length, 1);
		});

		it('should repeat to append a same child without other action.', () => {
			const directory = new TestDirectory();
			const child = new TestDirectory();

			directory.appendChild(child);
			assert.equal(directory.appendChild(child), child);
		});

		it('should throw if name duplicated child.', () => {
			const directory = new TestDirectory();
			const child = new TestDirectory();
			const badChild = new TestDirectory();

			child.name = 'foo';
			badChild.name = 'foo';
			directory.appendChild(child);

			assert.throws(() => directory.appendChild(badChild), {
				name: 'Error',
				message: 'A child named "foo" has been existed.',
			});
		});
	});

	describe('.removeChild()', () => {
		it('should throw if bad directory.', () => {
			const directory = new TestDirectory();

			assert.throws(() => directory.removeChild(null), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "Directory" expected.',
			});
		});

		it('should throw if not child.', () => {
			const directory = new TestDirectory();

			assert.throws(() => directory.removeChild(new TestDirectory()), {
				name: 'Error',
				message: 'The directory to be removed is not a child of this directory.',
			});
		});

		it('should ok.', () => {
			const directory = new TestDirectory();
			const child = new TestDirectory();

			directory.appendChild(child);
			assert.equal(directory.removeChild(child), child);
		});
	});

	describe('.*children()', () => {
		it('should visit all children.', () => {
			const a = new TestDirectory();
			const aa = new TestDirectory();
			const ab = new TestDirectory();
			const ac = new TestDirectory();
			const ad = new TestDirectory();

			a.name = 'a';
			aa.name = 'aa';
			ab.name = 'ab';
			ac.name = 'ac';
			ab.name = 'ad';

			for (const child of [aa, ab, ac, ad]) {
				a.appendChild(child);
			}

			const list = [];

			for (const child of a.children()) {
				list.push(child);
			}

			for (const child of [aa, ab, ac, ad]) {
				assert.ok(list.includes(child));
			}
		});
	});

	describe('.*directories()', () => {
		it('should visit all directories.', () => {
			const a = new TestDirectory();
			const aa = new TestDirectory();
			const aaa = new TestDirectory();
			const ab = new TestDirectory();
			const aba = new TestDirectory();
			const abb = new TestDirectory();

			a.name = 'a';
			aa.name = 'aa';
			aaa.name = 'aaa';
			ab.name = 'ab';
			aba.name = 'aba';
			abb.name = 'abb';

			a.appendChild(aa);
			a.appendChild(ab);
			aa.appendChild(aaa);
			ab.appendChild(aba);
			ab.appendChild(abb);

			const stepList = [];

			for (const step of a.directories()) {
				stepList.push(step);
			}

			assert.deepEqual(stepList, [
				{ directory: a, action: ENTER },
				{ directory: aa, action: ENTER },
				{ directory: aaa, action: ENTER },
				{ directory: aaa, action: LEAVE },
				{ directory: aa, action: LEAVE },
				{ directory: ab, action: ENTER },
				{ directory: aba, action: ENTER },
				{ directory: aba, action: LEAVE },
				{ directory: abb, action: ENTER },
				{ directory: abb, action: LEAVE },
				{ directory: ab, action: LEAVE },
				{ directory: a, action: LEAVE },
			]);
		});
	});
});
