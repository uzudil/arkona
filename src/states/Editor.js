/* globals __DEV__ */
import Phaser from 'phaser'
import Block, { isFlat } from '../world/Block'
import {getRandom} from '../utils'
import * as Config from '../config/Config'
import Palette from '../editor/Palette'
import $ from 'jquery'

export default class extends Phaser.State {
  init () {}
  preload () {
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
      w = w % Config.GRID_SIZE == 0 ? w : (((w / Config.GRID_SIZE)|0) + 1) * Config.GRID_SIZE
      h = h % Config.GRID_SIZE == 0 ? h : (((h / Config.GRID_SIZE)|0) + 1) * Config.GRID_SIZE
      this.startNewMap(this.blocks.name, w, h, $("#new-map-type").val())
    })

    document.getElementById("save-map").onclick = () => {
      this.blocks.name = prompt("Map name:", this.blocks.name)
      let save = $("#save-map")
      save.attr("download", this.blocks.name + ".json")
      save.attr("href", "data:text/json;charset=utf-8," + encodeURIComponent(this.blocks.save()))
    }
    document.getElementById("load-map").onclick = () => {
      this.blocks.name = prompt("Map name:", this.blocks.name)
      this.blocks.load()
    }
    document.getElementById("toggle-roof").onclick = () => {
      this.blocks.toggleRoof()
    }
  }

  create () {
    this.blocks = new Block(this)
    this.blocks.newMap("demo", 40, 40, "grass")

    this.activeBlock = null
    this.palette = new Palette(this)

    var style = { font: "bold 14px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top" };

    //  The Text is positioned at 0, 100
    this.posLabel = game.add.text(0, 0, "Pos: ", style);
    this.posLabel.setShadow(1, 1, 'rgba(0,0,0,1)', 2);
    this.posLabel.setTextBounds(0, 0, 800, 20);

    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.ground1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    this.ground2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO)
    this.ground3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE)
    this.ground4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR)
    this.ground5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE)
    this.ground6 = this.game.input.keyboard.addKey(Phaser.Keyboard.SIX)
    this.tree = this.game.input.keyboard.addKey(Phaser.Keyboard.T)
    this.delete = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
  }

  render () {
  }

  setActiveBlock(name) {
    if(this.activeBlock) this.activeBlock.destroy()

    let [x, y, z] = this.blocks.toWorldCoords(this.game.input.x, this.game.input.y)
    this.activeBlock = this.blocks.set(name, x, y, z, true)
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

  drawGround(x, y) {
    let gw = Config.BLOCKS['grass'].size[0]
    let gh = Config.BLOCKS['grass'].size[1]
    let gx = ((x / gw)|0) * gw
    let gy = ((y / gh)|0) * gh

    let ground = null
    if (this.ground1.isDown) {
      ground = "grass"
    } else if(this.ground2.isDown) {
      ground = "mud"
    } else if(this.ground3.isDown) {
      ground = "sand"
    } else if(this.ground4.isDown) {
      ground = "moss"
    } else if(this.ground5.isDown) {
      ground = "water"
    } else if(this.ground6.isDown) {
      ground = "road"
    }

    if(ground) {
      this.blocks.clear("grass", gx, gy, 0)
      this.blocks.set(ground, gx, gy, 0)
      for(let xx = -1; xx <= 1; xx++) {
        for(let yy = -1; yy <= 1; yy++) {
          this.drawGroundEdges(gx + xx * gw, gy + yy * gh, ground)
        }
      }
    }
  }

  drawGroundEdges(gx, gy, ground) {
    if(!this.blocks.isGrass(gx, gy) && this.blocks.isInBounds(gx, gy)) {
      let gw = Config.BLOCKS['grass'].size[0]
      let gh = Config.BLOCKS['grass'].size[1]
      let n = this.blocks.isGrass(gx, gy - gh)
      let s = this.blocks.isGrass(gx, gy + gh)
      let w = this.blocks.isGrass(gx - gw, gy)
      let e = this.blocks.isGrass(gx + gw, gy)

      //console.log("n=" + n + " s=" + s + " w=" + w + " e=" + e)

      let index = ground == 'water' ? 3 : 1 + ((Math.random() * 2)|0)
      this.blocks.clear("grass.edge1.n", gx - 1, gy - 3, 0)
      if (n) this.blocks.set("grass.edge" + index + ".n", gx - 1, gy - 3, 0)
      this.blocks.clear("grass.edge1.n", gx - 1, gy + 1, 0)
      if (s) this.blocks.set("grass.edge" + index + ".s", gx - 1, gy + 1, 0)
      this.blocks.clear("grass.edge1.n", gx + 1, gy - 1, 0)
      if (e) this.blocks.set("grass.edge" + index + ".e", gx + 1, gy - 1, 0)
      this.blocks.clear("grass.edge1.n", gx - 3, gy - 1, 0)
      if (w) this.blocks.set("grass.edge" + index + ".w", gx - 3, gy - 1, 0)
    }
  }

  drawObject(x, y, z) {
    if(this.tree.isDown && this.blocks.isFree(x, y, 0, 4, 4, 8)) {
      this.blocks.clear("trunk", x, y, 0)
      this.blocks.set("trunk", x, y, 0)
      let name = getRandom([...Array(4).fill("oak"), ...Array(3).fill("pine"), "brown"])
      this.blocks.clear(name, x, y, 4)
      this.blocks.set(name, x, y, 4)
      this.blocks.sort()
    }
  }

  update () {
    if ($(".dialog").is(":visible")) {
      game.input.enabled = false;
      return
    } else {
      game.input.enabled = true;
    }

    this.moveCamera()

    // find new top z
    let [x, y, z] = this.blocks.toWorldCoords(this.game.input.x, this.game.input.y)
    z = this.blocks.getTopAt(x, y, this.activeBlock)

    if(this.blocks.isInBounds(x, y)) {
      this.drawGround(x, y)
      this.drawObject(x, y, z)
      if(this.delete.justDown) {
        this.blocks.clearAll(x - 1, y - 1)
      }
    }

    this.blocks.drawCursor(x, y, z)

    if(this.activeBlock) {
      // handle click
      if(this.game.input.activePointer.isDown && this.addNew && this.blocks.isInBounds(x, y)) {
        let newSprite
        if(isFlat(this.activeBlock)) {
          newSprite = this.blocks.set(this.activeBlock.name, x, y, 0)
        } else {
          newSprite = this.blocks.set(this.activeBlock.name, x, y, z)
        }

        z = this.blocks.getTopAt(x, y, this.activeBlock)
        this.addNew = false // only add one
      }
      if(!this.game.input.activePointer.isDown) this.addNew = true

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
