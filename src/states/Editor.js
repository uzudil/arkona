/* globals __DEV__ */
import Phaser from 'phaser'
import Block from '../world/Block'
import {getRandom} from '../utils'
import * as Config from '../config/Config'
import Palette from '../editor/Palette'
import $ from 'jquery'

export default class extends Phaser.State {
  init () {}
  preload () {
    document.getElementById("new-map").onclick = () => {
      this.blocks.name = prompt("Map name:", this.blocks.name)
      let [w, h] = prompt("New map size:", "40x40").split("x").map(s => parseInt(s, 10))
      // ensure they're multiples of Config.GRID_SIZE
      w = w % Config.GRID_SIZE == 0 ? w : (((w / Config.GRID_SIZE)|0) + 1) * Config.GRID_SIZE
      h = h % Config.GRID_SIZE == 0 ? h : (((h / Config.GRID_SIZE)|0) + 1) * Config.GRID_SIZE
      this.startNewMap(this.blocks.name, w, h)
    }
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
  }

  create () {
    this.blocks = new Block(this)
    this.blocks.newMap("demo", 40, 40)

    for(let x = 0; x < 40; x += 4) {
      for(let y = 0; y < 40; y += 4) {
        if (Math.random() > 0.2) this.blocks.addTree(getRandom(["oak", "brown", "pine"]), x, y, 0)
      }
    }

    this.blocks.sort()

    this.activeBlock = null
    this.palette = new Palette(this)

    var style = { font: "bold 14px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top" };

    //  The Text is positioned at 0, 100
    this.posLabel = game.add.text(0, 0, "Pos: ", style);
    this.posLabel.setShadow(1, 1, 'rgba(0,0,0,1)', 2);
    this.posLabel.setTextBounds(0, 0, 800, 20);

    if(Config.DEBUG_COORDS) {
      this.anchorDebug = this.game.add.graphics(0, 0)
      this.anchorDebug.anchor.setTo(0.5, 0.5)
      this.anchorDebug.beginFill(0xFF33ff)
      this.anchorDebug.drawRect(0, 0, Config.GRID_SIZE, Config.GRID_SIZE)
      this.anchorDebug.endFill()
    }

    this.cursors = this.game.input.keyboard.createCursorKeys()
  }

  render () {
  }

  setActiveBlock(name) {
    if(this.activeBlock) this.activeBlock.destroy()

    let [x, y, z] = this.blocks.toWorldCoords(this.game.input.x, this.game.input.y)
    this.activeBlock = this.blocks.addSprite(name, x, y, z, true)
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

  update () {
    this.moveCamera()

    // find new top z
    let [x, y, z] = this.blocks.toWorldCoords(this.game.input.x, this.game.input.y)
    z = this.blocks.getTopAt(x, y, this.activeBlock)

    if(this.activeBlock) {

      if(Config.DEBUG_COORDS) {
        let [sx, sy] = this.blocks.toScreenCoords(x, y, 0)
        this.anchorDebug.x = sx
        this.anchorDebug.y = sy
      }

      // handle click
      if(this.game.input.activePointer.isDown && this.addNew) {
        let newSprite
        if(this.blocks.isFlat(this.activeBlock)) {
          newSprite = this.blocks.addFloor(this.activeBlock.name, x, y)
        } else {
          newSprite = this.blocks.addSprite(this.activeBlock.name, x, y, z)
        }
        //this.blocks.debugSprite(newSprite)

        z = this.blocks.getTopAt(x, y, this.activeBlock)
        this.addNew = false // only add one
      }
      if(!this.game.input.activePointer.isDown) this.addNew = true

      // move active block to new position
      this.blocks.setSprite(this.activeBlock, x, y, z, true)

      this.blocks.sort()
    }
    this.posLabel.text = "Pos: " + x + "," + y + "," + z
  }

  startNewMap(w, h) {
    this.blocks.newMap(w, h)
  }
}
