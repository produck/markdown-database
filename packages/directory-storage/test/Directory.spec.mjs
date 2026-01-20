import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import Directory, { ENTER, LEAVE } from '../src/Directory.mjs';

describe('::Directory()', () => {
	describe('new ()', () => {
		it('should create a directory', () => {
			new Directory();
		});
	});

	describe('::isDirectory()', () => {
		it('should get true.', () => {
			assert.equal(Directory.isDirectory(new Directory()), true);
		});

		it('should get false.', () => {
			assert.equal(Directory.isDirectory(null), false);
		});
	});

	describe('.parent', () => {
		it('should get null.', () => {
			assert.equal(new Directory().parent, null);
		});

		it('should get its parent.', () => {
			const parent = new Directory();
			const directory = new Directory();

			parent.appendChild(directory);
			assert.equal(directory.parent, parent);
		});
	});

	describe('.name', () => {
		it('should get "".', () => {
			const directory = new Directory();

			assert.equal(directory.name, '');
		});

		it('should set a new value', () => {
			const directory = new Directory();

			directory.name = 'foo';
			assert.equal(directory.name, 'foo');
		});

		it('should throw if set bad value.', () => {
			const directory = new Directory();

			assert.throws(() => directory.name = false, {
				name: 'TypeError',
				message: 'Invalid "assigned value", one "string" excepted.',
			});
		});

		it('should throw if new value to be same with other siblings.', () => {
			const parent = new Directory();
			const childFoo = new Directory();
			const childBar = new Directory();

			childFoo.name = 'foo';
			childBar.name = 'bar';
			parent.appendChild(childFoo);
			parent.appendChild(childBar);

			assert.throws(() => childBar.name = 'foo', {
				name: 'Error',
				message: 'One sibling directory named "foo" has been existed.',
			});
		});
	});

	describe('.data', () => {
		it('should set data.', () => {
			const directory = new Directory();

			directory.data = 'foo';
		});

		it('should get data.', () => {
			const directory = new Directory();

			assert.notEqual(directory.data, 'bar');
			directory.data = 'bar';
			assert.equal(directory.data, 'bar');
		});
	});

	describe('.hasChild()', () => {
		it('should throw if bad name.', () => {
			const directory = new Directory();

			assert.throws(() => directory.hasChild(false), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "string" excepted.',
			});
		});

		it('should get true.', () => {
			const directory = new Directory();
			const child = new Directory;

			child.name = 'foo';
			directory.appendChild(child);
			assert.equal(directory.hasChild('foo'), true);
		});

		it('should get false.', () => {
			const directory = new Directory();

			assert.equal(directory.hasChild('notExisted'), false);
		});
	});

	describe('.appendChild()', () => {
		it('should throw if bad directory.', () => {
			const directory = new Directory();

			assert.throws(() => directory.appendChild(null), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "Directory" expected.',
			});
		});

		it('should ok.', () => {
			const directory = new Directory();
			const child = new Directory();

			assert.equal([...directory.children()].length, 0);
			assert.equal(directory.appendChild(child), child);
			assert.equal([...directory.children()].length, 1);
		});

		it('should repeat to append a same child without other action.', () => {
			const directory = new Directory();
			const child = new Directory();

			directory.appendChild(child);
			assert.equal(directory.appendChild(child), child);
		});

		it('should throw if name duplicated child.', () => {
			const directory = new Directory();
			const child = new Directory();
			const badChild = new Directory();

			child.name = 'foo';
			badChild.name = 'foo';
			directory.appendChild(child);

			assert.throws(() => directory.appendChild(badChild), {
				name: 'Error',
				message: 'One child named "foo" has been existed.',
			});
		});
	});

	describe('.removeChild()', () => {
		it('should throw if bad directory.', () => {
			const directory = new Directory();

			assert.throws(() => directory.removeChild(null), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "Directory" expected.',
			});
		});

		it('should throw if not child.', () => {
			const directory = new Directory();

			assert.throws(() => directory.removeChild(new Directory()), {
				name: 'Error',
				message: 'The directory to be removed is not a child of this directory.',
			});
		});

		it('should ok.', () => {
			const directory = new Directory();
			const child = new Directory();

			directory.appendChild(child);
			assert.equal(directory.removeChild(child), child);
		});
	});

	describe('.*children()', () => {
		it('should visit all children.', () => {
			const a = new Directory();
			const aa = new Directory();
			const ab = new Directory();
			const ac = new Directory();
			const ad = new Directory();

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
			const a = new Directory();
			const aa = new Directory();
			const aaa = new Directory();
			const ab = new Directory();
			const aba = new Directory();
			const abb = new Directory();

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
