import * as Config from './Config'
import { dist3d } from '../utils'

export default class {
	constructor(creatureName, x, y, z, options) {
		this.creatureName = creatureName
		this.x = x
		this.y = y
		this.z = z
		this.anchorX = x
		this.anchorY = y
		this.anchorZ = z
		this.options = options || {}
		this.dir = Config.DIR_N
		this.lastTime = 0
		this.stopClock = null
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

			if (this._isStopping()) {
				this._stop()
			} else if(this._isStopped()) {
				// hang out
				return false
			} else if (!this._takeStep()) {
				this._changeDir()
			}

			return true
		}  else {
			return false
		}
	}

	_isStopped() {
		return this.stopClock != null && Date.now() - this.stopClock < Config.STOP_TIME
	}

	_isStopping() {
		return !this._isStopped() && Math.random() * 10 >= 9
	}

	_stop() {
		console.log("Stopping")
		this.stopClock = Date.now()
		this.creature.stand(this.dir)
	}

	_takeStep() {
		let [nx, ny, nz] = this._nextStepPos()
		if(this.x == nx && this.y == ny) {
			this.creature.stand(this.dir)
			return true
		} else if(this._moveToNextStep(nx, ny, nz)) {
			[this.x, this.y, this.z] = [nx, ny, nz]
			this.creature.walk(this.dir)
			return true
		} else {
			this.creature.stand(this.dir)
			return false
		}
	}

	_nextStepPos() {
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
		return [nx, ny, nz]
	}

	_moveToNextStep(nx, ny, nz) {
		if(this.options.movement == Config.MOVE_ANCHOR &&
			dist3d(this.anchorX, this.anchorY, this.anchorZ, nx, ny, nz) > 16) {
			return false
		}
		return this.creature.moveTo(nx, ny, nz)
	}

	_changeDir() {
		this.dir = Config.getRandomDir()
	}
}