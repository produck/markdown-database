export namespace ACTION {
	export const ENTER: unique symbol;
	export const LEAVE: unique symbol;
}

type ActionSymbol = typeof ACTION.ENTER | typeof ACTION.LEAVE;

export interface DirectoryStep<DIR extends ImplementedDirectory> {
	directory: DIR;
	action: ActionSymbol;
}

export interface ImplementedDirectory<N = unknown, D = unknown> {
	readonly parent: ImplementedDirectory<N, D> | null;
	name: N;
	data: D;

	hasChild(name: N): boolean;

	appendChild(
		directory: ImplementedDirectory<N, D>,
	): ImplementedDirectory<N, D>;

	removeChild(
		directory: ImplementedDirectory<N, D>,
	): ImplementedDirectory<D, D>;

	children(): Generator<ImplementedDirectory<N, D>>;

	directories(): Generator<DirectoryStep<ImplementedDirectory<N, D>>>;
}

export interface DirectoryModel {
	name: string;
	data: string;
}

export interface ImplementedDirectoryConstructor<N = unknown, D = unknown> {
	new (): ImplementedDirectory<N, D>;
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
	IOD extends ImplementOptionsData
> {
	name: ION;
	data: IOD;
}

export function Implement<
	ION extends ImplementOptionsName,
	IOD extends ImplementOptionsData
>(
	options: ImplementOptions<ION, IOD>,
): ImplementedDirectoryConstructor<
	ReturnType<ION['init']>,
	ReturnType<IOD['init']>
>;
