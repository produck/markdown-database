import { Node, NodeConstructor } from '@produck/cellulose-node';
import {
	AbstractProvider,
	AbstractProviderConstructor,
} from '@produck/cellulose-provider';

/**
 * Instance symbols for private transcriber methods
 */
export namespace _I {
	/**
	 * Transformer method symbols
	 */
	export namespace TRANSFORM {
		/** Symbol for the name transform method */
		export const NAME: unique symbol;

		/** Symbol for the data transform method */
		export const DATA: unique symbol;

		/** Symbol for transformer description */
		export const DESCRIPTION: unique symbol;
	}
}

/**
 * Static symbols for private transcriber class properties
 */
export namespace _S {
	/**
	 * Constructor reference symbols
	 */
	export namespace CONSTRUCTOR {
		/** Symbol for the NodeConstructor static property */
		export const NODE: unique symbol;

		/** Symbol for the ProviderConstructor static property */
		export const PROVIDER: unique symbol;
	}
}

/**
 * Abstract transcriber instance interface.
 * Implementations extend this class and provide methods
 * keyed by `_I.TRANSFORM.NAME` and `_I.TRANSFORM.DATA`.
 * @template O - Type of the origin for traversal
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 */
export interface AbstractTranscriber<O = unknown, N = unknown, D = unknown> {
	/** The provider instance used for traversal */
	readonly provider: AbstractProvider<O>;

	/**
	 * Transcribe an origin into a node tree.
	 * @param origin - The origin to transcribe from
	 * @returns The root node of the transcribed tree
	 */
	transcribe(origin: O): Promise<Node<N, D>>;
}

/**
 * Constructor and static methods for AbstractTranscriber
 */
export interface AbstractTranscriberConstructor<
	O = unknown,
	N = unknown,
	D = unknown,
> {
	new(): AbstractTranscriber<O, N, D>;

	/** The NodeConstructor used by this transcriber */
	readonly Node: NodeConstructor<N, D>;

	/** The ProviderConstructor used by this transcriber */
	readonly Provider: AbstractProviderConstructor<O>;
}

export const AbstractTranscriber: AbstractTranscriberConstructor;

/**
 * Options for the transformer configuration in Implement()
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 */
export interface ImplementOptionsTransformer<N = unknown, D = unknown> {
	/**
	 * Transform a provider node into a name value.
	 * @param node - The provider node to extract a name from
	 * @returns The transformed name
	 */
	name: (node: unknown) => N;

	/**
	 * Transform a provider node into a data value.
	 * @param node - The provider node to extract data from
	 * @param name - The transformed name of the node
	 * @returns The transformed data
	 */
	data: (node: unknown, name: N) => D;
}

/**
 * Options accepted by `Implement()`.
 * @template O - Type of the origin for traversal
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 */
export interface ImplementOptions<O = unknown, N = unknown, D = unknown> {
	/** The NodeConstructor to use for building the tree */
	node: NodeConstructor<N, D>;

	/** The ProviderConstructor to use for traversal */
	provider: AbstractProviderConstructor<O>;

	/** Transformer functions for extracting name and data */
	transformer: ImplementOptionsTransformer<N, D>;
}

/**
 * Factory that returns a concrete transcriber constructor
 * (subclass of AbstractTranscriber).
 * @template O - Type of the origin for traversal
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 * @param options - Configuration for node, provider, and
 * transformer
 * @returns A new transcriber constructor class
 * @throws {TypeError} If options or any required property is
 * invalid
 */
export function Implement<O = unknown, N = unknown, D = unknown>(
	options: ImplementOptions<O, N, D>,
): AbstractTranscriberConstructor<O, N, D>;
