import * as Config from '../config/Config'

export default class {
	getType() {
		return "open_door"
	}

	getPos() {
		return this.door ? this.door.gamePos : null
	}

	isReady(arkona) {
		return true
	}

	setContext(context) {
		this.door = null
	}

	check(arkona) {
		this.door = arkona.blocks.findClosestObject(arkona.player.sprite, 6, (sprite) => {
			return Config.DOORS.indexOf(sprite.name) >= 0
		})
		return this.door
	}

	run(arkona) {
		arkona.blocks.replace(this.door, Config.getOppositeDoor(this.door.name))
		return true
	}
}