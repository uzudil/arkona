import * as Config from "../config/Config"

export default class {
	getType() {
		return "use_object"
	}

	getPos() {
		return this.sprite ? this.sprite.gamePos : null
	}

	// eslint-disable-next-line no-unused-vars
	setContext(context) {
		this.sprite = null
	}

	check(arkona) {
		this.sprite = arkona.blocks.findClosestObject(arkona.player.sprite, 6, (sprite) => {
			console.warn("" + sprite.name + ":" + sprite.gamePos)
			return arkona.level.getAction(sprite.gamePos, this) != null
		})
		if(!this.sprite) {
			this.sprite = arkona.blocks.findClosestObject(arkona.player.sprite, 10, (sprite) => {
				return Config.DOORS.indexOf(sprite.name) >= 0
			})
		}
		return this.sprite
	}

	run(arkona) {
		if(Config.DOORS.indexOf(this.sprite.name) >= 0) {
			arkona.blocks.replace(this.sprite, Config.getOppositeDoor(this.sprite.name))
		}
		let action = arkona.level.getAction(this.sprite.gamePos, this);
		if(action) action.action(arkona)
		return true
	}
}