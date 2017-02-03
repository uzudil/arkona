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
		// let t = Date.now()
		// console.log("Starting to load level: " + this.info.map)
		blocks.load(this.info.map, () => {
			// console.log("Loaded in: " + (Date.now() - t)); t = Date.now()
			for(let npcInfo of this.info.npcs || []) {
				let [x, y, z] = [npcInfo.x, npcInfo.y, npcInfo["z"] || 0]
				let creature = new Creature(arkona.game, npcInfo.creature, blocks, x, y, z)
				let npc = new Npc(arkona, x, y, z, npcInfo["options"], creature)
				this.npcs.push(npc)
			}
			// console.log("Npc init: " + (Date.now() - t)); t = Date.now()
			onLoad()
			// console.log("Onload in: " + (Date.now() - t)); t = Date.now()
		})
	}

	destroy() {
		// todo: free npc memory?
	}

	getActiveNpcs() {
		return this.npcs.filter(npc => npc.isActive())
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

	isAllowed(action, arkona) {
		if(this.info["actions"] && action.getPos()) {
			let actionAllowed = this._getAction(action.getPos(), action.getType())
			if(actionAllowed) return actionAllowed.allow(arkona)
		}
		return true
	}

	getAction(pos, action, arkona) {
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
