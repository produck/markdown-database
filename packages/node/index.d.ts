export namespace ACTION {
	export const ENTER: unique symbol;
	export const LEAVE: unique symbol;
}

type ActionSymbol = typeof ACTION.ENTER | typeof ACTION.LEAVE;

export interface DirectoryStep<DIR extends Node> {
	directory: DIR;
	action: ActionSymbol;
}

export interface Node<N = unknown, D = unknown> {
	readonly parent: Node<N, D> | null;
	name: N;
	data: D;

	hasChild(name: N): boolean;

	appendChild(directory: Node<N, D>): Node<N, D>;

	removeChild(directory: Node<N, D>): Node<D, D>;

	children(): Generator<Node<N, D>>;

	directories(): Generator<DirectoryStep<Node<N, D>>>;
}

export interface NodeModel {
	name: string;
	data: string;
}

export interface NodeConstructor<N = unknown, D = unknown> {
	new (): Node<N, D>;
}

export interface ImplementOptionsName<N = unknown> {
	readonly model: string;
	readonly init: () => N;
	readonly description: string;
	isValid: (value: unknown) => boolean;
	equal: (a: N, b: N) => boolean;
}

export interface ImplementOptionsData<D = unknown> {
	readonly model: string;
	readonly init: () => D;
	readonly description: string;
	isValid: (value: unknown) => boolean;
}

export interface ImplementOptions<
	ION extends ImplementOptionsName,
	IOD extends ImplementOptionsData,
> {
	name: ION;
	data: IOD;
}

export function Implement<
	ION extends ImplementOptionsName,
	IOD extends ImplementOptionsData,
>(
	options: ImplementOptions<ION, IOD>,
): NodeConstructor<ReturnType<ION['init']>, ReturnType<IOD['init']>>;

export const AbstractDirectory: NodeConstructor;
