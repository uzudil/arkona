import * as Config from "../config/Config"

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
		if(arkona.player) {
			let [ox, oy] = arkona.player.sprite.floatPos
			let oz = arkona.player.sprite.gamePos[2]
			let blockTestFx = (blocker) => arkona.playerBlockedBy(blocker)
			if(this.dir) {
				let [nx, ny, nz] = arkona.moveInDir(ox, oy, oz, this.dir, Config.PLAYER_SPEED)
				if (arkona.blocks.moveTo(arkona.player.sprite, nx, ny, nz, false, true, blockTestFx) ||
					arkona.blocks.moveTo(arkona.player.sprite, nx, oy, nz, false, true, blockTestFx) ||
					arkona.blocks.moveTo(arkona.player.sprite, ox, ny, nz, false, true, blockTestFx)) {
					arkona.playerMoved(this.dir)
					return true
				}
			}
		}
		return false
	}
}