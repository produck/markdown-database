import { ThrowTypeError } from '@produck/type-error';

export const $I = {
	ACTION: {
		GET: Symbol('.getAction()'),
	},
};

export class Step {
	#state = {
		node: null,
		action: null,
	};

	constructor(...args) {
		if (args.length !== 1) {
			throw new Error('There MUST be only 1 argument(as node).');
		}

		this.#state.node = args[0];
	}

	get [$I.ACTION.GET]() {
		return this.#state.action;
	}

	get state() {
		return { ...this.#state };
	}

	action(value) {
		if (typeof value !== 'symbol') {
			ThrowTypeError('step.action=', 'symbol');
		}

		this.#state.action = value;

		return this;
	}

	enter() {
		this.#state.action = true;

		return this;
	}

	leave() {
		this.#state.action = false;

		return this;
	}
}

export function isStep(value) {
	return value instanceof Step;
}
