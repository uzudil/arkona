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
		this.sprite = arkona.blocks.findClosestObject(arkona.player.animatedSprite.sprite, 10,
			(sprite) => this.isValid(arkona, sprite))
		return this.sprite
	}

	isValid(arkona, sprite) {
		return Config.DOORS.indexOf(sprite.name) >= 0 || arkona.level.getAction(sprite.gamePos, this) != null
	}

	setSprite(sprite) {
		this.sprite = sprite
		return this
	}

	run(arkona) {
		let updated = false
		if(Config.DOORS.indexOf(this.sprite.name) >= 0) {
			arkona.blocks.replace(this.sprite, Config.getOppositeDoor(this.sprite.name))
			updated = true
		}
		let action = arkona.level.getAction(this.sprite.gamePos, this);
		if(action) {
			action.action(arkona)
			updated = true
		}
		return updated
	}
}