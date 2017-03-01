import * as Config from "../config/Config"
import * as Creatures from "../config/Creatures"
import AnimatedSprite from "./Animation"
import Alive from "./Alive"
import * as Utils from "../utils"

export default class {
	constructor(arkona) {
		this.arkona = arkona
		this.lastDir = null
		this.attacking = null

		this.alive = new Alive({
			health: 10,
			strength: 1,
			attackWait: 300
		}, this)

		this.animatedSprite = null
	}

	update(moving) {
		if(this.isAttacking()) {
			this.setAnimation("attack")
		} else if (!moving) {
			this.setAnimation("stand")
		}
	}

	onLevelStart(startX, startY, startDir) {
		let creatureInfo = Creatures.CREATURES[Config.PLAYER_CREATURE_NAME]
		this.animatedSprite = new AnimatedSprite(
			this.arkona.game,
			Config.PLAYER_CREATURE_NAME,
			this.arkona.blocks,
			startX == null ? this.arkona.level.info.startPos[0] : startX,
			startY == null ? this.arkona.level.info.startPos[1] : startY,
			0,
			creatureInfo.animations,
			creatureInfo.blockName)
		this.animatedSprite.sprite.userControlled = true
		this.animatedSprite.animationSpeed = 16
		let dir = startDir || this.arkona.level.info["startDir"]
		if(dir) this.lastDir = dir
		this.animatedSprite.setAnimation("stand", dir || this.lastDir || Config.DIR_E)
		this.animatedSprite.centerOn()
	}

	onDamage(amount) {
		console.warn("Player damaged for " + amount + ".")
	}

	onDeath() {
		console.warn("Player dies.")
	}

	setAnimation(name) {
		if(this.animatedSprite) this.animatedSprite.setAnimation(name, this.lastDir)
	}

	setDir(dir) {
		this.lastDir = dir
	}

	attack(npc) {
		console.warn("Attacking: ", npc.getName())
		let dir = Config.getDirToLocation(
			this.animatedSprite.sprite.gamePos[0],
			this.animatedSprite.sprite.gamePos[1],
			npc.x, npc.y)
		this.setDir(dir)
		this.attacking = Date.now()
		this.alive.attack(npc.alive)
	}

	isAttacking() {
		if (this.attacking) {
			if (Date.now() - this.attacking > 200) this.attacking = null
		}
		return this.attacking != null
	}

	move(dir) {
		if(this.animatedSprite) {
			let [ox, oy] = this.animatedSprite.sprite.floatPos
			let oz = this.animatedSprite.sprite.gamePos[2]
			let blockTestFx = (blocker) => this._blockedBy(blocker)
			if(dir) {
				let [nx, ny, nz] = this.arkona.moveInDir(ox, oy, oz, dir, Config.PLAYER_SPEED)
				if (this.arkona.blocks.moveTo(this.animatedSprite.sprite, nx, ny, nz, false, true, blockTestFx) ||
					this.arkona.blocks.moveTo(this.animatedSprite.sprite, nx, oy, nz, false, true, blockTestFx) ||
					this.arkona.blocks.moveTo(this.animatedSprite.sprite, ox, ny, nz, false, true, blockTestFx)) {
					this._moved(dir)
					return true
				}
			}
		}
		return false
	}

	/**
	 * The player just moved in this direction.
	 *
	 * @param dir the direction of the player's last step
	 */
	_moved(dir) {
		let [px, py, pz] = this.animatedSprite.sprite.gamePos
		this.arkona.blocks.checkRoof(px - 1, py - 1, pz)
		if (dir != null) {
			this.setDir(dir)
			this.setAnimation("walk")
		}
		this.arkona.checkMapBoundary(px, py)
	}

	/**
	 * The player was just blocked by this sprite.
	 *
	 * @param sprite the sprite blocking the player
	 */
	_blockedBy(sprite) {
		return this.arkona.checkMapPosition(...sprite.gamePos)
	}

	canReach(sprite) {
		// todo: find path to sprite

		// for now just check distance
		return sprite && this.animatedSprite && Utils.dist3d(
				this.animatedSprite.sprite.gamePos[0],
				this.animatedSprite.sprite.gamePos[1],
				this.animatedSprite.sprite.gamePos[2],
				sprite.gamePos[0],sprite.gamePos[1],sprite.gamePos[2],
			) < Config.ACTION_DIST
	}
}
