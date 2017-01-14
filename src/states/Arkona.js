/* globals __DEV__ */
import Phaser from 'phaser'
import Block, { isFlat } from '../world/Block'
import {getRandom, range} from '../utils'
import * as Config from '../config/Config'
import $ from 'jquery'
import Creature from '../models/Creature'
import Level from '../models/Level'
import Messages from '../ui/Messages'
import ConvoUI from '../ui/ConvoUI'

export default class extends Phaser.State {
	init(context) {
		console.log("context=", context)
	}

	create() {
		this.lastTime = 0
		this.lastDir = null

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		this.esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
		this.t_key = this.game.input.keyboard.addKey(Phaser.Keyboard.T)

		// ui
		this.messages = new Messages(this)
		this.convoUi = new ConvoUI(this)

		this.blocks = new Block(this)
		this.level = new Level("farm")
		this.level.start(this, this.blocks, () => {
			this.px = this.level.info.startPos[0]
			this.py= this.level.info.startPos[1]
			this.pz= this.level.info.startPos[2]
			this.player = new Creature(this.game, "man", this.blocks, this.px, this.py, this.pz)
			this.player.stand(Config.DIR_E)

			this.world.bringToTop(this.messages.group)
			this.world.bringToTop(this.convoUi.group)
		})
	}

	update() {
		if(this.messages.group.visible) {
			if (this.space.justDown) {
				this.messages.showNextLine()
			}
		} else if(this.convoUi.group.visible) {
			if (this.esc.justDown) {
				this.convoUi.end()
			} else if(this.space.justDown) {
				this.convoUi.select()
			} else if(this.cursors.up.justDown) {
				this.convoUi.change(-1)
			} else if(this.cursors.down.justDown) {
				this.convoUi.change(1)
			}
		} else {
			let updated = this.level.moveNpcs()
			let b = this.movePlayer()
			if (!updated) updated = b

			if (this.t_key.justDown) {
				let sprite = this.blocks.findClosestObject(this.player.sprite, 12, (sprite) => sprite.npc != null)
				if(sprite) {
					this.convoUi.start(sprite.npc)
				}
			}
			if (this.space.justDown) {
				this.door = this.blocks.findFirstAround(this.player.sprite, Config.DOORS, 12)
				if (this.door) {
					this.blocks.replace(this.door, Config.getOppositeDoor(this.door.name))
					updated = true
				}
			}

			if (updated) this.blocks.sort()
		}

		if(this.level.loaded == false) {
			this.level.info.onLoad(this)
			this.level.loaded = true
		}
	}

	// todo: smooth/vector movement
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
			this.blocks.centerOn(this.player.sprite)
			return true
		} else {
			return false
		}
	}

	narrate(message) {
		this.messages.showFirstLine(message)
	}
}