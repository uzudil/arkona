export default class {

	constructor() {
		this.npcs = null
	}

	getType() {
		return "move_npc"
	}

	getPos() {
		return null
	}

	// eslint-disable-next-line no-unused-vars
	check(arkona) {
		return true
	}

	setContext(context) {
		this.npcs = context
	}

	// eslint-disable-next-line no-unused-vars
	run(arkona) {
		this.npcs.forEach(npc => npc.move())
		return true
	}
}