import UseObject from "./UseObject"
import Talk from "./Talk"
import MovePlayer from "./MovePlayer"
import MoveNpc from "./MoveNpc"
import GeneratorAction from "./GeneratorAction"

const ACTIONS = [
	new UseObject(),
	new Talk(),
	new MovePlayer(),
	new MoveNpc(),
	new GeneratorAction()
]

export const USE_OBJECT = 0
export const TALK = 1
export const MOVE_PLAYER = 2
export const MOVE_NPC = 3
export const GENERATORS = 4

const DONT_LOG = [MOVE_PLAYER, MOVE_NPC, GENERATORS]

export class Queue {
	constructor(arkona) {
		this.arkona = arkona
		this.queue = []
	}

	add(actionIndex, context) {
		let action = ACTIONS[actionIndex]
		action.setContext(context)
		this.queue.push(actionIndex)
	}

	update() {
		let updated = false
		let idx = 0
		while(idx < this.queue.length) {
			let action = ACTIONS[this.queue[idx]]
			if(action.isReady(this.arkona)) {
				this.log(action, "Trying")
				if(action.check(this.arkona)) {
					this.log(action, "Running")
					if(this.arkona.level.isAllowed(action, this.arkona)) {
						let b = action.run(this.arkona)
						if (b) updated = b
					} else {
						this.log(action, "NOT ALLOWED")
						// todo: play FAIL sound or special handling?
					}
				}
				this.queue.splice(idx, 1)
				// don't incr idx here
			} else {
				idx++
			}
		}
		return updated
	}

	log(action, message) {
		if(DONT_LOG.find(s => ACTIONS[s] == action)) return
		console.log(message + ": type=" + action.getType() + " at " + action.getPos())
	}
}