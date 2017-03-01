export default class {
	getType() {
		return "start_convo"
	}

	getPos() {
		return this.sprite ? this.sprite.gamePos : null
	}

	// eslint-disable-next-line no-unused-vars
	setContext(context) {
		this.sprite = null
	}

	check(arkona) {
		this.sprite = arkona.blocks.findClosestObject(arkona.player.animatedSprite.sprite, 6,
			(sprite) => this.isValid(sprite))
		return this.sprite
	}

	isValid(sprite) {
		return sprite.npc != null && sprite.npc.getMonster() == null
	}

	setSprite(sprite) {
		this.sprite = sprite
		return this
	}

	run(arkona) {
		arkona.level.npcs.forEach(npc => npc.animatedSprite.setAnimation("stand", npc.dir))
		arkona.convoUi.start(this.sprite.npc)
		return true
	}
}