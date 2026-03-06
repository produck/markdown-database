import Ajv from 'ajv';
import { Node } from '@produck/cellulose-node';
import { StringJsonNodeConstructor } from '@produck/cellulose-node-string-json';

/**
 * A node constructor whose data must be a valid JSON Schema,
 * validated by an Ajv instance.
 */
interface StringJsonSchemaNodeConstructor extends StringJsonNodeConstructor {
	new (): Node<string, unknown>;

	/** The Ajv instance used for JSON Schema validation. */
	readonly ajv: Ajv;
}

/**
 * Creates a StringJsonSchemaNode class bound to a specific
 * Ajv instance.
 * @param ajv - Optional Ajv instance; a default one is
 * created if omitted.
 * @returns A node constructor that validates data as JSON
 * Schema.
 */
export function Implement(ajv?: Ajv): StringJsonSchemaNodeConstructor;

/** Default StringJsonSchemaNode built with a default Ajv. */
declare const DefaultStringJsonSchemaNode: StringJsonSchemaNodeConstructor;

export default DefaultStringJsonSchemaNode;
