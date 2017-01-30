import OpenDoor from './OpenDoor'
import Talk from './Talk'

const ACTIONS = [
	new OpenDoor(),
	new Talk(),
]

export const OPEN_DOOR = 0
export const TALK = 1
export const MOVE_PLAYER = 2

export class Queue {
	constructor(arkona) {
		this.arkona = arkona
		this.queue = []
	}

	add(action) {
		this.queue.push(action)
	}

	update() {
		let updated = false
		let idx = 0
		while(idx < this.queue.length) {
			let action = ACTIONS[this.queue[idx]]
			action.reset()
			if(action.isReady(this.arkona)) {
				console.log("Trying: " + action.getType())
				if(action.check(this.arkona)) {
					console.log("Running: " + action.getType() + " at " + action.getPos())
					if(this.arkona.level.isAllowed(action, this.arkona)) {
						let b = action.run(this.arkona)
						if (b) updated = b
					} else {
						console.log("NOT ALLOWED: " + action.getType() + " at " + action.getPos())
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
}