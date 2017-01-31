import * as Config from '../config/Config'

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

	isReady(arkona) {
		return true
	}

	check(arkona) {
		return true
	}

	setContext(context) {
		this.dir = context
	}

	run(arkona) {
		if(arkona.player) {
			let [ox, oy, oz] = arkona.player.sprite.gamePos
			if(this.dir) {
				// todo: smooth/vector movement
				let [nx, ny, nz] = [ox + Config.MOVE_DELTA[this.dir][0], oy + Config.MOVE_DELTA[this.dir][1], oz]
				if (arkona.blocks.moveTo(arkona.player.sprite, nx, ny, nz, false, true) ||
					arkona.blocks.moveTo(arkona.player.sprite, nx, oy, nz, false, true) ||
					arkona.blocks.moveTo(arkona.player.sprite, ox, ny, nz, false, true)) {
					arkona.playerMoved(this.dir)
					return true
				}
			}
		}
		return false
	}
}