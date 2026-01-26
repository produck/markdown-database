import { ThrowTypeError, AssertionChecker } from '@produck/type-error';
import Abstract, { Member as M } from '@produck/es-abstract';
import { Step, isStep } from './Step.mjs';

const I = {
	CONSTRUCTOR: Symbol('.#constructor'),
};

const _I = {
	SEEK: Symbol('._seek()'),
};

const _S = {
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

export default Abstract(
	class DirectoryProvider {
		[I.CONSTRUCTOR] = DirectoryProvider;

		constructor() {
			this[I.CONSTRUCTOR] = new.target;
		}

		async createStep(node) {
			if (!this[I.CONSTRUCTOR].isNode(node)) {
				ThrowTypeError(
					'args[0] as node',
					this[I.CONSTRUCTOR][_S.NODE.DESCRIPTION],
				);
			}

			return new Step(node);
		}

		async *seek(origin) {
			if (!this[I.CONSTRUCTOR].isOrigin(origin)) {
				ThrowTypeError(
					'args[0] as origin',
					this[I.CONSTRUCTOR][_S.ORIGIN.DESCRIPTION],
				);
			}

			for (const step of this[_I.SEEK](origin)) {
				Assert.Step(step);

				yield step.state;
			}
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
			[_I.SEEK]: M.Method(M.Any).returns(M.Any),
		}),
		Abstract.Static({
			[_S.ORIGIN.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
			[_S.ORIGIN.DESCRIPTION]: M.String,
			[_S.NODE.IS_VALID]: M.Method().args(M.Any).returns(M.Boolean),
			[_S.NODE.DESCRIPTION]: M.String,
		}),
	],
);
