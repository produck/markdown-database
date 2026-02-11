import Abstract, { Member as M } from '@produck/es-abstract';
import { ACTION } from '@produck/cellulose-provider';

import * as Parser from './Parser.mjs';
import { I, _I, _S } from './Symbol/index.mjs';

export default Abstract(class Transcriber {
	[I.CONSTRUCTOR] = Transcriber;

	constructor() {
		this[I.CONSTRUCTOR] = new.target;
	}

	[I.PROVIDER] = new this[I.CONSTRUCTOR][_S.CONSTRUCTOR.PROVIDER]();

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
				child.data = await this[_I.PARSE.DATA](step.node, name);
				trace.at(-1).appendChild(child);
				trace.push(step);
			}

			if (step.action === ACTION.LEAVE) {
				trace.pop();
			}
		}

		return head.firstChild;
	}

	get Node() {
		return this[_S.CONSTRUCTOR.NODE];
	}

	get Provider() {
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
