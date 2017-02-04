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
				let d = arkona.game.time.elapsedMS / (60 * Config.PLAYER_SPEED)
				// smooth movement, fallback to a delta of 1 if can't maintain fps
				let dx = Math.max(-1, Math.min(1, Config.MOVE_DELTA[this.dir][0] * d))
				let dy = Math.max(-1, Math.min(1, Config.MOVE_DELTA[this.dir][1] * d))
				let [nx, ny, nz] = [ox + dx, oy + dy, oz]
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