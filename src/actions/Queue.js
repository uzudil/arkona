import OpenDoor from './OpenDoor'
import Talk from './Talk'
import MovePlayer from './MovePlayer'
import MoveNpc from './MoveNpc'

const ACTIONS = [
	new OpenDoor(),
	new Talk(),
	new MovePlayer(),
	new MoveNpc()
]

export const OPEN_DOOR = 0
export const TALK = 1
export const MOVE_PLAYER = 2
export const MOVE_NPC = 3

const DONT_LOG = [MOVE_PLAYER, MOVE_NPC]

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