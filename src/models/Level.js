import Npc from "./Npc"
import Creature from "./Creature"
import * as Levels from "./../config/Levels"
import Generator from "./Generator"

export default class {
	constructor(levelName) {
		this.info = Levels.LEVELS[levelName]
		this.npcs = []
		this.generators = []
		this.loaded = false
	}

	onLoad(arkona) {
		if(this.loaded == false) {
			if(this.info.onLoad) this.info.onLoad(arkona)
			this.loaded = true
		}
	}

	start(arkona, onLoad) {
		arkona.blocks.load(this.info.map, () => {
			(this.info.npcs || []).forEach(npcInfo => this.addNpc(arkona, npcInfo))
			for(let generatorInfo of this.info.generators || []) {
				this.generators.push(new Generator(arkona, generatorInfo))
			}
			onLoad()
		})
	}

	addNpc(arkona, npcInfo) {
		let [x, y, z] = [npcInfo.x, npcInfo.y, npcInfo["z"] || 0]
		let creature = new Creature(arkona.game, npcInfo.creature, arkona.blocks, x, y, z)
		let npc = new Npc(arkona, x, y, z, npcInfo["options"], creature)
		this.npcs.push(npc)
		return npc
	}

	removeNpc(arkona, npc) {
		arkona.blocks.remove(npc.creature.sprite)
		let idx = this.npcs.indexOf(npc)
		this.npcs.splice(idx, 1)
	}

	destroy() {
		// todo: free npc memory?
	}

	checkBounds(px, py, blocks) {
		for(let conn of this.info.connect || []) {
			let found = false
			if(conn.src.dir == "w" && px <= -4) {
				found = true
			} else if(conn.src.dir == "e" && px >= blocks.w - 4) {
				found = true
			} else if(conn.src.dir == "n" && py <= -4) {
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

	checkPos(x, y, z) {
		for(let c of this.info.connect || []) {
			if (c.src["x"] == x && c.src["y"] == y && c.src["z"] == z) {
				return c.dst
			}
		}
		return null
	}

	isAllowed(action, arkona) {
		if(this.info["actions"] && action.getPos()) {
			let actionAllowed = this._getAction(action.getPos(), action.getType())
			if(actionAllowed) return actionAllowed.allow(arkona)
		}
		return true
	}

	getAction(pos, action) {
		if(this.info["actions"]) {
			let actionInfo = this._getAction(pos, action.getType())
			if(actionInfo && actionInfo["action"]) return actionInfo
		}
		return null
	}

	_getAction(pos, type) {
		return this.info.actions.find(o => o.type == type && o.x == pos[0] && o.y == pos[1] && o.z == pos[2])
	}
}
