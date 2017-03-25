import * as Config from "./../config/Config"
import { dist3d } from "../utils"
import * as Creatures from "../config/Creatures"
import AnimatedSprite from "../world/Animation"
import Alive from "./Alive"

export default class {

	constructor(arkona, x, y, z, options, creatureName) {
		this.arkona = arkona
		this.x = x
		this.y = y
		this.z = z
		this.anchorX = x
		this.anchorY = y
		this.anchorZ = z
		this.options = options || {}
		this.dir = Config.DIR_N
		this.stopClock = null
		this.creatureName = creatureName
		this.info = Creatures.CREATURES[creatureName]
		this.animatedSprite = new AnimatedSprite(arkona.game, creatureName, arkona.blocks, x, y, z, this.info.animations, this.info.blockName)
		this.animatedSprite.sprite.npc = this
		this.alive = new Alive(this.getMonster() ? this.getMonster()["alive"] : {}, this)
	}

	onDamage(amount) {
		console.warn(this.getName() + " takes " + amount + " damage.")
		this.arkona.damages.add(amount, this.x - 2, this.y - 2, this.z)
	}

	onDeath() {
		console.warn(this.getName() + " dies.")
		this.arkona.level.removeNpc(this.arkona, this)
	}

	move() {
		// precalculate some stuff
        this.distToPlayer = this.arkona.getDistanceToPlayer(this.x, this.y, this.z)
		this.dirToPlayer = this.getDirToPlayer()

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
		if(this.arkona.player.animatedSprite) {
			if(this.dirToPlayer != null) this.dir = this.dirToPlayer
			if(this.distToPlayer <= Config.NEAR_DIST) {
				// todo: attack instead
				if(this.alive.attack(this.arkona.player.alive)) {
					this.animatedSprite.setAnimation("attack", this.dir)
				}
			} else if(this.distToPlayer <= Config.FAR_DIST) {
				this._takeStep()
			} else {
				this.moveFriendly()
			}
		} else {
			this.animatedSprite.setAnimation("stand", this.dir)
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
			if(this.dirToPlayer != null) this.dir = this.dirToPlayer
		}
		this.animatedSprite.setAnimation("stand", this.dir)
	}

	_isStopped() {
		return this.stopClock != null && Date.now() - this.stopClock < Config.STOP_TIME
	}

	_willStop() {
		if(this.options.movement == Config.MOVE_ATTACK) return false

		// move near player acts as anchor when the player is far
        if(this.options.movement == Config.MOVE_NEAR_PLAYER && this.distToPlayer < Config.MID_DIST) return false;

		// anchor stops near the player
        let probability = 9.7
		if(this.arkona.player.animatedSprite && this.distToPlayer < Config.NEAR_DIST) {
			probability = 1
		}
		return !this._isStopped() && Math.random() * 10 >= probability
	}

	isNearPlayer() {
		return this.isNearLocation(...this.arkona.player.animatedSprite.sprite.gamePos)
	}

	isNearLocation(x, y, z) {
		return dist3d(this.x, this.y, this.z, x, y, z) <= Config.NEAR_DIST
	}

	getDirToPlayer() {
		return Config.getDirToLocation(this.x, this.y, ...this.arkona.player.animatedSprite.sprite.gamePos)
	}

	_stop() {
		this.stopClock = Date.now()
		this._turnToPlayer()
	}

	_takeStep() {
		let [nx, ny, nz] = this.arkona.moveInDir(this.x, this.y, this.z, this.dir, this.info.speed)
		if(this.x == nx && this.y == ny) {
			this.animatedSprite.setAnimation("stand", this.dir)
			return true
		} else if(this._moveToNextStep(nx, ny, nz)) {
			[this.x, this.y, this.z] = [nx, ny, nz]
			this.animatedSprite.setAnimation("walk", this.dir)
			return true
		} else {
			this.animatedSprite.setAnimation("stand", this.dir)
			return false
		}
	}

	_moveToNextStep(nx, ny, nz) {
        if(this.options.movement == Config.MOVE_NEAR_PLAYER && this.distToPlayer < Config.NEAR_DIST) {
            return false
        } else if(this.options.movement == Config.MOVE_NEAR_PLAYER && this.distToPlayer < Config.MID_DIST && this.dir != this.dirToPlayer) {
            return false
        } else if((this.options.movement == Config.MOVE_ANCHOR || this.options.movement == Config.MOVE_NEAR_PLAYER) &&
            dist3d(this.anchorX, this.anchorY, this.anchorZ, nx, ny, nz) > Config.MID_DIST) {
            return false
        }
		return this.animatedSprite.moveTo(nx, ny, nz)
	}

	_changeDir() {
        if(this.options.movement == Config.MOVE_NEAR_PLAYER && this.distToPlayer < Config.MID_DIST) {
            this.dir = this.dirToPlayer
		} else {
            this.dir = Config.getRandomDir()
		}
	}

	getName() {
		return this.options.name || this.creatureName
	}

	setPosFromSprite(sprite) {
		[this.x, this.y] = sprite.floatPos
		this.z = sprite.gamePos[2]
	}
}