import { ThrowTypeError, AssertionChecker } from '@produck/type-error';
import Abstract, { Member as M } from '@produck/es-abstract';

import * as ACTION from './Action.mjs';
import { Step, isStep, $I } from './Step.mjs';

const I = {
	CONSTRUCTOR: Symbol('.#constructor'),
	SEEK: Symbol('.#seek()'),
};

export const _I = {
	STEPS: Symbol('._steps()'),
};

export const _S = {
	ORIGIN: {
		IS_VALID: Symbol('._isValidOrigin()'),
		DESCRIPTION: Symbol('._originDescription'),
	},
	NODE: {
		IS_VALID: Symbol('._isValidNode()'),
		DESCRIPTION: Symbol('._nodeDescription'),
	},
};

const Assert = {
	Step: AssertionChecker(isStep, 'Step'),
};

export default Abstract(class DirectoryProvider {
	[I.CONSTRUCTOR] = DirectoryProvider;

	constructor() {
		this[I.CONSTRUCTOR] = new.target;
	}

	createStep(node) {
		if (!this[I.CONSTRUCTOR].isNode(node)) {
			ThrowTypeError(
				'args[0] as node',
				this[I.CONSTRUCTOR][_S.NODE.DESCRIPTION],
			);
		}

		return new Step(node);
	}

	async *[I.SEEK](origin) {
		const visiting = [];

		for await (const step of this[_I.STEPS](origin)) {
			Assert.Step(step, 'step');

			const { [$I.ACTION.GET]: action } = step;

			if (action === ACTION.ENTER) {
				visiting.push(step);
			}

			if (action === ACTION.LEAVE) {
				if (visiting.pop() !== step) {
					throw new Error('Bad Implementation, NOT paired.');
				}
			}

			yield step.state;
		}

		if (visiting.length > 0) {
			throw new Error('Bad Implementation, steps NOT leave.');
		}
	}

	seek(origin) {
		if (!this[I.CONSTRUCTOR].isOrigin(origin)) {
			ThrowTypeError(
				'args[0] as origin',
				this[I.CONSTRUCTOR][_S.ORIGIN.DESCRIPTION],
			);
		}

		return this[I.SEEK](origin);
	}

	static isOrigin(value) {
		return this[_S.ORIGIN.IS_VALID](value);
	}

	static isNode(value) {
		return this[_S.NODE.IS_VALID](value);
	}
},
...[
	Abstract({
		[_I.STEPS]: M.Method(M.Any).returns(M.Any),
	}),
	Abstract.Static({
		[_S.ORIGIN.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
		[_S.ORIGIN.DESCRIPTION]: M.String,
		[_S.NODE.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
		[_S.NODE.DESCRIPTION]: M.String,
	}),
]);
