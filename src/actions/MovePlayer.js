export default class {

	constructor() {
		this.dir = null
	}

	getType() {
		return "move_player"
	}

	getPos() {
		return this.pos
	}

	// eslint-disable-next-line no-unused-vars
	check(arkona) {
		return true
	}

	// eslint-disable-next-line no-unused-vars
	setContext(context) {
		this.dir = context
	}

	run(arkona) {
		return arkona.player.move(this.dir)
	}
}