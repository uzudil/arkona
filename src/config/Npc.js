import * as Config from './Config'

export default class {
	constructor(creatureName, x, y, z) {
		this.creatureName = creatureName
		this.x = x
		this.y = y
		this.z = z
		this.dir = Config.DIR_N
		this.lastTime = 0
		this.initialized = false
	}

	init(creature) {
		this.initialized = true
		this.creature = creature
	}

	destroy() {
		this.creature = null
		this.initialized = false
	}

	move() {
		if(!this.initialized) return false

		let now = Date.now()
		if(now - this.lastTime > this.creature.info.speed) {
			this.lastTime = now

			if (!this._takeStep()) {
				this._changeDir()
			}

			return true
		}  else {
			return false
		}
	}

	_isKeepMoving() {
		return Math.random() * 100 < 99.5
	}

	_takeStep() {
		let nx = this.x
		let ny = this.y
		let nz = this.z
		switch(this.dir) {
			case Config.DIR_N: ny--; break
			case Config.DIR_NE: ny--; nx++; break
			case Config.DIR_E: nx++; break
			case Config.DIR_SE: ny++; nx++; break
			case Config.DIR_S: ny++; break
			case Config.DIR_SW: ny++; nx--; break
			case Config.DIR_W: nx--; break
			case Config.DIR_NW: ny--; nx--; break
		}
		if(this.x == nx && this.y == ny) {
			this.creature.stand(this.dir)
			return true
		} else if(this.creature.moveTo(nx, ny, nz)) {
			[this.x, this.y, this.z] = [nx, ny, nz]
			this.creature.walk(this.dir)
			return true
		} else {
			this.creature.stand(this.dir)
			return false
		}
	}

	_changeDir() {
		this.dir = Config.getRandomDir()
	}
}