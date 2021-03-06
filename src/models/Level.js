import Npc from "./Npc"
import * as Levels from "./../config/Levels"
import * as Config from "./../config/Config"
import Generator from "./Generator"

export default class {
	constructor(levelName) {
		this.name = levelName
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
			(this.info.npcs || []).forEach(npcInfo => this.addNpc(arkona, npcInfo));
			(this.info.monsters || []).forEach(monsterInfo => this.addMonster(arkona, monsterInfo));
			for(let generatorInfo of this.info.generators || []) {
				this.generators.push(new Generator(arkona, generatorInfo))
			}
			onLoad()
		})
	}

	addNpc(arkona, npcInfo) {
		let [x, y, z] = [npcInfo.x, npcInfo.y, npcInfo["z"] || 0]
		let npc = new Npc(arkona, x, y, z, npcInfo["options"], npcInfo.creature)
		this.npcs.push(npc)
		return npc
	}

	addMonster(arkona, monsterInfo) {
		for(let pos of monsterInfo.pos) {
			let npc = new Npc(arkona, pos[0], pos[1], pos[2] || 0, {
				movement: Config.MOVE_ATTACK,
				monster: monsterInfo.monster
			}, monsterInfo.monster.creature)
			this.npcs.push(npc)
		}
	}

	removeNpcByName(arkona, name) {
		for(let npc of this.npcs) {
			if(npc.getName() == name) {
				this.removeNpc(arkona, npc)
				return
			}
		}
	}

	removeNpc(arkona, npc) {
		if(npc["generator"]) {
			npc.generator.remove(npc)
		}
		arkona.blocks.remove(npc.animatedSprite.sprite)
		let idx = this.npcs.indexOf(npc)
		this.npcs.splice(idx, 1)
	}

	destroy() {
		// todo: free npc memory?
	}

	checkBounds(arkona, px, py) {
		for(let conn of this.info.connect || []) {
			let found = false
			if(conn.src.dir == "w" && px <= -4) {
				found = true
			} else if(conn.src.dir == "e" && px >= arkona.blocks.w - 4) {
				found = true
			} else if(conn.src.dir == "n" && py <= -4) {
				found = true
			} else if(conn.src.dir == "s" && py >= arkona.blocks.h - 4) {
				found = true
			}
			if(found) {
				if(conn["test"] && !conn.test(arkona)) {
					// todo: play 'denined' sound
					return
				}
				return conn.dst
			}
		}
		return null
	}

	checkPos(arkona, x, y, z) {
		for(let c of this.info.connect || []) {
			if (c.src["x"] == x && c.src["y"] == y && c.src["z"] == z) {
				if(c["test"] && !c.test(arkona)) {
					// todo: play 'denined' sound
					return
				}
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
