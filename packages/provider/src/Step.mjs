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

	constructor(node) {
		this.#state.node = node;
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
