export default class {
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
			let action = this.queue[idx]
			if(action.isReady()) {
				console.log("Trying: " + action.getType())
				if(action.check()) {
					console.log("Running: " + action.getType() + " at " + action.getPos())
					if(this.arkona.level.isAllowed(action, this.arkona)) {
						let b = action.run()
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