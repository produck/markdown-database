import { AbstractProviderConstructor } from '@produck/cellulose-provider';

/**
 * File system node representation.
 * Contains the origin path for directory traversal.
 */
export interface FSNode {
	/** The file system path of this node */
	origin: string;
}

declare const FSDirectoryProvider: AbstractProviderConstructor<string, FSNode>;

export default FSDirectoryProvider;
