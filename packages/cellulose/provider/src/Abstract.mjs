import * as Ow from '@produck/ow';
import { ThrowTypeError, AssertionChecker } from '@produck/type-error';
import Abstract, { Member as M } from '@produck/es-abstract';

import * as ACTION from './Action.mjs';
import { Step, isStep, $I } from './Step.mjs';
import { I, _I, _S, S } from './Symbol.mjs';

const Assert = {
	Step: AssertionChecker(isStep, 'Step'),
};

export default Abstract(class CelluloseProvider {
	[I.CONSTRUCTOR] = CelluloseProvider;

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
					Ow.Error.Common('Bad Implementation, NOT paired.');
				}
			}

			yield step.state;
		}

		if (visiting.length > 0) {
			Ow.Error.Common('Bad Implementation, steps NOT leave.');
		}
	}

	seek(origin) {
		const { [I.CONSTRUCTOR]: constructor } = this;

		if (!constructor.isOrigin(origin)) {
			ThrowTypeError('args[0] as origin', constructor[_S.ORIGIN.DESCRIPTION]);
		}

		return this[I.SEEK](origin);
	}

	static isOrigin(value) {
		return this[_S.ORIGIN.IS_VALID](value);
	}

	static isNode(value) {
		return this[_S.NODE.IS_VALID](value);
	}

	static get meta() {
		return {
			name: this[_S.IMPLEMENTATION.NAME],
			version: this[_S.IMPLEMENTATION.VERSION],
			description: this[_S.IMPLEMENTATION.DESCRIPTION],
			provider: {
				origin: this[_S.ORIGIN.DESCRIPTION],
				node: this[_S.NODE.DESCRIPTION],
			},
		};
	}

	static [S.FLAG] = true;
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
		[_S.IMPLEMENTATION.NAME]: M.String,
		[_S.IMPLEMENTATION.VERSION]: M.String,
		[_S.IMPLEMENTATION.DESCRIPTION]: M.String,
	}),
]);

export function isProviderConstructor(value) {
	return typeof value === 'function' && S.FLAG in value;
}
