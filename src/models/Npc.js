import * as Config from './../config/Config'
import { dist3d } from '../utils'
import * as Queue from '../actions/Queue'

export default class {
	constructor(arkona, x, y, z, options, creature) {
		this.arkona = arkona
		this.x = x
		this.y = y
		this.z = z
		this.anchorX = x
		this.anchorY = y
		this.anchorZ = z
		this.options = options || {}
		this.creature = creature
		this.creature.sprite.npc = this
		this.dir = Config.DIR_N
		this.lastTime = 0
		this.stopClock = null
	}

	move() {
		if (this._willStop()) {
			this._stop()
		} else if(this._isStopped()) {
			this._turnToPlayer()
		} else if (!this._takeStep()) {
			this._changeDir()
		}
	}

	_turnToPlayer() {
		if(this.isNearPlayer()) {
			let dir = this.getDirToPlayer()
			if(dir != null) this.dir = dir
		}
		this.creature.stand(this.dir)
	}

	_isStopped() {
		return this.stopClock != null && Date.now() - this.stopClock < Config.STOP_TIME
	}

	_willStop() {
		let probability = 9.7
		if(this.arkona.player && this.options.movement == Config.MOVE_ANCHOR) {
			if(this.isNearPlayer()) probability = 1
		}
		return !this._isStopped() && Math.random() * 10 >= probability
	}

	isNearPlayer() {
		return this.isNearLocation(...this.arkona.player.sprite.gamePos)
	}

	isNearLocation(x, y, z) {
		let distanceToPlayer = dist3d(this.x, this.y, this.z, x, y, z)
		return distanceToPlayer <= Config.NEAR_DIST
	}

	getDirToPlayer() {
		return this.getDirToLocation(...this.arkona.player.sprite.gamePos)
	}

	getDirToLocation(x, y, z) {
		let dx = this.x - x
		let dy = this.y - y
		if(dx > 0 && dy > 0) return Config.DIR_NW
		else if(dx > 0 && dy < 0) return Config.DIR_SW
		else if(dx < 0 && dy > 0) return Config.DIR_NE
		else if(dx < 0 && dy < 0) return Config.DIR_SE
		else if(dx < 0) return Config.DIR_E
		else if(dx > 0) return Config.DIR_W
		else if(dy < 0) return Config.DIR_S
		else if(dy > 0) return Config.DIR_N
		else return null
	}

	_stop() {
		this.stopClock = Date.now()
		this._turnToPlayer()
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
		let d = this.arkona.game.time.elapsedMS / (60 * this.creature.info.speed)
		// smooth movement, fallback to a delta of 1 if can't maintain fps
		let dx = Math.max(-1, Math.min(1, Config.MOVE_DELTA[this.dir][0] * d))
		let dy = Math.max(-1, Math.min(1, Config.MOVE_DELTA[this.dir][1] * d))
		let nx = this.x + dx
		let ny = this.y + dy
		let nz = this.z
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

	getName() {
		return this.options.name || this.creature.name
	}

	setPosFromSprite(sprite) {
		[this.x, this.y] = sprite.floatPos
		this.z = sprite.gamePos[2]
	}
}