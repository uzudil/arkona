const CONVOS = {}

class Answer {
	constructor(condition, answer, result) {
		this.cond = condition
		this.answer = answer
		this.result = result
	}

	eval(arkona) {
		return this.cond == null || this.cond(arkona) ? this.answer : null
	}

	getResult() {
		if(typeof this.result === "string") {
			return CONVOS[this.result]
		} else {
			return this.result
		}
	}

	validate() {
		if(typeof this.result === "string") {
			if(CONVOS[this.result] == null)
				throw new Error("Can't find answer reference \"" + this.result + "\".")
		} else if(this.result) {
			this.result.validate()
		}
	}
}

/**
 * A basic conversation tree
 */
export default class {
	constructor(question, tag, onDisplay) {
		this.question = question
		this.answers = []
		this.onDisplay = onDisplay
		if(tag) {
			CONVOS[tag] = this
		}
		this.cond = null
		this.pass = null
		this.fail = null
	}

	getQuestion(arkona) {
		if(this.onDisplay) {
			this.onDisplay(arkona)
		}
		return this.question
	}

	answer(answer, result) {
		return this.answerIf(null, answer, result)
	}

	answerIf(condition, answer, result) {
		this.answers.push(new Answer(condition, answer, result))
		return this
	}

	isComplete() {
		return (this.cond && this.pass && this.fail) || (this.question && this.answers.length > 0)
	}

	static condition(fx, pass, fail) {
		let c = new this()
		c.cond = fx
		c.pass = pass
		c.fail = fail
		return c
	}

	eval(arkona) {
		if(this.cond) {
			return this.cond(arkona) ? this.pass.eval(arkona) : this.fail.eval(arkona)
		} else {
			return this
		}
	}

	validate() {
		if(!this.isComplete()) {
			console.error("Incomplete convo: ", this)
			throw new Error("Convo: \"" + this.question + "\" is incomplete.")
		}
		if(this.cond) {
			this.pass.validate()
			this.fail.validate()
		} else {
			this.answers.forEach(a => a.validate())
		}
	}
}
