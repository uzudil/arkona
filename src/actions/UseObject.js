import * as Config from "../config/Config"

const MODE_OPEN_DOOR = 0
const MODE_CUSTOM_USE = 1

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
		this.mode = null
	}

	check(arkona) {
		this.sprite = arkona.blocks.findClosestObject(arkona.player.sprite, 6, (sprite) => {
			console.warn("" + sprite.name + ":" + sprite.gamePos)
			return arkona.level.getAction(sprite.gamePos, this) != null
		})
		if(this.sprite) {
			this.mode = MODE_CUSTOM_USE
		} else {
			this.sprite = arkona.blocks.findClosestObject(arkona.player.sprite, 6, (sprite) => {
				return Config.DOORS.indexOf(sprite.name) >= 0
			})
			if (this.sprite) {
				this.mode = MODE_OPEN_DOOR
			}
		}
		return this.sprite
	}

	run(arkona) {
		switch(this.mode) {
			case MODE_OPEN_DOOR:
				arkona.blocks.replace(this.sprite, Config.getOppositeDoor(this.sprite.name))
				break
			default:
				arkona.level.getAction(this.sprite.gamePos, this).action(arkona)
		}
		return true
	}
}