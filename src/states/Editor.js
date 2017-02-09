import Phaser from "phaser"
import Block, { isFlat } from "../world/Block"
import {getRandom} from "../utils"
import * as Config from "../config/Config"
import Palette from "../editor/Palette"
import $ from "jquery"

export default class extends Phaser.State {

	init() {
	}

	preload() {
		document.getElementById("new-map").onclick = () => {
			$("#new-map-dialog").show()
			$("#new-map-name").focus()
		}
		$("#new-map-cancel").click(() => $("#new-map-dialog").hide())
		$("#new-map-ok").click(() => {
			$("#new-map-dialog").hide()
			this.blocks.name = $("#new-map-name").val()
			let w = parseInt($("#new-map-width").val(), 10)
			let h = parseInt($("#new-map-height").val(), 10)
			// ensure they're multiples of Config.GRID_SIZE
			w = w % Config.GRID_SIZE == 0 ? w : (((w / Config.GRID_SIZE) | 0) + 1) * Config.GRID_SIZE
			h = h % Config.GRID_SIZE == 0 ? h : (((h / Config.GRID_SIZE) | 0) + 1) * Config.GRID_SIZE
			this.startNewMap(this.blocks.name, w, h, $("#new-map-type").val())
		})

		document.getElementById("save-map").onclick = () => {
			this.blocks.name = prompt("Map name:", this.blocks.name)
			this.blocks.fixEdges()
			this.blocks.save()
			//let save = $("#save-map")
			//save.attr("download", this.blocks.name + ".json")
			//save.attr("href", "data:text/json;charset=utf-8," + encodeURIComponent(this.blocks.save()))
		}
		document.getElementById("load-map").onclick = () => {
			this.blocks.load(prompt("Map name:", this.blocks.name))
		}
		$(".toggle-roof").click((event) => this.blocks.toggleRoof($(event.currentTarget).data("height")))
		document.getElementById("fix-edges").onclick = () => {
			this.blocks.fixEdges()
		}
	}

	create() {
		this.blocks = new Block(this, true)
		this.blocks.newMap("demo", 40, 40, "grass")

		this.activeBlock = null
		this.palette = new Palette(this)

		var style = {font: "bold 14px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top"};

		//  The Text is positioned at 0, 100
		this.posLabel = this.game.add.text(0, 0, "Pos: ", style);
		this.posLabel.setShadow(1, 1, "rgba(0,0,0,1)", 2);
		this.posLabel.setTextBounds(0, 0, 800, 20);

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.ground1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE)
		this.ground2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO)
		this.ground3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE)
		this.ground4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR)
		this.ground5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE)
		this.ground6 = this.game.input.keyboard.addKey(Phaser.Keyboard.SIX)
		this.ground7 = this.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN)
		this.ground8 = this.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT)
		this.ground9 = this.game.input.keyboard.addKey(Phaser.Keyboard.NINE)
		this.tree = this.game.input.keyboard.addKey(Phaser.Keyboard.T)
		this.tree2 = this.game.input.keyboard.addKey(Phaser.Keyboard.Y)
		this.mountain = this.game.input.keyboard.addKey(Phaser.Keyboard.M)
		this.delete = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
		this.esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
		this.dungeon = this.game.input.keyboard.addKey(Phaser.Keyboard.N)
	}

	render() {
	}

	setActiveBlock(name) {
		if (this.activeBlock) this.activeBlock.destroy()
		if(name) {
			let [x, y, z] = this.blocks.toWorldCoords(this.game.input.x, this.game.input.y)
			this.activeBlock = this.blocks.set(name, x, y, z, true)
		} else {
			this.activeBlock = null
		}
		this.addNew = false
	}

	moveCamera() {
		if (this.cursors.up.isDown) {
			this.blocks.move(0, Config.GRID_SIZE)
		} else if (this.cursors.down.isDown) {
			this.blocks.move(0, -Config.GRID_SIZE)
		}

		if (this.cursors.left.isDown) {
			this.blocks.move(Config.GRID_SIZE, 0)
		} else if (this.cursors.right.isDown) {
			this.blocks.move(-Config.GRID_SIZE, 0)
		}
	}

	drawDungeon() {
		// find the starting point
		if (this.dungeon.justDown) {
			for (let xx = 0; xx < this.blocks.w; xx += Config.GROUND_TILE_W) {
				for (let yy = 0; yy < this.blocks.h; yy += Config.GROUND_TILE_H) {
					if (this.blocks.getFloor(xx, yy) == "dungeon.floor") {
						this._drawDungeonAt(xx, yy, {})
						this.blocks.sort()
						return
					}
				}
			}
		}
	}

	_drawDungeonAt(x, y, seen) {
		if(!seen[x + "." + y]) {
			seen[x + "." + y] = true

			let dungeonFloorName = "dungeon.floor"
			for (let xx = x - Config.GROUND_TILE_W; xx < x; xx++) {
				for (let yy = y - Config.GROUND_TILE_H; yy < y; yy++) {
					this.blocks.clear("dungeon.col.nw", xx + 1, yy + 1, 0)
				}
			}

			let w = this.blocks.getFloor(x - Config.GROUND_TILE_W, y) == dungeonFloorName
			let e = this.blocks.getFloor(x + Config.GROUND_TILE_W, y) == dungeonFloorName
			let n = this.blocks.getFloor(x, y - Config.GROUND_TILE_W) == dungeonFloorName
			let s = this.blocks.getFloor(x, y + Config.GROUND_TILE_W) == dungeonFloorName
			let nw = this.blocks.getFloor(x - Config.GROUND_TILE_W, y - Config.GROUND_TILE_W) == dungeonFloorName
			let ne = this.blocks.getFloor(x + Config.GROUND_TILE_W, y - Config.GROUND_TILE_W) == dungeonFloorName
			let sw = this.blocks.getFloor(x - Config.GROUND_TILE_W, y + Config.GROUND_TILE_W) == dungeonFloorName
			let se = this.blocks.getFloor(x + Config.GROUND_TILE_W, y + Config.GROUND_TILE_W) == dungeonFloorName

			console.warn("pos=" + x + "," + y + " n=" + n + " s=" + s + " e=" + e + " w=" + w + " nw=" + nw + " ne=" + ne + " sw=" + sw + " se=" + se)

			if (w && e && n && s && nw && ne && sw && se) {
				// nada
			} else if (w && e && n && s && !nw && ne && sw && se) {
				console.warn("nw")
				this.blocks.set("dungeon.col.nw", x - Config.GROUND_TILE_W + 1, y - Config.GROUND_TILE_H + 1, 0)
			} else if (w && e && n && s && nw && !ne && sw && se) {
				console.warn("ne")
				this.blocks.set("dungeon.col.nw", x, y - Config.GROUND_TILE_H + 1, 0)
			} else if (w && e && n && s && nw && ne && sw && !se) {
				console.warn("se")
				this.blocks.set("dungeon.col.nw", x, y, 0)
			} else if (w && e && n && s && nw && ne && !sw && se) {
				console.warn("sw")
				this.blocks.set("dungeon.col.nw", x - Config.GROUND_TILE_W + 1, y, 0)
			} else if (!w && n && s) {
				console.warn("w")
				this.blocks.set("dungeon.w.4", x - Config.GROUND_TILE_W + 1, y, 0)
			} else if (!e && n && s) {
				console.warn("e")
				this.blocks.set("dungeon.e.4", x, y, 0)
			} else if (w && e && !n) {
				console.warn("n")
				this.blocks.set("dungeon.n.4", x, y - Config.GROUND_TILE_H + 1, 0)
			} else if (w && e && !s) {
				console.warn("s")
				this.blocks.set("dungeon.s.4", x, y, 0)
			} else if (e && s) {
				console.warn("e+s")
				this.blocks.set("dungeon.col.se", x - Config.GROUND_TILE_W + 1, y - Config.GROUND_TILE_H + 1, 0)
				this.blocks.set("dungeon.n.3", x, y - Config.GROUND_TILE_H + 1, 0)
				this.blocks.set("dungeon.w.3", x - Config.GROUND_TILE_W + 1, y, 0)
			} else if (e && n) {
				console.warn("e+n")
				this.blocks.set("dungeon.col.se", x - Config.GROUND_TILE_W + 1, y, 0)
				this.blocks.set("dungeon.s.3", x, y, 0)
				this.blocks.set("dungeon.w.3", x - Config.GROUND_TILE_W + 1, y - 1, 0)
			} else if (w && n) {
				console.warn("w+n")
				this.blocks.set("dungeon.col.se", x, y, 0)
				this.blocks.set("dungeon.s.3", x - 1, y, 0)
				this.blocks.set("dungeon.e.3", x, y - 1, 0)
			} else if (w && s) {
				console.warn("e+n")
				this.blocks.set("dungeon.col.se", x, y - Config.GROUND_TILE_H + 1, 0)
				this.blocks.set("dungeon.n.3", x - 1, y - Config.GROUND_TILE_H + 1, 0)
				this.blocks.set("dungeon.e.3", x, y, 0)
			}

			if (w) this._drawDungeonAt(x - Config.GROUND_TILE_W, y, seen)
			if (e) this._drawDungeonAt(x + Config.GROUND_TILE_W, y, seen)
			if (n) this._drawDungeonAt(x, y - Config.GROUND_TILE_W, seen)
			if (s) this._drawDungeonAt(x, y + Config.GROUND_TILE_W, seen)
			if (nw) this._drawDungeonAt(x - Config.GROUND_TILE_W, y - Config.GROUND_TILE_W, seen)
			if (ne) this._drawDungeonAt(x + Config.GROUND_TILE_W, y - Config.GROUND_TILE_W, seen)
			if (sw) this._drawDungeonAt(x - Config.GROUND_TILE_W, y + Config.GROUND_TILE_W, seen)
			if (se) this._drawDungeonAt(x + Config.GROUND_TILE_W, y + Config.GROUND_TILE_W, seen)
		}
	}

	drawGround(x, y) {
		let gx = ((x / Config.GROUND_TILE_W) | 0) * Config.GROUND_TILE_W
		let gy = ((y / Config.GROUND_TILE_H) | 0) * Config.GROUND_TILE_H

		let ground = null
		if (this.ground1.isDown) {
			ground = "grass"
		} else if (this.ground2.isDown) {
			ground = "mud"
		} else if (this.ground3.isDown) {
			ground = "sand"
		} else if (this.ground4.isDown) {
			ground = "moss"
		} else if (this.ground5.isDown) {
			ground = "water"
		} else if (this.ground6.isDown) {
			ground = "road"
		} else if (this.ground7.isDown) {
			ground = "scree"
		} else if (this.ground8.isDown) {
			ground = "bramble"
		} else if (this.ground9.isDown) {
			ground = "lava"
		}

		if (ground) {
			this.blocks.clear("grass", gx, gy, 0)
			this.blocks.set(ground, gx, gy, 0)
		}
	}

	drawObject(x, y) {
		if ((this.tree.isDown || this.tree2.isDown) && this.blocks.isFree(x, y, 0, 4, 4, 8)) {
			if(this.tree2.isDown) {
				this.blocks.clear("trunk.wide", x, y, 0)
				this.blocks.set("trunk.wide", x, y, 0)
			} else {
				this.blocks.clear("trunk", x, y, 0)
				this.blocks.set("trunk", x, y, 0)
			}

			let name = getRandom([...Array(4).fill("oak"), ...Array(3).fill("pine"), "brown"])
			this.blocks.clear(name, x, y, 4)
			this.blocks.set(name, x, y, 4)
			this.blocks.sort()
		} else if (this.mountain.isDown && this.blocks.isFree(x, y, 0, 4, 4, 8)) {
			let name = getRandom([...Array(3).fill("mountain1"), ...Array(3).fill("mountain3"), "mountain2"])
			this.blocks.clear(name, x, y, 0)
			this.blocks.set(name, x, y, 0)
			this.blocks.sort()
		}
	}

	update() {
		this.blocks.update()

		if ($(".dialog").is(":visible")) {
			this.game.input.enabled = false;
			return
		} else {
			this.game.input.enabled = true;
		}

		if (this.esc.justDown && this.activeBlock) {
			this.setActiveBlock(null)
		}

		this.moveCamera()

		// find the top object under the mouse
		this.blocks.highlight(this.blocks.getTopSpriteAt(this.game.input.x, this.game.input.y))

		// find new top z
		let [x, y, z] = this.blocks.toWorldCoords(this.game.input.x, this.game.input.y)
		z = this.blocks.getTopAt(x, y, this.activeBlock)

		if (this.blocks.isInBounds(x, y)) {
			this.drawGround(x, y)
			this.drawObject(x, y)
			this.drawDungeon()
			if (this.delete.justDown) {
				if(this.blocks.highlightedSprite) {
					this.blocks.clearSprite(this.blocks.highlightedSprite)
				} else {
					// stamps are hard to clean...
					let found = false
					for (let xx = -4; xx < 4; xx++) {
						for (let yy = -4; yy < 4; yy++) {
							let b = this.blocks.clear("ashes.big", x - 1 + xx, y - 1 + xx, 0)
							if(b) found = true
						}
					}
					// clear ground
					if(!found) {
						for (let xx = -4; xx < 4; xx++) {
							for (let yy = -4; yy < 4; yy++) {
								this.blocks.clear("grass", x - 1 + xx, y - 1 + xx, 0)
							}
						}
					}
				}
			}
		}

		this.blocks.drawCursor(x, y, z)

		if (this.activeBlock) {
			// handle click
			if (this.game.input.activePointer.isDown && this.addNew && this.blocks.isInBounds(x, y)) {
				if (isFlat(this.activeBlock)) {
					if(!this.blocks.isStamp(this.activeBlock.name)) {
						this.blocks.clear("grass", x, y, 0)
					}
					this.blocks.set(this.activeBlock.name, x, y, 0)
				} else {
					this.blocks.set(this.activeBlock.name, x, y, z)
				}

				z = this.blocks.getTopAt(x, y, this.activeBlock)
				this.addNew = false // only add one
			}
			if (!this.game.input.activePointer.isDown) this.addNew = true

			// move active block to new position
			this.blocks.moveTo(this.activeBlock, x, y, z, true)

			this.blocks.sort()
		}
		this.posLabel.text = "Pos: " + x + "," + y + "," + z
	}

	startNewMap(name, w, h, type) {
		this.blocks.newMap(name, w, h, type)
	}
}
