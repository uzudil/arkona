import * as Config from '../config/Config'

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

	isReady(arkona) {
		return true
	}

	check(arkona) {
		return this.generators != null && this.generators.length > 0
	}

	setContext(context) {
		this.generators = context
	}

	run(arkona) {
		this.generators.forEach(g => g.update())
		return true
	}
}