import {
	AbstractProvider,
	AbstractProviderConstructor,
} from '@produck/cellulose-provider';

/**
 * File system node representation.
 * Contains the origin path for directory traversal.
 */
export interface FSNode {
	/** The absolute file system path of this node */
	origin: string;
}

/**
 * File system directory provider instance.
 * Traverses directories and yields steps for each subdirectory.
 */
export interface FSDirectoryProvider extends AbstractProvider<string, FSNode> {
	/**
	 * Define a custom pathname validator and its description.
	 * @param validator - Async function returning true if pathname is valid
	 * @param description - Human-readable description for error messages
	 * @throws {TypeError} If validator is not a function
	 * @throws {TypeError} If description is not a string
	 */
	defineValidPathname(
		validator: (value: string) => Promise<boolean>,
		description: string,
	): void;

	/**
	 * Define a custom ignore filter for pathnames.
	 * @param isIgnored - Async function returning true if pathname should be visited
	 * @throws {TypeError} If isIgnored is not a function
	 */
	defineIgnorePathname(isIgnored: (value: string) => Promise<boolean>): void;
}

export interface FSDirectoryProviderConstructor extends AbstractProviderConstructor<
	string,
	FSNode
> {
	new (): FSDirectoryProvider;
}

declare const FSDirectoryProvider: FSDirectoryProviderConstructor;

export default FSDirectoryProvider;
