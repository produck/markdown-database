import { NodeConstructor } from '@produck/cellulose-node';

/**
 * String JSON serializable node representation.
 * The name is a string identifier.
 * The data is a JSON value composed of null, booleans, numbers, strings, arrays, and plain objects.
 */
declare const StringJsonNode: NodeConstructor<string, unknown>;

export default StringJsonNode;
