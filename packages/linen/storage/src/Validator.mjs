import * as Ow from '@produck/ow';

// error: data body does not match schema
// error: missing data node
// error: missing default language
// warning: missing any language
// warning: additional data node

const TO_CODE = language => language.code;

class Issue {
	type = '';
	path = {};
	message = '';
	cause = null;
}

export class ValidationResult {
	#issueList = [];

	get ok() {
		return this.#issueList.length === 0;
	}

	throw() {
		return Ow.Error.Common('', { cause: this.#issueList });
	}

	appendIssue(issue) {
		this.#issueList.push(issue);
	}

	static execute(schema, data, languageRegistry) {
		const languageCodeList = Array.from(languageRegistry, TO_CODE);
		const result = new this();

		return result;
	}
}
