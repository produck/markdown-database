import { NodeConstructor } from '@produck/cellulose-node';

/**
 * String JSON serializable node representation.
 * The name is a string identifier.
 * The data is any JSON-serializable value (including plain objects, arrays, primitives, and null).
 */
export interface StringJsonNodeData {
	/** The string name of this node */
	name: string;
	/** The JSON-serializable data of this node */
	data: unknown;
}

declare const StringJsonNode: NodeConstructor<string, StringJsonNodeData>;

export default StringJsonNode;
