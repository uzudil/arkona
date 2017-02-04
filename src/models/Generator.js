import * as Config from '../config/Config'
import {MONSTERS} from '../config/Monsters'
import {CREATURES} from '../config/Creatures'
import {BLOCKS} from '../config/Blocks'

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
			console.log("Generating " + this.info.type + "-s at " + this.info.x + "," + this.info.y + "," + this.info.z)
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
			// if(this.arkona.blocks.moveTo(npc.creature.sprite, this.info.x, this.info.y, this.info.z)) {
			if (this.arkona.blocks.moveNear(npc.creature.sprite, this.info.x, this.info.y, this.info.z, this.getRange())) {
				console.log("Starting " + this.info.type + " at " + npc.creature.sprite.gamePos)
				npc.setPosFromSprite(npc.creature.sprite)
				this.generated.push(npc)
			} else {
				console.log("Generator unable to position " + this.info.type + " at " + this.info.x + "," + this.info.y + "," + this.info.z)
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