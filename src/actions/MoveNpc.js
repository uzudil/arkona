import * as Config from '../config/Config'

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

	isReady(arkona) {
		return true
	}

	check(arkona) {
		return true
	}

	setContext(context) {
		this.npcs = context
	}

	run(arkona) {
		this.npcs.forEach(npc => npc.move())
		return true
	}
}