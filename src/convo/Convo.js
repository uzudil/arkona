const CONVOS = {}

class Answer {
	constructor(answer, result) {
		this.answer = answer
		this.result = result
	}

	getResult() {
		if(typeof this.result === "string") {
			return CONVOS[this.result]
		} else {
			return this.result
		}
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

	isComplete() {
		return this.question && this.answers.length > 0
	}
}
