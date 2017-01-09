import Npc from './Npc'
import Creature from './Creatures'
import * as Config from './Config'

export const LEVELS = {
	farm: {
		map: "farm",
		startPos: [66, 63, 0],
		npcs: [
			new Npc('woman', 55, 66, 0, {
				movement: Config.MOVE_ANCHOR
			}),
			new Npc('cow', 37, 97, 0),
			new Npc('cow', 42, 89, 0)
		]
	}
}

export default class {
	constructor(levelName) {
		this.info = LEVELS[levelName]
	}

	start(game, blocks, onLoad) {
		blocks.load(this.info.map, () => {
			for(let npc of this.info.npcs) {
				npc.init(new Creature(game, npc.creatureName, blocks, npc.x, npc.y, npc.z))
			}
			onLoad()
		})
	}

	moveNpcs() {
		let updated = false
		for(let npc of this.info.npcs) {
			let b = npc.move()
			if(!updated) updated = b
		}
		return updated
	}
}