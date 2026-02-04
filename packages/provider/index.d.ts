/**
 * The shape of a yielded step state from provider.seek()
 * @template N - Type of the node being visited
 */
export interface StepState<N = unknown> {
	/** The node being visited in the traversal */
	node: N;

	/** The action type: true for ENTER, false for LEAVE, or custom */
	action: boolean | symbol;
}

/**
 * Internal Step helper used by providers. Not exported at
 * runtime from the package entrypoint, but declared here for
 * type-safety of public API.
 * @template N - Type of the node
 */
interface Step<N = unknown> {
	/** Get the current step state with node and action */
	readonly state: StepState<N>;

	/** Set a custom action symbol for this step */
	action(value: symbol): this;

	/** Set action to ENTER (true) */
	enter(): this;

	/** Set action to LEAVE (false) */
	leave(): this;
}

/**
 * Constructor for Step instances
 */
interface StepConstructor {
	new <N = unknown>(node: N): Step<N>;
}

declare const Step: StepConstructor;

/** Symbols used to reference private contract members */
export const _I: {
	/** Symbol for the async generator steps method */
	readonly STEPS: unique symbol;
};

export const _S: {
	/** Static symbols for origin validation */
	readonly ORIGIN: {
		/** Symbol for origin validator function */
		readonly IS_VALID: unique symbol;
		/** Symbol for origin description */
		readonly DESCRIPTION: unique symbol;
	};
	/** Static symbols for node validation */
	readonly NODE: {
		/** Symbol for node validator function */
		readonly IS_VALID: unique symbol;
		/** Symbol for node description */
		readonly DESCRIPTION: unique symbol;
	};
};

/**
 * Main abstract provider class exported as default.
 * Implementations extend this class and provide a method
 * keyed by `_I.STEPS`.
 * @template O - Type of the origin for traversal
 * @template N - Type of the nodes being visited
 */
export interface AbstractProvider<O = unknown, N = unknown> {
	/**
	 * Create a Step for the given node. Validates node via
	 * static `isNode`.
	 * @param node - The node to create a step for
	 * @returns A new Step instance
	 * @throws {TypeError} If node is not valid
	 */
	createStep(node: N): Step<N>;

	/**
	 * Iterate step states for a given origin. Validates origin
	 * via static `isOrigin`.
	 * @param origin - The origin to start traversal from
	 * @returns An async iterator of step states
	 * @throws {TypeError} If origin is not valid
	 * @throws {Error} If steps are not properly paired
	 * (ENTER/LEAVE)
	 */
	seek(origin: O): AsyncIterableIterator<StepState<N>>;
}

/**
 * Constructor and static methods for AbstractProvider
 */
export interface AbstractProviderConstructor<O = unknown, N = unknown> {
	new(): AbstractProvider<O, N>;

	/**
	 * Check if a value is a valid origin for this provider
	 * @param value - The value to check
	 * @returns true if value is a valid origin
	 */
	isOrigin(value: unknown): boolean;

	/**
	 * Check if a value is a valid node for this provider
	 * @param value - The value to check
	 * @returns true if value is a valid node
	 */
	isNode(value: unknown): boolean;

	/**
	 * Get descriptions of origin and node types
	 * @returns Object with origin and node description strings
	 */
	description: {
		origin: string;
		node: string;
	};
}

declare const AbstractProvider: AbstractProviderConstructor;

export default AbstractProvider;

/**
 * Options accepted by `Implement()`.
 * @template O - Type of the origin for traversal
 * @template N - Type of the nodes being visited
 */
export interface ImplementOptions<O = unknown, N = unknown> {
	/**
	 * Configuration for origin validation and description
	 */
	origin: {
		/** Validator to check if value is a valid origin */
		isValid: (value: unknown) => value is O;

		/** Human-readable description of the origin type */
		description: string;
	};

	/**
	 * Configuration for node validation and description
	 */
	node: {
		/** Validator to check if value is a valid node */
		isValid: (value: unknown) => value is N;

		/** Human-readable description of the node type */
		description: string;
	};

	/**
	 * Async generator function that yields steps for a given
	 * origin
	 * @param origin - The origin to traverse
	 * @param provider - The provider instance
	 * @returns Async generator yielding Step objects
	 */
	steps: (
		origin: O,
		provider: AbstractProvider<O, N>,
	) => AsyncGenerator<StepState<N>, void, unknown>;
}

/**
 * Factory that returns a concrete provider constructor
 * (subclass of AbstractProvider).
 * @template O - Type of the origin for traversal
 * @template N - Type of the nodes being visited
 * @param options - Configuration for origin, node validation
 * and steps generator
 * @returns A new provider constructor class
 * @throws {TypeError} If options or any required property is
 * invalid
 */
export function Implement<O = unknown, N = unknown>(
	options: ImplementOptions<O, N>,
): AbstractProviderConstructor<O, N>;
