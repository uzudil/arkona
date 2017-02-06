export default class {

	constructor() {
		this.generators = null
	}

	getType() {
		return "generator_action"
	}

	getPos() {
		return null
	}

	// eslint-disable-next-line no-unused-vars
	check(arkona) {
		return this.generators != null && this.generators.length > 0
	}

	setContext(context) {
		this.generators = context
	}

	// eslint-disable-next-line no-unused-vars
	run(arkona) {
		this.generators.forEach(g => g.update())
		return true
	}
}