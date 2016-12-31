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
	}

	create() {
		this.mapName = "village"
		this.px = 190
		this.py = 89
		this.pz = 0

		this.lastTime = 0

		this.blocks = new Block(this)
		this.blocks.load(this.mapName, () => {
			this.player = this.blocks.set("person.n", this.px, this.py, this.pz)
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
		let now = Date.now()
		if(now - this.lastTime > Config.SPEED &&
			(this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.down.isDown || this.cursors.right.isDown)) {
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
					this.blocks.checkRoof(this.px, this.py)
				} else {
					this.px = ox; this.py = oy
				}
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