import Npc from './Npc'
import Creature from './Creature'
import * as Config from './../config/Config'
import * as Levels from './../config/Levels'

export default class {
	constructor(levelName) {
		this.info = Levels.LEVELS[levelName]
		this.npcs = []
	}

	start(arkona, blocks, onLoad) {
		blocks.load(this.info.map, () => {
			for(let npcInfo of this.info.npcs) {
				let [x, y, z] = [npcInfo.x, npcInfo.y, npcInfo["z"] || 0]
				let creature = new Creature(arkona.game, npcInfo.creature, blocks, x, y, z)
				let npc = new Npc(arkona, x, y, z, npcInfo["options"], creature)
				this.npcs.push(npc)
			}
			onLoad()
		})
	}

	moveNpcs() {
		let updated = false
		for(let npc of this.npcs) {
			let b = npc.move()
			if(!updated) updated = b
		}
		return updated
	}
}
