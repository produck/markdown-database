import { NodeConstructor } from '@produck/cellulose-node';

export type StringJsonNodeConstructor = NodeConstructor<string, unknown>;

/**
 * String JSON serializable node representation.
 * The name is a string identifier.
 * The data is a JSON value composed of null, booleans, numbers, strings, arrays, and plain objects.
 */
declare const StringJsonNode: StringJsonNodeConstructor;

export default StringJsonNode;
