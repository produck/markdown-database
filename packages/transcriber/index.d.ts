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
	 * Parser method symbols
	 */
	export namespace PARSE {
		/** Symbol for the name parsing method */
		export const NAME: unique symbol;

		/** Symbol for the data parsing method */
		export const DATA: unique symbol;

		/** Symbol for parser description */
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
 * keyed by `_I.PARSE.NAME` and `_I.PARSE.DATA`.
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
 * Options for the parser configuration in Implement()
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 */
export interface ImplementOptionsParser<N = unknown, D = unknown> {
	/**
	 * Parse a provider node into a name value.
	 * @param node - The provider node to extract a name from
	 * @returns The parsed name
	 */
	name: (node: unknown) => N;

	/**
	 * Parse a provider node into a data value.
	 * @param node - The provider node to extract data from
	 * @param name - The parsed name of the node
	 * @returns The parsed data
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

	/** Parser functions for extracting name and data */
	parser: ImplementOptionsParser<N, D>;
}

/**
 * Factory that returns a concrete transcriber constructor
 * (subclass of AbstractTranscriber).
 * @template O - Type of the origin for traversal
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 * @param options - Configuration for node, provider, and
 * parser
 * @returns A new transcriber constructor class
 * @throws {TypeError} If options or any required property is
 * invalid
 */
export function Implement<O = unknown, N = unknown, D = unknown>(
	options: ImplementOptions<O, N, D>,
): AbstractTranscriberConstructor<O, N, D>;
