import Abstract, { Member as M } from '@produck/es-abstract';
import { ACTION } from '@produck/cellulose-provider';

import * as Parser from './Parser.mjs';
import { I, _I, _S } from './Symbol/index.mjs';

export default Abstract(class Transcriber {
	[I.CONSTRUCTOR] = Transcriber;
	[I.PROVIDER] = null;

	constructor() {
		const constructor = new.target;

		this[I.CONSTRUCTOR] = constructor;
		this[I.PROVIDER] = new constructor[_S.CONSTRUCTOR.PROVIDER]();
	}

	get provider() {
		return this[I.PROVIDER];
	}

	async transcribe(origin) {
		const TargetNode = this[I.CONSTRUCTOR][_S.CONSTRUCTOR.NODE];
		const head = new TargetNode();
		const trace = [head];

		for await (const step of this[I.PROVIDER].seek(origin)) {
			if (step.action === ACTION.ENTER) {
				const child = new TargetNode();

				child.name = await this[_I.PARSE.NAME](step.node);
				child.data = await this[_I.PARSE.DATA](step.node, child.name);
				trace.at(-1).appendChild(child);
				trace.push(child);
			}

			if (step.action === ACTION.LEAVE) {
				trace.pop();
			}
		}

		return head.firstChild;
	}

	static get Node() {
		return this[_S.CONSTRUCTOR.NODE];
	}

	static get Provider() {
		return this[_S.CONSTRUCTOR.PROVIDER];
	}
}, ...[
	Abstract({
		[_I.PARSE.NAME]: M.Method().args(M.Any).returns(M.Any),
		[_I.PARSE.DATA]: M.Method().args(M.Any, M.Any).returns(M.Any),
	}),
	Abstract.Static({
		[_S.CONSTRUCTOR.NODE]: Parser.ImplementedNodeConstructor,
		[_S.CONSTRUCTOR.PROVIDER]: Parser.ImplementedProviderConstructor,
	}),
]);
