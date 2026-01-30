/**
 * The shape of a yielded step state from provider.seek()
 */
export interface StepState {
	node: unknown;
	action: boolean | symbol; // currently boolean (ENTER/LEAVE) or custom symbol
}

/**
 * Internal Step helper used by providers. Not exported at runtime from the package
 * entrypoint, but declared here for type-safety of public API.
 */
declare class Step {
	constructor(node: unknown);
	readonly state: StepState;
	action(value: symbol): this;
	enter(): this;
	leave(): this;
}

/** Symbols used to reference private contract members in implementations */
export const _I: { STEPS: symbol };
export const _S: {
	ORIGIN: { IS_VALID: symbol; DESCRIPTION: symbol };
	NODE: { IS_VALID: symbol; DESCRIPTION: symbol };
};

/**
 * Main abstract provider class exported as default.
 * Implementations extend this class and provide a method keyed by `_I.STEPS`.
 */
declare abstract class AbstractProvider {
	constructor();

	/**
	 * Create a Step for the given node. Validates node via static `isNode`.
	 */
	createStep(node: unknown): Step;

	/**
	 * Iterate step states for a given origin. Validates origin via static `isOrigin`.
	 */
	seek(origin: unknown): AsyncIterableIterator<StepState>;

	static isOrigin(value: unknown): boolean;
	static isNode(value: unknown): boolean;
}

export default AbstractProvider;

/**
 * Options accepted by `Implement()`.
 * Note: the source currently contains a misspelling `descritpion` (not `description`).
 * To be permissive in type hints we accept both keys.
 */
export interface ImplementOptions {
	origin: {
		isValid: (value: unknown) => boolean;
		description?: string;
	};
	node: {
		isValid: (value: unknown) => boolean;
		description?: string;
	};
	steps: (
		origin: unknown,
		provider: AbstractProvider,
	) => AsyncGenerator<StepState, void, unknown>;
}

/**
 * Factory that returns a concrete provider constructor (subclass of AbstractProvider).
 */
export function Implement(options: ImplementOptions): typeof AbstractProvider;
