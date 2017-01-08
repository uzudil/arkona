/* globals __DEV__ */
import Phaser from 'phaser'
import Block, { isFlat } from '../world/Block'
import {getRandom, range} from '../utils'
import * as Config from '../config/Config'
import $ from 'jquery'
import Creature from '../config/Creatures'

const ZOOM = 2

export default class extends Phaser.State {
	init(context) {
		console.log("context=", context)
		this.game.world.scale.set(ZOOM);
	}

	preload() {
		Creature.preload(this.game)
	}

	create() {
		this.mapName = "farm"
		this.px = 66
		this.py = 63
		this.pz = 0

		this.lastTime = 0
		this.lastDir = null

		this.blocks = new Block(this)
		this.blocks.load(this.mapName, () => {
			this.player = new Creature(this.game, "man", this.blocks, ZOOM, this.px, this.py, this.pz)
		})

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

		let style = {font: "bold 14px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top"}
		this.debug = game.add.text(0, 0, "Pos: ", style)
		this.debug.setShadow(1, 1, 'rgba(0,0,0,1)', 2)
		this.debug.setTextBounds(0, 0, 800, 20)

	}

	update() {
		this.movePlayer()

		if(this.space.justDown) {
			this.door = this.blocks.findFirstAround(this.player.sprite, Config.DOORS, 12)
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
						this.debug.text = dir
						this.lastDir = dir
						this.player.sprite.animations.play('walk.' + dir, Config.ANIMATION_SPEED, true);
					}
				} else {
					this.px = ox; this.py = oy
				}
			}
		}

		if(!cursorKeyDown) {
			if(this.player) {
				if(this.lastDir) {
					this.player.sprite.animations.play('stand.' + this.lastDir);
				} else {
					this.player.sprite.animations.stop()
				}
			}
		}
	}

	tryStepTo(nx, ny, nz) {
		if(this.blocks.moveTo(this.player.sprite, nx, ny, nz)) {
			this.px = nx
			this.py = ny
			this.pz = nz
			this.blocks.sort()
			this.blocks.centerOn(this.player.sprite, ZOOM)
			return true
		} else {
			return false
		}
	}
}