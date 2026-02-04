/**
 * Action symbols representing traversal events during node
 * tree iteration
 */
export namespace ACTION {
	/** Entering a node during tree traversal */
	export const ENTER: unique symbol;

	/** Leaving a node during tree traversal */
	export const LEAVE: unique symbol;
}

type ActionSymbol = typeof ACTION.ENTER | typeof ACTION.LEAVE;

/**
 * Instance symbols for private node properties and methods
 */
export const _I: {
	/**
	 * Name property initialization and operations
	 */
	NAME: {
		/** Symbol for name initialization method */
		readonly INIT: unique symbol;
		/** Symbol for name equality comparison method */
		readonly EQUAL: unique symbol;
		/** Symbol for name to string conversion method */
		readonly TO_STRING: unique symbol;
	};
	/**
	 * Data property initialization
	 */
	DATA: {
		/** Symbol for data initialization method */
		readonly INIT: unique symbol;
	};
};

/**
 * Static symbols for private class methods and properties
 */
export const _S: {
	/**
	 * Name property validation and description
	 */
	NAME: {
		/** Symbol for name validation method */
		readonly IS_VALID: unique symbol;
		/** Symbol for name property description */
		readonly DESCRIPTION: unique symbol;
	};
	/**
	 * Data property validation and description
	 */
	DATA: {
		/** Symbol for data validation method */
		readonly IS_VALID: unique symbol;
		/** Symbol for data property description */
		readonly DESCRIPTION: unique symbol;
	};
};

/**
 * Represents a step in node tree traversal with action type
 */
export interface NodeStep<N extends Node> {
	/** The node being traversed */
	node: N;

	/** The action type (ENTER or LEAVE) */
	action: ActionSymbol;
}

/**
 * Node interface representing a hierarchical tree structure
 * @template N - Type of the node's name property
 * @template D - Type of the node's data property
 */
export interface Node<N = unknown, D = unknown> {
	/** Parent node reference, null if root */
	readonly parent: Node<N, D> | null;

	/** Previous sibling node, null if first child */
	readonly previousSibling: Node<N, D> | null;

	/** Next sibling node, null if last child */
	readonly nextSibling: Node<N, D> | null;

	/** First child node, null if no children */
	readonly firstChild: Node<N, D> | null;

	/** Last child node, null if no children */
	readonly lastChild: Node<N, D> | null;

	/**
	 * Node's name property
	 * @throws {TypeError} When setting if value is not a valid name
	 * @throws {Error} When setting if a sibling with the same name already exists
	 */
	name: N;

	/**
	 * Node's data property
	 * @throws {TypeError} When setting if value is not valid data
	 */
	data: D;

	/** Check if value is a node instance */
	isNode(node: unknown): boolean;

	/**
	 * Check if two nodes are the same (reference equality)
	 * @throws {TypeError} If node is not a Node instance
	 */
	isSameNode(node: Node<N, D>): boolean;

	/**
	 * Check if two nodes have equal names
	 * @throws {TypeError} If node is not a Node instance
	 */
	isNameEqualNode(node: Node<N, D>): boolean;

	/**
	 * Check if this node contains another node in its subtree
	 * @throws {TypeError} If node is not a Node instance
	 */
	contains(node: Node<N, D>): boolean;

	/** Check if this node has any children */
	hasChildNodes(): boolean;

	/**
	 * Add a child node at the end
	 * @throws {TypeError} If node is not a Node instance
	 * @throws {Error} If node is an ancestor or child name already exists
	 */
	appendChild(node: Node<N, D>): Node<N, D>;

	/**
	 * Remove a child node
	 * @throws {TypeError} If node is not a Node instance
	 * @throws {Error} If node is not a child of this node
	 */
	removeChild(node: Node<N, D>): Node<N, D>;

	/**
	 * Replace a child node with another node
	 * @throws {TypeError} If newChild or oldChild is not a Node instance
	 * @throws {Error} If newChild is an ancestor, name exists,
	 * or oldChild is not a child
	 */
	replaceChild(newChild: Node<N, D>, oldChild: Node<N, D>): Node<N, D>;

	/**
	 * Insert a node before a reference node
	 * @throws {TypeError} If newNode or referenceNode is not a Node instance
	 * @throws {Error} If newNode is an ancestor, name exists,
	 * or referenceNode is not a child
	 */
	insertBefore(newNode: Node<N, D>, referenceNode: Node<N, D>): Node<N, D>;

	/** Iterate through ancestor nodes up to root */
	parents(): Generator<Node<N, D>>;

	/** Iterate through direct children */
	children(): Generator<Node<N, D>>;

	/** Iterate through all nodes in depth-first order with actions */
	nodes(): Generator<NodeStep<Node<N, D>>>;
}

/**
 * Node constructor interface for creating new node instances
 * @template N - Type of the node's name
 * @template D - Type of the node's data
 */
export interface NodeConstructor<N = unknown, D = unknown> {
	/** Type guard to check if value is a Node instance */
	new (): Node<N, D>;
}

/**
 * Configuration for node name property validation and
 * behavior
 * @template N - Type of the node's name
 */
export interface ImplementOptionsName<N = unknown> {
	/** Factory function to initialize default name value */
	readonly init: () => N;

	/** Human-readable description of the name property */
	readonly description: string;

	/** Validator function to check if value is a valid name */
	isValid: (value: unknown) => boolean;

	/** Equality comparison function for names */
	equal: (a: N, b: N) => boolean;

	/** Serialization function to convert name to string */
	toString: (value: N) => string;
}

/**
 * Configuration for node data property validation
 * @template D - Type of the node's data
 */
export interface ImplementOptionsData<D = unknown> {
	/** Factory function to initialize default data value */
	readonly init: () => D;

	/** Human-readable description of the data property */
	readonly description: string;

	/** Validator function to check if value is valid data */
	isValid: (value: unknown) => boolean;
}

/**
 * Options for creating a node implementation with custom
 * name and data validators
 * @template ION - Name options interface
 * @template IOD - Data options interface
 */
export interface ImplementOptions<
	ION extends ImplementOptionsName,
	IOD extends ImplementOptionsData,
> {
	/** Configuration for the node's name property */
	name: ION;

	/** Configuration for the node's data property */
	data: IOD;
}

/**
 * Factory function to create a custom Node implementation
 * with specified name and data validators
 * @template ION - Name options interface type
 * @template IOD - Data options interface type
 * @param options - Configuration object with name and data
 * validators
 * @returns A Node constructor with typed name and data
 * properties
 * @example
 * const MyNode = Implement({
 *   name: {
 *     init: () => 'unnamed',
 *     description: 'Node name',
 *     isValid: (v) => typeof v === 'string',
 *     equal: (a, b) => a === b,
 *     toString: (v) => v
 *   },
 *   data: {
 *     init: () => null,
 *     description: 'Node data',
 *     isValid: (v) => v === null || typeof v === 'object'
 *   }
 * });
 */
export function Implement<
	ION extends ImplementOptionsName,
	IOD extends ImplementOptionsData,
>(
	options: ImplementOptions<ION, IOD>,
): NodeConstructor<ReturnType<ION['init']>, ReturnType<IOD['init']>>;

/**
 * Base abstract node constructor
 * Provides the foundation for all node implementations with
 * traversal methods
 */
export const AbstractNode: NodeConstructor;
