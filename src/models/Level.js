import Npc from './Npc'
import Creature from './Creature'
import * as Config from './../config/Config'
import * as Levels from './../config/Levels'

export default class {
	constructor(levelName) {
		this.info = Levels.LEVELS[levelName]
		this.npcs = []
		this.loaded = false
	}

	onLoad(arkona) {
		if(this.loaded == false) {
			if(this.info.onLoad) this.info.onLoad(arkona)
			this.loaded = true
		}
	}

	start(arkona, blocks, onLoad) {
		blocks.load(this.info.map, () => {
			for(let npcInfo of this.info.npcs || []) {
				let [x, y, z] = [npcInfo.x, npcInfo.y, npcInfo["z"] || 0]
				let creature = new Creature(arkona.game, npcInfo.creature, blocks, x, y, z)
				let npc = new Npc(arkona, x, y, z, npcInfo["options"], creature)
				this.npcs.push(npc)
			}
			onLoad()
		})
	}

	destroy() {
		// todo: free npc memory?
	}

	moveNpcs() {
		let updated = false
		for(let npc of this.npcs) {
			let b = npc.move()
			if(!updated) updated = b
		}
		return updated
	}

	checkBounds(px, py, blocks) {
		for(let conn of this.info.connect || []) {
			let found = false
			if(conn.src.dir == "w" && px <= 0) {
				found = true
			} else if(conn.src.dir == "e" && px >= blocks.w - 4) {
				found = true
			} else if(conn.src.dir == "n" && py <= 0) {
				found = true
			} else if(conn.src.dir == "s" && py >= blocks.h - 4) {
				found = true
			}
			if(found) {
				return conn.dst
			}
		}
		return null
	}
}
