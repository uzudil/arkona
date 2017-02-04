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
			let [ox, oy] = arkona.player.sprite.floatPos
			let oz = arkona.player.sprite.gamePos[2]
			if(this.dir) {
				let [nx, ny, nz] = arkona.moveInDir(ox, oy, oz, this.dir, Config.PLAYER_SPEED)
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