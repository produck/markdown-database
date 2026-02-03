import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ENTER, LEAVE } from '../src/Action.mjs';
import AbstractNode from '../src/Abstract.mjs';
import { _I, _S } from '../src/Symbol.mjs';

class TestNode extends AbstractNode {
	[_I.NAME.INIT]() {
		return '';
	}

	[_I.NAME.EQUAL](a, b) {
		return a === b;
	}

	[_I.NAME.TO_STRING](name) {
		return name;
	}

	[_I.DATA.INIT]() {
		return null;
	}

	static [_S.NAME.IS_VALID](value) {
		return typeof value === 'string';
	}

	static get [_S.NAME.DESCRIPTION]() {
		return 'string';
	}

	static [_S.DATA.IS_VALID](value) {
		return value !== 'bad';
	}

	static get [_S.DATA.DESCRIPTION]() {
		return 'PlainObject';
	}
}

describe('::Directory()', () => {
	describe('new()', () => {
		it('should create a directory', () => {
			new TestNode();
		});
	});

	describe('::isNode()', () => {
		it('should get true.', () => {
			assert.equal(TestNode.isNode(new TestNode()), true);
		});

		it('should get false.', () => {
			assert.equal(TestNode.isNode(null), false);
		});
	});

	describe('::isValidName()', () => {
		it('should get false.', () => {
			assert.equal(TestNode.isValidName(null), false);
		});

		it('should get true.', () => {
			assert.equal(TestNode.isValidName('foo'), true);
		});
	});

	describe('::isValidData()', () => {
		it('should get false.', () => {
			assert.equal(TestNode.isValidData('bad'), false);
		});

		it('should get true.', () => {
			assert.equal(TestNode.isValidData({}), true);
		});
	});

	describe('::description', () => {
		it('should get model.', () => {
			assert.deepEqual(TestNode.description, {
				name: 'string',
				data: 'PlainObject',
			});
		});
	});

	describe('.name', () => {
		it('should get "".', () => {
			const directory = new TestNode();

			assert.equal(directory.name, '');
		});

		it('should set a new value', () => {
			const directory = new TestNode();

			directory.name = 'foo';
			assert.equal(directory.name, 'foo');
		});

		it('should throw if set bad value.', () => {
			const directory = new TestNode();

			assert.throws(() => directory.name = false, {
				name: 'TypeError',
				message: 'Invalid "assigned value", one "string" expected.',
			});
		});

		it.skip('should throw if new value to be same with other siblings.', () => {
			const parent = new TestNode();
			const childFoo = new TestNode();
			const childBar = new TestNode();

			childFoo.name = 'foo';
			childBar.name = 'bar';
			parent.appendChild(childFoo);
			parent.appendChild(childBar);

			assert.throws(() => childBar.name = 'foo', {
				name: 'Error',
				message: 'A sibling node named "foo" has been existed.',
			});
		});
	});

	describe('.data', () => {
		it('should set data.', () => {
			const directory = new TestNode();

			directory.data = 'foo';
		});

		it('should get data.', () => {
			const directory = new TestNode();

			assert.notEqual(directory.data, 'bar');
			directory.data = 'bar';
			assert.equal(directory.data, 'bar');
		});

		it('should throw if set bad data.', () => {
			const directory = new TestNode();

			assert.throws(() => directory.data = 'bad', {
				name: 'TypeError',
				message: 'Invalid "assigned value", one "PlainObject" expected.',
			});
		});
	});

	describe('(reference properties)', () => {
		function Sample() {
			const parent = new TestNode();
			const a = new TestNode();
			const b = new TestNode();

			a.name = 'a';
			b.name = 'b';
			parent.appendChild(a);
			parent.appendChild(b);

			return { parent, child: { a, b } };
		}

		describe('.parent', () => {
			it('should get null.', () => {
				assert.equal(new TestNode().parent, null);
			});

			it('should get its parent.', () => {
				const { parent, child } = Sample();

				assert.equal(child.a.parent, parent);
			});
		});

		describe('.previousSibling', () => {
			it('should get null', () => {
				assert.equal(new TestNode().previousSibling, null);
			});

			it('should get a from b.', () => {
				const { child } = Sample();

				assert.equal(child.a.previousSibling, null);
				assert.equal(child.b.previousSibling, child.a);
			});
		});

		describe('.nextSibling', () => {
			it('should get null', () => {
				assert.equal(new TestNode().nextSibling, null);
			});

			it('should get b from a.', () => {
				const { child } = Sample();

				assert.equal(child.a.nextSibling, child.b);
				assert.equal(child.b.nextSibling, null);
			});
		});

		describe('.firstChild', () => {
			it('should get null', () => {
				assert.equal(new TestNode().firstChild, null);
			});

			it('should get a.', () => {
				const { parent, child } = Sample();

				assert.equal(parent.firstChild, child.a);
			});
		});

		describe('.lastChild', () => {
			it('should get null', () => {
				assert.equal(new TestNode().lastChild, null);
			});

			it('should get b.', () => {
				const { parent, child } = Sample();

				assert.equal(parent.lastChild, child.b);
			});
		});
	});

	describe('(iterators)', () => {
		describe('.*parents()', () => {
			it('should get a generator.', () => {
				const a = new TestNode();
				const aa = new TestNode();
				const aaa = new TestNode();

				a.name = 'a';
				aa.name = 'aa';
				aaa.name = 'aaa';

				a.appendChild(aa);
				aa.appendChild(aaa);

				const parents = aaa.parents();

				assert.ok(!Array.isArray(parents));
				assert.deepEqual([...parents], [aaa, aa, a]);
			});
		});

		describe('.*children()', () => {
			it('should visit all children.', () => {
				const a = new TestNode();
				const aa = new TestNode();
				const ab = new TestNode();
				const ac = new TestNode();
				const ad = new TestNode();

				a.name = 'a';
				aa.name = 'aa';
				ab.name = 'ab';
				ac.name = 'ac';
				ad.name = 'ad';

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

		describe('.*nodes()', () => {
			it('should visit all nodes.', () => {
				const a = new TestNode();
				const aa = new TestNode();
				const aaa = new TestNode();
				const ab = new TestNode();
				const aba = new TestNode();
				const abb = new TestNode();

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

				for (const step of a.nodes()) {
					stepList.push(step);
				}

				assert.deepEqual(stepList, [
					{ node: a, action: ENTER },
					{ node: aa, action: ENTER },
					{ node: aaa, action: ENTER },
					{ node: aaa, action: LEAVE },
					{ node: aa, action: LEAVE },
					{ node: ab, action: ENTER },
					{ node: aba, action: ENTER },
					{ node: aba, action: LEAVE },
					{ node: abb, action: ENTER },
					{ node: abb, action: LEAVE },
					{ node: ab, action: LEAVE },
					{ node: a, action: LEAVE },
				]);
			});
		});
	});

	describe('.hasChildNodes()', () => {
		it('should get false.', () => {
			assert.equal(new TestNode().hasChildNodes(), false);
		});

		it('should get true.', () => {
			const parent = new TestNode();
			const child = new TestNode();

			parent.appendChild(child);
			assert.equal(parent.hasChildNodes(), true);
		});
	});

	describe('.isSameNode()', () => {
		it('should get true.', () => {
			const a = new TestNode();

			assert.equal(a.isSameNode(a), true);
		});

		it('should get false.', () => {
			const a = new TestNode();
			const b = new TestNode();

			assert.equal(a.isSameNode(b), false);
		});

		it('should throw if bad node.', () => {
			const a = new TestNode();

			assert.throws(() => a.isSameNode(null), {
				name: 'TypeError',
				message: 'Invalid "args[0] as node", one "Node" expected.',
			});
		});

		it('should throw if other Node class instance.', () => {
			const a = new TestNode();

			class OtherNode extends AbstractNode {
				[_I.NAME.INIT]() {
					return '';
				}

				[_I.NAME.EQUAL](a, b) {
					return a === b;
				}

				[_I.NAME.TO_STRING](name) {
					return name;
				}

				[_I.DATA.INIT]() {
					return null;
				}

				static [_S.NAME.IS_VALID](value) {
					return typeof value === 'string';
				}

				static get [_S.NAME.DESCRIPTION]() {
					return 'string';
				}

				static [_S.DATA.IS_VALID](value) {
					return value !== 'bad';
				}

				static get [_S.DATA.DESCRIPTION]() {
					return 'PlainObject';
				}
			}

			assert.throws(() => a.isSameNode(new OtherNode()), {
				name: 'TypeError',
				message: 'Invalid "args[0] as node", one "Node" expected.',
			});
		});
	});

	describe('.isNameEqualNode()', () => {
		it('should get true.', () => {
			const a = new TestNode();
			const b = new TestNode();

			a.name = 'foo';
			b.name = 'foo';

			assert.equal(a.isNameEqualNode(b), true);
		});

		it('should get false.', () => {
			const a = new TestNode();
			const b = new TestNode();

			a.name = 'foo';
			b.name = 'bar';

			assert.equal(a.isNameEqualNode(b), false);
		});

		it('should throw if bad node.', () => {
			const a = new TestNode();

			assert.throws(() => a.isNameEqualNode(null), {
				name: 'TypeError',
				message: 'Invalid "args[0] as node", one "Node" expected.',
			});
		});

		it('should throw if other Node class instance.', () => {
			const a = new TestNode();

			class OtherNode extends AbstractNode {
				[_I.NAME.INIT]() {
					return '';
				}

				[_I.NAME.EQUAL](a, b) {
					return a === b;
				}

				[_I.NAME.TO_STRING](name) {
					return name;
				}

				[_I.DATA.INIT]() {
					return null;
				}

				static [_S.NAME.IS_VALID](value) {
					return typeof value === 'string';
				}

				static get [_S.NAME.DESCRIPTION]() {
					return 'string';
				}

				static [_S.DATA.IS_VALID](value) {
					return value !== 'bad';
				}

				static get [_S.DATA.DESCRIPTION]() {
					return 'PlainObject';
				}
			}

			assert.throws(() => a.isNameEqualNode(new OtherNode()), {
				name: 'TypeError',
				message: 'Invalid "args[0] as node", one "Node" expected.',
			});
		});
	});

	describe.skip('.contains()', () => {
		it('should throw if bad node.', () => {
			const node = new TestNode();

			assert.throws(() => node.contains(null), {
				name: 'TypeError',
				message: '',
			});
		});
	});

	describe('.appendChild()', () => {
		it('should throw if bad directory.', () => {
			const node = new TestNode();

			assert.throws(() => node.appendChild(null), {
				name: 'TypeError',
				message: 'Invalid "args[0] as node", one "Node" expected.',
			});
		});

		it('should append 1 child.', () => {
			const parent = new TestNode();
			const child = new TestNode();

			parent.appendChild(child);

			assert.equal(parent.firstChild, child);
			assert.equal(parent.lastChild, child);
			assert.equal(child.previousSibling, null);
			assert.equal(child.nextSibling, null);
			assert.equal(child.parent, parent);
		});

		it('should append 2 children.', () => {
			const parent = new TestNode();
			const childA = new TestNode();
			const childB = new TestNode();

			childA.name = 'a';
			childB.name = 'b';
			parent.appendChild(childA);
			parent.appendChild(childB);

			assert.equal(parent.firstChild, childA);
			assert.equal(parent.lastChild, childB);
			assert.equal(childA.previousSibling, null);
			assert.equal(childB.previousSibling, childA);
			assert.equal(childA.nextSibling, childB);
			assert.equal(childB.nextSibling, null);
			assert.equal(childA.parent, parent);
			assert.equal(childB.parent, parent);
		});

		it('should append 3 children.', () => {
			const parent = new TestNode();
			const childA = new TestNode();
			const childB = new TestNode();
			const childC = new TestNode();

			childA.name = 'a';
			childB.name = 'b';
			childC.name = 'c';
			parent.appendChild(childA);
			parent.appendChild(childB);
			parent.appendChild(childC);

			assert.equal(parent.firstChild, childA);
			assert.equal(parent.lastChild, childC);
			assert.equal(childA.previousSibling, null);
			assert.equal(childB.previousSibling, childA);
			assert.equal(childC.previousSibling, childB);
			assert.equal(childA.nextSibling, childB);
			assert.equal(childB.nextSibling, childC);
			assert.equal(childC.nextSibling, null);
			assert.equal(childA.parent, parent);
			assert.equal(childB.parent, parent);
			assert.equal(childC.parent, parent);
		});

		it('should throw if appending ancestor node.', () => {
			const a = new TestNode();
			const aa = new TestNode();
			const aaa = new TestNode();

			a.appendChild(aa);
			aa.appendChild(aaa);

			assert.throws(() => aa.appendChild(a), {
				name: 'Error',
				message: 'The new child is an ancestor of the parent',
			});
		});
	});

	describe.skip('.removeChild()', () => {
		it('should throw if bad directory.', () => {
			const directory = new TestNode();

			assert.throws(() => directory.removeChild(null), {
				name: 'TypeError',
				message: 'Invalid "args[0]", one "Node" expected.',
			});
		});

		it('should throw if not child.', () => {
			const directory = new TestNode();

			assert.throws(() => directory.removeChild(new TestNode()), {
				name: 'Error',
				message: 'The node to be removed is not a child of this node.',
			});
		});

		it('should ok.', () => {
			const directory = new TestNode();
			const child = new TestNode();

			directory.appendChild(child);
			assert.equal(directory.removeChild(child), child);
		});
	});

	describe.skip('.replaceChild()', () => {

	});

	describe.skip('.insertBefore()', () => {

	});
});
