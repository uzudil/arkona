import * as Config from "../config/Config"

export default class {
	constructor(arkona, info) {
		this.arkona = arkona
		this.info = info
		this.generated = []
	}

	update() {
		// - only create 1 per call
		// - only if generator location is off-screen
		if(this.getCount() > this.generated.length && !this.isOnScreen()) {
			console.warn("Generating " + this.info.type.creature + " at " + this.info.x + "," + this.info.y + "," + this.info.z)
			let monster = this.info.type
			let npc = this.arkona.level.addNpc(this.arkona, {
				creature: monster.creature,
				x: 0, y: 0, z: 0,
				options: {
					movement: Config.MOVE_ATTACK,
					monster: monster
				}
			})

			// try to find a place for it
			if (this.arkona.blocks.moveNear(npc.animatedSprite.sprite, this.info.x, this.info.y, this.info.z, this.getRange())) {
				console.warn("Starting " + this.info.type.creature + " at " + npc.animatedSprite.sprite.gamePos)
				npc.setPosFromSprite(npc.animatedSprite.sprite)
				this.generated.push(npc)
			} else {
				console.warn("Generator unable to position " + this.info.type.creature + " at " + this.info.x + "," + this.info.y + "," + this.info.z)
				this.arkona.level.removeNpc(this.arkona, npc)
			}
		}
	}

	getCount() {
		return this.info["count"] ? this.info.count : 1
	}

	getRange() {
		return this.info["range"] ? this.info.range : 6
	}

	isOnScreen() {
		return this.arkona.blocks.isOnScreen(this.info.x, this.info.y, this.info.z)
	}
}