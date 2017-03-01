import * as Config from "../config/Config"

export default class {
	getType() {
		return "attack"
	}

	getPos() {
		return this.sprite ? this.sprite.gamePos : null
	}

	// eslint-disable-next-line no-unused-vars
	setContext(context) {
		this.sprite = null
	}

	check(arkona) {
		this.sprite = arkona.blocks.findClosestObject(arkona.player.animatedSprite.sprite, Config.ACTION_DIST,
			(sprite) => this.isValid(sprite))
		return this.sprite
	}

	isValid(sprite) {
		return sprite.npc != null && sprite.npc.getMonster() != null
	}

	setSprite(sprite) {
		this.sprite = sprite
		return this
	}

	run(arkona) {
		arkona.player.attack(this.sprite.npc)
		return true
	}
}