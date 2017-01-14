const CONVOS = {}

class Answer {
	constructor(answer, result) {
		this.answer = answer
		this.result = result
	}
}

/**
 * A basic conversation tree
 */
export default class {
	constructor(question, tag) {
		this.question = question
		this.answers = []
		if(tag) {
			CONVOS[tag] = this
		}
	}

	answer(answer, result) {
		this.answers.push(new Answer(answer, result))
		return this
	}

	tag(tag) {
		return CONVOS[tag]
	}

	static ref(tag) {
		return CONVOS[tag]
	}

	isComplete() {
		return this.question && this.answers.length > 0
	}
}
