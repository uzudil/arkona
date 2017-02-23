import Phaser from "phaser"
import $ from "jquery"
import Block from "../world/Block"
import * as Config from "../config/Config"
import Creature from "../models/Creature"
import Level from "../models/Level"
import Messages from "../ui/Messages"
import ConvoUI from "../ui/ConvoUI"
import Transition from "../ui/Transition"
import InGameMenu from "../ui/InGameMenu"
import Lamp from "../ui/Lamp"
import * as Queue from "../actions/Queue"
import Stats from "stats.js"

export default class extends Phaser.State {
	constructor() {
		super()
		this.startFromSavedGame = false
	}

	init(context) {
		if(context && context["loadGame"]) {
			this.startFromSavedGame = context.loadGame
		}
	}

	create() {
		this.game.stage.backgroundColor = "#000000";
		this.lastTime = 0
		this.lastDir = null
		this.gameState = {}
		this.level = null
		this.overlayShowing = false
		this.actionQueue = new Queue.Queue(this)

		// controls
		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		this.esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
		this.t_key = this.game.input.keyboard.addKey(Phaser.Keyboard.T)

		// ui (order matters)
		this.blocks = new Block(this)
		this.lamp = new Lamp(this)
		this.messages = new Messages(this)
		this.convoUi = new ConvoUI(this)
		this.transition = new Transition()
		this.inGameMenu = new InGameMenu(this)

		if(document.location.hostname == "localhost") {
			this.stats = new Stats();
			this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
			this.phaserStatsPanel = this.stats.addPanel( new Stats.Panel( "SP", "#ff8", "#221" ) );
			document.body.appendChild(this.stats.dom);
		} else {
			this.stats = null
			this.phaserStatsPanel = null
		}

		// start game
		this.loadGame(this.startFromSavedGame)

		// for debug/hacking
		window.arkona = this
	}

	update() {
		if(this.stats) {
			this.stats.begin()
		}

		if(this.loading || !this.player) return

		this.blocks.update()

		if(!this.updateUI()) {
			// assemble the actions
			if(this.level.npcs) this.actionQueue.add(Queue.MOVE_NPC, this.level.npcs)
			if(this.level.generators) this.actionQueue.add(Queue.GENERATORS, this.level.generators)

			this.movePlayer()

			if (this.t_key.justDown) this.actionQueue.add(Queue.TALK)
			if (this.space.justDown) this.actionQueue.add(Queue.USE_OBJECT)

			// run the actions
			if(this.actionQueue.update()) {
				this.blocks.sort()
			}
		}

		this.level.onLoad(this)

		if(this.stats) {
			this.stats.end()
			this.phaserStatsPanel.update(this.world.camera.totalInView, this.stage.currentRenderOrderID)
		}
	}

	updateUI() {
		if(this.inGameMenu.visible) {
			if (this.esc.justDown) {
				this.inGameMenu.hide()
			}
			return true
		} else if(this.overlayShowing) {
			if (this.esc.justDown || this.space.justDown) {
				this.hideOverlay()
			}
			return true
		} else if(this.messages.group.visible) {
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
			if (this.esc.justDown) {
				this.inGameMenu.show()
				return true;
			}
			return false
		}
	}

	movePlayer() {
		if (this.isCursorKeyDown()) {
			let dir = this.getDirFromCursorKeys()
			if (dir != null) this.actionQueue.add(Queue.MOVE_PLAYER, dir)
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
			dir = "w"
		} else if (this.cursors.up.isDown && this.cursors.right.isDown) {
			dir = "n"
		} else if (this.cursors.down.isDown && this.cursors.right.isDown) {
			dir = "e"
		} else if (this.cursors.down.isDown && this.cursors.left.isDown) {
			dir = "s"
		} else if (this.cursors.up.isDown) {
				dir = "nw"
		} else if (this.cursors.down.isDown) {
			dir = "se"
		} else if (this.cursors.left.isDown) {
			dir = "sw"
		} else if (this.cursors.right.isDown) {
			dir = "ne"
		}
		return dir
	}

	/**
	 * The player just moved in this direction.
	 *
	 * @param dir the direction of the player's last step
	 */
	playerMoved(dir) {
		let [px, py, pz] = this.player.sprite.gamePos
		this.blocks.checkRoof(px - 1, py - 1, pz)
		if (dir != null) {
			this.lastDir = dir
			this.player.walk(dir)
		}
		let dst = this.level.checkBounds(this, px, py)
		if(dst) {
			this.transitionToLevel(dst.map, dst.x, dst.y, dst.dir)
		}
	}

	/**
	 * The player was just blocked by this sprite.
	 *
	 * @param sprite the sprite blocking the player
	 */
	playerBlockedBy(sprite) {
		let dst = this.level.checkPos(this, ...sprite.gamePos)
		if(dst) {
			this.transitionToLevel(dst.map, dst.x, dst.y, dst.dir)
			return true
		}
		return false
	}

	transitionToLevel(mapName, startX, startY, startDir) {
		this.transition.fadeIn(() => {
			if(!this.loading) {
				this.loadLevel(mapName, startX, startY, startDir)
			}
		})
	}

	loadLevel(mapName, startX, startY, startDir) {
		this.loading = true
		if(this.level) {
			this.blocks.destroy()
			this.level.destroy()
		}
		this.level = new Level(mapName)
		this.level.start(this, () => {
			this.player = new Creature(this.game, "man", this.blocks,
				startX == null ? this.level.info.startPos[0] : startX,
				startY == null ? this.level.info.startPos[1] : startY,
				0)
			this.player.sprite.userControlled = true
			this.player.animationSpeed = 16
			let dir = startDir || this.level.info["startDir"]
			if(dir) this.lastDir = dir
			this.player.stand(dir || this.lastDir || Config.DIR_E)
			this.player.centerOn()
			this.lamp.setVisible(this.level.info["lamplight"]);
			this.saveGame()
			this.transition.fadeOut(() => {
				this.loading = false
			})
		})
	}

	static doesSaveGameExist() {
		return window.localStorage["arkona"] != null
	}

	/**
	 * Save the game. This currently only saves player state not level state.
	 */
	saveGame() {
		window.localStorage["arkona"] = JSON.stringify({
			version: 1,
			level: this.level.name,
			pos: this.player.sprite.gamePos,
			dir: this.lastDir,
			state: this.gameState
		})
	}

	/**
	 * Load the game. This currently only loads player state not level state.
	 */
	loadGame(startFromSavedGame) {
		if(startFromSavedGame) {
			let savegameStr = window.localStorage["arkona"]
			if (savegameStr) {
				let savegame = JSON.parse(savegameStr)
				if (savegame) {
					this.gameState = savegame.state
					this.loadLevel(savegame.level, savegame.pos[0], savegame.pos[1], savegame.dir)
					return
				}
			}
		}
		this.loadLevel(Config.START_MAP)
	}

	narrate(message) {
		this.messages.showFirstLine(message)
	}

	showOverlay(image, message) {
		let overlay = $("#overlay")
		$("img", overlay).attr("src", "/assets/images/" + image + ".png")
		$(".text", overlay).text(message ? message : "")
		overlay.show()
		$("#overlay-shadow").show();
		this.overlayShowing = true
	}

	hideOverlay() {
		let overlay = $("#overlay")
		overlay.hide()
		$("#overlay-shadow").hide();
		this.overlayShowing = false
	}

	moveInDir(x, y, z, dir, speed) {
		let d = this.game.time.elapsedMS / (60 * speed)
		// smooth movement, fallback to a delta of 1 if can't maintain fps
		let dx = Math.max(-1, Math.min(1, Config.MOVE_DELTA[dir][0] * d))
		let dy = Math.max(-1, Math.min(1, Config.MOVE_DELTA[dir][1] * d))
		return [x + dx, y + dy, z]
	}
}