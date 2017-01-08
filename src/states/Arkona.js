/* globals __DEV__ */
import Phaser from 'phaser'
import Block, { isFlat } from '../world/Block'
import {getRandom, range} from '../utils'
import * as Config from '../config/Config'
import $ from 'jquery'
import Creature from '../config/Creatures'
import Level from '../config/Level'

export default class extends Phaser.State {
	init(context) {
		console.log("context=", context)
		this.game.world.scale.set(Config.GAME_ZOOM);
	}

	preload() {
		Creature.preload(this.game)
	}

	create() {
		this.lastTime = 0
		this.lastDir = null

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

		this.blocks = new Block(this)
		this.level = new Level("farm")
		this.level.start(this.game, this.blocks, () => {
			this.px = this.level.info.startPos[0]
			this.py= this.level.info.startPos[1]
			this.pz= this.level.info.startPos[2]
			this.player = new Creature(this.game, "man", this.blocks, this.px, this.py, this.pz)
		})
	}

	update() {
		let updated = this.level.moveNpcs()
		let b = this.movePlayer()
		if(!updated) updated = b

		if(this.space.justDown) {
			this.door = this.blocks.findFirstAround(this.player.sprite, Config.DOORS, 12)
			if(this.door) {
				this.blocks.replace(this.door, Config.getOppositeDoor(this.door.name))
				updated = true
			}
		}

		if(updated) this.blocks.sort()
	}

	movePlayer() {
		let cursorKeyDown = this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.down.isDown || this.cursors.right.isDown
		let now = Date.now()
		if(now - this.lastTime > Config.SPEED && cursorKeyDown) {
			this.lastTime = now

			let [ox, oy] = [this.px, this.py]
			let dir = null
			if (this.cursors.up.isDown && this.cursors.left.isDown) {
				this.px--
				dir = 'w'
			} else if (this.cursors.up.isDown && this.cursors.right.isDown) {
				this.py--
				dir = 'n'
			} else if (this.cursors.down.isDown && this.cursors.right.isDown) {
				this.px++
				dir = 'e'
			} else if (this.cursors.down.isDown && this.cursors.left.isDown) {
				this.py++
				dir = 's'
			} else {
				if (this.cursors.up.isDown) {
					this.py--;
					this.px--
					dir = 'nw'
				} else if (this.cursors.down.isDown) {
					this.py++;
					this.px++
					dir = 'se'
				} else if (this.cursors.left.isDown) {
					this.px--;
					this.py++
					dir = 'sw'
				} else if (this.cursors.right.isDown) {
					this.px++;
					this.py--
					dir = 'ne'
				}
			}

			if (ox != this.px || oy != this.py) {
				if(this.tryStepTo(this.px, this.py, this.pz) ||
					this.tryStepTo(this.px, oy, this.pz) ||
					this.tryStepTo(ox, this.py, this.pz)) {
					this.blocks.checkRoof(this.px - 1, this.py - 1)
					if(dir) {
						this.lastDir = dir
						this.player.walk(dir)
					}
				} else {
					this.px = ox; this.py = oy
				}
			}
		}

		if(!cursorKeyDown) {
			if(this.player) {
				this.player.stand(this.lastDir)
			}
		}
	}

	tryStepTo(nx, ny, nz) {
		if(this.blocks.moveTo(this.player.sprite, nx, ny, nz)) {
			this.px = nx
			this.py = ny
			this.pz = nz
			this.blocks.centerOn(this.player.sprite, Config.GAME_ZOOM)
			return true
		} else {
			return false
		}
	}
}