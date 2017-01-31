/* globals __DEV__ */
import Phaser from 'phaser'
import Block from '../world/Block'
import * as Config from '../config/Config'
import Creature from '../models/Creature'
import Level from '../models/Level'
import Messages from '../ui/Messages'
import ConvoUI from '../ui/ConvoUI'
import Transition from '../ui/Transition'
import * as Queue from '../actions/Queue'

export default class extends Phaser.State {
	init(context) {
		console.log("context=", context)
	}

	create() {
		this.lastTime = 0
		this.lastDir = null
		this.gameState = {}
		this.level = null
		this.actionQueue = new Queue.Queue(this)

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
		if(this.loading || !this.player) return

		this.blocks.update()

		if(!this.updateUI()) {
			// assemble the actions
			let npcs = this.level.getActiveNpcs()
			if(npcs) this.actionQueue.add(Queue.MOVE_NPC, npcs)

			this.movePlayer()

			if (this.t_key.justDown) this.actionQueue.add(Queue.TALK)
			if (this.space.justDown) this.actionQueue.add(Queue.OPEN_DOOR)

			// run the actions
			if(this.actionQueue.update()) {
				this.blocks.sort()
			}
		}

		this.level.onLoad(this)
	}

	updateUI() {
		if(this.messages.group.visible) {
			if (this.space.justDown) {
				this.messages.showNextLine()
			}
			return true
		} else if(this.convoUi.group.visible) {
			if (this.esc.justDown) {
				this.convoUi.end()
			} else if (this.space.justDown) {
				this.convoUi.select()
			} else if (this.cursors.up.justDown) {
				this.convoUi.change(-1)
			} else if (this.cursors.down.justDown) {
				this.convoUi.change(1)
			}
			return true
		} else {
			return false
		}
	}

	movePlayer() {
		if (this.isCursorKeyDown()) {
			if (this.game.time.elapsedSince(this.lastTime) > Config.SPEED) {
				this.lastTime = this.game.time.time
				let dir = this.getDirFromCursorKeys()
				if (dir != null) this.actionQueue.add(Queue.MOVE_PLAYER, dir)
			}
		} else {
			this.player.stand(this.lastDir)
		}
	}

	isCursorKeyDown() {
		return this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.down.isDown || this.cursors.right.isDown
	}

	getDirFromCursorKeys() {
		let dir = null
		if (this.cursors.up.isDown && this.cursors.left.isDown) {
			dir = 'w'
		} else if (this.cursors.up.isDown && this.cursors.right.isDown) {
			dir = 'n'
		} else if (this.cursors.down.isDown && this.cursors.right.isDown) {
			dir = 'e'
		} else if (this.cursors.down.isDown && this.cursors.left.isDown) {
			dir = 's'
		} else if (this.cursors.up.isDown) {
				dir = 'nw'
		} else if (this.cursors.down.isDown) {
			dir = 'se'
		} else if (this.cursors.left.isDown) {
			dir = 'sw'
		} else if (this.cursors.right.isDown) {
			dir = 'ne'
		}
		return dir
	}

	playerMoved(dir) {
		let [px, py, pz] = this.player.sprite.gamePos
		this.blocks.checkRoof(px - 1, py - 1, pz)
		if (dir != null) {
			this.lastDir = dir
			this.player.walk(dir)
		}
		let dst = this.level.checkBounds(px, py, this.blocks)
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
			this.player = new Creature(this.game, "man", this.blocks,
				startX || this.level.info.startPos[0],
				startY || this.level.info.startPos[1],
				0)
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