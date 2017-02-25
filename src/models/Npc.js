import * as Config from "./../config/Config"
import { dist3d } from "../utils"

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
		this.stopClock = null
	}

	move() {
		if(this.options["movement"] == Config.MOVE_ATTACK) {
			this.moveAttack()
		} else {
			this.moveFriendly()
		}
	}

	getMonster() {
		return this.options["monster"]
	}

	// todo: eventually replace with A*
	moveAttack() {
		if(this.arkona.player) {
			let dir = this.getDirToPlayer()
			if(dir != null) this.dir = dir
			let dist = this._getDistanceToPlayer()
			if(dist <= Config.NEAR_DIST) {
				// todo: attack instead
				this.creature.attack(this.dir)
			} else if(dist <= Config.FAR_DIST) {
				this._takeStep()
			} else {
				this.moveFriendly()
			}
		} else {
			this.creature.stand(this.dir)
		}
	}

	moveFriendly() {
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
		if(this.options.movement == Config.MOVE_ATTACK) return false
		let probability = 9.7
		if(this.arkona.player && this.options.movement == Config.MOVE_ANCHOR) {
			if(this.isNearPlayer()) probability = 1
		}
		return !this._isStopped() && Math.random() * 10 >= probability
	}

	_getDistanceToPlayer() {
		return dist3d(this.x, this.y, this.z, ...this.arkona.player.sprite.gamePos)
	}

	isNearPlayer() {
		return this.isNearLocation(...this.arkona.player.sprite.gamePos)
	}

	isNearLocation(x, y, z) {
		let distanceToPlayer = dist3d(this.x, this.y, this.z, x, y, z)
		return distanceToPlayer <= Config.NEAR_DIST
	}

	getDirToPlayer() {
		return Config.getDirToLocation(this.x, this.y, ...this.arkona.player.sprite.gamePos)
	}

	_stop() {
		this.stopClock = Date.now()
		this._turnToPlayer()
	}

	_takeStep() {
		let [nx, ny, nz] = this.arkona.moveInDir(this.x, this.y, this.z, this.dir, this.creature.info.speed)
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