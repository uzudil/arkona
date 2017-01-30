import * as Config from '../config/Config'

export default class {

	constructor(arkona) {
		this.arkona = arkona
		this.door = null
	}

	getType() {
		return "open_door"
	}

	getPos() {
		return this.door ? this.door.gamePos : null
	}

	isReady() {
		return true
	}

	check() {
		this.door = this.arkona.blocks.findClosestObject(this.arkona.player.sprite, 6, (sprite) => {
			return Config.DOORS.indexOf(sprite.name) >= 0
		})
		return this.door
	}

	run() {
		this.arkona.blocks.replace(this.door, Config.getOppositeDoor(this.door.name))
		return true
	}
}