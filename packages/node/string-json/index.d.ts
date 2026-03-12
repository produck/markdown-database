import { NodeConstructor } from '@produck/cellulose-node';

export type StringJsonNodeConstructor = NodeConstructor<string, unknown>;

/**
 * Base abstract StringJsonNode constructor created by
 * cellulose-node Implement().
 */
export const Base: StringJsonNodeConstructor;

/**
 * Default StringJsonNode class for string-named,
 * JSON-valued nodes.
 */
declare const StringJsonNode: StringJsonNodeConstructor;

export default StringJsonNode;
