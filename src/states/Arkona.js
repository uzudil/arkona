/* globals __DEV__ */
import Phaser from 'phaser'
import Block, { isFlat } from '../world/Block'
import {getRandom} from '../utils'
import * as Config from '../config/Config'
import Palette from '../editor/Palette'
import $ from 'jquery'

const ZOOM = 2

export default class extends Phaser.State {
	init(context) {
		console.log("context=", context)
		this.game.world.scale.set(ZOOM);
	}

	preload() {
		this.game.load.spritesheet("player", 'assets/creatures/man.png?cb=' + Date.now(), 32, 64)
	}

	create() {
		this.mapName = "village"
		this.px = 190
		this.py = 89
		this.pz = 0

		this.lastTime = 0

		this.blocks = new Block(this)
		this.blocks.load(this.mapName, () => {
			this.player = this.blocks.set("person.n", this.px, this.py, this.pz, false, (screenX, screenY) => {
				let sprite = this.game.add.sprite(screenX, screenY, "player")
				sprite.animations.add("walk.e", [0,1,2,3])
				sprite.animations.add("walk.n", [4,5,6,7])
				sprite.animations.add("walk.w", [8,9,10,11])
				sprite.animations.add("walk.s", [12,13,14,15])
				return sprite
			})
			this.blocks.sort()
			this.blocks.centerOn(this.player, ZOOM)
		})

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
	}

	update() {
		this.movePlayer()

		if(this.space.justDown) {
			this.door = this.blocks.findFirstAround(this.player, Config.DOORS, 12)
			if(this.door) {
				this.blocks.replace(this.door, Config.getOppositeDoor(this.door.name))
			}
		}
	}

	movePlayer() {
		let cursorKeyDown = this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.down.isDown || this.cursors.right.isDown
		let now = Date.now()
		if(now - this.lastTime > Config.SPEED && cursorKeyDown) {
			this.lastTime = now

			let [ox, oy] = [this.px, this.py]
			if (this.cursors.up.isDown && this.cursors.left.isDown) {
				this.px--
			} else if (this.cursors.up.isDown && this.cursors.right.isDown) {
				this.py--
			} else if (this.cursors.down.isDown && this.cursors.right.isDown) {
				this.px++
			} else if (this.cursors.down.isDown && this.cursors.left.isDown) {
				this.py++
			} else {
				if (this.cursors.up.isDown) {
					this.py--;
					this.px--
				} else if (this.cursors.down.isDown) {
					this.py++;
					this.px++
				}
				if (this.cursors.left.isDown) {
					this.px--;
					this.py++
				} else if (this.cursors.right.isDown) {
					this.px++;
					this.py--
				}
			}

			if (ox != this.px || oy != this.py) {
				if(this.tryStepTo(this.px, this.py, this.pz) ||
					this.tryStepTo(this.px, oy, this.pz) ||
					this.tryStepTo(ox, this.py, this.pz)) {
					this.blocks.checkRoof(this.px - 1, this.py - 1)
					if(ox < this.px) {
						this.player.animations.play('walk.e', Config.ANIMATION_SPEED, true);
					} else if(ox > this.px) {
						this.player.animations.play('walk.w', Config.ANIMATION_SPEED, true);
					} else if(oy < this.py) {
						this.player.animations.play('walk.s', Config.ANIMATION_SPEED, true);
					} else if(oy > this.py) {
						this.player.animations.play('walk.n', Config.ANIMATION_SPEED, true);
					}
				} else {
					this.px = ox; this.py = oy
				}
			}
		}

		if(!cursorKeyDown) {
			if(this.player) {
				this.player.animations.stop()
			}
		}
	}

	tryStepTo(nx, ny, nz) {
		if(this.blocks.moveTo(this.player, nx, ny, nz)) {
			this.px = nx
			this.py = ny
			this.pz = nz
			this.blocks.sort()
			this.blocks.centerOn(this.player, ZOOM)
			return true
		} else {
			return false
		}
	}
}