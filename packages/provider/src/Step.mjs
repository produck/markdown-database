import { ThrowTypeError } from '@produck/type-error';

const count = (function *count() {
	let count = 0;

	while (true) {
		yield count;

		count = (count + 1) % Number.MAX_SAFE_INTEGER;
	}
})();

export class Step {
	#state = {
		id: count.next().value,
		node: null,
		action: null,
	};

	constructor(...args) {
		if (args.length !== 1) {
			throw new Error('There MUST be only 1 argument(as node).');
		}

		this.#state.node = args[0];
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
