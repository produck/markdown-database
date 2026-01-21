export namespace ACTION {
	export const ENTER: unique symbol;
	export const LEAVE: unique symbol;
}

type ActionSymbol = typeof ACTION.ENTER | typeof ACTION.LEAVE;

export interface DirectoryStep<DIR extends Directory> {
	directory: DIR;
	action: ActionSymbol;
}

export interface Directory<N = unknown, D = unknown> {
	readonly parent: Directory<N, D> | null;
	name: N;
	data: D;

	hasChild(name: N): boolean;

	appendChild(directory: Directory<N, D>): Directory<N, D>;

	removeChild(directory: Directory<N, D>): Directory<D, D>;

	children(): Generator<Directory<N, D>>;

	directories(): Generator<DirectoryStep<Directory<N, D>>>;
}

export interface DirectoryModel {
	name: string;
	data: string;
}

export interface DirectoryConstructor<N = unknown, D = unknown> {
	new (): Directory<N, D>;
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
): DirectoryConstructor<ReturnType<ION['init']>, ReturnType<IOD['init']>>;

export const AbstractDirectory: DirectoryConstructor;
