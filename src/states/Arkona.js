/* globals __DEV__ */
import Phaser from 'phaser'
import Block, { isFlat } from '../world/Block'
import {getRandom, range, inRect} from '../utils'
import * as Config from '../config/Config'
import $ from 'jquery'
import Creature from '../models/Creature'
import Level from '../models/Level'
import Messages from '../ui/Messages'
import ConvoUI from '../ui/ConvoUI'
import Transition from '../ui/Transition'

export default class extends Phaser.State {
	init(context) {
		console.log("context=", context)
	}

	create() {
		this.lastTime = 0
		this.lastDir = null
		this.gameState = {}
		this.level = null
		this.newPos = { x: 0, y: 0, z: 0 }

		// controls
		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		this.esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
		this.t_key = this.game.input.keyboard.addKey(Phaser.Keyboard.T)

		// ui (order matters)
		this.blocks = new Block(this)
		this.messages = new Messages(this)
		this.convoUi = new ConvoUI(this)
		this.transition = new Transition()

		// start game
		this.loadLevel("eldun")
	}

	update() {
		if(this.loading) return

		this.blocks.update()

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
				let sprite = this.blocks.findClosestObject(this.player.sprite, 6, (sprite) => sprite.npc != null)
				if(sprite) {
					this.level.npcs.forEach(npc => npc.creature.stand(npc.dir))
					this.convoUi.start(sprite.npc)
				}
			}
			if (this.space.justDown) {
				this.door = this.blocks.findClosestObject(this.player.sprite, 6, (sprite) => {
					return Config.DOORS.indexOf(sprite.name) >= 0
				})
				if (this.door) {
					console.log("Door open at " + this.door.gamePos)
					this.blocks.replace(this.door, Config.getOppositeDoor(this.door.name))
					updated = true
				}
			}

			if (updated) this.blocks.sort()
		}

		this.level.onLoad(this)
	}

	// todo: smooth/vector movement
	movePlayer() {
		let cursorKeyDown = this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.down.isDown || this.cursors.right.isDown
		let now = Date.now()
		if(now - this.lastTime > Config.SPEED && cursorKeyDown) {
			this.lastTime = now

			let [ox, oy, oz] = [this.px, this.py, this.pz]
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
					this.blocks.checkRoof(this.px - 1, this.py - 1, this.pz)
					if(dir) {
						this.lastDir = dir
						this.player.walk(dir)
					}
				} else {
					this.px = ox; this.py = oy
				}
			}

			if (ox != this.px || oy != this.py || oz != this.pz) {
				this.playerMoved()
				return true
			}
		}

		if(!cursorKeyDown) {
			if(this.player) {
				this.player.stand(this.lastDir)
			}
		}
		return false
	}

	tryStepTo(nx, ny, nz) {
		if(this.blocks.moveTo(this.player.sprite, nx, ny, nz, false, this.newPos)) {
			this.px = this.newPos.x
			this.py = this.newPos.y
			this.pz = this.newPos.z
			this.blocks.centerOn(this.player.sprite)
			return true
		} else {
			return false
		}
	}

	playerMoved() {
		let dst = this.level.checkBounds(this.px, this.py, this.blocks)
		if(dst) {
			this.transition.fadeIn(() => this.loadLevel(dst.map, dst.x, dst.y, true))
		}
	}

	loadLevel(mapName, startX, startY) {
		this.loading = true
		if(this.level) {
			this.blocks.destroy()
			this.level.destroy()
		}
		this.level = new Level(mapName)
		this.level.start(this, this.blocks, () => {
			this.px = startX || this.level.info.startPos[0]
			this.py = startY || this.level.info.startPos[1]
			this.pz= 0
			this.player = new Creature(this.game, "man", this.blocks, this.px, this.py, this.pz)
			this.player.stand(this.lastDir || Config.DIR_E)
			this.transition.fadeOut(() => {
				this.loading = false
			})
		})
	}

	narrate(message) {
		this.messages.showFirstLine(message)
	}
}