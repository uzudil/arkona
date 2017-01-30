//import * as Config from '../config/Config'

export default class {

	constructor(arkona) {
		this.arkona = arkona
		this.sprite = null
	}

	getType() {
		return "start_convo"
	}

	getPos() {
		return this.sprite ? this.sprite.gamePos : null
	}

	isReady() {
		return true
	}

	check() {
		this.sprite = this.arkona.blocks.findClosestObject(this.arkona.player.sprite, 6, (sprite) => sprite.npc != null)
		return this.sprite
	}

	run() {
		console.log("Talking to " + this.sprite.npc.name)
		this.arkona.level.npcs.forEach(npc => npc.creature.stand(npc.dir))
		this.arkona.convoUi.start(this.sprite.npc)
		return true
	}
}